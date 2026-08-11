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

import { InsightsCompliance } from "@/components/features/insights-compliance"
import { InsightsOperations } from "@/components/features/insights-operations"
import { InsightsWorkforce } from "@/components/features/insights-workforce"
import { CompetencyMatrix } from "@/components/features/competency-matrix"
import { OnboardingBoard } from "@/components/features/onboarding-board"
import { PerformanceTable } from "@/components/features/performance-table"
import { PhotosGallery } from "@/components/features/photos-gallery"
import { QualityRegister } from "@/components/features/quality-register"
import { TimesheetsGrid } from "@/components/features/timesheets-grid"
import { ActionsList } from "@/components/features/actions-list"
import { ChemicalsRegister } from "@/components/features/chemicals-register"
import { ContractorsRegister } from "@/components/features/contractors-register"
import { DocumentsLibrary } from "@/components/features/documents-library"
import { EmergencyProcedures } from "@/components/features/emergency-procedures"
import { EnvironmentRegister } from "@/components/features/environment-register"
import { PermitsRegister } from "@/components/features/permits-register"
import { SafetyIncidentTable } from "@/components/features/safety-incident-table"
import { AssetsRegister } from "@/components/features/assets-register"
import { AwardRates } from "@/components/features/award-rates"
import { ClaimsRegister } from "@/components/features/claims-register"
import { DefectsBoard } from "@/components/features/defects-board"
import { DeliveriesList } from "@/components/features/deliveries-list"
import { DiaryFeed } from "@/components/features/diary-feed"
import { InductionsTable } from "@/components/features/inductions-table"
import { InjuryCases } from "@/components/features/injury-cases"
import { InspectionsSchedule } from "@/components/features/inspections-schedule"
import { LeaveRequests } from "@/components/features/leave-requests"
import { MedicalsTable } from "@/components/features/medicals-table"
import { PeopleTable } from "@/components/features/people-table"
import { PpeRegister } from "@/components/features/ppe-register"
import { ProjectsTable } from "@/components/features/projects-table"
import { RiskRegister } from "@/components/features/risk-register"
import { SafetyBoard } from "@/components/features/safety-board"
import { SiteAccessTable } from "@/components/features/site-access-table"
import { SwmsWizard } from "@/components/features/swms-wizard"
import { ToolboxTalks } from "@/components/features/toolbox-talks"
import { TrainingTickets } from "@/components/features/training-tickets"
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
  // Safety Board shows real incident cards, not scaffold bars.
  if (moduleKey === "compliance/safety" && view.kind === "board") {
    return <SafetyBoard />
  }
  // Inspections schedule — the templated/scored inspection list.
  if (moduleKey === "compliance/inspections" && view.slug === "list") {
    return <InspectionsSchedule />
  }
  // Corrective actions list — cross-register action queue.
  if (moduleKey === "compliance/actions" && view.slug === "list") {
    return <ActionsList />
  }
  // Risk register — hierarchy of control, residual scoring.
  if (moduleKey === "compliance/risk" && view.kind === "table") {
    return <RiskRegister />
  }
  // Toolbox talks — scheduled, delivered, attendance captured on site.
  if (moduleKey === "compliance/toolbox" && view.kind === "table") {
    return <ToolboxTalks />
  }
  // Projects register — the spine every other operations record hangs off.
  if (moduleKey === "operations/projects" && view.kind === "table") {
    return <ProjectsTable />
  }
  // Defects board — NCR/defects kanban, location-pinned and assigned.
  if (moduleKey === "operations/defects" && view.kind === "board") {
    return <DefectsBoard />
  }
  // Site diary feed — one entry per site per day.
  if (moduleKey === "operations/diary" && view.kind === "feed") {
    return <DiaryFeed />
  }
  // Site access / attendance register.
  if (moduleKey === "operations/access" && view.kind === "table") {
    return <SiteAccessTable />
  }
  // Deliveries list — gate bookings and slot management.
  if (moduleKey === "operations/deliveries" && view.slug === "list") {
    return <DeliveriesList />
  }
  // Plant and equipment register.
  if (moduleKey === "operations/assets" && view.kind === "table") {
    return <AssetsRegister />
  }
  // Progress claims register.
  if (moduleKey === "operations/claims" && view.slug === "list") {
    return <ClaimsRegister />
  }
  // Workforce — people directory.
  if (moduleKey === "workforce/people" && view.kind === "table") {
    return <PeopleTable />
  }
  // Workforce — induction records.
  if (moduleKey === "workforce/inductions" && view.kind === "table") {
    return <InductionsTable />
  }
  // Workforce — training tickets / licences.
  if (moduleKey === "workforce/training" && view.kind === "table") {
    return <TrainingTickets />
  }
  // Workforce — leave requests list.
  if (moduleKey === "workforce/leave" && view.slug === "list") {
    return <LeaveRequests />
  }
  // Workforce — injury / RTW cases.
  if (moduleKey === "workforce/injury" && view.kind === "table") {
    return <InjuryCases />
  }
  // Workforce — PPE issue register.
  if (moduleKey === "workforce/ppe" && view.kind === "table") {
    return <PpeRegister />
  }
  // Workforce — medical records.
  if (moduleKey === "workforce/medicals" && view.kind === "table") {
    return <MedicalsTable />
  }
  // Workforce — award / pay rates.
  if (moduleKey === "workforce/rates" && view.kind === "table") {
    return <AwardRates />
  }
  // Compliance — safety incident table (register view; board is SafetyBoard).
  if (moduleKey === "compliance/safety" && view.kind === "table") {
    return <SafetyIncidentTable />
  }
  // Compliance — permit to work register.
  if (moduleKey === "compliance/permits" && view.kind === "table") {
    return <PermitsRegister />
  }
  // Compliance — subcontractor / contractor register.
  if (moduleKey === "compliance/contractors" && view.kind === "table") {
    return <ContractorsRegister />
  }
  // Compliance — hazardous chemicals / SDS register.
  if (moduleKey === "compliance/chemicals" && view.kind === "table") {
    return <ChemicalsRegister />
  }
  // Compliance — environmental aspects register.
  if (moduleKey === "compliance/environment" && view.kind === "table") {
    return <EnvironmentRegister />
  }
  // Compliance — emergency response procedures.
  if (moduleKey === "compliance/emergency") {
    return <EmergencyProcedures />
  }
  // Compliance — document management library.
  if (moduleKey === "compliance/documents" && view.kind === "documents") {
    return <DocumentsLibrary />
  }
  // Compliance — quality / ITP register.
  if (moduleKey === "compliance/quality" && view.kind === "table") {
    return <QualityRegister />
  }
  // Operations — weekly timesheet grid.
  if (moduleKey === "operations/timesheets" && view.kind === "grid") {
    return <TimesheetsGrid />
  }
  // Operations — site photo gallery.
  if (moduleKey === "operations/photos" && view.kind === "gallery") {
    return <PhotosGallery />
  }
  // Workforce — onboarding pipeline board.
  if (moduleKey === "workforce/onboarding" && view.kind === "board") {
    return <OnboardingBoard />
  }
  // Workforce — performance review table.
  if (moduleKey === "workforce/performance" && view.kind === "table") {
    return <PerformanceTable />
  }
  // Workforce — competency matrix with real checkmarks.
  if (moduleKey === "workforce/competency" && view.kind === "matrix") {
    return <CompetencyMatrix />
  }
  // Operations — insights dashboard: hours, plant utilisation, diary completion.
  if (moduleKey === "operations/insights" && view.kind === "dashboard") {
    return <InsightsOperations />
  }
  // Compliance — insights dashboard: TRIFR, LTIFR, actions, inspection coverage.
  if (moduleKey === "compliance/insights" && view.kind === "dashboard") {
    return <InsightsCompliance />
  }
  // Workforce — insights dashboard: headcount, expiries, engagement, leave.
  if (moduleKey === "workforce/insights" && view.kind === "dashboard") {
    return <InsightsWorkforce />
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
  const moduleKey = `${domain.slug}/${section.slug}`

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
      {renderView(view, moduleKey)}
    </>
  )
}
