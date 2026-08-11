import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type LeaveType = "Annual" | "Personal" | "Long service" | "RDO" | "TOIL"
type LeaveStatus = "Approved" | "Pending" | "Declined"

type LeaveRequest = {
  person: string
  initials: string
  type: LeaveType
  from: string
  to: string
  days: number
  balance: number
  approver: string
  status: LeaveStatus
}

const STATUS_TONE: Record<LeaveStatus, string> = {
  Approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Declined: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const TYPE_TONE: Record<LeaveType, string> = {
  Annual: "bg-fill text-foreground",
  Personal: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  "Long service": "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  RDO: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  TOIL: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
}

const REQUESTS: LeaveRequest[] = [
  {
    person: "Troy Baxter",
    initials: "TB",
    type: "Annual",
    from: "18 Aug 2026",
    to: "22 Aug 2026",
    days: 5,
    balance: 14.5,
    approver: "Marcus Reid",
    status: "Approved",
  },
  {
    person: "Kylie Brennan",
    initials: "KB",
    type: "Personal",
    from: "11 Aug 2026",
    to: "12 Aug 2026",
    days: 2,
    balance: 8.0,
    approver: "Alex Kerr",
    status: "Approved",
  },
  {
    person: "Renee Stafford",
    initials: "RS",
    type: "Annual",
    from: "25 Aug 2026",
    to: "5 Sep 2026",
    days: 10,
    balance: 6.5,
    approver: "Priya Tan",
    status: "Pending",
  },
  {
    person: "Sam Okafor",
    initials: "SO",
    type: "RDO",
    from: "15 Aug 2026",
    to: "15 Aug 2026",
    days: 1,
    balance: 3.0,
    approver: "Ruth Alvarez",
    status: "Approved",
  },
  {
    person: "Dean Cartwright",
    initials: "DC",
    type: "Annual",
    from: "1 Sep 2026",
    to: "12 Sep 2026",
    days: 10,
    balance: 21.0,
    approver: "Marcus Reid",
    status: "Pending",
  },
  {
    person: "Darren Soo",
    initials: "DS",
    type: "TOIL",
    from: "13 Aug 2026",
    to: "13 Aug 2026",
    days: 1,
    balance: 4.5,
    approver: "Jo Lin",
    status: "Approved",
  },
  {
    person: "Nathan Holloway",
    initials: "NH",
    type: "Personal",
    from: "11 Aug 2026",
    to: "11 Aug 2026",
    days: 1,
    balance: 10.0,
    approver: "Ruth Alvarez",
    status: "Declined",
  },
  {
    person: "Grace O'Brien",
    initials: "GO",
    type: "Annual",
    from: "8 Sep 2026",
    to: "19 Sep 2026",
    days: 10,
    balance: 18.0,
    approver: "Marcus Reid",
    status: "Approved",
  },
  {
    person: "Monique Carter",
    initials: "MC",
    type: "Long service",
    from: "29 Sep 2026",
    to: "17 Oct 2026",
    days: 15,
    balance: 42.0,
    approver: "Marcus Reid",
    status: "Approved",
  },
  {
    person: "Jo Lin",
    initials: "JL",
    type: "RDO",
    from: "22 Aug 2026",
    to: "22 Aug 2026",
    days: 1,
    balance: 2.0,
    approver: "Ruth Alvarez",
    status: "Approved",
  },
  {
    person: "Isaac Tamboli",
    initials: "IT",
    type: "Personal",
    from: "14 Aug 2026",
    to: "14 Aug 2026",
    days: 1,
    balance: 7.5,
    approver: "Marcus Reid",
    status: "Pending",
  },
  {
    person: "Chloe Fitzpatrick",
    initials: "CF",
    type: "Annual",
    from: "6 Oct 2026",
    to: "16 Oct 2026",
    days: 9,
    balance: 11.0,
    approver: "Marcus Reid",
    status: "Approved",
  },
]

export function LeaveRequests() {
  const pending = REQUESTS.filter((r) => r.status === "Pending").length
  const approved = REQUESTS.filter((r) => r.status === "Approved").length
  const declined = REQUESTS.filter((r) => r.status === "Declined").length
  // people on leave now (11 Aug 2026)
  const onLeaveNow = 2

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={2} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Pending",
              value: pending,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Approved",
              value: approved,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Declined",
              value: declined,
              tone: "text-red-600 dark:text-red-400",
            },
            {
              label: "On leave now",
              value: onLeaveNow,
              tone: "text-sky-600 dark:text-sky-400",
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
                  <th className="px-4 py-2.5 font-medium">From</th>
                  <th className="px-4 py-2.5 font-medium">To</th>
                  <th className="px-4 py-2.5 font-medium text-right">Days</th>
                  <th className="px-4 py-2.5 font-medium text-right">Balance</th>
                  <th className="px-4 py-2.5 font-medium">Approver</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {REQUESTS.map((r, i) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      r.status === "Declined" && "opacity-60",
                    )}
                    key={i}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[10px] font-medium">
                          {r.initials}
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium">
                          {r.person}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          TYPE_TONE[r.type],
                        )}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.from}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.to}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs tabular-nums">
                      {r.days}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs tabular-nums text-muted-foreground">
                      {r.balance}d
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.approver}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[r.status],
                        )}
                      >
                        {r.status}
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
