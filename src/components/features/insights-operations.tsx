/**
 * Operations Insights dashboard.
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
  { label: "Total hours this week", value: "1,847 h", tone: "" },
  {
    label: "Diary completion",
    value: "94%",
    tone: "text-emerald-600 dark:text-emerald-400",
  },
  { label: "Active deliveries today", value: "12", tone: "" },
  { label: "Plant utilisation", value: "78%", tone: "" },
] as const

const SITE_HOURS = [
  { site: "Brisbane Terminal", hours: 420 },
  { site: "Sydney Yard", hours: 310 },
  { site: "Melbourne Depot", hours: 385 },
  { site: "Perth Workshop", hours: 280 },
  { site: "Adelaide Depot", hours: 210 },
  { site: "Geelong Site", hours: 242 },
] as const

const MAX_HOURS = 500

// 14 days of diary completion percentages.
// Two dips (index 6 → 60%, index 11 → 70%) to make it interesting.
const DIARY_PCT = [92, 95, 100, 88, 95, 97, 60, 94, 100, 91, 95, 70, 98, 97] as const

type Delivery = {
  supplier: string
  gate: string
  /** Minutes after 06:00 */
  startMin: number
  durationMin: number
  colour: string
}

// Timeline: 06:00–18:00 = 720 minutes
const DELIVERIES: Delivery[] = [
  {
    supplier: "Holcim Concrete",
    gate: "Gate 1",
    startMin: 60,
    durationMin: 90,
    colour: "bg-sky-500",
  },
  {
    supplier: "Bluescope Steel",
    gate: "Gate 2",
    startMin: 180,
    durationMin: 60,
    colour: "bg-violet-500",
  },
  {
    supplier: "Hanson Aggregates",
    gate: "Gate 1",
    startMin: 270,
    durationMin: 60,
    colour: "bg-sky-500",
  },
  {
    supplier: "Boral Asphalt",
    gate: "Gate 3",
    startMin: 360,
    durationMin: 60,
    colour: "bg-emerald-500",
  },
  {
    supplier: "Symons Formwork",
    gate: "Gate 2",
    startMin: 480,
    durationMin: 90,
    colour: "bg-violet-500",
  },
  {
    supplier: "AGL Fuel",
    gate: "Gate 1",
    startMin: 600,
    durationMin: 60,
    colour: "bg-amber-500",
  },
]

const TIMELINE_SPAN = 720 // minutes (06:00–18:00)

const NCR_CATEGORIES = [
  { label: "Concrete finish", count: 5 },
  { label: "Waterproofing membrane", count: 3 },
  { label: "Rebar cover", count: 3 },
] as const

const NCR_MAX = 6

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function diaryBarColour(pct: number): string {
  if (pct >= 85) return "#10b981" // emerald-500
  if (pct >= 70) return "#f59e0b" // amber-500
  return "#ef4444" // red-500
}

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

export function InsightsOperations() {
  // SVG bar chart dimensions for diary completion
  const barW = 14
  const barGap = 3
  const chartH = 100
  const svgW = DIARY_PCT.length * (barW + barGap) - barGap
  const svgH = chartH + 2

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

          {/* Hours by Site */}
          <section>
            <SectionHeading>Hours by Site — Week ending 10 Aug 2025</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              <div className="flex flex-col gap-3">
                {SITE_HOURS.map((row) => {
                  const pct = Math.round((row.hours / MAX_HOURS) * 100)
                  return (
                    <div key={row.site} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 text-xs text-muted-foreground">
                        {row.site}
                      </span>
                      <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-fill-strong">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-sky-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                        {row.hours} h
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Site Diary Completion */}
          <section>
            <SectionHeading>Site Diary Completion — Last 14 Days</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              <div className="flex items-end gap-2">
                <svg
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  width={svgW}
                  height={svgH}
                  aria-hidden="true"
                  className="overflow-visible"
                >
                  {DIARY_PCT.map((pct, i) => {
                    const barH = Math.round((pct / 100) * chartH)
                    const x = i * (barW + barGap)
                    const y = chartH - barH
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        rx={2}
                        fill={diaryBarColour(pct)}
                        opacity={0.85}
                      />
                    )
                  })}
                </svg>
                <div className="flex flex-col gap-1 pb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />
                    <span className="text-[10px] text-muted-foreground">≥ 85%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-sm bg-amber-500" />
                    <span className="text-[10px] text-muted-foreground">70–84%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-sm bg-red-500" />
                    <span className="text-[10px] text-muted-foreground">{"< 70%"}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                28 Jul – 10 Aug 2025 · Each bar = one day
              </p>
            </div>
          </section>

          {/* Delivery Slots — Today */}
          <section>
            <SectionHeading>Delivery Slots — Today</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              {/* Hour labels */}
              <div className="relative mb-1 flex">
                {["06:00", "09:00", "12:00", "15:00", "18:00"].map((t) => (
                  <span
                    key={t}
                    className="flex-1 text-[10px] text-muted-foreground first:text-left last:text-right"
                    style={{
                      flex: t === "18:00" ? "0 0 auto" : undefined,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {/* Timeline track */}
              <div className="relative h-8 rounded-md bg-fill-strong">
                {DELIVERIES.map((d) => {
                  const leftPct = (d.startMin / TIMELINE_SPAN) * 100
                  const widthPct = (d.durationMin / TIMELINE_SPAN) * 100
                  return (
                    <div
                      key={`${d.supplier}-${d.startMin}`}
                      className={cn(
                        "absolute top-1 flex h-6 items-center overflow-hidden rounded px-1.5",
                        d.colour,
                      )}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      title={`${d.supplier} · ${d.gate}`}
                    >
                      <span className="truncate text-[9px] font-medium text-white leading-none">
                        {d.supplier}
                      </span>
                    </div>
                  )
                })}
              </div>
              {/* Legend */}
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                {DELIVERIES.map((d) => (
                  <div key={`${d.supplier}-leg`} className="flex items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", d.colour)} />
                    <span className="truncate text-[10px] text-muted-foreground">
                      {d.supplier} · {d.gate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top NCR / Defect Categories */}
          <section>
            <SectionHeading>Top NCR / Defect Categories</SectionHeading>
            <div className="rounded-xl border bg-card px-4 py-4">
              <div className="flex flex-col gap-3">
                {NCR_CATEGORIES.map((row) => {
                  const pct = Math.round((row.count / NCR_MAX) * 100)
                  return (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="w-44 shrink-0 text-xs text-muted-foreground">
                        {row.label}
                      </span>
                      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-fill-strong">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-red-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right text-xs tabular-nums font-medium">
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
