"use client"
import { useState } from "react"
import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { DetailModal, DetailRow, DetailSection } from "@/components/shared/detail-modal"
import { cn } from "@/lib/utils"

type TalkStatus = "Completed" | "Scheduled" | "Overdue" | "Cancelled"

type Talk = {
  ref: string
  topic: string
  site: string
  presenter: string
  initials: string
  delivered: string
  attendance: number | null
  crew: number
  status: TalkStatus
}

const STATUS_TONE: Record<TalkStatus, string> = {
  Completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Scheduled: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  Overdue: "bg-red-500/15 text-red-700 dark:text-red-400",
  Cancelled: "bg-fill text-muted-foreground",
}

const TALKS: Talk[] = [
  {
    ref: "TBT-051",
    topic: "Working at Height — edge protection and harness use",
    site: "Brisbane Terminal",
    presenter: "Marcus Reid",
    initials: "MR",
    delivered: "Today, 07:00",
    attendance: null,
    crew: 14,
    status: "Scheduled",
  },
  {
    ref: "TBT-050",
    topic: "Crane safety and exclusion zones",
    site: "Geelong Site",
    presenter: "Ruth Alvarez",
    initials: "RA",
    delivered: "Yesterday, 07:00",
    attendance: 9,
    crew: 9,
    status: "Completed",
  },
  {
    ref: "TBT-049",
    topic: "Electrical safety — isolation and LOTO procedure",
    site: "Sydney Yard",
    presenter: "Priya Tan",
    initials: "PT",
    delivered: "17 Jul",
    attendance: 12,
    crew: 13,
    status: "Completed",
  },
  {
    ref: "TBT-048",
    topic: "Monthly safety: silica dust management",
    site: "All sites",
    presenter: "Sam Okafor",
    initials: "SO",
    delivered: "15 Jul",
    attendance: null,
    crew: 7,
    status: "Overdue",
  },
  {
    ref: "TBT-047",
    topic: "Traffic management — pedestrian segregation",
    site: "Perth Workshop",
    presenter: "Jo Lin",
    initials: "JL",
    delivered: "14 Jul",
    attendance: 6,
    crew: 6,
    status: "Completed",
  },
  {
    ref: "TBT-046",
    topic: "Confined space entry — permit and atmospheric testing",
    site: "Brisbane Terminal",
    presenter: "Marcus Reid",
    initials: "MR",
    delivered: "10 Jul",
    attendance: 5,
    crew: 5,
    status: "Completed",
  },
  {
    ref: "TBT-045",
    topic: "Heat stress and hydration",
    site: "Adelaide Depot",
    presenter: "Sam Okafor",
    initials: "SO",
    delivered: "8 Jul",
    attendance: 11,
    crew: 12,
    status: "Completed",
  },
  {
    ref: "TBT-044",
    topic: "Asbestos awareness — identification and reporting",
    site: "Melbourne Depot",
    presenter: "Alex Kerr",
    initials: "AK",
    delivered: "7 Jul",
    attendance: 8,
    crew: 8,
    status: "Completed",
  },
  {
    ref: "TBT-043",
    topic: "Manual handling — safe lifting and mechanical aids",
    site: "Perth Workshop",
    presenter: "Jo Lin",
    initials: "JL",
    delivered: "3 Jul",
    attendance: 7,
    crew: 7,
    status: "Completed",
  },
  {
    ref: "TBT-042",
    topic: "Emergency response — evacuation procedures",
    site: "Geelong Site",
    presenter: "Ruth Alvarez",
    initials: "RA",
    delivered: "1 Jul",
    attendance: 10,
    crew: 10,
    status: "Completed",
  },
  {
    ref: "TBT-041",
    topic: "PPE selection and maintenance",
    site: "Sydney Yard",
    presenter: "Priya Tan",
    initials: "PT",
    delivered: "27 Jun",
    attendance: 11,
    crew: 13,
    status: "Completed",
  },
]

const TOOLBOX_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Talk details", type: "section" },
  {
    name: "topic",
    label: "Topic",
    type: "text",
    required: true,
    placeholder: "e.g. Working at height — harness pre-start checks",
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
    name: "presenter",
    label: "Presenter",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  { name: "s2", label: "Scheduling", type: "section" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time", label: "Start time", type: "time" },
  {
    name: "duration",
    label: "Duration",
    type: "select",
    options: ["5 min", "10 min", "15 min", "20 min", "30 min", "45 min", "1 hour"],
  },
  {
    name: "attendees",
    label: "Number of attendees",
    type: "number",
    placeholder: "e.g. 14",
  },
  {
    name: "notes",
    label: "Additional notes",
    type: "textarea",
    rows: 2,
    placeholder: "SWMS discussed, hazards raised, actions…",
  },
]

export function ToolboxTalks() {
  const [selected, setSelected] = useState<Talk | null>(null)
  const completed = TALKS.filter((t) => t.status === "Completed")
  const avgAttendance =
    completed.length > 0
      ? Math.round(
          (completed.reduce((s, t) => s + (t.attendance ?? 0) / t.crew, 0) /
            completed.length) *
            100,
        )
      : 0
  const overdue = TALKS.filter((t) => t.status === "Overdue").length

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={2} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Toolbox Talk" fields={TOOLBOX_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Completed (30d)",
              value: completed.length,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Overdue",
              value: overdue,
              tone: overdue > 0 ? "text-red-600 dark:text-red-400" : "",
            },
            {
              label: "Avg attendance",
              value: `${avgAttendance}%`,
              tone:
                avgAttendance >= 90
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400",
            },
            { label: "Total crew covered", value: 121, tone: "" },
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
                  <th className="px-4 py-2.5 font-medium">Talk</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Presenter</th>
                  <th className="px-4 py-2.5 font-medium">Delivered</th>
                  <th className="px-4 py-2.5 font-medium text-center">Attendance</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {TALKS.map((talk) => {
                  const pct =
                    talk.attendance != null
                      ? Math.round((talk.attendance / talk.crew) * 100)
                      : null
                  return (
                    <tr
                      className="cursor-pointer transition-colors hover:bg-accent/40"
                      key={talk.ref}
                      onClick={() => setSelected(talk)}
                    >
                      <td className="px-4 py-2.5">
                        <p className="text-sm font-medium leading-snug">{talk.topic}</p>
                        <p className="text-[10px] text-muted-foreground">{talk.ref}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                        {talk.site}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                            {talk.initials}
                          </div>
                          <span className="whitespace-nowrap text-xs">
                            {talk.presenter}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                        {talk.delivered}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {pct !== null ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <span
                              className={cn(
                                "text-xs font-medium tabular-nums",
                                pct === 100
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : pct >= 80
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-red-600 dark:text-red-400",
                              )}
                            >
                              {talk.attendance}/{talk.crew}
                            </span>
                            <div className="h-1 w-14 overflow-hidden rounded-full bg-fill-strong">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  pct === 100
                                    ? "bg-emerald-500"
                                    : pct >= 80
                                      ? "bg-amber-500"
                                      : "bg-red-500",
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-medium",
                            STATUS_TONE[talk.status],
                          )}
                        >
                          {talk.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
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
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-2xl"
              style={{ maxHeight: "min(90vh, 720px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold leading-snug">
                    {selected.topic}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {selected.ref} · {selected.site}
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
                style={{ maxHeight: "calc(min(90vh, 720px) - 72px)" }}
              >
                <DetailSection label="Talk Details">
                  <DetailRow label="Reference" value={selected.ref} />
                  <DetailRow label="Topic" value={selected.topic} />
                  <DetailRow label="Site" value={selected.site} />
                  <DetailRow label="Presenter" value={selected.presenter} />
                  <DetailRow label="Delivered" value={selected.delivered} />
                  <DetailRow
                    label="Attendance"
                    value={
                      selected.attendance !== null
                        ? `${selected.attendance} / ${selected.crew} (${Math.round((selected.attendance / selected.crew) * 100)}%)`
                        : `Crew: ${selected.crew} · Not yet recorded`
                    }
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
                </DetailSection>
                <DetailSection label="Documentation">
                  <p className="text-xs text-muted-foreground">
                    Sign-on sheet, presentation slides and any raised actions are attached
                    to this record. Attendance acknowledgements are captured per-worker in
                    the Workforce module.
                  </p>
                </DetailSection>
              </div>
            </div>
          </div>
        )}
      </Frame>
    </PageScroll>
  )
}
