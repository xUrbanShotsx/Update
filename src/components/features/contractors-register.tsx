"use client"
import { useState } from "react"
import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"
import { DetailSection, DetailRow } from "@/components/shared/detail-modal"

type ContractorStatus = "Approved" | "Conditional" | "Expired" | "Pending"

type Contractor = {
  company: string
  trade: string
  abn: string
  insuranceExpiry: string
  swmsCurrent: boolean
  inducted: number
  sites: string
  status: ContractorStatus
}

const STATUS_TONE: Record<ContractorStatus, string> = {
  Approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Conditional: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Expired: "bg-red-500/15 text-red-700 dark:text-red-400",
  Pending: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
}

type SwmsRow = { ref: string; activity: string; version: string; approvedBy: string }

function getSwmsDocs(trade: string): SwmsRow[] {
  switch (trade) {
    case "Piling":
      return [
        {
          ref: "SWMS-001",
          activity: "Piling operations",
          version: "Rev 4",
          approvedBy: "Marcus Reid",
        },
        {
          ref: "SWMS-007",
          activity: "Plant mobilisation on site",
          version: "Rev 2",
          approvedBy: "Alex Kerr",
        },
      ]
    case "Concrete":
      return [
        {
          ref: "SWMS-002",
          activity: "Concrete pour and finishing",
          version: "Rev 3",
          approvedBy: "Ruth Alvarez",
        },
        {
          ref: "SWMS-008",
          activity: "Formwork erection and stripping",
          version: "Rev 2",
          approvedBy: "Dean Cartwright",
        },
      ]
    case "Scaffolding":
      return [
        {
          ref: "SWMS-003",
          activity: "Scaffold erect / dismantle",
          version: "Rev 5",
          approvedBy: "Alex Kerr",
        },
        {
          ref: "SWMS-009",
          activity: "Working at heights — scaffold platform",
          version: "Rev 3",
          approvedBy: "Marcus Reid",
        },
      ]
    case "Waterproofing":
      return [
        {
          ref: "SWMS-004",
          activity: "Waterproof membrane application",
          version: "Rev 2",
          approvedBy: "Jo Lin",
        },
      ]
    case "Electrical":
      return [
        {
          ref: "SWMS-005",
          activity: "Electrical installation",
          version: "Rev 3",
          approvedBy: "Priya Tan",
        },
        {
          ref: "SWMS-011",
          activity: "Isolation and LOTO procedures",
          version: "Rev 4",
          approvedBy: "Ruth Alvarez",
        },
      ]
    case "Crane":
      return [
        {
          ref: "SWMS-006",
          activity: "Crane operations and engineered lifts",
          version: "Rev 4",
          approvedBy: "Marcus Reid",
        },
        {
          ref: "SWMS-012",
          activity: "Rigging and dogging",
          version: "Rev 3",
          approvedBy: "Alex Kerr",
        },
      ]
    default:
      return [
        {
          ref: "SWMS-010",
          activity: "General site works",
          version: "Rev 2",
          approvedBy: "Alex Kerr",
        },
      ]
  }
}

type InductedWorker = { name: string; role: string; inducted: string }

function getInductedWorkers(trade: string, count: number): InductedWorker[] {
  const pools: Record<string, InductedWorker[]> = {
    Piling: [
      { name: "Jamie Sorrento", role: "Piling Operator", inducted: "3 Mar 2025" },
      { name: "Dylan Yates", role: "Offsider", inducted: "3 Mar 2025" },
      { name: "Kevin Tran", role: "Piling Supervisor", inducted: "4 Mar 2025" },
      { name: "Ben Fallon", role: "Labourer", inducted: "10 Mar 2025" },
      { name: "Lily Drummond", role: "Site Engineer", inducted: "10 Mar 2025" },
    ],
    Concrete: [
      { name: "Raj Pillai", role: "Concretor", inducted: "14 Jan 2025" },
      { name: "Anna Boskovic", role: "Leading Hand", inducted: "14 Jan 2025" },
      { name: "Will Taber", role: "Concretor", inducted: "15 Jan 2025" },
      { name: "Nadia Russo", role: "Pump Operator", inducted: "15 Jan 2025" },
      { name: "Tony Chua", role: "Labourer", inducted: "20 Jan 2025" },
    ],
    Scaffolding: [
      { name: "Peter Dolan", role: "Advanced Scaffolder", inducted: "22 Feb 2025" },
      { name: "Sasha Hunt", role: "Scaffolder", inducted: "22 Feb 2025" },
      { name: "Carl Mistry", role: "Scaffolder", inducted: "23 Feb 2025" },
      { name: "Lee Chambers", role: "Labourer", inducted: "1 Mar 2025" },
    ],
    Waterproofing: [
      { name: "Rob Cater", role: "Membrane Applicator", inducted: "5 Apr 2025" },
      { name: "Mel Nguyen", role: "Labourer", inducted: "5 Apr 2025" },
      { name: "Glen Tsang", role: "Waterproofing Supervisor", inducted: "6 Apr 2025" },
    ],
    Electrical: [
      { name: "Adrian Moss", role: "Electrician", inducted: "7 May 2025" },
      { name: "Tina Barratt", role: "Electrician", inducted: "7 May 2025" },
      { name: "Oliver Chin", role: "Apprentice Electrician", inducted: "8 May 2025" },
      { name: "Diane Cross", role: "Electrical Supervisor", inducted: "8 May 2025" },
    ],
    Crane: [
      { name: "Mick Hayward", role: "Crane Operator", inducted: "2 Jun 2025" },
      { name: "Steve Baric", role: "Dogman", inducted: "2 Jun 2025" },
      { name: "Faye Collins", role: "Rigger", inducted: "3 Jun 2025" },
    ],
    default: [
      { name: "Harry Jenkins", role: "Tradesperson", inducted: "1 Apr 2025" },
      { name: "Carol Singh", role: "Labourer", inducted: "1 Apr 2025" },
      { name: "Pat Kowalski", role: "Supervisor", inducted: "2 Apr 2025" },
      { name: "Lena Rowan", role: "Labourer", inducted: "2 Apr 2025" },
    ],
  }
  const list = pools[trade] ?? pools.default
  return list.slice(0, Math.min(count || list.length, list.length))
}

const CONTRACTORS: Contractor[] = [
  {
    company: "Pinnacle Piling Pty Ltd",
    trade: "Piling",
    abn: "51 234 876 012",
    insuranceExpiry: "31 Mar 2026",
    swmsCurrent: true,
    inducted: 6,
    sites: "Melbourne Depot, Brisbane Terminal",
    status: "Approved",
  },
  {
    company: "Southcoast Concrete Specialists",
    trade: "Concrete",
    abn: "73 412 093 558",
    insuranceExpiry: "30 Jun 2026",
    swmsCurrent: true,
    inducted: 11,
    sites: "Sydney Yard, Geelong Site",
    status: "Approved",
  },
  {
    company: "Apex Scaffold Solutions",
    trade: "Scaffolding",
    abn: "28 567 340 194",
    insuranceExpiry: "28 Feb 2026",
    swmsCurrent: true,
    inducted: 9,
    sites: "Brisbane Terminal, Melbourne Depot",
    status: "Approved",
  },
  {
    company: "Shield Waterproofing Co.",
    trade: "Waterproofing",
    abn: "64 882 115 739",
    insuranceExpiry: "31 Jan 2026",
    swmsCurrent: true,
    inducted: 4,
    sites: "Perth Workshop",
    status: "Approved",
  },
  {
    company: "Volt Infrastructure Electrical",
    trade: "Electrical",
    abn: "19 305 674 821",
    insuranceExpiry: "31 Dec 2025",
    swmsCurrent: true,
    inducted: 7,
    sites: "Sydney Yard, Adelaide Depot",
    status: "Approved",
  },
  {
    company: "Pacific Crane Hire Pty Ltd",
    trade: "Crane",
    abn: "82 741 239 066",
    insuranceExpiry: "30 Sep 2025",
    swmsCurrent: true,
    inducted: 3,
    sites: "Geelong Site, Brisbane Terminal",
    status: "Approved",
  },
  {
    company: "Meridian Survey Group",
    trade: "Survey",
    abn: "47 193 502 384",
    insuranceExpiry: "30 Nov 2025",
    swmsCurrent: true,
    inducted: 2,
    sites: "Melbourne Depot",
    status: "Approved",
  },
  {
    company: "SafeFlow Traffic Management",
    trade: "Traffic control",
    abn: "35 620 487 913",
    insuranceExpiry: "31 Oct 2025",
    swmsCurrent: true,
    inducted: 14,
    sites: "All sites",
    status: "Approved",
  },
  {
    company: "Greenscape Landscaping Pty Ltd",
    trade: "Landscaping",
    abn: "91 058 234 670",
    insuranceExpiry: "28 Feb 2026",
    swmsCurrent: true,
    inducted: 5,
    sites: "Adelaide Depot, Perth Workshop",
    status: "Approved",
  },
  {
    company: "Ironclad Concrete Services",
    trade: "Concrete",
    abn: "56 774 031 248",
    insuranceExpiry: "30 Apr 2026",
    swmsCurrent: true,
    inducted: 8,
    sites: "Melbourne Depot",
    status: "Approved",
  },
  {
    company: "Heights Unlimited Scaffolding",
    trade: "Scaffolding",
    abn: "23 841 590 377",
    insuranceExpiry: "31 Aug 2025",
    swmsCurrent: false,
    inducted: 5,
    sites: "Geelong Site",
    status: "Conditional",
  },
  {
    company: "Brindabella Electrical Group",
    trade: "Electrical",
    abn: "68 319 047 825",
    insuranceExpiry: "31 Jul 2025",
    swmsCurrent: false,
    inducted: 3,
    sites: "Brisbane Terminal",
    status: "Conditional",
  },
  {
    company: "Redline Crane & Rigging",
    trade: "Crane",
    abn: "44 507 182 963",
    insuranceExpiry: "30 Jun 2025",
    swmsCurrent: false,
    inducted: 0,
    sites: "—",
    status: "Expired",
  },
  {
    company: "Coastal Piling Solutions",
    trade: "Piling",
    abn: "87 246 813 502",
    insuranceExpiry: "—",
    swmsCurrent: false,
    inducted: 0,
    sites: "—",
    status: "Pending",
  },
]

const CONTRACTOR_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Company details", type: "section" },
  {
    name: "company",
    label: "Company name",
    type: "text",
    required: true,
    placeholder: "e.g. FastForm Concrete Pty Ltd",
  },
  {
    name: "abn",
    label: "ABN",
    type: "text",
    required: true,
    placeholder: "e.g. 12 345 678 901",
  },
  {
    name: "trade",
    label: "Trade / scope",
    type: "select",
    required: true,
    options: [
      "Concrete / formwork",
      "Piling / ground engineering",
      "Scaffolding",
      "Waterproofing / membrane",
      "Electrical",
      "Traffic control",
      "Survey",
      "Crane / lifting",
      "Earthworks",
      "Steel fixing",
      "Fit-out",
      "HVAC",
      "Plumbing",
      "Other",
    ],
  },
  {
    name: "sites",
    label: "Sites active on",
    type: "text",
    placeholder: "e.g. Melbourne Depot, Sydney Yard",
  },
  { name: "s2", label: "WHS compliance", type: "section" },
  {
    name: "whs_contact",
    label: "WHS contact name",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  {
    name: "whs_phone",
    label: "WHS contact phone",
    type: "tel",
    placeholder: "0400 000 000",
  },
  {
    name: "insurance_expiry",
    label: "Public liability insurance expiry",
    type: "date",
    required: true,
  },
  {
    name: "swms_current",
    label: "SWMS current and approved?",
    type: "select",
    required: true,
    options: ["Yes", "No — pending", "No — not submitted"],
  },
  {
    name: "status",
    label: "Pre-qualification status",
    type: "select",
    required: true,
    options: [
      "Approved",
      "Conditional — restrictions apply",
      "Pending review",
      "Suspended",
      "Disqualified",
    ],
  },
]

export function ContractorsRegister() {
  const [selected, setSelected] = useState<Contractor | null>(null)
  const selectedIndex = selected
    ? CONTRACTORS.findIndex((c) => c.company === selected.company)
    : 0

  const whsContacts = ["Michael Torres", "Julie Marsh"]
  const whsPhones = ["0411 222 333", "0422 444 555"]

  const approved = CONTRACTORS.filter((c) => c.status === "Approved")
  const conditional = CONTRACTORS.filter((c) => c.status === "Conditional")
  const expired = CONTRACTORS.filter((c) => c.status === "Expired")
  const pending = CONTRACTORS.filter((c) => c.status === "Pending")

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Contractor" fields={CONTRACTOR_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Approved",
              value: approved.length,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Conditional",
              value: conditional.length,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Expired",
              value: expired.length,
              tone: "text-red-600 dark:text-red-400",
            },
            {
              label: "Pending",
              value: pending.length,
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
                  <th className="px-4 py-2.5 font-medium">Company</th>
                  <th className="px-4 py-2.5 font-medium">Trade</th>
                  <th className="px-4 py-2.5 font-medium">ABN</th>
                  <th className="px-4 py-2.5 font-medium">Insurance expiry</th>
                  <th className="px-4 py-2.5 font-medium">SWMS current</th>
                  <th className="px-4 py-2.5 font-medium">Inducted</th>
                  <th className="px-4 py-2.5 font-medium">Site(s)</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {CONTRACTORS.map((c) => (
                  <tr
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-accent/40",
                      (c.status === "Expired" || c.status === "Pending") && "opacity-60",
                    )}
                    key={c.company}
                    onClick={() => setSelected(c)}
                  >
                    <td className="px-4 py-2.5 text-sm font-medium">{c.company}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {c.trade}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {c.abn}
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-2.5 text-xs",
                        c.status === "Expired"
                          ? "font-medium text-red-600 dark:text-red-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {c.insuranceExpiry}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          c.swmsCurrent
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400",
                        )}
                      >
                        {c.swmsCurrent ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-xs text-muted-foreground">
                      {c.inducted}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {c.sites}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[c.status],
                        )}
                      >
                        {c.status}
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
                  <h2 className="text-base font-semibold">{selected.company}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {selected.trade} · ABN {selected.abn}
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
                <DetailSection label="Company Details">
                  <DetailRow label="Company" value={selected.company} />
                  <DetailRow label="Trade" value={selected.trade} />
                  <DetailRow label="ABN" value={selected.abn} />
                  <DetailRow label="Active sites" value={selected.sites} />
                  <DetailRow
                    label="Workers inducted"
                    value={`${selected.inducted} workers`}
                  />
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
                  <DetailRow
                    label="WHS contact"
                    value={`${whsContacts[selectedIndex % 2]} · ${whsPhones[selectedIndex % 2]}`}
                  />
                </DetailSection>

                <DetailSection label="Insurance & Compliance">
                  <DetailRow
                    label="Public liability"
                    value={`$20,000,000 · Policy: PL-2025-${selected.abn.slice(-4)} · Expires ${selected.insuranceExpiry}`}
                  />
                  <DetailRow
                    label="Workers compensation"
                    value={`Active · WorkCover QLD · Policy WC-${selected.abn.replace(/\s/g, "").slice(-6)}`}
                  />
                  <DetailRow
                    label="SWMS current"
                    value={
                      selected.swmsCurrent
                        ? "Yes — all high risk activities covered"
                        : "⚠ SWMS review required"
                    }
                    tone={
                      selected.swmsCurrent
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-amber-700 dark:text-amber-400"
                    }
                  />
                  <DetailRow label="Last prequalification" value="15 Mar 2025" />
                  <DetailRow label="Next review due" value="15 Mar 2026" />
                </DetailSection>

                <DetailSection label="SWMS Documents">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-left text-[10px] text-muted-foreground">
                        <th className="pb-1.5 font-medium">SWMS ref</th>
                        <th className="pb-1.5 font-medium">Activity</th>
                        <th className="pb-1.5 font-medium">Version</th>
                        <th className="pb-1.5 font-medium">Approved by</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {getSwmsDocs(selected.trade).map((row) => (
                        <tr key={row.ref}>
                          <td className="py-1.5 font-mono text-muted-foreground">
                            {row.ref}
                          </td>
                          <td className="py-1.5 font-medium">{row.activity}</td>
                          <td className="py-1.5 text-muted-foreground">{row.version}</td>
                          <td className="py-1.5 text-muted-foreground">
                            {row.approvedBy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DetailSection>

                <DetailSection label="Inducted Workers">
                  <ul className="space-y-1.5">
                    {getInductedWorkers(selected.trade, selected.inducted).map((w) => (
                      <li
                        className="flex items-center justify-between text-xs"
                        key={w.name}
                      >
                        <span className="font-medium">{w.name}</span>
                        <span className="text-muted-foreground">
                          {w.role} · {w.inducted}
                        </span>
                      </li>
                    ))}
                  </ul>
                </DetailSection>
              </div>
            </div>
          </div>
        )}
      </Frame>
    </PageScroll>
  )
}
