import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"

type Duties = "Full" | "Modified" | "Nil"
type CaseStatus = "Active" | "RTW" | "Closed"

type InjuryCase = {
  person: string
  initials: string
  incidentRef: string
  claimNo: string
  insurer: string
  lodged: string
  duties: Duties
  daysLost: number
  status: CaseStatus
}

const STATUS_TONE: Record<CaseStatus, string> = {
  Active: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  RTW: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Closed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
}

const DUTIES_TONE: Record<Duties, string> = {
  Full: "text-emerald-600 dark:text-emerald-400",
  Modified: "text-amber-600 dark:text-amber-400",
  Nil: "text-red-600 dark:text-red-400",
}

const CASES: InjuryCase[] = [
  {
    person: "Kyle Osman",
    initials: "KO",
    incidentRef: "INC-031",
    claimNo: "WCI-84712",
    insurer: "Allianz",
    lodged: "4 Mar 2026",
    duties: "Modified",
    daysLost: 14,
    status: "Active",
  },
  {
    person: "Darren Soo",
    initials: "DS",
    incidentRef: "INC-038",
    claimNo: "WCI-91034",
    insurer: "QBE",
    lodged: "29 May 2026",
    duties: "Full",
    daysLost: 3,
    status: "RTW",
  },
  {
    person: "Janelle Park",
    initials: "JP",
    incidentRef: "INC-042",
    claimNo: "WCI-94217",
    insurer: "Gallagher",
    lodged: "14 Jul 2026",
    duties: "Nil",
    daysLost: 8,
    status: "Active",
  },
  {
    person: "Nathan Holloway",
    initials: "NH",
    incidentRef: "INC-029",
    claimNo: "WCI-80341",
    insurer: "Allianz",
    lodged: "15 Jan 2026",
    duties: "Full",
    daysLost: 6,
    status: "Closed",
  },
  {
    person: "Sam Okafor",
    initials: "SO",
    incidentRef: "INC-033",
    claimNo: "WCI-87459",
    insurer: "GIO",
    lodged: "18 Mar 2026",
    duties: "Modified",
    daysLost: 5,
    status: "Active",
  },
  {
    person: "Troy Baxter",
    initials: "TB",
    incidentRef: "INC-022",
    claimNo: "WCI-71823",
    insurer: "QBE",
    lodged: "8 Sep 2025",
    duties: "Full",
    daysLost: 2,
    status: "Closed",
  },
  {
    person: "Brendan Walsh",
    initials: "BW",
    incidentRef: "INC-036",
    claimNo: "WCI-89901",
    insurer: "Allianz",
    lodged: "7 May 2026",
    duties: "Full",
    daysLost: 4,
    status: "RTW",
  },
  {
    person: "Kylie Brennan",
    initials: "KB",
    incidentRef: "INC-027",
    claimNo: "WCI-78234",
    insurer: "GIO",
    lodged: "2 Dec 2025",
    duties: "Full",
    daysLost: 5,
    status: "Closed",
  },
]

const DAYS_LOST_YTD = 47
const CLOSED_THIS_YEAR = 5

const INJURY_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Worker details", type: "section" },
  {
    name: "name",
    label: "Injured worker name",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  { name: "company", label: "Company / employer", type: "text", required: true },
  {
    name: "site",
    label: "Site of incident",
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
    name: "incident_ref",
    label: "Incident report reference",
    type: "text",
    required: true,
    placeholder: "e.g. INC-2024-0031",
  },
  { name: "s2", label: "Injury details", type: "section" },
  {
    name: "injury_type",
    label: "Injury type",
    type: "select",
    required: true,
    options: [
      "Strain / sprain",
      "Laceration / cut",
      "Fracture",
      "Burn",
      "Eye injury",
      "Crush injury",
      "Contusion / bruising",
      "Near miss (no injury)",
      "Occupational disease",
      "Other",
    ],
  },
  {
    name: "body_part",
    label: "Body part affected",
    type: "select",
    required: true,
    options: [
      "Hand / wrist / fingers",
      "Back / spine",
      "Knee / leg",
      "Shoulder / arm",
      "Head / neck",
      "Ankle / foot",
      "Eye",
      "Multiple",
      "Other",
    ],
  },
  {
    name: "treatment",
    label: "Treatment received",
    type: "select",
    required: true,
    options: [
      "First aid on site — no further treatment",
      "Medical treatment — GP / clinic",
      "Hospital — emergency / not admitted",
      "Hospital — admitted",
      "Ambulance attended",
      "No treatment required",
    ],
  },
  {
    name: "lost_time",
    label: "Lost time days",
    type: "number",
    placeholder: "0 if none",
  },
  { name: "s3", label: "Return to work", type: "section" },
  {
    name: "rtw_status",
    label: "RTW status",
    type: "select",
    required: true,
    options: [
      "Fit for full duties",
      "Modified duties — restrictions apply",
      "Absent — medical certificate",
      "Under review",
      "Permanently incapacitated",
    ],
  },
  {
    name: "treating_doctor",
    label: "Treating doctor / clinic",
    type: "text",
    placeholder: "Full name and practice",
  },
  { name: "next_review", label: "Next review date", type: "date" },
  {
    name: "workers_comp",
    label: "Workers compensation claim lodged?",
    type: "select",
    options: ["No", "Yes — claim number pending", "Yes — claim active"],
  },
]

export function InjuryCases() {
  const active = CASES.filter((c) => c.status === "Active").length
  const modified = CASES.filter((c) => c.duties === "Modified").length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={2} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Injury Case" fields={INJURY_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Active claims",
              value: active,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Modified duties",
              value: modified,
              tone: "text-sky-600 dark:text-sky-400",
            },
            {
              label: "Days lost YTD",
              value: DAYS_LOST_YTD,
              tone: "text-red-600 dark:text-red-400",
            },
            {
              label: "Closed this year",
              value: CLOSED_THIS_YEAR,
              tone: "text-emerald-600 dark:text-emerald-400",
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
                  <th className="px-4 py-2.5 font-medium">Person</th>
                  <th className="px-4 py-2.5 font-medium">Incident ref</th>
                  <th className="px-4 py-2.5 font-medium">Claim no</th>
                  <th className="px-4 py-2.5 font-medium">Insurer</th>
                  <th className="px-4 py-2.5 font-medium">Lodged</th>
                  <th className="px-4 py-2.5 font-medium">Duties</th>
                  <th className="px-4 py-2.5 font-medium text-right">Days lost</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {CASES.map((c, i) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      c.status === "Closed" && "opacity-60",
                    )}
                    key={i}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[10px] font-medium">
                          {c.initials}
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium">
                          {c.person}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {c.incidentRef}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {c.claimNo}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {c.insurer}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {c.lodged}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn("text-xs font-medium", DUTIES_TONE[c.duties])}>
                        {c.duties}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-xs">
                      {c.daysLost}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[c.status],
                        )}
                      >
                        {c.status}
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
