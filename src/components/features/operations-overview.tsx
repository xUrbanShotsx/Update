import { Frame } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { type Domain, type Org } from "@/lib/scope"
import { cn } from "@/lib/utils"

const PROJECT_PIPELINE = [
  { label: "Tendered", count: 1, tone: "bg-fill text-muted-foreground" },
  { label: "Awarded", count: 1, tone: "bg-sky-500/15 text-sky-700 dark:text-sky-400" },
  {
    label: "Mobilising",
    count: 1,
    tone: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  {
    label: "On site",
    count: 5,
    tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  {
    label: "PC",
    count: 1,
    tone: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  },
  { label: "Closed", count: 1, tone: "bg-fill-strong text-muted-foreground" },
]

const SITE_PROGRESS = [
  {
    site: "Parramatta Interchange",
    activeProjects: 2,
    openNcrs: 3,
    crew: 18,
    lastDiary: "Today, 17:30",
    diaryStatus: "submitted",
  },
  {
    site: "Chatswood Rail Upgrade",
    activeProjects: 1,
    openNcrs: 0,
    crew: 12,
    lastDiary: "Today, 16:45",
    diaryStatus: "submitted",
  },
  {
    site: "Bankstown Substation",
    activeProjects: 1,
    openNcrs: 2,
    crew: 9,
    lastDiary: "Today, 15:00",
    diaryStatus: "submitted",
  },
  {
    site: "Homebush Drainage",
    activeProjects: 1,
    openNcrs: 4,
    crew: 6,
    lastDiary: "Yesterday, 17:00",
    diaryStatus: "submitted",
  },
  {
    site: "Oran Park Civils",
    activeProjects: 2,
    openNcrs: 2,
    crew: 11,
    lastDiary: "Today, 18:00",
    diaryStatus: "submitted",
  },
  {
    site: "Rouse Hill Water Main",
    activeProjects: 1,
    openNcrs: 1,
    crew: 8,
    lastDiary: "Not submitted",
    diaryStatus: "overdue",
  },
]

const RECENT_ACTIVITY = [
  {
    text: "Site diary submitted: Parramatta Interchange — Day 142",
    meta: "Parramatta Interchange · 2h ago",
    tone: "green",
  },
  {
    text: "NCR raised: Concrete pour strength result below spec — NCR-088",
    meta: "Bankstown Substation · 3h ago",
    tone: "amber",
  },
  {
    text: "Delivery arrived: 32t reinforcement steel — DLV-214",
    meta: "Oran Park Civils · Gate 2 · 4h ago",
    tone: "muted",
  },
  {
    text: "Timesheet approved: Week ending 8 Aug — 12 workers",
    meta: "Homebush Drainage · Yesterday",
    tone: "green",
  },
  {
    text: "SWMS issued: Working in Confined Space — Rev 2",
    meta: "Rouse Hill Water Main · Yesterday",
    tone: "muted",
  },
]

const DELAYS = [
  {
    site: "Parramatta Interchange",
    description: "Crane delayed — operator licence renewal pending",
    rootCause: "Resource",
    impact: "0.5d",
  },
  {
    site: "Rouse Hill Water Main",
    description: "Utility location conflict — Water NSW hold on trench zone",
    rootCause: "Third party",
    impact: "2d",
  },
  {
    site: "Homebush Drainage",
    description: "Concrete pour postponed — adverse weather forecast",
    rootCause: "Weather",
    impact: "1d",
  },
]

const ROOT_CAUSE_TONE: Record<string, string> = {
  Resource: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "Third party": "bg-red-500/15 text-red-700 dark:text-red-400",
  Weather: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
}

export function OperationsOverview({
  domain: _domain,
  org: _org,
}: {
  readonly domain: Domain
  readonly org: Org
}) {
  return (
    <PageScroll overflows>
      <Frame>
        {/* ── KPI strip ──────────────────────────────────────────────────── */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="truncate text-xs text-muted-foreground">Active projects</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">8</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="block size-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Across 6 active sites</span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="truncate text-xs text-muted-foreground">Open defects</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              12
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="block size-1.5 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">
                3 overdue for close-out
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="truncate text-xs text-muted-foreground">
              Workers on site today
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">47</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="block size-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">
                All inducted and signed on
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="truncate text-xs text-muted-foreground">Diary completion</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              <span className="text-emerald-600 dark:text-emerald-400">5</span>
              <span className="text-base font-normal text-muted-foreground">
                /6 sites
              </span>
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="block size-1.5 rounded-full bg-red-500" />
              <span className="text-xs text-muted-foreground">
                Rouse Hill not yet submitted
              </span>
            </div>
          </div>
        </div>

        {/* ── Project pipeline ───────────────────────────────────────────── */}
        <div className="mt-2 rounded-xl border bg-card p-4">
          <h3 className="text-sm font-medium">Project pipeline</h3>
          <div className="mt-3 flex items-stretch gap-1">
            {PROJECT_PIPELINE.map((stage, i) => (
              <div key={stage.label} className="flex min-w-0 flex-1 items-center gap-1">
                <div
                  className={cn(
                    "flex min-w-0 flex-1 flex-col rounded-lg px-3 py-2.5",
                    stage.tone,
                  )}
                >
                  <span className="text-lg font-semibold tabular-nums leading-none">
                    {stage.count}
                  </span>
                  <span className="mt-1 truncate text-xs opacity-80">{stage.label}</span>
                </div>
                {i < PROJECT_PIPELINE.length - 1 && (
                  <span className="shrink-0 text-xs text-muted-foreground/40">›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Site progress table ────────────────────────────────────────── */}
        <div className="mt-2 overflow-hidden rounded-xl border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-medium">Site progress</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium text-right">Active projects</th>
                  <th className="px-4 py-2.5 font-medium text-right">Open NCRs</th>
                  <th className="px-4 py-2.5 font-medium text-right">Crew</th>
                  <th className="px-4 py-2.5 font-medium">Last diary</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {SITE_PROGRESS.map((row) => (
                  <tr className="hover:bg-accent/40 transition-colors" key={row.site}>
                    <td className="px-4 py-2.5 font-medium">{row.site}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {row.activeProjects}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      <span
                        className={cn(
                          "tabular-nums",
                          row.openNcrs > 0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {row.openNcrs}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {row.crew}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={cn(
                          "text-xs",
                          row.diaryStatus === "overdue"
                            ? "text-red-600 dark:text-red-400 font-medium"
                            : "text-muted-foreground",
                        )}
                      >
                        {row.lastDiary}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent activity + Delays ───────────────────────────────────── */}
        <div className="mt-2 grid gap-2 lg:grid-cols-2">
          {/* Activity feed */}
          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recent activity
            </h3>
            <div className="mt-3 ml-3 flex flex-col gap-3 border-l pl-6">
              {RECENT_ACTIVITY.map((item, i) => (
                <article className="relative" key={i}>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1.5 -left-[1.9rem] size-2.5 rounded-full border-2 border-card",
                      item.tone === "green"
                        ? "bg-emerald-500"
                        : item.tone === "amber"
                          ? "bg-amber-500"
                          : "bg-fill-strong",
                    )}
                  />
                  <p className="text-sm leading-snug">{item.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Delays panel */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Active delays</h3>
            </div>
            <div className="divide-y">
              {DELAYS.map((delay) => (
                <div className="flex items-start gap-3 px-4 py-3" key={delay.site}>
                  <span
                    className={cn(
                      "mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                      ROOT_CAUSE_TONE[delay.rootCause] ?? "bg-fill text-muted-foreground",
                    )}
                  >
                    {delay.rootCause}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug">
                      {delay.description}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {delay.site}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-medium text-amber-600 dark:text-amber-400">
                    {delay.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
