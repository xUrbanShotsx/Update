import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

type Severity = "High" | "Medium" | "Low" | "Near miss"
type IncidentType = "Near miss" | "Injury" | "Hazard" | "Incident"
type IncidentStatus =
  | "Reported"
  | "Investigating"
  | "Actions open"
  | "Verifying"
  | "Closed"

type Incident = {
  ref: string
  type: IncidentType
  site: string
  severity: Severity
  notifiable: boolean
  reported: string
  owner: string
  initials: string
  status: IncidentStatus
}

const SEVERITY_TONE: Record<Severity, string> = {
  High: "bg-red-500/15 text-red-700 dark:text-red-400",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Low: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "Near miss": "bg-violet-500/15 text-violet-700 dark:text-violet-400",
}

const STATUS_TONE: Record<IncidentStatus, string> = {
  Reported: "text-red-600 dark:text-red-400",
  Investigating: "text-amber-600 dark:text-amber-400",
  "Actions open": "text-orange-600 dark:text-orange-400",
  Verifying: "text-sky-600 dark:text-sky-400",
  Closed: "text-emerald-600 dark:text-emerald-400",
}

const INCIDENTS: Incident[] = [
  {
    ref: "INC-049",
    type: "Near miss",
    site: "Melbourne Depot",
    severity: "Near miss",
    notifiable: false,
    reported: "11 Aug",
    owner: "Alex Kerr",
    initials: "AK",
    status: "Reported",
  },
  {
    ref: "INC-048",
    type: "Hazard",
    site: "Geelong Site",
    severity: "High",
    notifiable: true,
    reported: "11 Aug",
    owner: "Ruth Alvarez",
    initials: "RA",
    status: "Reported",
  },
  {
    ref: "INC-047",
    type: "Near miss",
    site: "Brisbane Terminal",
    severity: "Near miss",
    notifiable: false,
    reported: "11 Aug",
    owner: "Marcus Reid",
    initials: "MR",
    status: "Reported",
  },
  {
    ref: "INC-046",
    type: "Incident",
    site: "Sydney Yard",
    severity: "Medium",
    notifiable: false,
    reported: "9 Aug",
    owner: "Priya Tan",
    initials: "PT",
    status: "Investigating",
  },
  {
    ref: "INC-045",
    type: "Incident",
    site: "Geelong Site",
    severity: "High",
    notifiable: true,
    reported: "7 Aug",
    owner: "Ruth Alvarez",
    initials: "RA",
    status: "Investigating",
  },
  {
    ref: "INC-044",
    type: "Injury",
    site: "Brisbane Terminal",
    severity: "Medium",
    notifiable: false,
    reported: "8 Aug",
    owner: "Marcus Reid",
    initials: "MR",
    status: "Investigating",
  },
  {
    ref: "INC-043",
    type: "Near miss",
    site: "Geelong Site",
    severity: "Medium",
    notifiable: false,
    reported: "1 Aug",
    owner: "Ruth Alvarez",
    initials: "RA",
    status: "Actions open",
  },
  {
    ref: "INC-042",
    type: "Incident",
    site: "Brisbane Terminal",
    severity: "High",
    notifiable: true,
    reported: "4 Aug",
    owner: "Marcus Reid",
    initials: "MR",
    status: "Actions open",
  },
  {
    ref: "INC-041",
    type: "Injury",
    site: "Perth Workshop",
    severity: "Low",
    notifiable: false,
    reported: "4 Aug",
    owner: "Jo Lin",
    initials: "JL",
    status: "Actions open",
  },
  {
    ref: "INC-040",
    type: "Hazard",
    site: "Melbourne Depot",
    severity: "High",
    notifiable: true,
    reported: "28 Jul",
    owner: "Alex Kerr",
    initials: "AK",
    status: "Actions open",
  },
  {
    ref: "INC-039",
    type: "Injury",
    site: "Geelong Site",
    severity: "Medium",
    notifiable: false,
    reported: "28 Jul",
    owner: "Ruth Alvarez",
    initials: "RA",
    status: "Actions open",
  },
  {
    ref: "INC-037",
    type: "Incident",
    site: "Sydney Yard",
    severity: "High",
    notifiable: true,
    reported: "21 Jul",
    owner: "Priya Tan",
    initials: "PT",
    status: "Verifying",
  },
  {
    ref: "INC-036",
    type: "Near miss",
    site: "Melbourne Depot",
    severity: "Near miss",
    notifiable: false,
    reported: "14 Jul",
    owner: "Alex Kerr",
    initials: "AK",
    status: "Closed",
  },
  {
    ref: "INC-035",
    type: "Injury",
    site: "Adelaide Depot",
    severity: "Low",
    notifiable: false,
    reported: "7 Jul",
    owner: "Sam Okafor",
    initials: "SO",
    status: "Closed",
  },
  {
    ref: "INC-034",
    type: "Hazard",
    site: "Perth Workshop",
    severity: "Low",
    notifiable: false,
    reported: "30 Jun",
    owner: "Jo Lin",
    initials: "JL",
    status: "Closed",
  },
]

const INCIDENT_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Incident details", type: "section" },
  {
    name: "type",
    label: "Incident type",
    type: "select",
    required: true,
    options: [
      "Incident",
      "Near miss",
      "Hazard / unsafe condition",
      "Injury",
      "Property damage",
      "Environmental",
    ],
  },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time", label: "Time", type: "time", required: true },
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
  {
    name: "location",
    label: "Location on site",
    type: "text",
    placeholder: "e.g. Grid C4, Loading bay 2",
  },
  { name: "s2", label: "What happened", type: "section" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    rows: 4,
    placeholder: "What happened, sequence of events, immediate cause…",
  },
  {
    name: "persons",
    label: "Person(s) involved",
    type: "text",
    placeholder: "Names and companies",
  },
  {
    name: "injury_details",
    label: "Injury details (if any)",
    type: "text",
    placeholder: "Type of injury, body part",
  },
  {
    name: "treatment",
    label: "Treatment given",
    type: "select",
    options: [
      "None required",
      "First aid on site",
      "Medical treatment",
      "Hospital — not admitted",
      "Hospital — admitted",
      "Under investigation",
    ],
  },
  { name: "s3", label: "Response", type: "section" },
  {
    name: "notifiable",
    label: "Notifiable to SafeWork / regulator?",
    type: "select",
    required: true,
    options: ["No", "Yes — notification being prepared", "Yes — already notified"],
  },
  {
    name: "immediate_actions",
    label: "Immediate actions taken",
    type: "textarea",
    rows: 3,
    placeholder: "Area secured, first aid given, scene preserved…",
  },
  {
    name: "assigned_to",
    label: "Investigation assigned to",
    type: "text",
    placeholder: "Full name",
  },
]

export function SafetyIncidentTable() {
  const open = INCIDENTS.filter((i) => i.status !== "Closed")
  const notifiable = INCIDENTS.filter((i) => i.notifiable)
  const closed = INCIDENTS.filter((i) => i.status === "Closed")

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Safety Incident" fields={INCIDENT_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Open incidents", value: open.length, tone: "" },
            {
              label: "Notifiable",
              value: notifiable.length,
              tone: "text-red-600 dark:text-red-400",
            },
            {
              label: "Actions open",
              value: open.filter((i) => i.status === "Actions open").length,
              tone: "text-orange-600 dark:text-orange-400",
            },
            {
              label: "Closed (30d)",
              value: closed.length,
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
                  <th className="px-4 py-2.5 font-medium">Ref</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Severity</th>
                  <th className="px-4 py-2.5 font-medium">Notifiable</th>
                  <th className="px-4 py-2.5 font-medium">Reported</th>
                  <th className="px-4 py-2.5 font-medium">Owner</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {INCIDENTS.map((inc) => (
                  <tr
                    className={cn(
                      "transition-colors hover:bg-accent/40",
                      inc.status === "Closed" && "opacity-50",
                    )}
                    key={inc.ref}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {inc.ref}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-fill px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {inc.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {inc.site}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          SEVERITY_TONE[inc.severity],
                        )}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          inc.notifiable
                            ? "text-red-600 dark:text-red-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {inc.notifiable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {inc.reported}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {inc.initials}
                        </div>
                        <span className="whitespace-nowrap text-xs">{inc.owner}</span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-2.5 text-xs font-medium",
                        STATUS_TONE[inc.status],
                      )}
                    >
                      {inc.status}
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
