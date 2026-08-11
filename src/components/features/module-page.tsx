/**
 * A module's page, at either scope.
 *
 * Two exports rather than one taking a `Scope`, because the two callers have
 * already narrowed the union and handing it back to be re-narrowed here is a
 * round trip that only adds a branch nobody can reach.
 *
 * Both fall back to `SectionPlaceholder` when the catalogue has no entry. The
 * nav is allowed to be ahead of `lib/modules` — a slug added to `DOMAINS` should
 * produce a page that says so, not a crash.
 */

import { SwmsWizard } from "@/components/features/swms-wizard"
import {
  BoardView,
  CalendarView,
  HeatmapView,
  MapView,
  TimelineView,
} from "@/components/features/views/planning"
import { CompareView, ReportView } from "@/components/features/views/publishing"
import {
  CardsView,
  ChecklistView,
  GalleryView,
  GridView,
  MatrixView,
  TableView,
} from "@/components/features/views/collections"
import {
  CaptureView,
  DashboardView,
  DocumentsView,
  FeedView,
  FormView,
  RecordView,
  SplitView,
  WizardView,
} from "@/components/features/views/records"
import { SectionPlaceholder } from "@/components/features/section-placeholder"
import { PageHeader, type PageTag, type PageView } from "@/components/shared/page-header"
import {
  moduleFor,
  TIER_LABELS,
  VIEW_LABELS,
  type Module,
  type ModuleView,
  type Tier,
} from "@/lib/modules"
import { orgHref, type Domain, type Location, type Org, type Section } from "@/lib/scope"

/**
 * Tier, as weight rather than as colour-coding.
 *
 * Stakes is the loudest because it is the one that means "not shipping without
 * this". Edge is the only one that takes a hue, and takes the quiet one: it is
 * where the product wins, and a red banner over the differentiator would read as
 * a warning about it.
 */
const TIER_TONE: Record<Tier, NonNullable<PageTag["tone"]>> = {
  stakes: "solid",
  parity: "muted",
  edge: "accent",
}

/**
 * What the header says about a module, beside its name.
 *
 * This was a band of its own under the header — a permanent second row on every
 * scaffold in the app, carrying one sentence and three chips. It cost 50px of
 * every page to say something the header had room for, and the header was
 * already the thing that says what you are looking at.
 *
 * The order is deliberate. Tier first, because "is this shipping" is the
 * question the catalogue exists to answer; shape second; and the scaffold
 * marker last, where it reads as a qualifier on the two before it rather than as
 * the headline. It stays on every page it applies to — a scaffold that only
 * announces itself in a changelog gets screenshotted into a deck as a finished
 * feature.
 */
const moduleTags = (module: Module, view: ModuleView): PageTag[] => [
  { label: TIER_LABELS[module.tier], tone: TIER_TONE[module.tier] },
  { label: VIEW_LABELS[view.kind], tone: "muted" },
  { label: "Scaffold", tone: "outline" },
]

/** The catalogue's shapes, as components. Exhaustive over `ViewKind`, so adding
 *  a kind is a type error here rather than a blank page in production.
 *
 *  Exported for the one page that is an entity rather than a section — a project
 *  — which still wants its shape chosen by the catalogue rather than picked in
 *  its own file, or the catalogue would be lying about one module. */
export function renderView(view: ModuleView, moduleKey?: string) {
  // SWMS Issue wizard is the AI generation flagship — render it directly.
  if (moduleKey === "compliance/swms" && view.slug === "issue") {
    return <SwmsWizard />
  }
  switch (view.kind) {
    case "board":
      return <BoardView view={view} />
    case "calendar":
      return <CalendarView />
    case "capture":
      return <CaptureView view={view} />
    case "cards":
      return <CardsView view={view} />
    case "checklist":
      return <ChecklistView view={view} />
    case "compare":
      return <CompareView view={view} />
    case "dashboard":
      return <DashboardView view={view} />
    case "documents":
      return <DocumentsView view={view} />
    case "feed":
      return <FeedView view={view} />
    case "form":
      return <FormView view={view} />
    case "gallery":
      return <GalleryView />
    case "grid":
      return <GridView view={view} />
    case "heatmap":
      return <HeatmapView view={view} />
    case "map":
      return <MapView view={view} />
    case "matrix":
      return <MatrixView view={view} />
    case "record":
      return <RecordView view={view} />
    case "report":
      return <ReportView view={view} />
    case "split":
      return <SplitView view={view} />
    case "table":
      return <TableView view={view} />
    case "timeline":
      return <TimelineView view={view} />
    case "wizard":
      return <WizardView view={view} />
  }
}

/**
 * The whole company's copy of a module.
 *
 * A module with more than one view gets the header's segmented control, built
 * from the catalogue rather than written per page — the same job
 * `project-views` does for the one module that had two readings before there
 * were forty.
 */
export function OrgModulePage({
  child,
  domain,
  org,
  section,
}: {
  readonly child?: Section
  readonly domain: Domain
  readonly org: Org
  readonly section: Section
}) {
  const module = moduleFor(domain.slug, section.slug)
  if (!module) {
    return (
      <SectionPlaceholder
        scope={`${org.name} · ${domain.label}`}
        title={child?.label ?? section.label}
      />
    )
  }

  // The router has already checked the child against `DOMAINS`; this checks it
  // against the catalogue, which is a different list and may not have caught up.
  const view =
    (child ? module.views.find((item) => item.slug === child.slug) : undefined) ??
    module.views[0]

  const views: PageView[] | undefined =
    module.views.length > 1
      ? module.views.map((item) => ({
          label: item.label,
          href: orgHref(domain, section.slug, item.slug),
          active: item === view,
        }))
      : undefined

  const moduleKey = `${domain.slug}/${section.slug}`

  return (
    <>
      <PageHeader
        description={module.summary}
        tags={moduleTags(module, view)}
        title={section.label}
        views={views}
      />
      {renderView(view, moduleKey)}
    </>
  )
}

/**
 * One site's copy of a module.
 *
 * No segmented control: the fourth path position is spent on the section once
 * the third is a site, so there is nowhere to put a second view. The catalogue's
 * `siteView` is the one reading a site gets, and it is usually the narrower one
 * — the columns saying which site this is are the first thing worth dropping
 * when the answer is in the URL.
 */
export function SiteModulePage({
  domain,
  location,
  section,
}: {
  readonly domain: Domain
  readonly location: Location
  readonly section: Section
}) {
  const module = moduleFor(domain.slug, section.slug)
  if (!module) {
    return (
      <SectionPlaceholder
        scope={`${location.name} · ${domain.label}`}
        title={section.label}
      />
    )
  }

  const view = module.siteView ?? module.views[0]

  return (
    <>
      <PageHeader
        location={{
          label: location.name,
          locationSlug: location.slug,
        }}
        description={module.summary}
        tags={moduleTags(module, view)}
        title={section.label}
      />
      {renderView(view)}
    </>
  )
}
