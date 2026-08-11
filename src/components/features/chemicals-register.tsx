import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

type SignalWord = "Danger" | "Warning"
type HazardClass = "Flammable" | "Toxic" | "Corrosive" | "Oxidiser"
type ChemicalStatus = "Current" | "Review due" | "Outdated"

type Chemical = {
  product: string
  manufacturer: string
  signalWord: SignalWord
  hazardClass: HazardClass
  sdsVersion: string
  reviewed: string
  sites: string
  status: ChemicalStatus
}

const SIGNAL_TONE: Record<SignalWord, string> = {
  Danger: "bg-red-500/15 text-red-700 dark:text-red-400",
  Warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

const STATUS_TONE: Record<ChemicalStatus, string> = {
  Current: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Review due": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Outdated: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const CHEMICALS: Chemical[] = [
  {
    product: "Diesel fuel (automotive)",
    manufacturer: "BP Australia",
    signalWord: "Danger",
    hazardClass: "Flammable",
    sdsVersion: "v4.1",
    reviewed: "Mar 2025",
    sites: "All sites",
    status: "Current",
  },
  {
    product: "Hydraulic oil ISO VG 46",
    manufacturer: "Castrol Australia",
    signalWord: "Warning",
    hazardClass: "Toxic",
    sdsVersion: "v3.2",
    reviewed: "Jan 2025",
    sites: "Melbourne Depot, Brisbane Terminal",
    status: "Current",
  },
  {
    product: "Concrete release agent (Peri-Clean)",
    manufacturer: "PERI Australia",
    signalWord: "Warning",
    hazardClass: "Corrosive",
    sdsVersion: "v2.0",
    reviewed: "Feb 2025",
    sites: "Sydney Yard, Geelong Site, Melbourne Depot",
    status: "Current",
  },
  {
    product: "Acetylene (dissolved)",
    manufacturer: "BOC Gas",
    signalWord: "Danger",
    hazardClass: "Flammable",
    sdsVersion: "v5.3",
    reviewed: "Apr 2025",
    sites: "Perth Workshop, Brisbane Terminal",
    status: "Current",
  },
  {
    product: "LPG (liquefied petroleum gas)",
    manufacturer: "Elgas",
    signalWord: "Danger",
    hazardClass: "Flammable",
    sdsVersion: "v3.0",
    reviewed: "May 2025",
    sites: "All sites",
    status: "Current",
  },
  {
    product: "Epoxy resin system (Sika-301)",
    manufacturer: "Sika Australia",
    signalWord: "Danger",
    hazardClass: "Corrosive",
    sdsVersion: "v2.4",
    reviewed: "Dec 2024",
    sites: "Melbourne Depot, Sydney Yard",
    status: "Review due",
  },
  {
    product: "Bitumen primer (Protecto-seal)",
    manufacturer: "Dulux Trade",
    signalWord: "Danger",
    hazardClass: "Flammable",
    sdsVersion: "v1.8",
    reviewed: "Nov 2024",
    sites: "Brisbane Terminal, Geelong Site",
    status: "Review due",
  },
  {
    product: "Oxygen (compressed)",
    manufacturer: "BOC Gas",
    signalWord: "Danger",
    hazardClass: "Oxidiser",
    sdsVersion: "v4.0",
    reviewed: "Mar 2025",
    sites: "Perth Workshop",
    status: "Current",
  },
  {
    product: "Sodium hypochlorite solution 12.5%",
    manufacturer: "Orica",
    signalWord: "Danger",
    hazardClass: "Corrosive",
    sdsVersion: "v3.1",
    reviewed: "Feb 2025",
    sites: "Adelaide Depot",
    status: "Current",
  },
  {
    product: "Spray paint (aerosol, line marking)",
    manufacturer: "Rust-Oleum",
    signalWord: "Danger",
    hazardClass: "Flammable",
    sdsVersion: "v2.1",
    reviewed: "Jan 2025",
    sites: "All sites",
    status: "Current",
  },
  {
    product: "Penetrating oil (CRC 5-56)",
    manufacturer: "CRC Industries",
    signalWord: "Warning",
    hazardClass: "Flammable",
    sdsVersion: "v1.6",
    reviewed: "Oct 2024",
    sites: "Melbourne Depot, Perth Workshop",
    status: "Review due",
  },
  {
    product: "Battery acid (sulphuric acid 37%)",
    manufacturer: "GNB Technologies",
    signalWord: "Danger",
    hazardClass: "Corrosive",
    sdsVersion: "v3.5",
    reviewed: "Jun 2025",
    sites: "Brisbane Terminal",
    status: "Current",
  },
  {
    product: "Waterproofing membrane (Ardex WPM 300)",
    manufacturer: "Ardex Australia",
    signalWord: "Warning",
    hazardClass: "Toxic",
    sdsVersion: "v2.2",
    reviewed: "May 2025",
    sites: "Sydney Yard, Melbourne Depot",
    status: "Current",
  },
  {
    product: "Chlorinated solvent (degreaser)",
    manufacturer: "3M Australia",
    signalWord: "Danger",
    hazardClass: "Toxic",
    sdsVersion: "v1.3",
    reviewed: "Aug 2023",
    sites: "Geelong Site",
    status: "Outdated",
  },
]

const CHEMICAL_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Product details", type: "section" },
  {
    name: "product",
    label: "Product name",
    type: "text",
    required: true,
    placeholder: "e.g. Sika Anchorfix-3001",
  },
  {
    name: "manufacturer",
    label: "Manufacturer",
    type: "text",
    required: true,
    placeholder: "e.g. Sika Australia Pty Ltd",
  },
  {
    name: "signal_word",
    label: "Signal word (GHS)",
    type: "select",
    required: true,
    options: ["Danger", "Warning", "Not classified"],
  },
  {
    name: "hazard_class",
    label: "Primary hazard class",
    type: "select",
    required: true,
    options: [
      "Flammable liquid",
      "Flammable solid / gas",
      "Acute toxic",
      "Skin / eye irritant",
      "Corrosive",
      "Oxidiser",
      "Environmental hazard",
      "Compressed gas",
      "Not hazardous",
    ],
  },
  { name: "s2", label: "Storage and use", type: "section" },
  {
    name: "sites",
    label: "Site(s) used",
    type: "text",
    required: true,
    placeholder: "e.g. Melbourne Depot, All sites",
  },
  {
    name: "storage_location",
    label: "Storage location",
    type: "text",
    placeholder: "e.g. Dangerous goods cabinet — site office",
  },
  {
    name: "max_qty",
    label: "Max quantity on site",
    type: "text",
    placeholder: "e.g. 20 L, 4 drums",
  },
  { name: "s3", label: "SDS management", type: "section" },
  {
    name: "sds_version",
    label: "SDS version / date",
    type: "text",
    placeholder: "e.g. v3.0 — Jan 2024",
  },
  { name: "sds_reviewed", label: "SDS last reviewed", type: "date", required: true },
  { name: "sds_next_review", label: "Next review due", type: "date", required: true },
]

export function ChemicalsRegister() {
  const reviewDue = CHEMICALS.filter((c) => c.status === "Review due")
  const outdated = CHEMICALS.filter((c) => c.status === "Outdated")
  const siteSet = new Set(
    CHEMICALS.flatMap((c) =>
      c.sites === "All sites"
        ? [
            "Melbourne Depot",
            "Sydney Yard",
            "Brisbane Terminal",
            "Perth Workshop",
            "Adelaide Depot",
            "Geelong Site",
          ]
        : c.sites.split(", "),
    ),
  )

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Chemical / SDS" fields={CHEMICAL_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total substances", value: CHEMICALS.length, tone: "" },
            {
              label: "Review due",
              value: reviewDue.length,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Outdated",
              value: outdated.length,
              tone: "text-red-600 dark:text-red-400",
            },
            { label: "Sites covered", value: siteSet.size, tone: "" },
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
                  <th className="px-4 py-2.5 font-medium">Product</th>
                  <th className="px-4 py-2.5 font-medium">Manufacturer</th>
                  <th className="px-4 py-2.5 font-medium">Signal word</th>
                  <th className="px-4 py-2.5 font-medium">Hazard class</th>
                  <th className="px-4 py-2.5 font-medium">SDS version</th>
                  <th className="px-4 py-2.5 font-medium">Reviewed</th>
                  <th className="px-4 py-2.5 font-medium">Site(s)</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {CHEMICALS.map((chem) => (
                  <tr
                    className={cn(
                      "transition-colors hover:bg-accent/40",
                      chem.status === "Outdated" && "opacity-60",
                    )}
                    key={chem.product}
                  >
                    <td className="px-4 py-2.5 text-sm font-medium">{chem.product}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {chem.manufacturer}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          SIGNAL_TONE[chem.signalWord],
                        )}
                      >
                        {chem.signalWord}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {chem.hazardClass}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {chem.sdsVersion}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {chem.reviewed}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {chem.sites}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[chem.status],
                        )}
                      >
                        {chem.status}
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
