"use client"
import { useState } from "react"
import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { DetailSection, DetailRow } from "@/components/shared/detail-modal"

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

const ENGAGEMENT_AVATAR_TONE: Record<Engagement, string> = {
  Employee: "bg-fill-strong text-foreground",
  "Labour hire": "bg-violet-500/20 text-violet-700 dark:text-violet-400",
  Subcontractor: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
}

type LicenceRow = { licence: string; number: string; expiry: string }

function getLicences(trade: string): LicenceRow[] {
  switch (trade) {
    case "Supervision":
      return [
        {
          licence: "Construction Induction (White Card)",
          number: "WC-2847365",
          expiry: "No expiry",
        },
        {
          licence: "Workplace Health & Safety Certificate",
          number: "N/A",
          expiry: "Ongoing",
        },
      ]
    case "Traffic control":
      return [
        {
          licence: "Traffic Controller Accreditation",
          number: "TC-2024-08-1193",
          expiry: "12 Aug 2026",
        },
        {
          licence: "Construction Induction (White Card)",
          number: "WC-1937246",
          expiry: "No expiry",
        },
      ]
    case "Concreters":
      return [
        {
          licence: "Construction Induction (White Card)",
          number: "WC-3847291",
          expiry: "No expiry",
        },
        {
          licence: "EWP Licence (up to 11 m)",
          number: "EWP-6745",
          expiry: "14 Mar 2026",
        },
      ]
    case "Steel fixers":
      return [
        {
          licence: "Scaffolding High Risk Work Licence",
          number: "SC-004821",
          expiry: "30 Nov 2025",
        },
        {
          licence: "Construction Induction (White Card)",
          number: "WC-2034891",
          expiry: "No expiry",
        },
      ]
    case "Earthworks":
      return [
        { licence: "Rigging Intermediate", number: "RI-884920", expiry: "22 Oct 2025" },
        { licence: "Dogging", number: "DG-552018", expiry: "22 Oct 2025" },
        {
          licence: "Construction Induction (White Card)",
          number: "WC-2039481",
          expiry: "No expiry",
        },
      ]
    case "Electrical":
      return [
        {
          licence: "Electrical Contractor Licence",
          number: "EC-021847",
          expiry: "31 Oct 2025",
        },
        {
          licence: "Construction Induction (White Card)",
          number: "WC-1847392",
          expiry: "No expiry",
        },
      ]
    default:
      return [
        {
          licence: "Construction Induction (White Card)",
          number: "WC-3847201",
          expiry: "No expiry",
        },
      ]
  }
}

function getEmpId(name: string) {
  return `EMP-${name.replace(/\s+/g, "").slice(0, 4).toUpperCase()}01`
}

function getEmergencyContact(name: string, index: number) {
  const lastName = name.split(" ")[1] ?? "Smith"
  const digits = String(300 + index).padStart(3, "0")
  return `Sarah ${lastName} · 0412 555 ${digits}`
}

type SiteHistory = { site: string; period: string }

function getSiteHistory(worker: Worker, index: number): SiteHistory[] {
  const sites = [
    "Melbourne Depot",
    "Sydney Yard",
    "Brisbane Terminal",
    "Perth Workshop",
    "Adelaide Depot",
    "Geelong Site",
  ]
  const otherSites = sites.filter((s) => s !== worker.site)
  return [
    { site: otherSites[index % otherSites.length], period: "Jan 2023 – Jun 2023" },
    {
      site: otherSites[(index + 1) % otherSites.length],
      period: "Jul 2023 – Feb 2024",
    },
    { site: worker.site, period: `${worker.started} – Present` },
  ]
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
  const [selected, setSelected] = useState<Worker | null>(null)
  const selectedIndex = selected ? WORKERS.findIndex((w) => w.name === selected.name) : 0

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
                  <tr
                    className="cursor-pointer transition-colors hover:bg-accent/40"
                    key={w.name}
                    onClick={() => setSelected(w)}
                  >
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
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {w.role}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
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
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {w.site}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
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

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl"
              style={{ maxHeight: "min(90vh, 820px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold">{selected.name}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {selected.role} · {selected.site}
                  </p>
                </div>
                <button
                  aria-label="Close"
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => setSelected(null)}
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div
                className="overflow-y-auto px-6 py-5"
                style={{ maxHeight: "calc(min(90vh, 820px) - 72px)" }}
              >
                <DetailSection label="Profile">
                  <div className="mb-4 flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-14 items-center justify-center rounded-full text-lg font-semibold",
                        ENGAGEMENT_AVATAR_TONE[selected.engagement],
                      )}
                    >
                      {selected.initials}
                    </div>
                    <p className="mt-2 text-sm font-semibold">{selected.name}</p>
                  </div>
                  <DetailRow label="Role" value={selected.role} />
                  <DetailRow label="Trade" value={selected.trade} />
                  <DetailRow
                    label="Engagement"
                    value={
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          ENGAGEMENT_TONE[selected.engagement],
                        )}
                      >
                        {selected.engagement}
                      </span>
                    }
                  />
                  <DetailRow label="Site" value={selected.site} />
                  <DetailRow label="Started" value={selected.started} />
                  <DetailRow
                    label="Status"
                    value={
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[selected.status],
                        )}
                      >
                        {selected.status}
                      </span>
                    }
                  />
                  <DetailRow label="Employee #" value={getEmpId(selected.name)} />
                  <DetailRow
                    label="Emergency contact"
                    value={getEmergencyContact(selected.name, selectedIndex)}
                  />
                </DetailSection>

                <DetailSection label="Licences & Tickets">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-left text-[10px] text-muted-foreground">
                        <th className="pb-1.5 font-medium">Licence</th>
                        <th className="pb-1.5 font-medium">Number</th>
                        <th className="pb-1.5 font-medium">Expiry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {getLicences(selected.trade).map((row) => (
                        <tr key={row.number}>
                          <td className="py-1.5 font-medium">{row.licence}</td>
                          <td className="py-1.5 font-mono text-muted-foreground">
                            {row.number}
                          </td>
                          <td className="py-1.5 text-muted-foreground">{row.expiry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DetailSection>

                <DetailSection label="Site History">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-left text-[10px] text-muted-foreground">
                        <th className="pb-1.5 font-medium">Site</th>
                        <th className="pb-1.5 font-medium">Period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {getSiteHistory(selected, selectedIndex).map((row) => (
                        <tr key={row.site + row.period}>
                          <td className="py-1.5 font-medium">{row.site}</td>
                          <td className="py-1.5 text-muted-foreground">{row.period}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DetailSection>

                <DetailSection label="Induction Status">
                  <DetailRow
                    label="Site induction"
                    value={`Completed ${selected.started}`}
                  />
                  <DetailRow label="Last toolbox talk" value="8 Aug 2025" />
                  <DetailRow label="Drug & alcohol test" value="Passed — 14 Jul 2025" />
                </DetailSection>
              </div>
            </div>
          </div>
        )}
      </Frame>
    </PageScroll>
  )
}
