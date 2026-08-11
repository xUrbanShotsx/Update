import { PageScrollX } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

type DefectSeverity = "Critical" | "Major" | "Minor" | "Observation"

type DefectCard = {
  ref: string
  description: string
  location: string
  trade: string
  site: string
  severity: DefectSeverity
  assignee: string
  initials: string
  raised: string
}

const SEVERITY_TONE: Record<DefectSeverity, string> = {
  Critical: "bg-red-500/15 text-red-700 dark:text-red-400",
  Major: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  Minor: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Observation: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
}

const LANE_DOT: Record<string, string> = {
  Raised: "bg-red-500",
  Assigned: "bg-amber-500",
  "In progress": "bg-blue-500",
  "Ready to verify": "bg-sky-500",
  Closed: "bg-emerald-500",
}

const LANES: { label: string; cards: DefectCard[] }[] = [
  {
    label: "Raised",
    cards: [
      {
        ref: "NCR-028",
        description: "Concrete cover insufficient — rebar visible at soffit of pier cap",
        location: "Pier 7 — underside",
        trade: "Concrete",
        site: "Brisbane Terminal",
        severity: "Critical",
        assignee: "Marcus Reid",
        initials: "MR",
        raised: "Today, 08:30",
      },
      {
        ref: "NCR-029",
        description:
          "Waterproof membrane not lapped to specification at construction joint",
        location: "Level B2 — east wall",
        trade: "Waterproofing",
        site: "Sydney Yard",
        severity: "Major",
        assignee: "Priya Tan",
        initials: "PT",
        raised: "Today, 11:15",
      },
      {
        ref: "NCR-030",
        description: "Formwork tie holes not filled prior to backfill",
        location: "Abutment A — north face",
        trade: "Concrete",
        site: "Geelong Site",
        severity: "Minor",
        assignee: "Ruth Alvarez",
        initials: "RA",
        raised: "Yesterday",
      },
    ],
  },
  {
    label: "Assigned",
    cards: [
      {
        ref: "NCR-025",
        description: "Bored pile deviation exceeds tolerance — 55mm off grid at pile 14",
        location: "Grid C4",
        trade: "Piling",
        site: "Melbourne Depot",
        severity: "Major",
        assignee: "Alex Kerr",
        initials: "AK",
        raised: "3 days ago",
      },
      {
        ref: "NCR-026",
        description: "Paint coat DFT below specification — 3 readings < 80µm",
        location: "Deck soffit — span 3",
        trade: "Painting",
        site: "Melbourne Depot",
        severity: "Minor",
        assignee: "Alex Kerr",
        initials: "AK",
        raised: "4 days ago",
      },
    ],
  },
  {
    label: "In progress",
    cards: [
      {
        ref: "NCR-022",
        description: "Subgrade compaction test failure — 91% < 95% specified",
        location: "Ch. 1+240 to 1+280",
        trade: "Earthworks",
        site: "Brisbane Terminal",
        severity: "Major",
        assignee: "Marcus Reid",
        initials: "MR",
        raised: "1 week ago",
      },
      {
        ref: "NCR-023",
        description: "Precast panel crack — 0.4mm width exceeds 0.3mm limit",
        location: "Panel P-017",
        trade: "Precast",
        site: "Adelaide Depot",
        severity: "Major",
        assignee: "Sam Okafor",
        initials: "SO",
        raised: "1 week ago",
      },
      {
        ref: "NCR-024",
        description: "Incorrect reinforcement spacing — 300mm vs 200mm specified",
        location: "Slab S12 — eastern bay",
        trade: "Steel fixing",
        site: "Perth Workshop",
        severity: "Critical",
        assignee: "Jo Lin",
        initials: "JL",
        raised: "10 days ago",
      },
    ],
  },
  {
    label: "Ready to verify",
    cards: [
      {
        ref: "NCR-020",
        description: "Backfill compaction: two lifts placed together, not separately",
        location: "Retaining wall RW-04",
        trade: "Earthworks",
        site: "Geelong Site",
        severity: "Minor",
        assignee: "Ruth Alvarez",
        initials: "RA",
        raised: "2 weeks ago",
      },
      {
        ref: "NCR-021",
        description: "Stormwater pipe bedding not granular — clay material used",
        location: "MH-09 to MH-11",
        trade: "Civil drainage",
        site: "Sydney Yard",
        severity: "Major",
        assignee: "Priya Tan",
        initials: "PT",
        raised: "2 weeks ago",
      },
    ],
  },
  {
    label: "Closed",
    cards: [
      {
        ref: "NCR-018",
        description: "Grout pad non-conformance — segregation on north face",
        location: "Bearing pad BP-03",
        trade: "Concrete",
        site: "Perth Workshop",
        severity: "Observation",
        assignee: "Jo Lin",
        initials: "JL",
        raised: "3 weeks ago",
      },
      {
        ref: "NCR-019",
        description: "Survey set-out error — offset 8mm from design centreline",
        location: "Kerb and channel Ch. 0+820",
        trade: "Survey",
        site: "Adelaide Depot",
        severity: "Minor",
        assignee: "Sam Okafor",
        initials: "SO",
        raised: "3 weeks ago",
      },
    ],
  },
]

export function DefectsBoard() {
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
                className={cn(
                  "size-1.5 rounded-full",
                  LANE_DOT[lane.label] ?? "bg-muted-foreground/40",
                )}
              />
              <h2 className="text-sm font-medium">{lane.label}</h2>
              <span className="text-xs text-muted-foreground/70">
                {lane.cards.length}
              </span>
            </header>

            <div className="flex flex-col gap-2 px-2 pb-2">
              {lane.cards.map((card) => (
                <article
                  className="cursor-pointer rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40"
                  key={card.ref}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {card.ref}
                    </span>
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

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="truncate text-xs text-muted-foreground">
                      {card.location}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground/50">
                      · {card.trade}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">{card.site}</p>

                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                      {card.initials}
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {card.assignee}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground/60">
                      {card.raised}
                    </span>
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
