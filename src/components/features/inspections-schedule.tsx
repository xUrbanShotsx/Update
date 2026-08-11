import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type InspStatus = "Scheduled" | "In progress" | "Completed" | "Overdue" | "Cancelled"

type Inspection = {
  ref: string
  name: string
  template: string
  site: string
  assignee: string
  initials: string
  due: string
  score: number | null
  status: InspStatus
}

const STATUS_TONE: Record<InspStatus, string> = {
  Scheduled: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "In progress": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Overdue: "bg-red-500/15 text-red-700 dark:text-red-400",
  Cancelled: "bg-fill text-muted-foreground",
}

const INSPECTIONS: Inspection[] = [
  {
    ref: "INS-031",
    name: "Pre-pour safety inspection — Pour 14",
    template: "Pre-pour checklist",
    site: "Brisbane Terminal",
    assignee: "Marcus Reid",
    initials: "MR",
    due: "Today",
    score: null,
    status: "In progress",
  },
  {
    ref: "INS-032",
    name: "Monthly site safety audit",
    template: "ISO 45001 site audit",
    site: "Geelong Site",
    assignee: "Ruth Alvarez",
    initials: "RA",
    due: "Tomorrow",
    score: null,
    status: "Scheduled",
  },
  {
    ref: "INS-033",
    name: "Scaffold inspection — Level 3 perimeter",
    template: "Scaffold pre-use check",
    site: "Melbourne Depot",
    assignee: "Alex Kerr",
    initials: "AK",
    due: "21 Jul",
    score: null,
    status: "Scheduled",
  },
  {
    ref: "INS-034",
    name: "Plant pre-start inspection — Excavator EX-114",
    template: "Plant pre-start",
    site: "Perth Workshop",
    assignee: "Jo Lin",
    initials: "JL",
    due: "22 Jul",
    score: null,
    status: "Scheduled",
  },
  {
    ref: "INS-035",
    name: "Confined space entry permit check",
    template: "Confined space entry",
    site: "Brisbane Terminal",
    assignee: "Marcus Reid",
    initials: "MR",
    due: "22 Jul",
    score: null,
    status: "Scheduled",
  },
  {
    ref: "INS-036",
    name: "Emergency evacuation drill",
    template: "Emergency response drill",
    site: "Adelaide Depot",
    assignee: "Sam Okafor",
    initials: "SO",
    due: "25 Jul",
    score: null,
    status: "Scheduled",
  },
  {
    ref: "INS-030",
    name: "Monthly site safety audit",
    template: "ISO 45001 site audit",
    site: "Brisbane Terminal",
    assignee: "Marcus Reid",
    initials: "MR",
    due: "16 Jul",
    score: null,
    status: "Overdue",
  },
  {
    ref: "INS-029",
    name: "Toolbox talk verification — Electrical Safety",
    template: "Toolbox talk sign-off",
    site: "Geelong Site",
    assignee: "Ruth Alvarez",
    initials: "RA",
    due: "15 Jul",
    score: null,
    status: "Overdue",
  },
  {
    ref: "INS-028",
    name: "Monthly site safety audit",
    template: "ISO 45001 site audit",
    site: "Sydney Yard",
    assignee: "Priya Tan",
    initials: "PT",
    due: "3 Jul",
    score: 98,
    status: "Completed",
  },
  {
    ref: "INS-027",
    name: "Monthly site safety audit",
    template: "ISO 45001 site audit",
    site: "Melbourne Depot",
    assignee: "Alex Kerr",
    initials: "AK",
    due: "2 Jul",
    score: 94,
    status: "Completed",
  },
  {
    ref: "INS-026",
    name: "Scaffold inspection — Main access",
    template: "Scaffold pre-use check",
    site: "Perth Workshop",
    assignee: "Jo Lin",
    initials: "JL",
    due: "29 Jun",
    score: 100,
    status: "Completed",
  },
  {
    ref: "INS-025",
    name: "Pre-pour safety inspection — Pour 13",
    template: "Pre-pour checklist",
    site: "Brisbane Terminal",
    assignee: "Marcus Reid",
    initials: "MR",
    due: "27 Jun",
    score: 88,
    status: "Completed",
  },
]

export function InspectionsSchedule() {
  const overdue = INSPECTIONS.filter((i) => i.status === "Overdue").length
  const due7 = INSPECTIONS.filter((i) =>
    ["Scheduled", "In progress"].includes(i.status),
  ).length
  const completed = INSPECTIONS.filter((i) => i.status === "Completed").length
  const avgScore = Math.round(
    INSPECTIONS.filter((i) => i.score !== null).reduce((s, i) => s + (i.score ?? 0), 0) /
      INSPECTIONS.filter((i) => i.score !== null).length,
  )

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={2} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Overdue", value: overdue, tone: "text-red-600 dark:text-red-400" },
            {
              label: "Due this week",
              value: due7,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Completed (30d)",
              value: completed,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Avg score",
              value: `${avgScore}%`,
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
                  <th className="px-4 py-2.5 font-medium">Inspection</th>
                  <th className="px-4 py-2.5 font-medium">Template</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Assigned</th>
                  <th className="px-4 py-2.5 font-medium">Due</th>
                  <th className="px-4 py-2.5 font-medium text-center">Score</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {INSPECTIONS.map((ins) => (
                  <tr className="hover:bg-accent/40 transition-colors" key={ins.ref}>
                    <td className="px-4 py-2.5">
                      <p className="text-sm font-medium leading-snug">{ins.name}</p>
                      <p className="text-[10px] text-muted-foreground">{ins.ref}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {ins.template}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {ins.site}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {ins.initials}
                        </div>
                        <span className="whitespace-nowrap text-xs">{ins.assignee}</span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 whitespace-nowrap text-xs font-medium",
                        ins.status === "Overdue"
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {ins.due}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {ins.score !== null ? (
                        <span
                          className={cn(
                            "inline-block rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
                            ins.score >= 95
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : ins.score >= 85
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                : "bg-red-500/15 text-red-700 dark:text-red-400",
                          )}
                        >
                          {ins.score}%
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[ins.status],
                        )}
                      >
                        {ins.status}
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
