"use client"
// The alerts, as a column of glyphs down the right edge of the shell.
//
// It held the app switcher until the sidebar's head grew one of its own — see
// `AppToggle` — and a rail of four tiles duplicating a segmented control sitting
// in the panel opposite was the same statement made twice on one screen. What
// replaced it is the thing chrome is actually for: not a place you go, but the
// standing answer to "does anything need me".
//
// On the right, opposite the nav. The left edge of the page is the layout's
// anchor — the seam the nav meets the card along — and hanging a second column of
// icons off it would give the eye two starting points. The right edge is
// otherwise the window's, and a strip there reads as belonging to the app rather
// than to the page.
//
// Outside the page-and-panel row rather than inside it, so it is a column at
// every width. That row turns from a row into a column below `lg` — the agent
// panel becomes a shelf under the page — and a rail inside it would have turned
// with it into a horizontal band of alert icons across the middle of the screen.
//
// **It is meant to be empty most of the time.** That is the whole design, and the
// one thing that would break it is putting routine traffic in it. A column that
// is always full is a column nobody reads, at which point it is 44px of
// wallpaper; a column that is usually blank is one where a single tile is worth
// looking at. Which facts earn a tile is a decision for `NOTIFICATIONS`, not for
// this file — but it is decided against this rule.

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PinIcon,
  PinOffIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { AlertPrefs } from "@/lib/alert-prefs"
import { ALERT_ICONS, notificationsFor, type Notification } from "@/lib/notifications"
import { ALERT_RAIL_WIDTH } from "@/lib/sidebar-state"
import { domainBySlug, locationHref, orgHref, type Org } from "@/lib/scope"
import { cn } from "@/lib/utils"

/** An alert with somewhere to go. */
type RailAlert = Notification & { href: string }

/**
 * The alerts this workspace can actually open, newest first.
 *
 * Resolved against entitlement the way the bell's menu does it: a row pointing at
 * an app the org is not licensed for would be a dead tile, and dropping it here
 * is cheaper than every tile checking at render. A site that no longer exists
 * loses only its scope, not its tile — the fact is still true of the org, so it
 * lands on the org's section instead.
 *
 * Every href is a path rather than an absolute URL. The rail only ever draws one
 * workspace, which is this origin, so there is no crossing to make — where the
 * bell spans companies on the picker and has to.
 *
 * `unread` is resolved here rather than passed through, so nothing downstream has
 * to remember to consult the read list. The record arrives unread and having
 * opened it is what makes it not — one `&&`, in the one place that builds these,
 * and every dot in the column is right by construction.
 */
function railAlerts(org: Org, prefs: AlertPrefs): readonly RailAlert[] {
  return notificationsFor(org.slug)
    .filter((item) => !prefs.cleared.includes(item.id))
    .map((item) => {
      const domain = domainBySlug(item.target.domain, org)
      if (!domain) return undefined
      const site = item.target.site
        ? org.locations.find((location) => location.slug === item.target.site)
        : undefined
      const href =
        site && domain.siteGroups.length
          ? locationHref(domain, site, item.target.section)
          : orgHref(domain, item.target.section)
      return { ...item, href, unread: item.unread && !prefs.read.includes(item.id) }
    })
    .filter((item): item is RailAlert => Boolean(item))
}

/**
 * One alert, as a tile that opens what it is.
 *
 * The tile carries the kind's glyph and nothing else — 44px has no room for a
 * word, and four glyphs is a vocabulary you learn in a day where four truncated
 * labels is one you never do. What the tile cannot say, the popover says in full
 * the moment you click it.
 *
 * Click rather than hover, and a menu rather than a tooltip, because there are
 * things to *do* here. A tooltip that told you the title would still leave
 * clearing and pinning somewhere else, and hover-to-read plus click-to-act on one
 * target is two behaviours competing for the same pointer.
 */
function AlertTile({
  alert,
  onClear,
  onOpen,
  onTogglePin,
  pinned,
}: {
  readonly alert: RailAlert
  readonly onClear: (id: string) => void
  /** Read, as of now. See the note on the handler below. */
  readonly onOpen: (id: string) => void
  readonly onTogglePin: (id: string) => void
  readonly pinned: boolean
}) {
  const Icon = ALERT_ICONS[alert.kind]

  return (
    // Opening the popover is what marks the alert read, because the popover is
    // where the alert actually *is* — the tile carries a glyph, and everything
    // that makes it one alert rather than another is behind this click. Waiting
    // for `Open` would mean the dot survived you reading the thing in full and
    // deciding it needed nothing, which is the most common way an alert ends.
    //
    // On open rather than on close, so the dot goes as the popover arrives. The
    // alternative reads as the tile changing behind your back on the way out.
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) onOpen(alert.id)
      }}
    >
      <DropdownMenuTrigger
        aria-label={`${alert.title} — ${alert.detail}`}
        className={cn(
          // The rail's tile, to the letter: size-7 over a size-3.5 glyph, which
          // is the shell's chrome button everywhere else. A heavier tile would
          // make this the loudest column in a window whose whole left side is
          // 14px glyphs — and this column is loud enough by being occupied at
          // all.
          //
          // `rounded-md` is the shell's corner, the same one the collapsed nav
          // rail's tiles wear. The two columns face each other across the page
          // and a different radius on one of them reads as a mistake rather than
          // as a distinction.
          "relative grid size-7 shrink-0 place-items-center rounded-md transition-colors",
          // A pinned alert holds the rest state the lit app tile used to: you
          // put it there, so it does not need the pointer to justify being
          // visible. Everything else takes the dimmed-until-hovered treatment
          // every other piece of chrome in the shell wears.
          pinned
            ? "bg-fill text-foreground"
            : "text-muted-foreground/55 hover:bg-fill hover:text-foreground",
          // Unread lifts out of the dim, without going as far as a fill. The
          // dot below says *that* it is new; this is what makes the glyph
          // legible enough to tell which kind of new it is at a glance.
          !pinned && alert.unread && "text-foreground/70",
        )}
      >
        <Icon className="size-3.5" />
        {/* The bell's dot, in the bell's blue, on the bell's corner. Unread is a
            state of the inbox rather than a severity — it says "there is
            something here", and it says it whether the something is an incident
            or a diary flag. Severity is already carried by which glyph is under
            the dot.

            Amber was the alternative and is wrong on chrome this persistent: a
            warning colour that is on screen all day stops reading as a warning
            by lunchtime. */}
        {alert.unread ? (
          <span
            aria-hidden
            className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-blue-500"
          />
        ) : null}
      </DropdownMenuTrigger>

      {/* Out to the left, because there is nothing to the right of this column
          but the window edge. `min-w-72` because the popup defaults to its
          anchor's width and the anchor is a 28px tile. */}
      <DropdownMenuContent align="start" className="min-w-72" side="left" sideOffset={6}>
        {/* What the tile could not say. Three facts in the order you need them:
            what happened, where, and when. The where is what tells two identical
            incidents apart, and it is the half you scan when two tiles carry the
            same glyph. */}
        <div className="px-1.5 py-1">
          <p className="text-xs font-medium text-foreground">{alert.title}</p>
          <p className="mt-0.5 flex items-baseline gap-2 text-[10px] text-muted-foreground">
            <span className="min-w-0 flex-1 truncate">{alert.detail}</span>
            <span className="shrink-0">{alert.meta}</span>
          </p>
        </div>

        <DropdownMenuSeparator />

        {/* Going there is the default, so it is first and it is the only item
            that navigates. The other two act on the tile and leave you where you
            are — which is the point of having them on the rail at all. */}
        <DropdownMenuItem
          className="text-xs"
          nativeButton={false}
          render={<Link href={alert.href} />}
        >
          Open
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" onClick={() => onTogglePin(alert.id)}>
          {pinned ? (
            <PinOffIcon className="size-3.5" />
          ) : (
            <PinIcon className="size-3.5" />
          )}
          {pinned ? "Unpin" : "Pin to top"}
        </DropdownMenuItem>
        {/* Destructive in the menu's own sense — it is the one item that removes
            something from the screen. No confirmation in front of it: the foot of
            the rail can put every cleared alert back, and a decision you can
            reverse from the same column does not deserve a dialog. */}
        <DropdownMenuItem
          className="text-xs"
          onClick={() => onClear(alert.id)}
          variant="destructive"
        >
          <XIcon className="size-3.5" />
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AlertRail({
  collapsed = false,
  onClear,
  onOpen,
  onRestore,
  onTogglePin,
  onToggle,
  org,
  prefs,
}: {
  readonly collapsed?: boolean
  readonly onClear: (id: string) => void
  readonly onOpen: (id: string) => void
  readonly onRestore: () => void
  readonly onTogglePin: (id: string) => void
  readonly onToggle?: () => void
  readonly org: Org
  readonly prefs: AlertPrefs
}) {
  const alerts = railAlerts(org, prefs)
  const pinned = alerts.filter((alert) => prefs.pinned.includes(alert.id))
  const rest = alerts.filter((alert) => !prefs.pinned.includes(alert.id))
  // Only what is still on the rail to be put back. A workspace whose cleared ids
  // all belong to another org — or to records that have since gone — would
  // otherwise show a restore control that visibly did nothing.
  const restorable = notificationsFor(org.slug).some((item) =>
    prefs.cleared.includes(item.id),
  )

  /**
   * The way out, and the way back — one button in one place.
   *
   * Shut, the rail is a zero-width column and this is all that is left of it, so
   * it comes out of the flow and pins itself to the shell's right edge. A control
   * that vanished with the thing it controls would leave the alerts unreachable,
   * and putting the way back somewhere *else* would mean learning two locations
   * for one switch.
   *
   * As a tab rather than as the button it is when the rail is out: hard against
   * the edge, taller than it is wide, and rounded only on the side facing in. A
   * floating square inset from the corner reads as a control that happens to be
   * there; a shape with two of its corners cut off by the window reads as the
   * edge of something, which is exactly what it is — the rail, all but one strip
   * of it off screen. It also has to carry a fill at rest for the same reason:
   * out in the rail the chevron sits under a column of tiles and is found by
   * position; alone on the ground it has nothing to be found among, and a `/55`
   * glyph on bare background is a thing you have to already know is there.
   *
   * The chevron points the way the rail will go: right to send it off the edge,
   * left to pull it back in.
   */
  const toggle = (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Show alerts" : "Hide alerts"}
            className={cn(
              "grid shrink-0 place-items-center transition-colors",
              collapsed
                ? "absolute right-0 bottom-10 z-10 h-6 w-4 rounded-l-md bg-fill text-muted-foreground/70 hover:bg-fill-strong hover:text-foreground"
                : "size-7 rounded-md text-muted-foreground/55 hover:bg-fill hover:text-foreground",
            )}
            onClick={onToggle}
            type="button"
          >
            {/* A step down from the rail's `size-3.5` on the tab: 16px of width
                with a 14px glyph in it leaves a pixel either side, which reads
                as a chevron that didn't fit rather than as a tab. */}
            {collapsed ? (
              <ChevronLeftIcon className="size-3" />
            ) : (
              <ChevronRightIcon className="size-3.5" />
            )}
          </button>
        }
      />
      <TooltipContent side="left">
        {collapsed ? "Show alerts" : "Hide alerts"}
      </TooltipContent>
    </Tooltip>
  )

  // A dot on the tab while the rail is shut and something is unread. Hiding the
  // column is a decision about clutter, not a request to stop being told — and a
  // collapsed rail with no signal at all would make "hide" mean "mute", which is
  // not what the chevron says it does.
  if (collapsed) {
    const unread = alerts.some((alert) => alert.unread)
    return (
      <>
        {toggle}
        {unread ? (
          <span
            aria-hidden
            className="absolute right-[1px] bottom-[3.75rem] z-10 size-1.5 rounded-full bg-blue-500"
          />
        ) : null}
      </>
    )
  }

  return (
    // 44px, matching the nav rail across the page. `gap-0.5` rather than a full
    // step: tiles spaced further apart read as separate controls, where these are
    // one list. `py-2` puts the first tile level with the page card's top edge and
    // with the brand row across in the nav head — the three things at the top of
    // the window start on one line.
    //
    // The width is inline rather than a `w-11`, because the shell measures the
    // secondary panel's drag against this number and a class it could not read
    // would be a second source of truth for one distance.
    <nav
      aria-label="Alerts"
      className="flex shrink-0 flex-col items-center py-2"
      style={{ width: ALERT_RAIL_WIDTH }}
    >
      {/* The list scrolls and the controls beneath it do not. A busy week has to
          be able to overflow — the alternative is a column that silently stops
          drawing at whatever the window height happened to be — and the way out
          of the rail must not scroll away with it.

          `thin-scrollbar` and no gutter: a scrollbar inside 44px would take a
          third of the tile's width. */}
      <div className="thin-scrollbar flex min-h-0 flex-1 flex-col items-center gap-0.5 overflow-y-auto">
        {pinned.map((alert) => (
          <AlertTile
            alert={alert}
            key={alert.id}
            onClear={onClear}
            onOpen={onOpen}
            onTogglePin={onTogglePin}
            pinned
          />
        ))}
        {/* The rule the app tiles used to spend on Admin, doing the same job for
            the same reason: it separates a group you arranged from a list that
            arranges itself. Only while both sides of it exist — a rule under
            nothing is a line drawn across an empty column. */}
        {pinned.length && rest.length ? (
          <span aria-hidden className="my-1 h-px w-5 shrink-0 bg-border" />
        ) : null}
        {rest.map((alert) => (
          <AlertTile
            alert={alert}
            key={alert.id}
            onClear={onClear}
            onOpen={onOpen}
            onTogglePin={onTogglePin}
            pinned={false}
          />
        ))}
      </div>

      {/* Everything back. Only while there is something to put back, which means
          this is normally absent — the rail's resting state is the toggle alone
          under an empty column.

          Above the toggle rather than in the menu of any one tile: it undoes all
          of them, and hanging a global action off one alert's popover would make
          it look like it applied to that alert. */}
      {restorable ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                aria-label="Restore cleared alerts"
                className="mt-1 grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground/40 transition-colors hover:bg-fill hover:text-foreground"
                onClick={onRestore}
                type="button"
              >
                <RotateCcwIcon className="size-3.5" />
              </button>
            }
          />
          <TooltipContent side="left">Restore cleared alerts</TooltipContent>
        </Tooltip>
      ) : null}

      {toggle}
    </nav>
  )
}
