import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type EnvAspect =
  | "Stormwater"
  | "Dust"
  | "Noise"
  | "Waste"
  | "Contamination"
  | "Erosion"
  | "Cultural heritage"

type InspectionFreq = "Daily" | "Weekly" | "Monthly"
type EnvStatus = "Compliant" | "Action required" | "Overdue"

type EnvItem = {
  ref: string
  aspect: EnvAspect
  site: string
  controls: string
  freq: InspectionFreq
  lastInspected: string
  nextDue: string
  status: EnvStatus
}

const STATUS_TONE: Record<EnvStatus, string> = {
  Compliant: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Action required": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Overdue: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const ENV_ITEMS: EnvItem[] = [
  {
    ref: "ENV-001",
    aspect: "Stormwater",
    site: "Melbourne Depot",
    controls: "Sediment fences, inlet protection, washout bund at concrete batching",
    freq: "Weekly",
    lastInspected: "7 Aug",
    nextDue: "14 Aug",
    status: "Compliant",
  },
  {
    ref: "ENV-002",
    aspect: "Dust",
    site: "Brisbane Terminal",
    controls: "Water cart suppression, haul road treatment, wind monitoring",
    freq: "Daily",
    lastInspected: "11 Aug",
    nextDue: "12 Aug",
    status: "Compliant",
  },
  {
    ref: "ENV-003",
    aspect: "Noise",
    site: "Sydney Yard",
    controls:
      "Restricted hours 07:00–18:00 Mon–Sat, acoustic hoarding on western boundary",
    freq: "Weekly",
    lastInspected: "8 Aug",
    nextDue: "15 Aug",
    status: "Compliant",
  },
  {
    ref: "ENV-004",
    aspect: "Waste",
    site: "Geelong Site",
    controls:
      "Segregated bins (general, recyclable, hazardous), licensed waste contractor",
    freq: "Weekly",
    lastInspected: "4 Aug",
    nextDue: "11 Aug",
    status: "Action required",
  },
  {
    ref: "ENV-005",
    aspect: "Contamination",
    site: "Melbourne Depot",
    controls:
      "Drip trays under plant, spill kits at refuelling points, groundwater monitoring bores",
    freq: "Monthly",
    lastInspected: "14 Jul",
    nextDue: "14 Aug",
    status: "Compliant",
  },
  {
    ref: "ENV-006",
    aspect: "Erosion",
    site: "Brisbane Terminal",
    controls: "Revegetation of stockpile batters, rock check dams, hydromulch seeding",
    freq: "Weekly",
    lastInspected: "5 Aug",
    nextDue: "12 Aug",
    status: "Compliant",
  },
  {
    ref: "ENV-007",
    aspect: "Stormwater",
    site: "Perth Workshop",
    controls:
      "Oil-water separator, bunded chemical store, regular cleaning of yard drains",
    freq: "Monthly",
    lastInspected: "1 Jul",
    nextDue: "1 Aug",
    status: "Overdue",
  },
  {
    ref: "ENV-008",
    aspect: "Dust",
    site: "Adelaide Depot",
    controls: "Wind break fencing, crust stabiliser on exposed areas, vehicle wheel wash",
    freq: "Daily",
    lastInspected: "11 Aug",
    nextDue: "12 Aug",
    status: "Compliant",
  },
  {
    ref: "ENV-009",
    aspect: "Noise",
    site: "Melbourne Depot",
    controls: "Concrete pours limited to daytime, reversing alarm substitution approved",
    freq: "Weekly",
    lastInspected: "9 Aug",
    nextDue: "16 Aug",
    status: "Compliant",
  },
  {
    ref: "ENV-010",
    aspect: "Cultural heritage",
    site: "Geelong Site",
    controls:
      "Unexpected finds protocol in place, Wadawurrung liaison, stop-work alert system",
    freq: "Monthly",
    lastInspected: "28 Jul",
    nextDue: "28 Aug",
    status: "Compliant",
  },
  {
    ref: "ENV-011",
    aspect: "Waste",
    site: "Sydney Yard",
    controls:
      "Asbestos waste manifests, contaminated soil tracking, EPA transport certificates",
    freq: "Weekly",
    lastInspected: "3 Aug",
    nextDue: "10 Aug",
    status: "Action required",
  },
  {
    ref: "ENV-012",
    aspect: "Erosion",
    site: "Adelaide Depot",
    controls:
      "Straw wattles along drainage lines, gravel access tracks, site perimeter berms",
    freq: "Weekly",
    lastInspected: "8 Aug",
    nextDue: "15 Aug",
    status: "Compliant",
  },
]

export function EnvironmentRegister() {
  const compliant = ENV_ITEMS.filter((e) => e.status === "Compliant")
  const actionRequired = ENV_ITEMS.filter((e) => e.status === "Action required")
  const overdue = ENV_ITEMS.filter((e) => e.status === "Overdue")

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Compliant",
              value: compliant.length,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Actions required",
              value: actionRequired.length,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Overdue",
              value: overdue.length,
              tone: "text-red-600 dark:text-red-400",
            },
            { label: "Inspections this month", value: 8, tone: "" },
          ].map((stat) => (
            <div className="rounded-xl border bg-card px-4 py-3" key={stat.label}>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("mt-1 text-xl font-semibold tabular-nums", stat.tone)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Ref</th>
                  <th className="px-4 py-2.5 font-medium">Aspect</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Control measures</th>
                  <th className="px-4 py-2.5 font-medium">Freq</th>
                  <th className="px-4 py-2.5 font-medium">Last inspected</th>
                  <th className="px-4 py-2.5 font-medium">Next due</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ENV_ITEMS.map((item) => (
                  <tr className="transition-colors hover:bg-accent/40" key={item.ref}>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.ref}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs font-medium">
                      {item.aspect}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {item.site}
                    </td>
                    <td className="max-w-xs px-4 py-2.5">
                      <p className="text-xs leading-snug text-muted-foreground">
                        {item.controls}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {item.freq}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {item.lastInspected}
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-2.5 text-xs",
                        item.status === "Overdue"
                          ? "font-medium text-red-600 dark:text-red-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.nextDue}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[item.status],
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
