import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type PpeStatus = "Current" | "Due" | "Overdue"

type PpeRecord = {
  person: string
  initials: string
  item: string
  size: string
  issued: string
  site: string
  replaceDue: string
  status: PpeStatus
}

const STATUS_TONE: Record<PpeStatus, string> = {
  Current: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Due: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Overdue: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const RECORDS: PpeRecord[] = [
  {
    person: "Marcus Reid",
    initials: "MR",
    item: "Hard hat",
    size: "Universal",
    issued: "3 Mar 2024",
    site: "Brisbane Terminal",
    replaceDue: "3 Mar 2026",
    status: "Current",
  },
  {
    person: "Dean Cartwright",
    initials: "DC",
    item: "Safety boots",
    size: "11",
    issued: "22 Jul 2023",
    site: "Brisbane Terminal",
    replaceDue: "22 Jul 2025",
    status: "Overdue",
  },
  {
    person: "Melissa Nguyen",
    initials: "MN",
    item: "Hi-vis vest",
    size: "M",
    issued: "6 Feb 2025",
    site: "Sydney Yard",
    replaceDue: "6 Feb 2027",
    status: "Current",
  },
  {
    person: "Troy Baxter",
    initials: "TB",
    item: "Full-body harness",
    size: "L",
    issued: "1 May 2024",
    site: "Brisbane Terminal",
    replaceDue: "1 May 2026",
    status: "Current",
  },
  {
    person: "Janelle Park",
    initials: "JP",
    item: "P2 Respirator",
    size: "M",
    issued: "10 Sep 2024",
    site: "Melbourne Depot",
    replaceDue: "10 Mar 2025",
    status: "Overdue",
  },
  {
    person: "Kyle Osman",
    initials: "KO",
    item: "Safety glasses",
    size: "Universal",
    issued: "18 Nov 2024",
    site: "Geelong Site",
    replaceDue: "18 Nov 2025",
    status: "Due",
  },
  {
    person: "Renee Stafford",
    initials: "RS",
    item: "Hi-vis vest",
    size: "S",
    issued: "3 Mar 2025",
    site: "Sydney Yard",
    replaceDue: "3 Mar 2027",
    status: "Current",
  },
  {
    person: "Alex Kerr",
    initials: "AK",
    item: "Hard hat",
    size: "Universal",
    issued: "15 Jun 2024",
    site: "Melbourne Depot",
    replaceDue: "15 Jun 2026",
    status: "Current",
  },
  {
    person: "Jo Lin",
    initials: "JL",
    item: "Gloves",
    size: "L",
    issued: "21 Oct 2024",
    site: "Perth Workshop",
    replaceDue: "21 Apr 2025",
    status: "Overdue",
  },
  {
    person: "Sam Okafor",
    initials: "SO",
    item: "Hearing protection",
    size: "Universal",
    issued: "2 Jan 2025",
    site: "Adelaide Depot",
    replaceDue: "2 Jan 2026",
    status: "Due",
  },
  {
    person: "Chloe Fitzpatrick",
    initials: "CF",
    item: "Safety boots",
    size: "7",
    issued: "8 Aug 2024",
    site: "Brisbane Terminal",
    replaceDue: "8 Aug 2026",
    status: "Current",
  },
  {
    person: "Brendan Walsh",
    initials: "BW",
    item: "Full-body harness",
    size: "XL",
    issued: "17 Feb 2025",
    site: "Newcastle Yard",
    replaceDue: "17 Feb 2027",
    status: "Current",
  },
  {
    person: "Nathan Holloway",
    initials: "NH",
    item: "Hi-vis vest",
    size: "XL",
    issued: "5 Aug 2026",
    site: "Geelong Site",
    replaceDue: "5 Aug 2028",
    status: "Current",
  },
  {
    person: "Grace O'Brien",
    initials: "GO",
    item: "Safety glasses",
    size: "Universal",
    issued: "4 Aug 2026",
    site: "Sydney Yard",
    replaceDue: "4 Aug 2028",
    status: "Current",
  },
  {
    person: "Isaac Tamboli",
    initials: "IT",
    item: "Hard hat",
    size: "Universal",
    issued: "7 Aug 2026",
    site: "Brisbane Terminal",
    replaceDue: "7 Aug 2028",
    status: "Current",
  },
  {
    person: "Kylie Brennan",
    initials: "KB",
    item: "P2 Respirator",
    size: "S",
    issued: "1 Aug 2026",
    site: "Melbourne Depot",
    replaceDue: "1 Feb 2027",
    status: "Due",
  },
]

export function PpeRegister() {
  const total = RECORDS.length
  const due = RECORDS.filter((r) => r.status === "Due").length
  const overdue = RECORDS.filter((r) => r.status === "Overdue").length
  const issuedThisMonth = RECORDS.filter((r) => r.issued.includes("Aug 2026")).length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total issued", value: total, tone: "" },
            {
              label: "Replacement due",
              value: due,
              tone: "text-amber-600 dark:text-amber-400",
            },
            { label: "Overdue", value: overdue, tone: "text-red-600 dark:text-red-400" },
            {
              label: "Issued this month",
              value: issuedThisMonth,
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
                  <th className="px-4 py-2.5 font-medium">Item</th>
                  <th className="px-4 py-2.5 font-medium">Size</th>
                  <th className="px-4 py-2.5 font-medium">Issued</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Replace due</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {RECORDS.map((r, i) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      r.status === "Overdue" && "opacity-70",
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
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs">{r.item}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.size}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.issued}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {r.site}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 whitespace-nowrap text-xs font-medium",
                        r.status === "Overdue"
                          ? "text-red-600 dark:text-red-400"
                          : r.status === "Due"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground",
                      )}
                    >
                      {r.replaceDue}
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
