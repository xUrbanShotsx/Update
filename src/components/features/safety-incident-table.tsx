"use client"

import { useState } from "react"
import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"
import { DetailRow, DetailSection } from "@/components/shared/detail-modal"

type Severity = "High" | "Medium" | "Low" | "Near miss"
type IncidentType = "Near miss" | "Injury" | "Hazard" | "Incident"
type IncidentStatus =
  | "Reported"
  | "Investigating"
  | "Actions open"
  | "Verifying"
  | "Closed"

type Incident = {
  ref: string
  type: IncidentType
  site: string
  severity: Severity
  notifiable: boolean
  reported: string
  owner: string
  initials: string
  status: IncidentStatus
}

const SEVERITY_TONE: Record<Severity, string> = {
  High: "bg-red-500/15 text-red-700 dark:text-red-400",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Low: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "Near miss": "bg-violet-500/15 text-violet-700 dark:text-violet-400",
}

const STATUS_TONE: Record<IncidentStatus, string> = {
  Reported: "text-red-600 dark:text-red-400",
  Investigating: "text-amber-600 dark:text-amber-400",
  "Actions open": "text-orange-600 dark:text-orange-400",
  Verifying: "text-sky-600 dark:text-sky-400",
  Closed: "text-emerald-600 dark:text-emerald-400",
}

const INCIDENTS: Incident[] = [
  {
    ref: "INC-049",
    type: "Near miss",
    site: "Melbourne Depot",
    severity: "Near miss",
    notifiable: false,
    reported: "11 Aug",
    owner: "Alex Kerr",
    initials: "AK",
    status: "Reported",
  },
  {
    ref: "INC-048",
    type: "Hazard",
    site: "Geelong Site",
    severity: "High",
    notifiable: true,
    reported: "11 Aug",
    owner: "Ruth Alvarez",
    initials: "RA",
    status: "Reported",
  },
  {
    ref: "INC-047",
    type: "Near miss",
    site: "Brisbane Terminal",
    severity: "Near miss",
    notifiable: false,
    reported: "11 Aug",
    owner: "Marcus Reid",
    initials: "MR",
    status: "Reported",
  },
  {
    ref: "INC-046",
    type: "Incident",
    site: "Sydney Yard",
    severity: "Medium",
    notifiable: false,
    reported: "9 Aug",
    owner: "Priya Tan",
    initials: "PT",
    status: "Investigating",
  },
  {
    ref: "INC-045",
    type: "Incident",
    site: "Geelong Site",
    severity: "High",
    notifiable: true,
    reported: "7 Aug",
    owner: "Ruth Alvarez",
    initials: "RA",
    status: "Investigating",
  },
  {
    ref: "INC-044",
    type: "Injury",
    site: "Brisbane Terminal",
    severity: "Medium",
    notifiable: false,
    reported: "8 Aug",
    owner: "Marcus Reid",
    initials: "MR",
    status: "Investigating",
  },
  {
    ref: "INC-043",
    type: "Near miss",
    site: "Geelong Site",
    severity: "Medium",
    notifiable: false,
    reported: "1 Aug",
    owner: "Ruth Alvarez",
    initials: "RA",
    status: "Actions open",
  },
  {
    ref: "INC-042",
    type: "Incident",
    site: "Brisbane Terminal",
    severity: "High",
    notifiable: true,
    reported: "4 Aug",
    owner: "Marcus Reid",
    initials: "MR",
    status: "Actions open",
  },
  {
    ref: "INC-041",
    type: "Injury",
    site: "Perth Workshop",
    severity: "Low",
    notifiable: false,
    reported: "4 Aug",
    owner: "Jo Lin",
    initials: "JL",
    status: "Actions open",
  },
  {
    ref: "INC-040",
    type: "Hazard",
    site: "Melbourne Depot",
    severity: "High",
    notifiable: true,
    reported: "28 Jul",
    owner: "Alex Kerr",
    initials: "AK",
    status: "Actions open",
  },
  {
    ref: "INC-039",
    type: "Injury",
    site: "Geelong Site",
    severity: "Medium",
    notifiable: false,
    reported: "28 Jul",
    owner: "Ruth Alvarez",
    initials: "RA",
    status: "Actions open",
  },
  {
    ref: "INC-037",
    type: "Incident",
    site: "Sydney Yard",
    severity: "High",
    notifiable: true,
    reported: "21 Jul",
    owner: "Priya Tan",
    initials: "PT",
    status: "Verifying",
  },
  {
    ref: "INC-036",
    type: "Near miss",
    site: "Melbourne Depot",
    severity: "Near miss",
    notifiable: false,
    reported: "14 Jul",
    owner: "Alex Kerr",
    initials: "AK",
    status: "Closed",
  },
  {
    ref: "INC-035",
    type: "Injury",
    site: "Adelaide Depot",
    severity: "Low",
    notifiable: false,
    reported: "7 Jul",
    owner: "Sam Okafor",
    initials: "SO",
    status: "Closed",
  },
  {
    ref: "INC-034",
    type: "Hazard",
    site: "Perth Workshop",
    severity: "Low",
    notifiable: false,
    reported: "30 Jun",
    owner: "Jo Lin",
    initials: "JL",
    status: "Closed",
  },
]

const INCIDENT_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Incident details", type: "section" },
  {
    name: "type",
    label: "Incident type",
    type: "select",
    required: true,
    options: [
      "Incident",
      "Near miss",
      "Hazard / unsafe condition",
      "Injury",
      "Property damage",
      "Environmental",
    ],
  },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time", label: "Time", type: "time", required: true },
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
    name: "location",
    label: "Location on site",
    type: "text",
    placeholder: "e.g. Grid C4, Loading bay 2",
  },
  { name: "s2", label: "What happened", type: "section" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    rows: 4,
    placeholder: "What happened, sequence of events, immediate cause…",
  },
  {
    name: "persons",
    label: "Person(s) involved",
    type: "text",
    placeholder: "Names and companies",
  },
  {
    name: "injury_details",
    label: "Injury details (if any)",
    type: "text",
    placeholder: "Type of injury, body part",
  },
  {
    name: "treatment",
    label: "Treatment given",
    type: "select",
    options: [
      "None required",
      "First aid on site",
      "Medical treatment",
      "Hospital — not admitted",
      "Hospital — admitted",
      "Under investigation",
    ],
  },
  { name: "s3", label: "Response", type: "section" },
  {
    name: "notifiable",
    label: "Notifiable to SafeWork / regulator?",
    type: "select",
    required: true,
    options: ["No", "Yes — notification being prepared", "Yes — already notified"],
  },
  {
    name: "immediate_actions",
    label: "Immediate actions taken",
    type: "textarea",
    rows: 3,
    placeholder: "Area secured, first aid given, scene preserved…",
  },
  {
    name: "assigned_to",
    label: "Investigation assigned to",
    type: "text",
    placeholder: "Full name",
  },
]

function getIncidentDescription(type: IncidentType): string {
  switch (type) {
    case "Near miss":
      return "A worker noticed a near-miss situation while conducting normal site operations. The hazard was identified before contact occurred, preventing potential injury. The worker immediately stopped work and reported the incident to the site supervisor, who initiated the formal reporting process in accordance with the site WHS management plan."
    case "Hazard":
      return "An unsafe condition was observed during a routine site inspection that posed a risk to workers in the vicinity. The hazard had the potential to cause serious injury if not promptly addressed. The site supervisor was notified immediately and the area was secured pending investigation and remediation."
    case "Injury":
      return "A worker sustained an injury during the course of their normal work duties. The injury was assessed on site by the qualified first aider, and appropriate treatment was administered promptly. The incident was formally recorded and notified to the relevant personnel in accordance with the site emergency response plan and WHS obligations."
    case "Incident":
      return "An unplanned event occurred that disrupted normal site operations and created a risk to persons, property, or the environment. The site supervisor was immediately notified, the area was secured, and all personnel in the vicinity were accounted for before the investigation commenced. The incident scene was preserved to allow a thorough root cause analysis."
  }
}

function getImmediateActions(type: IncidentType): string[] {
  switch (type) {
    case "Near miss":
      return [
        "Work stopped and hazard area reviewed",
        "Site manager notified immediately",
        "Incident scene documented with photographs",
        "SWMS reviewed and updated as required",
      ]
    case "Hazard":
      return [
        "Area isolated and barricaded pending inspection",
        "Site manager and HSR notified",
        "Hazard tagged and workers redirected to safe area",
        "Corrective action order raised",
      ]
    case "Injury":
      return [
        "First aid administered on site by qualified first aider",
        "Area isolated and preserved for investigation",
        "Site manager and HSR notified",
        "Incident notified to HR; SafeWork NSW notification assessed",
      ]
    case "Incident":
      return [
        "Area isolated and barricaded",
        "Site manager notified immediately",
        "Incident scene preserved and documented",
        "All workers in vicinity briefed and accounted for",
      ]
  }
}

function getCorrectiveActions(
  type: IncidentType,
): Array<{ action: string; owner: string; due: string }> {
  switch (type) {
    case "Near miss":
      return [
        {
          action: "Review and update SWMS for identified hazard",
          owner: "Site supervisor",
          due: "7 days",
        },
        {
          action: "Toolbox talk on near-miss reporting and hazard identification",
          owner: "HSR",
          due: "7 days",
        },
        {
          action: "Update hazard and risk register",
          owner: "WHS coordinator",
          due: "14 days",
        },
      ]
    case "Hazard":
      return [
        {
          action: "Remediate identified hazard and verify effectiveness",
          owner: "Site supervisor",
          due: "48 hrs",
        },
        {
          action: "Formal hazard inspection of adjacent areas",
          owner: "WHS coordinator",
          due: "7 days",
        },
        {
          action: "Review inspection frequency for this hazard category",
          owner: "Site manager",
          due: "14 days",
        },
      ]
    case "Injury":
      return [
        {
          action: "Conduct incident investigation and root cause analysis",
          owner: "Site manager",
          due: "7 days",
        },
        {
          action: "Implement corrective controls from investigation findings",
          owner: "Site supervisor",
          due: "14 days",
        },
        {
          action: "Worker rehabilitation and return-to-work plan",
          owner: "HR manager",
          due: "14 days",
        },
      ]
    case "Incident":
      return [
        {
          action: "Formal investigation and root cause analysis",
          owner: "Site manager",
          due: "7 days",
        },
        {
          action: "Corrective actions from investigation implemented",
          owner: "Site supervisor",
          due: "14 days",
        },
        {
          action: "Lessons-learned communicated to all sites",
          owner: "WHS coordinator",
          due: "21 days",
        },
      ]
  }
}

export function SafetyIncidentTable() {
  const [selected, setSelected] = useState<Incident | null>(null)

  const open = INCIDENTS.filter((i) => i.status !== "Closed")
  const notifiable = INCIDENTS.filter((i) => i.notifiable)
  const closed = INCIDENTS.filter((i) => i.status === "Closed")

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Safety Incident" fields={INCIDENT_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Open incidents", value: open.length, tone: "" },
            {
              label: "Notifiable",
              value: notifiable.length,
              tone: "text-red-600 dark:text-red-400",
            },
            {
              label: "Actions open",
              value: open.filter((i) => i.status === "Actions open").length,
              tone: "text-orange-600 dark:text-orange-400",
            },
            {
              label: "Closed (30d)",
              value: closed.length,
              tone: "text-emerald-600 dark:text-emerald-400",
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
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Severity</th>
                  <th className="px-4 py-2.5 font-medium">Notifiable</th>
                  <th className="px-4 py-2.5 font-medium">Reported</th>
                  <th className="px-4 py-2.5 font-medium">Owner</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {INCIDENTS.map((inc) => (
                  <tr
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-accent/40",
                      inc.status === "Closed" && "opacity-50",
                    )}
                    key={inc.ref}
                    onClick={() => setSelected(inc)}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {inc.ref}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-fill px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {inc.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {inc.site}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          SEVERITY_TONE[inc.severity],
                        )}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          inc.notifiable
                            ? "text-red-600 dark:text-red-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {inc.notifiable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {inc.reported}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {inc.initials}
                        </div>
                        <span className="whitespace-nowrap text-xs">{inc.owner}</span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-2.5 text-xs font-medium",
                        STATUS_TONE[inc.status],
                      )}
                    >
                      {inc.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incident detail overlay */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl"
              style={{ maxHeight: "min(90vh, 820px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-snug">
                    {selected.ref} — {selected.type}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {selected.site} · Reported {selected.reported}
                  </p>
                </div>
                <button
                  aria-label="Close"
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setSelected(null)}
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

              {/* Body */}
              <div
                className="overflow-y-auto px-6 py-5"
                style={{ maxHeight: "calc(min(90vh, 820px) - 72px)" }}
              >
                <DetailSection label="Summary">
                  <DetailRow label="Reference" value={selected.ref} />
                  <DetailRow label="Type" value={selected.type} />
                  <DetailRow label="Site" value={selected.site} />
                  <DetailRow
                    label="Severity"
                    value={
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          SEVERITY_TONE[selected.severity],
                        )}
                      >
                        {selected.severity}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Notifiable to regulator"
                    value={
                      selected.notifiable
                        ? "Yes — SafeWork NSW notified within 24 hrs"
                        : "No"
                    }
                    tone={
                      selected.notifiable ? "text-red-600 dark:text-red-400" : undefined
                    }
                  />
                  <DetailRow label="Reported" value={selected.reported} />
                  <DetailRow
                    label="Status"
                    value={
                      <span className={cn("font-medium", STATUS_TONE[selected.status])}>
                        {selected.status}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Investigation owner"
                    value={
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {selected.initials}
                        </div>
                        <span>{selected.owner}</span>
                      </div>
                    }
                  />
                </DetailSection>

                <DetailSection label="Description">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {getIncidentDescription(selected.type)}
                  </p>
                </DetailSection>

                <DetailSection label="Immediate actions">
                  <ul className="space-y-1.5">
                    {getImmediateActions(selected.type).map((action) => (
                      <li
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                        key={action}
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </DetailSection>

                <DetailSection label="Investigation & corrective actions">
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                          <th className="px-3 py-2 font-medium">Action</th>
                          <th className="px-3 py-2 font-medium">Owner</th>
                          <th className="px-3 py-2 font-medium">Due</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {getCorrectiveActions(selected.type).map((row) => (
                          <tr key={row.action}>
                            <td className="px-3 py-2 text-muted-foreground">
                              {row.action}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">{row.owner}</td>
                            <td className="whitespace-nowrap px-3 py-2 tabular-nums text-muted-foreground">
                              {row.due}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </DetailSection>

                <DetailSection label="WHS legislation">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selected.notifiable
                      ? "WHS Act 2011 s.38 — Duty to notify regulator of notifiable incidents. The person conducting a business or undertaking (PCBU) must notify SafeWork NSW immediately after becoming aware that a notifiable incident has occurred, and preserve the incident site until an inspector arrives or gives permission to disturb it."
                      : "WHS Act 2011 s.19 — Primary duty of care. A PCBU must ensure, so far as is reasonably practicable, the health and safety of workers and other persons at the workplace."}
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
