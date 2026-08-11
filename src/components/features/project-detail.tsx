import { Frame } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/scope"

type Phase = {
  label: string
  start: string
  finish: string
  pct: number
  status: "complete" | "active" | "upcoming"
}

type DiaryEntry = {
  date: string
  author: string
  note: string
  weather: string
  crew: number
}

type Obligation = {
  ref: string
  description: string
  due: string
  status: "open" | "submitted" | "overdue"
}

type ProjectData = {
  contractValue: string
  contractNo: string
  pcDate: string
  started: string
  pm: string
  site: string
  phases: Phase[]
  diary: DiaryEntry[]
  obligations: Obligation[]
}

const OBLIGATION_TONE: Record<string, string> = {
  open: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  submitted: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  overdue: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const PROJECT_DATA: Record<string, ProjectData> = {
  "m80-upgrade": {
    contractValue: "$34.2M",
    contractNo: "MRPV-2023-0441",
    pcDate: "15 Nov 2025",
    started: "3 Mar 2024",
    pm: "Alex Kerr",
    site: "Melbourne Depot",
    phases: [
      {
        label: "Mobilisation",
        start: "3 Mar",
        finish: "31 Mar",
        pct: 100,
        status: "complete",
      },
      {
        label: "Earthworks",
        start: "1 Apr",
        finish: "30 Jun",
        pct: 100,
        status: "complete",
      },
      {
        label: "Drainage",
        start: "1 Jun",
        finish: "31 Aug",
        pct: 100,
        status: "complete",
      },
      { label: "Pavements", start: "1 Aug", finish: "31 Oct", pct: 72, status: "active" },
      {
        label: "Line marking & signs",
        start: "1 Oct",
        finish: "15 Nov",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "Defects liability",
        start: "15 Nov",
        finish: "15 May 2026",
        pct: 0,
        status: "upcoming",
      },
    ],
    diary: [
      {
        date: "Today, 17:30",
        author: "Alex Kerr",
        note: "Asphalt overlay, Ch 2+100–2+400, machine laid. Traffic control operating. No incidents.",
        weather: "Fine 22°",
        crew: 14,
      },
      {
        date: "Yesterday, 17:15",
        author: "Alex Kerr",
        note: "Subbase compaction tests — all passing. Kerb and channel complete, Ch 1+900–2+100.",
        weather: "Partly cloudy 18°",
        crew: 12,
      },
      {
        date: "Mon 5 Aug",
        author: "Alex Kerr",
        note: "Crane mobilised for sign gantry lift. Delayed 1h — traffic management permit amendment.",
        weather: "Fine 20°",
        crew: 16,
      },
    ],
    obligations: [
      {
        ref: "ENV-014",
        description: "Monthly water quality monitoring report to EPA",
        due: "31 Aug 2025",
        status: "submitted",
      },
      {
        ref: "ENV-015",
        description: "Quarterly noise monitoring — residential interface",
        due: "30 Sep 2025",
        status: "open",
      },
      {
        ref: "WHS-009",
        description: "Revised SWMS — asphalt paving adjacent live traffic",
        due: "12 Aug 2025",
        status: "open",
      },
      {
        ref: "QUAL-022",
        description: "ITP sign-off — sub-base Layer 3, Ch 2+000–2+400",
        due: "8 Aug 2025",
        status: "overdue",
      },
    ],
  },
  "westgate-ramps": {
    contractValue: "$61.8M",
    contractNo: "WGTP-2022-0118",
    pcDate: "30 Jun 2025",
    started: "14 Nov 2022",
    pm: "Priya Tan",
    site: "Sydney Yard",
    phases: [
      {
        label: "Enabling works",
        start: "Nov 22",
        finish: "Feb 23",
        pct: 100,
        status: "complete",
      },
      {
        label: "Piling & foundations",
        start: "Jan 23",
        finish: "Jul 23",
        pct: 100,
        status: "complete",
      },
      {
        label: "Structural concrete",
        start: "Jun 23",
        finish: "Dec 23",
        pct: 100,
        status: "complete",
      },
      {
        label: "Post-tensioning",
        start: "Oct 23",
        finish: "Mar 24",
        pct: 100,
        status: "complete",
      },
      {
        label: "Deck finishes",
        start: "Feb 24",
        finish: "Jun 25",
        pct: 88,
        status: "active",
      },
      {
        label: "PC & handover",
        start: "Jun 25",
        finish: "Jun 25",
        pct: 0,
        status: "upcoming",
      },
    ],
    diary: [
      {
        date: "Today, 18:00",
        author: "Priya Tan",
        note: "Waterproof membrane application, Deck D — 60% complete. NCR-029 remediation reviewed by design team.",
        weather: "Cloudy 17°",
        crew: 22,
      },
      {
        date: "Yesterday, 17:45",
        author: "Priya Tan",
        note: "Traffic lane re-configuration for deck work. Western shoulder closed, traffic management in place.",
        weather: "Fine 19°",
        crew: 20,
      },
      {
        date: "Fri 8 Aug",
        author: "Priya Tan",
        note: "Post-tension grouting — anchor zone R4. All readings within spec.",
        weather: "Fine 21°",
        crew: 18,
      },
    ],
    obligations: [
      {
        ref: "ENV-031",
        description: "Noise & vibration report — Port Melbourne interface",
        due: "15 Aug 2025",
        status: "open",
      },
      {
        ref: "QUAL-058",
        description: "Waterproof membrane ITP — Deck D",
        due: "9 Aug 2025",
        status: "overdue",
      },
      {
        ref: "TRAFFIC-007",
        description: "Updated TMP submission for shoulder closure extension",
        due: "20 Aug 2025",
        status: "submitted",
      },
    ],
  },
  "sydney-metro-fitout": {
    contractValue: "$18.5M",
    contractNo: "TFNSW-2024-0033",
    pcDate: "28 Feb 2026",
    started: "6 Jan 2025",
    pm: "Priya Tan",
    site: "Sydney Yard",
    phases: [
      {
        label: "Hoarding & protection",
        start: "6 Jan",
        finish: "31 Jan",
        pct: 100,
        status: "complete",
      },
      {
        label: "Mechanical rough-in",
        start: "1 Feb",
        finish: "30 Apr",
        pct: 100,
        status: "complete",
      },
      {
        label: "Electrical rough-in",
        start: "15 Feb",
        finish: "31 May",
        pct: 100,
        status: "complete",
      },
      {
        label: "Platform fit-out",
        start: "1 May",
        finish: "31 Oct",
        pct: 54,
        status: "active",
      },
      {
        label: "Systems integration & testing",
        start: "1 Nov",
        finish: "31 Jan 2026",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "PC & handover",
        start: "1 Feb 2026",
        finish: "28 Feb 2026",
        pct: 0,
        status: "upcoming",
      },
    ],
    diary: [
      {
        date: "Today, 16:30",
        author: "Priya Tan",
        note: "Platform 3 tactile installation — 80% complete. Platform 4 ceiling grid commenced. No lost time.",
        weather: "N/A (underground)",
        crew: 31,
      },
      {
        date: "Yesterday",
        author: "Priya Tan",
        note: "Safety walk with TfNSW site rep — 3 minor observations raised, all assigned, target close-out this week.",
        weather: "N/A (underground)",
        crew: 28,
      },
      {
        date: "Fri 8 Aug",
        author: "Priya Tan",
        note: "Permit to work issued for hot works — welding of handrail brackets, Platform 3.",
        weather: "N/A (underground)",
        crew: 29,
      },
    ],
    obligations: [
      {
        ref: "IND-014",
        description: "TfNSW principal contractor induction — 4 new starters",
        due: "13 Aug 2025",
        status: "open",
      },
      {
        ref: "QUAL-071",
        description: "ITP hold point — tactile indicator installation, Platform 3",
        due: "11 Aug 2025",
        status: "open",
      },
      {
        ref: "FIRE-003",
        description: "Hot works permit renewal — monthly",
        due: "31 Aug 2025",
        status: "submitted",
      },
    ],
  },
  "brisbane-wharf": {
    contractValue: "$12.4M",
    contractNo: "POB-2025-0007",
    pcDate: "30 Sep 2026",
    started: "1 Aug 2025",
    pm: "Marcus Reid",
    site: "Brisbane Terminal",
    phases: [
      {
        label: "Mobilisation",
        start: "1 Aug 2025",
        finish: "31 Aug 2025",
        pct: 40,
        status: "active",
      },
      {
        label: "Demolition & enabling",
        start: "1 Sep 2025",
        finish: "31 Oct 2025",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "Marine piling",
        start: "1 Oct 2025",
        finish: "28 Feb 2026",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "Deck structure",
        start: "1 Jan 2026",
        finish: "30 Jun 2026",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "Services & fit-out",
        start: "1 Jun 2026",
        finish: "30 Sep 2026",
        pct: 0,
        status: "upcoming",
      },
    ],
    diary: [
      {
        date: "Today, 17:00",
        author: "Marcus Reid",
        note: "Site establishment commenced. Laydown area pegged and fenced. Induction of 6 personnel.",
        weather: "Fine 26°",
        crew: 6,
      },
      {
        date: "Yesterday",
        author: "Marcus Reid",
        note: "Initial safety inductions — 100% complete. SWMS register reviewed and accepted.",
        weather: "Fine 28°",
        crew: 4,
      },
    ],
    obligations: [
      {
        ref: "MARINE-001",
        description: "Marine works consent — Dept of Transport & Main Roads",
        due: "20 Aug 2025",
        status: "open",
      },
      {
        ref: "ENV-001",
        description: "Construction environmental management plan submission",
        due: "15 Aug 2025",
        status: "open",
      },
      {
        ref: "WHS-001",
        description: "Principal contractor WHS management plan",
        due: "1 Aug 2025",
        status: "submitted",
      },
    ],
  },
  "perth-depot-extension": {
    contractValue: "$8.7M",
    contractNo: "DWN-2024-0092",
    pcDate: "31 Mar 2026",
    started: "15 May 2024",
    pm: "Jo Lin",
    site: "Perth Workshop",
    phases: [
      {
        label: "Civil & slab",
        start: "15 May",
        finish: "31 Aug",
        pct: 100,
        status: "complete",
      },
      {
        label: "Structural steel",
        start: "1 Aug",
        finish: "30 Nov",
        pct: 100,
        status: "complete",
      },
      {
        label: "Cladding & roofing",
        start: "1 Nov",
        finish: "31 Jan 2025",
        pct: 100,
        status: "complete",
      },
      {
        label: "Services fit-out",
        start: "15 Jan 2025",
        finish: "31 Aug 2025",
        pct: 81,
        status: "active",
      },
      {
        label: "Commissioning",
        start: "1 Sep 2025",
        finish: "31 Jan 2026",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "PC",
        start: "1 Mar 2026",
        finish: "31 Mar 2026",
        pct: 0,
        status: "upcoming",
      },
    ],
    diary: [
      {
        date: "Today, 16:00",
        author: "Jo Lin",
        note: "Electrical switchboard installation — board 2 of 3 complete. Compressed air reticulation 90% done.",
        weather: "Fine 24°",
        crew: 9,
      },
      {
        date: "Yesterday",
        author: "Jo Lin",
        note: "NCR-024 (reo spacing) remediation accepted by inspector. Closed out.",
        weather: "Fine 22°",
        crew: 8,
      },
    ],
    obligations: [
      {
        ref: "QUAL-044",
        description: "Concrete ITP signoff — maintenance pit lining",
        due: "14 Aug 2025",
        status: "submitted",
      },
      {
        ref: "ELEC-007",
        description: "Electrical installation inspection — AS/NZS 3000",
        due: "30 Sep 2025",
        status: "open",
      },
    ],
  },
  "adelaide-culverts": {
    contractValue: "$5.1M",
    contractNo: "DPTI-2023-0318",
    pcDate: "31 May 2025",
    started: "10 Jul 2023",
    pm: "Sam Okafor",
    site: "Adelaide Depot",
    phases: [
      {
        label: "Traffic management",
        start: "Jul 23",
        finish: "Aug 23",
        pct: 100,
        status: "complete",
      },
      {
        label: "Excavation & demolition",
        start: "Aug 23",
        finish: "Nov 23",
        pct: 100,
        status: "complete",
      },
      {
        label: "Culvert installation",
        start: "Oct 23",
        finish: "Feb 24",
        pct: 100,
        status: "complete",
      },
      {
        label: "Backfill & reinstatement",
        start: "Feb 24",
        finish: "Apr 24",
        pct: 100,
        status: "complete",
      },
      {
        label: "Defects liability period",
        start: "31 May 24",
        finish: "31 May 25",
        pct: 100,
        status: "complete",
      },
    ],
    diary: [
      {
        date: "30 May 2025",
        author: "Sam Okafor",
        note: "Final inspection complete. All defects cleared. PC certificate issued. Project closed.",
        weather: "Fine 16°",
        crew: 2,
      },
      {
        date: "14 May 2025",
        author: "Sam Okafor",
        note: "Close-out inspection with DPTI — 2 minor defects noted, corrected same day.",
        weather: "Cloudy 14°",
        crew: 4,
      },
    ],
    obligations: [
      {
        ref: "DEFECT-001",
        description: "Defects liability period — concluded 31 May 2025",
        due: "31 May 2025",
        status: "submitted",
      },
      {
        ref: "AS-BUILT-004",
        description: "As-built drawings submitted to DPTI",
        due: "30 Jun 2025",
        status: "submitted",
      },
    ],
  },
  "geelong-bypass": {
    contractValue: "$22.3M",
    contractNo: "MRPV-2025-0108",
    pcDate: "30 Jun 2027",
    started: "TBC",
    pm: "Ruth Alvarez",
    site: "Geelong Site",
    phases: [
      {
        label: "Pre-construction",
        start: "Aug 2025",
        finish: "Nov 2025",
        pct: 15,
        status: "active",
      },
      {
        label: "Enabling works",
        start: "Dec 2025",
        finish: "Feb 2026",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "Earthworks",
        start: "Jan 2026",
        finish: "Jun 2026",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "Drainage & pavements",
        start: "May 2026",
        finish: "Nov 2026",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "Structures",
        start: "Apr 2026",
        finish: "Mar 2027",
        pct: 0,
        status: "upcoming",
      },
      {
        label: "PC & handover",
        start: "Apr 2027",
        finish: "Jun 2027",
        pct: 0,
        status: "upcoming",
      },
    ],
    diary: [
      {
        date: "Today, 15:00",
        author: "Ruth Alvarez",
        note: "Project initiation meeting with MRPV. Programme, IFC drawings and CEMP scope confirmed.",
        weather: "Fine 15°",
        crew: 2,
      },
    ],
    obligations: [
      {
        ref: "PLAN-001",
        description: "Project execution plan submission to MRPV",
        due: "22 Aug 2025",
        status: "open",
      },
      {
        ref: "ENV-001",
        description: "Environmental management plan — pre-construction",
        due: "31 Aug 2025",
        status: "open",
      },
      {
        ref: "WHS-001",
        description: "WHS management plan for pre-construction activities",
        due: "11 Aug 2025",
        status: "submitted",
      },
    ],
  },
}

const DEFAULT_DATA: ProjectData = {
  contractValue: "$14.8M",
  contractNo: "REF-2024-0001",
  pcDate: "30 Jun 2026",
  started: "1 Jan 2025",
  pm: "Site Lead",
  site: "TBC",
  phases: [
    { label: "Mobilisation", start: "Jan", finish: "Feb", pct: 100, status: "complete" },
    { label: "Construction", start: "Feb", finish: "Dec", pct: 60, status: "active" },
    {
      label: "Commissioning",
      start: "Nov",
      finish: "Jun 2026",
      pct: 0,
      status: "upcoming",
    },
  ],
  diary: [
    {
      date: "Today",
      author: "Site Lead",
      note: "Works progressing on programme. No incidents.",
      weather: "Fine",
      crew: 12,
    },
  ],
  obligations: [
    {
      ref: "WHS-001",
      description: "WHS management plan review",
      due: "31 Aug 2025",
      status: "open",
    },
  ],
}

const STAGE_TONE: Record<string, string> = {
  "On site": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Mobilising: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Awarded: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  PC: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Tendered: "bg-fill text-muted-foreground",
  Closed: "bg-fill-strong text-muted-foreground",
}

export function ProjectDetail({ project }: { readonly project: Project }) {
  const d = PROJECT_DATA[project.slug] ?? DEFAULT_DATA

  return (
    <PageScroll overflows>
      <Frame>
        {/* KPI strip */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">Contract value</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{d.contractValue}</p>
            <p className="mt-1 text-xs text-muted-foreground">{d.contractNo}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">Stage</p>
            <p className="mt-2">
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-sm font-medium",
                  STAGE_TONE[project.stage] ?? "bg-fill text-muted-foreground",
                )}
              >
                {project.stage}
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Since {d.started}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">Practical completion</p>
            <p className="mt-2 text-2xl font-semibold">{d.pcDate}</p>
            <p className="mt-1 text-xs text-muted-foreground">Target date</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">Project manager</p>
            <p className="mt-2 text-2xl font-semibold">{d.pm}</p>
            <p className="mt-1 text-xs text-muted-foreground">{d.site}</p>
          </div>
        </div>

        {/* Programme */}
        <div className="mt-2 overflow-hidden rounded-xl border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-medium">Programme</h3>
          </div>
          <div className="divide-y">
            {d.phases.map((phase) => (
              <div className="flex items-center gap-4 px-4 py-3" key={phase.label}>
                <div className="w-40 shrink-0">
                  <p className="text-sm font-medium">{phase.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {phase.start} → {phase.finish}
                  </p>
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-fill">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full",
                        phase.status === "complete"
                          ? "bg-emerald-500"
                          : phase.status === "active"
                            ? "bg-blue-500"
                            : "bg-fill",
                      )}
                      style={{ width: `${phase.pct}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {phase.pct}%
                  </span>
                </div>
                <span
                  className={cn(
                    "w-20 shrink-0 text-right text-xs font-medium",
                    phase.status === "complete"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : phase.status === "active"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground/60",
                  )}
                >
                  {phase.status === "complete"
                    ? "Complete"
                    : phase.status === "active"
                      ? "In progress"
                      : "Upcoming"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Diary + Obligations */}
        <div className="mt-2 grid gap-2 lg:grid-cols-2">
          {/* Site diary */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Site diary</h3>
            </div>
            <div className="divide-y">
              {d.diary.map((entry, i) => (
                <div className="px-4 py-3" key={i}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {entry.date}
                    </span>
                    <span className="text-xs text-muted-foreground">{entry.weather}</span>
                  </div>
                  <p className="mt-1 text-sm leading-snug">{entry.note}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{entry.author}</span>
                    <span>·</span>
                    <span>{entry.crew} crew on site</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Obligations */}
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Obligations</h3>
            </div>
            <div className="divide-y">
              {d.obligations.map((ob) => (
                <div className="flex items-start gap-3 px-4 py-3" key={ob.ref}>
                  <span
                    className={cn(
                      "mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                      OBLIGATION_TONE[ob.status] ?? "bg-fill text-muted-foreground",
                    )}
                  >
                    {ob.status}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{ob.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {ob.ref} · Due {ob.due}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
