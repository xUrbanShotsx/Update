/**
 * An app's front page.
 *
 * The one template with real records in it, which is why it lives in its own
 * file rather than beside the twelve scaffolds. A workspace genuinely has six
 * sites and a hundred and ninety crew, and it genuinely runs these projects — so
 * those are drawn as themselves. What is not real is drawn as a bar, in the same
 * grey as everywhere else, and the two are never mixed inside one tile: a number
 * is either a fact or a placeholder, and a tile that hedged would be the one
 * place in the app you couldn't tell which.
 *
 * Four bands, and deliberately four *shapes* — tiles, a table, a chart, a feed.
 * An overview made of one repeated card is a list with extra lines; the point of
 * this page is that a glance can tell the parts apart before it reads any of
 * them, and shape is what carries that faster than any heading.
 *
 * There is no "Jump to" band. It used to close the page with every section of
 * the app as a grid of links, which is the nav one column to the left, drawn
 * larger and with different opinions about order. What replaced it is the
 * records those sections are about.
 */

import Link from "next/link"

import {
  Avatar,
  Bar,
  Frame,
  GroupHeading,
  spread,
} from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

/** A headline number. `value` absent means nobody is counting it yet, and the
 *  tile says so rather than showing a zero that would read as good news. */
export type OverviewMetric = { label: string; value?: string | number }

/** One site, as the table draws it. Every field is real. */
export type OverviewSite = {
  crew: number
  href: string
  lastAudit: string
  name: string
  openIncidents: number
  region: string
}

/** One job. `stage` is the contractor's own word for where it is, so it is shown
 *  as written rather than mapped onto a status the app invented. */
export type OverviewProject = {
  client: string
  href: string
  name: string
  stage: string
}

export function OverviewView({
  metrics,
  projects,
  sites,
}: {
  readonly metrics: readonly OverviewMetric[]
  readonly projects: readonly OverviewProject[]
  readonly sites: readonly OverviewSite[]
}) {
  // The busiest site sets the scale, so the longest bar is always full and the
  // rest are read against it. A fixed denominator would draw six stubs on a
  // quiet week and six full bars on a bad one, which is the opposite of what a
  // comparison is for.
  const worst = sites.reduce((most, site) => Math.max(most, site.openIncidents), 0)

  return (
    <PageScroll overflows>
      <Frame>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div className="rounded-xl border bg-card p-4" key={metric.label}>
              <p className="truncate text-xs text-muted-foreground">{metric.label}</p>
              {metric.value === undefined ? (
                <span className="mt-3 block h-7 w-20 rounded-md bg-fill-strong" />
              ) : (
                <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
              )}
              {/* The trend line every dashboard tile wants and this one cannot
                  honestly draw. A bar, so the tile is the right height whether
                  its number is real or not and the row doesn't step. */}
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={cn(
                    "block size-1.5 rounded-full",
                    index % 3 === 0 ? "bg-emerald-500" : "bg-fill-strong",
                  )}
                />
                <Bar className="w-16" seed={index * 7} soft />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-2 lg:grid-cols-3">
          {/* The sites, as a table — the one band on this page that is a table,
              because six rows of five fields is what a table is for and drawing
              it as cards would cost the column alignment that lets you compare
              them. Two columns wide at `lg`: it carries the most per row and
              should not be the narrow one. */}
          <div className="overflow-hidden rounded-xl border bg-card lg:col-span-2">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Sites</h3>
            </div>
            {/* Its own scroller, so a narrow panel scrolls the table rather than
                the page — `PageScroll` above owns the vertical axis and nothing
                inside it should take the horizontal one from the whole page. */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 pb-2 font-medium">Site</th>
                    <th className="px-4 pb-2 font-medium">Region</th>
                    <th className="px-4 pb-2 text-right font-medium">Crew</th>
                    <th className="px-4 pb-2 text-right font-medium">Open</th>
                    <th className="px-4 pb-2 text-right font-medium">Last audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sites.map((site) => (
                    <tr className="hover:bg-accent/40" key={site.href}>
                      <td className="px-4 py-2">
                        <Link className="font-medium hover:underline" href={site.href}>
                          {site.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{site.region}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{site.crew}</td>
                      <td
                        className={cn(
                          "px-4 py-2 text-right tabular-nums",
                          // Zero is the good number here, so it is the only one
                          // that stays neutral.
                          site.openIncidents > 0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {site.openIncidents}
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap text-muted-foreground">
                        {site.lastAudit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* The same numbers as the table's Open column, drawn as lengths. Not
              a duplicate: a column of digits answers "how many here", a row of
              bars answers "which is worst", and the second question is the one
              an overview exists to answer at a glance. */}
          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-medium">Open incidents</h3>
            {worst === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Nothing open across any site.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-2.5">
                {sites.map((site) => (
                  <div key={site.href}>
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="truncate text-muted-foreground">{site.name}</span>
                      <span className="shrink-0 tabular-nums">{site.openIncidents}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-fill-strong">
                      <div
                        className="h-full rounded-full bg-amber-500/70"
                        // Inline, because the value is a datum rather than a
                        // design decision — there is no class for "however many
                        // incidents this site has".
                        style={{ width: `${(site.openIncidents / worst) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-2 lg:grid-cols-2">
          {/* Projects, as rows rather than as another table: three fields, one
              of them free text, and nothing to line up column-wise. */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Projects</h3>
            </div>
            {projects.length ? (
              <div className="divide-y">
                {projects.map((project) => (
                  <Link
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent/40"
                    href={project.href}
                    key={project.href}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {project.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {project.client}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-md bg-fill px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {project.stage}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">
                No projects on the books.
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-card p-4">
            <GroupHeading>Recent activity</GroupHeading>
            {/* The rail, as in the feed template — this is the same shape at a
                shorter length, and drawing it differently here would make two
                things that are one thing. The only scaffold left on the page,
                and the one band whose records genuinely do not exist yet. */}
            <div className="mt-3 ml-3 flex flex-col gap-3 border-l pl-6">
              {Array.from({ length: 5 }, (_, index) => (
                <article className="relative" key={index}>
                  <span
                    aria-hidden
                    className="absolute top-2 -left-[1.9rem] size-2.5 rounded-full border-2 border-card bg-fill-strong"
                  />
                  <div className="flex items-center gap-3">
                    <Avatar className="size-5" />
                    <Bar className="w-32" seed={index * 5} />
                    <Bar
                      className="ml-auto w-10 shrink-0"
                      seed={index * 3 + spread(index, 2)}
                      soft
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
