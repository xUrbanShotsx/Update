import Link from "next/link"

import { Frame } from "@/components/features/views/primitives"
import { PageHeader, type PageTag } from "@/components/shared/page-header"
import { PageScroll } from "@/components/shared/page-scroll"
import { moduleFor, OVERVIEW, VIEW_LABELS } from "@/lib/modules"
import { locationHref, type Domain, type Org } from "@/lib/scope"
import { cn } from "@/lib/utils"

// Per-location compliance data keyed by slug. Realistic numbers that correlate
// with the live incident counts in scope.ts — high-incident sites have lower
// LTI counts and audit scores.
const SITE_COMPLIANCE: Record<
  string,
  { lti: number; score: number; status: "current" | "overdue" | "due-soon" }
> = {
  "melbourne-depot":  { lti: 23,  score: 94,  status: "current"   },
  "sydney-yard":      { lti: 147, score: 98,  status: "current"   },
  "brisbane-terminal":{ lti: 6,   score: 81,  status: "overdue"   },
  "perth-workshop":   { lti: 51,  score: 96,  status: "current"   },
  "adelaide-depot":   { lti: 203, score: 100, status: "current"   },
  "geelong-site":     { lti: 12,  score: 87,  status: "due-soon"  },
}

const OVERDUE_ACTIONS = [
  { ref: "CA-041", description: "Review SWMS: Working at Height", site: "Brisbane Terminal", due: "2 days overdue", urgent: true },
  { ref: "CA-038", description: "Housekeeping corrective action", site: "Geelong Site", due: "Since Monday", urgent: true },
  { ref: "CA-043", description: "Toolbox Talk: Electrical Safety", site: "Geelong Site", due: "Due tomorrow", urgent: false },
  { ref: "CA-039", description: "Monthly safety inspection", site: "Perth Workshop", due: "Due this week", urgent: false },
]

const RECENT_ACTIVITY = [
  { text: "SWMS acknowledged: Excavation over 1.5m", meta: "Brisbane Terminal · 2h ago", tone: "green" },
  { text: "Incident reported: Near miss, falling object", meta: "Geelong Site · 4h ago", tone: "amber" },
  { text: "Corrective action closed: CA-038", meta: "Melbourne Depot · Yesterday", tone: "green" },
  { text: "Safety inspection completed: Monthly audit", meta: "Sydney Yard · Yesterday", tone: "green" },
  { text: "SWMS updated: Traffic management — Rev 4", meta: "Perth Workshop · 2 days ago", tone: "muted" },
]

const PIPELINE = [
  { label: "Reported",        count: 3,  tone: "bg-red-500/15 text-red-600 dark:text-red-400"     },
  { label: "Investigating",   count: 2,  tone: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { label: "Actions open",    count: 5,  tone: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { label: "Verifying",       count: 1,  tone: "bg-sky-500/15 text-sky-600 dark:text-sky-400"     },
  { label: "Closed (30 days)",count: 47, tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
]

function ScoreBadge({ score }: { readonly score: number }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
        score >= 95
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          : score >= 85
            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
            : "bg-red-500/15 text-red-700 dark:text-red-400",
      )}
    >
      {score}%
    </span>
  )
}

function LtiBadge({ days }: { readonly days: number }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
        days >= 30
          ? "text-emerald-700 dark:text-emerald-400"
          : days >= 14
            ? "text-amber-700 dark:text-amber-400"
            : "text-red-700 dark:text-red-400",
      )}
    >
      {days}d
    </span>
  )
}

export function ComplianceOverview({
  domain,
  org,
}: {
  readonly domain: Domain
  readonly org: Org
}) {
  const open = org.locations.reduce((t, l) => t + l.openIncidents, 0)
  const module = moduleFor(domain.slug, OVERVIEW)

  const tags: PageTag[] = [
    { label: domain.label, tone: "solid" },
    { label: VIEW_LABELS.overview, tone: "muted" },
  ]

  const worst = org.locations.reduce(
    (most, l) => Math.max(most, l.openIncidents),
    0,
  )

  return (
    <>
      <PageHeader description={module?.summary} tags={tags} title="Overview" views={undefined} />

      <PageScroll overflows>
        <Frame>
          {/* ── Headline metrics ─────────────────────────────────────────── */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {/* LTI-free days */}
            <div className="rounded-xl border bg-card p-4">
              <p className="truncate text-xs text-muted-foreground">Days LTI-free</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">47</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="block size-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">No lost-time injury since 25 Jun</span>
              </div>
            </div>

            {/* Open incidents */}
            <div className="rounded-xl border bg-card p-4">
              <p className="truncate text-xs text-muted-foreground">Open incidents</p>
              <p className={cn("mt-2 text-2xl font-semibold tabular-nums", open > 0 ? "text-amber-600 dark:text-amber-400" : "")}>
                {open}
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className={cn("block size-1.5 rounded-full", open > 0 ? "bg-amber-500" : "bg-emerald-500")} />
                <span className="text-xs text-muted-foreground">
                  {open > 0 ? `Across ${org.locations.filter(l => l.openIncidents > 0).length} sites` : "All sites clear"}
                </span>
              </div>
            </div>

            {/* Actions overdue */}
            <div className="rounded-xl border bg-card p-4">
              <p className="truncate text-xs text-muted-foreground">Actions overdue</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-red-600 dark:text-red-400">2</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="block size-1.5 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">12 open · 2 past due</span>
              </div>
            </div>

            {/* Last audit score */}
            <div className="rounded-xl border bg-card p-4">
              <p className="truncate text-xs text-muted-foreground">Last audit score</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">94%</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="block size-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">ISO 45001 · Sydney Yard · 3 days ago</span>
              </div>
            </div>
          </div>

          {/* ── Incident pipeline ─────────────────────────────────────────── */}
          <div className="mt-2 rounded-xl border bg-card p-4">
            <h3 className="text-sm font-medium">Incident pipeline</h3>
            <div className="mt-3 flex items-stretch gap-1">
              {PIPELINE.map((stage, i) => (
                <div key={stage.label} className="flex min-w-0 flex-1 items-center gap-1">
                  <div className={cn("flex min-w-0 flex-1 flex-col rounded-lg px-3 py-2.5", stage.tone)}>
                    <span className="text-lg font-semibold tabular-nums leading-none">{stage.count}</span>
                    <span className="mt-1 truncate text-xs opacity-80">{stage.label}</span>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <span className="shrink-0 text-xs text-muted-foreground/40">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Sites + Open incidents ─────────────────────────────────────── */}
          <div className="mt-2 grid gap-2 lg:grid-cols-3">
            <div className="overflow-hidden rounded-xl border bg-card lg:col-span-2">
              <div className="border-b px-4 py-3">
                <h3 className="text-sm font-medium">Site safety</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 pb-2 font-medium">Site</th>
                      <th className="px-4 pb-2 font-medium">Region</th>
                      <th className="px-4 pb-2 text-right font-medium">LTI</th>
                      <th className="px-4 pb-2 text-right font-medium">Open</th>
                      <th className="px-4 pb-2 text-right font-medium">Audit</th>
                      <th className="px-4 pb-2 text-right font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {org.locations.map((location) => {
                      const data = SITE_COMPLIANCE[location.slug] ?? { lti: 30, score: 90, status: "current" as const }
                      return (
                        <tr className="hover:bg-accent/40" key={location.slug}>
                          <td className="px-4 py-2">
                            <Link
                              className="font-medium hover:underline"
                              href={locationHref(domain, location)}
                            >
                              {location.name}
                            </Link>
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{location.region}</td>
                          <td className="px-4 py-2 text-right">
                            <LtiBadge days={data.lti} />
                          </td>
                          <td className={cn(
                            "px-4 py-2 text-right tabular-nums",
                            location.openIncidents > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
                          )}>
                            {location.openIncidents}
                          </td>
                          <td className="px-4 py-2 text-right whitespace-nowrap text-muted-foreground text-xs">
                            {location.lastAudit}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <ScoreBadge score={data.score} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Open incidents bar chart */}
            <div className="rounded-xl border bg-card p-4">
              <h3 className="text-sm font-medium">Open incidents</h3>
              {worst === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">Nothing open across any site.</p>
              ) : (
                <div className="mt-3 flex flex-col gap-2.5">
                  {org.locations.map((location) => (
                    <div key={location.slug}>
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <span className="truncate text-muted-foreground">{location.name}</span>
                        <span className="shrink-0 tabular-nums">{location.openIncidents}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-fill-strong">
                        <div
                          className="h-full rounded-full bg-amber-500/70"
                          style={{ width: `${worst > 0 ? (location.openIncidents / worst) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Overdue actions + Activity ─────────────────────────────────── */}
          <div className="mt-2 grid gap-2 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="border-b px-4 py-3">
                <h3 className="text-sm font-medium">Actions & obligations</h3>
              </div>
              <div className="divide-y">
                {OVERDUE_ACTIONS.map((action) => (
                  <div className="flex items-start gap-3 px-4 py-3" key={action.ref}>
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        action.urgent
                          ? "bg-red-500/15 text-red-700 dark:text-red-400"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                      )}
                    >
                      {action.ref}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{action.description}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {action.site}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-xs",
                        action.urgent ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400",
                      )}
                    >
                      {action.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity feed */}
            <div className="rounded-xl border bg-card p-4">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Recent activity
              </h3>
              <div className="mt-3 ml-3 flex flex-col gap-3 border-l pl-6">
                {RECENT_ACTIVITY.map((item, i) => (
                  <article className="relative" key={i}>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1.5 -left-[1.9rem] size-2.5 rounded-full border-2 border-card",
                        item.tone === "green"
                          ? "bg-emerald-500"
                          : item.tone === "amber"
                            ? "bg-amber-500"
                            : "bg-fill-strong",
                      )}
                    />
                    <p className="text-sm leading-snug">{item.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Frame>
      </PageScroll>
    </>
  )
}
