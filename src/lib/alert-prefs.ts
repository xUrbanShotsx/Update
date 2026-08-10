/**
 * What you have said about the alerts on the rail — cleared, or pinned — by id.
 *
 * Same cookie discipline as `location-prefs`, and for the same reason: the shell
 * layout is a server component and reads it there, so the rail paints the column
 * you left on the first frame rather than showing three tiles and then dropping
 * them a beat after hydration. A rail that visibly un-clears itself on every load
 * is worse than one that loads slowly.
 *
 * These are ids of `Notification` records rather than a list of their own. The
 * rail and the bell draw one set of facts; what lives here is only your reading
 * of them, which is what keeps clearing something on the rail from leaving it
 * sitting in the bell as though nothing happened.
 *
 * **Two flat lists, not maps keyed by org**, exactly as the sites are: an id only
 * means anything inside one workspace, the workspace is the origin, and the
 * cookie is host-only — so the browser enforces the separation that keying by org
 * was only ever asking for politely.
 *
 * Deliberately carries no "use client": importing a value from a client module
 * inside a server component yields a client-reference proxy rather than the value
 * itself.
 */

import { ORG_COOKIE_ATTRS } from "@/lib/host"

export type AlertPrefs = {
  /** Dismissed. Unordered — nothing reads the sequence, only membership. */
  cleared: readonly string[]
  /** Held at the top of the rail, in the order they were pinned. */
  pinned: readonly string[]
  /**
   * Opened at least once, which is what turns the unread dot off.
   *
   * Separate from `cleared` because they answer different questions. Read is "I
   * know about this"; cleared is "I am done with it". A licence expiring next
   * month is something you can have read three times and still want on the rail,
   * and collapsing the two would mean every glance at an alert dismissed it.
   */
  read: readonly string[]
}

export const ALERTS_COOKIE = "briesa_alerts"

export const DEFAULT_ALERT_PREFS: AlertPrefs = { cleared: [], pinned: [], read: [] }

/**
 * Anything that isn't a string in an array is dropped rather than trusted. The
 * cookie is user-editable and these ids are matched against real records, so what
 * survives here has to be the right shape even when what arrived wasn't.
 */
const parseList = (value: unknown): readonly string[] =>
  Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []

export const parseAlertPrefs = (raw: string | undefined): AlertPrefs => {
  if (!raw) return DEFAULT_ALERT_PREFS
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<AlertPrefs>
    return {
      cleared: parseList(parsed.cleared),
      pinned: parseList(parsed.pinned),
      read: parseList(parsed.read),
    }
  } catch {
    return DEFAULT_ALERT_PREFS
  }
}

export const serialiseAlertPrefs = (prefs: AlertPrefs): string =>
  `${ALERTS_COOKIE}=${encodeURIComponent(
    JSON.stringify({ cleared: prefs.cleared, pinned: prefs.pinned, read: prefs.read }),
  )}; ${ORG_COOKIE_ATTRS}`

/**
 * Opened, so stop marking it new.
 *
 * Returns the same object when the id is already in the list. That identity is
 * load-bearing: this fires on every popover open, and a fresh object each time
 * would rewrite the cookie and re-render the shell for the second, third and
 * fourth look at an alert that has not changed.
 */
export function markAlertRead(prefs: AlertPrefs, id: string): AlertPrefs {
  if (prefs.read.includes(id)) return prefs
  return { ...prefs, read: [...prefs.read, id] }
}

/**
 * Clear one.
 *
 * It drops the pin on the way out. Pinning says "keep this in front of me" and
 * clearing says "I am done with it" — holding both at once is not a state the
 * rail could draw, and leaving a stale pin behind would resurrect the alert at
 * the top of the column if it were ever un-cleared.
 */
export function clearAlert(prefs: AlertPrefs, id: string): AlertPrefs {
  if (prefs.cleared.includes(id)) return prefs
  return {
    ...prefs,
    cleared: [...prefs.cleared, id],
    pinned: prefs.pinned.filter((item) => item !== id),
  }
}

/**
 * Pin or unpin. A new pin goes on the end rather than the front, matching the
 * sites: the group is a shelf you arranged, and something you pinned last week
 * should not move because you pinned something else today.
 */
export function toggleAlertPin(prefs: AlertPrefs, id: string): AlertPrefs {
  const pinned = prefs.pinned.includes(id)
    ? prefs.pinned.filter((item) => item !== id)
    : [...prefs.pinned, id]
  return { ...prefs, pinned }
}

/**
 * Everything back.
 *
 * Clearing is the only destructive thing the rail does, and it is one click deep
 * with no undo on the tile — the tile is gone, so there is nothing left to put an
 * undo *on*. This is the way back, and it is why clearing needs no confirmation:
 * a decision you can reverse from the foot of the same column does not deserve a
 * dialog in front of it.
 *
 * Pins are kept. They were not what you were undoing.
 */
export const restoreCleared = (prefs: AlertPrefs): AlertPrefs => ({
  ...prefs,
  cleared: [],
})
