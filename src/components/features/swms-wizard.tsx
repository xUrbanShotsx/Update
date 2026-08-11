"use client"

import { useState, useEffect, useRef } from "react"
import { CheckIcon, ChevronRightIcon, LoaderCircleIcon, SparklesIcon, FileTextIcon, UsersIcon, PenLineIcon } from "lucide-react"

import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

const HRCW_ACTIVITIES = [
  "Working at height — edge protection",
  "Excavation over 1.5m",
  "Confined space entry",
  "Crane lifts over live traffic",
  "Demolition — partial",
  "Asbestos removal — Class B",
  "Live electrical isolation",
  "Concrete pumping",
  "Traffic management — arterial",
  "Precast concrete installation",
  "Tilt-up construction",
  "Work on or near energised electrical installations",
  "Work in or near a shaft or trench",
  "Tunnelling",
  "Work involving explosives",
  "Work on pressurised gas distribution mains",
  "Work on telecommunications towers",
  "Work in areas with contaminated or flammable atmosphere",
]

const SITES = [
  "Melbourne Depot",
  "Sydney Yard",
  "Brisbane Terminal",
  "Perth Workshop",
  "Adelaide Depot",
  "Geelong Site",
]

const PRINCIPAL_CONTRACTORS = [
  "Lendlease",
  "John Holland",
  "CPB Contractors",
  "BMD Group",
  "McConnell Dowell",
  "Laing O'Rourke",
  "Own company",
]

// Generated SWMS content — what Briesa produces from the job details
const GENERATED_HAZARDS = [
  {
    id: "H1",
    hazard: "Fall from height — unprotected leading edge",
    likelihood: "Possible",
    consequence: "Major",
    inherent: "High",
    controls: [
      "Install perimeter edge protection (AS 4994.1) minimum 900mm height before work commences",
      "Secure all penetrations with covers rated to 2.5kN point load",
      "Harness and lanyard required within 2m of unprotected edge — anchor to rated point only",
      "Working at heights induction current for all workers on site",
    ],
    residual: "Low",
    legislation: "WHS Reg 2017 s.78–80",
  },
  {
    id: "H2",
    hazard: "Falling objects — tools and materials from height",
    likelihood: "Likely",
    consequence: "Moderate",
    inherent: "High",
    controls: [
      "Exclusion zone beneath all elevated work — minimum 1.5× drop height",
      "All tools tethered or stored in closed bags when at height",
      "Scaffold toe boards 150mm minimum on all working platforms",
      "Hard hat mandatory for all persons within exclusion zone",
    ],
    residual: "Low",
    legislation: "WHS Reg 2017 s.54",
  },
  {
    id: "H3",
    hazard: "Manual handling — awkward lifts in elevated position",
    likelihood: "Likely",
    consequence: "Minor",
    inherent: "Medium",
    controls: [
      "Maximum manual lift 16kg at height — use mechanical aids above this",
      "Two-person lift for materials exceeding 10kg above knee height",
      "Pre-work stretch program — site supervisor to lead",
    ],
    residual: "Low",
    legislation: "Code of Practice: Hazardous Manual Tasks 2021",
  },
  {
    id: "H4",
    hazard: "Scaffold or work platform collapse",
    likelihood: "Unlikely",
    consequence: "Catastrophic",
    inherent: "High",
    controls: [
      "Scaffold erected and tagged by licensed scaffolder (CPC30220)",
      "Engineer's design certificate on site before first use",
      "Weekly tagged inspection — red tag removes platform from service",
      "Scaffold not to be altered by non-licensed persons — report to supervisor",
    ],
    residual: "Low",
    legislation: "WHS Reg 2017 s.221–227",
  },
]

const CREW_DEFAULTS = [
  { name: "Jordan Vasquez",   role: "Leading Hand",   trade: "Carpenter",          inducted: true },
  { name: "Mia Okonkwo",     role: "Worker",          trade: "Carpenter",          inducted: true },
  { name: "Sam Tremblay",    role: "Worker",          trade: "Labourer",           inducted: true },
  { name: "Priya Nair",      role: "Safety Officer",  trade: "WHS",                inducted: true },
]

type Step = "details" | "generating" | "review" | "crew" | "authorise"

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "details",    label: "Activity",     icon: <FileTextIcon className="size-3.5" /> },
  { id: "review",    label: "SWMS",         icon: <SparklesIcon className="size-3.5" /> },
  { id: "crew",      label: "Crew",         icon: <UsersIcon className="size-3.5" /> },
  { id: "authorise", label: "Sign off",     icon: <PenLineIcon className="size-3.5" /> },
]

const RISK_TONE: Record<string, string> = {
  High:   "bg-red-500/15 text-red-700 dark:text-red-400",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Low:    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
}

export function SwmsWizard() {
  const [step, setStep]             = useState<Step>("details")
  const [activity, setActivity]     = useState("")
  const [site, setSite]             = useState("")
  const [principal, setPrincipal]   = useState("")
  const [description, setDescription] = useState("")
  const [genProgress, setGenProgress] = useState(0)
  const [genPhase, setGenPhase]     = useState(0)
  const [signed, setSigned]         = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const GEN_PHASES = [
    "Reading activity context…",
    "Identifying high risk construction work categories…",
    "Generating hazard register from job data…",
    "Applying hierarchy of controls…",
    "Cross-referencing WHS Regulations 2017…",
    "Writing emergency procedures…",
    "Finalising SWMS — ready to review",
  ]

  function startGeneration() {
    setStep("generating")
    setGenProgress(0)
    setGenPhase(0)
    let progress = 0
    let phase = 0
    intervalRef.current = setInterval(() => {
      progress += Math.random() * 8 + 4
      if (progress >= 100) {
        progress = 100
        clearInterval(intervalRef.current!)
        setTimeout(() => setStep("review"), 400)
      }
      const nextPhase = Math.min(
        Math.floor((progress / 100) * GEN_PHASES.length),
        GEN_PHASES.length - 1,
      )
      phase = nextPhase
      setGenProgress(Math.round(progress))
      setGenPhase(phase)
    }, 180)
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const visibleSteps = STEPS.filter(s => s.id !== "generating")
  const currentIdx = visibleSteps.findIndex(s => s.id === step)

  return (
    <PageScroll overflows>
      <div className="mx-auto w-full max-w-4xl p-4">

        {/* Step indicator */}
        {step !== "generating" && (
          <div className="mb-6 flex items-center gap-1">
            {visibleSteps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <button
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    i < currentIdx
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                      : i === currentIdx
                        ? "bg-primary text-primary-foreground"
                        : "bg-fill text-muted-foreground cursor-default",
                  )}
                  onClick={() => i < currentIdx ? setStep(s.id) : undefined}
                  type="button"
                >
                  {i < currentIdx ? <CheckIcon className="size-3" /> : s.icon}
                  {s.label}
                </button>
                {i < visibleSteps.length - 1 && (
                  <ChevronRightIcon className="size-3 text-muted-foreground/40" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Step 1: Activity details ─────────────────────────────────── */}
        {step === "details" && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-base font-semibold">What are you doing?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Briesa generates the SWMS from your job. Describe the activity and it does the rest.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">High Risk Construction Work category</label>
                <select
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={activity}
                  onChange={e => setActivity(e.target.value)}
                >
                  <option value="">Select HRCW category…</option>
                  {HRCW_ACTIVITIES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Describe the specific task</label>
                <textarea
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="e.g. Installing perimeter edge protection on Level 4 slab prior to structural steel erection. Workers will be within 2m of the unprotected leading edge…"
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Site</label>
                  <select
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={site}
                    onChange={e => setSite(e.target.value)}
                  >
                    <option value="">Select site…</option>
                    {SITES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Principal contractor</label>
                  <select
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={principal}
                    onChange={e => setPrincipal(e.target.value)}
                  >
                    <option value="">Select…</option>
                    {PRINCIPAL_CONTRACTORS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className={cn(
                  "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                  activity
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-fill text-muted-foreground cursor-not-allowed",
                )}
                disabled={!activity}
                onClick={startGeneration}
                type="button"
              >
                <SparklesIcon className="size-4" />
                Generate SWMS
              </button>
            </div>
          </div>
        )}

        {/* ── AI generation ────────────────────────────────────────────── */}
        {step === "generating" && (
          <div className="rounded-xl border bg-card p-10 text-center">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10">
              <LoaderCircleIcon className="size-7 animate-spin text-primary" />
            </div>
            <h2 className="text-base font-semibold">Briesa is writing your SWMS</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {activity}
            </p>

            <div className="mx-auto mt-8 max-w-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Generating</span>
                <span className="tabular-nums">{genProgress}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-fill-strong">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-200"
                  style={{ width: `${genProgress}%` }}
                />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {GEN_PHASES.slice(0, genPhase + 1).map((phase, i) => (
                  <div className="flex items-center gap-2 text-xs" key={phase}>
                    {i < genPhase ? (
                      <CheckIcon className="size-3.5 shrink-0 text-emerald-500" />
                    ) : (
                      <LoaderCircleIcon className="size-3.5 shrink-0 animate-spin text-primary" />
                    )}
                    <span className={i < genPhase ? "text-muted-foreground" : ""}>{phase}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              This is what SafetyCulture asks you to do manually.
              <br />Briesa does it for you.
            </p>
          </div>
        )}

        {/* ── Step 2: Review generated SWMS ────────────────────────────── */}
        {step === "review" && (
          <div className="flex flex-col gap-3">
            {/* Banner */}
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-3">
              <SparklesIcon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  SWMS generated — {GENERATED_HAZARDS.length} hazards identified
                </p>
                <p className="mt-0.5 text-xs text-emerald-700/70 dark:text-emerald-400/70">
                  {activity} · {site || "Site TBC"} · Generated from job context · Cross-referenced WHS Regulations 2017
                </p>
              </div>
            </div>

            {/* Hazard table */}
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="border-b px-4 py-3">
                <h3 className="text-sm font-medium">Hazards & controls</h3>
              </div>
              <div className="divide-y">
                {GENERATED_HAZARDS.map((hazard) => (
                  <div className="p-4" key={hazard.id}>
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="shrink-0 rounded-md bg-fill px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {hazard.id}
                      </span>
                      <span className="flex-1 text-sm font-medium">{hazard.hazard}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", RISK_TONE[hazard.inherent])}>
                          {hazard.inherent} inherent
                        </span>
                        <span className="text-muted-foreground/40 text-xs">→</span>
                        <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", RISK_TONE[hazard.residual])}>
                          {hazard.residual} residual
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Controls</p>
                        <ul className="flex flex-col gap-1">
                          {hazard.controls.map((control, i) => (
                            <li className="flex items-start gap-2 text-xs" key={i}>
                              <CheckIcon className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                              <span>{control}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                        <div><span className="font-medium text-foreground">Likelihood:</span> {hazard.likelihood}</div>
                        <div><span className="font-medium text-foreground">Consequence:</span> {hazard.consequence}</div>
                        <div><span className="font-medium text-foreground">Legislation:</span> {hazard.legislation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={() => setStep("crew")}
                type="button"
              >
                Add crew & sign off →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Crew ─────────────────────────────────────────────── */}
        {step === "crew" && (
          <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="border-b px-4 py-3">
                <h3 className="text-sm font-medium">Crew acknowledgement</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Each worker must acknowledge they have read and understood this SWMS before commencing work.
                </p>
              </div>
              <div className="divide-y">
                {CREW_DEFAULTS.map((worker, i) => (
                  <div className="flex items-center gap-4 px-4 py-3" key={i}>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fill-strong text-xs font-medium">
                      {worker.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{worker.name}</p>
                      <p className="text-xs text-muted-foreground">{worker.role} · {worker.trade}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckIcon className="size-3.5" />
                      Inducted
                    </div>
                    <div className="h-7 w-28 rounded-md border bg-background" />
                  </div>
                ))}
              </div>
              <div className="border-t px-4 py-3">
                <button className="text-xs text-primary hover:underline" type="button">+ Add worker</button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                className="rounded-lg border px-4 py-2 text-sm text-muted-foreground hover:bg-accent/40"
                onClick={() => setStep("review")}
                type="button"
              >
                ← Back
              </button>
              <button
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={() => setStep("authorise")}
                type="button"
              >
                Authorise SWMS →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Authorisation ─────────────────────────────────────── */}
        {step === "authorise" && (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-base font-semibold">Authorise and issue</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The site supervisor confirms this SWMS is suitable for the work and authorises it to proceed.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Authorising supervisor</label>
                    <input
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      defaultValue="Alex Kerr"
                      placeholder="Name"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Date</label>
                    <input
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      type="date"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Supervisor declaration</label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-accent/40">
                    <input
                      checked={signed}
                      className="mt-0.5"
                      onChange={e => setSigned(e.target.checked)}
                      type="checkbox"
                    />
                    <span className="text-sm text-muted-foreground">
                      I confirm that this Safe Work Method Statement has been prepared in consultation with workers,
                      is suitable for the work being performed, and that all workers have been briefed on its contents
                      before commencing work. I understand this is a legal document under the WHS Act 2011.
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  className="rounded-lg border px-4 py-2 text-sm text-muted-foreground hover:bg-accent/40"
                  onClick={() => setStep("crew")}
                  type="button"
                >
                  ← Back
                </button>
                <button
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                    signed
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-fill text-muted-foreground cursor-not-allowed",
                  )}
                  disabled={!signed}
                  type="button"
                >
                  <CheckIcon className="size-4" />
                  Issue SWMS
                </button>
              </div>
            </div>

            {!signed && (
              <p className="text-center text-xs text-muted-foreground">
                Supervisor declaration required to issue.
              </p>
            )}
          </div>
        )}
      </div>
    </PageScroll>
  )
}
