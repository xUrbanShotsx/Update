"use client"
// The settings frame Account and Preferences share, in two layouts: a rail with
// one panel beside it, or every section stacked in one scroll.

import {
  BellIcon,
  Building2Icon,
  KeyboardIcon,
  MonitorIcon,
  SunMoonIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react"
import { useState, type ReactNode } from "react"

import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

/**
 * Keyed by panel, the same trick the sidebar uses for its sections — and here it
 * is load-bearing rather than tidy. These pages are server components, and a
 * component reference is not something that survives the trip to a client one,
 * so the panel hands over a string and the glyph is looked up on this side.
 */
const PANEL_ICONS: Record<string, LucideIcon> = {
  profile: UserIcon,
  organisations: Building2Icon,
  sessions: MonitorIcon,
  appearance: SunMoonIcon,
  notifications: BellIcon,
  keyboard: KeyboardIcon,
}

export type SettingsPanel = {
  /** Doubles as the icon lookup, so a panel can't be added without deciding what
   *  it looks like. */
  key: string
  /** The rail's word for it — one or two, since the rail is narrow. */
  label: string
  /** The heading over the panel itself. Usually the label again; sometimes
   *  longer, because a heading has room the rail doesn't. */
  title: string
  description: string
  content: ReactNode
}

/**
 * Two layouts, and the choice is about how much there is rather than about
 * taste.
 *
 * `panes` is one panel at a time behind a rail. It earns its click when the
 * sections are long and unrelated — Account's are a profile, a list of
 * companies and a list of devices, and stacking those makes you scroll past two
 * you didn't come for to reach the one you did.
 *
 * `stacked` is all of them in one scroll, no rail. It is the better answer when
 * the sections are short: Preferences is a theme picker and a notification
 * matrix, and a rail in front of two rows of switches is a table of contents for
 * a page you can see all of — a click, a pane and 208px of width spent to hide
 * something that already fitted.
 *
 * Below `md` the rail turns into a strip above the content — the same choice in
 * the same order, laid the way there is room for.
 */
export function SettingsPanels({
  layout = "panes",
  panels,
  surface = "page",
}: {
  /** See above. `panes` unless the sections are short enough to read at once. */
  readonly layout?: "panes" | "stacked"
  readonly panels: readonly SettingsPanel[]
  /**
   * Which scroll region the panel body gets. On a page it is `PageScroll`, whose
   * `data-more-*` attributes the card reads to square its own edges off. In a
   * dialog that reporting is meaningless — the dialog has its own edges and the
   * card is behind a backdrop — so it takes a plain scroller and a fixed height,
   * since a dialog has no parent flex row to be told how tall it is.
   */
  readonly surface?: "page" | "dialog"
}) {
  const [activeKey, setActiveKey] = useState(panels[0]?.key ?? "")
  const active = panels.find((panel) => panel.key === activeKey) ?? panels[0]
  const stacked = layout === "stacked"

  /** One section, drawn the same way in both layouts — the heading, the line
   *  under it, the content. Only how many of them are on screen differs. */
  const section = (panel: SettingsPanel, first: boolean) => (
    <section
      // A rule above every section but the first, where `panes` needs none:
      // there is only ever one, and a line over a lone heading is a lid.
      className={cn(stacked && !first && "mt-8 border-t pt-8")}
      key={panel.key}
    >
      <h2 className="text-lg font-semibold tracking-tight">{panel.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{panel.description}</p>
      <div className="mt-6">{panel.content}</div>
    </section>
  )

  const body = (
    <div
      className={cn(
        "mx-auto w-full px-6 py-8",
        surface === "page" ? "max-w-2xl" : "max-w-none px-5 py-6",
      )}
    >
      {stacked
        ? panels.map((panel, index) => section(panel, index === 0))
        : active
          ? section(active, true)
          : null}
    </div>
  )

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col md:flex-row",
        // Taller, and capped against the viewport rather than fixed: a
        // dialog is centred, so a height that fits a laptop can run off the top
        // and bottom of a short window with no way to scroll to either. The
        // panel inside scrolls; the shell around it should never need to.
        surface === "page" ? "flex-1" : "h-[min(34rem,72dvh)]",
      )}
    >
      {/* Not rendered at all when stacked, rather than hidden: an invisible rail
          is still a tab stop and still a list a screen reader reads out.

          Wider on a page than in the dialog. A page has the width to spend and
          the labels sit better with room around them; the dialog is narrower,
          where every pixel the rail takes comes straight off the panel — which
          is the whole argument for `stacked` dropping it. */}
      {stacked ? null : (
        <aside
          className={cn(
            "shrink-0 border-b p-2 md:border-r md:border-b-0",
            surface === "page" ? "md:w-60" : "md:w-52",
          )}
        >
          {/* Horizontal and scrollable on a phone, a column from `md`. The rail is
              the same list either way; only its axis changes. */}
          <nav className="thin-scrollbar flex gap-1 overflow-x-auto md:flex-col md:overflow-x-visible">
            {panels.map((panel) => {
              const Icon = PANEL_ICONS[panel.key] ?? UserIcon
              const on = panel.key === active?.key
              return (
                <button
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    // The nav row from the sidebar, at page scale: same height,
                    // same radius, same two states. Settings that invented their
                    // own row would be the second kind of list in one window.
                    "flex h-7 shrink-0 items-center gap-2 rounded-md px-2.5 text-left text-sm transition-colors",
                    on
                      ? "bg-fill text-foreground"
                      : "text-muted-foreground hover:bg-fill hover:text-foreground",
                  )}
                  key={panel.key}
                  onClick={() => setActiveKey(panel.key)}
                  type="button"
                >
                  <Icon className="size-3.5 shrink-0" />
                  {panel.label}
                </button>
              )
            })}
          </nav>
        </aside>
      )}

      {/* The scroll belongs to the panel, not the surface around it — the rail
          stays put while the content moves. On a page that scroller is
          `PageScroll`, so the card keeps reading the one region that actually
          scrolls; in a dialog it is a plain one, because there is no card
          listening. */}
      {surface === "page" ? (
        <PageScroll>{body}</PageScroll>
      ) : (
        <div className="thin-scrollbar min-w-0 flex-1 overflow-y-auto overscroll-contain">
          {body}
        </div>
      )}
    </div>
  )
}
