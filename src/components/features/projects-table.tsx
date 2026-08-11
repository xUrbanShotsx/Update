import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type ProjectStatus =
  | "Tendered"
  | "Awarded"
  | "Mobilising"
  | "On site"
  | "Practical completion"
  | "Closed"

type Project = {
  ref: string
  name: string
  client: string
  site: string
  contract: string
  start: string
  finish: string
  complete: number
  status: ProjectStatus
}

const STATUS_TONE: Record<ProjectStatus, string> = {
  Tendered: "bg-fill text-muted-foreground",
  Awarded: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  Mobilising: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "On site": "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  "Practical completion": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Closed: "bg-fill text-muted-foreground/60",
}

const PROJECTS: Project[] = [
  {
    ref: "PRJ-001",
    name: "M80 Ring Road Upgrade — Stage 3",
    client: "Department of Transport Victoria",
    site: "Melbourne Depot",
    contract: "$18.4M",
    start: "Mar 2025",
    finish: "Dec 2025",
    complete: 62,
    status: "On site",
  },
  {
    ref: "PRJ-002",
    name: "West Gate Bridge Maintenance & Repainting",
    client: "West Gate Tunnel Project Co",
    site: "Melbourne Depot",
    contract: "$4.1M",
    start: "Jun 2025",
    finish: "Feb 2026",
    complete: 38,
    status: "On site",
  },
  {
    ref: "PRJ-003",
    name: "Sydney Metro West — Civil Package C7",
    client: "CPB Contractors",
    site: "Sydney Yard",
    contract: "$31.2M",
    start: "Jan 2025",
    finish: "Mar 2026",
    complete: 54,
    status: "On site",
  },
  {
    ref: "PRJ-004",
    name: "Coomera Connector — Earthworks Package",
    client: "Queensland Department of Transport",
    site: "Brisbane Terminal",
    contract: "$9.8M",
    start: "Sep 2025",
    finish: "Apr 2026",
    complete: 21,
    status: "Mobilising",
  },
  {
    ref: "PRJ-005",
    name: "Port Botany Terminal Expansion — Pavement",
    client: "NSW Ports",
    site: "Sydney Yard",
    contract: "$6.3M",
    start: "Aug 2025",
    finish: "Jan 2026",
    complete: 44,
    status: "On site",
  },
  {
    ref: "PRJ-006",
    name: "Forrestfield–Airport Link — Slab Track",
    client: "Salini Impregilo",
    site: "Perth Workshop",
    contract: "$7.7M",
    start: "Nov 2024",
    finish: "Jul 2025",
    complete: 97,
    status: "Practical completion",
  },
  {
    ref: "PRJ-007",
    name: "Port Adelaide Bulk Handling Facility",
    client: "Viterra Australia",
    site: "Adelaide Depot",
    contract: "$5.2M",
    start: "Feb 2025",
    finish: "Sep 2025",
    complete: 78,
    status: "On site",
  },
  {
    ref: "PRJ-008",
    name: "Geelong Ring Road Eastern Section — Drainage",
    client: "Transurban",
    site: "Geelong Site",
    contract: "$3.4M",
    start: "Oct 2025",
    finish: "Mar 2026",
    complete: 12,
    status: "On site",
  },
  {
    ref: "PRJ-009",
    name: "North East Link — Sound Wall Package",
    client: "NELP Alliance",
    site: "Melbourne Depot",
    contract: "$11.6M",
    start: "Jan 2026",
    finish: "Aug 2026",
    complete: 0,
    status: "Awarded",
  },
  {
    ref: "PRJ-010",
    name: "Brisbane Airport Parallel Runway — Taxiway Paving",
    client: "Brisbane Airport Corporation",
    site: "Brisbane Terminal",
    contract: "$22.9M",
    start: "Mar 2026",
    finish: "Dec 2026",
    complete: 0,
    status: "Tendered",
  },
  {
    ref: "PRJ-011",
    name: "Roe Highway Extension — Earthworks",
    client: "Main Roads WA",
    site: "Perth Workshop",
    contract: "$14.1M",
    start: "Jun 2024",
    finish: "Feb 2025",
    complete: 100,
    status: "Closed",
  },
]

export function ProjectsTable() {
  const onSite = PROJECTS.filter((p) =>
    ["On site", "Mobilising", "Practical completion"].includes(p.status),
  ).length
  const awarded = PROJECTS.filter((p) => p.status === "Awarded").length
  const closed = PROJECTS.filter((p) => p.status === "Closed").length
  const totalValue = PROJECTS.filter((p) =>
    ["On site", "Mobilising", "Practical completion", "Awarded"].includes(p.status),
  ).length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Active projects", value: onSite, tone: "" },
            { label: "Awarded", value: awarded, tone: "text-sky-600 dark:text-sky-400" },
            { label: "Tendered", value: 1, tone: "text-muted-foreground" },
            { label: "Closed (12m)", value: closed, tone: "text-muted-foreground" },
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
                  <th className="px-4 py-2.5 font-medium">Project</th>
                  <th className="px-4 py-2.5 font-medium">Client</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium text-right">Contract</th>
                  <th className="px-4 py-2.5 font-medium">Start</th>
                  <th className="px-4 py-2.5 font-medium">Finish</th>
                  <th className="px-4 py-2.5 font-medium text-center">Complete</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {PROJECTS.map((proj) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      proj.status === "Closed" && "opacity-50",
                    )}
                    key={proj.ref}
                  >
                    <td className="px-4 py-2.5">
                      <p className="text-sm font-medium leading-snug">{proj.name}</p>
                      <p className="text-[10px] text-muted-foreground">{proj.ref}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {proj.client}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {proj.site}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right text-sm font-medium tabular-nums">
                      {proj.contract}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {proj.start}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {proj.finish}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs font-medium tabular-nums">
                          {proj.complete}%
                        </span>
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-fill-strong">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              proj.complete === 100
                                ? "bg-emerald-500"
                                : proj.complete >= 50
                                  ? "bg-blue-500"
                                  : "bg-amber-500",
                            )}
                            style={{ width: `${proj.complete}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[proj.status],
                        )}
                      >
                        {proj.status}
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
