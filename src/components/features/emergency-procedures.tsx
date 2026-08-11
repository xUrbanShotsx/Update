import { PageScroll } from "@/components/shared/page-scroll"
import { Frame } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

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

export function EmergencyProcedures() {
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
            <div
              className="rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40"
              key={scenario.title}
            >
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
                  <span className="text-xs text-muted-foreground">{scenario.warden}</span>
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
                  <tr className="transition-colors hover:bg-accent/40" key={ap.id}>
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
      </Frame>
    </PageScroll>
  )
}
