import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type PayRecord = {
  classification: string
  award: string
  baseRate: string
  siteAllowance: string
  travel: string
  overtime: string
  from: string
}

const RATES: PayRecord[] = [
  {
    classification: "CW1 — Labourer",
    award: "MA000020",
    baseRate: "$1,054.20",
    siteAllowance: "$62.40",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "CW2 — Tradesperson's assistant",
    award: "MA000020",
    baseRate: "$1,078.90",
    siteAllowance: "$62.40",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "CW3 — Level 3 Construction worker",
    award: "MA000020",
    baseRate: "$1,109.70",
    siteAllowance: "$62.40",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "CW4 — Trade certificate holder",
    award: "MA000020",
    baseRate: "$1,148.60",
    siteAllowance: "$73.80",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "CW5 — Advanced trade",
    award: "MA000020",
    baseRate: "$1,193.40",
    siteAllowance: "$73.80",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "CW6 — Specialist",
    award: "MA000020",
    baseRate: "$1,241.80",
    siteAllowance: "$73.80",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "CW7 — Advanced specialist",
    award: "MA000020",
    baseRate: "$1,294.20",
    siteAllowance: "$89.10",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "CW8 — Principal specialist",
    award: "MA000020",
    baseRate: "$1,352.90",
    siteAllowance: "$89.10",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "CW9 — Master specialist",
    award: "MA000020",
    baseRate: "$1,418.50",
    siteAllowance: "$89.10",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "Leading hand (up to 5 workers)",
    award: "MA000020",
    baseRate: "$1,241.80",
    siteAllowance: "$73.80",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "Leading hand (6–10 workers)",
    award: "MA000020",
    baseRate: "$1,294.20",
    siteAllowance: "$73.80",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
  {
    classification: "Site supervisor",
    award: "MA000020",
    baseRate: "$1,502.30",
    siteAllowance: "$102.60",
    travel: "$18.30/day",
    overtime: "1.5x / 2x",
    from: "1 Jul 2025",
  },
]

export function AwardRates() {
  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={1} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Classifications", value: RATES.length, tone: "" },
            { label: "Award", value: "MA000020", tone: "" },
            { label: "Effective from", value: "1 Jul 2025", tone: "" },
            {
              label: "Next review",
              value: "1 Jul 2026",
              tone: "text-amber-600 dark:text-amber-400",
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
          <div className="flex items-center gap-2 border-b px-4 py-2.5">
            <p className="text-xs font-medium text-muted-foreground">
              Building and Construction General On-site Award 2020
            </p>
            <span className="rounded bg-fill px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              MA000020
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Classification</th>
                  <th className="px-4 py-2.5 font-medium">Award</th>
                  <th className="px-4 py-2.5 font-medium text-right">
                    Base rate (weekly)
                  </th>
                  <th className="px-4 py-2.5 font-medium text-right">Site allowance</th>
                  <th className="px-4 py-2.5 font-medium">Travel</th>
                  <th className="px-4 py-2.5 font-medium">Overtime</th>
                  <th className="px-4 py-2.5 font-medium">From</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {RATES.map((r, i) => (
                  <tr className="hover:bg-accent/40 transition-colors" key={i}>
                    <td className="px-4 py-2.5 text-sm font-medium">
                      {r.classification}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-fill px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                        {r.award}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-sm">
                      {r.baseRate}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-xs text-muted-foreground">
                      {r.siteAllowance}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.travel}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.overtime}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.from}
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
