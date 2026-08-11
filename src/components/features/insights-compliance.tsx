/**
 * Compliance Insights dashboard.
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
  {
    label: "TRIFR (12-month)",
    sublabel: "per million hours worked",
    value: "3.8",
    tone: "text-amber-600 dark:text-amber-400",
    note: "Target < 5",
  },
  {
    label: "LTIFR (12-month)",
    sublabel: "per million hours worked",
    value: "1.2",
    tone: "text-emerald-600 dark:text-emerald-400",
    note: "",
  },
  {
    label: "Open corrective actions",
    sublabel: "",
    value: "14",
    tone: "text-amber-600 dark:text-amber-400",
    note: "",
  },
  {
    label: "Inspection coverage",
    sublabel: "",
    value: "88%",
    tone: "text-emerald-600 dark:text-emerald-400",
    note: "",
  },
] as const

// W28–W35, incident counts
const INCIDENT_WEEKS = ["W28", "W29", "W30", "W31", "W32", "W33", "W34", "W35"] as const
const INCIDENT_COUNTS = [2, 1, 3, 2, 0, 4, 2, 1] as const

const RISK_DISTRIBUTION = [
  {
    label: "Extreme",
    count: 0,
    colour: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  {
    label: "High",
    count: 2,
    colour: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-400",
  },
  {
    label: "Medium",
    count: 5,
    colour: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  {
    label: "Low",
    count: 5,
    colour: "bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-400",
  },
] as const

const RISK_TOTAL = RISK_DISTRIBUTION.reduce((s, r) => s + r.count, 0)

type InspectionRow = {
  type: string
  completed: number
  target: number
}

const INSPECTIONS: InspectionRow[] = [
  { type: "Site inspection", completed: 24, target: 26 },
  { type: "Pre-start plant", completed: 156, target: 165 },
  { type: "Toolbox talks", completed: 18, target: 20 },
  { type: "Permit compliance", completed: 11, target: 12 },
  { type: "Environmental", completed: 8, target: 10 },
  { type: "Quality / ITP", completed: 14, target: 16 },
]

const ACTION_CATEGORIES = [
  { label: "Safety corrective actions", count: 6 },
  { label: "Environmental", count: 3 },
  { label: "Quality", count: 4 },
  { label: "HR / People", count: 1 },
] as const

const ACTION_MAX = 7

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function incidentColour(n: number): string {
  if (n <= 1) return "#10b981" // emerald-500
  if (n === 2) return "#f59e0b" // amber-500
  return "#ef4444" // red-500
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  sublabel,
  value,
  tone,
  note,
}: {
  readonly label: string
  readonly sublabel: string
  readonly value: string
  readonly tone: string
  readonly note: string
}) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      {sublabel ? (
        <p className="text-[10px] text-muted-foreground/60">{sublabel}</p>
      ) : null}
      <p className={cn("mt-1 text-xl font-semibold tabular-nums", tone)}>{value}</p>
      {note ? (
        <p className="mt-0.5 text-[10px] text-muted-foreground/60">{note}</p>
      ) : null}
    </div>
  )
}

function SectionHeading({ children }: { readonly children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold">{children}</h2>
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function InsightsCompliance() {
  // SVG dimensions for incident trend chart
  const barW = 28
  const barGap = 8
  const chartH = 100
  const labelH = 20
  const svgW = INCIDENT_WEEKS.length * (barW + barGap) - barGap
  const svgH = chartH + labelH
  const maxCount = Math.max(...INCIDENT_COUNTS)

  return (
    <PageScroll>
      <Frame>
        <div className="flex flex-col gap-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {KPI.map((k) => (
              <KpiCard
                key={k.label}
                label={k.label}
                sublabel={k.sublabel}
                value={k.value}
                tone={k.tone}
                note={k.note}
              />
            ))}
          </div>

          {/* Incident Trend */}
          <section>
            <SectionHeading>Incident Trend — Last 8 Weeks</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                width={svgW}
                height={svgH}
                aria-hidden="true"
                className="overflow-visible"
              >
                {INCIDENT_WEEKS.map((week, i) => {
                  const count = INCIDENT_COUNTS[i]
                  const barH = maxCount > 0 ? Math.round((count / maxCount) * chartH) : 0
                  const x = i * (barW + barGap)
                  const y = chartH - barH
                  return (
                    <g key={week}>
                      {barH > 0 && (
                        <rect
                          x={x}
                          y={y}
                          width={barW}
                          height={barH}
                          rx={3}
                          fill={incidentColour(count)}
                          opacity={0.85}
                        />
                      )}
                      {barH === 0 && (
                        <rect
                          x={x}
                          y={chartH - 3}
                          width={barW}
                          height={3}
                          rx={1.5}
                          fill="#10b981"
                          opacity={0.4}
                        />
                      )}
                      <text
                        x={x + barW / 2}
                        y={svgH - 2}
                        textAnchor="middle"
                        fontSize={9}
                        fill="currentColor"
                        opacity={0.5}
                      >
                        {week}
                      </text>
                      {count > 0 && (
                        <text
                          x={x + barW / 2}
                          y={y - 3}
                          textAnchor="middle"
                          fontSize={9}
                          fontWeight="600"
                          fill={incidentColour(count)}
                        >
                          {count}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
              <div className="mt-3 flex gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">0–1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-sm bg-amber-500" />
                  <span className="text-[10px] text-muted-foreground">2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-sm bg-red-500" />
                  <span className="text-[10px] text-muted-foreground">3+</span>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Register — Residual Rating Distribution */}
          <section>
            <SectionHeading>Risk Register — Residual Rating Distribution</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              {/* Stacked horizontal bar */}
              <div className="mb-3 flex h-6 w-full overflow-hidden rounded-full">
                {RISK_DISTRIBUTION.filter((r) => r.count > 0).map((r) => (
                  <div
                    key={r.label}
                    className={cn("flex items-center justify-center", r.colour)}
                    style={{ width: `${(r.count / RISK_TOTAL) * 100}%` }}
                    title={`${r.label}: ${r.count}`}
                  />
                ))}
                {/* Show a full emerald bar when Extreme is 0 (which means no extreme risks) */}
                {RISK_TOTAL === 0 && <div className="flex-1 bg-emerald-500" />}
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                {RISK_DISTRIBUTION.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 shrink-0 rounded-sm", r.colour)} />
                      <span className="text-xs text-muted-foreground">{r.label}</span>
                    </div>
                    <span className={cn("text-sm font-semibold tabular-nums", r.text)}>
                      {r.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Inspection Coverage by Type */}
          <section>
            <SectionHeading>Inspection Coverage by Type</SectionHeading>
            <div className="overflow-hidden rounded-xl border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium text-center">Done</th>
                    <th className="px-4 py-2.5 font-medium text-center">Target</th>
                    <th className="px-4 py-2.5 font-medium">Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {INSPECTIONS.map((row) => {
                    const pct = Math.round((row.completed / row.target) * 100)
                    const barColour =
                      pct >= 90
                        ? "bg-emerald-500"
                        : pct >= 75
                          ? "bg-amber-500"
                          : "bg-red-500"
                    const textColour =
                      pct >= 90
                        ? "text-emerald-600 dark:text-emerald-400"
                        : pct >= 75
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    return (
                      <tr className="transition-colors hover:bg-fill/50" key={row.type}>
                        <td className="px-4 py-2.5 text-xs">{row.type}</td>
                        <td className="px-4 py-2.5 text-center text-xs tabular-nums">
                          {row.completed}
                        </td>
                        <td className="px-4 py-2.5 text-center text-xs tabular-nums text-muted-foreground">
                          {row.target}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-fill-strong">
                              <div
                                className={cn("h-full rounded-full", barColour)}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-xs tabular-nums font-medium",
                                textColour,
                              )}
                            >
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Open Actions by Category */}
          <section>
            <SectionHeading>Open Actions by Category</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              <div className="flex flex-col gap-3">
                {ACTION_CATEGORIES.map((row) => {
                  const pct = Math.round((row.count / ACTION_MAX) * 100)
                  return (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="w-48 shrink-0 text-xs text-muted-foreground">
                        {row.label}
                      </span>
                      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-fill-strong">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-amber-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-4 shrink-0 text-right text-xs tabular-nums font-medium">
                        {row.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </Frame>
    </PageScroll>
  )
}
