"use client"

import { useState } from "react"
import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"
import { DetailRow, DetailSection } from "@/components/shared/detail-modal"

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

const HOC_LEVELS: Array<{
  name: string
  color: string
  description: string
}> = [
  {
    name: "Elimination",
    color: "#059669",
    description:
      "Remove the hazard entirely — redesign the work or process to avoid the need for the activity.",
  },
  {
    name: "Substitution",
    color: "#0284c7",
    description:
      "Replace the hazard with something less dangerous — use a lower-risk material, method, or piece of plant.",
  },
  {
    name: "Isolation",
    color: "#7c3aed",
    description:
      "Separate the hazard from people — exclusion zones, guarding, interlocks, or physical barriers.",
  },
  {
    name: "Engineering controls",
    color: "#b45309",
    description:
      "Physical controls that reduce exposure — ventilation, safe design, mechanical aids, structural protection.",
  },
  {
    name: "Administrative controls",
    color: "#c2410c",
    description:
      "Work systems and procedures — SWMS, permits, inductions, training, supervision, inspection schedules.",
  },
  {
    name: "PPE",
    color: "#b91c1c",
    description:
      "Personal protective equipment worn by the worker — the last resort, not a substitute for higher-order controls.",
  },
]

const LEGISLATION_DESCRIPTIONS: Record<string, string> = {
  "WHS Reg 2017 s.78–80":
    "Regulations 78–80 require a safe work method statement (SWMS) for all high risk construction work involving a risk of a person falling more than 2 metres. The SWMS must identify hazards and document controls applied under the hierarchy of control.",
  "WHS Reg 2017 s.211–213":
    "Regulations 211–213 impose specific obligations for the management of plant risks, including cranes operating near energised overhead power lines. A minimum approach distance must be maintained unless the line is de-energised and earthed.",
  "WHS Reg 2017 s.305–311":
    "Regulations 305–311 require excavations deeper than 1.5 metres to be protected against collapse by benching, battering, or shoring. No person may enter an unprotected excavation that poses a collapse risk.",
  "WHS Reg 2017 s.420–430":
    "Regulations 420–430 regulate the management of asbestos and asbestos-containing materials (ACM). A licensed removalist is required for friable or non-friable ACM exceeding the prescribed threshold, and air monitoring must be carried out.",
  "WHS Reg 2017 s.204":
    "Regulation 204 requires traffic management to be planned and implemented to protect workers from being struck by moving vehicles and mobile plant. Pedestrian and vehicle paths must be separated where practicable.",
  "WHS Reg 2017 s.66–69":
    "Regulations 66–69 require a confined space entry permit system, atmospheric testing before entry, a trained standby person outside the space at all times, and a documented emergency rescue plan.",
  "WHS Reg 2017 s.227":
    "Regulation 227 requires scaffolding to be erected, altered, and dismantled by a competent person holding the appropriate high risk work licence. Scaffolding must be inspected at specified intervals and tagged to show its condition.",
  "WHS Reg 2017 s.154":
    "Regulation 154 prohibits energised electrical work except in defined circumstances. All electrical work must be performed by a licensed electrician, and the installation must be isolated, locked out, and tested before work begins.",
  "WHS Reg 2017 s.56":
    "Regulation 56 requires the PCBU to manage risks from manual tasks that could cause musculoskeletal disorder. Risk controls must follow the hierarchy, prioritising elimination or mechanical assistance over administrative measures.",
  "WHS Reg 2017 s.36–42":
    "Regulations 36–42 require the PCBU to manage risks from hazardous chemicals including respirable crystalline silica. Air monitoring and health surveillance are required where workers may be exposed above the exposure standard.",
  "WHS Reg 2017 s.211":
    "Regulation 211 requires the risks of uncontrolled plant movement to be eliminated or minimised. Exclusion zones, certified rigging, and competent dogmen are required where persons could be struck by plant or suspended loads.",
  "WHS Act 2011 s.19":
    "Section 19 imposes a primary duty of care on the PCBU to ensure, so far as is reasonably practicable, the health and safety of workers and other persons whose health and safety may be affected by work carried out at the workplace.",
}

function getLegislationDescription(legislation: string): string {
  return (
    LEGISLATION_DESCRIPTIONS[legislation] ??
    `Refer to ${legislation} for detailed requirements applicable to this hazard category.`
  )
}

export function RiskRegister() {
  const [selected, setSelected] = useState<Risk | null>(null)

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
            {
              label: "Extreme",
              value: extreme,
              tone: "text-red-700 dark:text-red-400",
            },
            {
              label: "High",
              value: high,
              tone: "text-orange-700 dark:text-orange-400",
            },
            {
              label: "Medium",
              value: medium,
              tone: "text-amber-700 dark:text-amber-400",
            },
            {
              label: "Low",
              value: low,
              tone: "text-emerald-700 dark:text-emerald-400",
            },
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
                  <th className="max-w-xs px-4 py-2.5 font-medium">Controls</th>
                  <th className="px-4 py-2.5 font-medium">Legislation</th>
                  <th className="px-4 py-2.5 font-medium text-center">Residual</th>
                  <th className="px-4 py-2.5 font-medium">Owner</th>
                  <th className="px-4 py-2.5 font-medium">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {RISKS.map((risk) => (
                  <tr
                    className="cursor-pointer transition-colors hover:bg-accent/40"
                    key={risk.ref}
                    onClick={() => setSelected(risk)}
                  >
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
                    <td className="max-w-xs px-4 py-2.5">
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

        {/* Risk detail overlay */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl"
              style={{ maxHeight: "min(90vh, 820px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-snug">
                    {selected.ref} —{" "}
                    {selected.hazard.length > 60
                      ? `${selected.hazard.slice(0, 60)}…`
                      : selected.hazard}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {selected.category} · {selected.site}
                  </p>
                </div>
                <button
                  aria-label="Close"
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setSelected(null)}
                  type="button"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div
                className="overflow-y-auto px-6 py-5"
                style={{ maxHeight: "calc(min(90vh, 820px) - 72px)" }}
              >
                <DetailSection label="Risk Assessment">
                  <DetailRow label="Hazard" value={selected.hazard} />
                  <DetailRow label="Category" value={selected.category} />
                  <DetailRow label="Site" value={selected.site} />
                  <DetailRow
                    label="Inherent risk"
                    value={
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px]",
                          LEVEL_TONE[selected.inherent],
                        )}
                      >
                        {selected.inherent}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Residual risk"
                    value={
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px]",
                          LEVEL_TONE[selected.residual],
                        )}
                      >
                        {selected.residual}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Risk owner"
                    value={
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {selected.initials}
                        </div>
                        <span>{selected.owner}</span>
                      </div>
                    }
                  />
                  <DetailRow
                    label="Review due"
                    value={selected.reviewDue}
                    tone={
                      selected.reviewDue === "Overdue"
                        ? "text-red-600 dark:text-red-400"
                        : undefined
                    }
                  />
                  <DetailRow label="Legislation" value={selected.legislation} />
                </DetailSection>

                <DetailSection label="Hierarchy of Controls">
                  <div className="space-y-1.5">
                    {HOC_LEVELS.map((level, i) => {
                      const indent = (HOC_LEVELS.length - 1 - i) * 18
                      const isAdmin = level.name === "Administrative controls"
                      return (
                        <div
                          key={level.name}
                          style={{
                            marginLeft: `${indent}px`,
                            borderLeft: `3px solid ${level.color}`,
                          }}
                          className="rounded-r-lg bg-muted/30 px-3 py-2"
                        >
                          <p
                            className="text-xs font-semibold"
                            style={{ color: level.color }}
                          >
                            {level.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {level.description}
                          </p>
                          {isAdmin && (
                            <p className="mt-1 text-[11px] italic text-muted-foreground/70">
                              Controls in use: {selected.controls}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </DetailSection>

                <DetailSection label="Control measures in place">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selected.controls}
                  </p>
                </DetailSection>

                <DetailSection label="Legislative reference">
                  <p className="mb-1 text-xs font-semibold">{selected.legislation}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {getLegislationDescription(selected.legislation)}
                  </p>
                </DetailSection>
              </div>
            </div>
          </div>
        )}
      </Frame>
    </PageScroll>
  )
}
