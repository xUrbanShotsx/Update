import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type Priority = "Critical" | "High" | "Medium" | "Low"
type Status = "Overdue" | "Due soon" | "In progress" | "Open" | "Closed"

type Action = {
  ref: string
  description: string
  source: string
  site: string
  owner: string
  initials: string
  raised: string
  due: string
  priority: Priority
  status: Status
}

const PRIORITY_TONE: Record<Priority, string> = {
  Critical: "bg-red-500/15 text-red-700 dark:text-red-400",
  High: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Low: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
}

const STATUS_TONE: Record<Status, string> = {
  Overdue: "text-red-600 dark:text-red-400",
  "Due soon": "text-amber-600 dark:text-amber-400",
  "In progress": "text-sky-600 dark:text-sky-400",
  Open: "text-muted-foreground",
  Closed: "text-emerald-600 dark:text-emerald-400",
}

const ACTIONS: Action[] = [
  {
    ref: "CA-041",
    description:
      "Review and reissue SWMS for Working at Height — edge protection gaps identified in audit",
    source: "INC-042",
    site: "Brisbane Terminal",
    owner: "Marcus Reid",
    initials: "MR",
    raised: "14 Jul",
    due: "18 Jul",
    priority: "Critical",
    status: "Overdue",
  },
  {
    ref: "CA-043",
    description:
      "Schedule toolbox talk on electrical safety before energised isolation work resumes",
    source: "INC-037",
    site: "Geelong Site",
    owner: "Ruth Alvarez",
    initials: "RA",
    raised: "16 Jul",
    due: "19 Jul",
    priority: "High",
    status: "Overdue",
  },
  {
    ref: "CA-044",
    description: "Install exclusion zone signage and barriers around crane swing radius",
    source: "INC-048",
    site: "Geelong Site",
    owner: "Ruth Alvarez",
    initials: "RA",
    raised: "Today",
    due: "21 Jul",
    priority: "Critical",
    status: "In progress",
  },
  {
    ref: "CA-045",
    description:
      "Conduct forklift operator refresher and review pedestrian traffic management plan",
    source: "INC-047",
    site: "Brisbane Terminal",
    owner: "Marcus Reid",
    initials: "MR",
    raised: "Today",
    due: "22 Jul",
    priority: "High",
    status: "In progress",
  },
  {
    ref: "CA-042",
    description:
      "Engage hygienist to test and remediate asbestos debris — SafeWork NSW notification required",
    source: "INC-040",
    site: "Melbourne Depot",
    owner: "Alex Kerr",
    initials: "AK",
    raised: "8 Jul",
    due: "25 Jul",
    priority: "Critical",
    status: "In progress",
  },
  {
    ref: "CA-039",
    description:
      "Conduct monthly safety inspection of scaffold and access ways — overdue for Geelong",
    source: "Inspection",
    site: "Geelong Site",
    owner: "Ruth Alvarez",
    initials: "RA",
    raised: "1 Jul",
    due: "26 Jul",
    priority: "Medium",
    status: "Due soon",
  },
  {
    ref: "CA-046",
    description:
      "Update emergency response plan to include new welfare facility locations",
    source: "Audit",
    site: "Perth Workshop",
    owner: "Jo Lin",
    initials: "JL",
    raised: "Today",
    due: "28 Jul",
    priority: "Medium",
    status: "Open",
  },
  {
    ref: "CA-038",
    description:
      "Implement housekeeping schedule and daily sign-off by leading hand before end of shift",
    source: "INC-043",
    site: "Geelong Site",
    owner: "Ruth Alvarez",
    initials: "RA",
    raised: "5 Jul",
    due: "30 Jul",
    priority: "Low",
    status: "Open",
  },
  {
    ref: "CA-037",
    description:
      "Replace worn PPE in site store — safety glasses, gloves, and hi-vis vests",
    source: "Inspection",
    site: "Adelaide Depot",
    owner: "Sam Okafor",
    initials: "SO",
    raised: "1 Jul",
    due: "1 Aug",
    priority: "Low",
    status: "Open",
  },
  {
    ref: "CA-036",
    description:
      "Update site induction slide deck to reflect new traffic management routes",
    source: "Audit",
    site: "Sydney Yard",
    owner: "Priya Tan",
    initials: "PT",
    raised: "28 Jun",
    due: "Closed",
    priority: "Medium",
    status: "Closed",
  },
  {
    ref: "CA-035",
    description: "Repair concrete trip hazard at main entry path to south yard",
    source: "Inspection",
    site: "Melbourne Depot",
    owner: "Alex Kerr",
    initials: "AK",
    raised: "25 Jun",
    due: "Closed",
    priority: "Medium",
    status: "Closed",
  },
]

export function ActionsList() {
  const open = ACTIONS.filter((a) => a.status !== "Closed")
  const closed = ACTIONS.filter((a) => a.status === "Closed")

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        {/* Summary strip */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total open", value: open.length, tone: "" },
            {
              label: "Overdue",
              value: open.filter((a) => a.status === "Overdue").length,
              tone: "text-red-600 dark:text-red-400",
            },
            {
              label: "Due this week",
              value: open.filter((a) => a.status === "Due soon").length,
              tone: "text-amber-600 dark:text-amber-400",
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
                  <th className="px-4 py-2.5 font-medium">Action</th>
                  <th className="px-4 py-2.5 font-medium">Source</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Owner</th>
                  <th className="px-4 py-2.5 font-medium">Raised</th>
                  <th className="px-4 py-2.5 font-medium">Due</th>
                  <th className="px-4 py-2.5 font-medium">Priority</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ACTIONS.map((action) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      action.status === "Closed" && "opacity-50",
                    )}
                    key={action.ref}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {action.ref}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 max-w-xs">
                      <p className="text-sm leading-snug">{action.description}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-fill px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {action.source}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground text-xs">
                      {action.site}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {action.initials}
                        </div>
                        <span className="whitespace-nowrap text-xs">{action.owner}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {action.raised}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 whitespace-nowrap text-xs font-medium",
                        STATUS_TONE[action.status],
                      )}
                    >
                      {action.due}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          PRIORITY_TONE[action.priority],
                        )}
                      >
                        {action.priority}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 whitespace-nowrap text-xs font-medium",
                        STATUS_TONE[action.status],
                      )}
                    >
                      {action.status}
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
