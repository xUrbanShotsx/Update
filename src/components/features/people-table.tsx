import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"

type Engagement = "Employee" | "Labour hire" | "Subcontractor"
type WorkerStatus = "Active" | "Leave" | "Offsite"

type Worker = {
  name: string
  initials: string
  role: string
  trade: string
  engagement: Engagement
  site: string
  started: string
  status: WorkerStatus
}

const STATUS_TONE: Record<WorkerStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Leave: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Offsite: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
}

const ENGAGEMENT_TONE: Record<Engagement, string> = {
  Employee: "bg-fill text-foreground",
  "Labour hire": "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Subcontractor: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
}

const WORKERS: Worker[] = [
  {
    name: "Marcus Reid",
    initials: "MR",
    role: "Site Manager",
    trade: "Supervision",
    engagement: "Employee",
    site: "Brisbane Terminal",
    started: "3 Mar 2024",
    status: "Active",
  },
  {
    name: "Ruth Alvarez",
    initials: "RA",
    role: "HSE Coordinator",
    trade: "Supervision",
    engagement: "Employee",
    site: "Geelong Site",
    started: "14 Jan 2024",
    status: "Active",
  },
  {
    name: "Dean Cartwright",
    initials: "DC",
    role: "Leading Hand",
    trade: "Concreters",
    engagement: "Employee",
    site: "Brisbane Terminal",
    started: "22 Jul 2023",
    status: "Active",
  },
  {
    name: "Melissa Nguyen",
    initials: "MN",
    role: "Traffic Controller",
    trade: "Traffic control",
    engagement: "Labour hire",
    site: "Sydney Yard",
    started: "6 Feb 2025",
    status: "Active",
  },
  {
    name: "Troy Baxter",
    initials: "TB",
    role: "Concretor",
    trade: "Concreters",
    engagement: "Employee",
    site: "Brisbane Terminal",
    started: "1 May 2023",
    status: "Active",
  },
  {
    name: "Janelle Park",
    initials: "JP",
    role: "Confined Space Attendant",
    trade: "Earthworks",
    engagement: "Subcontractor",
    site: "Melbourne Depot",
    started: "10 Sep 2024",
    status: "Active",
  },
  {
    name: "Kyle Osman",
    initials: "KO",
    role: "EWP Operator",
    trade: "Earthworks",
    engagement: "Labour hire",
    site: "Geelong Site",
    started: "18 Nov 2024",
    status: "Active",
  },
  {
    name: "Renee Stafford",
    initials: "RS",
    role: "Traffic Controller",
    trade: "Traffic control",
    engagement: "Labour hire",
    site: "Sydney Yard",
    started: "3 Mar 2025",
    status: "Active",
  },
  {
    name: "Lachlan Murray",
    initials: "LM",
    role: "Steel Fixer",
    trade: "Steel fixers",
    engagement: "Subcontractor",
    site: "Geelong Site",
    started: "7 Aug 2026",
    status: "Active",
  },
  {
    name: "Priya Tan",
    initials: "PT",
    role: "Site Administrator",
    trade: "Supervision",
    engagement: "Employee",
    site: "Sydney Yard",
    started: "9 Apr 2024",
    status: "Active",
  },
  {
    name: "Alex Kerr",
    initials: "AK",
    role: "Project Engineer",
    trade: "Supervision",
    engagement: "Employee",
    site: "Melbourne Depot",
    started: "15 Jun 2023",
    status: "Active",
  },
  {
    name: "Jo Lin",
    initials: "JL",
    role: "Concretor",
    trade: "Concreters",
    engagement: "Employee",
    site: "Perth Workshop",
    started: "21 Oct 2023",
    status: "Active",
  },
  {
    name: "Sam Okafor",
    initials: "SO",
    role: "Plant Operator",
    trade: "Earthworks",
    engagement: "Labour hire",
    site: "Adelaide Depot",
    started: "2 Jan 2025",
    status: "Active",
  },
  {
    name: "Chloe Fitzpatrick",
    initials: "CF",
    role: "Steel Fixer",
    trade: "Steel fixers",
    engagement: "Subcontractor",
    site: "Brisbane Terminal",
    started: "8 Aug 2024",
    status: "Active",
  },
  {
    name: "Brendan Walsh",
    initials: "BW",
    role: "Dogman",
    trade: "Steel fixers",
    engagement: "Labour hire",
    site: "Newcastle Yard",
    started: "17 Feb 2025",
    status: "Offsite",
  },
  {
    name: "Aiden Rossi",
    initials: "AR",
    role: "Concretor",
    trade: "Concreters",
    engagement: "Employee",
    site: "Brisbane Terminal",
    started: "4 Aug 2026",
    status: "Active",
  },
  {
    name: "Fatima Al-Rashid",
    initials: "FA",
    role: "Traffic Controller",
    trade: "Traffic control",
    engagement: "Labour hire",
    site: "Sydney Yard",
    started: "5 Aug 2026",
    status: "Active",
  },
  {
    name: "Sophia Petrakis",
    initials: "SP",
    role: "Site Administrator",
    trade: "Supervision",
    engagement: "Employee",
    site: "Brisbane Terminal",
    started: "11 Aug 2026",
    status: "Active",
  },
  {
    name: "Nathan Holloway",
    initials: "NH",
    role: "Concretor",
    trade: "Concreters",
    engagement: "Subcontractor",
    site: "Geelong Site",
    started: "5 May 2025",
    status: "Active",
  },
  {
    name: "Grace O'Brien",
    initials: "GO",
    role: "HSE Advisor",
    trade: "Supervision",
    engagement: "Employee",
    site: "Sydney Yard",
    started: "12 Mar 2024",
    status: "Active",
  },
  {
    name: "Isaac Tamboli",
    initials: "IT",
    role: "Plant Operator",
    trade: "Earthworks",
    engagement: "Labour hire",
    site: "Brisbane Terminal",
    started: "29 Apr 2025",
    status: "Active",
  },
  {
    name: "Kylie Brennan",
    initials: "KB",
    role: "Formwork Carpenter",
    trade: "Concreters",
    engagement: "Subcontractor",
    site: "Melbourne Depot",
    started: "7 Jul 2024",
    status: "Leave",
  },
  {
    name: "Darren Soo",
    initials: "DS",
    role: "Scaffolder",
    trade: "Steel fixers",
    engagement: "Labour hire",
    site: "Perth Workshop",
    started: "14 Oct 2024",
    status: "Leave",
  },
  {
    name: "Monique Carter",
    initials: "MC",
    role: "Truck Driver",
    trade: "Earthworks",
    engagement: "Employee",
    site: "Adelaide Depot",
    started: "23 Sep 2023",
    status: "Active",
  },
]

const PERSON_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Personal details", type: "section" },
  {
    name: "first_name",
    label: "First name",
    type: "text",
    required: true,
    placeholder: "Given name",
  },
  {
    name: "last_name",
    label: "Last name",
    type: "text",
    required: true,
    placeholder: "Family name",
  },
  {
    name: "role",
    label: "Role / position",
    type: "text",
    required: true,
    placeholder: "e.g. Site supervisor, Concreter",
  },
  {
    name: "trade",
    label: "Trade",
    type: "select",
    options: [
      "Concrete / formwork",
      "Carpentry",
      "Steel fixing",
      "Scaffolding",
      "Rigging",
      "Electrical",
      "Traffic control",
      "Plant operation",
      "Crane operation",
      "Survey",
      "Management",
      "Other",
    ],
  },
  { name: "s2", label: "Employment", type: "section" },
  {
    name: "engagement",
    label: "Engagement type",
    type: "select",
    required: true,
    options: [
      "Direct employee",
      "Labour hire",
      "Subcontractor — individual",
      "Subcontractor — company",
    ],
  },
  {
    name: "employer",
    label: "Employer / company",
    type: "text",
    placeholder: "If labour hire or sub",
  },
  {
    name: "site",
    label: "Primary site",
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
  { name: "start_date", label: "Start date", type: "date", required: true },
  { name: "s3", label: "Contact", type: "section" },
  {
    name: "mobile",
    label: "Mobile",
    type: "tel",
    required: true,
    placeholder: "0400 000 000",
  },
  { name: "email", label: "Email", type: "email", placeholder: "name@company.com.au" },
  {
    name: "emergency_name",
    label: "Emergency contact name",
    type: "text",
    placeholder: "Full name",
  },
  {
    name: "emergency_phone",
    label: "Emergency contact phone",
    type: "tel",
    placeholder: "0400 000 000",
  },
]

export function PeopleTable() {
  const total = WORKERS.length
  const active = WORKERS.filter((w) => w.status === "Active").length
  const onLeave = WORKERS.filter((w) => w.status === "Leave").length
  const offsite = WORKERS.filter((w) => w.status === "Offsite").length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Person" fields={PERSON_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total workers", value: total, tone: "" },
            {
              label: "Active",
              value: active,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "On leave",
              value: onLeave,
              tone: "text-amber-600 dark:text-amber-400",
            },
            { label: "Offsite", value: offsite, tone: "text-sky-600 dark:text-sky-400" },
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
                  <th className="px-4 py-2.5 font-medium">Role</th>
                  <th className="px-4 py-2.5 font-medium">Trade</th>
                  <th className="px-4 py-2.5 font-medium">Engagement</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Started</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {WORKERS.map((w) => (
                  <tr className="hover:bg-accent/40 transition-colors" key={w.name}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[10px] font-medium">
                          {w.initials}
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium">
                          {w.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {w.role}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {w.trade}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          ENGAGEMENT_TONE[w.engagement],
                        )}
                      >
                        {w.engagement}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {w.site}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-muted-foreground">
                      {w.started}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[w.status],
                        )}
                      >
                        {w.status}
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
