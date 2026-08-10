/**
 * Everything that shapes the sidebar on load — its width and whether it's
 * collapsed to the rail — lives in a cookie, never localStorage: the root
 * layout is a server component and reads it there, so the first paint is
 * already correct and a reload can't jump.
 *
 * Deliberately carries no "use client" directive: importing a value from a
 * client module inside a server component yields a client-reference proxy
 * rather than the value itself.
 */

import { ORG_COOKIE_ATTRS } from "@/lib/host"

export type SidebarState = {
  /** Width of the expanded primary panel, in px. */
  width: number
  /** The primary (left) sidebar — the nav. */
  open: boolean
  /** The secondary (right) sidebar. Shut by default: it is the panel you open
   *  for a task, where the primary is the one you live in. */
  secondary: boolean
  /** Width of the secondary panel, in px. Its own value, not shared with the
   *  primary — the two are dragged independently and rarely want to match. */
  secondaryWidth: number
  /** The alert rail down the right edge. Out by default — the whole point of it
   *  is being answered without being asked, and a workspace that hid it on first
   *  load would be one where nothing is wrong until you go looking. */
  alerts: boolean
}

export const SIDEBAR_COOKIE = "briesa_sidebar"

export const SIDEBAR_MIN = 220
export const SIDEBAR_MAX = 360
/** The collapsed icon rail: a size-7 (28px) tile centred with 8px each side.
 *  The same 44 the app rail down the other edge is, so the two columns flanking
 *  the page inset their glyphs by the same amount — at 48 against 44 the tiles
 *  sat 2px off centre from each other, which is the kind of thing you see
 *  without being able to name. */
export const RAIL_WIDTH = 44

/**
 * The alert rail down the right edge.
 *
 * Its own constant rather than sharing `RAIL_WIDTH`: the two are the same width
 * today and are not the same thing, and a change to one should not silently move
 * the other. It is a number rather than a `w-11` because the shell has to do
 * arithmetic with it — the secondary panel's drag handle is positioned from the
 * window's right edge, and this is how far in from that edge the panel actually
 * starts.
 */
export const ALERT_RAIL_WIDTH = 44

/** The secondary panel gets a higher ceiling than the primary: the nav is a
 *  list of short labels, where this is meant to hold content. */
export const SECONDARY_MIN = 240
/** Not a hard stop but a detent — the panel holds here while the primary is
 *  still out, and can run on to half the window once it isn't. */
export const SECONDARY_SOFT_MAX = 520
/** How much further the pointer has to travel past the detent to break through
 *  it. Long enough that widening to 520 never folds the nav by accident. */
export const SECONDARY_BREAK = 64

export const DEFAULT_SIDEBAR: SidebarState = {
  width: 256,
  open: true,
  secondary: false,
  secondaryWidth: 320,
  alerts: true,
}

/** Parses the cookie, falling back to the defaults on anything malformed. */
export const parseSidebar = (raw: string | undefined): SidebarState => {
  if (!raw) return DEFAULT_SIDEBAR
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<SidebarState>
    return {
      // Clamped on the way in as well as on the way out — a hand-edited cookie
      // should not be able to paint a 4000px panel on the first frame.
      width:
        typeof parsed.width === "number"
          ? Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, parsed.width))
          : DEFAULT_SIDEBAR.width,
      open: typeof parsed.open === "boolean" ? parsed.open : DEFAULT_SIDEBAR.open,
      secondary:
        typeof parsed.secondary === "boolean"
          ? parsed.secondary
          : DEFAULT_SIDEBAR.secondary,
      // The real ceiling is half the window, which the server can't know, so
      // this is only a sanity guard against a hand-edited cookie; the next
      // drag clamps it properly.
      secondaryWidth:
        typeof parsed.secondaryWidth === "number"
          ? Math.min(2000, Math.max(SECONDARY_MIN, parsed.secondaryWidth))
          : DEFAULT_SIDEBAR.secondaryWidth,
      alerts: typeof parsed.alerts === "boolean" ? parsed.alerts : DEFAULT_SIDEBAR.alerts,
    }
  } catch {
    return DEFAULT_SIDEBAR
  }
}

/** Fields picked explicitly rather than stringifying whatever it was handed —
 *  the shell carries transient state alongside these that has no business
 *  outliving the session. */
export const serialiseSidebar = (state: SidebarState): string =>
  `${SIDEBAR_COOKIE}=${encodeURIComponent(
    JSON.stringify({
      width: state.width,
      open: state.open,
      secondary: state.secondary,
      secondaryWidth: state.secondaryWidth,
      alerts: state.alerts,
    }),
  )}; ${ORG_COOKIE_ATTRS}`
