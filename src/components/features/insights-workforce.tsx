/**
 * Workforce Insights dashboard.
 *
 * Pure server component — no useState, no "use client". All charts are built
 * from plain divs and SVG so the page ships zero client JavaScript.
 */

import { Frame } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const KPI = [
  { label: "Total headcount", value: "87", tone: "" },
  {
    label: "On-site today",
    value: "71 (82%)",
    tone: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Tickets expiring (30 days)",
    value: "3",
    tone: "text-amber-600 dark:text-amber-400",
  },
  { label: "Leave pending approval", value: "4", tone: "" },
] as const

const SITE_HEADCOUNT = [
  { site: "Brisbane Terminal", short: "Brisbane", count: 24 },
  { site: "Sydney Yard", short: "Sydney", count: 19 },
  { site: "Melbourne Depot", short: "Melbourne", count: 18 },
  { site: "Perth Workshop", short: "Perth", count: 13 },
  { site: "Adelaide Depot", short: "Adelaide", count: 7 },
  { site: "Geelong Site", short: "Geelong", count: 6 },
] as const

const HEADCOUNT_MAX = 24

const ENGAGEMENT = [
  { label: "Direct employees", count: 51, pct: 59, colour: "bg-emerald-500" },
  { label: "Labour hire", count: 22, pct: 25, colour: "bg-violet-500" },
  { label: "Subcontractors", count: 14, pct: 16, colour: "bg-orange-500" },
] as const

type ExpiryRow = {
  name: string
  ticket: string
  expires: string
  days: number
  tone: string
  badgeColour: string
}

const EXPIRIES: ExpiryRow[] = [
  {
    name: "Marcus Reid",
    ticket: "Rigging Intermediate",
    expires: "22 Sep 2025",
    days: 42,
    tone: "text-amber-600 dark:text-amber-400",
    badgeColour: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  {
    name: "Sam Okafor",
    ticket: "Heights (EWP)",
    expires: "4 Oct 2025",
    days: 54,
    tone: "text-amber-600 dark:text-amber-400",
    badgeColour: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  {
    name: "Tom Ihaka",
    ticket: "EWP Licence",
    expires: "15 Oct 2025",
    days: 65,
    tone: "text-sky-600 dark:text-sky-400",
    badgeColour: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  },
  {
    name: "Alex Kerr",
    ticket: "Senior First Aid",
    expires: "30 Oct 2025",
    days: 80,
    tone: "text-sky-600 dark:text-sky-400",
    badgeColour: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  },
  {
    name: "Jo Lin",
    ticket: "Confined Space Entry",
    expires: "14 Nov 2025",
    days: 95,
    tone: "text-muted-foreground",
    badgeColour: "bg-fill text-muted-foreground",
  },
]

const LEAVE_STATS = [
  { label: "Annual leave approved", value: "6", tone: "" },
  { label: "Sick / personal (YTD)", value: "23 days", tone: "" },
  {
    label: "Leave without pay",
    value: "0",
    tone: "text-emerald-600 dark:text-emerald-400",
  },
  { label: "RDOs this month", value: "4", tone: "" },
] as const

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  tone,
}: {
  readonly label: string
  readonly value: string
  readonly tone: string
}) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-xl font-semibold tabular-nums", tone)}>{value}</p>
    </div>
  )
}

function SectionHeading({ children }: { readonly children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold">{children}</h2>
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function InsightsWorkforce() {
  // SVG vertical bar chart
  const barW = 36
  const barGap = 12
  const chartH = 120
  const labelH = 36
  const svgW = SITE_HEADCOUNT.length * (barW + barGap) - barGap
  const svgH = chartH + labelH

  return (
    <PageScroll>
      <Frame>
        <div className="flex flex-col gap-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {KPI.map((k) => (
              <KpiCard key={k.label} label={k.label} value={k.value} tone={k.tone} />
            ))}
          </div>

          {/* Headcount by Site */}
          <section>
            <SectionHeading>Headcount by Site</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                width={svgW}
                height={svgH}
                aria-hidden="true"
                className="overflow-visible"
              >
                {SITE_HEADCOUNT.map((s, i) => {
                  const barH = Math.round((s.count / HEADCOUNT_MAX) * chartH)
                  const x = i * (barW + barGap)
                  const y = chartH - barH
                  // Split label into two lines at ~7 chars
                  const words = s.short.split(" ")
                  return (
                    <g key={s.site}>
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        rx={4}
                        fill="#38bdf8"
                        opacity={0.85}
                      />
                      {/* Count above bar */}
                      <text
                        x={x + barW / 2}
                        y={y - 4}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight="600"
                        fill="currentColor"
                        opacity={0.8}
                      >
                        {s.count}
                      </text>
                      {/* Label lines below chart */}
                      {words.map((word, wi) => (
                        <text
                          key={word}
                          x={x + barW / 2}
                          y={chartH + 14 + wi * 12}
                          textAnchor="middle"
                          fontSize={9}
                          fill="currentColor"
                          opacity={0.5}
                        >
                          {word}
                        </text>
                      ))}
                    </g>
                  )
                })}
              </svg>
            </div>
          </section>

          {/* Engagement Type Breakdown */}
          <section>
            <SectionHeading>Engagement Type Breakdown</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              <div className="flex flex-col gap-3">
                {ENGAGEMENT.map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="w-36 shrink-0 text-xs text-muted-foreground">
                      {row.label}
                    </span>
                    <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-fill-strong">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full",
                          row.colour,
                        )}
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {row.count} ({row.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Licence / Ticket Expiry Pipeline */}
          <section>
            <SectionHeading>Licence / Ticket Expiry Pipeline</SectionHeading>
            <div className="overflow-hidden rounded-xl border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Person</th>
                    <th className="px-4 py-2.5 font-medium">Ticket</th>
                    <th className="px-4 py-2.5 font-medium">Expires</th>
                    <th className="px-4 py-2.5 font-medium text-right">Days left</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {EXPIRIES.map((row) => (
                    <tr
                      className="transition-colors hover:bg-fill/50"
                      key={row.name + row.ticket}
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs font-medium">
                        {row.name}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {row.ticket}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                        {row.expires}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-medium",
                            row.badgeColour,
                          )}
                        >
                          {row.days} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Leave Summary — Aug 2025 */}
          <section>
            <SectionHeading>Leave Summary — Aug 2025</SectionHeading>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {LEAVE_STATS.map((s) => (
                <div className="rounded-xl border bg-card px-4 py-3" key={s.label}>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={cn("mt-1 text-xl font-semibold tabular-nums", s.tone)}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Frame>
    </PageScroll>
  )
}
