import { ComplianceOverview } from "@/components/features/compliance-overview"
import {
  OverviewView,
  type OverviewMetric,
  type OverviewProject,
  type OverviewSite,
} from "@/components/features/views/overview"
import { PageHeader, type PageTag } from "@/components/shared/page-header"
import { moduleFor, OVERVIEW, VIEW_LABELS } from "@/lib/modules"
import {
  locationHref,
  projectHref,
  PROJECTS_SECTION,
  type Domain,
  type Org,
} from "@/lib/scope"

/**
 * The app's front page, and the same template as every other page in it.
 *
 * It used to be its own thing — a hero, the plan, three cards about TypeScript
 * and Bun left over from the starter — which made the one screen every visit
 * begins on the one screen that looked like a different product. Now it takes
 * the header treatment the modules take (a name, a description, its tags) over
 * the `overview` view, and the only thing that distinguishes it is that most of
 * what it shows is true.
 *
 * Which four numbers, and what the page is for, come out of `lib/modules` like
 * every other description in the app. The *records* are assembled here, because
 * only this component has the org.
 */
export function OrgOverview({
  domain,
  org,
}: {
  readonly domain: Domain
  readonly org: Org
}) {
  if (domain.slug === "compliance") {
    return <ComplianceOverview domain={domain} org={org} />
  }
  const crew = org.locations.reduce((total, location) => total + location.crew, 0)
  const open = org.locations.reduce(
    (total, location) => total + location.openIncidents,
    0,
  )

  /**
   * What this app can actually count today, by the label the catalogue gave it.
   *
   * Keyed on the label rather than positionally, so reordering the metrics in
   * `lib/modules` cannot silently put the crew count under "Open defects". A
   * label with no entry here renders as a bar, which is the honest answer for
   * every number that has no records behind it yet.
   */
  const known: Record<string, string | number> = {
    Sites: org.locations.length,
    Crew: crew,
    Headcount: crew,
    "Open incidents": open,
    Plan: org.plan,
    Apps: org.apps.length,
  }

  const module = moduleFor(domain.slug, OVERVIEW)
  const view = module?.views[0]
  const metrics: OverviewMetric[] = (view?.metrics ?? []).map((label) => ({
    label,
    value: known[label],
  }))

  /**
   * Both bands are entitlement checks before they are anything else.
   *
   * A site row links into this app's copy of that site, and an app with no site
   * scope — Admin — has no such page: the link would resolve to a section slug
   * and 404. Same for a project, which lives under a `projects` section not every
   * app carries. Where the app cannot hold them the band is empty rather than
   * wrong, and the view draws its own empty state.
   */
  const sites: OverviewSite[] = domain.siteGroups.length
    ? org.locations.map((location) => ({
        crew: location.crew,
        href: locationHref(domain, location),
        lastAudit: location.lastAudit,
        name: location.name,
        openIncidents: location.openIncidents,
        region: location.region,
      }))
    : []

  const hasProjects = domain.orgGroups.some((group) =>
    group.sections.some((section) => section.slug === PROJECTS_SECTION),
  )
  const projects: OverviewProject[] = hasProjects
    ? org.projects.map((project) => ({
        client: project.client,
        href: projectHref(domain, project),
        name: project.name,
        stage: project.stage,
      }))
    : []

  const tags: PageTag[] = [
    { label: domain.label, tone: "solid" },
    { label: VIEW_LABELS.overview, tone: "muted" },
    // The tiles, the sites and the projects are real; the activity rail is not.
    // The marker stays until all of it is.
    { label: "Scaffold", tone: "outline" },
  ]

  return (
    <>
      {/* Sticks to the page's own rounded top edge rather than the viewport's,
          because the inset — not the body — is what scrolls. */}
      <PageHeader
        description={module?.summary}
        tags={tags}
        title="Overview"
        views={undefined}
      />
      <OverviewView metrics={metrics} projects={projects} sites={sites} />
    </>
  )
}
