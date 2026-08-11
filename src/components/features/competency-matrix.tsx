import { Frame } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

const PEOPLE = [
  "Alex Kerr",
  "Priya Tan",
  "Marcus Reid",
  "Jo Lin",
  "Sam Okafor",
  "Ruth Alvarez",
  "Dana Whitlock",
  "Tom Ihaka",
] as const

const COMPETENCIES = [
  "Excavation",
  "Height",
  "Confined",
  "Traffic",
  "Hot work",
  "Rigging",
  "EWP",
] as const

type Person = (typeof PEOPLE)[number]
type Competency = (typeof COMPETENCIES)[number]

/** Current, expiring within 30 days, or absent. */
type CellState = "current" | "expiring" | "absent"

const MATRIX: Record<Person, Partial<Record<Competency, CellState>>> = {
  "Alex Kerr": {
    Excavation: "current",
    Height: "current",
    Confined: "current",
    Traffic: "current",
    "Hot work": "current",
    Rigging: "current",
    EWP: "current",
  },
  "Priya Tan": {
    Excavation: "current",
    Height: "current",
    Confined: "absent",
    Traffic: "current",
    "Hot work": "absent",
    Rigging: "absent",
    EWP: "current",
  },
  "Marcus Reid": {
    Excavation: "current",
    Height: "current",
    Confined: "current",
    Traffic: "current",
    "Hot work": "current",
    Rigging: "expiring",
    EWP: "absent",
  },
  "Jo Lin": {
    Excavation: "current",
    Height: "current",
    Confined: "current",
    Traffic: "current",
    "Hot work": "absent",
    Rigging: "absent",
    EWP: "current",
  },
  "Sam Okafor": {
    Excavation: "current",
    Height: "expiring",
    Confined: "absent",
    Traffic: "absent",
    "Hot work": "current",
    Rigging: "current",
    EWP: "current",
  },
  "Ruth Alvarez": {
    Excavation: "current",
    Height: "current",
    Confined: "absent",
    Traffic: "current",
    "Hot work": "absent",
    Rigging: "absent",
    EWP: "absent",
  },
  "Dana Whitlock": {
    Excavation: "absent",
    Height: "current",
    Confined: "current",
    Traffic: "current",
    "Hot work": "current",
    Rigging: "absent",
    EWP: "current",
  },
  "Tom Ihaka": {
    Excavation: "current",
    Height: "current",
    Confined: "current",
    Traffic: "absent",
    "Hot work": "absent",
    Rigging: "current",
    EWP: "expiring",
  },
}

const total = PEOPLE.length * COMPETENCIES.length
const current = Object.values(MATRIX).reduce(
  (acc, row) =>
    acc + Object.values(row).filter((v) => v === "current" || v === "expiring").length,
  0,
)
const expiring = Object.values(MATRIX).reduce(
  (acc, row) => acc + Object.values(row).filter((v) => v === "expiring").length,
  0,
)
const coverage = Math.round((current / total) * 100)

function Cell({ state }: { readonly state: CellState | undefined }) {
  if (!state || state === "absent") {
    return (
      <div className="flex size-7 items-center justify-center rounded-md bg-fill/50 text-muted-foreground/30">
        <svg className="size-3" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="7.5" width="12" height="1" rx="0.5" />
        </svg>
      </div>
    )
  }
  if (state === "expiring") {
    return (
      <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }
  return (
    <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500">
      <svg
        className="size-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function CompetencyMatrix() {
  return (
    <PageScroll overflows>
      <Frame>
        {/* Stat strip */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "People assessed", value: PEOPLE.length },
            { label: "Competencies tracked", value: COMPETENCIES.length },
            { label: "Coverage", value: `${coverage}%`, cls: "text-emerald-500" },
            {
              label: "Expiring (30 days)",
              value: expiring,
              cls: expiring > 0 ? "text-amber-500" : "",
            },
          ].map((s) => (
            <div className="rounded-xl border bg-card p-3" key={s.label}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`mt-1 text-xl font-semibold ${s.cls ?? ""}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="size-3.5 rounded-sm bg-emerald-500/20" />
            Current
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3.5 rounded-sm bg-amber-500/20" />
            Expiring within 30 days
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3.5 rounded-sm bg-fill/50" />
            Not held
          </div>
        </div>

        {/* Matrix */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium">Person</th>
                  {COMPETENCIES.map((comp) => (
                    <th
                      className="px-3 py-3 text-center font-medium whitespace-nowrap"
                      key={comp}
                    >
                      {comp}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {PEOPLE.map((person) => {
                  const row = MATRIX[person]
                  const held = COMPETENCIES.filter(
                    (c) => row[c] === "current" || row[c] === "expiring",
                  ).length
                  const pct = Math.round((held / COMPETENCIES.length) * 100)
                  return (
                    <tr className="hover:bg-accent/40" key={person}>
                      <td className="px-4 py-2.5 font-medium whitespace-nowrap">
                        {person}
                      </td>
                      {COMPETENCIES.map((comp) => (
                        <td className="px-3 py-2.5 text-center" key={comp}>
                          <div className="flex justify-center">
                            <Cell state={row[comp]} />
                          </div>
                        </td>
                      ))}
                      <td className="px-4 py-2.5 text-right">
                        <span
                          className={cn(
                            "text-xs font-medium tabular-nums",
                            pct === 100
                              ? "text-emerald-500"
                              : pct >= 70
                                ? "text-muted-foreground"
                                : "text-amber-500",
                          )}
                        >
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
