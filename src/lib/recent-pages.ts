/**
 * Where you have just been, as paths.
 *
 * Same cookie discipline as `location-prefs` and `sidebar-state`, and for the
 * same reason: the shell layout is a server component and reads it there, so
 * opening search paints its Recent list on the first frame instead of filling it
 * in a beat after hydration.
 *
 * Paths rather than ids, because a path is the one description of a destination
 * this app already has — `scopeFromPath` turns it back into an app, a section or
 * a site, so a stored entry can never mean something the router doesn't. It also
 * means a route that changes shape invalidates old entries by failing to resolve
 * rather than by pointing somewhere wrong.
 *
 * **A flat list, not a map keyed by workspace.** It was a `Record<orgSlug, …>`
 * of `{ app, path }` pairs, because neither the workspace nor the app was in a
 * place the browser understood — the org had to be a key and the app had to be a
 * field. Both are back where they belong: the workspace is the origin, so this
 * cookie is host-only and cannot see another company's history; the app is the
 * first path segment, so `/compliance/insights` identifies a page on its own.
 * Two levels of hand-partitioning removed by moving one label in the URL.
 *
 * Deliberately carries no "use client": importing a value from a client module
 * inside a server component yields a client-reference proxy rather than the
 * value itself.
 */

import { ORG_COOKIE_ATTRS } from "@/lib/host"

/** Visited paths, most recent first. */
export type RecentPages = readonly string[]

export const RECENT_PAGES_COOKIE = "briesa_recent"

/** How many the list keeps. Short on purpose — the same reason Recent sites is
 *  short. A history long enough to need scanning is the nav again, one order
 *  out, and this list exists to save you the scan. */
export const RECENT_PAGE_LIMIT = 6

export const DEFAULT_RECENT_PAGES: RecentPages = []

/**
 * Anything that isn't a path string is dropped rather than trusted. The cookie
 * is user-editable and these go straight into `scopeFromPath` and then into
 * hrefs, so what survives here has to be the right shape even when what arrived
 * wasn't. Entries that no longer resolve are dropped at render rather than here
 * — this only guarantees the shape.
 *
 * Entries written under either previous shape were objects, or a map of them.
 * Both fail the check and are dropped, which is the right answer: a history from
 * a different URL scheme points at pages that no longer exist.
 */
export const parseRecentPages = (raw: string | undefined): RecentPages => {
  if (!raw) return DEFAULT_RECENT_PAGES
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown
    if (!Array.isArray(parsed)) return DEFAULT_RECENT_PAGES
    return parsed.filter(
      (path): path is string => typeof path === "string" && path.startsWith("/"),
    )
  } catch {
    return DEFAULT_RECENT_PAGES
  }
}

export const serialiseRecentPages = (pages: RecentPages): string =>
  `${RECENT_PAGES_COOKIE}=${encodeURIComponent(JSON.stringify(pages))}; ${ORG_COOKIE_ATTRS}`

/**
 * Record a visit. Most recent first, deduplicated, capped at
 * `RECENT_PAGE_LIMIT`.
 *
 * Returns the list untouched when the path is already at the head — this runs on
 * every navigation, and handing back a fresh one each time would write the
 * cookie and re-render the panel on every click.
 */
export function pushRecentPage(pages: RecentPages, path: string): RecentPages {
  if (pages[0] === path) return pages
  return [path, ...pages.filter((item) => item !== path)].slice(0, RECENT_PAGE_LIMIT)
}
