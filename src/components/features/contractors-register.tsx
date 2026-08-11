import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

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
                      "transition-colors hover:bg-accent/40",
                      (c.status === "Expired" || c.status === "Pending") && "opacity-60",
                    )}
                    key={c.company}
                  >
                    <td className="px-4 py-2.5 font-medium text-sm">{c.company}</td>
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
                    <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">
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
      </Frame>
    </PageScroll>
  )
}
