import { Frame, Toolbar } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

const ASSET_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Asset details", type: "section" },
  {
    name: "description",
    label: "Plant description",
    type: "text",
    required: true,
    placeholder: "e.g. 20t excavator, EWP, concrete pump",
  },
  {
    name: "fleet_id",
    label: "Fleet / asset ID",
    type: "text",
    required: true,
    placeholder: "e.g. PLT-041",
  },
  {
    name: "make_model",
    label: "Make / model",
    type: "text",
    placeholder: "e.g. Caterpillar 320",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      "Crane",
      "Excavator / earthworks",
      "EWP / boom lift",
      "Concrete pump",
      "Roller / compactor",
      "Generator",
      "Forklift",
      "Light vehicle",
      "Truck",
      "Scaffold",
      "Other plant",
    ],
  },
  { name: "s2", label: "Assignment", type: "section" },
  {
    name: "site",
    label: "Current site",
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
    name: "operator",
    label: "Operator / custodian",
    type: "text",
    placeholder: "Full name",
  },
  {
    name: "rego",
    label: "Registration / serial #",
    type: "text",
    placeholder: "e.g. 1AG2B3 or SN-456",
  },
  { name: "s3", label: "Maintenance", type: "section" },
  { name: "last_service", label: "Last service date", type: "date" },
  { name: "next_service", label: "Next service due", type: "date" },
  {
    name: "status",
    label: "Current status",
    type: "select",
    required: true,
    options: [
      "Operational",
      "Under service",
      "Out of service",
      "On order",
      "Returned to hire",
    ],
  },
]

type AssetStatus = "Active" | "Off hire" | "Service" | "Breakdown"
type Ownership = "Owned" | "Hired"
type PrestartStatus = "Done" | "Due"

type Asset = {
  name: string
  ref: string
  type: string
  ownership: Ownership
  site: string
  prestart: PrestartStatus
  serviceDue: string
  registration: string
  status: AssetStatus
}

const STATUS_TONE: Record<AssetStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Off hire": "bg-fill text-muted-foreground",
  Service: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Breakdown: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const PRESTART_TONE: Record<PrestartStatus, string> = {
  Done: "text-emerald-600 dark:text-emerald-400",
  Due: "text-amber-600 dark:text-amber-400",
}

const ASSETS: Asset[] = [
  {
    name: "Caterpillar 320 Excavator",
    ref: "PLT-001",
    type: "Excavator",
    ownership: "Owned",
    site: "Parramatta Interchange",
    prestart: "Done",
    serviceDue: "15 Sep 2026",
    registration: "31 Oct 2026",
    status: "Active",
  },
  {
    name: "Liebherr LTM 1060-3.1 Crane",
    ref: "PLT-002",
    type: "Crane",
    ownership: "Hired",
    site: "Chatswood Rail Upgrade",
    prestart: "Done",
    serviceDue: "1 Sep 2026",
    registration: "30 Nov 2026",
    status: "Active",
  },
  {
    name: "Bomag BW213 Roller",
    ref: "PLT-003",
    type: "Roller",
    ownership: "Owned",
    site: "Oran Park Civils",
    prestart: "Done",
    serviceDue: "20 Aug 2026",
    registration: "28 Feb 2027",
    status: "Service",
  },
  {
    name: "Manitou MT732 Telehandler",
    ref: "PLT-004",
    type: "Telehandler",
    ownership: "Hired",
    site: "Bankstown Substation",
    prestart: "Done",
    serviceDue: "5 Oct 2026",
    registration: "31 Aug 2026",
    status: "Active",
  },
  {
    name: "Hino 500 Water Cart 12,000L",
    ref: "PLT-005",
    type: "Water Cart",
    ownership: "Owned",
    site: "Oran Park Civils",
    prestart: "Due",
    serviceDue: "12 Aug 2026",
    registration: "30 Sep 2026",
    status: "Active",
  },
  {
    name: "Komatsu D65 Dozer",
    ref: "PLT-006",
    type: "Dozer",
    ownership: "Owned",
    site: "Homebush Drainage",
    prestart: "Done",
    serviceDue: "30 Aug 2026",
    registration: "31 Jan 2027",
    status: "Active",
  },
  {
    name: "Portacom Site Office — 6 m × 3 m",
    ref: "PLT-007",
    type: "Site Office",
    ownership: "Hired",
    site: "Parramatta Interchange",
    prestart: "Done",
    serviceDue: "N/A",
    registration: "N/A",
    status: "Active",
  },
  {
    name: "Caterpillar 308 Mini Excavator",
    ref: "PLT-008",
    type: "Excavator",
    ownership: "Hired",
    site: "Rouse Hill Water Main",
    prestart: "Done",
    serviceDue: "22 Sep 2026",
    registration: "31 Oct 2026",
    status: "Active",
  },
  {
    name: "Terex TA30 Articulated Dump Truck",
    ref: "PLT-009",
    type: "Dump Truck",
    ownership: "Owned",
    site: "Oran Park Civils",
    prestart: "Done",
    serviceDue: "18 Aug 2026",
    registration: "28 Feb 2027",
    status: "Breakdown",
  },
  {
    name: "Genie GS-4047 Scissor Lift",
    ref: "PLT-010",
    type: "EWP",
    ownership: "Hired",
    site: "Bankstown Substation",
    prestart: "Due",
    serviceDue: "10 Aug 2026",
    registration: "30 Sep 2026",
    status: "Service",
  },
  {
    name: "Portacom Lunch Room — 6 m × 3 m",
    ref: "PLT-011",
    type: "Site Office",
    ownership: "Hired",
    site: "Chatswood Rail Upgrade",
    prestart: "Done",
    serviceDue: "N/A",
    registration: "N/A",
    status: "Active",
  },
  {
    name: "Caterpillar 966 Wheel Loader",
    ref: "PLT-012",
    type: "Loader",
    ownership: "Owned",
    site: "Homebush Drainage",
    prestart: "Done",
    serviceDue: "25 Oct 2026",
    registration: "31 Aug 2026",
    status: "Active",
  },
  {
    name: "Manitowoc 999 Grove Crane",
    ref: "PLT-013",
    type: "Crane",
    ownership: "Hired",
    site: "Parramatta Interchange",
    prestart: "Done",
    serviceDue: "3 Sep 2026",
    registration: "30 Sep 2026",
    status: "Off hire",
  },
  {
    name: "Dynapac CC1200 Tandem Roller",
    ref: "PLT-014",
    type: "Roller",
    ownership: "Hired",
    site: "Rouse Hill Water Main",
    prestart: "Done",
    serviceDue: "14 Sep 2026",
    registration: "31 Oct 2026",
    status: "Active",
  },
]

export function AssetsRegister() {
  const totalActive = ASSETS.filter((a) => a.status === "Active").length
  const serviceDue = ASSETS.filter((a) => a.status === "Service").length
  const regExpiring = ASSETS.filter((a) => {
    const reg = a.registration
    if (reg === "N/A") return false
    const [day, month, year] = reg.split(" ")
    const date = new Date(`${day} ${month} ${year}`)
    const now = new Date("2026-08-11")
    const diff = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 60
  }).length
  const onHire = ASSETS.filter(
    (a) => a.ownership === "Hired" && a.status !== "Off hire",
  ).length

  return (
    <PageScroll overflows>
      <Frame>
        <div className="mb-4 flex items-center justify-between">
          <Toolbar filters={3} />
          <AddSheet title="Asset / Plant" fields={ASSET_FIELDS} />
        </div>

        {/* Stat strip */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Total active",
              value: totalActive,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Service due",
              value: serviceDue,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Rego expiring (60d)",
              value: regExpiring,
              tone: "text-red-600 dark:text-red-400",
            },
            {
              label: "Currently on hire",
              value: onHire,
              tone: "",
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
                  <th className="px-4 py-2.5 font-medium">Asset</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Ownership</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Prestart</th>
                  <th className="px-4 py-2.5 font-medium">Service due</th>
                  <th className="px-4 py-2.5 font-medium">Registration</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ASSETS.map((asset) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      asset.status === "Off hire" && "opacity-50",
                    )}
                    key={asset.ref}
                  >
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-sm leading-snug">{asset.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {asset.ref}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {asset.type}
                    </td>
                    <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                      <span
                        className={cn(
                          "rounded bg-fill px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
                        )}
                      >
                        {asset.ownership}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {asset.site}
                    </td>
                    <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                      <span className={cn("font-medium", PRESTART_TONE[asset.prestart])}>
                        {asset.prestart}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {asset.serviceDue}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {asset.registration}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[asset.status],
                        )}
                      >
                        {asset.status}
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
