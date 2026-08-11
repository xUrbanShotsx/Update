import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type MedicalType = "Pre-employment" | "Periodic" | "D&A" | "Fitness for duty"
type Outcome = "Fit" | "Fit with restrictions" | "Unfit"

type Medical = {
  person: string
  initials: string
  type: MedicalType
  provider: string
  assessed: string
  outcome: Outcome
  restrictions: string
  nextDue: string
}

const OUTCOME_TONE: Record<Outcome, string> = {
  Fit: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Fit with restrictions": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Unfit: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const TYPE_TONE: Record<MedicalType, string> = {
  "Pre-employment": "bg-fill text-foreground",
  Periodic: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  "D&A": "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  "Fitness for duty": "bg-orange-500/15 text-orange-700 dark:text-orange-400",
}

const MEDICALS: Medical[] = [
  {
    person: "Marcus Reid",
    initials: "MR",
    type: "Periodic",
    provider: "Robina Occupational Health",
    assessed: "3 Mar 2026",
    outcome: "Fit",
    restrictions: "None",
    nextDue: "3 Mar 2027",
  },
  {
    person: "Dean Cartwright",
    initials: "DC",
    type: "Pre-employment",
    provider: "WorkSafe Medical Brisbane",
    assessed: "20 Jul 2023",
    outcome: "Fit",
    restrictions: "None",
    nextDue: "20 Jul 2026",
  },
  {
    person: "Kyle Osman",
    initials: "KO",
    type: "Fitness for duty",
    provider: "Sonic HealthPlus Geelong",
    assessed: "5 Mar 2026",
    outcome: "Fit with restrictions",
    restrictions: "No heavy lifting >15 kg",
    nextDue: "5 Sep 2026",
  },
  {
    person: "Janelle Park",
    initials: "JP",
    type: "Periodic",
    provider: "Occupational Medical Services Melbourne",
    assessed: "10 Mar 2026",
    outcome: "Fit with restrictions",
    restrictions: "Avoid confined spaces — pending review",
    nextDue: "10 Sep 2026",
  },
  {
    person: "Troy Baxter",
    initials: "TB",
    type: "D&A",
    provider: "WorkSafe Medical Brisbane",
    assessed: "14 Jul 2026",
    outcome: "Fit",
    restrictions: "None",
    nextDue: "14 Jul 2027",
  },
  {
    person: "Renee Stafford",
    initials: "RS",
    type: "Pre-employment",
    provider: "Sonic HealthPlus Sydney",
    assessed: "1 Mar 2025",
    outcome: "Fit",
    restrictions: "None",
    nextDue: "1 Mar 2027",
  },
  {
    person: "Sam Okafor",
    initials: "SO",
    type: "D&A",
    provider: "National Occupational Health Adelaide",
    assessed: "2 Jun 2026",
    outcome: "Fit",
    restrictions: "None",
    nextDue: "2 Jun 2027",
  },
  {
    person: "Brendan Walsh",
    initials: "BW",
    type: "Periodic",
    provider: "Sonic HealthPlus Newcastle",
    assessed: "17 Feb 2026",
    outcome: "Fit",
    restrictions: "None",
    nextDue: "17 Feb 2028",
  },
  {
    person: "Nathan Holloway",
    initials: "NH",
    type: "Pre-employment",
    provider: "WorkSafe Medical Brisbane",
    assessed: "3 May 2025",
    outcome: "Fit",
    restrictions: "None",
    nextDue: "3 May 2027",
  },
  {
    person: "Kylie Brennan",
    initials: "KB",
    type: "Fitness for duty",
    provider: "Occupational Medical Services Melbourne",
    assessed: "12 Aug 2026",
    outcome: "Unfit",
    restrictions: "Cleared for desk duties only — follow-up 4 wks",
    nextDue: "9 Sep 2026",
  },
]

export function MedicalsTable() {
  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={2} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total records", value: MEDICALS.length, tone: "" },
            {
              label: "Fit",
              value: MEDICALS.filter((m) => m.outcome === "Fit").length,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Fit with restrictions",
              value: MEDICALS.filter((m) => m.outcome === "Fit with restrictions").length,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Unfit",
              value: MEDICALS.filter((m) => m.outcome === "Unfit").length,
              tone: "text-red-600 dark:text-red-400",
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
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Provider</th>
                  <th className="px-4 py-2.5 font-medium">Assessed</th>
                  <th className="px-4 py-2.5 font-medium">Outcome</th>
                  <th className="px-4 py-2.5 font-medium">Restrictions</th>
                  <th className="px-4 py-2.5 font-medium">Next due</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {MEDICALS.map((m, i) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      m.outcome === "Unfit" && "opacity-70",
                    )}
                    key={i}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[10px] font-medium">
                          {m.initials}
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium">
                          {m.person}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          TYPE_TONE[m.type],
                        )}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground max-w-[200px] truncate">
                      {m.provider}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {m.assessed}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          OUTCOME_TONE[m.outcome],
                        )}
                      >
                        {m.outcome}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground max-w-[220px]">
                      <span className="line-clamp-2">{m.restrictions}</span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {m.nextDue}
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
