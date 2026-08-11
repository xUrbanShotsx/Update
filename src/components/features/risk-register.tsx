import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

type RiskLevel = "Low" | "Medium" | "High" | "Extreme"

type Risk = {
  ref: string
  hazard: string
  category: string
  site: string
  inherent: RiskLevel
  controls: string
  legislation: string
  residual: RiskLevel
  owner: string
  initials: string
  reviewDue: string
}

const LEVEL_TONE: Record<RiskLevel, string> = {
  Extreme: "bg-red-600/20 text-red-700 dark:text-red-400 font-semibold",
  High: "bg-orange-500/20 text-orange-700 dark:text-orange-400 font-semibold",
  Medium: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  Low: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
}

const RISKS: Risk[] = [
  {
    ref: "R-001",
    hazard: "Working at height — edge protection failure",
    category: "Working at height",
    site: "Brisbane Terminal",
    inherent: "Extreme",
    controls: "Perimeter handrails, safety mesh, induction + daily pre-start",
    legislation: "WHS Reg 2017 s.78–80",
    residual: "Medium",
    owner: "Marcus Reid",
    initials: "MR",
    reviewDue: "Overdue",
  },
  {
    ref: "R-002",
    hazard: "Crane swing radius — overhead powerlines contact",
    category: "Plant and equipment",
    site: "Geelong Site",
    inherent: "Extreme",
    controls: "Exclusion zones, spotter, SafeWork notification, permit-to-lift",
    legislation: "WHS Reg 2017 s.211–213",
    residual: "High",
    owner: "Ruth Alvarez",
    initials: "RA",
    reviewDue: "22 Jul",
  },
  {
    ref: "R-003",
    hazard: "Excavation collapse — persons in trench",
    category: "Excavation",
    site: "Brisbane Terminal",
    inherent: "Extreme",
    controls: "Shoring, batter, inspection every shift, no entry without engineer cert",
    legislation: "WHS Reg 2017 s.305–311",
    residual: "Medium",
    owner: "Marcus Reid",
    initials: "MR",
    reviewDue: "28 Jul",
  },
  {
    ref: "R-004",
    hazard: "Asbestos-containing material — disturbed during demolition",
    category: "Hazardous substances",
    site: "Melbourne Depot",
    inherent: "Extreme",
    controls: "Asbestos register, licensed removalist, air monitoring, exclusion zone",
    legislation: "WHS Reg 2017 s.420–430",
    residual: "Low",
    owner: "Alex Kerr",
    initials: "AK",
    reviewDue: "1 Aug",
  },
  {
    ref: "R-005",
    hazard: "Mobile plant / pedestrian interaction",
    category: "Traffic management",
    site: "All sites",
    inherent: "High",
    controls:
      "Segregated pedestrian paths, spotters, hi-vis mandatory, speed limit 10 km/h",
    legislation: "WHS Reg 2017 s.204",
    residual: "Low",
    owner: "Site supervisor",
    initials: "SS",
    reviewDue: "15 Aug",
  },
  {
    ref: "R-006",
    hazard: "Confined space entry — atmospheric hazard",
    category: "Confined spaces",
    site: "Brisbane Terminal",
    inherent: "Extreme",
    controls: "Entry permit, atmospheric testing, standby person, emergency rescue plan",
    legislation: "WHS Reg 2017 s.66–69",
    residual: "Low",
    owner: "Marcus Reid",
    initials: "MR",
    reviewDue: "22 Jul",
  },
  {
    ref: "R-007",
    hazard: "Scaffold — unauthorised alteration or overloading",
    category: "Working at height",
    site: "Melbourne Depot",
    inherent: "High",
    controls: "Competent scaffolder only, weekly inspection tag, load limits posted",
    legislation: "WHS Reg 2017 s.227",
    residual: "Low",
    owner: "Alex Kerr",
    initials: "AK",
    reviewDue: "21 Jul",
  },
  {
    ref: "R-008",
    hazard: "Energised electrical work — shock / electrocution",
    category: "Electrical",
    site: "Sydney Yard",
    inherent: "Extreme",
    controls:
      "Isolation + LOTO, licensed electrician, test before touch, insulated tools",
    legislation: "WHS Reg 2017 s.154",
    residual: "Medium",
    owner: "Priya Tan",
    initials: "PT",
    reviewDue: "5 Aug",
  },
  {
    ref: "R-009",
    hazard: "Manual handling — musculoskeletal injury",
    category: "Manual tasks",
    site: "Perth Workshop",
    inherent: "Medium",
    controls: "Mechanical aids, team lifts, manual handling induction",
    legislation: "WHS Reg 2017 s.56",
    residual: "Low",
    owner: "Jo Lin",
    initials: "JL",
    reviewDue: "1 Sep",
  },
  {
    ref: "R-010",
    hazard: "Silica dust — respiratory disease",
    category: "Hazardous substances",
    site: "All sites",
    inherent: "High",
    controls: "Water suppression, P2 respirator, air monitoring, health surveillance",
    legislation: "WHS Reg 2017 s.36–42",
    residual: "Low",
    owner: "Sam Okafor",
    initials: "SO",
    reviewDue: "15 Sep",
  },
  {
    ref: "R-011",
    hazard: "Precast concrete element — struck by during installation",
    category: "Demolition",
    site: "Adelaide Depot",
    inherent: "High",
    controls:
      "Exclusion zone below lift radius, certified rigging, dog-man communication",
    legislation: "WHS Reg 2017 s.211",
    residual: "Medium",
    owner: "Sam Okafor",
    initials: "SO",
    reviewDue: "1 Aug",
  },
  {
    ref: "R-012",
    hazard: "Heat stress — outdoor workers during summer",
    category: "Environment",
    site: "All sites",
    inherent: "Medium",
    controls: "Hydration stations, rest breaks, buddy system, BoM weather monitoring",
    legislation: "WHS Act 2011 s.19",
    residual: "Low",
    owner: "Site supervisor",
    initials: "SS",
    reviewDue: "1 Dec",
  },
]

const RISK_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Hazard details", type: "section" },
  {
    name: "hazard",
    label: "Hazard description",
    type: "text",
    required: true,
    placeholder: "What is the hazard or unsafe condition",
  },
  {
    name: "category",
    label: "Hazard category",
    type: "select",
    required: true,
    options: [
      "Working at height",
      "Plant and equipment",
      "Excavation and trenching",
      "Confined space",
      "Hot work / welding",
      "Electrical",
      "Traffic management",
      "Crane / rigging",
      "Manual handling",
      "Hazardous chemicals",
      "Noise and vibration",
      "Environmental",
      "Other",
    ],
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
      "All sites",
    ],
  },
  { name: "s2", label: "Risk assessment", type: "section" },
  {
    name: "inherent_risk",
    label: "Inherent risk (before controls)",
    type: "select",
    required: true,
    options: ["Extreme", "High", "Medium", "Low"],
  },
  {
    name: "hoc",
    label: "Hierarchy of control",
    type: "select",
    required: true,
    options: [
      "Elimination",
      "Substitution",
      "Isolation",
      "Engineering controls",
      "Administrative controls",
      "PPE",
    ],
  },
  {
    name: "controls",
    label: "Control measures",
    type: "textarea",
    required: true,
    rows: 4,
    placeholder: "Describe the controls to be applied…",
  },
  {
    name: "residual_risk",
    label: "Residual risk (after controls)",
    type: "select",
    required: true,
    options: ["High", "Medium", "Low"],
  },
  { name: "s3", label: "Ownership", type: "section" },
  {
    name: "legislation",
    label: "Legislation / code reference",
    type: "text",
    placeholder: "e.g. WHS Reg 2017 r.78, CoP Working at Heights",
  },
  {
    name: "owner",
    label: "Risk owner",
    type: "text",
    required: true,
    placeholder: "Full name or role",
  },
  { name: "review_date", label: "Review date", type: "date", required: true },
]

export function RiskRegister() {
  const extreme = RISKS.filter((r) => r.residual === "Extreme").length
  const high = RISKS.filter((r) => r.residual === "High").length
  const medium = RISKS.filter((r) => r.residual === "Medium").length
  const low = RISKS.filter((r) => r.residual === "Low").length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Risk" fields={RISK_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Extreme", value: extreme, tone: "text-red-700 dark:text-red-400" },
            { label: "High", value: high, tone: "text-orange-700 dark:text-orange-400" },
            {
              label: "Medium",
              value: medium,
              tone: "text-amber-700 dark:text-amber-400",
            },
            { label: "Low", value: low, tone: "text-emerald-700 dark:text-emerald-400" },
          ].map((stat) => (
            <div className="rounded-xl border bg-card px-4 py-3" key={stat.label}>
              <p className="text-xs text-muted-foreground">Residual {stat.label}</p>
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
                  <th className="px-4 py-2.5 font-medium">Hazard</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium text-center">Inherent</th>
                  <th className="px-4 py-2.5 font-medium max-w-xs">Controls</th>
                  <th className="px-4 py-2.5 font-medium">Legislation</th>
                  <th className="px-4 py-2.5 font-medium text-center">Residual</th>
                  <th className="px-4 py-2.5 font-medium">Owner</th>
                  <th className="px-4 py-2.5 font-medium">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {RISKS.map((risk) => (
                  <tr className="hover:bg-accent/40 transition-colors" key={risk.ref}>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {risk.ref}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-sm font-medium leading-snug">{risk.hazard}</p>
                      <p className="text-[10px] text-muted-foreground">{risk.category}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {risk.site}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={cn(
                          "inline-block rounded-md px-2 py-0.5 text-[10px]",
                          LEVEL_TONE[risk.inherent],
                        )}
                      >
                        {risk.inherent}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 max-w-xs">
                      <p className="text-xs leading-snug text-muted-foreground">
                        {risk.controls}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                        {risk.legislation}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-[10px] text-muted-foreground/70">
                      {risk.legislation}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={cn(
                          "inline-block rounded-md px-2 py-0.5 text-[10px]",
                          LEVEL_TONE[risk.residual],
                        )}
                      >
                        {risk.residual}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {risk.initials}
                        </div>
                        <span className="whitespace-nowrap text-xs">{risk.owner}</span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-2.5 text-xs font-medium",
                        risk.reviewDue === "Overdue"
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {risk.reviewDue}
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
