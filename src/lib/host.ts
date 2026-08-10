/**
 * Which **workspace** you are in, read off the hostname.
 *
 * `company-1.example/compliance/safety`. The tenant is the subdomain and the app
 * is the first path segment — the reverse of what this file said a day ago, and
 * the reverse for a reason worth writing down, because the previous arrangement
 * was defensible and still wrong.
 *
 * The origin is a boundary the browser enforces: cookies, storage, service
 * workers and the blast radius of any injected script all stop at it. So the
 * question is not "what is the app's top-level partition" but "what should be
 * isolated from what" — and in a product sold to companies, the answer is one
 * company from another, never Operations from Compliance. Four app origins
 * shared by every tenant put the wall in the one place nothing needed walling.
 *
 * It also matches how the product is used. Moving between apps happens all day
 * and is now a same-origin navigation the router handles; changing workspace
 * happens rarely and is the one that costs a document load. The old shape had
 * that exactly backwards, which is why it needed a loading cover over the
 * common case.
 *
 * No "use client": read by the proxy, by the root layout on the server, and by
 * the client shell through the value the layout passes it. Nothing here touches
 * `window` — a client component that guessed the workspace from
 * `location.hostname` would render one tenant on the server and possibly another
 * on hydration.
 */

import { ORGS, type Org } from "@/lib/scope"

/**
 * The origin every workspace hangs off. `NEXT_PUBLIC_ROOT_HOST`, optionally with
 * a scheme:
 *
 *   briesa.com.au                        https, inferred
 *   localhost:3000                       http, inferred — the default
 *   http://192-168-0-197.nip.io:3000     http, stated
 *
 * From the environment rather than hardcoded, because the answer differs per
 * deployment and getting it wrong breaks every cross-workspace link at once.
 *
 * The scheme is *optional* rather than a second variable, and that is a
 * correction rather than a flourish. This inferred `http` from the host starting
 * with `localhost` and called a second variable "a second thing to set wrong" —
 * which held right up until the first time somebody opened the dev server from a
 * phone. A LAN-resolvable dev host (`nip.io`, `.local`, a plain IP) is not
 * localhost and is not served over TLS either, so the inference sent every
 * redirect to `https://` against a plain-http server, and the browser reported it
 * as a redirect loop. An origin legitimately carries a scheme; letting this one
 * do so keeps it to one variable and makes the odd case say itself.
 */
const configuredHost = process.env.NEXT_PUBLIC_ROOT_HOST ?? "localhost:3000"
const withScheme = /^(https?):\/\/(.+)$/.exec(configuredHost)

export const ROOT_HOST = (withScheme?.[2] ?? configuredHost).replace(/\/+$/, "")

/** Stated if the host carried a scheme, otherwise `http` for localhost and
 *  `https` for anything else. */
export const PROTOCOL =
  withScheme?.[1] ?? (ROOT_HOST.startsWith("localhost") ? "http" : "https")

/**
 * The subdomain of a host, or undefined where there isn't one.
 *
 * Compared against `ROOT_HOST` rather than counting dots, because counting is
 * wrong at both ends: `localhost:3000` has none and `company-1.localhost:3000`
 * has one, while a production `briesa.com.au` has two before any tenant is
 * named. The suffix is the only thing that reliably separates the label.
 *
 * The port is part of the comparison. In dev the host header carries it, and a
 * match that ignored it would accept `company-1.localhost:9999` as this app.
 */
export function subdomainOf(host: string | null | undefined): string | undefined {
  if (!host) return undefined
  // `Host` can carry a trailing dot on a fully-qualified name, and browsers
  // differ on case. Neither should decide which workspace you get.
  const clean = host.toLowerCase().replace(/\.$/, "")
  if (clean === ROOT_HOST) return undefined
  const suffix = `.${ROOT_HOST}`
  if (!clean.endsWith(suffix)) return undefined
  const label = clean.slice(0, -suffix.length)
  return label.length ? label : undefined
}

/**
 * Whether this deployment serves the hostname at all — `ROOT_HOST` itself, or
 * anything one label in front of it, which is every workspace and the
 * no-workspace host together.
 *
 * A narrower question than `orgFromHost` and a differently useful one. That
 * asks which workspace you are in; this asks whether the address is even ours,
 * and the answer decides between a 404 and a redirect.
 *
 * It earns its place by being the difference between those two. A hostname the
 * app does not serve cannot be *moved* onto one it does — see the note in
 * `proxy.ts`, where sending them all to the no-workspace host is what produced
 * a redirect loop rather than a picker.
 */
export function isAppHost(host: string | null | undefined): boolean {
  if (!host) return false
  const clean = host.toLowerCase().replace(/\.$/, "")
  return clean === ROOT_HOST || clean.endsWith(`.${ROOT_HOST}`)
}

/**
 * The workspace a request is for.
 *
 * A lookup against `ORGS` today, which is also the membership check — an unknown
 * label is a 404 rather than an empty tenant. With real data this is where "does
 * this hostname name a workspace, and may *you* open it" would live, and the
 * shape is deliberately already that: one call, one answer, one place to add
 * the second half of the question.
 */
export function orgFromHost(host: string | null | undefined): Org | undefined {
  const label = subdomainOf(host)
  return label ? ORGS.find((org) => org.slug === label) : undefined
}

/** The hostname a workspace is served from. */
export const hostForOrg = (org: Org): string => `${org.slug}.${ROOT_HOST}`

/**
 * An absolute URL into another workspace.
 *
 * The one link shape that crosses an origin, and now the only one that needs to:
 * every app, section and site of the workspace you are in is a path. Changing
 * workspace is a document load because it is a different origin, which is
 * exactly the isolation the arrangement is for.
 *
 * `path` is what follows the host and must already start with a slash, which is
 * what `appHref` and the builders in `lib/scope` produce — this takes their
 * output rather than rebuilding it and giving the app a second way to spell a
 * URL.
 */
export const orgUrl = (org: Org, path = "/"): string =>
  `${PROTOCOL}://${hostForOrg(org)}${path}`

/**
 * A link to `path` in `target`, from wherever you are.
 *
 * Same workspace and it stays a path, so the router handles it and nothing
 * reloads. Different workspace and it becomes absolute and the browser does.
 *
 * Far fewer callers than its predecessor had: when the *app* was the origin,
 * every notification and every blueprint clause was a potential crossing. Now
 * they are all plain paths, and the only things that cross are the workspace
 * switcher and the picker.
 */
export const hrefIn = (current: Org, target: Org, path: string): string =>
  target.slug === current.slug ? path : orgUrl(target, path)

/**
 * The label the no-workspace host takes when the root has room for one.
 *
 * Reserved by being here: no workspace may be slugged `app`, or the picker and
 * that tenant would want the same hostname. `RESERVED_SLUGS` in `lib/scope`
 * carries the same word for org and site slugs.
 */
const NO_ORG_LABEL = "app"

/**
 * Where you are when no workspace is open.
 *
 * Having none is a real state — it is where deselecting leaves you, and the
 * picker is a page rather than a redirect for that reason. It gets a host of its
 * own because it belongs to no tenant, and putting it on one tenant's host would
 * be showing you a list of companies from inside a company.
 *
 * Bare locally and `app.` deployed, which is the same rule twice: use the
 * shortest host that isn't already spoken for. On a real domain the apex belongs
 * to whatever the company puts in front of the product; `localhost` has nothing
 * in front of it.
 */
export const NO_ORG_HOST = ROOT_HOST.split(":")[0]?.includes(".")
  ? `${NO_ORG_LABEL}.${ROOT_HOST}`
  : ROOT_HOST

export const isNoOrgHost = (host: string | null | undefined): boolean =>
  Boolean(host) && host?.toLowerCase().replace(/\.$/, "") === NO_ORG_HOST

/** An absolute URL to the no-workspace host — the picker, and anything else that
 *  belongs to no tenant. */
export const rootUrl = (path = "/"): string => `${PROTOCOL}://${NO_ORG_HOST}${path}`

/**
 * The cookie attributes for state that belongs to *you* rather than to a
 * workspace — the theme, the notification channels.
 *
 * These need the parent domain, because you are the same person in every
 * workspace and a theme that reset when you switched company would be absurd.
 *
 * **A single-label host gets no `Domain` at all.** `localhost` has no
 * registrable domain, so browsers refuse `Domain=localhost` from
 * `company-1.localhost` — the cookie is not scoped more widely, it is *dropped*.
 * Setting it unconditionally meant nothing persisted in dev at all. Point
 * `NEXT_PUBLIC_ROOT_HOST` at a dotted host that resolves to 127.0.0.1 —
 * `lvh.me:3000` works with no hosts-file entry — and dev matches production.
 */
const parentDomain = (): string | undefined => {
  const host = ROOT_HOST.split(":")[0]
  return host?.includes(".") ? host : undefined
}

export const USER_COOKIE_ATTRS = [
  "path=/",
  ...(parentDomain() ? [`domain=${parentDomain()}`] : []),
  "max-age=31536000",
  // The workspaces are separate origins but the same site, so a top-level
  // navigation between them still sends it; `strict` would drop the cookie on
  // exactly the navigation the switcher makes.
  "samesite=lax",
].join("; ")

/**
 * The cookie attributes for state that belongs to *this workspace* — pinned
 * sites, recent pages, the sidebar's segment.
 *
 * No `Domain`, deliberately. Host-only is what makes these per-tenant for free,
 * and it is the whole practical dividend of putting the workspace on the origin:
 * both of these cookies used to be `Record<orgSlug, …>` maps inside one shared
 * jar, hand-partitioned because the browser had no idea which company you were
 * looking at. Now it does.
 */
export const ORG_COOKIE_ATTRS = "path=/; max-age=31536000; samesite=lax"
