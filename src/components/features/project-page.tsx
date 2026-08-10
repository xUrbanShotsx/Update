import { renderView } from "@/components/features/module-page"
import { PageHeader, type PageTag } from "@/components/shared/page-header"
import { moduleFor, TIER_LABELS, VIEW_LABELS } from "@/lib/modules"
import { orgHref, type Domain, type Project } from "@/lib/scope"

/**
 * One job.
 *
 * The second entity the nav can stand inside, after a site — and the one the
 * panel had no route to at all until now: Projects was a register you opened and
 * clicked, with nothing in the sidebar naming a single job.
 *
 * It does *not* swap the panel the way a site does. A site is a place with its
 * own copy of every module — its own diary, its own registers — so entering one
 * changes what the nav lists. A project is a record inside Operations; the nav
 * stays where it is and this page opens beside it, which is why it is reached
 * from an accordion under Projects rather than from a segmented control.
 */
export function ProjectPage({
  domain,
  project,
}: {
  readonly domain: Domain
  readonly project: Project
}) {
  const module = moduleFor(domain.slug, "project")
  const view = module?.views[0]

  const tags: PageTag[] = [
    { label: project.stage, tone: "solid" },
    ...(module ? [{ label: TIER_LABELS[module.tier], tone: "muted" as const }] : []),
    ...(view ? [{ label: VIEW_LABELS[view.kind], tone: "muted" as const }] : []),
    { label: "Scaffold", tone: "outline" },
  ]

  return (
    <>
      <PageHeader
        description={`${project.client} · ${module?.summary ?? ""}`}
        tags={tags}
        title={project.name}
        views={[
          // The way back to the register, as a view rather than a Back row: the
          // panel never left, so there is nothing to climb out of — this is the
          // same records at two altitudes, which is what the header's control is
          // for everywhere else in the app.
          { label: "All projects", href: orgHref(domain, "projects"), active: false },
        ]}
      />
      {view ? renderView(view) : null}
    </>
  )
}
