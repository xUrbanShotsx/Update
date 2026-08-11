import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type TicketStatus = "Current" | "Expiring" | "Expired"

type Ticket = {
  person: string
  initials: string
  ticket: string
  number: string
  ticketClass: string
  issued: string
  expires: string
  status: TicketStatus
}

const STATUS_TONE: Record<TicketStatus, string> = {
  Current: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Expiring: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Expired: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const TICKETS: Ticket[] = [
  {
    person: "Marcus Reid",
    initials: "MR",
    ticket: "White Card",
    number: "QLD-WC-1194832",
    ticketClass: "—",
    issued: "12 Feb 2018",
    expires: "No expiry",
    status: "Current",
  },
  {
    person: "Dean Cartwright",
    initials: "DC",
    ticket: "HRW Forklift",
    number: "QLD-HRW-0823741",
    ticketClass: "LF",
    issued: "15 Mar 2022",
    expires: "15 Mar 2027",
    status: "Current",
  },
  {
    person: "Melissa Nguyen",
    initials: "MN",
    ticket: "Traffic Control",
    number: "NSW-TC-4410293",
    ticketClass: "TC",
    issued: "6 Feb 2024",
    expires: "6 Feb 2027",
    status: "Current",
  },
  {
    person: "Troy Baxter",
    initials: "TB",
    ticket: "First Aid",
    number: "HLTAID011-0039274",
    ticketClass: "HLTAID011",
    issued: "1 Sep 2023",
    expires: "1 Sep 2026",
    status: "Expiring",
  },
  {
    person: "Janelle Park",
    initials: "JP",
    ticket: "Confined Space",
    number: "QLD-CS-0174829",
    ticketClass: "—",
    issued: "10 Sep 2022",
    expires: "10 Sep 2025",
    status: "Expired",
  },
  {
    person: "Kyle Osman",
    initials: "KO",
    ticket: "EWP over 11m",
    number: "QLD-HRW-0991023",
    ticketClass: "WP",
    issued: "18 Nov 2022",
    expires: "18 Nov 2025",
    status: "Expired",
  },
  {
    person: "Renee Stafford",
    initials: "RS",
    ticket: "Traffic Control",
    number: "NSW-TC-5501842",
    ticketClass: "TC",
    issued: "3 Mar 2024",
    expires: "3 Mar 2027",
    status: "Current",
  },
  {
    person: "Lachlan Murray",
    initials: "LM",
    ticket: "HRW Dogging",
    number: "NSW-HRW-0772618",
    ticketClass: "DG",
    issued: "7 Aug 2024",
    expires: "7 Aug 2027",
    status: "Current",
  },
  {
    person: "Alex Kerr",
    initials: "AK",
    ticket: "White Card",
    number: "VIC-WC-2209471",
    ticketClass: "—",
    issued: "5 Jan 2015",
    expires: "No expiry",
    status: "Current",
  },
  {
    person: "Jo Lin",
    initials: "JL",
    ticket: "Working at Heights",
    number: "WA-WAH-0334521",
    ticketClass: "—",
    issued: "21 Oct 2022",
    expires: "21 Oct 2025",
    status: "Expiring",
  },
  {
    person: "Sam Okafor",
    initials: "SO",
    ticket: "HRW Forklift",
    number: "SA-HRW-0182739",
    ticketClass: "LF",
    issued: "2 Jan 2023",
    expires: "2 Jan 2028",
    status: "Current",
  },
  {
    person: "Chloe Fitzpatrick",
    initials: "CF",
    ticket: "White Card",
    number: "QLD-WC-3301847",
    ticketClass: "—",
    issued: "8 Aug 2021",
    expires: "No expiry",
    status: "Current",
  },
  {
    person: "Brendan Walsh",
    initials: "BW",
    ticket: "HRW Dogging",
    number: "NSW-HRW-0412894",
    ticketClass: "DG",
    issued: "17 Feb 2023",
    expires: "17 Feb 2026",
    status: "Current",
  },
  {
    person: "Kylie Brennan",
    initials: "KB",
    ticket: "Working at Heights",
    number: "NSW-WAH-0890123",
    ticketClass: "—",
    issued: "7 Jul 2023",
    expires: "7 Oct 2025",
    status: "Expiring",
  },
  {
    person: "Nathan Holloway",
    initials: "NH",
    ticket: "First Aid",
    number: "HLTAID011-0049832",
    ticketClass: "HLTAID011",
    issued: "5 May 2024",
    expires: "5 May 2027",
    status: "Current",
  },
  {
    person: "Grace O'Brien",
    initials: "GO",
    ticket: "Confined Space",
    number: "NSW-CS-0228741",
    ticketClass: "—",
    issued: "12 Mar 2023",
    expires: "12 Mar 2026",
    status: "Current",
  },
  {
    person: "Isaac Tamboli",
    initials: "IT",
    ticket: "HRW Forklift",
    number: "QLD-HRW-1102938",
    ticketClass: "LF",
    issued: "29 Apr 2024",
    expires: "29 Apr 2029",
    status: "Current",
  },
  {
    person: "Darren Soo",
    initials: "DS",
    ticket: "EWP over 11m",
    number: "WA-HRW-0567821",
    ticketClass: "WP",
    issued: "14 Oct 2023",
    expires: "14 Oct 2028",
    status: "Current",
  },
  {
    person: "Monique Carter",
    initials: "MC",
    ticket: "White Card",
    number: "SA-WC-1908274",
    ticketClass: "—",
    issued: "23 Sep 2019",
    expires: "No expiry",
    status: "Current",
  },
  {
    person: "Ruth Alvarez",
    initials: "RA",
    ticket: "First Aid",
    number: "HLTAID011-0021847",
    ticketClass: "HLTAID011",
    issued: "14 Jan 2024",
    expires: "14 Jan 2027",
    status: "Current",
  },
]

export function TrainingTickets() {
  const total = TICKETS.length
  const current = TICKETS.filter((t) => t.status === "Current").length
  const expiring = TICKETS.filter((t) => t.status === "Expiring").length
  const expired = TICKETS.filter((t) => t.status === "Expired").length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total tickets", value: total, tone: "" },
            {
              label: "Current",
              value: current,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Expiring (30d)",
              value: expiring,
              tone: "text-amber-600 dark:text-amber-400",
            },
            { label: "Expired", value: expired, tone: "text-red-600 dark:text-red-400" },
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
                  <th className="px-4 py-2.5 font-medium">Ticket</th>
                  <th className="px-4 py-2.5 font-medium">Number</th>
                  <th className="px-4 py-2.5 font-medium">Class</th>
                  <th className="px-4 py-2.5 font-medium">Issued</th>
                  <th className="px-4 py-2.5 font-medium">Expires</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {TICKETS.map((t, i) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      t.status === "Expired" && "opacity-60",
                    )}
                    key={i}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[10px] font-medium">
                          {t.initials}
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium">
                          {t.person}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs">{t.ticket}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {t.number}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {t.ticketClass}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {t.issued}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {t.expires}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[t.status],
                        )}
                      >
                        {t.status}
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
