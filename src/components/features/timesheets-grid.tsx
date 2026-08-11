import { PageScroll } from "@/components/shared/page-scroll"
import { Frame } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type TimesheetStatus = "Approved" | "Pending"

type TimesheetRow = {
  name: string
  initials: string
  hours: [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ]
  total: number
  status: TimesheetStatus
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

const ROWS: TimesheetRow[] = [
  {
    name: "Alex Kerr",
    initials: "AK",
    hours: [7.5, 8.0, 8.5, 8.0, 7.5, null, null],
    total: 39.5,
    status: "Approved",
  },
  {
    name: "Priya Tan",
    initials: "PT",
    hours: [8.0, 8.0, 8.0, 7.5, 8.0, null, null],
    total: 39.5,
    status: "Approved",
  },
  {
    name: "Marcus Reid",
    initials: "MR",
    hours: [9.0, 9.0, 9.0, 9.0, 9.0, 5.0, null],
    total: 50.0,
    status: "Approved",
  },
  {
    name: "Jo Lin",
    initials: "JL",
    hours: [8.0, 8.0, null, 8.0, 8.0, null, null],
    total: 32.0,
    status: "Pending",
  },
  {
    name: "Sam Okafor",
    initials: "SO",
    hours: [7.5, 7.5, 7.5, 7.5, 7.5, null, null],
    total: 37.5,
    status: "Approved",
  },
  {
    name: "Ruth Alvarez",
    initials: "RA",
    hours: [8.0, 8.0, 8.0, 8.0, 8.0, null, null],
    total: 40.0,
    status: "Approved",
  },
]

/** Column totals indexed by day (Mon–Sun) */
const DAY_TOTALS: (number | null)[] = DAYS.map((_, di) => {
  const sum = ROWS.reduce((acc, row) => acc + (row.hours[di] ?? 0), 0)
  return sum > 0 ? sum : null
})

const STATUS_TONE: Record<TimesheetStatus, string> = {
  Approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

/** Marcus Reid's overtime cell: row index 2, day index 5 (Sat) */
function isOvertime(rowIndex: number, dayIndex: number): boolean {
  return rowIndex === 2 && dayIndex === 5
}

/** Weekend columns (Sat = 5, Sun = 6) get a subtle tint */
function isWeekend(dayIndex: number): boolean {
  return dayIndex >= 5
}

const STATS = [
  { label: "Total hours", value: "238.5", tone: "" },
  {
    label: "Approved",
    value: "5 of 6",
    sub: "Jo Lin pending",
    tone: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Overtime hours",
    value: "5.0 h",
    sub: "Marcus Reid, Sat",
    tone: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Avg hrs / person",
    value: "39.8 h",
    tone: "",
  },
]

export function TimesheetsGrid() {
  return (
    <PageScroll overflows>
      <Frame>
        {/* Stat strip */}
        <div className="grid grid-cols-4 gap-2">
          {STATS.map((stat) => (
            <div className="rounded-xl border bg-card px-4 py-3" key={stat.label}>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("mt-1 text-xl font-semibold tabular-nums", stat.tone)}>
                {stat.value}
              </p>
              {stat.sub && (
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* Week header + navigation */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-medium">Week ending 11 Aug 2026</p>
          <div className="flex items-center gap-1">
            <button
              className="rounded-lg border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-fill"
              type="button"
            >
              ← Previous week
            </button>
            <button
              className="rounded-lg border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-fill"
              type="button"
            >
              Next week →
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-3 overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Person</th>
                  {DAYS.map((day, di) => (
                    <th
                      key={day}
                      className={cn(
                        "px-3 py-2.5 text-center font-medium tabular-nums",
                        isWeekend(di) && "text-muted-foreground/60",
                      )}
                    >
                      {day}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-center font-medium">Total</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {ROWS.map((row, ri) => (
                  <tr key={row.name} className="hover:bg-fill/40">
                    {/* Person */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fill text-xs font-semibold">
                          {row.initials}
                        </span>
                        <span className="font-medium">{row.name}</span>
                      </div>
                    </td>

                    {/* Day cells */}
                    {row.hours.map((h, di) => (
                      <td
                        key={DAYS[di]}
                        className={cn(
                          "px-3 py-2.5 text-center tabular-nums",
                          isWeekend(di) && "bg-fill/30",
                          isOvertime(ri, di) && "bg-amber-500/10",
                        )}
                      >
                        {h !== null ? (
                          <span
                            className={cn(
                              "font-medium",
                              isOvertime(ri, di) && "text-amber-700 dark:text-amber-400",
                            )}
                          >
                            {h.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    ))}

                    {/* Total */}
                    <td className="px-3 py-2.5 text-center font-semibold tabular-nums">
                      {row.total.toFixed(1)}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          STATUS_TONE[row.status],
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Totals row */}
              <tfoot>
                <tr className="border-t bg-fill/40 text-xs font-semibold text-muted-foreground">
                  <td className="px-4 py-2.5">Total</td>
                  {DAY_TOTALS.map((total, di) => (
                    <td
                      key={DAYS[di]}
                      className={cn(
                        "px-3 py-2.5 text-center tabular-nums",
                        isWeekend(di) && "bg-fill/30",
                      )}
                    >
                      {total !== null ? (
                        <span className="text-foreground">{total.toFixed(1)}</span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center tabular-nums text-foreground">
                    238.5
                  </td>
                  <td className="px-4 py-2.5" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
