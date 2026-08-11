import { Frame, Toolbar } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

type ClaimStatus = "Submitted" | "Certified" | "Paid" | "Disputed"

type Claim = {
  ref: string
  project: string
  client: string
  period: string
  submitted: string
  certified: string
  paid: "Yes" | "No"
  status: ClaimStatus
}

const STATUS_TONE: Record<ClaimStatus, string> = {
  Submitted: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Certified: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Disputed: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const CLAIMS: Claim[] = [
  {
    ref: "PC-001",
    project: "Parramatta Interchange",
    client: "Transport for NSW",
    period: "Oct 2025",
    submitted: "5 Nov 2025",
    certified: "$1,840,000",
    paid: "Yes",
    status: "Paid",
  },
  {
    ref: "PC-002",
    project: "Parramatta Interchange",
    client: "Transport for NSW",
    period: "Nov 2025",
    submitted: "5 Dec 2025",
    certified: "$2,120,000",
    paid: "Yes",
    status: "Paid",
  },
  {
    ref: "PC-003",
    project: "Chatswood Rail Upgrade",
    client: "Sydney Metro",
    period: "Nov 2025",
    submitted: "3 Dec 2025",
    certified: "$980,000",
    paid: "Yes",
    status: "Paid",
  },
  {
    ref: "PC-004",
    project: "Parramatta Interchange",
    client: "Transport for NSW",
    period: "Dec 2025",
    submitted: "7 Jan 2026",
    certified: "$2,340,000",
    paid: "Yes",
    status: "Paid",
  },
  {
    ref: "PC-005",
    project: "Bankstown Substation",
    client: "Ausgrid",
    period: "Jan 2026",
    submitted: "4 Feb 2026",
    certified: "$760,000",
    paid: "Yes",
    status: "Paid",
  },
  {
    ref: "PC-006",
    project: "Homebush Drainage",
    client: "City of Canterbury-Bankstown",
    period: "Apr 2026",
    submitted: "6 May 2026",
    certified: "$1,180,000",
    paid: "Yes",
    status: "Paid",
  },
  {
    ref: "PC-007",
    project: "Oran Park Civils",
    client: "Lendlease Communities",
    period: "Jul 2026",
    submitted: "4 Aug 2026",
    certified: "$2,060,000",
    paid: "No",
    status: "Disputed",
  },
  {
    ref: "PC-008",
    project: "Rouse Hill Water Main",
    client: "Sydney Water",
    period: "Jul 2026",
    submitted: "5 Aug 2026",
    certified: "—",
    paid: "No",
    status: "Submitted",
  },
]

export function ClaimsRegister() {
  const submittedThisMonth = CLAIMS.filter((c) => c.status === "Submitted").length
  const disputed = CLAIMS.filter((c) => c.status === "Disputed").length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        {/* Stat strip */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Submitted this month",
              value: submittedThisMonth,
              tone: "text-sky-600 dark:text-sky-400",
            },
            {
              label: "Certified (total)",
              value: "$4.2M",
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Paid (total)",
              value: "$12.8M",
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Disputed",
              value: disputed,
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
                  <th className="px-4 py-2.5 font-medium">Claim</th>
                  <th className="px-4 py-2.5 font-medium">Project</th>
                  <th className="px-4 py-2.5 font-medium">Client</th>
                  <th className="px-4 py-2.5 font-medium">Period</th>
                  <th className="px-4 py-2.5 font-medium">Submitted</th>
                  <th className="px-4 py-2.5 font-medium text-right">Certified</th>
                  <th className="px-4 py-2.5 font-medium">Paid</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {CLAIMS.map((claim) => (
                  <tr className="hover:bg-accent/40 transition-colors" key={claim.ref}>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {claim.ref}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-medium text-sm">
                      {claim.project}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {claim.client}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                      {claim.period}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {claim.submitted}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs tabular-nums font-medium whitespace-nowrap">
                      {claim.certified}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      <span
                        className={cn(
                          "font-medium",
                          claim.paid === "Yes"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {claim.paid}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[claim.status],
                        )}
                      >
                        {claim.status}
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
