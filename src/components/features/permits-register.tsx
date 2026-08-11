"use client"
import { useState } from "react"
import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"
import { DetailSection, DetailRow } from "@/components/shared/detail-modal"

type PermitType =
  | "Hot work"
  | "Confined space"
  | "Excavation"
  | "Heights"
  | "Electrical isolation"
  | "Asbestos"

type PermitStatus = "Active" | "Closed" | "Cancelled" | "Expired"

type Permit = {
  ref: string
  permitType: PermitType
  site: string
  issuedTo: string
  issuedToInitials: string
  issued: string
  expires: string
  issuer: string
  status: PermitStatus
}

const STATUS_TONE: Record<PermitStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Closed: "bg-fill text-muted-foreground",
  Cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
  Expired: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

const PERMIT_LOCATION: Record<PermitType, string> = {
  "Hot work": "Welding bay — Grid D3",
  Heights: "Level 2 formwork deck",
  Excavation: "Trench A — northern boundary",
  "Electrical isolation": "Main switchboard room",
  "Confined space": "Stormwater pit — manhole M-07",
  Asbestos: "Roof sheeting zone",
}

const PERMIT_CONDITIONS: Record<PermitType, string[]> = {
  "Hot work": [
    "Fire extinguisher within 1 m of work area at all times",
    "Hot work watch maintained for 30 min post-completion",
    "Work area cleared of all combustible materials",
    "Standby person present throughout duration",
    "Work stops immediately if wind speed exceeds 15 km/h",
  ],
  Heights: [
    "Safety net or scaffold in place and inspected prior to start",
    "Fall arrest system worn and anchor points pre-checked",
    "Exclusion zone established below work area",
    "Pre-start check of all anchorage points completed",
    "Buddy system enforced — no solo work at heights",
  ],
  Excavation: [
    "Dial Before You Dig confirmation obtained prior to works",
    "Shoring or batter angles in place as per design",
    "No entry into excavations with walls > 1.5 m without shoring",
    "Gas monitor present and calibrated at site entry",
    "Traffic management plan active and signage in place",
  ],
  "Electrical isolation": [
    "LOTO (Lockout/Tagout) applied at switchboard before work",
    "Danger tag applied by authorised person",
    "Test Before Touch procedure followed",
    "Qualified electrician only — no unlicensed work permitted",
    "Stored energy (capacitors, UPS) verified discharged",
  ],
  "Confined space": [
    "Atmospheric testing every 30 min during occupancy",
    "Standby person stationed outside entry point at all times",
    "Retrieval equipment (tripod/winch) in place and ready",
    "Emergency rescue plan confirmed and communicated",
    "Permit displayed at entry point throughout works",
  ],
  Asbestos: [
    "Asbestos hygienist on site and air monitoring active",
    "PPE minimum class P2 respirator worn at all times",
    "Decontamination unit set up at entry/exit point",
    "Exclusion zone of 10 m radius established and signed",
    "Waste double-bagged, labelled and segregated for licensed disposal",
  ],
}

function getSignoffs(permit: Permit) {
  const timeParts = permit.issued.split(", ")
  const issuedDate = timeParts[0] ?? permit.issued
  const time = timeParts[1] ?? "07:00"
  const rows: Array<{ name: string; role: string; signed: string; time: string }> = [
    { name: permit.issuer, role: "Issuing Authority", signed: issuedDate, time },
    { name: permit.issuedTo, role: "Permit Holder", signed: issuedDate, time },
  ]
  if (permit.permitType === "Hot work" || permit.permitType === "Confined space") {
    rows.push({
      name: "Luke James",
      role: "Standby Person / Attendant",
      signed: issuedDate,
      time,
    })
  }
  if (permit.permitType === "Asbestos") {
    rows.push({
      name: "Dr. Claire Webb",
      role: "Asbestos Hygienist",
      signed: issuedDate,
      time,
    })
  }
  return rows
}

const PERMITS: Permit[] = [
  {
    ref: "PTW-112",
    permitType: "Hot work",
    site: "Brisbane Terminal",
    issuedTo: "Darren Voss",
    issuedToInitials: "DV",
    issued: "11 Aug, 07:00",
    expires: "11 Aug, 17:00",
    issuer: "Marcus Reid",
    status: "Active",
  },
  {
    ref: "PTW-111",
    permitType: "Heights",
    site: "Sydney Yard",
    issuedTo: "Carl Nguyen",
    issuedToInitials: "CN",
    issued: "11 Aug, 06:30",
    expires: "11 Aug, 16:30",
    issuer: "Priya Tan",
    status: "Active",
  },
  {
    ref: "PTW-110",
    permitType: "Excavation",
    site: "Melbourne Depot",
    issuedTo: "Ben Stavros",
    issuedToInitials: "BS",
    issued: "11 Aug, 07:15",
    expires: "14 Aug, 17:00",
    issuer: "Alex Kerr",
    status: "Active",
  },
  {
    ref: "PTW-109",
    permitType: "Electrical isolation",
    site: "Geelong Site",
    issuedTo: "Natasha Cole",
    issuedToInitials: "NC",
    issued: "10 Aug, 08:00",
    expires: "12 Aug, 17:00",
    issuer: "Ruth Alvarez",
    status: "Expired",
  },
  {
    ref: "PTW-108",
    permitType: "Confined space",
    site: "Perth Workshop",
    issuedTo: "Phil O'Brien",
    issuedToInitials: "PO",
    issued: "8 Aug, 07:00",
    expires: "8 Aug, 15:00",
    issuer: "Jo Lin",
    status: "Closed",
  },
  {
    ref: "PTW-107",
    permitType: "Hot work",
    site: "Adelaide Depot",
    issuedTo: "Troy Marsh",
    issuedToInitials: "TM",
    issued: "7 Aug, 08:30",
    expires: "7 Aug, 17:00",
    issuer: "Sam Okafor",
    status: "Closed",
  },
  {
    ref: "PTW-106",
    permitType: "Asbestos",
    site: "Melbourne Depot",
    issuedTo: "Kim Fraser",
    issuedToInitials: "KF",
    issued: "5 Aug, 07:00",
    expires: "7 Aug, 17:00",
    issuer: "Alex Kerr",
    status: "Closed",
  },
  {
    ref: "PTW-105",
    permitType: "Heights",
    site: "Brisbane Terminal",
    issuedTo: "Darren Voss",
    issuedToInitials: "DV",
    issued: "4 Aug, 07:00",
    expires: "4 Aug, 17:00",
    issuer: "Marcus Reid",
    status: "Expired",
  },
  {
    ref: "PTW-104",
    permitType: "Excavation",
    site: "Sydney Yard",
    issuedTo: "Carl Nguyen",
    issuedToInitials: "CN",
    issued: "1 Aug, 06:30",
    expires: "3 Aug, 17:00",
    issuer: "Priya Tan",
    status: "Expired",
  },
  {
    ref: "PTW-103",
    permitType: "Electrical isolation",
    site: "Perth Workshop",
    issuedTo: "Natasha Cole",
    issuedToInitials: "NC",
    issued: "30 Jul, 08:00",
    expires: "30 Jul, 16:00",
    issuer: "Jo Lin",
    status: "Expired",
  },
  {
    ref: "PTW-102",
    permitType: "Confined space",
    site: "Geelong Site",
    issuedTo: "Ben Stavros",
    issuedToInitials: "BS",
    issued: "28 Jul, 07:30",
    expires: "28 Jul, 15:30",
    issuer: "Ruth Alvarez",
    status: "Cancelled",
  },
  {
    ref: "PTW-101",
    permitType: "Hot work",
    site: "Adelaide Depot",
    issuedTo: "Troy Marsh",
    issuedToInitials: "TM",
    issued: "25 Jul, 08:00",
    expires: "25 Jul, 17:00",
    issuer: "Sam Okafor",
    status: "Closed",
  },
]

const PERMIT_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Permit details", type: "section" },
  {
    name: "permit_type",
    label: "Permit type",
    type: "select",
    required: true,
    options: [
      "Hot work / welding",
      "Confined space entry",
      "Live electrical work",
      "Excavation / ground penetration",
      "Working at height",
      "Crane lift / engineered lift",
      "Energised systems isolation",
      "Traffic management",
      "Environmental works",
    ],
  },
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
    name: "work_location",
    label: "Work location description",
    type: "text",
    required: true,
    placeholder: "e.g. Level 3 plant room, Grid D5 excavation",
  },
  { name: "s2", label: "People", type: "section" },
  {
    name: "issued_to",
    label: "Issued to (permit holder)",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  {
    name: "issuing_authority",
    label: "Issuing authority (site supervisor)",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  { name: "s3", label: "Validity period", type: "section" },
  { name: "valid_from_date", label: "Valid from — date", type: "date", required: true },
  { name: "valid_from_time", label: "Valid from — time", type: "time", required: true },
  { name: "expires_date", label: "Expires — date", type: "date", required: true },
  { name: "expires_time", label: "Expires — time", type: "time", required: true },
  {
    name: "swms_ref",
    label: "SWMS reference",
    type: "text",
    placeholder: "e.g. SWMS-2024-0041",
  },
]

export function PermitsRegister() {
  const [selected, setSelected] = useState<Permit | null>(null)

  const active = PERMITS.filter((p) => p.status === "Active")
  const issuedToday = PERMITS.filter((p) => p.issued.startsWith("11 Aug"))
  const expired = PERMITS.filter((p) => p.status === "Expired")
  const cancelled = PERMITS.filter((p) => p.status === "Cancelled")

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Permit to Work" fields={PERMIT_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Active",
              value: active.length,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            { label: "Issued today", value: issuedToday.length, tone: "" },
            {
              label: "Expired",
              value: expired.length,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Cancelled",
              value: cancelled.length,
              tone: "text-red-600 dark:text-red-400",
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
                  <th className="px-4 py-2.5 font-medium">Ref</th>
                  <th className="px-4 py-2.5 font-medium">Permit type</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Issued to</th>
                  <th className="px-4 py-2.5 font-medium">Issued</th>
                  <th className="px-4 py-2.5 font-medium">Expires</th>
                  <th className="px-4 py-2.5 font-medium">Issuer</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {PERMITS.map((permit) => (
                  <tr
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-accent/40",
                      (permit.status === "Closed" || permit.status === "Cancelled") &&
                        "opacity-50",
                    )}
                    key={permit.ref}
                    onClick={() => setSelected(permit)}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {permit.ref}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-sm">
                      {permit.permitType}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {permit.site}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {permit.issuedToInitials}
                        </div>
                        <span className="whitespace-nowrap text-xs">
                          {permit.issuedTo}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {permit.issued}
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-2.5 text-xs",
                        permit.status === "Expired"
                          ? "font-medium text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {permit.expires}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {permit.issuer}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[permit.status],
                        )}
                      >
                        {permit.status}
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
                  <h2 className="text-base font-semibold">
                    {selected.ref} — {selected.permitType} Permit
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {selected.site} · Issued to {selected.issuedTo}
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
                <DetailSection label="Permit Details">
                  <DetailRow label="Permit ref" value={selected.ref} />
                  <DetailRow label="Permit type" value={selected.permitType} />
                  <DetailRow label="Site" value={selected.site} />
                  <DetailRow
                    label="Location / work area"
                    value={PERMIT_LOCATION[selected.permitType]}
                  />
                  <DetailRow label="Issued to" value={selected.issuedTo} />
                  <DetailRow label="Issuing authority" value={selected.issuer} />
                  <DetailRow label="Valid from" value={selected.issued} />
                  <DetailRow label="Expires" value={selected.expires} />
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
                </DetailSection>

                <DetailSection label="Conditions & Controls">
                  <ul className="space-y-1.5">
                    {PERMIT_CONDITIONS[selected.permitType].map((cond) => (
                      <li className="flex items-start gap-2 text-xs" key={cond}>
                        <span className="mt-0.5 shrink-0 text-muted-foreground">•</span>
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </DetailSection>

                <DetailSection label="SWMS Reference">
                  <p className="text-xs text-muted-foreground">
                    SWMS-{selected.ref.replace("PTW-", "")} — {selected.permitType} Safe
                    Work Method Statement · Revision 3 · Approved by {selected.issuer}
                  </p>
                </DetailSection>

                <DetailSection label="Sign-off Record">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-left text-[10px] text-muted-foreground">
                        <th className="pb-1.5 font-medium">Name</th>
                        <th className="pb-1.5 font-medium">Role</th>
                        <th className="pb-1.5 font-medium">Signed</th>
                        <th className="pb-1.5 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {getSignoffs(selected).map((row) => (
                        <tr key={row.name}>
                          <td className="py-1.5 font-medium">{row.name}</td>
                          <td className="py-1.5 text-muted-foreground">{row.role}</td>
                          <td className="py-1.5 text-muted-foreground">{row.signed}</td>
                          <td className="py-1.5 text-muted-foreground">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DetailSection>
              </div>
            </div>
          </div>
        )}
      </Frame>
    </PageScroll>
  )
}
