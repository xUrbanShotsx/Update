import { Frame, Toolbar } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

const DELIVERY_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Delivery details", type: "section" },
  {
    name: "supplier",
    label: "Supplier / company",
    type: "text",
    required: true,
    placeholder: "e.g. Holcim, BASF, Kennards",
  },
  {
    name: "description",
    label: "Material description",
    type: "textarea",
    required: true,
    rows: 2,
    placeholder: "What is being delivered…",
  },
  {
    name: "qty",
    label: "Quantity",
    type: "number",
    required: true,
    placeholder: "Amount",
  },
  {
    name: "unit",
    label: "Unit",
    type: "select",
    required: true,
    options: ["t", "m³", "m", "m²", "ea", "L", "kg", "pallet", "load"],
  },
  { name: "s2", label: "Logistics", type: "section" },
  {
    name: "site",
    label: "Delivery site",
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
  {
    name: "gate",
    label: "Gate / entry point",
    type: "select",
    options: ["Main gate", "Gate 1", "Gate 2", "Rear access", "East entry"],
  },
  { name: "booked_date", label: "Booked date", type: "date", required: true },
  { name: "booked_time", label: "Booked time", type: "time", required: true },
  { name: "s3", label: "Driver & vehicle", type: "section" },
  { name: "driver", label: "Driver name", type: "text", placeholder: "Full name" },
  { name: "rego", label: "Vehicle rego", type: "text", placeholder: "e.g. ABC 123" },
  {
    name: "po",
    label: "Purchase order #",
    type: "text",
    placeholder: "e.g. PO-2024-0088",
  },
]

type DeliveryStatus = "Scheduled" | "Arrived" | "Complete" | "Cancelled"
type PlantRequired = "Crane" | "Forklift" | "None"

type Delivery = {
  ref: string
  material: string
  supplier: string
  site: string
  gate: string
  window: string
  plant: PlantRequired
  status: DeliveryStatus
}

const STATUS_TONE: Record<DeliveryStatus, string> = {
  Scheduled: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Arrived: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Complete: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const PLANT_TONE: Record<PlantRequired, string> = {
  Crane: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Forklift: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  None: "text-muted-foreground",
}

const DELIVERIES: Delivery[] = [
  {
    ref: "DLV-201",
    material: "N32 Ready-mix concrete — 8 m³",
    supplier: "Hanson Construction Materials",
    site: "Parramatta Interchange",
    gate: "Gate 1",
    window: "06:00–07:00",
    plant: "None",
    status: "Complete",
  },
  {
    ref: "DLV-202",
    material: "D500N reinforcing bar — 14t",
    supplier: "InfraBuild Steel",
    site: "Chatswood Rail Upgrade",
    gate: "Gate 2",
    window: "07:00–08:30",
    plant: "Crane",
    status: "Complete",
  },
  {
    ref: "DLV-203",
    material: "Scaffold planks and standards — 1 truck",
    supplier: "Safway Services",
    site: "Parramatta Interchange",
    gate: "Gate 1",
    window: "07:30–08:30",
    plant: "Forklift",
    status: "Complete",
  },
  {
    ref: "DLV-204",
    material: "50mm aggregate base course — 22t",
    supplier: "Boral Resources",
    site: "Homebush Drainage",
    gate: "Gate 3",
    window: "08:00–09:00",
    plant: "None",
    status: "Complete",
  },
  {
    ref: "DLV-205",
    material: "Precast concrete pits — 6 units",
    supplier: "Humes Infrastructure",
    site: "Rouse Hill Water Main",
    gate: "Gate 1",
    window: "08:30–10:00",
    plant: "Crane",
    status: "Complete",
  },
  {
    ref: "DLV-206",
    material: "Geotextile fabric — 3 rolls",
    supplier: "Polyfabrics Australia",
    site: "Oran Park Civils",
    gate: "Gate 2",
    window: "09:00–10:00",
    plant: "Forklift",
    status: "Complete",
  },
  {
    ref: "DLV-207",
    material: "DN300 HDPE pipe — 120 lm",
    supplier: "Vinidex",
    site: "Rouse Hill Water Main",
    gate: "Gate 1",
    window: "09:30–11:00",
    plant: "Forklift",
    status: "Complete",
  },
  {
    ref: "DLV-208",
    material: "Formply sheets — 50 sheets",
    supplier: "Carter Holt Harvey",
    site: "Oran Park Civils",
    gate: "Gate 3",
    window: "10:00–11:00",
    plant: "Forklift",
    status: "Complete",
  },
  {
    ref: "DLV-209",
    material: "N32 Ready-mix concrete — 6 m³",
    supplier: "Hanson Construction Materials",
    site: "Bankstown Substation",
    gate: "Gate 1",
    window: "11:00–12:00",
    plant: "None",
    status: "Arrived",
  },
  {
    ref: "DLV-210",
    material: "Cable tray and conduit — 2 pallets",
    supplier: "Olex Cables",
    site: "Bankstown Substation",
    gate: "Gate 2",
    window: "12:00–13:00",
    plant: "Forklift",
    status: "Arrived",
  },
  {
    ref: "DLV-211",
    material: "Waterproofing membrane — 4 rolls",
    supplier: "Parchem Construction",
    site: "Parramatta Interchange",
    gate: "Gate 1",
    window: "13:00–14:00",
    plant: "None",
    status: "Arrived",
  },
  {
    ref: "DLV-212",
    material: "Structural steel UB610 — 18t",
    supplier: "OneSteel Distribution",
    site: "Chatswood Rail Upgrade",
    gate: "Gate 2",
    window: "14:00–15:30",
    plant: "Crane",
    status: "Scheduled",
  },
  {
    ref: "DLV-213",
    material: "Type GP cement — 10 x 20kg bags",
    supplier: "Adelaide Brighton Cement",
    site: "Homebush Drainage",
    gate: "Gate 3",
    window: "14:30–15:30",
    plant: "None",
    status: "Scheduled",
  },
  {
    ref: "DLV-214",
    material: "Reinforcement steel mesh — 32t",
    supplier: "InfraBuild Steel",
    site: "Oran Park Civils",
    gate: "Gate 2",
    window: "15:00–16:30",
    plant: "Crane",
    status: "Scheduled",
  },
  {
    ref: "DLV-215",
    material: "Traffic control equipment — 1 pallet",
    supplier: "Traffix Safety Solutions",
    site: "Rouse Hill Water Main",
    gate: "Gate 1",
    window: "15:30–16:30",
    plant: "None",
    status: "Cancelled",
  },
]

export function DeliveriesList() {
  const scheduled = DELIVERIES.filter((d) => d.status === "Scheduled").length
  const arrived = DELIVERIES.filter((d) => d.status === "Arrived").length
  const complete = DELIVERIES.filter((d) => d.status === "Complete").length
  const cancelled = DELIVERIES.filter((d) => d.status === "Cancelled").length

  return (
    <PageScroll overflows>
      <Frame>
        <div className="mb-4 flex items-center justify-between">
          <Toolbar filters={3} />
          <AddSheet title="Delivery" fields={DELIVERY_FIELDS} />
        </div>

        {/* Stat strip */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Scheduled today",
              value: scheduled,
              tone: "text-sky-600 dark:text-sky-400",
            },
            {
              label: "Arrived",
              value: arrived,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Complete",
              value: complete,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Cancelled",
              value: cancelled,
              tone: "text-red-600 dark:text-red-400",
            },
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
                  <th className="px-4 py-2.5 font-medium">Delivery</th>
                  <th className="px-4 py-2.5 font-medium">Supplier</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Gate</th>
                  <th className="px-4 py-2.5 font-medium">Window</th>
                  <th className="px-4 py-2.5 font-medium">Plant</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {DELIVERIES.map((delivery) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      delivery.status === "Cancelled" && "opacity-50",
                    )}
                    key={delivery.ref}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {delivery.ref}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 max-w-xs">
                      <p className="text-sm leading-snug">{delivery.material}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {delivery.supplier}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {delivery.site}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {delivery.gate}
                    </td>
                    <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                      {delivery.window}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          PLANT_TONE[delivery.plant],
                        )}
                      >
                        {delivery.plant}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[delivery.status],
                        )}
                      >
                        {delivery.status}
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
