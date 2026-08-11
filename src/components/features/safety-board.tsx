import { PageScrollX } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

type Severity = "High" | "Medium" | "Low" | "Near miss"
type IncidentCard = {
  ref: string
  type: string
  description: string
  site: string
  severity: Severity
  assignee: string
  initials: string
  reported: string
}

const SEVERITY_TONE: Record<Severity, string> = {
  High:       "bg-red-500/15 text-red-700 dark:text-red-400",
  Medium:     "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Low:        "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "Near miss":"bg-violet-500/15 text-violet-700 dark:text-violet-400",
}

const LANE_DOT: Record<string, string> = {
  "Reported":      "bg-red-500",
  "Investigating": "bg-amber-500",
  "Actions open":  "bg-orange-500",
  "Verifying":     "bg-sky-500",
  "Closed":        "bg-emerald-500",
}

const LANES: { label: string; cards: IncidentCard[] }[] = [
  {
    label: "Reported",
    cards: [
      {
        ref: "INC-047",
        type: "Near miss",
        description: "Unsecured load on forklift — near miss in loading bay",
        site: "Brisbane Terminal",
        severity: "Near miss",
        assignee: "Marcus Reid",
        initials: "MR",
        reported: "Today, 09:14",
      },
      {
        ref: "INC-048",
        type: "Hazard",
        description: "Overhead powerlines within swing radius of crane",
        site: "Geelong Site",
        severity: "High",
        assignee: "Ruth Alvarez",
        initials: "RA",
        reported: "Today, 11:32",
      },
      {
        ref: "INC-049",
        type: "Near miss",
        description: "Worker slipped on wet concrete — no injury",
        site: "Melbourne Depot",
        severity: "Near miss",
        assignee: "Alex Kerr",
        initials: "AK",
        reported: "Yesterday",
      },
    ],
  },
  {
    label: "Investigating",
    cards: [
      {
        ref: "INC-044",
        type: "Injury",
        description: "Laceration to right hand — grinder guard removed",
        site: "Brisbane Terminal",
        severity: "Medium",
        assignee: "Marcus Reid",
        initials: "MR",
        reported: "3 days ago",
      },
      {
        ref: "INC-045",
        type: "Incident",
        description: "Scaffold board displaced — person at risk below",
        site: "Geelong Site",
        severity: "High",
        assignee: "Ruth Alvarez",
        initials: "RA",
        reported: "4 days ago",
      },
    ],
  },
  {
    label: "Actions open",
    cards: [
      {
        ref: "INC-041",
        type: "Injury",
        description: "Strain injury — manual handling, concrete blocks",
        site: "Perth Workshop",
        severity: "Low",
        assignee: "Jo Lin",
        initials: "JL",
        reported: "1 week ago",
      },
      {
        ref: "INC-042",
        type: "Incident",
        description: "Excavation collapse — no persons in trench at time",
        site: "Brisbane Terminal",
        severity: "High",
        assignee: "Marcus Reid",
        initials: "MR",
        reported: "1 week ago",
      },
      {
        ref: "INC-043",
        type: "Near miss",
        description: "Mobile plant and pedestrian — inadequate separation",
        site: "Geelong Site",
        severity: "Medium",
        assignee: "Ruth Alvarez",
        initials: "RA",
        reported: "10 days ago",
      },
      {
        ref: "INC-040",
        type: "Hazard",
        description: "Asbestos debris uncovered during earthworks",
        site: "Melbourne Depot",
        severity: "High",
        assignee: "Alex Kerr",
        initials: "AK",
        reported: "2 weeks ago",
      },
      {
        ref: "INC-039",
        type: "Injury",
        description: "Eye injury — dust exposure, no PPE worn",
        site: "Geelong Site",
        severity: "Medium",
        assignee: "Ruth Alvarez",
        initials: "RA",
        reported: "2 weeks ago",
      },
    ],
  },
  {
    label: "Verifying",
    cards: [
      {
        ref: "INC-037",
        type: "Incident",
        description: "Electrical incident — live wire in excavation",
        site: "Sydney Yard",
        severity: "High",
        assignee: "Priya Tan",
        initials: "PT",
        reported: "3 weeks ago",
      },
    ],
  },
  {
    label: "Closed",
    cards: [
      {
        ref: "INC-036",
        type: "Near miss",
        description: "Falling tool — hammer dropped from scaffold level 2",
        site: "Melbourne Depot",
        severity: "Near miss",
        assignee: "Alex Kerr",
        initials: "AK",
        reported: "4 weeks ago",
      },
      {
        ref: "INC-035",
        type: "Injury",
        description: "Sprained ankle — uneven ground at site access",
        site: "Adelaide Depot",
        severity: "Low",
        assignee: "Sam Okafor",
        initials: "SO",
        reported: "5 weeks ago",
      },
    ],
  },
]

export function SafetyBoard() {
  return (
    <PageScrollX overflows overflowsDown>
      <div className="flex w-max items-start gap-3 p-4">
        {LANES.map((lane) => (
          <section
            className="flex w-72 shrink-0 flex-col rounded-xl border bg-card/40"
            key={lane.label}
          >
            <header className="flex shrink-0 items-center gap-2 px-3 py-2.5">
              <span
                aria-hidden
                className={cn("size-1.5 rounded-full", LANE_DOT[lane.label] ?? "bg-muted-foreground/40")}
              />
              <h2 className="text-sm font-medium">{lane.label}</h2>
              <span className="text-xs text-muted-foreground/70">{lane.cards.length}</span>
            </header>

            <div className="flex flex-col gap-2 px-2 pb-2">
              {lane.cards.map((card) => (
                <article
                  className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40 cursor-pointer"
                  key={card.ref}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground">{card.ref}</span>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        SEVERITY_TONE[card.severity],
                      )}
                    >
                      {card.severity}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm leading-snug">{card.description}</p>

                  <p className="mt-1 text-xs text-muted-foreground">{card.site}</p>

                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                      {card.initials}
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{card.assignee}</span>
                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground/60">{card.reported}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageScrollX>
  )
}
