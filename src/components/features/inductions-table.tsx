import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"

type InductionStatus = "Valid" | "Expiring soon" | "Expired"

type Induction = {
  person: string
  initials: string
  company: string
  induction: string
  version: string
  completed: string
  score: number
  expires: string
  status: InductionStatus
}

const STATUS_TONE: Record<InductionStatus, string> = {
  Valid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Expiring soon": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Expired: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const SCORE_TONE = (score: number): string => {
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400"
  if (score >= 75) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

const INDUCTIONS: Induction[] = [
  {
    person: "Marcus Reid",
    initials: "MR",
    company: "Briesa Group",
    induction: "Company",
    version: "v4.2",
    completed: "3 Mar 2024",
    score: 100,
    expires: "No expiry",
    status: "Valid",
  },
  {
    person: "Marcus Reid",
    initials: "MR",
    company: "Briesa Group",
    induction: "Brisbane Terminal",
    version: "v2.1",
    completed: "3 Mar 2024",
    score: 96,
    expires: "3 Mar 2026",
    status: "Valid",
  },
  {
    person: "Ruth Alvarez",
    initials: "RA",
    company: "Briesa Group",
    induction: "Company",
    version: "v4.2",
    completed: "14 Jan 2024",
    score: 100,
    expires: "No expiry",
    status: "Valid",
  },
  {
    person: "Ruth Alvarez",
    initials: "RA",
    company: "Briesa Group",
    induction: "Working at Height",
    version: "v1.4",
    completed: "14 Jan 2024",
    score: 92,
    expires: "14 Jan 2026",
    status: "Valid",
  },
  {
    person: "Dean Cartwright",
    initials: "DC",
    company: "Briesa Group",
    induction: "Brisbane Terminal",
    version: "v2.1",
    completed: "22 Jul 2023",
    score: 88,
    expires: "22 Jul 2025",
    status: "Expired",
  },
  {
    person: "Melissa Nguyen",
    initials: "MN",
    company: "Labour Force Australia",
    induction: "Sydney Yard",
    version: "v3.0",
    completed: "6 Feb 2025",
    score: 94,
    expires: "6 Feb 2027",
    status: "Valid",
  },
  {
    person: "Troy Baxter",
    initials: "TB",
    company: "Briesa Group",
    induction: "Company",
    version: "v4.2",
    completed: "1 May 2023",
    score: 90,
    expires: "No expiry",
    status: "Valid",
  },
  {
    person: "Janelle Park",
    initials: "JP",
    company: "Deep Earth Services",
    induction: "Confined Space",
    version: "v2.0",
    completed: "10 Sep 2024",
    score: 95,
    expires: "10 Sep 2026",
    status: "Valid",
  },
  {
    person: "Kyle Osman",
    initials: "KO",
    company: "Skilled Group",
    induction: "Working at Height",
    version: "v1.4",
    completed: "18 Nov 2024",
    score: 82,
    expires: "18 Nov 2025",
    status: "Expiring soon",
  },
  {
    person: "Renee Stafford",
    initials: "RS",
    company: "Labour Force Australia",
    induction: "Sydney Yard",
    version: "v3.0",
    completed: "3 Mar 2025",
    score: 97,
    expires: "3 Mar 2027",
    status: "Valid",
  },
  {
    person: "Lachlan Murray",
    initials: "LM",
    company: "Consolidated Steel Pty Ltd",
    induction: "Company",
    version: "v4.2",
    completed: "7 Aug 2026",
    score: 91,
    expires: "No expiry",
    status: "Valid",
  },
  {
    person: "Priya Tan",
    initials: "PT",
    company: "Briesa Group",
    induction: "Sydney Yard",
    version: "v3.0",
    completed: "9 Apr 2024",
    score: 98,
    expires: "9 Apr 2026",
    status: "Valid",
  },
  {
    person: "Alex Kerr",
    initials: "AK",
    company: "Briesa Group",
    induction: "Company",
    version: "v4.2",
    completed: "15 Jun 2023",
    score: 85,
    expires: "No expiry",
    status: "Valid",
  },
  {
    person: "Jo Lin",
    initials: "JL",
    company: "Briesa Group",
    induction: "Working at Height",
    version: "v1.4",
    completed: "21 Oct 2023",
    score: 78,
    expires: "21 Oct 2025",
    status: "Expiring soon",
  },
  {
    person: "Sam Okafor",
    initials: "SO",
    company: "Tradelink Labour",
    induction: "Company",
    version: "v4.1",
    completed: "2 Jan 2025",
    score: 89,
    expires: "No expiry",
    status: "Valid",
  },
  {
    person: "Chloe Fitzpatrick",
    initials: "CF",
    company: "IronBound Contracting",
    induction: "Brisbane Terminal",
    version: "v2.1",
    completed: "8 Aug 2024",
    score: 93,
    expires: "8 Aug 2026",
    status: "Valid",
  },
  {
    person: "Brendan Walsh",
    initials: "BW",
    company: "Tradelink Labour",
    induction: "Confined Space",
    version: "v2.0",
    completed: "17 Feb 2025",
    score: 87,
    expires: "17 Feb 2027",
    status: "Valid",
  },
  {
    person: "Kylie Brennan",
    initials: "KB",
    company: "FormRight Contractors",
    induction: "Working at Height",
    version: "v1.4",
    completed: "7 Jul 2024",
    score: 80,
    expires: "7 Oct 2025",
    status: "Expiring soon",
  },
]

const INDUCTION_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Worker details", type: "section" },
  {
    name: "name",
    label: "Worker name",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  { name: "company", label: "Company / employer", type: "text", required: true },
  { name: "role", label: "Role / trade", type: "text", required: true },
  { name: "s2", label: "Induction details", type: "section" },
  {
    name: "site",
    label: "Site",
    type: "select",
    required: true,
    options: [
      "Melbourne Depot",
      "Sydney Yard",
      "Brisbane Terminal",
      "Perth Workshop",
      "Adelaide Depot",
      "Geelong Site",
    ],
  },
  {
    name: "induction_type",
    label: "Induction type",
    type: "select",
    required: true,
    options: [
      "Site induction — general",
      "Site induction — subcontractor",
      "Visitor induction",
      "Plant / equipment",
      "Confined space",
      "Working at heights",
      "Traffic management",
      "Emergency procedures",
    ],
  },
  {
    name: "induction_no",
    label: "Induction number",
    type: "text",
    required: true,
    placeholder: "e.g. IND-2024-0392",
  },
  { name: "date", label: "Induction date", type: "date", required: true },
  {
    name: "conducted_by",
    label: "Conducted by",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  { name: "expiry", label: "Expiry date", type: "date" },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    rows: 2,
    placeholder: "Any conditions, restrictions, or additional notes…",
  },
]

export function InductionsTable() {
  const total = INDUCTIONS.length
  const valid = INDUCTIONS.filter((i) => i.status === "Valid").length
  const expiring = INDUCTIONS.filter((i) => i.status === "Expiring soon").length
  const expired = INDUCTIONS.filter((i) => i.status === "Expired").length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Induction" fields={INDUCTION_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total records", value: total, tone: "" },
            {
              label: "Valid",
              value: valid,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Expiring soon",
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
                  <th className="px-4 py-2.5 font-medium">Company</th>
                  <th className="px-4 py-2.5 font-medium">Induction</th>
                  <th className="px-4 py-2.5 font-medium">Version</th>
                  <th className="px-4 py-2.5 font-medium">Completed</th>
                  <th className="px-4 py-2.5 font-medium text-right">Score</th>
                  <th className="px-4 py-2.5 font-medium">Expires</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {INDUCTIONS.map((ind, i) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      ind.status === "Expired" && "opacity-60",
                    )}
                    key={i}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[10px] font-medium">
                          {ind.initials}
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium">
                          {ind.person}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {ind.company}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-fill px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {ind.induction}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                      {ind.version}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {ind.completed}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={cn(
                          "text-xs font-semibold tabular-nums",
                          SCORE_TONE(ind.score),
                        )}
                      >
                        {ind.score}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {ind.expires}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[ind.status],
                        )}
                      >
                        {ind.status}
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
