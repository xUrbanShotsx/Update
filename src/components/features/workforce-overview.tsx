import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"
import type { Domain, Org } from "@/lib/scope"

type Props = { domain: Domain; org: Org }

const SITES = [
  { name: "Brisbane Terminal", crew: 22, inducted: 100, expiring: 1 },
  { name: "Sydney Yard", crew: 18, inducted: 94, expiring: 2 },
  { name: "Geelong Site", crew: 14, inducted: 93, expiring: 2 },
  { name: "Melbourne Depot", crew: 12, inducted: 92, expiring: 1 },
  { name: "Perth Workshop", crew: 9, inducted: 89, expiring: 1 },
  { name: "Adelaide Depot", crew: 8, inducted: 88, expiring: 0 },
  { name: "Newcastle Yard", crew: 6, inducted: 100, expiring: 0 },
]

const EXPIRIES = [
  {
    name: "Dean Cartwright",
    initials: "DC",
    ticket: "HRW Forklift",
    expires: "19 Aug 2026",
  },
  {
    name: "Melissa Nguyen",
    initials: "MN",
    ticket: "Working at Heights",
    expires: "24 Aug 2026",
  },
  {
    name: "Troy Baxter",
    initials: "TB",
    ticket: "First Aid (HLTAID011)",
    expires: "1 Sep 2026",
  },
  {
    name: "Renee Stafford",
    initials: "RS",
    ticket: "Traffic Control",
    expires: "8 Sep 2026",
  },
  { name: "Kyle Osman", initials: "KO", ticket: "EWP over 11m", expires: "15 Sep 2026" },
  {
    name: "Janelle Park",
    initials: "JP",
    ticket: "Confined Space Entry",
    expires: "28 Sep 2026",
  },
]

const ONBOARDING = [
  {
    name: "Aiden Rossi",
    initials: "AR",
    role: "Concretor",
    site: "Brisbane Terminal",
    started: "4 Aug 2026",
  },
  {
    name: "Fatima Al-Rashid",
    initials: "FA",
    role: "Traffic Controller",
    site: "Sydney Yard",
    started: "5 Aug 2026",
  },
  {
    name: "Lachlan Murray",
    initials: "LM",
    role: "Steel Fixer",
    site: "Geelong Site",
    started: "7 Aug 2026",
  },
  {
    name: "Sophia Petrakis",
    initials: "SP",
    role: "Site Administrator",
    site: "Brisbane Terminal",
    started: "11 Aug 2026",
  },
]

const TRADES = [
  { trade: "Other", count: 29 },
  { trade: "Concreters", count: 18 },
  { trade: "Earthworks", count: 14 },
  { trade: "Steel fixers", count: 11 },
  { trade: "Traffic control", count: 9 },
  { trade: "Supervision", count: 8 },
]

const BAR_MAX = 29

export function WorkforceOverview(_props: Props) {
  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={2} />

        {/* KPI strip */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total workforce", value: "89", tone: "" },
            {
              label: "Expiring tickets (30d)",
              value: "7",
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Induction coverage",
              value: "94%",
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            { label: "Turnover YTD", value: "8%", tone: "text-muted-foreground" },
          ].map((stat) => (
            <div className="rounded-xl border bg-card px-4 py-3" key={stat.label}>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("mt-1 text-xl font-semibold tabular-nums", stat.tone)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {/* Workforce by site */}
          <div className="col-span-2 overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                Workforce by site
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Site</th>
                    <th className="px-4 py-2.5 font-medium text-right">Crew</th>
                    <th className="px-4 py-2.5 font-medium text-right">Inducted</th>
                    <th className="px-4 py-2.5 font-medium text-right">Expiring</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {SITES.map((s) => (
                    <tr className="hover:bg-accent/40 transition-colors" key={s.name}>
                      <td className="px-4 py-2.5 text-sm">{s.name}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-xs">
                        {s.crew}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span
                          className={cn(
                            "text-xs font-medium tabular-nums",
                            s.inducted === 100
                              ? "text-emerald-600 dark:text-emerald-400"
                              : s.inducted >= 90
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-red-600 dark:text-red-400",
                          )}
                        >
                          {s.inducted}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span
                          className={cn(
                            "text-xs tabular-nums",
                            s.expiring > 0
                              ? "text-amber-600 dark:text-amber-400 font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          {s.expiring}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Headcount by trade */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                Headcount by trade
              </p>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              {TRADES.map((t) => (
                <div key={t.trade}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{t.trade}</span>
                    <span className="font-medium tabular-nums">{t.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-fill">
                    <div
                      className="h-1.5 rounded-full bg-primary/60"
                      style={{ width: `${(t.count / BAR_MAX) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* Upcoming expiries */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                Upcoming expiries (90 days)
              </p>
            </div>
            <div className="divide-y">
              {EXPIRIES.map((e) => (
                <div className="flex items-center gap-3 px-4 py-2.5" key={e.name}>
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[10px] font-medium">
                    {e.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{e.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {e.ticket}
                    </p>
                  </div>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 whitespace-nowrap font-medium">
                    {e.expires}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent onboarding */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                Recent onboarding
              </p>
            </div>
            <div className="divide-y">
              {ONBOARDING.map((w) => (
                <div className="flex items-center gap-3 px-4 py-2.5" key={w.name}>
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[10px] font-medium">
                    {w.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{w.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {w.role} · {w.site}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {w.started}
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
