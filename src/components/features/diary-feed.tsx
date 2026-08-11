import { PageScroll } from "@/components/shared/page-scroll"
import { Frame } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type DiaryStatus = "Submitted" | "Draft"
type Weather = "Sunny" | "Cloudy" | "Rain"

type DiaryEntry = {
  site: string
  date: string
  supervisor: string
  initials: string
  weather: Weather
  crew: number
  workDone: string
  delays?: string
  status: DiaryStatus
}

const STATUS_TONE: Record<DiaryStatus, string> = {
  Submitted: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Draft: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

const STATUS_BORDER: Record<DiaryStatus, string> = {
  Submitted: "border-emerald-500",
  Draft: "border-amber-500",
}

const WEATHER_TONE: Record<Weather, string> = {
  Sunny: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Cloudy: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  Rain: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
}

const WEATHER_ICON: Record<Weather, string> = {
  Sunny: "☀",
  Cloudy: "⛅",
  Rain: "🌧",
}

const DIARY_ENTRIES: DiaryEntry[] = [
  {
    site: "Parramatta Interchange",
    date: "Mon 11 Aug 2026",
    supervisor: "Dean Kowalski",
    initials: "DK",
    weather: "Sunny",
    crew: 18,
    workDone:
      "Continued formwork installation to pier cap P4, completing the soffit panel and chamfer strips ready for pour. Reo gang commenced bar fixing to east wall of U4 structure, achieving 40% completion by end of shift.",
    delays:
      "Concrete pump mobilisation delayed 45 minutes — traffic congestion on James Ruse Drive.",
    status: "Submitted",
  },
  {
    site: "Chatswood Rail Upgrade",
    date: "Mon 11 Aug 2026",
    supervisor: "Sharon Nguyen",
    initials: "SN",
    weather: "Cloudy",
    crew: 12,
    workDone:
      "Structural steel erection to Level 2 deck progressed — 4 UB610 beams lifted and bolted in grid B–D. Temporary works removed from Bay 3 following approval of as-built drawings.",
    status: "Submitted",
  },
  {
    site: "Bankstown Substation",
    date: "Mon 11 Aug 2026",
    supervisor: "Grace Park",
    initials: "GP",
    weather: "Sunny",
    crew: 9,
    workDone:
      "Cable tray installation continued in MV switchroom — Zones 2 and 3 fully complete. Electricians commenced conduit threading to transformer bays; earth bonding connections tested and accepted by the superintendent.",
    delays: "Power outage to welfare block for 2 hours — generator deployed at 10:30.",
    status: "Submitted",
  },
  {
    site: "Homebush Drainage",
    date: "Sun 10 Aug 2026",
    supervisor: "Lisa Ferraro",
    initials: "LF",
    weather: "Rain",
    crew: 6,
    workDone:
      "Excavation for stormwater pit 6 completed to design depth RL 8.45m AHD and shaped to drawing. Works suspended at 13:00 due to persistent rain and standing water in trench; pump installed to dewater overnight.",
    delays: "Adverse weather — afternoon session lost. Estimated 1-day programme impact.",
    status: "Submitted",
  },
  {
    site: "Oran Park Civils",
    date: "Mon 11 Aug 2026",
    supervisor: "Amy Blackwood",
    initials: "AB",
    weather: "Sunny",
    crew: 11,
    workDone:
      "Sub-base compaction completed to road pavement Zone 3 (Sta 1+200 to 1+450). DCP testing passed at all test locations. Dozer commenced rough trim of Zone 4 fill in preparation for sub-base import scheduled Wednesday.",
    status: "Submitted",
  },
  {
    site: "Rouse Hill Water Main",
    date: "Mon 11 Aug 2026",
    supervisor: "Pete Zahariadis",
    initials: "PZ",
    weather: "Cloudy",
    crew: 8,
    workDone:
      "DN300 HDPE pipe laying commenced at chainage 0+050 following successful pressure testing of the previously laid section. Trench preparation for the crossing at Rouse Hill Drive is ongoing pending utility location clearance.",
    status: "Draft",
  },
]

export function DiaryFeed() {
  return (
    <PageScroll overflows>
      <Frame>
        <div className="flex flex-col gap-3">
          {DIARY_ENTRIES.map((entry) => (
            <article
              className={cn(
                "overflow-hidden rounded-xl border bg-card border-l-4",
                STATUS_BORDER[entry.status],
              )}
              key={entry.site}
            >
              <div className="px-5 py-4">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{entry.site}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{entry.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        WEATHER_TONE[entry.weather],
                      )}
                    >
                      {WEATHER_ICON[entry.weather]} {entry.weather}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        STATUS_TONE[entry.status],
                      )}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>

                {/* Supervisor + crew */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                      {entry.initials}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {entry.supervisor}
                    </span>
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground">
                    {entry.crew} crew on site
                  </span>
                </div>

                {/* Work done */}
                <p className="mt-3 text-sm leading-relaxed">{entry.workDone}</p>

                {/* Delays */}
                {entry.delays && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2.5">
                    <span className="mt-px shrink-0 text-[10px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                      Delay
                    </span>
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      {entry.delays}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </Frame>
    </PageScroll>
  )
}
