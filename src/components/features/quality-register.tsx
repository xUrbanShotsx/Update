/**
 * ITP (Inspection and Test Plan) Register — Quality module, default view.
 *
 * Shows a stat strip of four KPI tiles followed by a full-width table of ITP
 * inspection records. Point type (Hold / Witness) is rendered as a small pill
 * in the Point column so inspectors can read hold-point exposure at a glance
 * without scanning the whole row.
 *
 * All data is hard-coded here; a real implementation would accept props or
 * fetch from an API route.
 */

import { Frame } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PointType = "Hold" | "Witness"

type InspectionStatus = "Pass" | "NCR raised" | "Open" | "Pending" | "Scheduled"

type ItpRecord = {
  ref: string
  item: string
  lot: string
  site: string
  point: PointType
  inspected: string
  result: string | null
  status: InspectionStatus
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STATS = [
  { label: "Hold points open", value: 3 },
  { label: "Witness points", value: 8 },
  { label: "ITPs current", value: 12 },
  { label: "NCRs open", value: 4 },
] as const

const RECORDS: ItpRecord[] = [
  {
    ref: "ITP-04-L3",
    item: "Sub-base compaction Layer 3",
    lot: "Ch 2+000–2+400",
    site: "Melbourne Depot",
    point: "Hold",
    inspected: "9 Aug",
    result: "98%",
    status: "Pass",
  },
  {
    ref: "ITP-04-L4",
    item: "Subgrade preparation Ch 3",
    lot: "Ch 2+600–2+900",
    site: "Melbourne Depot",
    point: "Witness",
    inspected: "12 Aug",
    result: null,
    status: "Scheduled",
  },
  {
    ref: "ITP-11-P14",
    item: "Concrete pour — Pier cap P14",
    lot: "Pier line A",
    site: "Brisbane Terminal",
    point: "Hold",
    inspected: "8 Aug",
    result: "94%",
    status: "Pass",
  },
  {
    ref: "ITP-11-P15",
    item: "Pre-pour rebar inspection",
    lot: "Pier line B",
    site: "Brisbane Terminal",
    point: "Hold",
    inspected: "13 Aug",
    result: null,
    status: "Open",
  },
  {
    ref: "ITP-19-S03",
    item: "Structural steel erection",
    lot: "Grid C3–C5",
    site: "Sydney Yard",
    point: "Witness",
    inspected: "7 Aug",
    result: "100%",
    status: "Pass",
  },
  {
    ref: "ITP-19-S04",
    item: "High-strength bolting",
    lot: "Grid D2–D4",
    site: "Sydney Yard",
    point: "Witness",
    inspected: "10 Aug",
    result: "96%",
    status: "Pass",
  },
  {
    ref: "ITP-22-E01",
    item: "Earthworks compaction",
    lot: "Zone 4 cut",
    site: "Geelong Site",
    point: "Witness",
    inspected: "5 Aug",
    result: "91%",
    status: "NCR raised",
  },
  {
    ref: "ITP-11-B02",
    item: "Bearing pad installation",
    lot: "Abutment A",
    site: "Geelong Site",
    point: "Hold",
    inspected: "15 Aug",
    result: null,
    status: "Pending",
  },
  {
    ref: "ITP-04-D01",
    item: "Drainage bedding material",
    lot: "MH-07 to MH-09",
    site: "Adelaide Depot",
    point: "Witness",
    inspected: "6 Aug",
    result: "97%",
    status: "Pass",
  },
  {
    ref: "ITP-07-P01",
    item: "Piling deviation check",
    lot: "Grid E1–E4",
    site: "Perth Workshop",
    point: "Hold",
    inspected: "11 Aug",
    result: null,
    status: "Open",
  },
  {
    ref: "ITP-33-W01",
    item: "Waterproofing membrane",
    lot: "Level B2 east",
    site: "Sydney Yard",
    point: "Witness",
    inspected: "9 Aug",
    result: "88%",
    status: "NCR raised",
  },
  {
    ref: "ITP-22-F01",
    item: "Fill compaction — cell 3",
    lot: "Ch 4+100",
    site: "Brisbane Terminal",
    point: "Witness",
    inspected: "4 Aug",
    result: "99%",
    status: "Pass",
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatTile({ label, value }: { readonly label: string; readonly value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
    </div>
  )
}

function PointPill({ type }: { readonly type: PointType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        type === "Hold"
          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
          : "bg-sky-500/15 text-sky-700 dark:text-sky-400",
      )}
    >
      {type}
    </span>
  )
}

function ResultCell({ result }: { readonly result: string | null }) {
  if (result === null) {
    return <span className="text-muted-foreground">—</span>
  }
  return <span className="tabular-nums">{result}</span>
}

function StatusBadge({ status }: { readonly status: InspectionStatus }) {
  const classes: Record<InspectionStatus, string> = {
    Pass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    "NCR raised": "bg-red-500/15 text-red-700 dark:text-red-400",
    Open: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Scheduled: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        classes[status],
      )}
    >
      {status}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const ITP_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "ITP details", type: "section" },
  {
    name: "itp_ref",
    label: "ITP reference",
    type: "text",
    required: true,
    placeholder: "e.g. ITP-CONC-007",
  },
  {
    name: "description",
    label: "Inspection item description",
    type: "text",
    required: true,
    placeholder: "e.g. Pre-pour reo inspection — slab L3",
  },
  {
    name: "lot",
    label: "Lot / location",
    type: "text",
    placeholder: "e.g. Lot 3 — Grid C4–D6",
  },
  {
    name: "site",
    label: "Site",
    type: "select",
    required: true,
    options: [
      "Melbourne Depot",
      "Sydney Yard",
      "Brisbane Terminal",
      "Perth Workshop",
      "Adelaide Depot",
      "Geelong Site",
    ],
  },
  { name: "s2", label: "Inspection", type: "section" },
  {
    name: "point_type",
    label: "Inspection point type",
    type: "select",
    required: true,
    options: [
      "Hold point — work must not proceed",
      "Witness point — notification required",
      "Review point — document only",
    ],
  },
  { name: "inspection_date", label: "Inspection date", type: "date", required: true },
  {
    name: "inspector",
    label: "Inspector name",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  { name: "s3", label: "Outcome", type: "section" },
  {
    name: "result",
    label: "Result",
    type: "select",
    required: true,
    options: ["Pass", "Pass with comments", "Fail — NCR raised", "Pending", "Scheduled"],
  },
  { name: "score", label: "Score (%)", type: "number", placeholder: "e.g. 94" },
  {
    name: "notes",
    label: "Notes / observations",
    type: "textarea",
    rows: 3,
    placeholder: "Any observations, deviations, or hold-point release conditions…",
  },
]

export function QualityRegister() {
  return (
    <PageScroll overflows>
      <Frame>
        <div className="flex flex-col gap-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Register overview</p>
            <AddSheet title="ITP Record" fields={ITP_FIELDS} />
          </div>

          {/* Stat strip */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <StatTile key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          {/* ITP register table */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Ref
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Lot
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Site
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Point
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Inspected
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Result
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {RECORDS.map((record) => (
                    <tr className="transition-colors hover:bg-fill/50" key={record.ref}>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {record.ref}
                      </td>
                      <td className="max-w-56 px-4 py-3">
                        <span className="line-clamp-1">{record.item}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {record.lot}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {record.site}
                      </td>
                      <td className="px-4 py-3">
                        <PointPill type={record.point} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {record.inspected}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ResultCell result={record.result} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={record.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
