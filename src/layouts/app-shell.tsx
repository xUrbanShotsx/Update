"use client"

import { usePathname } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { ShellLoader } from "@/components/shared/shell-loader"
import { useIsTablet } from "@/hooks/use-tablet"
import { AppSidebar } from "@/layouts/app-sidebar"
import { AppBar } from "@/layouts/app-bar"
import { AlertRail } from "@/layouts/alert-rail"
import { SecondarySidebar } from "@/layouts/secondary-sidebar"
import {
  clearAlert,
  DEFAULT_ALERT_PREFS,
  markAlertRead,
  restoreCleared,
  serialiseAlertPrefs,
  toggleAlertPin,
  type AlertPrefs,
} from "@/lib/alert-prefs"
import {
  DEFAULT_LOCATION_PREFS,
  serialiseLocationPrefs,
  togglePinned,
  type LocationPrefs,
} from "@/lib/location-prefs"
import {
  DEFAULT_PREFERENCES,
  serialisePreferences,
  type Preferences,
} from "@/lib/preferences"
import {
  DEFAULT_RECENT_PAGES,
  pushRecentPage,
  serialiseRecentPages,
  type RecentPages,
} from "@/lib/recent-pages"
import { DEFAULT_ORG, ORGS, scopeFromPath, type Org } from "@/lib/scope"
import {
  ALERT_RAIL_WIDTH,
  DEFAULT_SIDEBAR,
  RAIL_WIDTH,
  SECONDARY_BREAK,
  SECONDARY_MIN,
  SECONDARY_SOFT_MAX,
  SIDEBAR_MAX,
  SIDEBAR_MIN,
  serialiseSidebar,
  type SidebarState,
} from "@/lib/sidebar-state"
import { cn } from "@/lib/utils"

/** The 12px seam on the sidebar's right edge. The grab pill only fades in after
 *  a full second of hover, or immediately once a drag starts. */
function SidebarResizeHandle({
  offset = 0,
  onResize,
  side = "left",
  width,
}: {
  /**
   * How far in from the window edge the panel this handle drags actually
   * starts — the app rail, for the right-hand one.
   *
   * Both things this component does are measured from that edge, so both have to
   * know about it: where the seam is drawn, and what a pointer position means in
   * panel widths. Adding it to only the first would put the handle in the right
   * place and have the panel jump 44px the moment you took hold of it.
   */
  readonly offset?: number
  /** The raw distance from the panel's own edge, unclamped. Each panel has its
   *  own idea of the limits — the secondary's top end is a detent rather than a
   *  stop — so the clamping belongs to the caller, not here. */
  readonly onResize: (distance: number) => void
  /** Which edge of the window the panel is pinned to. A left panel's width is
   *  the pointer's x; a right panel's is the distance back from the far edge. */
  readonly side?: "left" | "right"
  readonly width: number
}) {
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [timer, setTimer] = useState<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timer !== null) window.clearTimeout(timer)
    setTimer(null)
  }, [timer])

  useEffect(
    () => () => {
      if (timer !== null) window.clearTimeout(timer)
    },
    [timer],
  )

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault()
    setDragging(true)
    setVisible(true)
    // On the body rather than the handle: once the pointer leaves the 12px
    // seam mid-drag — which it does immediately — only a document-level cursor
    // keeps the resize affordance on screen.
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"

    const handleMove = (moveEvent: PointerEvent) => {
      onResize(
        side === "left"
          ? moveEvent.clientX
          : window.innerWidth - moveEvent.clientX - offset,
      )
    }
    const handleUp = () => {
      setDragging(false)
      setVisible(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
  }

  return (
    <div
      aria-hidden
      // The seam straddles the boundary rather than sitting beside it, so the
      // half-width shift flips with the edge it is pinned to.
      className={cn(
        "absolute inset-y-0 z-20 hidden w-3 cursor-col-resize lg:block",
        side === "left" ? "-translate-x-1/2" : "translate-x-1/2",
      )}
      onMouseEnter={() => {
        clearTimer()
        setTimer(window.setTimeout(() => setVisible(true), 1000))
      }}
      onMouseLeave={() => {
        clearTimer()
        if (!dragging) setVisible(false)
      }}
      onPointerDown={handlePointerDown}
      style={side === "left" ? { left: width } : { right: width + offset }}
    >
      <div
        className={cn(
          "absolute top-1/2 left-1/2 h-12 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/40 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  )
}

/**
 * The controls the page's own header owns: collapsing the primary column on
 * desktop, raising the drawer below `lg` where there is no column at all, and
 * opening the secondary panel on the right.
 *
 * Pinning is here too, because a site can be pinned from its own page as well as
 * from the row in the sidebar, and both have to be acting on one list. The
 * header could not hold that state itself — it unmounts on every navigation.
 */
type NavControls = {
  locationPrefs: LocationPrefs
  openNav: () => void
  /** Whether the agent is out. The page header reads it to collapse itself to a
   *  pill on a phone, where the agent takes the screen and the header is the
   *  only part of the page left. */
  secondaryOpen: boolean
  togglePin: (locationSlug: string) => void
  togglePrimary: () => void
  toggleSecondary: () => void
}

/**
 * The persisted layout plus one transient flag. `foldedByDrag` records that the
 * secondary's drag is what folded the nav, so pulling that drag back can unfold
 * it — and only then, since a nav you collapsed yourself is a decision no
 * amount of dragging over here should undo. It lives in state rather than a ref
 * because the resize handler decides from it *and* rewrites it: doing that to a
 * ref inside a state updater breaks under StrictMode, which double-invokes
 * updaters and would see the flag already cleared on the second pass.
 * `serialiseSidebar` picks its fields explicitly, so this never reaches the
 * cookie — after a reload a folded nav is simply the state you saved.
 */
type ShellState = SidebarState & { foldedByDrag: boolean }

const NavContext = createContext<NavControls | null>(null)

export function useNavControls() {
  return useContext(NavContext)
}

/**
 * The workspace this document belongs to.
 *
 * It is the subdomain, which makes it a property of the *request* rather than of
 * the route — constant for the life of the page, and unknowable to a client
 * component on its own. The server layout reads the host and hands the slug
 * down; this is where the rest of the tree picks it up, so nothing below has to
 * touch `location.hostname` and risk rendering one tenant on the server and
 * another on hydration.
 *
 * Non-null by construction inside the shell: the layout 404s a hostname naming
 * no workspace before this component is reached. The default is there for the
 * two screens *outside* the shell — the picker and whatever the account menu is
 * mounted on — where `useCurrentOrg` is legitimately answering "none".
 */
const OrgContext = createContext<Org>(DEFAULT_ORG)

export function useCurrentOrg(): Org {
  return useContext(OrgContext)
}

/**
 * The app shell — the sidebar column on the left, the page floating beside it
 * as a rounded card.
 *
 * The sidebar's width and collapsed state round-trip through a cookie
 * (`initialSidebar` comes from the root layout), so a reload paints what you
 * left rather than snapping back to the defaults.
 */
export function AppShell({
  children,
  orgSlug,
  initialAlerts,
  initialLocations,
  initialPreferences,
  initialRecent,
  initialSidebar,
}: {
  readonly children: React.ReactNode
  /** Cleared and pinned alert ids, so the rail paints the column you left rather
   *  than filling it and then emptying it a frame after hydration. */
  readonly initialAlerts?: AlertPrefs
  readonly initialLocations?: LocationPrefs
  readonly initialPreferences?: Preferences
  readonly initialRecent?: RecentPages
  readonly initialSidebar?: SidebarState
  /** The slug, not the `Org` — a server layout can only hand a client one values
   *  that survive serialisation, and this is resolved back below. */
  readonly orgSlug: string
}) {
  const [sidebar, setSidebar] = useState<ShellState>({
    ...(initialSidebar ?? DEFAULT_SIDEBAR),
    foldedByDrag: false,
  })
  // Held here rather than in the sidebar because the sidebar is mounted twice —
  // the desktop column and the mobile drawer — and two copies of this would
  // drift the moment one of them pinned something.
  const [locations, setLocations] = useState<LocationPrefs>(
    initialLocations ?? DEFAULT_LOCATION_PREFS,
  )
  // Here for the same reason as `locations`: the preferences dialog is mounted
  // twice — once in the desktop column's sidebar, once in the drawer's — and two
  // copies of this would disagree the moment one of them was used.
  const [preferences, setPreferences] = useState<Preferences>(
    initialPreferences ?? DEFAULT_PREFERENCES,
  )
  // Here rather than in the sidebar for the same reason as the two above: the
  // panel is mounted twice, and two histories would disagree the moment you
  // navigated with the drawer open.
  const [recent, setRecent] = useState<RecentPages>(initialRecent ?? DEFAULT_RECENT_PAGES)
  // The rail is mounted once, so this could have lived inside it — but the bell
  // in the sidebar's foot draws the same list, and the two must never disagree
  // about what has been cleared. One owner up here is what makes clearing an
  // alert on the rail empty it from the bell in the same frame, instead of
  // leaving it sitting there as though nothing had happened.
  const [alerts, setAlerts] = useState<AlertPrefs>(initialAlerts ?? DEFAULT_ALERT_PREFS)
  // Which panel is under the pointer, not merely that one is: only the panel
  // being dragged must track it 1:1. The other is moving as a *consequence* of
  // that drag — the nav folding when the secondary breaks through — and should
  // ease like it does under any other command.
  const [resizing, setResizing] = useState<"primary" | "secondary" | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  // How the drawer was raised, not merely that it was. The mobile bar's
  // magnifier has to land you in the search rather than beside it, and the
  // drawer is mounted fresh each time it opens — so this is read by a lazy
  // initialiser inside it rather than pushed in after the fact.
  const [drawerSearch, setDrawerSearch] = useState(false)
  const pathname = usePathname()

  /**
   * That the nav has been backed out of, rather than which level it is on.
   *
   * The panel's depth is the URL's: a site's nav for a site URL, a section's for
   * a section that opens one. This is the one exception, and it is deliberately
   * the smaller fact — "you pressed back" rather than "you are at level 0" — so
   * there is no second notion of depth to keep honest against the first.
   *
   * Backing out is a nav move and not a page move. Pressing it while reading a
   * project leaves the project on screen and puts the list it came from back in
   * the panel, which is the whole point: looking at where else you could go
   * should not cost you where you are.
   *
   * Here rather than in the sidebar because the panel is mounted up to three
   * times — the desktop column, the tablet rail, the drawer — and three copies
   * of this would disagree the moment one of them was used.
   *
   * Not persisted, unlike the widths. It describes a glance rather than a
   * preference, and a reload landing on a page whose nav had been backed out of
   * in some earlier session would be a panel that opened at the wrong depth for
   * no reason the URL could explain.
   */
  const [navPopped, setNavPopped] = useState(false)

  /**
   * Any navigation hands the panel back to the URL.
   *
   * This is what makes the exception above stay small. Backing out is a state
   * that survives exactly until you go somewhere — press a row and the panel is
   * once again simply what the address says it is, so the two can never drift
   * apart for longer than a glance.
   */
  useEffect(() => setNavPopped(false), [pathname])
  // Between `md` and `lg` the shell is the desktop one — a column beside the
  // page rather than a drawer over it — but the column is pinned to the rail.
  // There is room for 48px of nav and the page; there is not room for 260px of
  // nav, the page, and anything to read on it.
  const isTablet = useIsTablet()

  /**
   * The app being navigated to, or `null` when nothing is in flight.
   *
   * Switching app is a same-origin navigation again, so this component survives
   * it and the cover can do what a cover should: go up on the click, come down
   * when the new nav is actually on screen. While the app was the origin it
   * could do neither — the document was torn down mid-flight, so the overlay was
   * raised and then simply ceased to exist, and the "arrival" it was waiting for
   * happened in a different page.
   *
   * What is kept from that period is the minimum hold. A switch that resolves in
   * 20ms reads as a flicker rather than as a transition, and a beat is what
   * makes the whole nav changing legible.
   */
  const [switching, setSwitching] = useState<string | null>(null)

  /** Back from the slug the layout serialised. The fallback is unreachable —
   *  the layout 404s an unknown host before rendering this — and is there so the
   *  context can be non-null for every consumer. */
  const org = ORGS.find((item) => item.slug === orgSlug) ?? DEFAULT_ORG

  /**
   * How much of the right edge the alert rail is holding, which is zero once it
   * is shut.
   *
   * One question now, where the app rail also had to ask whether the workspace
   * had more than one app to switch between. Every workspace has alerts, and a
   * rail with nothing in it is still the column that says so — it does not bow
   * out on empty, because "nothing needs you" is the answer people are looking
   * for rather than the absence of one.
   *
   * Getting this wrong is invisible until you drag the agent panel, and then it
   * is 44px of lag.
   */
  const railWidth = sidebar.alerts ? ALERT_RAIL_WIDTH : 0

  /**
   * Raise the cover. The link navigates on its own — this only marks that the
   * document is on its way out.
   *
   * No arrival to wait for and no minimum hold, which is the difference between
   * this and what it replaced. A workspace is another origin, so the browser
   * tears this document down and builds another; the cover is up until that
   * happens and then it is gone with everything else. Nothing here has to decide
   * when it has landed, because nothing here is still running when it does.
   */
  const beginWorkspaceSwitch = useCallback((to: string) => setSwitching(to), [])

  /**
   * Take it down again if the document turns out *not* to have gone.
   *
   * Two ways that happens and both leave a permanent cover otherwise. The
   * browser's back button restores this page from the back/forward cache with
   * every bit of state exactly as it was — including a cover raised for a
   * navigation that has already been and gone. And a cross-origin load that
   * fails, or that the user cancels, leaves the document sitting here with the
   * shell hidden behind a spinner naming a company it never reached.
   *
   * `pageshow` covers the first; regaining visibility covers the second, since a
   * tab you are looking at again is a tab that stayed.
   */
  useEffect(() => {
    if (switching === null) return
    const clear = () => setSwitching(null)
    const onVisible = () => {
      if (document.visibilityState === "visible") clear()
    }
    window.addEventListener("pageshow", clear)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.removeEventListener("pageshow", clear)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [switching])

  useEffect(() => setHydrated(true), [])

  // The drawer does *not* close on navigation. It used to, on the reasoning that
  // a nav over the page you just asked for is in the way — but that made it a
  // one-shot: every second page meant reopening it, and reading down a register
  // section by section was a tap of nav for every tap of content.
  //
  // Open until dismissed, then. The backdrop and the row that raised it both
  // still shut it, which is the whole of the way out, and the panel is showing
  // the page you are on the moment you land there.

  // Touching either panel directly takes the nav back under manual control, so
  // a later drag won't second-guess the decision.
  const togglePrimary = useCallback(() => {
    setSidebar((current) => ({ ...current, open: !current.open, foldedByDrag: false }))
  }, [])
  const toggleSecondary = useCallback(() => {
    setSidebar((current) => ({
      ...current,
      secondary: !current.secondary,
      foldedByDrag: false,
    }))
  }, [])
  /** The alert rail. Not `foldedByDrag`-aware like the two panels above: nothing
   *  drags this one, so hiding it is only ever a decision. */
  const toggleAlerts = useCallback(() => {
    setSidebar((current) => ({ ...current, alerts: !current.alerts }))
  }, [])
  const handleClearAlert = useCallback((id: string) => {
    setAlerts((current) => clearAlert(current, id))
  }, [])
  /** Fires on every popover open, so `markAlertRead` returns the same object for
   *  an alert already read — which is what keeps the second look from rewriting
   *  the cookie and re-rendering the shell. */
  const handleOpenAlert = useCallback((id: string) => {
    setAlerts((current) => markAlertRead(current, id))
  }, [])
  const handleToggleAlertPin = useCallback((id: string) => {
    setAlerts((current) => toggleAlertPin(current, id))
  }, [])
  const handleRestoreAlerts = useCallback(() => {
    setAlerts((current) => restoreCleared(current))
  }, [])
  const handleTogglePin = useCallback((locationSlug: string) => {
    setLocations((current) => togglePinned(current, locationSlug))
  }, [])

  /**
   * ⌘, and ⌘. — one panel each, left and right.
   *
   * Bound here rather than beside ⌘K in the sidebar. That handler exists inside
   * a component the shell mounts three times, and pays for it with an
   * `ownsShortcuts` prop to pick which copy listens; these two act on the shell's
   * own state and the shell is mounted once, so there is nobody to arbitrate
   * with. The comma and the full stop also read as a pair on the keyboard, which
   * is worth something for two chords that do mirrored things.
   *
   * `preventDefault` matters more than usual: ⌘, is the browser's own settings
   * shortcut, and without this the panel would toggle behind a settings tab.
   * Taking it is a real cost — it is the macOS convention for an app's
   * preferences, and this app has a preferences dialog it no longer opens.
   *
   * Below `lg` the left panel is a drawer rather than a column, so there is
   * nothing to collapse and the chord raises and dismisses that instead. Read
   * from `matchMedia` at press time rather than from a hook: it costs no render,
   * and a stale breakpoint would send the chord to the wrong panel.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return
      if (event.key === ",") {
        event.preventDefault()
        if (window.matchMedia("(min-width: 64rem)").matches) togglePrimary()
        else setDrawerOpen((open) => !open)
        return
      }
      if (event.key === ".") {
        event.preventDefault()
        toggleSecondary()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [togglePrimary, toggleSecondary])

  // `locations` in the deps, so the header's pin redraws when the sidebar's does
  // — they are two views of one list and must never disagree about it. That does
  // mean every consumer re-renders on a pin; the consumers are the page header
  // and nothing else, so the memo is still doing its job for the resize path,
  // which is the one that fires per frame.
  const navControls = useMemo<NavControls>(
    () => ({
      locationPrefs: locations,
      openNav: () => {
        setDrawerSearch(false)
        setDrawerOpen(true)
      },
      secondaryOpen: sidebar.secondary,
      togglePin: handleTogglePin,
      togglePrimary,
      toggleSecondary,
    }),
    [handleTogglePin, locations, sidebar.secondary, togglePrimary, toggleSecondary],
  )

  // The same idea one level up: every page rather than only the sites, so the
  // search panel can offer where you have been instead of the whole nav again.
  // Only paths the resolver understands are recorded — a 404 is not somewhere
  // you were, and storing one would put a dead row in the list.
  useEffect(() => {
    const scope = scopeFromPath(pathname, org)
    if (!scope) return
    // Just the path. It names the app again — `/compliance/insights` — and the
    // cookie is host-only, so the workspace is the origin's to remember. Both
    // the `app` field and the org keying this used to need are gone.
    setRecent((current) => pushRecentPage(current, pathname))
  }, [org, pathname])

  // Marks the document while the window is being dragged, which the stylesheet
  // reads to suspend every transition in the tree — see the `[data-resizing]`
  // rule. An attribute rather than state: this fires many times a second, and a
  // re-render per frame to switch off some animations would be its own problem.
  //
  // Trailing rather than leading edge on the way out: 150ms of quiet is what
  // counts as "stopped", so the layout settles at its final size before anything
  // is allowed to ease again.
  useEffect(() => {
    let timer = 0
    const onResize = () => {
      document.documentElement.setAttribute("data-resizing", "")
      window.clearTimeout(timer)
      timer = window.setTimeout(
        () => document.documentElement.removeAttribute("data-resizing"),
        150,
      )
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      window.clearTimeout(timer)
      document.documentElement.removeAttribute("data-resizing")
    }
  }, [])

  // Mirror the state back into the cookie on every change, so the next server
  // render already knows the width.
  useEffect(() => {
    // `cookieStore` would be the modern call, but Safari and Firefox don't
    // carry it yet and this has to work everywhere.
    // biome-ignore lint/suspicious/noDocumentCookie: cookieStore lacks the support this needs.
    document.cookie = serialiseSidebar(sidebar)
  }, [sidebar])

  // Its own cookie rather than a field on the sidebar's: this outlives a panel
  // width, and the two are written at completely different rates.
  useEffect(() => {
    // biome-ignore lint/suspicious/noDocumentCookie: cookieStore lacks the support this needs.
    document.cookie = serialiseLocationPrefs(locations)
  }, [locations])

  // Its own cookie for the same reason as the sites': this outlives a panel
  // width, and clearing an alert has nothing to do with how wide the nav is.
  useEffect(() => {
    // biome-ignore lint/suspicious/noDocumentCookie: cookieStore lacks the support this needs.
    document.cookie = serialiseAlertPrefs(alerts)
  }, [alerts])

  useEffect(() => {
    // biome-ignore lint/suspicious/noDocumentCookie: cookieStore lacks the support this needs.
    document.cookie = serialiseRecentPages(recent)
  }, [recent])

  // No save button anywhere in the dialog, so this is what saving is: the change
  // lands in state and is in the cookie by the next frame.
  useEffect(() => {
    // biome-ignore lint/suspicious/noDocumentCookie: cookieStore lacks the support this needs.
    document.cookie = serialisePreferences(preferences)
  }, [preferences])

  const handleResize = useCallback((distance: number) => {
    setResizing("primary")
    setSidebar((current) => ({
      ...current,
      width: Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, distance)),
    }))
  }, [])

  const handleSecondaryResize = useCallback((distance: number) => {
    setResizing("secondary")
    setSidebar((current) => {
      // Half the window, never less than the detent — on a narrow window the
      // two would otherwise cross and the panel could not reach its own stop.
      const hardMax = Math.max(SECONDARY_SOFT_MAX, Math.floor(window.innerWidth / 2))
      const clamp = (value: number) => Math.min(hardMax, Math.max(SECONDARY_MIN, value))

      // While the nav is still out, the soft max is a detent: the panel holds
      // there until the pointer has travelled a further SECONDARY_BREAK, and
      // breaking through is what folds the nav away.
      if (current.open && distance > SECONDARY_SOFT_MAX) {
        if (distance < SECONDARY_SOFT_MAX + SECONDARY_BREAK) {
          return { ...current, secondaryWidth: SECONDARY_SOFT_MAX }
        }
        return {
          ...current,
          open: false,
          foldedByDrag: true,
          secondaryWidth: clamp(distance),
        }
      }

      // And the way back, with the same detent in reverse: coming down past the
      // soft max the panel catches there and holds while the pointer travels
      // the same SECONDARY_BREAK, then releases and brings the nav back with
      // it. Both directions therefore stick for 64px and let go with the same
      // 64px jump — the resistance reads the same going either way, and the
      // hold is what stops the two trading places around 520.
      //
      // Only a nav *this* drag folded: `foldedByDrag` false means you collapsed
      // it yourself, and then there is no detent here at all.
      if (!current.open && current.foldedByDrag && distance < SECONDARY_SOFT_MAX) {
        if (distance > SECONDARY_SOFT_MAX - SECONDARY_BREAK) {
          return { ...current, secondaryWidth: SECONDARY_SOFT_MAX }
        }
        return {
          ...current,
          open: true,
          foldedByDrag: false,
          secondaryWidth: clamp(distance),
        }
      }

      return { ...current, secondaryWidth: clamp(distance) }
    })
  }, [])

  // Width changes animate, except while dragging — a drag must track the
  // pointer 1:1 rather than easing behind it.
  useEffect(() => {
    if (!resizing) return
    const stop = () => setResizing(null)
    window.addEventListener("pointerup", stop)
    return () => window.removeEventListener("pointerup", stop)
  }, [resizing])

  return (
    <OrgContext.Provider value={org}>
      <NavContext.Provider value={navControls}>
        {/* `dvh`: the shell is exactly the visible area and the document never
          scrolls. Sizing it to `lvh` made it scrollable, which is what gets
          Safari to collapse its bottom toolbar — but the scroll *is* the shell
          moving, so the header and the rail slid up by the bar's height on the
          way. Keeping them still is worth more than reclaiming the strip the bar
          sits on; that strip is the browser's, and `theme-color` already tints
          it to match. Added to the Home Screen there is no bar at all.

          `env(safe-area-inset-*)` as padding, now that `viewport-fit: cover`
          lets the document reach the edges: the background runs under the home
          indicator and under a landscape notch, while every row, rail and
          composer stays above them. */}
        <div className="relative flex h-dvh overflow-hidden bg-sidebar text-foreground pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
          {/* Two columns, one per band, and only ever one on screen.

            The rail is `md:block lg:hidden` and the full panel is `lg:block`, so
            which you get is a media query rather than a hook — and that is the
            whole point. A single column switching on `useIsTablet` could not
            answer until after hydration, so every tablet load painted the
            expanded panel for a frame and then collapsed it. CSS decides this
            before paint; the hook below is left deciding only who owns the
            keyboard, which nobody can see happen.

            The cost is one more mounted `AppSidebar`. Every piece of state it
            reads — the segment, the widths, the prefs, the history — is already
            lifted to this component, so the two cannot drift; what they hold of
            their own is a search box and a couple of dialogs, and only the
            visible one is ever typed into. */}
          {/* `w-11` is `RAIL_WIDTH` as a class — the band below `lg` pins the
              rail open, so it hard-codes the width the `lg` column takes from
              the constant. Both are 44, matching the app rail on the far side. */}
          <div className="hidden w-11 shrink-0 overflow-hidden md:block lg:hidden">
            {/* Pinned collapsed, and the stored open state simply not obeyed on
              this band — a panel you left open on a laptop is still open when you
              go back to it.

              There is no column to expand out here, so both the rail's magnifier
              and `/collapse` raise the drawer, which is the only place the full
              nav can go at this width. */}
            <AppSidebar
              alertPrefs={alerts}
              collapsed
              locationPrefs={locations}
              navPopped={navPopped}
              onPreferencesChange={setPreferences}
              onNavPop={() => setNavPopped(true)}
              onNavRestore={() => setNavPopped(false)}
              onWorkspaceSwitch={beginWorkspaceSwitch}
              onRequestSearch={() => {
                setDrawerSearch(true)
                setDrawerOpen(true)
              }}
              onToggleSidebar={() => setDrawerOpen(true)}
              ownsShortcuts={isTablet}
              preferences={preferences}
              recent={recent}
            />
          </div>

          <div
            className={cn(
              "hidden shrink-0 overflow-hidden lg:block",
              // Skipped until hydrated so the panel doesn't animate out from the
              // default width on first paint, and skipped mid-drag so the edge
              // tracks the pointer instead of easing behind it.
              hydrated &&
                resizing !== "primary" &&
                "transition-[width] duration-200 ease-in-out",
            )}
            style={{ width: sidebar.open ? sidebar.width : RAIL_WIDTH }}
          >
            <AppSidebar
              alertPrefs={alerts}
              collapsed={!sidebar.open}
              locationPrefs={locations}
              navPopped={navPopped}
              onPreferencesChange={setPreferences}
              onNavPop={() => setNavPopped(true)}
              onNavRestore={() => setNavPopped(false)}
              onWorkspaceSwitch={beginWorkspaceSwitch}
              onRequestSearch={() => {
                if (!sidebar.open) togglePrimary()
              }}
              onToggleSidebar={togglePrimary}
              ownsShortcuts={!isTablet}
              preferences={preferences}
              recent={recent}
            />
          </div>

          {/* Only while expanded: there is nothing to drag a 48px rail to. The
            handle is `lg:block` in its own right, so the tablet rail is not
            draggable either. */}
          {sidebar.open ? (
            <SidebarResizeHandle onResize={handleResize} width={sidebar.width} />
          ) : null}

          {/* The page and the secondary panel share an axis, and which axis is the
            whole of this change: a row at `lg`, where the panel is a column
            beside the page, and a column below it, where it is a shelf beneath
            one. Same two children, same order — the panel is last, so it is on
            the right in a row and at the bottom in a column. */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
            {/* Phone only, and above the card rather than inside it: it is about
              the app, and the header below it is about the page. At `md` the
              rail arrives carrying the mark itself.

              Gone entirely while the agent is open, because on a phone the agent
              takes the slot directly beneath this — a brand row, then a panel
              with its own head, is two headers stacked in the shortest window
              the app has. The agent's own row names what you are looking at,
              which is the more useful of the two while you are in it.

              Unconditional rather than a class: at `md` and up this is hidden
              anyway, so there is no band where the state and the breakpoint
              disagree. */}
            {sidebar.secondary ? null : <AppBar />}
            {/* Margin on two sides now: `md:ml-0` closes the gutter against the
          nav rail so the card sits flush to it — `md` rather than `lg`, since
          that is where the column starts. Below it the sidebar is hidden
          entirely, so the card takes the full window and needs its left gutter
          back. `min-w-0` lets it shrink as the panel is dragged wider.

          On the right the gutter closes only while there is something to close
          it against. With the app rail out the card meets it the way it meets
          the nav — flush, with the 8px the rail keeps around its own tiles doing
          the separating. Hide the rail and that edge faces the window again, so
          the margin comes back; without this the card sat 8px short of the right
          edge and 8px proud of every other one, which reads as the layout being
          off-centre rather than as a rail having gone.

          Keyed on `railWidth` rather than on `sidebar.apps`, so the org with one
          app — where the rail renders nothing at all — gets its gutter too.

          `mt-0` below `md` for the same reason on the other axis: the phone bar
          is directly above, so the card meets it the way it meets the rail
          — flush, with its own radius and hairline drawing the seam. The gutter
          comes back at `md`, where the bar is gone and the top edge faces the
          window again. */}
            <main
              className={cn(
                // Last on a phone, where the agent panel takes the slot above it.
                // `md:order-none` puts every child back to source order, which is
                // the arrangement the other two bands want.
                "order-3 md:order-none",
                // Shadow in dark only, where the page is the lighter surface and
                // sits above its ground. In light it sits below, and a drop shadow
                // there only muddied the seam the border already draws.
                "m-2 mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-background md:mt-2 md:ml-0 dark:shadow-sm",
                railWidth > 0 && "mr-0",
                // Same trick on whichever edge the panel is against: the bottom
                // below `lg`, the right at it. Flush when it's out, full gutter
                // when it isn't.
                // Flush against whichever edge the panel is on, and only that
                // one: the top on a phone — where `mt-0` is already set for the
                // app bar and now serves the panel too — the bottom on a tablet,
                // the right at `lg`.
                sidebar.secondary && "md:mb-0 lg:mr-0 lg:mb-2",
                // On a phone with the agent open the page gives up everything but
                // its header — 44px of card plus its two hairlines, pinned to the
                // bottom edge. The header is the part that has to survive: the
                // toggle that closes the agent lives in it, and a panel you cannot
                // dismiss from the screen it covers is a trap.
                //
                // `flex-none` so the height is taken from the height property
                // rather than from the flex line, which is what lets the agent
                // above claim the rest.
                // …and what is left reads as a pill rather than a cropped page:
                // hugging its own title, centred, fully rounded. A 44px strip the
                // width of the window still looks like a document with its body
                // cut off; a pill looks like what it is, the page waiting under
                // the thing you opened over it.
                sidebar.secondary &&
                  "max-md:h-[calc(2.75rem+2px)] max-md:w-auto max-md:flex-none max-md:mx-auto max-md:rounded-full",
                // An edge is squared off only while there is still content past
                // it — the cut-off corner is what says so — and only on the edges
                // that are free to say it. Reach the end and that side's gutter,
                // radius and border come back, because by then the edge would be
                // claiming something that isn't true.
                //
                // The left is never one of them: it is the layout's anchor, the
                // line the nav meets the card along and the one the eye uses to
                // find the page, so it stays rounded however far a board has been
                // scrolled sideways.
                //
                // The top squares off like the others, but only from `md`. Below
                // it the card's top edge faces the phone bar rather than the
                // window — the same seam the left edge has against the rail — and
                // a squared corner there would be claiming the page runs off the
                // top of the screen when it runs under a toolbar.
                "md:has-[[data-more-above]]:mt-0 md:has-[[data-more-above]]:rounded-t-none! md:has-[[data-more-above]]:border-t-0!",
                //
                // Read off the scroll region's own attribute with `:has()` rather
                // than through React state. That is what keeps it flash-free: the
                // page declares `overflows` and the server emits the attribute, so
                // the very first paint is already right. State here could only be
                // corrected after hydration, ~40ms in, which reads as a flash.
                //
                // `!` on the radius and border: `rounded-2xl` and `border` are
                // separate tailwind-merge keys from their one-sided forms, so all of
                // them survive the merge and the shorthand wins on order alone.
                //
                // `margin` and `border-width` rather than each side by name: they
                // are shorthands, and a transition on a shorthand expands to every
                // longhand under it.
                "transition-[margin,border-radius,border-width] duration-150",
                // The bottom squares off only while that edge faces the window —
                // the same rule the right edge follows below, and for the same
                // reason. Below `lg` the secondary panel is a shelf under this
                // card, so with it open the bottom edge faces *that*, and the seam
                // between two panels is a radius and a hairline rather than a
                // full-bleed run into the neighbour. Above `lg` the panel is off
                // to the right and the bottom faces the window again, which is why
                // the open case keeps the rule behind an `lg:`.
                sidebar.secondary
                  ? "lg:has-[[data-more-below]]:mb-0 lg:has-[[data-more-below]]:rounded-b-none! lg:has-[[data-more-below]]:border-b-0!"
                  : "md:has-[[data-more-below]]:mb-0 md:has-[[data-more-below]]:rounded-b-none! md:has-[[data-more-below]]:border-b-0!",
                // The same on the right for a page that runs sideways — but only
                // there. The left edge is the layout's anchor: the nav meets the
                // card along it and the eye finds the page by it, so it stays
                // rounded however far a board has been scrolled.
                //
                // And only while the right edge faces the window. With the
                // secondary panel out it faces *that*, and the seam between two
                // panels is drawn the way every other one in the shell is — a
                // radius and a hairline, not a full-bleed run into the neighbour.
                // `sidebar.secondary` comes from the cookie, so the server already
                // renders the right answer and opening the panel eases the corners
                // back on the same transition.
                //
                // The app rail counts as a neighbour for exactly the same reason,
                // which is why `railWidth` is in this condition too. A squared
                // edge is the card saying "there is more page past here"; with
                // the rail out there is no past here to point at, only 44px of
                // chrome, and the corner would be claiming the content runs
                // under the app switcher. The left edge has never squared off
                // against the nav rail on that reasoning and this is the same
                // seam mirrored.
                !sidebar.secondary &&
                  railWidth === 0 &&
                  "md:has-[[data-more-right]]:mr-0 md:has-[[data-more-right]]:rounded-r-none! md:has-[[data-more-right]]:border-r-0!",
              )}
            >
              {children}
            </main>

            {/* The secondary panel. A shelf across the bottom below `lg` and a
            column down the right at it — the same panel either way, turned.

            The dimension it opens along is the one it animates, so the closed
            state is `h-0` below `lg` and a zero width at it. Both are classes
            rather than one inline number, because inline styles cannot be
            media-queried and the panel has to be the right shape on the first
            paint rather than after the hook that measures the window has run.
            The stored width reaches the class through a custom property, which
            is the one part of it that isn't knowable at build time.

            `45dvh` rather than a stored height: the drag handle is desktop-only
            (it is `lg:block` in its own right, and a 12px seam is not a touch
            target), so there is nothing below `lg` that could change it and
            nothing to persist. `dvh` rather than `vh` so a phone's collapsing
            address bar doesn't leave the shelf hanging off the screen. */}
            <div
              className={cn(
                // Above the page on a phone, below it on a tablet, beside it at
                // `lg`. Ordered rather than moved in the markup: it stays last in
                // the DOM, which is its reading order and its tab order in all
                // three, and only where it lands changes.
                //
                // A phone puts it up top because the keyboard comes up from the
                // bottom — a composer pinned down there is the half the keyboard
                // covers first, and a panel that scrolls out from under your
                // thumbs is worse than one you read down into.
                "order-2 w-full shrink-0 overflow-hidden md:order-none lg:h-full lg:w-(--secondary-width)",
                // A shelf of fixed height everywhere but a phone, where it takes
                // whatever the collapsed page leaves — which is nearly all of it.
                // 45dvh is a shelf; on a phone that is neither the page nor the
                // panel, and the thing you opened should be the thing you get.
                sidebar.secondary ? "h-[45dvh] max-md:h-auto max-md:flex-1" : "h-0",
                hydrated &&
                  resizing !== "secondary" &&
                  "transition-[height,width] duration-200 ease-in-out",
              )}
              style={
                {
                  "--secondary-width": `${sidebar.secondary ? sidebar.secondaryWidth : 0}px`,
                  "--secondary-open-width": `${sidebar.secondaryWidth}px`,
                } as React.CSSProperties
              }
            >
              {/* The outer box animates to nothing on close; this inner one stays at
              full size throughout, so the panel slides out of view rather than
              reflowing down to nothing on the way. Full size means the open
              height below `lg` and the open width at it — never zero, which is
              what the outer one is for. */}
              {/* Full height of whatever the outer box became, on the band where
              that is a flex result rather than a number. */}
              <div className="h-[45dvh] w-full max-md:h-full lg:h-full lg:w-(--secondary-open-width)">
                {/* `open` rather than unmounting: the panel keeps its conversation
                while it is shut, and only needs to know not to grab focus. */}
                <SecondarySidebar onClose={toggleSecondary} open={sidebar.secondary} />
              </div>
            </div>
          </div>

          {/* The alerts, down the far right. A sibling of the page-and-panel
              column rather than a child of it, so it stays a column at every
              width — see the note in the file. On at every width too: 44px is a
              real bite out of a phone, and a phone is the device this column
              matters most on, since it is the one being carried around a site
              where the thing it is warning about actually is. */}
          <AlertRail
            collapsed={!sidebar.alerts}
            onClear={handleClearAlert}
            onOpen={handleOpenAlert}
            onRestore={handleRestoreAlerts}
            onToggle={toggleAlerts}
            onTogglePin={handleToggleAlertPin}
            org={org}
            prefs={alerts}
          />

          {sidebar.secondary ? (
            <SidebarResizeHandle
              offset={railWidth}
              onResize={handleSecondaryResize}
              side="right"
              width={sidebar.secondaryWidth}
            />
          ) : null}

          {/* Mobile drawer. The backdrop is always mounted so it can transition;
          the panel is not, so its nav starts fresh each time it opens. */}
          <button
            aria-label="Close navigation"
            className={cn(
              // Inset to the safe areas rather than `inset-0`. `fixed` is
              // positioned against the viewport and ignores the shell's own
              // padding, so with `viewport-fit: cover` an `inset-0` backdrop
              // covers the physical screen — bezels, notch, the strip behind the
              // home indicator. Those are painted by the root and belong to the
              // app's ground; dropping a scrim over them made them change colour
              // every time the nav opened.
              "fixed top-[env(safe-area-inset-top)] right-[env(safe-area-inset-right)] bottom-[env(safe-area-inset-bottom)] left-[env(safe-area-inset-left)] z-40 bg-black/50 transition-opacity lg:hidden",
              drawerOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0",
            )}
            onClick={() => setDrawerOpen(false)}
            tabIndex={drawerOpen ? 0 : -1}
            type="button"
          />
          {/* Last in the shell and `fixed`, so it sits over the drawer and its
            backdrop as well as the column and the card — the drawer is one of
            the places the switcher is reachable from. */}
          {switching === null ? null : <ShellLoader label={switching} />}

          {/* Inset for the same reason as the backdrop, and with one more of its
            own: the panel carries a hairline top and bottom and a rounded right
            edge, and run to the physical edges those would sit under the status
            bar and behind the home indicator where nobody can see them. */}
          {drawerOpen ? (
            <div className="fixed top-[env(safe-area-inset-top)] bottom-[env(safe-area-inset-bottom)] left-[env(safe-area-inset-left)] z-50 lg:hidden">
              {/* No collapse control: the drawer has no rail to collapse to.

                Bordered on three sides and rounded down its right edge, so it
                reads as a panel laid over the app rather than a slab welded to
                the side of the window — the same treatment the page card gets
                against the rail at wider widths. `overflow-hidden` because the
                foot rows carry their own hairlines, and without it those run
                straight through the new corners. */}
              <AppSidebar
                alertPrefs={alerts}
                className="w-[84vw] max-w-80 overflow-hidden rounded-r-2xl border-y border-r border-border"
                defaultSearchOpen={drawerSearch}
                locationPrefs={locations}
                navPopped={navPopped}
                onNavPop={() => setNavPopped(true)}
                onNavRestore={() => setNavPopped(false)}
                onWorkspaceSwitch={beginWorkspaceSwitch}
                onPreferencesChange={setPreferences}
                preferences={preferences}
                recent={recent}
              />
            </div>
          ) : null}
        </div>
      </NavContext.Provider>
    </OrgContext.Provider>
  )
}
