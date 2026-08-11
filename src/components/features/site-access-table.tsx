import { Frame, Toolbar } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

const SIGN_ON_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Person details", type: "section" },
  {
    name: "name",
    label: "Full name",
    type: "text",
    required: true,
    placeholder: "First and last name",
  },
  {
    name: "company",
    label: "Company / employer",
    type: "text",
    required: true,
    placeholder: "e.g. Lendlease, ABC Concreting",
  },
  {
    name: "role",
    label: "Role / trade",
    type: "select",
    required: true,
    options: [
      "Site supervisor",
      "Leading hand",
      "Concreter",
      "Carpenter",
      "Steel fixer",
      "Scaffolder",
      "Rigger",
      "Crane operator",
      "Electrician",
      "Traffic controller",
      "Plant operator",
      "Labourer",
      "Visitor",
      "Other",
    ],
  },
  { name: "s2", label: "Site entry", type: "section" },
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
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time_in", label: "Time in", type: "time", required: true },
  { name: "time_out", label: "Time out", type: "time" },
  { name: "s3", label: "Compliance", type: "section" },
  {
    name: "induction",
    label: "Induction #",
    type: "text",
    required: true,
    placeholder: "e.g. IND-2024-0391",
  },
  {
    name: "rego",
    label: "Vehicle rego (if applicable)",
    type: "text",
    placeholder: "e.g. ABC123",
  },
]

type AccessStatus = "On site" | "Signed off" | "Blocked"

type Worker = {
  name: string
  initials: string
  company: string
  trade: string
  site: string
  inducted: string
  signedOn: string
  hours: number
  status: AccessStatus
}

const STATUS_TONE: Record<AccessStatus, string> = {
  "On site": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Signed off": "bg-fill text-muted-foreground",
  Blocked: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const WORKERS: Worker[] = [
  {
    name: "Dean Kowalski",
    initials: "DK",
    company: "Kowalski Formwork Pty Ltd",
    trade: "Formwork Carpenter",
    site: "Parramatta Interchange",
    inducted: "14 Mar 2025",
    signedOn: "06:42",
    hours: 9.5,
    status: "On site",
  },
  {
    name: "Mick Tran",
    initials: "MT",
    company: "Trans-Civil Pty Ltd",
    trade: "Concreter",
    site: "Parramatta Interchange",
    inducted: "20 Jan 2025",
    signedOn: "06:55",
    hours: 9.2,
    status: "On site",
  },
  {
    name: "Sharon Nguyen",
    initials: "SN",
    company: "Briesa Infrastructure",
    trade: "Site Engineer",
    site: "Chatswood Rail Upgrade",
    inducted: "5 Feb 2025",
    signedOn: "07:00",
    hours: 8.0,
    status: "Signed off",
  },
  {
    name: "Brett Callahan",
    initials: "BC",
    company: "Callahan Plant Hire",
    trade: "Excavator Operator",
    site: "Chatswood Rail Upgrade",
    inducted: "18 Apr 2025",
    signedOn: "06:30",
    hours: 10.0,
    status: "Signed off",
  },
  {
    name: "Raj Pillai",
    initials: "RP",
    company: "Pillar Steel & Reo",
    trade: "Steel Fixer",
    site: "Bankstown Substation",
    inducted: "2 Jun 2025",
    signedOn: "07:15",
    hours: 8.5,
    status: "On site",
  },
  {
    name: "Tom Hewitt",
    initials: "TH",
    company: "Hewitt Electrical",
    trade: "Electrician",
    site: "Bankstown Substation",
    inducted: "9 Jul 2025",
    signedOn: "07:30",
    hours: 7.5,
    status: "On site",
  },
  {
    name: "Lisa Ferraro",
    initials: "LF",
    company: "Briesa Infrastructure",
    trade: "Project Manager",
    site: "Homebush Drainage",
    inducted: "10 Nov 2024",
    signedOn: "06:50",
    hours: 9.0,
    status: "Signed off",
  },
  {
    name: "Nathan Osei",
    initials: "NO",
    company: "Osei Civil Contractors",
    trade: "Pipe Layer",
    site: "Homebush Drainage",
    inducted: "3 Mar 2025",
    signedOn: "07:00",
    hours: 8.8,
    status: "Signed off",
  },
  {
    name: "Carlos Mendes",
    initials: "CM",
    company: "Mendes Crane Services",
    trade: "Crane Operator",
    site: "Oran Park Civils",
    inducted: "22 May 2025",
    signedOn: "06:15",
    hours: 10.0,
    status: "On site",
  },
  {
    name: "Amy Blackwood",
    initials: "AB",
    company: "Briesa Infrastructure",
    trade: "Site Supervisor",
    site: "Oran Park Civils",
    inducted: "15 Dec 2024",
    signedOn: "06:45",
    hours: 9.5,
    status: "On site",
  },
  {
    name: "Wade Morrison",
    initials: "WM",
    company: "Morrison Earthworks",
    trade: "Dozer Operator",
    site: "Oran Park Civils",
    inducted: "7 Jan 2025",
    signedOn: "06:20",
    hours: 10.0,
    status: "On site",
  },
  {
    name: "Kylie Stanton",
    initials: "KS",
    company: "Stanton Surveying",
    trade: "Surveyor",
    site: "Rouse Hill Water Main",
    inducted: "11 Feb 2025",
    signedOn: "07:10",
    hours: 7.0,
    status: "Signed off",
  },
  {
    name: "Pete Zahariadis",
    initials: "PZ",
    company: "Z-Pipe Pty Ltd",
    trade: "Plumber",
    site: "Rouse Hill Water Main",
    inducted: "19 Jun 2025",
    signedOn: "06:55",
    hours: 8.5,
    status: "On site",
  },
  {
    name: "Danny Russo",
    initials: "DR",
    company: "Russo Scaffolding",
    trade: "Scaffolder",
    site: "Parramatta Interchange",
    inducted: "30 Apr 2025",
    signedOn: "06:40",
    hours: 9.0,
    status: "On site",
  },
  {
    name: "Bec Flanagan",
    initials: "BF",
    company: "Flanagan Traffic Control",
    trade: "Traffic Controller",
    site: "Homebush Drainage",
    inducted: "8 May 2025",
    signedOn: "06:00",
    hours: 11.0,
    status: "On site",
  },
  {
    name: "Tony Aboud",
    initials: "TA",
    company: "Aboud Concreting",
    trade: "Concreter",
    site: "Oran Park Civils",
    inducted: "14 Mar 2025",
    signedOn: "06:30",
    hours: 9.5,
    status: "On site",
  },
  {
    name: "Simon Crowe",
    initials: "SC",
    company: "Crowe Demolition",
    trade: "Demolition Worker",
    site: "Chatswood Rail Upgrade",
    inducted: "27 Feb 2025",
    signedOn: "07:00",
    hours: 0,
    status: "Blocked",
  },
  {
    name: "Grace Park",
    initials: "GP",
    company: "Briesa Infrastructure",
    trade: "WHS Advisor",
    site: "Bankstown Substation",
    inducted: "1 Aug 2025",
    signedOn: "07:30",
    hours: 6.5,
    status: "On site",
  },
  {
    name: "Ian Marchetti",
    initials: "IM",
    company: "Marchetti Hire",
    trade: "Telehandler Operator",
    site: "Rouse Hill Water Main",
    inducted: "21 Jul 2025",
    signedOn: "06:50",
    hours: 8.0,
    status: "Signed off",
  },
  {
    name: "Fiona Daly",
    initials: "FD",
    company: "Daly Traffic Management",
    trade: "Traffic Controller",
    site: "Parramatta Interchange",
    inducted: "3 Jun 2025",
    signedOn: "05:45",
    hours: 0,
    status: "Blocked",
  },
]

export function SiteAccessTable() {
  const onSite = WORKERS.filter((w) => w.status === "On site").length
  const signedOff = WORKERS.filter((w) => w.status === "Signed off").length
  const blocked = WORKERS.filter((w) => w.status === "Blocked").length

  return (
    <PageScroll overflows>
      <Frame>
        <div className="mb-4 flex items-center justify-between">
          <Toolbar filters={3} />
          <AddSheet title="Sign-on" fields={SIGN_ON_FIELDS} />
        </div>

        {/* Stat strip */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total registered", value: WORKERS.length, tone: "" },
            {
              label: "On site",
              value: onSite,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            { label: "Signed off", value: signedOff, tone: "text-muted-foreground" },
            { label: "Blocked", value: blocked, tone: "text-red-600 dark:text-red-400" },
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
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Company</th>
                  <th className="px-4 py-2.5 font-medium">Trade</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Inducted</th>
                  <th className="px-4 py-2.5 font-medium">Signed on</th>
                  <th className="px-4 py-2.5 font-medium text-right">Hours</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {WORKERS.map((worker) => (
                  <tr
                    className={cn(
                      "hover:bg-accent/40 transition-colors",
                      worker.status === "Blocked" && "opacity-70",
                    )}
                    key={worker.name}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {worker.initials}
                        </div>
                        <span className="whitespace-nowrap font-medium">
                          {worker.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {worker.company}
                    </td>
                    <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                      {worker.trade}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {worker.site}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {worker.inducted}
                    </td>
                    <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">
                      {worker.signedOn}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs tabular-nums text-muted-foreground">
                      {worker.status === "Blocked" ? "—" : worker.hours.toFixed(1)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[worker.status],
                        )}
                      >
                        {worker.status}
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
