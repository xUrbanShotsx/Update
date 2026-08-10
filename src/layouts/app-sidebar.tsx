"use client"

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  BadgeCheckIcon,
  Building2Icon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  ChartLineIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
  CircleDotIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  ClockIcon,
  CodeIcon,
  CoinsIcon,
  CreditCardIcon,
  DatabaseIcon,
  DoorOpenIcon,
  FileBadgeIcon,
  FileTextIcon,
  FingerprintIcon,
  FlaskConicalIcon,
  FolderIcon,
  GraduationCapIcon,
  HandshakeIcon,
  HardHatIcon,
  HeartPulseIcon,
  HistoryIcon,
  IdCardIcon,
  ImagesIcon,
  KeyRoundIcon,
  KanbanIcon,
  LayersIcon,
  LeafIcon,
  ListChecksIcon,
  MapPinIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  PanelLeftIcon,
  PlugIcon,
  PlusIcon,
  ReceiptIcon,
  ScaleIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShirtIcon,
  SirenIcon,
  SparklesIcon,
  StethoscopeIcon,
  SunMoonIcon,
  TargetIcon,
  TicketIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserPlusIcon,
  UsersIcon,
  UsersRoundIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

import { BrandLogo } from "@/components/shared/brand-logo"
import { AccountDialog } from "@/components/shared/account-dialog"
import { AccountMenu } from "@/components/shared/account-menu"
import { FeedbackDialog } from "@/components/shared/feedback-dialog"
import { NotificationsMenu } from "@/components/shared/notifications-menu"
import { ThemeButton } from "@/components/shared/theme-button"
import { PreferencesDialog } from "@/components/shared/preferences-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ACCOUNT, FIRST_NAME } from "@/lib/account"
import { useCurrentOrg } from "@/layouts/app-shell"
import { hrefIn, orgUrl, rootUrl } from "@/lib/host"
import { DEFAULT_ALERT_PREFS, type AlertPrefs } from "@/lib/alert-prefs"
import { DEFAULT_LOCATION_PREFS, type LocationPrefs } from "@/lib/location-prefs"
import { DEFAULT_PREFERENCES, type Preferences } from "@/lib/preferences"
import { DEFAULT_RECENT_PAGES, type RecentPages } from "@/lib/recent-pages"
// `type Location` explicitly: without it the name resolves to the DOM's own
// `Location` — the address bar — and every use below fails on a missing `slug`
// rather than on the import being absent.
import {
  defaultDomain,
  DOMAINS,
  domainsFor,
  locationGroups,
  locationHref,
  ORGS,
  orgHref,
  orgSections,
  PROJECTS_SECTION,
  projectHref,
  scopeFromPath,
  siteSections,
  type Domain,
  type Project,
  type Location,
  type Org,
  type Scope,
  type Section,
} from "@/lib/scope"
import { cn } from "@/lib/utils"

const activeRowClass =
  "bg-fill text-foreground hover:bg-fill [&_.row-tile]:bg-transparent"
const inactiveRowClass = "text-muted-foreground hover:bg-fill hover:text-foreground"
/** `h-7`, matching the rails and the chrome buttons — the shell has one control
 *  height and the nav is the longest run of it, so a row a step taller than
 *  everything else was what made the panel read as the heavy part of the window.
 *  `px-2.5` follows the height down: at `px-3` a shorter row reads as wider than
 *  it is. `rounded-md` is the shell's corner throughout; the height came down,
 *  the radius did not go up with it. */
const navRowClass =
  "group flex h-7 items-center gap-2 rounded-md px-2.5 text-left text-sm transition-colors"

/** A tile in the collapsed rail. `size-7` over a `size-3.5` glyph, matching the
 *  app rail down the other edge and the chrome buttons in the panel's head and
 *  foot — the shell has one icon-button size and one corner, and the two rails
 *  facing each other across the page are the pair where a mismatch shows most. */
const railItemClass =
  "grid size-7 shrink-0 place-items-center rounded-md transition-colors"
const railInactiveClass = "text-muted-foreground hover:bg-fill hover:text-foreground"

/**
 * The persistent chrome buttons — collapse at the head, theme and notifications
 * at the foot. One class so they read as a set: dimmed at rest, with the ghost
 * variant supplying both the hover fill and the lift to `text-foreground`.
 * Don't add a `hover:text-*` on top; it beats the variant (cn is
 * tailwind-merge, last one wins) and lands the button short.
 */
const chromeButtonClass = "size-7 shrink-0 text-muted-foreground/55"

/**
 * A row's glyph sits in a tinted tile rather than bare on the row. The tint is
 * the row's own hover fill, and it clears the moment the row wears that fill
 * itself — on hover via `group`, and on an active row via the `row-tile` marker
 * in `activeRowClass`. Two half-opaque greys stacked would otherwise read as a
 * darker patch exactly when the row is lit.
 */
const rowIconClass =
  "row-tile grid size-5 shrink-0 place-items-center rounded-md bg-fill group-hover:bg-transparent"
const rowGlyphClass = "size-3.5"

/**
 * A group's heading. `px-3` puts it on the same left edge as the icon tiles
 * below it rather than as their labels — the tiles are what the eye follows
 * down the panel, so the heading lines up with the column, not with the text.
 * Sentence case, matching the headings in the menus; small caps here and
 * sentence case there would read as two different apps.
 */
const groupLabelClass =
  "shrink-0 truncate px-2.5 pb-1 text-xs font-medium text-muted-foreground/70"

/**
 * Every row's label: filling the row, so whatever follows it — a count, an
 * arrow — is pushed to the far edge and the panel has one right margin rather
 * than a ragged one.
 *
 * One left edge too, and no exceptions to it. Centring the rows that swap the
 * nav was tried and undone: it does mark them, but it costs the column of icon
 * tiles that the eye actually runs down, and a panel you scan by tile is worth
 * more than a panel that flags two rows in four. The arrow already says the
 * sidebar is about to change, and it says it without moving anything.
 */
const rowLabelClass = "min-w-0 flex-1 truncate pl-1"

/**
 * The head of a nav you have gone *into*: a back button wearing the name of what
 * you are inside.
 *
 * The arrow sits at the left edge and the name is centred across the whole row,
 * rather than sitting beside the arrow. That is the one detail worth being
 * deliberate about, because it is what makes the row read as a title bar with a
 * way out rather than as a nav row that happens to point backwards. The rows
 * below it all start at the same left edge and are read as a column; centring
 * this one takes it out of that column and says it is chrome, not a destination.
 *
 * The whole row is the target, arrow and name alike. A centred label with only
 * the 28px arrow live would be a title with a small button on it — and the row
 * has one job, so all of it should do that job.
 *
 * It replaces two things at once: the name pinned at the top and the "Back" row
 * pinned at the bottom, which were a pair saying "you are in here" and "here is
 * the way out" from opposite ends of the panel. One row says both, and says them
 * where every other stack-based nav puts them.
 *
 * **It moves the nav and not the page**, which is why it is a button rather than
 * a link. Going back used to navigate to the app's overview, so glancing at what
 * else was in the list cost you the page you were reading and a press of the
 * browser's own back button to get it again. Now the panel pops and the page
 * stays; the row you popped out of stays lit, so nothing about where you are has
 * been forgotten, and the next row you press is the one that moves you.
 */
function NavBackRow({
  label,
  onPop,
}: {
  readonly label: string
  readonly onPop?: () => void
}) {
  return (
    <button
      className={cn(
        "group relative flex h-7 w-full items-center rounded-md px-2.5 transition-colors",
        inactiveRowClass,
      )}
      onClick={onPop}
      type="button"
    >
      <ArrowLeftIcon className="size-3.5 shrink-0" />
      {/* Centred against the row, not against what is left of it — `absolute`
          with `inset-x` is what centres the name on the panel rather than in the
          gap after the arrow. The insets clear the glyph at both ends so a long
          site name truncates before it can run underneath it, and the padding is
          symmetric so the text stays optically centred as it shortens. */}
      <span className="pointer-events-none absolute inset-x-9 truncate text-center text-sm">
        {label}
      </span>
    </button>
  )
}

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  /**
   * This row has a nav of its own behind it — entering it swaps the panel rather
   * than filling the page beside it. Sites, and the sections that hold records
   * rather than pages. The convention is the point: an arrow means "the sidebar
   * changes", so a row without one can be clicked knowing the panel will still
   * be there, and the panel has one way in and one way out at every depth.
   *
   * A property of the row rather than of the pointer, so it shows at rest.
   */
  arrow?: boolean
  /** Only search shows this — the scope that tells two rows with the same label
   *  apart, since a site's Safety and the domain's Safety are both "Safety". */
  meta?: string
}

/**
 * `label` is the group's heading. Optional because two groups in the site panel
 * are chrome rather than modules — the way back out, and the row carrying the
 * site's own name — and a heading over either would be naming a single row
 * twice.
 */
type NavGroup = { items: NavItem[]; key: string; label?: string }

/**
 * Slug to glyph, kept here rather than in the scope module so that module stays
 * free of a lucide import and of everything it pulls in.
 *
 * One map covers every domain and both scopes, because a module that appears in
 * more than one place shares its slug — so the mirrored rows can't drift onto
 * different glyphs, which is the whole point of sharing the slug.
 */
const SECTION_ICONS: Record<string, LucideIcon> = {
  // Operations
  projects: LayersIcon,
  lookahead: CalendarRangeIcon,
  defects: CircleDotIcon,
  diary: ClipboardListIcon,
  access: IdCardIcon,
  deliveries: TruckIcon,
  claims: ReceiptIcon,
  assets: WrenchIcon,
  timesheets: ClockIcon,
  photos: ImagesIcon,
  sites: MapPinIcon,
  // Compliance
  safety: ShieldCheckIcon,
  risk: TriangleAlertIcon,
  quality: BadgeCheckIcon,
  environment: LeafIcon,
  chemicals: FlaskConicalIcon,
  contractors: HandshakeIcon,
  swms: FileTextIcon,
  emergency: SirenIcon,
  permits: TicketIcon,
  inspections: ClipboardCheckIcon,
  toolbox: MegaphoneIcon,
  actions: ListChecksIcon,
  documents: FolderIcon,
  blueprints: FileBadgeIcon,
  // Workforce
  people: UsersIcon,
  onboarding: UserPlusIcon,
  leave: CalendarDaysIcon,
  performance: TargetIcon,
  training: GraduationCapIcon,
  inductions: DoorOpenIcon,
  competency: AwardIcon,
  medicals: StethoscopeIcon,
  injury: HeartPulseIcon,
  ppe: ShirtIcon,
  rates: CoinsIcon,
  // Admin
  settings: SettingsIcon,
  members: UsersIcon,
  roles: KeyRoundIcon,
  billing: CreditCardIcon,
  integrations: PlugIcon,
  audit: HistoryIcon,
  authentication: FingerprintIcon,
  retention: DatabaseIcon,
  // Every domain's own
  insights: ChartLineIcon,
}

/**
 * The domains, as glyphs. Deliberately none of the section glyphs above: a
 * switcher wearing the same mark as a row inside it reads as that row, and the
 * two nearest misses — Safety's shield for Compliance, People's figures for
 * Workforce — are exactly the ones to avoid.
 */
const DOMAIN_ICONS: Record<string, LucideIcon> = {
  operations: HardHatIcon,
  compliance: ScaleIcon,
  workforce: UsersRoundIcon,
  // The company itself, which is what Admin administers. A gear would be the
  // obvious pick and is already Preferences' glyph two menus away.
  admin: Building2Icon,
}

export const domainIcon = (domain: Domain): LucideIcon =>
  DOMAIN_ICONS[domain.slug] ?? SparklesIcon

/** How many projects the nav lists before it defers to the register. Short for
 *  the reason Recent sites is short: a shortcut you have to scan is the list
 *  again, one indent in. */
const PROJECT_ROWS = 5

/** How many rows the search offers before you have typed, on a session with no
 *  history to offer instead. A sample, not a listing — see `resting`. */
const RESTING_ROWS = 12

/** The most matches the search will show at once. Above the resting sample,
 *  since a list you asked for earns more room than one you didn't — and well
 *  past a panel's worth, because the list scrolls: the cap is there to stop the
 *  panel rendering the whole product, not to fit the rows on screen. */
const SEARCH_ROWS = 50

/**
 * One domain's own pages, as the panel draws them. Every row is built from the
 * org and domain it belongs to, so both are in the href by construction — a nav
 * that hardcoded `/projects` was fine when there was one org and one nav, and is
 * a bug the moment the URL carries which of each you are in.
 *
 * Overview isn't a section — it is the domain itself — so it is prepended to the
 * first group here rather than written into the data. That also puts it beside
 * whatever that domain leads with, which is right: the two of them are where you
 * land.
 *
 * Nothing in this panel wears an arrow. Every row is a section of the domain you
 * are already in, and the one that wasn't — Sites, which went to a page the
 * Locations segment reaches anyway — is no longer a row.
 */
function orgGroups(org: Org, domain: Domain): NavGroup[] {
  return domain.orgGroups.map((group, index) => ({
    key: group.key,
    label: group.label,
    items: [
      ...(index === 0
        ? [{ label: "Overview", href: orgHref(domain), icon: SparklesIcon }]
        : []),
      ...group.sections.map((section) => ({
        label: section.label,
        href: orgHref(domain, section.slug),
        icon: SECTION_ICONS[section.slug] ?? SparklesIcon,
        // The one section with entities under it, so the one that opens a nav
        // of its own. The arrow is the whole of the promise and it is the same
        // promise a site makes two groups down: press this and the panel is
        // replaced. See `sectionNav`.
        arrow: section.slug === PROJECTS_SECTION && org.projects.length > 0,
      })),
    ],
  }))
}

/** One site, as a row. Every list below draws the same one, so a site looks the
 *  same whether you reached it from Pinned, from Recent or from the full list —
 *  three renderings of one row would be three chances to drift. */
function locationRow(domain: Domain, location: Location): NavItem {
  return {
    label: location.name,
    href: siteEntryHref(domain, location),
    icon: MapPinIcon,
    arrow: true,
  }
}

/**
 * Where pressing a site takes you: the first row of the nav it opens.
 *
 * A row with an arrow swaps the panel, so the page it lands on has to be one of
 * the rows that arrive — otherwise the nav changes and nothing in it is lit, and
 * the panel opens with no answer to "where am I". Landing on the first row means
 * the list you are given always has one selected.
 *
 * The overview is the fallback for an app whose sites have no sections at all,
 * where there is no first row to land on. Nothing ships in that shape today;
 * this is here so adding one is a nav that opens on the site rather than a
 * crash.
 */
function siteEntryHref(domain: Domain, location: Location): string {
  const first = domain.siteGroups[0]?.sections[0]
  return locationHref(domain, location, first?.slug)
}

/** The whole site list and nothing else — one run, or one run per region once
 *  the org has enough sites for that to help. `locationGroups` owns that
 *  decision. This is what the rail and search read, where the same site turning
 *  up under three headings would be three near-identical results. */
function allLocationRows(domain: Domain, org: Org): NavGroup[] {
  return locationGroups(org).map((group) => ({
    key: group.key,
    // Unsplit, the heading is what the rows are; split, it is which region's.
    // `locationGroups` keys the single group "all", so the check is on that
    // rather than on the count, which would restate its threshold here.
    label: group.key === "all" ? "All locations" : group.key,
    items: group.locations.map((location) => locationRow(domain, location)),
  }))
}

/**
 * The nav a section opens, for the sections that open one.
 *
 * Projects and nothing else today. It is the one section whose rows are
 * *records* rather than readings of a page — five jobs, not a board and a list
 * of the same register — and records under a row are what used to make that row
 * an accordion.
 *
 * The accordion is gone and this is what replaced it. A disclosure grew the list
 * it was in: the panel you were reading rearranged itself around a row you
 * pressed, everything below it moved, and the state of which rows were open was
 * a second thing to keep — one that no URL described, so it could not survive a
 * reload or be linked to. Drilling in replaces the list instead. One list at a
 * time, its depth in the URL, and the way back where the way back always is.
 *
 * The register leads rather than closes the list. The row you pressed no longer
 * goes anywhere itself, so something in here has to be the page it was — and
 * making you scan past five jobs to reach the screen holding all of them would
 * be the wrong way round. It is also what the arrow promised: press it and you
 * land on the first row.
 *
 * Capped, because a nav is not a register. Past a handful the list stops being
 * a shortcut and becomes the page it is shortcutting.
 */
function sectionNav(org: Org, domain: Domain, section: Section): NavGroup[] {
  if (section.slug !== PROJECTS_SECTION) return []
  return [
    {
      key: section.slug,
      items: [
        {
          label: `All ${section.label.toLowerCase()}`,
          href: orgHref(domain, section.slug),
          icon: SECTION_ICONS[section.slug] ?? SparklesIcon,
        },
        ...org.projects.slice(0, PROJECT_ROWS).map((project: Project) => ({
          label: project.name,
          href: projectHref(domain, project),
          icon: HardHatIcon,
        })),
      ],
    },
  ]
}

/**
 * The section a URL is *inside*, which is not the same as the section it is on.
 *
 * Being on `/operations/defects` is standing on a row of the root nav with its
 * page open beside it — the panel has not gone anywhere and there is nothing to
 * come back from. Being on `/operations/projects` is one level down, because
 * that row opens a nav.
 *
 * The difference is exactly whether `sectionNav` has anything to show, so that
 * is what this asks rather than keeping a second list of which sections drill.
 * Reading the section off the URL alone was the bug this replaced: every section
 * page grew a back row and the panel claimed a depth it did not have.
 *
 * A project resolves to its own scope kind rather than to the section holding
 * it, so both are asked. `/operations/projects` is the register and
 * `/operations/projects/m80-upgrade` is a job, and the panel is the same drilled
 * -in list for either — without the second, opening a project from the list you
 * opened it from would throw you back out to the root.
 */
function openedSection(org: Org, domain: Domain, scope?: Scope): Section | undefined {
  const section =
    scope?.kind === "project"
      ? orgSections(domain).find((item) => item.slug === PROJECTS_SECTION)
      : scope?.kind === "org"
        ? scope.section
        : undefined
  return section && sectionNav(org, domain, section).length ? section : undefined
}

/**
 * What a site's own nav lists: that site's sections of the app you are in.
 *
 * Neither the site's name nor the way out is in here. Both live in the head
 * slot, above the scroll, because a list you can scroll is a list whose first
 * row can be off screen — and "which site am I in" and "how do I leave" are the
 * two questions you must never have to scroll to answer. See `NavBackRow`.
 */
function siteGroups(domain: Domain, location: Location): NavGroup[] {
  return [
    ...domain.siteGroups.map((group) => ({
      key: group.key,
      label: group.label,
      items: group.sections.map((section) => ({
        label: section.label,
        href: locationHref(domain, location, section.slug),
        icon: SECTION_ICONS[section.slug] ?? MapPinIcon,
      })),
    })),
  ]
}

/**
 * What the panel lists: one nav, at whichever depth the URL is.
 *
 * The company's own sections with the sites among them, or — once you are
 * standing in a site — that site's. There is no mode and no toggle: the URL says
 * which of the two you are looking at, the same way it says which app.
 *
 * This replaced an Organisation / Locations segmented control, and the thing the
 * control could not do is what the arrows do now. A toggle asserts the two lists
 * are alternatives you choose between, when they are one list and a list *inside*
 * it: sites belong to the company, and their sections belong to the site. A
 * segment made "which site" a question you answered somewhere other than where
 * the sites were, and left the panel able to show a site's nav while the URL was
 * the company's — two facts on screen disagreeing, with the control insisting it
 * had been obeyed.
 *
 * So the sites are a group in the company's list, each row arrowed to say it
 * opens a nav rather than a page, and pressing one goes *in*. The way back is
 * the head row, which is the only thing that leaves.
 */
function navGroups(
  org: Org,
  domain: Domain,
  prefs: LocationPrefs,
  site?: Location,
  section?: Section,
): NavGroup[] {
  if (site) return siteGroups(domain, site)
  // A section you have gone into, which is the same move a site is one level
  // over: the list is replaced by what is inside, and the head row is the way
  // out. Only the sections that actually open one — `sectionNav` returns nothing
  // for the rest, and a section with nothing behind it is an ordinary row whose
  // page fills the card beside the nav it left standing.
  if (section) {
    const inside = sectionNav(org, domain, section)
    if (inside.length) return inside
  }

  return [
    ...orgGroups(org, domain),
    // Last, and only where there is something behind it. An app with no site
    // scope — Admin — has no site nav to open, so a Locations group there would
    // be rows whose arrows led nowhere; a workspace with no sites would be a
    // heading over nothing.
    ...(domain.siteGroups.length && org.locations.length
      ? [
          {
            key: "locations",
            label: "Locations",
            items: orderByPinned(org, prefs).map((location) =>
              locationRow(domain, location),
            ),
          },
        ]
      : []),
  ]
}

/**
 * The sites, pinned ones first, each list otherwise in the org's own order.
 *
 * Pinned used to be a group of its own with a heading. As one group it is an
 * ordering instead, which is the right weight for it here: a heading over two
 * rows, above a heading over six that repeats them, spent three rows of the
 * panel saying what moving two rows up says on its own.
 *
 * It stays because the pin is still a control — it is on every site's page
 * header — and a pin that changed nothing visible anywhere would be a switch
 * wired to a light that had been taken out.
 *
 * Cookie data can name sites that have since been renamed or removed, so a slug
 * that no longer resolves simply doesn't match and the site list is unaffected.
 */
function orderByPinned(org: Org, prefs: LocationPrefs): readonly Location[] {
  const pinned = new Set(prefs.pinned)
  if (!pinned.size) return org.locations
  return [
    ...org.locations.filter((location) => pinned.has(location.slug)),
    ...org.locations.filter((location) => !pinned.has(location.slug)),
  ]
}

/**
 * A nav row.
 *
 * One shape, one job: it is a link, and pressing it goes there. The arrow says
 * whether "there" comes with a new panel or fills the card beside this one.
 *
 * It used to be two shapes. A row carrying children became a button that
 * disclosed them instead of navigating, which meant the panel held rows that
 * looked alike and behaved differently, and you could not tell which by looking
 * — the chevron was the only difference and it was at the far end of the row
 * from the label you were reading. Everything with rows under it drills in now,
 * so the question does not arise.
 */
function NavRow({
  active,
  current,
  item,
  onReenter,
}: {
  /** Decided by the caller rather than compared here, because "you are on this
   *  page" is not the only reason a row is lit: back out of a project and the
   *  section holding it stays lit while the URL is two levels below it. */
  readonly active: boolean
  /** This row's page is the one already open. Narrower than `active`, and the
   *  difference is exactly the popped-out ancestor case above. */
  readonly current: boolean
  readonly item: NavItem
  readonly onReenter?: () => void
}) {
  return (
    <Link
      className={cn(navRowClass, active ? activeRowClass : inactiveRowClass)}
      href={item.href}
      onClick={(event) => {
        // The page this row points at is already on screen, so there is nothing
        // to fetch and the navigation is pure cost — a re-render of what you are
        // looking at, with the scroll position thrown away on the way.
        //
        // Pressing it still *means* something once the panel has been backed out
        // of: it is how you drill back in. So the click is kept and only the
        // navigation dropped, which is why this is `preventDefault` on a link
        // rather than the row becoming a button — it is still a link to
        // somewhere for every other purpose, opening in a tab included.
        if (!current) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        onReenter?.()
      }}
    >
      <span className={rowIconClass}>
        <item.icon className={rowGlyphClass} />
      </span>
      <span className={rowLabelClass}>{item.label}</span>
      {/* This panel's convention for a row with a nav of its own behind it. It
          used to share the slot with an amber count of open incidents — a number
          on every site row, which made the nav a report. A nav says where you
          can go; how many incidents are open is what the page you land on is
          for, and it was already saying it there. */}
      {item.arrow ? (
        <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground/45 transition-colors group-hover:text-foreground" />
      ) : null}
    </Link>
  )
}

/**
 * A visited path, as a row.
 *
 * Everything comes back out of `scopeFromPath`, so a stored path can only become
 * a row the router agrees exists — one pointing at a renamed section, a removed
 * site or an app the workspace has since lost resolves to nothing and is dropped
 * by the caller rather than drawn as a link that 404s.
 *
 * Just a path. It briefly needed an `{ app, path }` pair, because with the app
 * in the hostname `/company-1/insights` named three different dashboards and the
 * entry had to say which; now the path carries the app again and identifies the
 * page on its own. And every row is a plain href, because the cookie is
 * host-only — everything in it is this workspace's.
 *
 * `label` is the leaf and `meta` is where it lives, because the leaf alone
 * repeats: Safety is a row in the app and a row on four sites. The site wins the
 * meta slot when there is one, since that is the narrower fact; otherwise it is
 * the app, which is what tells one Insights from another.
 */
function recentRow(href: string, org: Org): NavItem | undefined {
  const scope = scopeFromPath(href, org)
  if (!scope) return undefined

  if (scope.kind === "location") {
    return scope.section
      ? {
          label: scope.section.label,
          href,
          icon: SECTION_ICONS[scope.section.slug] ?? MapPinIcon,
          meta: scope.location.name,
        }
      : {
          label: scope.location.name,
          href,
          icon: MapPinIcon,
          meta: scope.domain.label,
        }
  }

  if (scope.kind === "project") {
    return {
      label: scope.project.name,
      href,
      icon: HardHatIcon,
      meta: scope.domain.label,
    }
  }

  // A child page names itself — Board rather than Projects — since that is the
  // page you were actually on and the one you mean to get back to.
  const leaf = scope.child ?? scope.section
  return {
    label: leaf?.label ?? "Overview",
    href,
    icon: leaf ? (SECTION_ICONS[leaf.slug] ?? SparklesIcon) : SparklesIcon,
    meta: scope.domain.label,
  }
}

/**
 * Everything search can reach — every workspace, every app inside it, and every
 * location under those.
 *
 * It used to be scoped twice over, to the app you were in and the segment you
 * were on, on the reasoning that both controls should stay live while you typed.
 * That reasoning had it backwards. A nav is where scope belongs, because a nav
 * is a place you are standing; a search box is what you reach for precisely when
 * the thing you want is *not* where you are standing, and a search that can only
 * answer for the current app is one that fails exactly when it is needed. The
 * old empty state gave the game away — "No matches in Compliance · Organisation"
 * naming two scopes you did not choose and could not see from the results.
 *
 * Every row therefore carries where it lives in `meta`, which is no longer
 * decoration: with four apps across two workspaces, "Safety" is a label half a
 * dozen rows share and the meta line is the only thing telling them apart.
 *
 * Crossing workspaces is a crossing of origin, so `hrefIn` is what builds these
 * — a path within the current workspace, an absolute URL out of it. See
 * `ResultRow`'s caller for the navigation that has to fork the same way.
 */
function allSearchable(current: Org): NavItem[] {
  const rows = ORGS.flatMap((org) => {
    const link = (path: string) => hrefIn(current, org, path)
    // The workspace itself, pointed at its own first app rather than at `/`:
    // that path is the picker, which is the one page in the product that is not
    // *in* a workspace, so a row named for a company that landed you on a list
    // of companies would be the only row here that misses.
    const workspace: NavItem = {
      label: org.name,
      href: link(orgHref(defaultDomain(org))),
      icon: Building2Icon,
      meta: org.industry,
    }

    return [
      workspace,
      ...domainsFor(org).flatMap((domain) => {
        const where =
          org.slug === current.slug ? domain.label : `${org.name} · ${domain.label}`
        return [
          // The app itself. `orgGroups` opens with an Overview row pointing at
          // the same place, but that one is called "Overview" — this is the one
          // that answers when you type the app's name.
          {
            label: domain.label,
            href: link(orgHref(domain)),
            icon: domainIcon(domain),
            meta: org.name,
          },
          ...orgGroups(org, domain)
            .flatMap((group) => group.items)
            .map((item) => ({
              ...item,
              href: link(item.href),
              meta: item.meta ?? where,
            })),
          // What the drilled-in navs hold, so a project is findable by its own
          // name rather than only by opening the section that lists it. Search
          // is flat and the nav is a stack, and this is where the two have to be
          // reconciled: a row you can only reach by going somewhere first is a
          // row search has to know about, or drilling in has quietly made half
          // the app unsearchable.
          //
          // Each nav leads with a row for the section's own page — "All
          // projects", pointing where "Projects" already points. Down here that
          // is one page offered twice, so it goes on href rather than on label.
          ...orgSections(domain)
            .flatMap((section) => sectionNav(org, domain, section))
            .flatMap((group) => group.items)
            .filter(
              (item) =>
                !orgSections(domain).some((s) => orgHref(domain, s.slug) === item.href),
            )
            .map((item) => ({ ...item, href: link(item.href), meta: where })),
          // Locations, and then each one's sections of this app — a site's
          // Safety is a different page from the app's Safety, and both are
          // things people search for by name.
          ...allLocationRows(domain, org)
            .flatMap((group) => group.items)
            .map((item) => ({ ...item, href: link(item.href), meta: where })),
          ...org.locations.flatMap((location) =>
            siteSections(domain).map((section) => ({
              label: section.label,
              href: link(locationHref(domain, location, section.slug)),
              icon: SECTION_ICONS[section.slug] ?? MapPinIcon,
              meta: `${location.name} · ${where}`,
            })),
          ),
        ]
      }),
    ]
  })

  // One row per destination *and* name. Three rows legitimately share an href —
  // the workspace, the app, and that app's own Overview all land on
  // `/operations` — and all three should stay, because each answers to a
  // different word. What must not survive is one name pointing at one page
  // twice, which is a duplicate result and a duplicate React key at once.
  const seen = new Set<string>()
  return rows.filter((row) => {
    const id = rowKey(row)
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

/** What identifies a result row. Neither half is unique on its own: a href is
 *  shared by the rows above, and a label like "Safety" is shared by a dozen
 *  pages across the apps. */
const rowKey = (item: NavItem): string => `${item.href} ${item.label}`

/**
 * `/` mode. Every one either goes somewhere in the nav or does the one thing it
 * names — nothing here is a placeholder.
 *
 * The three that name a module of one domain cross into it, and say so in the
 * label when they would: running `/board` from Compliance lands you in
 * Operations, which is the one way a command here can surprise you, so the row
 * announces it rather than the nav changing under you unannounced.
 */
/**
 * `domain` is the one a command belongs to, and `null` for the ones that mean
 * "here" — Overview and Sites exist in all three, so they land in whichever you
 * are already in. Every entry carries the field rather than only the three that
 * use it: a uniform shape is what lets the label and the handler below read it
 * without either of them testing for its absence.
 */
const COMMANDS = [
  {
    key: "overview",
    token: "/overview",
    label: "Go to Overview",
    icon: SparklesIcon,
    domain: null,
  },
  {
    key: "projects",
    token: "/projects",
    label: "Go to Projects",
    icon: LayersIcon,
    domain: "operations",
  },
  // The board left the nav for a view toggle on the Projects page, so this is
  // the one place left that reaches it in a keystroke.
  {
    key: "board",
    token: "/board",
    label: "Go to Board",
    icon: KanbanIcon,
    domain: "operations",
  },
  {
    key: "safety",
    token: "/safety",
    label: "Go to Safety",
    icon: ShieldCheckIcon,
    domain: "compliance",
  },
  {
    key: "people",
    token: "/people",
    label: "Go to People",
    icon: UsersIcon,
    domain: "workforce",
  },
  {
    key: "theme",
    token: "/theme",
    label: "Cycle theme",
    icon: SunMoonIcon,
    domain: null,
  },
  {
    key: "collapse",
    token: "/collapse",
    label: "Collapse sidebar",
    icon: PanelLeftIcon,
    domain: null,
  },
  {
    key: "feedback",
    token: "/feedback",
    label: "Send feedback",
    icon: MessageSquareIcon,
    domain: null,
  },
] as const

type Command = (typeof COMMANDS)[number]

/**
 * What the panel offers before you have typed a character.
 *
 * Things to *do*, where this used to list places you had been. A history is only
 * worth the slot it takes if it beats what you would otherwise be shown, and it
 * mostly didn't: the pages you visit often are the ones already on screen in the
 * nav directly above, so the resting list was the sidebar again, shuffled. What
 * is genuinely not in the nav is the verbs — the things that have no row because
 * they are not places.
 *
 * `section` names the page that owns the action rather than a flow of its own.
 * The composing screens are scaffold in this build, so the row takes you to
 * where the work happens and stops there; it does not pretend to a modal that
 * isn't written. The ones with no `section` do their whole job on the spot.
 */
const QUICK_ACTIONS = [
  {
    key: "invite",
    label: "Invite member",
    icon: UserPlusIcon,
    domain: "workforce",
    section: "people",
  },
  {
    key: "project",
    label: "New project",
    icon: LayersIcon,
    domain: "operations",
    section: PROJECTS_SECTION,
  },
  {
    key: "incident",
    label: "Log an incident",
    icon: SirenIcon,
    domain: "compliance",
    section: "safety",
  },
  { key: "preferences", label: "Preferences", icon: SettingsIcon, domain: null },
  { key: "feedback", label: "Send feedback", icon: MessageSquareIcon, domain: null },
  { key: "theme", label: "Cycle theme", icon: SunMoonIcon, domain: null },
] as const

type QuickAction = (typeof QUICK_ACTIONS)[number]

/** Where a command lands: its own app when it names a module of one and the org
 *  has that app, otherwise the app you are already in. The entitlement check is
 *  what stops `/safety` routing an org without Compliance to a 404.
 *
 *  Shaped rather than typed to `Command`, because the quick actions above resolve
 *  their app the same way and for the same reason. */
const commandDomain = (
  command: { readonly domain: string | null },
  org: Org,
  current: Domain,
): Domain =>
  DOMAINS.find((item) => item.slug === command.domain && org.apps.includes(item.slug)) ??
  current

/** `>` mode. */
const DOCUMENTS = [
  { title: "Getting started", meta: "2h ago" },
  { title: "Deploying to production", meta: "Yesterday" },
  { title: "Environment variables", meta: "3d ago" },
  { title: "Authentication", meta: "1w ago" },
  { title: "Changelog", meta: "2w ago" },
]

/** The hairline between the name and the buttons in the head row. */
function HeadDivider() {
  return <span aria-hidden className="h-4 w-px shrink-0 bg-border" />
}

/**
 * The brand row, and the organisation switcher behind it. The row shows the app
 * rather than the current org — the mark and wordmark are what the eye goes to
 * in that corner — so the org lives in the menu, with a tick against the one in
 * play. Each item carries no mark of its own: they would all be this same logo,
 * which says nothing about which org you are picking.
 *
 * The items are links, not setters. The org is in the URL now, so switching one
 * *is* a navigation — and going to the overview rather than the matching page in
 * the new org is deliberate: the section you were reading belongs to the org you
 * were reading it in. The domain carries across, since that is your job rather
 * than the company's — but only where the target org has that app, and its own
 * first one otherwise, since entitlement is the company's and not yours.
 *
 * Each row carries what the org builds under its name. Two orgs in a list are
 * told apart by their names; twenty are told apart by their work, and the plan
 * badge says what they pay rather than what they do.
 *
 * There is no Organisation settings item. Settings are a section of the Admin
 * app for the orgs that have it, and a menu shortcut into one app's section
 * would be the one row here that isn't about choosing an organisation.
 */
export function BrandMenu({
  className,
  domain,
  onSwitch,
  org,
}: {
  /** Merged onto the trigger. The one caller that passes anything is the phone
   *  bar, which sends `flex-none`: there is no hairline out there for the fill
   *  to run to, so the row hugs its wordmark instead of stretching to the
   *  buttons at the far edge. */
  readonly className?: string
  readonly domain: Domain
  /** Raised just before the browser leaves for another origin, so the shell can
   *  cover the document load. The rows here are the only place in the panel that
   *  crosses one. */
  readonly onSwitch?: (label: string) => void
  readonly org: Org
}) {
  return (
    <DropdownMenu>
      {/* `flex-1` so the hover fill runs to the hairline, and `pl-0` so the mark
          starts where the fill does — see the note on it.

          `overflow-hidden` because the mark and the name both refuse to shrink:
          once the sector has clipped away to nothing there is nothing left to
          give, and at that point the row should crop rather than push the
          chevron out past the panel edge. */}
      <DropdownMenuTrigger
        className={cn(
          "flex h-7 min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-md pr-2 pl-1 text-left text-muted-foreground/55 transition-colors hover:bg-fill hover:text-foreground",
          className,
        )}
      >
        {/* The workspace, not the product. Inside the shell there is always one
            selected — that is what a shell *is* — so this row names the company
            you are looking at and the sector it works in. The product's own name
            and version have their state too: they are what the picker at `/`
            shows, where no workspace is chosen and there is nothing else to
            name. */}
        {/* `size-5` in an `h-7` row behind `pl-1` — the account button's avatar,
            exactly. The head and the foot bracket the panel and are the same row
            twice: a mark, a name, a chevron, one hover fill around all three. Any
            difference in how much air the mark has reads as one of them being
            wrong rather than as either being deliberate. */}
        <BrandLogo className="size-5 shrink-0" />
        {/* `shrink-0` and no `truncate`: the name is never the thing that
            clips. It is what the button is for, and a workspace called
            "Compan…" is a worse row than one with no sector on it at all.

            `text-xs` rather than the `text-sm` of the nav rows below. The head
            is a label, not the first item of the list — it says which workspace
            you are in and is read once on arrival, where the rows under it are
            scanned. Semibold is what keeps it the heaviest thing in the panel at
            the smaller size. */}
        {/* `ml-1` on top of the row's `gap-2`, so the name stands 12px off the
            mark rather than 8. The mark is a filled tile and the name is text:
            at the gap the rest of the row uses, the two read as one clump,
            because a solid square crowds a letterform in a way two letterforms
            never crowd each other. */}
        <span className="ml-1 shrink-0 text-xs font-semibold text-foreground">
          {org.name}
        </span>
        {/* The sector is what gives way, all of it, before the name gives any.
            It was `shrink-0` beside a truncating name, which is the wrong way
            round: the default 256px panel spent the whole shortfall on
            "Company #1" — down to "Compan…" — so "Construction" could sit beside
            it whole.

            `shrink-[999]` is the whole mechanism. Flex splits a shortfall in
            proportion to what each item started with, so an even split still had
            the name — the wider of the two — doing most of the giving. Weighted
            this far, the sector absorbs effectively all of it: it clips to
            "Constr…", then to "C…", then to a box too narrow to paint anything
            at all, and only once it is down to nothing does the name begin to
            clip. `min-w-0` is what permits that last part; without it a flex
            item refuses to shrink past its own text.

            A container query stood here to hide the sector outright at a
            threshold, and it was worse: the threshold is a guess at the width of
            two strings, it was set high enough to skip almost the whole clipping
            range, and the sector went from absent to whole with nothing in
            between. Shrinking to zero reaches the same end state and gets there
            by degrees, with no number in the stylesheet pretending to know how
            wide "Company #1" renders. */}
        <span className="min-w-0 shrink-[999] truncate text-2xs font-normal text-muted-foreground/70">
          {org.industry}
        </span>
        {/* Double, like every other switcher in the app: this one opens
            downward but the menu is a list you move up and down, where the
            account's single chevron points at the one place its menu appears. */}
        <ChevronsUpDownIcon className="ml-auto size-3.5 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56" sideOffset={4}>
        <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground">
          Workspaces
        </p>
        {ORGS.map((item) => (
          <DropdownMenuItem
            // No `items-start`: the plan and the tick centre against the whole
            // two-line block rather than pinning to the name, which left them
            // riding high with the tag line empty beside them. The base item
            // class already centres, so this only has to not say otherwise.
            className="gap-2 px-2 py-1 text-xs"
            key={item.slug}
            nativeButton={false}
            // Every row here leaves this origin — the other workspaces for
            // theirs, and the one you are in for the no-workspace host, which is
            // just as much a fresh document. A modified click opens elsewhere
            // and leaves this document standing, so it gets no cover.
            onClick={(event: React.MouseEvent) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              onSwitch?.(item.slug === org.slug ? "Workspaces" : item.name)
            }}
            render={
              // The one you are in points at `/`, which is the deselect: the
              // picker is the state of having no workspace, so leaving one is
              // simply going there. Every other row switches as before, keeping
              // your app where the target has it.
              <Link
                href={
                  item.slug === org.slug
                    ? // Deselecting. No workspace means no host of your own, so
                      // this leaves for the no-workspace host.
                      rootUrl()
                    : // Another company is another origin — that is the whole
                      // point of the arrangement — so this is absolute and the
                      // browser loads a fresh document. It lands on the same app
                      // where the other workspace has it, and on that
                      // workspace's own first app where it hasn't.
                      orgUrl(
                        item,
                        orgHref(
                          item.apps.includes(domain.slug) ? domain : defaultDomain(item),
                        ),
                      )
                }
              />
            }
          >
            <span className="min-w-0 flex-1">
              {/* Name and plan on one line, the plan sized to its own text so it
                  sits against the name rather than out at the row's edge. It
                  used to be a sibling of this whole block, which put it level
                  with the name but an inch away, reading as a column of its own
                  — and left it floating beside a two-line block with nothing
                  under it. */}
              <span className="flex items-center gap-2">
                <span className="min-w-0 truncate">{item.name}</span>
                {/* The same chip the account page draws its plan in, down to the
                    radius and the padding — it is the same fact about the same
                    workspace, and two treatments of it would read as two
                    different things. A border rather than a fill: the row
                    already takes a fill on hover, and a badge with one of its
                    own would fight it.

                    No `!` on the colour, unlike the tag line below. The border
                    is what makes this a badge, so the text lifting with the rest
                    of the row on hover costs nothing — where the caption has
                    only its colour to say it is subordinate. */}
                <span className="shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {item.plan}
                </span>
              </span>
              {/* A step dimmer than the plan above it: the plan is a fact about
                  the account and these are a description of the company, so the
                  eye should reach the name first and these only if it is
                  choosing between two of them.

                  The `!` is load-bearing. `DropdownMenuItem` carries
                  `focus:**:text-accent-foreground`, which lifts *every*
                  descendant to the full foreground while the row is highlighted
                  — right for a one-line item, where the label and its glyph
                  should go white together, and wrong here, where it flattens
                  the caption into a second title at exactly the moment you are
                  looking at the row. This is the one rule that has to outlive
                  the hover. */}
              <span className="mt-0.5 block truncate text-[10px] text-muted-foreground/70!">
                {item.tags.join(" · ")}
              </span>
            </span>
            {/* A blank of the same size on the others, so the names stay on one
                left edge instead of shifting under the tick. */}
            {item.slug === org.slug ? (
              <CheckIcon className="size-3.5 shrink-0" />
            ) : (
              <span className="size-3.5 shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
        {/* Says what the tick does, since a row that unselects itself is the one
            behaviour in this menu nobody would guess. Its own line rather than a
            hint on the row: the rows are a list of workspaces, and one of them
            quietly meaning something else is worse than a sentence under them. */}
        <p className="px-2 pt-1 pb-1.5 text-[10px] text-muted-foreground/70">
          Choose the ticked one again to leave it.
        </p>
        <div className="-mx-1 my-1 h-px bg-border" />
        <DropdownMenuItem className="gap-2 px-2 py-1 text-xs">
          <PlusIcon className="size-3.5" />
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * The quick actions menu — the right-hand half of the icon pair at the head.
 *
 * A plus, over the verbs. The slot held the app switcher and its grid glyph
 * until the apps moved out to their own rail beside the page, which left the
 * best-placed control in the panel pointing at something that is now always on
 * screen anyway. A plus is the other thing that belongs in a corner like this
 * and the one the head had no room for before: everything in the panel below is
 * a place, and this is the only control in it that makes something.
 *
 * `onRun` rather than hrefs, because these are not all navigations — three open
 * a dialog or flip a setting where they stand. The panel owns those, so the menu
 * only reports which row was pressed.
 */
function QuickActionsMenu({
  actions,
  className,
  onRun,
}: {
  readonly actions: readonly QuickAction[]
  readonly className?: string
  readonly onRun: (action: QuickAction) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Quick actions"
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground/55 transition-colors hover:bg-fill hover:text-foreground",
          className,
        )}
      >
        {/* size-3.5, matching the buttons it sits beside — the head's controls
            are one set and a heavier glyph breaks it. */}
        <PlusIcon className="size-3.5" />
      </DropdownMenuTrigger>
      {/* Down and to the right of the button, like the switcher it replaced:
          there is room below and none above. */}
      <DropdownMenuContent
        align="start"
        className="min-w-52"
        side="bottom"
        sideOffset={4}
      >
        <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground">
          Quick actions
        </p>
        {actions.map((action) => (
          <DropdownMenuItem
            className="gap-2 px-2 py-1.5 text-xs"
            key={action.key}
            onClick={() => onRun(action)}
          >
            <action.icon className="size-3.5 shrink-0 text-muted-foreground" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** The `⌘K` chip in the search bar. Renders nothing until mounted: the modifier
 *  is only knowable in the browser, and a server-guessed `⌘` would flip to
 *  `Ctrl` under a Windows user mid-hydration. */
function ShortcutHint() {
  const [key, setKey] = useState<string | null>(null)
  useEffect(() => {
    // `navigator.platform` would read better but is deprecated.
    setKey(/mac/i.test(navigator.userAgent) ? "⌘K" : "Ctrl K")
  }, [])

  return (
    <kbd className="shrink-0 font-sans text-[10px] text-muted-foreground/60">
      {key ?? " "}
    </kbd>
  )
}

function RailItem({
  children,
  label,
}: {
  readonly children: React.ReactElement
  readonly label: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

/**
 * The apps, as a segmented control at the top of the panel: the one you are in
 * wearing its name, the rest reduced to their glyph.
 *
 * Four labels side by side do not fit a 260px panel — "Operations" and
 * "Compliance" alone are most of it — and shrinking all four to fit gives four
 * illegible words instead of one legible one. Only one of them has to be read
 * at a time, though: the others are targets you aim at, and the glyph is what
 * you aim by. So the selected segment spends the width on its name and the rest
 * spend theirs on being wide enough to hit.
 *
 * The label is what makes the control answer "which app is this" without being
 * used, which is the job the rail down the other edge does by lighting a tile.
 * The two agree because both read the app out of the URL; neither holds state.
 *
 * `Link`s rather than buttons, like the rail's tiles: switching app is a
 * navigation, and one that middle-clicks into a tab like every other row in the
 * panel.
 *
 * No cover over the switch. It is same-origin — the router swaps the nav and the
 * page without the document going anywhere — so it lands in a frame or two, and
 * a full-screen spinner over that read as work where there was none: it made the
 * quickest move in the product feel like its slowest. The cover is kept for the
 * one crossing that genuinely waits, which is changing workspace.
 *
 * The site survives the switch where the target app has sites to survive into;
 * Admin has none, so it lands on the company. Same rule as the rail and ⌘1–4,
 * and it has to be, or the three would disagree about what switching means.
 */
function AppToggle({
  domain,
  org,
  site,
}: {
  readonly domain: Domain
  readonly org: Org
  readonly site?: Location
}) {
  const apps = domainsFor(org)

  return (
    // The same trough as the segmented control below it — these are two rows of
    // one control stack and a second treatment here would read as two unrelated
    // widgets. `gap-0.5`/`p-0.5` put the segments on the same rhythm.
    //
    // Full width, like the control below it — two troughs of different lengths
    // stacked would read as two unrelated widgets rather than as one stack, and
    // the panel's chrome all runs edge to edge between the same gutters.
    //
    // What fills the leftover is the *unselected* segments rather than the
    // selected one: the lit segment is sized by its name, so the width it takes
    // says something about the app, and the glyphs beside it spend what's left
    // on being easier to hit.
    <div className="flex w-full gap-0.5 rounded-md bg-fill p-0.5">
      {apps.map((app) => {
        const Icon = domainIcon(app)
        const current = app.slug === domain.slug
        const href =
          site && app.siteGroups.length ? locationHref(app, site) : orgHref(app)

        const segment = (
          <Link
            className={cn(
              "flex h-6 items-center justify-center rounded-[6.5px] text-xs font-medium transition-colors",
              // The selected one is as wide as its own name and no wider. It
              // used to take `flex-1` and swallow the leftover width, which made
              // the lit segment's size a fact about the panel rather than about
              // the app — it changed when the sidebar was dragged and stayed put
              // when the app changed, which is backwards for the one control
              // naming it.
              //
              // The glyphs take the remainder instead, sharing it evenly and
              // never dropping under a 28px target. `min-w-0` on the label's
              // segment so a long name degrades by truncating inside itself
              // rather than squeezing the glyphs: clipping a word costs a word,
              // losing a target costs the app.
              current
                ? "min-w-0 shrink bg-card px-5 text-foreground dark:bg-fill-strong"
                : "min-w-7 flex-1 text-muted-foreground hover:text-foreground",
            )}
            href={href}
            key={app.slug}
          >
            {/* One or the other, never both. The glyph and the name say the
                same thing, and the selected segment is the one place there is
                room to say it in words — a tile carrying an icon *and* its label
                reads as a row that happens to be lit rather than as the state of
                a control. The unselected ones keep the glyph because that is all
                that fits, and their name is a tooltip away. */}
            {current ? (
              <span className="truncate">{app.label}</span>
            ) : (
              <Icon className="size-3.5 shrink-0" />
            )}
          </Link>
        )

        // A glyph with no label needs its name somewhere. The selected one has
        // its name on it, so wrapping that too would be a tooltip repeating the
        // word it is pointing at.
        return current ? (
          segment
        ) : (
          <Tooltip key={app.slug}>
            <TooltipTrigger render={segment} />
            <TooltipContent side="bottom">{app.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

/** One result row — the same shape as a nav row, so the list reads as the nav
 *  narrowing rather than as a different surface arriving. */
function ResultRow({
  icon: Icon,
  label,
  meta,
  mono,
  onClick,
}: {
  readonly icon: LucideIcon
  readonly label: string
  readonly meta?: string
  /** Tokens and timestamps are mono — fixed strings you match on shape. A scope
   *  name is prose and reads as a typo in mono. */
  readonly mono?: boolean
  readonly onClick: () => void
}) {
  return (
    <button
      // `shrink-0` because these are flex items in a scrolling column, and a
      // flex item's default is to shrink before its container overflows. With
      // fifty of them the whole list quietly compressed to fit — `h-7` is the
      // row's *basis*, not a floor — so the panel showed fifty squashed rows and
      // no scrollbar instead of eight proper ones and a scrollbar. Refusing to
      // shrink is what turns the overflow back into scrolling.
      className={cn(navRowClass, inactiveRowClass, "w-full shrink-0")}
      onClick={onClick}
      type="button"
    >
      <span className={rowIconClass}>
        <Icon className={rowGlyphClass} />
      </span>
      <span className="min-w-0 flex-1 truncate pl-1">{label}</span>
      {meta ? (
        <span
          className={cn(
            "shrink-0 text-[10px] text-muted-foreground/60",
            mono && "font-mono",
          )}
        >
          {meta}
        </span>
      ) : null}
    </button>
  )
}

export function AppSidebar({
  alertPrefs = DEFAULT_ALERT_PREFS,
  className,
  collapsed,
  defaultSearchOpen = false,
  locationPrefs = DEFAULT_LOCATION_PREFS,
  navPopped = false,
  onNavPop,
  onNavRestore,
  onWorkspaceSwitch,
  onRequestSearch,
  ownsShortcuts = false,
  onPreferencesChange,
  onToggleSidebar,
  preferences = DEFAULT_PREFERENCES,
  recent = DEFAULT_RECENT_PAGES,
}: {
  /** Cleared and pinned alert ids, owned by the shell. Read only by the bell in
   *  here, which has to hide what the rail has cleared — see the note on
   *  `NotificationsMenu`. */
  readonly alertPrefs?: AlertPrefs
  readonly className?: string
  readonly collapsed?: boolean
  /** Open in search mode. Only the drawer passes it, and only when the phone
   *  bar's magnifier is what raised it — the drawer is mounted fresh on every
   *  open, so this is an initial value rather than a controlled one. */
  readonly defaultSearchOpen?: boolean
  /** Pinned sites, owned by the shell. Unused by the nav list now that the
   *  sites are a plain group in it, and kept because the pin on a site's own
   *  page header still writes it and the search panel still reads it. */
  readonly locationPrefs?: LocationPrefs
  /**
   * The nav has been backed out of: show the level above whatever the URL is
   * on, without the URL having moved.
   *
   * Owned by the shell, which clears it on every navigation — see the note
   * there. From this component's side it is simply "ignore the depth in the
   * path this once", which is why it is a flag rather than a level: there is
   * one thing the panel can be doing other than following the URL, and naming
   * it that way keeps it impossible to be at a depth the URL disagrees with by
   * more than one step.
   */
  readonly navPopped?: boolean
  /** Pressed the back row. A nav move and not a page move — nothing navigates,
   *  so this is a callback rather than an href. */
  readonly onNavPop?: () => void
  /** Pressed a row for the page already open. The mirror of `onNavPop`: it
   *  drills the panel back in without navigating, since there is nowhere to
   *  navigate to. */
  readonly onNavRestore?: () => void
  /**
   * About to leave for another workspace, so the shell can cover the wait.
   *
   * Only this crossing gets a cover. Changing app is a same-origin navigation
   * the router handles in a frame or two, and a full-screen spinner over it read
   * as work being done where there was none — it made the quickest move in the
   * product feel like the slowest. Changing workspace is a different origin and
   * therefore a fresh document, which is genuinely a wait and genuinely worth
   * saying something during.
   */
  readonly onWorkspaceSwitch?: (label: string) => void
  /**
   * Reveal a panel that can actually show the search.
   *
   * The rail has no room for an input, so its magnifier has to bring one — and
   * where that comes from is the shell's business, not this component's: on a
   * desktop it expands this same panel, on a tablet it raises the drawer, which
   * is a different instance entirely. Both are "put me somewhere I can type",
   * which is why it is one prop rather than a branch in here.
   */
  readonly onRequestSearch?: () => void
  /**
   * Bind the window's keyboard shortcuts.
   *
   * Exactly one mounted panel may. There are three — the rail's column, the full
   * column, and the drawer — and two of them are always off screen, so this
   * cannot be inferred from the props the way it once was: it is the *visible*
   * one that should answer ⌘K, and only the shell knows which that is.
   */
  readonly ownsShortcuts?: boolean
  /** Raised by the apps menu just before it navigates, so the shell can
   *  cover itself while the new app's nav and screen swap in. */
  readonly onPreferencesChange?: (next: Preferences) => void
  readonly onToggleSidebar?: () => void
  /** Owned by the shell, like `locationPrefs` — this panel is mounted twice and
   *  the dialog inside it has to be looking at one set of switches. */
  readonly preferences?: Preferences
  /** Where you have just been, owned by the shell like the two above. Read-only
   *  here: the panel offers the list and navigating is what changes it. */
  readonly recent?: RecentPages
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  /**
   * Whether the nav list has anything hidden past either end, which is what
   * every hairline at the panel's edges is drawn from.
   *
   * `atBottom` starts true so the foot draws no rule before anything is known —
   * the honest default, since a panel that flashes a line on first paint and
   * then withdraws it is worse than one that arrives a frame late.
   */
  const [scrolled, setScrolled] = useState(false)
  const [atBottom, setAtBottom] = useState(true)
  const navScrollRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  // Search is a mode the whole panel enters, not a bar that is always out: the
  // slot under the head holds either the switcher or the input, never both.
  const [searchOpen, setSearchOpen] = useState(defaultSearchOpen)

  /**
   * Which app this panel is drawing, from the hostname the server saw.
   *
   * It used to be state, seeded from the path and corrected during render
   * whenever a navigation carried a different one. Neither is needed: the app is
   * the first path segment, so it is simply part of the scope the URL resolves
   * to, and a navigation between apps re-renders this panel with a different
   * `domain` the way any other navigation does. No state, no setter, no
   * reset-on-change to keep honest.
   *
   * The *workspace* is the fixed one now, and it comes off the host.
   */
  const org = useCurrentOrg()

  // Scope comes from the URL rather than from state, which is what makes the app
  // switcher a set of links rather than setters, and what keeps a reload, a
  // shared URL and the back button all landing on the same panel.
  const scope = scopeFromPath(pathname, org)
  const domain = scope?.domain ?? defaultDomain(org)
  /**
   * The depth the panel is drawing at — the URL's, unless it has been backed out
   * of.
   *
   * Backing out only ever pops to the root, which is as deep as this nav goes:
   * a site and a section are both one level down from the app's own list, and
   * neither contains the other. One flag is therefore the whole of the state,
   * rather than an index into a stack that could only ever hold two things.
   */
  const urlSite = scope?.kind === "location" ? scope.location : undefined
  const urlSection = openedSection(org, domain, scope)
  const currentSite = navPopped ? undefined : urlSite
  const currentSection = navPopped ? undefined : urlSection
  /** Whichever of the two the panel has gone into, and what the head row names.
   *  They are mutually exclusive — a URL is inside a site or inside a section,
   *  never both — so one row serves both and says which by what it is holding. */
  const inside = currentSite?.name ?? (currentSection ? currentSection.label : undefined)
  /**
   * The row the page you are reading lives under, for while the panel is backed
   * out of it.
   *
   * Without this the root list would have nothing lit whenever you popped up
   * from a project or a site — the page is real and on screen, and the nav would
   * be showing no sign of it. Matched on the path rather than by rebuilding the
   * row, so a site row and a section row need no separate cases: both are the
   * prefix their contents hang off.
   */
  const ancestorHref = navPopped
    ? urlSite
      ? locationHref(domain, urlSite)
      : urlSection
        ? orgHref(domain, urlSection.slug)
        : undefined
    : undefined
  const [accountOpen, setAccountOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * The palette's `/theme`, which has to reach three settings from one keystroke
   * and so cycles rather than toggles: system → light → dark → system.
   *
   * On the stored value rather than the resolved one. Cycling off `resolvedTheme`
   * would read "dark" while you were following a dark system and step you to
   * light — skipping the setting you were actually on and making the run
   * unpredictable from where the list says you are.
   */
  const cycleTheme = () => {
    const order = ["system", "light", "dark"]
    const index = order.indexOf(theme ?? "system")
    setTheme(order[(index + 1) % order.length] ?? "system")
  }

  /**
   * Measure the nav list, so the hairlines above and below it are right at rest
   * rather than only after a wheel.
   *
   * `onScroll` alone was never enough: it fires when you scroll, and a list that
   * is longer than the panel the moment it renders has scrolled nowhere. The
   * foot's rule was hiding under exactly the condition it exists to report, and
   * nobody noticed while the account bar below it drew one unconditionally.
   *
   * The observer watches the box *and* its first child. The box changes when the
   * window or the panel is resized; the child changes when the list does, which
   * is every navigation — Compliance gives a site fifteen rows and Workforce
   * gives it six, and neither resizes the container they scroll in. Both are
   * needed, and the child is a stable wrapper for that reason rather than the
   * groups being children of the scroller directly.
   *
   * Keyed on `searchOpen` because the two bodies are different elements: leaving
   * search mounts a fresh scroller, and an observer still watching the old one
   * would report on a node that has left the document.
   */
  useEffect(() => {
    const el = navScrollRef.current
    if (searchOpen || !el) return

    const measure = () => {
      setScrolled(el.scrollTop > 0)
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [searchOpen])

  // One panel binds these, chosen by the shell — three are mounted and two are
  // hidden, and listeners on all three would race to focus three inputs.
  useEffect(() => {
    if (!ownsShortcuts) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return
      const key = event.key.toLowerCase()

      if (key === "k") {
        event.preventDefault()
        // Toggles, like the head button it stands in for. The chord that opens
        // search is the one your hands are already on when you decide against
        // it, and Escape only works while the input has the caret.
        // Collapsed, the chord has the rail's problem: there is nowhere to
        // type. It asks for a panel on the way, and never toggles *shut* from
        // here — pressing it at a rail means "search", not "stop searching".
        if (collapsed) {
          setSearchOpen(true)
          onRequestSearch?.()
          return
        }
        setSearchOpen((open) => {
          if (open) setQuery("")
          return !open
        })
        return
      }

      // The apps, by position rather than by initial. Free initials don't exist
      // — ⌘O is already the segment above, ⌘C is copy, ⌘W closes the tab — and a
      // numbered run stays obvious as apps are added. It counts this org's apps
      // rather than every app there is, so ⌘4 opens Admin where the org has it
      // and does nothing where it doesn't.
      //
      // Same rule as the switcher itself: inside a site it keeps the site,
      // except where the target app has no site scope to keep it in.
      const index = Number(key) - 1
      const next = Number.isInteger(index) ? domainsFor(org)[index] : undefined
      if (next) {
        event.preventDefault()
        router.push(
          currentSite && next.siteGroups.length
            ? locationHref(next, currentSite)
            : orgHref(next),
        )
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
    // `domain` matters here now that ⌘L builds a location href from it. Moving
    // between apps at org level changes neither `currentSite` nor `org`, so
    // without it the handler would keep the app it was mounted under and send
    // ⌘L in Compliance to an Operations URL.
  }, [collapsed, currentSite, domain, onRequestSearch, org, ownsShortcuts, router])

  // The input only exists while search is open, so focusing it belongs here
  // rather than at either call site — ⌘K and the head button both just flip the
  // flag. An `autoFocus` attribute would do the same thing and is what the lint
  // rule is about; this lands the caret after the element is actually mounted.
  useEffect(() => {
    if (!searchOpen) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [searchOpen])

  const raw = query.trimStart()
  // The prefix picks the list; the rest of the string filters it.
  const mode = raw.startsWith("/")
    ? "commands"
    : raw.startsWith(">")
      ? "documents"
      : "pages"
  const term = (mode === "pages" ? raw : raw.slice(1)).trim().toLowerCase()
  const searching = raw.length > 0

  /**
   * The mode as the box wears it.
   *
   * `query` keeps the prefix — it is still the source of truth, and `mode` above
   * is still read off it — but the field does not show it. A leading `/` sitting
   * in the text was the one character in the box that wasn't part of what you
   * were looking for: it survived every edit, it had to be deleted to get back
   * out, and it made the first word you typed start one column right of where
   * every other search in the world starts it.
   *
   * So the prefix becomes the glyph instead. That slot already held a magnifier
   * saying "this is a search", which is the same kind of statement as "this is a
   * command search" and the obvious place to put the second one. The placeholder
   * follows it, because an empty field under a slash glyph should say what it is
   * waiting for.
   */
  const prefix = mode === "commands" ? "/" : mode === "documents" ? ">" : ""
  const visible = prefix ? raw.slice(1) : query
  const ModeIcon =
    mode === "commands" ? CodeIcon : mode === "documents" ? FileTextIcon : SearchIcon
  const modePlaceholder =
    mode === "commands" ? "Commands" : mode === "documents" ? "Documents" : "Search"

  // Leaving search puts the nav back, rather than emptying the box and leaving
  // you on a blank one — the panel's resting state is the nav, and every exit
  // from here (Escape, running a command, picking a result) means "done".
  const closeSearch = () => {
    setQuery("")
    setSearchOpen(false)
    inputRef.current?.blur()
  }

  // Commands land inside the current org, same as every row in the nav. The
  // three that name a module of another domain cross into it, because a command
  // called "Go to Safety" that refused to leave Operations would be a command
  // that does nothing.
  /**
   * Open a result row.
   *
   * Forks on the href, because the pool it comes from now spans workspaces and
   * a workspace is an origin. `hrefIn` already made the decision — a path stayed
   * a path, a crossing became absolute — so this only has to read which one it
   * was handed and use the navigation that can carry it. `router.push` cannot
   * leave the origin, and a row that silently did nothing would be the failure
   * mode for exactly the rows agnostic search was added to reach.
   */
  const openRow = (href: string) => {
    closeSearch()
    if (href.startsWith("http")) window.location.href = href
    else router.push(href)
  }

  /**
   * Run a quick action.
   *
   * The three with a `section` are navigations to the page that owns the verb;
   * the rest do their whole job here and go nowhere. Both close the search
   * first, because either way you are done with the box.
   */
  const runAction = (action: QuickAction) => {
    closeSearch()
    if (action.key === "preferences") setPreferencesOpen(true)
    else if (action.key === "feedback") setFeedbackOpen(true)
    else if (action.key === "theme") cycleTheme()
    else if ("section" in action)
      router.push(orgHref(commandDomain(action, org, domain), action.section))
  }

  const runCommand = (command: Command) => {
    closeSearch()
    // One lookup for all six navigations, so a command can't disagree with the
    // domain its own label just promised.
    const target = commandDomain(command, org, domain)
    // `/board` run from Compliance lands in Operations, which is a path away
    // rather than an origin away — so every command is a `router.push`, crossing
    // or not.
    const go = (section?: string, child?: string) =>
      router.push(orgHref(target, section, child))

    const { key } = command
    if (key === "overview") go()
    else if (key === "projects") go("projects")
    else if (key === "board") go("projects", "board")
    else if (key === "safety") go("safety")
    else if (key === "people") go("people")
    else if (key === "theme") cycleTheme()
    else if (key === "collapse") onToggleSidebar?.()
    else if (key === "feedback") setFeedbackOpen(true)
  }

  // Matched on the meta line as well as the label, which agnostic search makes
  // necessary rather than merely nice: with every app in the pool, "compliance"
  // is a word that names a whole section of the results and matches the label of
  // almost none of them.
  //
  // Capped at `SEARCH_ROWS`. The pool is a few hundred rows now and a one-letter
  // term reaches most of it — a list that long is not a set of answers, it is the
  // product again with a filter on. `matchCount` keeps the true total, because a
  // panel showing 20 of 96 has to say so: silently truncating reads as "this is
  // everything" and sends you looking for the row that was cut.
  const allMatches = allSearchable(org).filter(
    (item) =>
      !term ||
      item.label.toLowerCase().includes(term) ||
      (item.meta?.toLowerCase().includes(term) ?? false),
  )
  const matchCount = allMatches.length
  const pageMatches = allMatches.slice(0, SEARCH_ROWS)

  // Only the ones this workspace can actually reach. An action naming a section
  // of an app the org is not entitled to would route to a 404, and dropping it
  // here is the same entitlement check `commandDomain` does for the commands.
  const quickActions = QUICK_ACTIONS.filter(
    (action) => !action.domain || org.apps.includes(action.domain),
  )

  // Before you have typed anything, the panel offers where you have been rather
  // than the nav it is already standing in front of. Each row carries where it
  // lives in its meta slot, because the most useful recent is often the one you
  // just left in the other app.
  //
  // Dropping the page you are on, since offering it is offering nothing.
  const recentRows = recent
    .filter((path) => path !== pathname)
    .map((path) => recentRow(path, org))
    .filter((item): item is NavItem => Boolean(item))

  // What the panel offers before a keystroke, and what to call it. History when
  // there is any; a sample of the pool when there isn't, so a first search is
  // never a blank panel. Either way it is headed — an unlabelled list left you
  // guessing whether five rows were your history or a truncated nav, and on a
  // fresh session it was silently the second.
  //
  // Capped and honestly labelled when it falls back, because the pool is every
  // page in every app in every workspace: "Suggestions" rather than "All pages",
  // since that heading over 12 of 300 rows would be a lie.
  const resting = recentRows.length ? recentRows : pageMatches.slice(0, RESTING_ROWS)
  const restingLabel = recentRows.length ? "Recent" : "Suggestions"
  const commandMatches = COMMANDS.filter(
    (command) =>
      !term ||
      command.token.slice(1).includes(term) ||
      command.label.toLowerCase().includes(term),
  )
  const documentMatches = DOCUMENTS.filter(
    (doc) => !term || doc.title.toLowerCase().includes(term),
  )

  /**
   * The app after this one, wrapping — what the rail's single tile advances to.
   *
   * A rail is 48px of column that also has to hold every section of the app you
   * are in. One tile per app spends that budget on a switcher that is mostly the
   * apps you are *not* using, and grows with every app added; one tile that
   * cycles costs the same at four apps as at two.
   *
   * `findIndex` returning -1 lands on the first app, which is the right answer
   * for a domain the workspace no longer has. A workspace with one app gets
   * itself back, and the tile below stops being a control.
   */
  const apps = domainsFor(org)
  const nextApp = apps.length
    ? apps[(apps.findIndex((item) => item.slug === domain.slug) + 1) % apps.length]
    : undefined
  const cyclesApps = Boolean(nextApp && nextApp.slug !== domain.slug)
  /** Capitalised because it is rendered as a component: the tile always wears
   *  the app you are *in*, never the one it advances to — the glyph is state,
   *  and the tooltip is what says what pressing it does. */
  const CurrentAppIcon = domainIcon(domain)

  // ── Collapsed rail ──────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <aside
        className={cn(
          "flex h-full w-full flex-col items-center gap-0.5 bg-sidebar py-2 text-sidebar-foreground",
          className,
        )}
      >
        {/* The mark, going home — this app's overview, the same place the
            "Back" row and the Overview row point at.

            It is deliberately not the collapse control it once was: that made
            the one fixed point in the chrome the one thing that changed under
            the pointer, and put an action on the element the eye uses to find
            its place. Expanding is still the page header's job. A link home is
            the other thing a mark in a corner is *expected* to be, so it costs
            the rail nothing to read and gives the collapsed state a way back to
            the front page that the expanded panel has and it did not.

            A `Link`, so it middle-clicks and copies like every other row here,
            and only `hover:bg-fill` from the rail's inactive treatment — the
            rest of that class sets text colour, and the mark is an image. */}
        <RailItem label={`${org.name} · overview`}>
          <Link className={cn(railItemClass, "hover:bg-fill")} href={orgHref(domain)}>
            <BrandLogo className="size-5" />
          </Link>
        </RailItem>

        {/* The rail has no input, so this both opens search *and* asks for a
            panel that can show it. It used to only do the second — you pressed
            a magnifier, the panel came out, and you were looking at the nav with
            the search still shut.

            Both, in that order: setting the flag first means the expanded panel
            paints already in search mode rather than showing the nav for a frame
            and then swapping. Where the drawer is what appears instead, the flag
            set here is on a panel nobody can see and the shell carries the
            intent across for it. */}
        <RailItem label="Search">
          <button
            className={cn(railItemClass, railInactiveClass)}
            onClick={() => {
              setSearchOpen(true)
              onRequestSearch?.()
            }}
            type="button"
          >
            <SearchIcon className="size-3.5" />
          </button>
        </RailItem>

        <div className="my-1.5 h-px w-6 shrink-0 bg-border" />

        {/* The switcher, as one tile rather than one per app. It shows the app
            you are in and moves to the next on each press, wrapping — a rail has
            no room for a list, and a list of four here would push the sections
            below it off a short window.

            It keeps the top of the rail — above the rows, under the mark —
            because that is where the button sits in the expanded panel's head,
            and a control that moved when the panel narrowed would have to be
            found twice.

            The inactive treatment, not the active one: with a single tile there
            is nothing for a fill to distinguish it *from*, and the glyph is
            already saying which app you are in. Filled, it would read as the row
            you are on rather than as the control that changes them.

            A `Link` where cycling is possible, so it middle-clicks and opens in
            a tab like every other row — and a plain tile where it is not, since
            a workspace with one app has nowhere to advance to and a control that
            does nothing is worse than a label. */}
        {cyclesApps && nextApp ? (
          <RailItem label={`${domain.label} · switch to ${nextApp.label}`}>
            <Link
              className={cn(railItemClass, railInactiveClass)}
              href={
                currentSite && nextApp.siteGroups.length
                  ? locationHref(nextApp, currentSite)
                  : orgHref(nextApp)
              }
            >
              <CurrentAppIcon className="size-3.5" />
            </Link>
          </RailItem>
        ) : (
          <RailItem label={domain.label}>
            <div className={cn(railItemClass, "cursor-default text-muted-foreground")}>
              <CurrentAppIcon className="size-3.5" />
            </div>
          </RailItem>
        )}

        <div className="my-1.5 h-px w-6 shrink-0 bg-border" />

        <div className="flex min-h-0 flex-1 flex-col items-center gap-0.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* The current domain's groups and then the sites, in the order the
              expanded panel draws them — hairlines standing in for the gaps,
              since 32px of column has no room to space rows apart. The site
              sections aren't among them: this is a jump list, and it jumps
              between scopes rather than around inside one. */}
          {[
            ...orgGroups(org, domain),
            ...(domain.siteGroups.length ? allLocationRows(domain, org) : []),
          ].map((group, index) => (
            <div className="contents" key={group.key}>
              {index > 0 ? <div className="my-1 h-px w-6 shrink-0 bg-border" /> : null}
              {group.items.map((item) => (
                <RailItem key={item.href} label={item.label}>
                  <Link
                    className={cn(
                      railItemClass,
                      item.href === pathname
                        ? "bg-fill text-foreground"
                        : railInactiveClass,
                    )}
                    href={item.href}
                  >
                    <item.icon className="size-3.5" />
                  </Link>
                </RailItem>
              ))}
            </div>
          ))}
        </div>

        <div className="my-1.5 h-px w-6 shrink-0 bg-border" />

        <NotificationsMenu
          align="end"
          className={cn(railItemClass, railInactiveClass)}
          cleared={alertPrefs.cleared}
          iconClassName="size-3.5"
          org={org}
          read={alertPrefs.read}
          side="right"
        />

        <RailItem label="Theme">
          <ThemeButton
            className={cn(railItemClass, railInactiveClass)}
            iconClassName="size-3.5"
          />
        </RailItem>

        <AccountMenu
          align="end"
          label="Account"
          onAccount={() => setAccountOpen(true)}
          onFeedback={() => setFeedbackOpen(true)}
          onPreferences={() => setPreferencesOpen(true)}
          side="right"
        >
          <button className={cn(railItemClass, "hover:bg-fill")} type="button">
            <span className="grid size-6 place-items-center rounded-full bg-fill-strong text-[10px] font-medium text-foreground">
              {ACCOUNT.initials}
            </span>
          </button>
        </AccountMenu>

        <AccountDialog onOpenChange={setAccountOpen} open={accountOpen} />
        <FeedbackDialog onOpenChange={setFeedbackOpen} open={feedbackOpen} />
        <PreferencesDialog
          onChange={(next) => onPreferencesChange?.(next)}
          onOpenChange={setPreferencesOpen}
          open={preferencesOpen}
          preferences={preferences}
        />
      </aside>
    )
  }

  // ── Expanded ────────────────────────────────────────────────────────────
  return (
    <aside
      className={cn(
        "flex h-full w-full shrink-0 flex-col bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      {/* The footer's row, repeated: what you are looking at on the left, one
          hairline, then the two things you do to it. Same `gap-1.5`, same
          divider, same pair-in-its-own-flex on the right — the head and the
          foot bracket the panel, so they have to be the same shape. Collapse
          isn't among these; it lives in the page header. */}
      <div className="shrink-0 px-2 pt-2">
        <div className="flex items-center gap-1.5">
          <BrandMenu domain={domain} onSwitch={onWorkspaceSwitch} org={org} />
          <HeadDivider />
          {/* Its own flex context still, though there is one thing in it now:
              search moved down to the foot beside the other utilities, and the
              app switcher left the panel entirely for the rail against the page.
              What is left is the one control here that makes rather than
              goes. */}
          <div className="flex items-center">
            <QuickActionsMenu actions={quickActions} onRun={runAction} />
          </div>
        </div>
      </div>

      {/* The apps, above the segment that scopes whichever one you pick — which
          app, then which part of it, reading down. Hidden with one app, where a
          toggle has nothing to toggle, and while searching, for the same reason
          the control below it is.

          The panel now stacks two of these. They are a pair rather than a
          repetition: this one changes the product, the one under it changes what
          of the product the list is showing, and neither is reachable from the
          other. Sharing a trough treatment is what says they belong together. */}
      {cyclesApps && !searchOpen ? (
        <div className="mt-2 px-2">
          <AppToggle domain={domain} org={org} site={currentSite} />
        </div>
      ) : null}

      {/* The way out of a nav you went into, wearing the name of what you are
          in. Inside a site only — at the company's level there is nothing above
          to go back to, and the app toggle is what leaves.

          Gone while searching, like the toggle above it: the panel while you are
          typing is a box and its answers, and a row naming the place you were
          before you started typing is not one of the answers. */}
      {inside && !searchOpen ? (
        <div
          className={cn(
            "mt-2 border-b border-transparent px-2 pb-2",
            scrolled && "border-border",
          )}
        >
          <NavBackRow label={inside} onPop={onNavPop} />
        </div>
      ) : null}

      {searchOpen ? (
        <>
          {/* The two prefixes are invisible until you type one, so the panel has
              to say they are there. At the top now, under the head and over the
              rule, because it is the one line here that is not a result: the
              band below it fills from the caret upward, and a hint sitting at
              the end of that run would be wherever the last match left it. Fixed
              at the top it is in the same place whether there are two rows or
              forty. */}
          {/* `shrink-0`, like every other fixed band in this panel. The results
              are the only thing here allowed to give: without it a long list
              makes flex take the space back off whichever siblings can spare it,
              and the hint, the box and the foot all compress a little instead of
              the one region that has a scrollbar. */}
          <div className="mt-2 shrink-0 border-b px-2 pb-2">
            <p className="px-3 text-[10px] text-muted-foreground/60">
              <span className="font-mono">/</span> for commands ·{" "}
              <span className="font-mono">&gt;</span> for documents
            </p>
          </div>
          {/* `flex-col-reverse`: the rows stack up from the input rather than
              down from the rule, so the first match is the one nearest the
              caret and the list grows toward the space it has. It also packs to
              the bottom for free — a reversed column's start edge *is* the
              bottom, so a short list sits on the box instead of hanging from the
              top of it — and a scroller in this direction opens already at that
              end, which is the end you are reading from. */}
          <div className="thin-scrollbar flex min-h-0 flex-1 flex-col-reverse overflow-y-auto px-2 pt-2 pb-2">
            {mode === "commands" ? (
              commandMatches.length ? (
                commandMatches.map((command) => {
                  // Named only when it crosses: `/board` run from Compliance
                  // leaves the nav you are in, and the row has to say so before
                  // you press it. From Operations the same row would be telling
                  // you where you already are.
                  const target = commandDomain(command, org, domain)
                  return (
                    <ResultRow
                      icon={command.icon}
                      key={command.key}
                      label={
                        target.slug === domain.slug
                          ? command.label
                          : `${command.label} in ${target.label}`
                      }
                      meta={command.token}
                      mono
                      onClick={() => runCommand(command)}
                    />
                  )
                })
              ) : (
                <p className="shrink-0 px-2 py-6 text-center text-xs text-muted-foreground">
                  No commands
                </p>
              )
            ) : mode === "documents" ? (
              documentMatches.length ? (
                documentMatches.map((doc) => (
                  <ResultRow
                    icon={FileTextIcon}
                    key={doc.title}
                    label={doc.title}
                    meta={doc.meta}
                    mono
                    onClick={closeSearch}
                  />
                ))
              ) : (
                <p className="shrink-0 px-2 py-6 text-center text-xs text-muted-foreground">
                  No documents
                </p>
              )
            ) : !searching ? (
              // Headed, unlike the matches below, because this list is not what
              // you asked for — you have not asked yet. The heading is what makes
              // the first keystroke replacing them read as an answer rather than
              // as the list changing its mind.
              //
              // The heading is written *after* its rows, so the reversed column
              // puts it back on top of them. Left first it would have come out
              // under the list, labelling it from below.
              <>
                {resting.map((item) => (
                  <ResultRow
                    icon={item.icon}
                    key={rowKey(item)}
                    label={item.label}
                    meta={item.meta}
                    onClick={() => openRow(item.href)}
                  />
                ))}
                <p className={groupLabelClass}>{restingLabel}</p>
              </>
            ) : pageMatches.length ? (
              <>
                {pageMatches.map((item) => (
                  <ResultRow
                    icon={item.icon}
                    key={rowKey(item)}
                    label={item.label}
                    meta={item.meta}
                    onClick={() => openRow(item.href)}
                  />
                ))}
                {/* Only when the cap actually bit. Last in source, so the
                    reversed column puts it above the rows it is counting —
                    the far end of the list from the caret, which is where you
                    arrive having read past all twenty. */}
                {matchCount > pageMatches.length ? (
                  <p className={groupLabelClass}>
                    {pageMatches.length} of {matchCount} — keep typing to narrow
                  </p>
                ) : null}
              </>
            ) : (
              // Nothing to qualify it with any more. This used to name the app
              // and the segment, because those were the two scopes narrowing the
              // search and either could be why a word found nothing. The search
              // spans every app in every workspace now, so there is no scope left
              // to blame and no control to point at — the word simply isn't in the
              // product, and saying more than that would be inventing a reason.
              <p className="shrink-0 px-2 py-6 text-center text-xs text-muted-foreground">
                No matches
              </p>
            )}
          </div>
        </>
      ) : (
        // `gap-4` rather than the `gap-5` this had while the groups were
        // unlabelled: a heading is separation of its own, and the two together
        // push the last group off the fold for no gain.
        //
        // The border only appears once there is something scrolled out of
        // sight — a permanent rule here would cut the panel in two. With the
        // back row above, that hairline is the back row's to draw: it is the
        // seam between the pinned row and the list, and two rules across one
        // seam draws it twice. The top spacing moves inside for the same reason
        // — the margin would put the gap above the hairline instead of below it.
        <div
          className={cn(
            "thin-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto border-t border-transparent px-2 pb-2",
            inside ? "pt-2" : "mt-2",
            scrolled && !inside && "border-border",
          )}
          onScroll={(event) => {
            const el = event.currentTarget
            setScrolled(el.scrollTop > 0)
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1)
          }}
          ref={navScrollRef}
        >
          {/* The groups sit in a wrapper rather than directly in the scroller,
              so the observer above has one stable box whose height *is* the
              content's. React reuses this element across navigations where it
              would replace the groups inside it, which is the difference between
              an observer that keeps reporting and one that goes quiet the first
              time you change app. `gap-4` moves here with them. */}
          {/* `shrink-0` for the reason `ResultRow` carries one: this is the
              scroller's only child, so it is the flex item that would otherwise
              give up height instead of letting the column overflow, taking every
              row under it down with it. */}
          <div className="flex shrink-0 flex-col gap-4">
            {navGroups(org, domain, locationPrefs, currentSite, currentSection).map(
              (group) => (
                <div className="flex flex-col gap-0.5" key={group.key}>
                  {group.label ? <p className={groupLabelClass}>{group.label}</p> : null}
                  {group.items.map((item) => (
                    <NavRow
                      active={item.href === pathname || item.href === ancestorHref}
                      current={item.href === pathname}
                      item={item}
                      key={item.href}
                      onReenter={onNavRestore}
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* The way out used to be pinned here, at the foot, opposite the row that
          named where you were. `NavBackRow` is both of those now — it says what
          you are in and leaves it, from the top, which is where a stack-based
          nav puts its way back and where the eye looks for one.

          Two rows for one idea was the older arrangement's real cost: the name
          and the exit were a pair that had to be read together and sat at
          opposite ends of a scrolling list, so the panel spent a row at each end
          on chrome and the sections got what was left between them. */}

      {/* The input, in the foot slot — the last band before the account row, in
          the same place the "Back" row above it occupies when the nav is
          showing. The results run above it and grow upward from it.

          The cost is real and known: the list grows *away* from the caret,
          which is why this sat under the head for a while. What buys it back is
          where the hand already is. The toggle that opens search is in the foot
          — as is ⌘K's nearest visible affordance — and the panel's other
          committing rows are down here too, so the box is under the pointer
          that asked for it rather than a panel-height away at the top.

          A real hairline, not the conditional one the rows around it wear.
          Theirs appears only while a list is running on underneath, because
          there the seam is between a list and more of the same list. This seam
          is between the answers and the thing you type into, which is a
          different kind of edge and true whether or not anything is scrolled. */}
      {searchOpen ? (
        <div className="shrink-0 border-t p-2">
          {/* No fill behind it. The box was the only filled thing in a panel of
              bare rows, which made the search look like a widget dropped into
              the nav rather than the nav's own line — and it wore that fill
              permanently, so the surface that should be loudest while you type
              looked identical before you had.

              `px-2.5`, not the `px-2` it had: the fill was what let the box get
              away with its own inset, because a filled rectangle is read by its
              edge and not by what is inside it. Bare, the magnifier is just the
              first glyph in a column of glyphs, so it takes the padding the
              result rows take — `navRowClass`, which moved from `px-3` to
              `px-2.5` when the rows came down a size, and this has to move with
              it or the box's glyph sits 2px off the column it heads.

              `h-7` for the same reason, on the other axis: the rows above are
              `h-7` now, and the one row you type into should not be the tall one. */}
          <div className="flex h-7 items-center gap-2 px-2.5">
            {/* The mode, as the leading glyph — see `prefix` above. */}
            <ModeIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
              // The prefix is put back on the way in, since the field is showing
              // the query without it. `query` stays the whole string, so `mode`
              // and `term` are read off one value rather than reconstructed.
              onChange={(event) => setQuery(prefix + event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closeSearch()
                  return
                }
                // Backspace on an empty field leaves the mode. Without this
                // there is no way out of one: the `/` that put you there is not
                // in the box to delete, so the browser has nothing to erase and
                // the glyph would sit there until you closed search entirely.
                if (event.key === "Backspace" && prefix && !visible) {
                  event.preventDefault()
                  setQuery("")
                }
              }}
              placeholder={modePlaceholder}
              ref={inputRef}
              type="search"
              value={visible}
            />
            {searching ? null : <ShortcutHint />}
          </div>
        </div>
      ) : null}

      {/* Account on the left, utilities on the right — the head row's treatment
          without its middle zone.

          Its rule is conditional now, like every other rule in this panel: it
          appears only while the list is running on under it, and a nav short
          enough to fit gets no line at all. A permanent one was drawing a floor
          under a panel that had nothing left to say — the hairline's whole job
          here is "there is more", and it was claiming that on empty.

          `!atBottom` rather than a check for the list being taller than its box:
          reaching the end of a long list is the same as never having had one, in
          the only sense that matters — there is nothing further down. So the
          line withdraws as you land, the same way the foot slot's does.

          The reserved transparent border is what keeps the row from moving by a
          pixel as it comes and goes. */}
      <div
        className={cn("border-t border-transparent p-2", !atBottom && "border-border")}
      >
        <div className="flex items-center gap-1.5">
          <AccountMenu
            onAccount={() => setAccountOpen(true)}
            onFeedback={() => setFeedbackOpen(true)}
            onPreferences={() => setPreferencesOpen(true)}
          >
            {/* Mark and name are one target, like the head's switcher, and it
                hugs them: the hover fill wraps the name rather than running the
                width of the panel. `min-w-0` still matters — that is about
                truncating once the panel is dragged in, not about the resting
                width. The base colour is the switcher's too, so the chevron
                inherits it and lifts on hover while the initials and the name,
                which pin `text-foreground` themselves, stay put. */}
            <button
              className="group flex h-7 min-w-0 items-center gap-2 rounded-md pr-2 pl-1 text-left text-muted-foreground/55 transition-colors hover:bg-fill hover:text-foreground"
              type="button"
            >
              <span
                aria-hidden
                className="grid size-5 shrink-0 place-items-center rounded-full bg-fill-strong text-[10px] font-medium text-foreground"
              >
                {ACCOUNT.initials}
              </span>
              {/* `ml-1` on top of the row's `gap-2`, as in the head: a filled
                  tile crowds a letterform at 8px in a way two letterforms never
                  crowd each other, and the two rows have to agree about it. */}
              <span className="ml-1 truncate text-sm font-medium text-foreground">
                {FIRST_NAME}
              </span>
              {/* Single, where the workspace switcher above uses the double: it
                  points at where the menu comes out — upward, from the foot of
                  the panel — the same way the header's panel buttons point at
                  the edge they open. Once the menu *is* out it turns over to
                  point back down at the button, which is now the way to dismiss
                  it. Base UI puts `data-popup-open` on whatever the trigger
                  renders, and that is this button, so the group is right here
                  rather than on a wrapper. */}
              <ChevronUpIcon className="size-3.5 shrink-0 transition-transform duration-200 group-data-[popup-open]:rotate-180" />
            </button>
          </AccountMenu>
          {/* Pinned to the far edge, and their own flex context so they read as
              a pair rather than as two more items in the row. No hairline, for
              the same reason as the head. */}
          <div className="ml-auto flex items-center">
            <ThemeButton
              className={cn(chromeButtonClass, "grid size-7 place-items-center")}
            />
            {/* `start`, so the list grows rightward from the button's left edge
                — into the page, which is empty, rather than back across the
                panel's own foot row, which is not. Its twin in the rail keeps
                `end`: that one opens sideways, where `align` is the vertical
                axis and `end` is what stands it up off the bottom of the
                column. */}
            <NotificationsMenu
              align="start"
              className={cn(chromeButtonClass, "grid size-7 place-items-center")}
              cleared={alertPrefs.cleared}
              org={org}
              read={alertPrefs.read}
              side="top"
            />
            {/* Last in the row, and down here rather than up in the head where
                it used to be: the box it opens is the band directly beneath
                this, so the control and the thing it reveals are now a pair you
                can see at once instead of the two ends of the panel.

                Turns the panel into the search one rather than opening a modal —
                the results belong here, where they read as this nav narrowing
                rather than as a second surface landing on top of it. It toggles,
                so the same button gets you back out.

                `aria-expanded` rather than a hand-rolled active class: the ghost
                variant already carries `aria-expanded:bg-fill` and
                `aria-expanded:text-foreground`, which is how every dropdown
                trigger in this app looks while open — so held-down search reads
                the same as a held-open menu, and there is only one toggled look
                in the design system rather than two. It is the honest attribute
                too: this button reveals a region, which is a disclosure. */}
            <Button
              aria-expanded={searchOpen}
              aria-label="Search"
              className={chromeButtonClass}
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <SearchIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* All three, and all three in both branches. The rail returns early with
          its own copies, so a dialog mounted in only one of them has a menu item
          that sets state nothing is listening to — which is silence rather than
          an error, and the reason this is worth stating rather than leaving to
          whoever adds the fourth. */}
      <AccountDialog onOpenChange={setAccountOpen} open={accountOpen} />
      <FeedbackDialog onOpenChange={setFeedbackOpen} open={feedbackOpen} />
      {/* The switches inside belong to the shell, so this is a view onto them
          rather than an owner of them — the rail's copy of this dialog and the
          expanded panel's are looking at the same object. */}
      <PreferencesDialog
        onChange={(next) => onPreferencesChange?.(next)}
        onOpenChange={setPreferencesOpen}
        open={preferencesOpen}
        preferences={preferences}
      />
    </aside>
  )
}
