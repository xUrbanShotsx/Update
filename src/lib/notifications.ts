/**
 * What the bell has to show.
 *
 * Mock data, like the document list and the conversation history — there is no
 * service behind any of them yet, and the shape is what a backend would fill
 * rather than something it would replace.
 *
 * Keyed by org slug. A notification is about one workspace's sites, crews and
 * registers, and carrying another's into the list would be the one place in the
 * app where the workspace switcher didn't mean anything.
 *
 * No "use client": plain data and one icon map, read by the bell's menu and by
 * the alert rail.
 */

import {
  ClipboardCheckIcon,
  ClipboardListIcon,
  ClockAlertIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react"

/** What kind of thing happened. Four, because four is what this product knows
 *  about — an incident, something expiring, an audit falling due, and a site
 *  diary flag. Each picks a glyph in the menu that draws them. */
export type NotificationKind = "incident" | "expiry" | "audit" | "diary"

export type Notification = {
  id: string
  kind: NotificationKind
  /** The fact, in the fewest words that are still true. */
  title: string
  /** Where it happened — a site, a register, a crew. */
  detail: string
  /** When. A fixed string rather than a timestamp: these are fixtures, and a
   *  relative time computed at render would make the list change under test. */
  meta: string
  unread: boolean
  /**
   * Where the row lands, as slugs rather than a built href.
   *
   * The panel routes it through `orgHref` and `locationHref` like every other
   * link in the app, so a notification cannot point somewhere those builders
   * would not produce — and a row naming an app the workspace has since lost is
   * dropped rather than rendered as a dead link.
   *
   * A section rather than a record, because there are no record pages to land
   * on yet. When there are, this gains an id and the builders take it.
   */
  target: { domain: string; section: string; site?: string }
}

export const NOTIFICATIONS: Record<string, readonly Notification[]> = {
  "company-1": [
    {
      id: "c1-inc-brisbane",
      kind: "incident",
      title: "5 incidents still open",
      detail: "Brisbane Terminal",
      meta: "2h ago",
      unread: true,
      target: { domain: "compliance", section: "safety", site: "brisbane-terminal" },
    },
    {
      id: "c1-audit-brisbane",
      kind: "audit",
      title: "Audit overdue by 2 weeks",
      detail: "Brisbane Terminal · last audited 6 weeks ago",
      meta: "Today",
      unread: true,
      target: { domain: "compliance", section: "quality", site: "brisbane-terminal" },
    },
    {
      id: "c1-exp-tickets",
      kind: "expiry",
      title: "4 high-risk work licences expire this month",
      detail: "Across 3 sites",
      meta: "Yesterday",
      unread: true,
      target: { domain: "workforce", section: "training" },
    },
    {
      id: "c1-inc-geelong",
      kind: "incident",
      title: "3 incidents still open",
      detail: "Geelong Site",
      meta: "2d ago",
      unread: false,
      target: { domain: "compliance", section: "safety", site: "geelong-site" },
    },
    {
      id: "c1-diary-melbourne",
      kind: "diary",
      title: "Site diary not signed off",
      detail: "Melbourne Depot · Friday",
      meta: "3d ago",
      unread: false,
      target: { domain: "operations", section: "diary", site: "melbourne-depot" },
    },
    {
      id: "c1-exp-plant",
      kind: "expiry",
      title: "Crane inspection due",
      detail: "Perth Workshop · plant register",
      meta: "1w ago",
      unread: false,
      target: { domain: "operations", section: "assets", site: "perth-workshop" },
    },
  ],
  "company-2": [
    {
      id: "c2-inc-newcastle",
      kind: "incident",
      title: "1 incident still open",
      detail: "Newcastle Yard",
      meta: "4h ago",
      unread: true,
      target: { domain: "compliance", section: "safety", site: "newcastle-yard" },
    },
    {
      id: "c2-exp-inductions",
      kind: "expiry",
      title: "2 inductions lapse next week",
      detail: "Newcastle Yard crew",
      meta: "2d ago",
      unread: false,
      target: { domain: "workforce", section: "training" },
    },
  ],
}

export const notificationsFor = (orgSlug: string): readonly Notification[] =>
  NOTIFICATIONS[orgSlug] ?? []

/**
 * The glyph for each kind, beside the kinds themselves.
 *
 * Here rather than in either component that draws them, because there are two
 * now — the bell's menu and the rail — and they are two views of one list. A
 * kind that meant a triangle in the menu and a clock on the rail would make the
 * same alert unrecognisable between the column and the popover it opens.
 *
 * Importing lucide from a module the server layout also reaches is safe: these
 * are components passed around, never called here, and nothing in this file is
 * serialised across the boundary.
 */
export const ALERT_ICONS: Record<NotificationKind, LucideIcon> = {
  incident: TriangleAlertIcon,
  expiry: ClockAlertIcon,
  audit: ClipboardCheckIcon,
  diary: ClipboardListIcon,
}
