/**
 * Which sites the user has pinned. Same cookie discipline as `sidebar-state`,
 * and for the same reason: the shell layout is a server component and reads it
 * there, so the panel paints its Pinned group on the first frame instead of
 * filling it in a beat after hydration.
 *
 * It held a second list — the sites you were last inside — until the Recent
 * group came out of the panel. Nothing was reading it, and a cookie rewritten on
 * every navigation to feed a list nobody draws is worse than no cookie.
 *
 * **Two flat lists, not two maps keyed by org.** A site slug only means anything
 * inside one workspace, and switching workspaces must not carry the other's pins
 * across — which used to require keying both lists by org slug and hoping every
 * reader remembered to index them. The workspace is the origin now, so the
 * cookie is host-only and the browser enforces what the keying was asking for.
 *
 * Deliberately carries no "use client": importing a value from a client module
 * inside a server component yields a client-reference proxy rather than the
 * value itself.
 */

import { ORG_COOKIE_ATTRS } from "@/lib/host"

export type LocationPrefs = {
  /** Pinned site slugs, in the order they were pinned. */
  pinned: readonly string[]
}

export const LOCATIONS_COOKIE = "briesa_locations"

export const DEFAULT_LOCATION_PREFS: LocationPrefs = { pinned: [] }

/**
 * Anything that isn't a string in an array is dropped rather than trusted. The
 * cookie is user-editable and these slugs go straight into hrefs and into `Map`
 * lookups against the real sites, so what survives here has to be the right
 * shape even when what arrived wasn't.
 *
 * A cookie written under the old org-keyed shape is an object rather than an
 * array, fails the check and is dropped — which is correct twice over: those
 * slugs belonged to whichever workspace happened to be in the same jar.
 */
const parseList = (value: unknown): readonly string[] =>
  Array.isArray(value)
    ? value.filter((slug): slug is string => typeof slug === "string")
    : []

export const parseLocationPrefs = (raw: string | undefined): LocationPrefs => {
  if (!raw) return DEFAULT_LOCATION_PREFS
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<LocationPrefs>
    return { pinned: parseList(parsed.pinned) }
  } catch {
    return DEFAULT_LOCATION_PREFS
  }
}

export const serialiseLocationPrefs = (prefs: LocationPrefs): string =>
  `${LOCATIONS_COOKIE}=${encodeURIComponent(
    JSON.stringify({ pinned: prefs.pinned }),
  )}; ${ORG_COOKIE_ATTRS}`

/**
 * Pin or unpin. A new pin goes on the end rather than the front: the group is a
 * shelf you arranged, and something you pinned last week should not move because
 * you pinned something else today.
 */
export function togglePinned(prefs: LocationPrefs, slug: string): LocationPrefs {
  const next = prefs.pinned.includes(slug)
    ? prefs.pinned.filter((item) => item !== slug)
    : [...prefs.pinned, slug]
  return { ...prefs, pinned: next }
}
