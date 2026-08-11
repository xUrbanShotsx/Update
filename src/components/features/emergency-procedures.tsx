"use client"

import { useState } from "react"
import { PageScroll } from "@/components/shared/page-scroll"
import { Frame } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"
import { DetailModal, DetailRow, DetailSection } from "@/components/shared/detail-modal"

type EmergencyStatus = "Current" | "Review due"

type EmergencyScenario = {
  title: string
  warden: string
  initials: string
  contact: string
  lastDrill: string
  procedure: string
  status: EmergencyStatus
}

type AssemblyPoint = {
  id: string
  location: string
  warden: string
  initials: string
  capacity: number
}

const STATUS_TONE: Record<EmergencyStatus, string> = {
  Current: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Review due": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

const SCENARIOS: EmergencyScenario[] = [
  {
    title: "Medical emergency",
    warden: "Marcus Reid",
    initials: "MR",
    contact: "000 / 1800 044 444",
    lastDrill: "15 Jun 2025",
    procedure:
      "Call 000 immediately and do not move the injured person unless in immediate danger. Qualified first aider to administer aid until ambulance arrives; warden to clear access route and meet paramedics at site entry.",
    status: "Current",
  },
  {
    title: "Fire",
    warden: "Ruth Alvarez",
    initials: "RA",
    contact: "000 / Site: 07 3001 4422",
    lastDrill: "12 May 2025",
    procedure:
      "Activate nearest break-glass alarm and call 000. Warden to initiate evacuation via designated routes; do not re-enter building until Fire & Rescue NSW declares all-clear.",
    status: "Current",
  },
  {
    title: "Chemical spill",
    warden: "Alex Kerr",
    initials: "AK",
    contact: "1800 039 008 (Poisons Info)",
    lastDrill: "3 Apr 2025",
    procedure:
      "Don appropriate PPE and contain spill using site spill kit; do not allow substance to reach stormwater drains. Isolate area of 10 m radius and notify HSR and site manager within 15 minutes.",
    status: "Current",
  },
  {
    title: "Evacuation",
    warden: "Priya Tan",
    initials: "PT",
    contact: "Site: 02 9001 7700",
    lastDrill: "28 Jul 2025",
    procedure:
      "Sound continuous alarm and direct all personnel to nearest assembly point. Warden to conduct roll call within 5 minutes and report any missing persons to emergency services.",
    status: "Current",
  },
  {
    title: "Electrical incident",
    warden: "Jo Lin",
    initials: "JL",
    contact: "000 / Energex: 13 62 62",
    lastDrill: "19 Mar 2025",
    procedure:
      "Do not touch the victim — isolate the supply at the switchboard before approaching. Call 000 and commence CPR only once confirmed the circuit is de-energised and tagged out.",
    status: "Review due",
  },
  {
    title: "Confined space rescue",
    warden: "Sam Okafor",
    initials: "SO",
    contact: "000 / Rescue: 02 8741 3300",
    lastDrill: "22 Feb 2025",
    procedure:
      "Do not enter the space to rescue — call 000 and activate the confined space rescue plan. Maintain communications with the entrant using the installed retrieval line and emergency air supply.",
    status: "Review due",
  },
  {
    title: "Flood / severe weather",
    warden: "Ruth Alvarez",
    initials: "RA",
    contact: "SES: 132 500",
    lastDrill: "10 Jan 2025",
    procedure:
      "Monitor Bureau of Meteorology alerts; cease work and move plant to high ground if flood warning issued. Evacuate all personnel to assembly points and account for all workers before closing site.",
    status: "Current",
  },
  {
    title: "Security / unauthorised access",
    warden: "Marcus Reid",
    initials: "MR",
    contact: "Security: 1300 882 771 / Police: 000",
    lastDrill: "5 May 2025",
    procedure:
      "Do not confront the individual — call site security and notify the project manager immediately. Secure site office and CCTV footage; cooperate fully with police when they arrive.",
    status: "Current",
  },
]

const ASSEMBLY_POINTS: AssemblyPoint[] = [
  {
    id: "AP-A",
    location: "North car park — adjacent to site office, Gate 1",
    warden: "Marcus Reid",
    initials: "MR",
    capacity: 80,
  },
  {
    id: "AP-B",
    location: "South lay-down area — corner of access road and perimeter fence",
    warden: "Ruth Alvarez",
    initials: "RA",
    capacity: 60,
  },
  {
    id: "AP-C",
    location: "East hardstand — designated by orange bollards, Gate 3",
    warden: "Alex Kerr",
    initials: "AK",
    capacity: 40,
  },
  {
    id: "AP-D",
    location: "West footpath — public pavement outside sub-station gate",
    warden: "Priya Tan",
    initials: "PT",
    capacity: 30,
  },
]

function FloorPlanSVG() {
  return (
    <svg viewBox="0 0 360 280" width="100%" style={{ display: "block" }}>
      {/* Building shell */}
      <rect
        x={30}
        y={30}
        width={280}
        height={120}
        rx={4}
        fill="rgba(120,120,120,0.08)"
        stroke="rgba(120,120,120,0.35)"
        strokeWidth={1.5}
      />
      {/* Dividing wall */}
      <line
        x1={165}
        y1={30}
        x2={165}
        y2={150}
        stroke="rgba(120,120,120,0.4)"
        strokeWidth={1.5}
      />
      {/* Room labels */}
      <text
        x={97}
        y={50}
        textAnchor="middle"
        fontSize={9}
        fontWeight="600"
        fill="currentColor"
        opacity={0.65}
      >
        Site Office
      </text>
      <text
        x={252}
        y={50}
        textAnchor="middle"
        fontSize={9}
        fontWeight="600"
        fill="currentColor"
        opacity={0.65}
      >
        Welfare / Lunchroom
      </text>
      {/* Desk in site office */}
      <rect
        x={45}
        y={65}
        width={55}
        height={25}
        rx={3}
        fill="rgba(120,120,120,0.15)"
        stroke="rgba(120,120,120,0.3)"
        strokeWidth={1}
      />
      <text
        x={72}
        y={81}
        textAnchor="middle"
        fontSize={7}
        fill="currentColor"
        opacity={0.5}
      >
        desk
      </text>
      {/* Table in welfare room */}
      <rect
        x={192}
        y={68}
        width={65}
        height={33}
        rx={3}
        fill="rgba(120,120,120,0.15)"
        stroke="rgba(120,120,120,0.3)"
        strokeWidth={1}
      />
      <text
        x={224}
        y={88}
        textAnchor="middle"
        fontSize={7}
        fill="currentColor"
        opacity={0.5}
      >
        table
      </text>
      {/* First aid cross (blue) in site office */}
      <rect x={134} y={92} width={12} height={4} rx={1} fill="#2563eb" />
      <rect x={138} y={88} width={4} height={12} rx={1} fill="#2563eb" />
      <text x={140} y={112} textAnchor="middle" fontSize={7} fill="#2563eb">
        First aid
      </text>
      {/* Fire extinguisher left */}
      <circle cx={46} cy={143} r={8} fill="#dc2626" opacity={0.9} />
      <text
        x={46}
        y={147}
        textAnchor="middle"
        fontSize={8}
        fontWeight="bold"
        fill="white"
      >
        F
      </text>
      {/* Fire extinguisher right */}
      <circle cx={298} cy={143} r={8} fill="#dc2626" opacity={0.9} />
      <text
        x={298}
        y={147}
        textAnchor="middle"
        fontSize={8}
        fontWeight="bold"
        fill="white"
      >
        F
      </text>
      {/* Left exit arrow */}
      <line x1={90} y1={150} x2={90} y2={174} stroke="#16a34a" strokeWidth={2.5} />
      <path
        d="M83 168 L90 176 L97 168"
        stroke="#16a34a"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text x={90} y={192} textAnchor="middle" fontSize={7.5} fill="#16a34a">
        Exit → Assembly Point A
      </text>
      {/* Right exit arrow */}
      <line x1={245} y1={150} x2={245} y2={174} stroke="#16a34a" strokeWidth={2.5} />
      <path
        d="M238 168 L245 176 L252 168"
        stroke="#16a34a"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text x={245} y={192} textAnchor="middle" fontSize={7.5} fill="#16a34a">
        Exit → Assembly Point B
      </text>
      {/* AP-A diamond */}
      <polygon points="90,198 103,211 90,224 77,211" fill="#ea580c" opacity={0.9} />
      <text
        x={90}
        y={238}
        textAnchor="middle"
        fontSize={8}
        fontWeight="600"
        fill="#ea580c"
      >
        AP-A North
      </text>
      {/* AP-B diamond */}
      <polygon points="245,198 258,211 245,224 232,211" fill="#ea580c" opacity={0.9} />
      <text
        x={245}
        y={238}
        textAnchor="middle"
        fontSize={8}
        fontWeight="600"
        fill="#ea580c"
      >
        AP-B South
      </text>
      {/* Legend */}
      <line x1={30} y1={254} x2={46} y2={254} stroke="#16a34a" strokeWidth={2} />
      <path
        d="M40 250 L46 254 L40 258"
        stroke="#16a34a"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
      <text x={51} y={258} fontSize={7.5} fill="currentColor" opacity={0.65}>
        Exit route
      </text>
      <circle cx={120} cy={254} r={6} fill="#dc2626" opacity={0.9} />
      <text x={130} y={258} fontSize={7.5} fill="currentColor" opacity={0.65}>
        Fire equipment
      </text>
      <rect x={213} y={251} width={10} height={3.5} rx={1} fill="#2563eb" />
      <rect x={216.5} y={247.5} width={3} height={10} rx={1} fill="#2563eb" />
      <text x={228} y={258} fontSize={7.5} fill="currentColor" opacity={0.65}>
        First aid
      </text>
      <polygon points="286,249 293,256 286,263 279,256" fill="#ea580c" opacity={0.9} />
      <text x={298} y={259} fontSize={7.5} fill="currentColor" opacity={0.65}>
        Assembly pt
      </text>
    </svg>
  )
}

function AssemblyPointMapSVG({ ap }: { readonly ap: AssemblyPoint }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/30">
      <svg viewBox="0 0 300 140" width="100%" style={{ display: "block" }}>
        {/* Site boundary dashed */}
        <rect
          x={10}
          y={10}
          width={280}
          height={120}
          rx={4}
          fill="rgba(120,120,120,0.06)"
          stroke="rgba(120,120,120,0.25)"
          strokeWidth={1.5}
          strokeDasharray="6,3"
        />
        {/* Building */}
        <rect
          x={40}
          y={25}
          width={120}
          height={75}
          rx={3}
          fill="rgba(120,120,120,0.12)"
          stroke="rgba(120,120,120,0.4)"
          strokeWidth={1.5}
        />
        <text
          x={100}
          y={66}
          textAnchor="middle"
          fontSize={8}
          fill="currentColor"
          opacity={0.6}
        >
          Site Building
        </text>
        {/* Assembly point triangle marker */}
        <polygon points="230,36 246,64 214,64" fill="#ea580c" opacity={0.9} />
        <text
          x={230}
          y={82}
          textAnchor="middle"
          fontSize={11}
          fontWeight="bold"
          fill="#ea580c"
        >
          {ap.id}
        </text>
        {/* Route from building to AP */}
        <path
          d="M160 62 L204 62 L213 55"
          stroke="#16a34a"
          strokeWidth={1.5}
          strokeDasharray="4,2"
          fill="none"
        />
        <path
          d="M209 51 L214 55 L208 58"
          stroke="#16a34a"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
        {/* Label */}
        <text
          x={230}
          y={100}
          textAnchor="middle"
          fontSize={8}
          fill="currentColor"
          opacity={0.65}
        >
          Assembly Point
        </text>
      </svg>
    </div>
  )
}

export function EmergencyProcedures() {
  const [selectedAP, setSelectedAP] = useState<AssemblyPoint | null>(null)

  const current = SCENARIOS.filter((s) => s.status === "Current").length
  const reviewDue = SCENARIOS.filter((s) => s.status === "Review due").length

  return (
    <PageScroll overflows>
      <Frame>
        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Response plans", value: SCENARIOS.length, tone: "" },
            {
              label: "Current",
              value: current,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Review due",
              value: reviewDue,
              tone: "text-amber-600 dark:text-amber-400",
            },
            { label: "Assembly points", value: ASSEMBLY_POINTS.length, tone: "" },
          ].map((stat) => (
            <div className="rounded-xl border bg-card px-4 py-3" key={stat.label}>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("mt-1 text-xl font-semibold tabular-nums", stat.tone)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Emergency scenario cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {SCENARIOS.map((scenario) => (
            <DetailModal
              key={scenario.title}
              trigger={
                <div className="cursor-pointer rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold">{scenario.title}</h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        STATUS_TONE[scenario.status],
                      )}
                    >
                      {scenario.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {scenario.procedure}
                  </p>
                  <div className="mt-3 flex items-center gap-3 border-t pt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                        {scenario.initials}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {scenario.warden}
                      </span>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
                        {scenario.contact}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">
                        Last drill: {scenario.lastDrill}
                      </span>
                    </div>
                  </div>
                </div>
              }
              title={scenario.title}
              subtitle={`Warden: ${scenario.warden} · ${scenario.contact}`}
            >
              <DetailSection label="Procedure">
                <p className="text-sm leading-relaxed">{scenario.procedure}</p>
              </DetailSection>

              <DetailSection label="Evacuation Floor Plan">
                <FloorPlanSVG />
              </DetailSection>

              <DetailSection label="Emergency contacts">
                <DetailRow label="Emergency services" value="000" />
                <DetailRow
                  label="Warden"
                  value={`${scenario.warden} · ${scenario.contact}`}
                />
                <DetailRow label="Poisons information" value="13 11 26" />
              </DetailSection>

              <DetailSection label="Drill history">
                <DetailRow label="Last drill completed" value={scenario.lastDrill} />
                <DetailRow
                  label="Next drill due"
                  value="Within 90 days of last drill"
                  tone="text-amber-600 dark:text-amber-400"
                />
              </DetailSection>
            </DetailModal>
          ))}
        </div>

        {/* Assembly points */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">Assembly points</h2>
          <div className="overflow-hidden rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Point</th>
                  <th className="px-4 py-2.5 font-medium">Location</th>
                  <th className="px-4 py-2.5 font-medium">Warden</th>
                  <th className="px-4 py-2.5 font-medium">Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ASSEMBLY_POINTS.map((ap) => (
                  <tr
                    className="cursor-pointer transition-colors hover:bg-accent/40"
                    key={ap.id}
                    onClick={() => setSelectedAP(ap)}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-semibold">{ap.id}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {ap.location}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {ap.initials}
                        </div>
                        <span className="whitespace-nowrap text-xs">{ap.warden}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">
                      {ap.capacity} persons
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assembly point detail overlay */}
        {selectedAP && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setSelectedAP(null)}
          >
            <div
              className="relative w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-2xl"
              style={{ maxHeight: "min(90vh, 560px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-snug">
                    {selectedAP.id}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {selectedAP.location}
                  </p>
                </div>
                <button
                  aria-label="Close"
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setSelectedAP(null)}
                  type="button"
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
                style={{ maxHeight: "calc(min(90vh, 560px) - 72px)" }}
              >
                <AssemblyPointMapSVG ap={selectedAP} />
                <div className="mt-4">
                  <DetailRow label="Point ID" value={selectedAP.id} />
                  <DetailRow label="Location" value={selectedAP.location} />
                  <DetailRow
                    label="Warden"
                    value={
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {selectedAP.initials}
                        </div>
                        <span>{selectedAP.warden}</span>
                      </div>
                    }
                  />
                  <DetailRow label="Capacity" value={`${selectedAP.capacity} persons`} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Frame>
    </PageScroll>
  )
}
