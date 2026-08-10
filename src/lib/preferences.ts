/**
 * What the user wants to be told about, and on which channel. Same cookie
 * discipline as `sidebar-state` and `location-prefs`: the page is a server
 * component, reads this there, and paints the switches already in the right
 * position rather than correcting them a beat after hydration.
 *
 * A matrix rather than a list of switches, because on a construction site the
 * channel is the whole decision. An incident at 2am is an SMS; the weekly
 * summary is an email and never anything else. Collapsing that into one
 * "notifications: on" toggle is how people end up turning the lot off.
 *
 * No "use client": read by the server page, written by the client view.
 */

import { USER_COOKIE_ATTRS } from "@/lib/host"

export const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "push", label: "Push" },
  { key: "sms", label: "SMS" },
] as const

export type ChannelKey = (typeof CHANNELS)[number]["key"]

export const NOTIFY_EVENTS = [
  {
    key: "incidents",
    label: "Incidents and near misses",
    hint: "Raised on any site you can see",
  },
  {
    key: "expiries",
    label: "Licences and tickets expiring",
    hint: "30 days out, then again at 7",
  },
  {
    key: "approvals",
    label: "SWMS and permits awaiting approval",
    hint: "Only where you are the approver",
  },
  {
    key: "audits",
    label: "Audits and corrective actions due",
    hint: "Assigned to you or your team",
  },
  { key: "digest", label: "Weekly summary", hint: "Monday morning, one message" },
] as const

export type NotifyEventKey = (typeof NOTIFY_EVENTS)[number]["key"]

export type Preferences = {
  /** Event key to the channels it goes out on. */
  notify: Record<string, Partial<Record<ChannelKey, boolean>>>
}

export const PREFERENCES_COOKIE = "briesa_prefs"

/**
 * On by default is wrong for most things and right for these: someone who has
 * never opened this page should still hear about an incident. SMS is the
 * exception — it costs money and wakes people up, so it starts off everywhere
 * except the one event worth waking up for.
 */
export const DEFAULT_PREFERENCES: Preferences = {
  notify: {
    incidents: { email: true, push: true, sms: true },
    expiries: { email: true, push: true, sms: false },
    approvals: { email: true, push: true, sms: false },
    audits: { email: true, push: false, sms: false },
    digest: { email: true, push: false, sms: false },
  },
}

export const isEnabled = (
  prefs: Preferences,
  event: string,
  channel: ChannelKey,
): boolean => prefs.notify[event]?.[channel] ?? false

export function toggleChannel(
  prefs: Preferences,
  event: string,
  channel: ChannelKey,
): Preferences {
  const row = prefs.notify[event] ?? {}
  return {
    ...prefs,
    notify: { ...prefs.notify, [event]: { ...row, [channel]: !row[channel] } },
  }
}

/**
 * Only the events and channels this build knows about survive a parse, and only
 * as booleans. The cookie is user-editable, and an unknown key kept "just in
 * case" is a row that renders nowhere and silently outlives the feature it
 * belonged to.
 */
export const parsePreferences = (raw: string | undefined): Preferences => {
  if (!raw) return DEFAULT_PREFERENCES
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Preferences>
    const notify: Preferences["notify"] = {}
    for (const event of NOTIFY_EVENTS) {
      const stored = parsed.notify?.[event.key]
      const fallback = DEFAULT_PREFERENCES.notify[event.key] ?? {}
      notify[event.key] = Object.fromEntries(
        CHANNELS.map((channel) => [
          channel.key,
          typeof stored?.[channel.key] === "boolean"
            ? stored[channel.key]
            : (fallback[channel.key] ?? false),
        ]),
      )
    }
    return { notify }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export const serialisePreferences = (prefs: Preferences): string =>
  `${PREFERENCES_COOKIE}=${encodeURIComponent(
    JSON.stringify({ notify: prefs.notify }),
  )}; ${USER_COOKIE_ATTRS}`
