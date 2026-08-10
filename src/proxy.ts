import { NextResponse, type NextRequest } from "next/server"
import {
  NO_ORG_HOST,
  PROTOCOL,
  ROOT_HOST,
  isAppHost,
  isNoOrgHost,
  orgFromHost,
  rootUrl,
} from "@/lib/host"
import { DEFAULT_ORG, DOMAINS, defaultDomain, orgBySlug, orgHref } from "@/lib/scope"

/**
 * What to do with a hostname that isn't one of the workspaces.
 *
 * `proxy.ts`, not `middleware.ts` — Next 16 renamed the convention and warns on
 * the old name. Same file, same signature, same matcher; only the export and the
 * filename changed.
 *
 * One rule underneath all of it: **a URL says which workspace and which app, and
 * the two agree or you are moved until they do.**
 *
 *   workspace host, an app        the ordinary case. Served.
 *   workspace host, bare path     to that workspace's own first app, since every
 *                                 screen in the product belongs to one
 *   a retired URL                 two schemes have been left behind here: the
 *                                 original `/<org>/<app>/…` on a single host,
 *                                 and the app-as-subdomain that briefly replaced
 *                                 it. Both are recognisable and both redirect
 *   the bare domain               to the no-workspace host, one label up
 *   any other hostname            404. It is not an address this app has
 *
 * The legacy redirects are the part worth keeping. Without them a change of URL
 * scheme is a silent break for everybody holding a link, and the failure — a 404
 * on a page you had open yesterday — says nothing about where it went.
 *
 * That last row used to be a redirect too, and turning it into a 404 is the one
 * substantive change here. A redirect can only help a hostname that has
 * somewhere to go; pointed at an address the browser is already on, it is a
 * loop. See the branch itself for how that happened, and `REDIRECT` below for
 * why a dev server should not be handing out permanent ones while it is being
 * decided.
 */

/** The apps, as a set, for recognising a segment or a label that names one. */
const APP_SLUGS = new Set(DOMAINS.map((domain) => domain.slug))

const DEV = process.env.NODE_ENV === "development"

/**
 * 308 deployed, 307 in development.
 *
 * The moves below are permanent and 308 is what says so to a crawler and to a
 * browser's disk cache. That is right in front of users and wrong in front of a
 * URL scheme still being decided, which is what a dev server is.
 *
 * A permanent redirect is cached indefinitely and *not re-asked*. Two schemes
 * have already been retired in this file; each one left a 308 sitting in every
 * browser that had visited it, still being answered from disk by a server that
 * no longer agrees. The result is a loop that survives restarting the server,
 * editing this file, and doing what the error page suggests and clearing the
 * cookies — because cookies were never what was holding it.
 *
 * It also survives a hard reload, which is the part that makes it expensive to
 * diagnose. The redirect cache is not the resource cache: the move happens
 * *before* a document is fetched, so `Cmd+Shift+R` — which reloads the document
 * and its subresources — never reaches the thing serving it. A private window
 * works, an ordinary one does not, and nothing about that points at the cache.
 */
const REDIRECT = DEV ? 307 : 308

/**
 * A redirect the browser is allowed to forget, which in development it must be.
 *
 * `no-store` is belt and braces over the 307. A 307 is not cacheable unless a
 * header says it is, but "not cacheable by default" is a statement about
 * defaults, and what is being defended against is a browser still holding an
 * answer this file has since changed its mind about. `no-store` says it with no
 * defaults involved.
 */
function moved(url: string) {
  const response = NextResponse.redirect(new URL(url), REDIRECT)
  if (DEV) response.headers.set("cache-control", "no-store")
  return response
}

/**
 * A hostname that names nothing here.
 *
 * Plain text with the address that *does* work, rather than the app's own 404 —
 * the page is not the thing that is missing, the host is, and rendering a
 * workspace's not-found page would need a workspace to render it in. The one
 * fact worth putting on screen is where to go instead, since the whole failure
 * is being at the wrong address.
 */
const noSuchHost = (host: string | null) =>
  new NextResponse(
    `No workspace at ${host ?? "this address"}.\n\nThis app is served from ${rootUrl()}\n`,
    {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        // A 404 is cacheable by default too, and a stale one is the same problem
        // as a stale redirect wearing a different number: point the root host at
        // something else and the old answer keeps being given for a hostname
        // that now works.
        ...(DEV ? { "cache-control": "no-store" } : {}),
      },
    },
  )

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = request.headers.get("host")
  const org = orgFromHost(host)
  const [first, second, ...rest] = pathname.split("/").filter(Boolean)

  // ── On a workspace ─────────────────────────────────────────────────────────
  if (org) {
    // A path leading with this workspace's own slug is the original scheme —
    // `/<org>/<app>/…` — arriving on a host that scheme predates. The workspace
    // is in the hostname now, so the segment is redundant and comes off.
    if (first === org.slug) {
      const path = `/${[second, ...rest].filter(Boolean).join("/")}`
      return moved(`${PROTOCOL}://${host}${path}${search}`)
    }

    // No app named at all. Every screen is a screen of one, so this hands over
    // to the workspace's own first — never a global default, which could name an
    // app this workspace hasn't bought.
    if (!first) {
      return moved(`${PROTOCOL}://${host}${orgHref(defaultDomain(org))}${search}`)
    }

    return NextResponse.next()
  }

  // ── The app-as-subdomain scheme, briefly live and now retired ──────────────
  //
  // `operations.host/company-1/projects` → `company-1.host/operations/projects`.
  // Recognised by the subdomain naming an app rather than a workspace, and the
  // path leading with a workspace: the two labels simply trade places.
  const label = host?.toLowerCase().replace(/\.$/, "").split(".")[0]
  const staleApp = label && APP_SLUGS.has(label) ? label : undefined
  const named = first ? orgBySlug(first) : undefined
  if (staleApp && named) {
    const path = `/${[staleApp, second, ...rest].filter(Boolean).join("/")}`
    return moved(`${PROTOCOL}://${named.slug}.${ROOT_HOST}${path}${search}`)
  }

  // ── Not a workspace: the no-workspace host, or a hostname that means nothing
  //
  // Every hostname that isn't a workspace used to be redirected here to the
  // no-workspace host, on the reasoning that one URL should serve the picker.
  // That is right about the picker and wrong about the redirect, and the way it
  // was wrong is worth keeping written down.
  //
  // **An absolute `Location` on the server's own origin does not stay
  // absolute.** Next relativises it — `http://localhost:3000/x` leaves as `/x` —
  // and locally the no-workspace host *is* that origin, so this branch emitted a
  // bare path on whatever hostname the request arrived on. Reach it from
  // `localhost:3000` and the path is the one it meant, so nothing looked wrong
  // for as long as that was the only way in. Reach it from anything else — a LAN
  // address, a `nip.io` name, a mistyped subdomain — and the browser is told to
  // go to the URL it is already on, permanently. That is `ERR_TOO_MANY_REDIRECTS`,
  // and the address bar still shows the host you asked for, which is what makes
  // it read as a cookie problem rather than a routing one.
  //
  // So a hostname is only redirected when the redirect can actually move it, and
  // otherwise it is what `orgFromHost` has said all along that it is: a URL that
  // does not exist.

  // Not this deployment's at all — an IP, a LAN name, a domain pointed here by
  // mistake. There is no address on this host to send it to.
  if (!isAppHost(host)) return noSuchHost(host)

  if (!isNoOrgHost(host)) {
    // The bare domain in production, where the picker lives one label up at
    // `app.<root>`. A real change of hostname, so the redirect moves and stays
    // absolute. Unreachable locally, where the root and the no-workspace host
    // are the same name: `localhost` has nothing in front of it to move to.
    const bareRoot = host?.toLowerCase().replace(/\.$/, "") === ROOT_HOST
    if (bareRoot && NO_ORG_HOST !== ROOT_HOST)
      return moved(rootUrl(`${pathname}${search}`))
    // A label in front of the root naming no workspace: a typo, or a tenant that
    // has gone. Bouncing these to the picker hid the difference between "that
    // company isn't yours" and "that company isn't spelled like that" — and on
    // a root with no label to spare, it was the loop above.
    return noSuchHost(host)
  }

  // The picker, which is the whole reason this host exists.
  if (!first) return NextResponse.next()

  // A path here leads with a workspace — the original single-host scheme. Off to
  // that workspace's own host, keeping whichever app it named if it still names
  // one this workspace has.
  const target = named ?? DEFAULT_ORG
  const app = second ? DOMAINS.find((item) => item.slug === second) : undefined
  const path =
    app && target.apps.includes(app.slug)
      ? `/${[app.slug, ...rest].filter(Boolean).join("/")}`
      : orgHref(defaultDomain(target))

  return moved(`${PROTOCOL}://${target.slug}.${ROOT_HOST}${path}${search}`)
}

/**
 * Everything but the framework's own files.
 *
 * `_next` and `favicon.ico` are excluded because they are served from whichever
 * host the document came from, and a redirect on a stylesheet would break the
 * page rather than move it. Static assets under `/logos` are matched by the
 * extension clause for the same reason.
 */
export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\.[a-z0-9]+$).*)"],
}
