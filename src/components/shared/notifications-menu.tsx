"use client"
// The bell, in the one place it is written.
//
// It appears three times — the collapsed rail, the expanded panel's foot, and
// the phone bar — and those are three sizes of the same control rather than
// three controls. Everything but the trigger's dimensions is shared, so a row
// added here shows up in all of them.

import { BellIcon } from "lucide-react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ALERT_ICONS, notificationsFor } from "@/lib/notifications"
import { useCurrentOrg } from "@/layouts/app-shell"
import { orgUrl } from "@/lib/host"
import { domainBySlug, locationHref, ORGS, orgHref, type Org } from "@/lib/scope"
import { cn } from "@/lib/utils"

export function NotificationsMenu({
  align = "end",
  className,
  cleared,
  iconClassName = "size-3.5",
  org,
  read,
  side,
}: {
  readonly align?: "start" | "end"
  /**
   * Ids cleared on the alert rail.
   *
   * The rail and this menu are two views of one list, so something dismissed
   * over there has to be gone from in here — a bell that kept showing what you
   * had just cleared would make the rail look like it had only hidden it.
   *
   * Absent on the workspace picker, where there is no shell and so no rail to
   * have cleared anything from.
   */
  readonly cleared?: readonly string[]
  /** Ids opened on the alert rail, for the same reason `cleared` is here: an
   *  alert you have read is read in both places, so the bell's dot and its "n
   *  new" go quiet with the tile's rather than a beat behind it. */
  readonly read?: readonly string[]
  /** The trigger's own shape. The rail passes its 32px tile, the two chrome rows
   *  pass their 28px button — the badge and the glyph are the same either way. */
  readonly className?: string
  readonly iconClassName?: string
  /**
   * Whose notifications. Absent on the workspace picker, where the answer is
   * everyone's — there is no workspace selected, so narrowing to one would be
   * picking a company on your behalf and hiding the other's alerts behind that
   * choice. Every row then carries the workspace it came from, since that is the
   * fact the heading can no longer state once.
   */
  readonly org?: Org
  readonly side?: "bottom" | "right" | "top"
}) {
  const current = useCurrentOrg()
  const scope = org ? [org] : ORGS

  // Per workspace, and resolved against what the workspace can actually open: a
  // row pointing at an app this org is not entitled to would be a dead link, and
  // dropping it here is cheaper than every row checking at render.
  const items = scope
    .flatMap((owner) =>
      notificationsFor(owner.slug)
        .filter((item) => !cleared?.includes(item.id))
        .map((item) => {
          const domain = domainBySlug(item.target.domain, owner)
          if (!domain) return undefined
          const site = item.target.site
            ? owner.locations.find((location) => location.slug === item.target.site)
            : undefined
          // A site that no longer exists loses only its scope, not its row — the
          // fact is still true of the org, and it lands on the org's section.
          const path =
            site && domain.siteGroups.length
              ? locationHref(domain, site, item.target.section)
              : orgHref(domain, item.target.section)
          // A path inside the workspace it belongs to, and absolute only when the
          // row is another workspace's. Nearly every notification used to cross an
          // origin — a safety alert raised in Compliance and read from Operations
          // was a document load — and now none of them do unless you are looking
          // at a bell that spans companies. `current` is undefined on the picker,
          // where there is no "here" and everything is absolute.
          const href = current && owner.slug === current.slug ? path : orgUrl(owner, path)
          // Resolved here rather than at each of the three places below that ask
          // — the trigger's dot, the heading's count and the row's own colour —
          // so they cannot disagree about what "new" means.
          return {
            ...item,
            href,
            unread: item.unread && !read?.includes(item.id),
            workspace: owner.name,
          }
        }),
    )
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const unread = items.filter((item) => item.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className={cn(
          "grid shrink-0 place-items-center rounded-md text-muted-foreground/55 transition-colors hover:bg-fill hover:text-foreground",
          className,
        )}
      >
        {/* The dot is positioned against *this* box rather than the button,
            which is the whole reason for the extra element. The button is not
            one size — size-7 in the panel foot, size-8 on the rail — and it does
            not carry the icon at one size either, so a dot inset from the
            button's own corner drifted further from the bell the bigger the
            button got. It was landing right in the panel and adrift on the rail.
            Anchored here it is the same distance from the glyph in both, because
            here there is nothing in the box *but* the glyph. */}
        <span className="relative grid place-items-center">
          <BellIcon className={iconClassName} />
          {/* A dot, not a count. The number is in the menu's own heading, and a
            badge that has to be read is a badge you have to open the menu to
            act on anyway — this only has to say "something is in here".

            Blue rather than the amber this used to be, here and everywhere else
            in the menu. Unread is a state of the inbox, not a severity: the
            colour is saying "there is something in here", and it says that
            whether the something is an incident or a comment. Amber on a
            persistent piece of chrome reads as a warning the app is carrying.

            One flat 500 for the dot, where the text below steps 600/400 across
            the themes. That step is for things that have to be *read* and so
            have to hold a contrast ratio against a ground that moves. This is a
            6px disc with nothing inside it — it only has to be found — and 500
            is saturated enough to carry on #fafafa without glowing on #191919. */}
          {/* Centred on the icon box's own top-right corner — `top-0 right-0`
              for the corner, the half-translates to sit the disc *on* it rather
              than inside it. No pixel insets, so it holds wherever the icon is
              sized. */}
          {unread ? (
            <span
              aria-hidden
              className="absolute top-0 right-0 size-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-500"
            />
          ) : null}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="min-w-80" side={side} sideOffset={4}>
        <div className="flex items-baseline gap-2 px-2 py-1">
          <p className="text-[10px] font-medium text-muted-foreground">Notifications</p>
          {/* Names the workspace, because the list is that workspace's. Switching
              workspace changes what is in here, and a bell that said nothing
              about scope would make that look like things disappearing. With no
              workspace open the scope is all of them, and it says so — the rows
              below then carry which one each came from. */}
          <p className="min-w-0 flex-1 truncate text-[10px] text-muted-foreground/60">
            {org ? org.name : "All workspaces"}
          </p>
          {/* 600/400 rather than the dot's flat 500: this is 10px text and has
              to clear 4.5:1 on both grounds, which a 500 does on neither —
              3.7:1 on white, 4.2:1 on the dark menu. Same blue, stepped to stay
              legible, exactly as the amber it replaced was. The row glyphs
              below take the same pair. */}
          {unread ? (
            <span className="shrink-0 text-[10px] font-medium text-blue-600 dark:text-blue-400">
              {unread} new
            </span>
          ) : null}
        </div>

        {items.length === 0 ? (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            Nothing needs you right now.
          </p>
        ) : (
          items.map((item) => {
            const Icon = ALERT_ICONS[item.kind]
            return (
              <DropdownMenuItem
                className="items-start gap-2 px-2 py-1.5 text-xs"
                key={item.id}
                nativeButton={false}
                render={<Link href={item.href} />}
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0",
                    item.unread
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground",
                  )}
                />
                <span className="min-w-0 flex-1">
                  {/* Two lines: what happened, then where. The where is what
                      tells two identical incidents apart, and it is the half you
                      scan when three rows say the same thing. */}
                  <span className="block text-foreground">{item.title}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-muted-foreground/70!">
                    {item.detail}
                  </span>
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {item.meta}
                </span>
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
