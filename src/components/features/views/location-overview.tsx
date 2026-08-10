/**
 * A site's front page.
 *
 * The org overview's counterpart, and deliberately not its twin. That page
 * answers "how is the company doing" and is built from comparisons — a table of
 * six sites, one chart ranking them. This one answers "what is this place", and
 * a comparison needs two of something: there is one site here, so the shape is a
 * record card rather than a league table.
 *
 * Same rule about honesty as everywhere else. A site genuinely has a lead, a
 * region, a headcount and a last audit, so those are drawn as themselves; the
 * crew are people the app has no names for and the activity is events it has not
 * recorded, so those are bars.
 */

import type { LucideIcon } from "lucide-react"

import {
  Avatar,
  Bar,
  Frame,
  GroupHeading,
  Pill,
  spread,
} from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

/** A headline number for the site. Every one of these is real, which is why
 *  there is no absent case here the way there is on the org overview. */
export type LocationMetric = {
  icon: LucideIcon
  label: string
  /** Set only where the number carries a warning — an open incident count above
   *  zero. Left off, the tile is neutral, which is what a fact should be. */
  tone?: string
  value: string | number
}

/** One line of the record. */
export type LocationDetail = { term: string; value: string }

export function LocationOverviewView({
  details,
  headcount,
  metrics,
}: {
  readonly details: readonly LocationDetail[]
  /** How many crew the site has, which is what the roster band draws avatars
   *  for. The faces are placeholders; the count is not. */
  readonly headcount: number
  readonly metrics: readonly LocationMetric[]
}) {
  // Enough to read as a crowd, never enough to fill the band with grey. The real
  // headcount is in the tile above and on the row beside these, so the avatars
  // are saying "people" rather than "this many people".
  const faces = Math.min(headcount, 8)

  return (
    <PageScroll overflows>
      <Frame>
        <div className="grid gap-2 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div className="rounded-xl border bg-card p-4" key={metric.label}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <metric.icon className="size-3" />
                {metric.label}
              </div>
              <p className={cn("mt-2 text-2xl font-semibold", metric.tone)}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-2 lg:grid-cols-2">
          {/* The record itself — a description list, which is the shape a page
              about one thing takes. The org overview has no band like this
              because there is no single row it could be about. */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Site details</h3>
            </div>
            <dl className="divide-y text-sm">
              {details.map((row) => (
                <div className="flex items-center gap-4 px-4 py-2.5" key={row.term}>
                  <dt className="w-32 shrink-0 text-muted-foreground">{row.term}</dt>
                  <dd className="min-w-0 truncate">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The roster. Faces and names are the one thing a site page obviously
              wants and the one thing this build has none of, so the band is drawn
              as what it is — and the count above it is real, which is what keeps
              the placeholder from reading as "nobody works here". */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
              <h3 className="text-sm font-medium">Crew</h3>
              <span className="text-xs text-muted-foreground tabular-nums">
                {headcount} on the books
              </span>
            </div>
            <div className="divide-y">
              {Array.from({ length: faces }, (_, index) => (
                <div className="flex items-center gap-3 px-4 py-2" key={index}>
                  <Avatar className="size-6" />
                  <Bar className="w-28" seed={index * 5} />
                  <span className="ml-auto shrink-0">
                    <Pill seed={index * 3} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <GroupHeading>Recent activity</GroupHeading>
          {/* The same rail the org overview and the feed template draw, at the
              same length. Three renderings of one shape would be three chances
              to drift. */}
          <div className="mt-3 ml-3 flex flex-col gap-3 border-l pl-6">
            {Array.from({ length: 5 }, (_, index) => (
              <article className="relative" key={index}>
                <span
                  aria-hidden
                  className="absolute top-3 -left-[1.9rem] size-2.5 rounded-full border-2 border-card bg-fill-strong"
                />
                <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <Avatar className="size-5" />
                  <Bar className="w-40" seed={index * 7} />
                  <Bar className="hidden w-24 sm:block" seed={index * 11} soft />
                  <Bar
                    className="ml-auto w-12 shrink-0"
                    seed={index * 3 + spread(index, 2)}
                    soft
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
