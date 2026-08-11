/**
 * What every module is for, and what shape its screen takes.
 *
 * `modules.txt` is the argument — which features a construction platform has to
 * carry, tiered by whether their absence ends the demo. This is that document as
 * data, so the app is a walkable copy of it rather than a second description
 * that drifts from the first.
 *
 * Why it is not in `scope.ts`: that module is the routing core, imported by the
 * root layout, every page and the sidebar. It owns slugs, labels and the tree,
 * and nothing else — the same reason the blueprint clauses live in
 * `lib/blueprints` rather than beside the three standard slugs. Sections here
 * are keyed `domain/slug`, and a section with no entry falls back to a plain
 * placeholder rather than throwing: the nav is allowed to be ahead of the
 * catalogue.
 *
 * No "use client": read by server pages, and by nothing that runs in the
 * browser.
 */

/**
 * The shape of a screen, which is a different question from what it holds.
 *
 * Two modules with the same records and different shapes are two different
 * products to the person using them — a defect list and a defect board are the
 * same rows and a different job — so the shape is named here rather than left to
 * whoever builds the page.
 */
export type ViewKind =
  | "board"
  | "calendar"
  | "capture"
  | "cards"
  | "checklist"
  | "compare"
  | "dashboard"
  | "documents"
  | "feed"
  | "form"
  | "gallery"
  | "grid"
  | "heatmap"
  | "map"
  | "matrix"
  | "overview"
  | "record"
  | "report"
  | "split"
  | "table"
  | "timeline"
  | "wizard"

/** What the scaffold calls each shape, in the strip above it. */
export const VIEW_LABELS: Record<ViewKind, string> = {
  board: "Board",
  calendar: "Calendar",
  capture: "Capture",
  cards: "Cards",
  checklist: "Checklist",
  compare: "Comparison",
  dashboard: "Dashboard",
  documents: "Document tree",
  feed: "Feed",
  form: "Form",
  gallery: "Gallery",
  grid: "Grid",
  heatmap: "Heatmap",
  map: "Map",
  matrix: "Matrix",
  overview: "Overview",
  record: "Record",
  report: "Report",
  split: "List and detail",
  table: "Table",
  timeline: "Timeline",
  wizard: "Wizard",
}

/**
 * How much the module's absence costs, straight from `modules.txt`.
 *
 * Ordered by when it gets built, not by how good it is: nothing at `edge` in a
 * domain is worth starting before that domain's `stakes` are done, which is the
 * whole reason the tier is on the record rather than in a roadmap somewhere
 * else.
 */
export type Tier = "stakes" | "parity" | "edge"

export const TIER_LABELS: Record<Tier, string> = {
  stakes: "Table stakes",
  parity: "Parity",
  edge: "Edge",
}

/**
 * One way of reading a module.
 *
 * `slug` is the URL child — `/…/defects/list` — and the view without one is the
 * default, living at the section's own route. Only org-scoped sections can have
 * more than one, because the fourth path position is already spent on the
 * section when the third is a site. That is a real constraint rather than an
 * oversight: a site is looking at one place on one day, and the second reading
 * of a module is nearly always the cross-site one.
 *
 * `columns`, `rows`, `groups` and `metrics` are what the scaffold draws its
 * headings from. Which of them a kind reads is the kind's business — a table's
 * columns are its headings, a board's are its lanes — and every one of them has
 * a default, so a view can name none of them and still render.
 */
export type ModuleView = {
  slug?: string
  label: string
  kind: ViewKind
  columns?: readonly string[]
  rows?: readonly string[]
  groups?: readonly string[]
  metrics?: readonly string[]
  /** Matrix only: cells carry a graded fill rather than a tick, which is what
   *  separates a risk matrix from a coverage grid. */
  heat?: boolean
  /** Compare only: the two sides hold images rather than lines — a defect and
   *  its fix, a pour before and after. Same layout, different content. */
  media?: boolean
}

export type Module = {
  /** One line, in the same words `modules.txt` uses. Not marketing copy — the
   *  point of it is to say what the empty screen would hold. */
  summary: string
  tier: Tier
  /** First is the default. Non-empty by type, so `views[0]` needs no guard. */
  views: readonly [ModuleView, ...ModuleView[]]
  /**
   * The site-scoped reading, when it differs from the org one.
   *
   * Usually it does. A register across six sites is a table you filter; the same
   * register at one site is short enough to be a list of things happening, and
   * the columns that told you which site are dead weight.
   */
  siteView?: ModuleView
}

/** Weekday and week headings the calendar and timeline scaffolds fall back to. */
const WEEKS = ["Wk 31", "Wk 32", "Wk 33", "Wk 34", "Wk 35", "Wk 36"] as const

/**
 * The slug an app's own front page is filed under.
 *
 * Not a section — there is no `/company-1/overview`, the overview *is*
 * `/company-1` — so this is a catalogue key with no route behind it. It is here
 * anyway because the page wants exactly what every other page wants: a
 * description, a shape and a set of headings, from the one file that holds them.
 */
export const OVERVIEW = "overview"

export const MODULES: Record<string, Module> = {
  // ─── Overviews, one per app ────────────────────────────────────────────────

  "operations/overview": {
    summary:
      "Where the work is up to across every site: hours, plant, open defects, and whose day is behind.",
    tier: "stakes",
    views: [
      {
        label: "Overview",
        kind: "overview",
        metrics: ["Sites", "Crew", "Open defects", "Hours this week"],
      },
    ],
  },

  "compliance/overview": {
    summary:
      "Whether the system is holding: what is open, what is overdue, and what an auditor would ask for first.",
    tier: "stakes",
    views: [
      {
        label: "Overview",
        kind: "overview",
        metrics: ["Sites", "Open incidents", "Open actions", "Inspections due"],
      },
    ],
  },

  "workforce/overview": {
    summary: "Who you have, what they are qualified for, and what is about to lapse.",
    tier: "stakes",
    views: [
      {
        label: "Overview",
        kind: "overview",
        metrics: ["Headcount", "Sites", "Expiring in 30 days", "Inductions due"],
      },
    ],
  },

  "admin/overview": {
    summary:
      "The workspace itself — who is in it, what it costs, and what is connected to it.",
    tier: "stakes",
    views: [
      {
        label: "Overview",
        kind: "overview",
        metrics: ["Plan", "Apps", "Members", "Integrations"],
      },
    ],
  },

  // ─── Operations ────────────────────────────────────────────────────────────

  "operations/projects": {
    summary:
      "Register with status, client, contract value and dates, against the site it runs on. The spine every other record hangs off.",
    tier: "stakes",
    views: [
      {
        label: "List",
        kind: "table",
        columns: [
          "Project",
          "Client",
          "Site",
          "Contract",
          "Start",
          "Finish",
          "Complete",
          "Status",
        ],
      },
      {
        slug: "board",
        label: "Board",
        kind: "board",
        columns: [
          "Tendered",
          "Awarded",
          "Mobilising",
          "On site",
          "Practical completion",
          "Closed",
        ],
      },
    ],
  },

  /**
   * A single job, which is the one entity page in Operations. Keyed on a slug no
   * section owns, the way the overviews are: `/operations/projects/m80-upgrade`
   * is a project, not a section called `project`.
   */
  "operations/project": {
    summary:
      "One job end to end — programme, crews, plant, cost and every obligation that attaches to it.",
    tier: "stakes",
    views: [
      {
        label: "Project",
        kind: "record",
        columns: [
          "Client",
          "Contract",
          "Started",
          "Practical completion",
          "Site",
          "Status",
        ],
        groups: ["Detail", "Programme", "Cost", "Obligations"],
      },
    ],
  },

  "operations/lookahead": {
    summary:
      "Three weeks out, by crew and by site — the layer between a Gantt nobody opens and the whiteboard in the shed.",
    tier: "stakes",
    views: [
      {
        label: "Lookahead",
        kind: "timeline",
        columns: [...WEEKS],
        rows: [
          "Bulk earthworks",
          "Piling rig 2",
          "Service relocation",
          "Formwork — north abutment",
          "Steel fixing",
          "Concrete pour — deck 1",
          "Asphalt",
          "Line marking",
          "Landscaping",
          "Demobilisation",
        ],
      },
    ],
    siteView: {
      label: "Lookahead",
      kind: "timeline",
      columns: [...WEEKS],
      rows: [
        "Day shift crew",
        "Night shift crew",
        "Piling subcontractor",
        "Traffic control",
        "Survey",
        "Crane 1",
      ],
    },
  },

  "operations/defects": {
    summary:
      "Location-pinned, photo-evidenced, assigned and aged. The same record Quality calls an NCR, seen from the site.",
    tier: "parity",
    views: [
      {
        label: "Board",
        kind: "board",
        columns: ["Raised", "Assigned", "In progress", "Ready to verify", "Closed"],
      },
      {
        slug: "list",
        label: "List",
        kind: "table",
        columns: [
          "Ref",
          "Defect",
          "Location",
          "Trade",
          "Raised",
          "Owner",
          "Age",
          "Status",
        ],
      },
      {
        slug: "map",
        label: "On plan",
        kind: "map",
        rows: [
          "Level 2 — handrail gap",
          "North abutment — honeycombing",
          "Gate 3 — damaged bollard",
          "Deck 1 — surface crack",
          "Compound — drainage fall",
          "Level 4 — missing edge protection",
        ],
      },
      {
        slug: "fixes",
        label: "Before & after",
        kind: "compare",
        media: true,
        columns: ["Raised", "Verified"],
      },
    ],
    siteView: {
      label: "Board",
      kind: "board",
      columns: ["Raised", "Assigned", "In progress", "Ready to verify", "Closed"],
    },
  },

  "operations/diary": {
    summary:
      "One entry per site per day — weather pulled not typed, crew, plant, work done, delays, visitors. The record that wins disputes.",
    tier: "stakes",
    views: [
      {
        label: "Entries",
        kind: "feed",
        rows: [
          "Melbourne Depot",
          "Sydney Yard",
          "Brisbane Terminal",
          "Perth Workshop",
          "Adelaide Depot",
          "Geelong Site",
        ],
      },
      { slug: "calendar", label: "Calendar", kind: "calendar" },
      {
        slug: "today",
        label: "Today",
        kind: "capture",
        groups: [
          "Conditions",
          "Crew and plant",
          "Work done",
          "Delays and events",
          "Visitors",
        ],
      },
    ],
    // The site's diary *is* today's entry, so at a site this is the capture
    // screen and the org-level feed is where past ones are read. Reversing that
    // — a feed at the site and a form somewhere else — is how a diary stops
    // being filled in.
    siteView: {
      label: "Site Diary",
      kind: "capture",
      groups: [
        "Conditions",
        "Crew and plant",
        "Work done",
        "Delays and events",
        "Visitors",
      ],
    },
  },

  "operations/access": {
    summary:
      "Who is on site right now, by sign-on — and a muster report that still works when the network does not.",
    tier: "stakes",
    views: [
      {
        label: "Attendance",
        kind: "table",
        columns: [
          "Name",
          "Company",
          "Trade",
          "Site",
          "Inducted",
          "On site",
          "Signed on",
          "Hours",
        ],
      },
      {
        slug: "sign-on",
        label: "Sign on",
        kind: "capture",
        groups: ["Who", "Induction and tickets", "Today's work", "Acknowledgement"],
      },
    ],
    siteView: {
      label: "Access & Attendance",
      kind: "table",
      columns: [
        "Name",
        "Company",
        "Trade",
        "Inducted",
        "Signed on",
        "Signed off",
        "Hours",
      ],
    },
  },

  "operations/deliveries": {
    summary:
      "Booking a crane, a gate, a slot. A small feature with disproportionate daily use.",
    tier: "parity",
    views: [
      { label: "Calendar", kind: "calendar" },
      {
        slug: "list",
        label: "List",
        kind: "table",
        columns: [
          "Ref",
          "Delivery",
          "Supplier",
          "Site",
          "Gate",
          "Window",
          "Plant",
          "Status",
        ],
      },
    ],
    siteView: { label: "Deliveries", kind: "calendar" },
  },

  "operations/assets": {
    summary:
      "Owned and hired plant: where it is, prestarts, servicing due, registration and insurance expiry, off-hire dates.",
    tier: "stakes",
    views: [
      {
        label: "Register",
        kind: "table",
        columns: [
          "Asset",
          "Type",
          "Ownership",
          "Site",
          "Prestart",
          "Service due",
          "Registration",
          "Status",
        ],
      },
      {
        slug: "utilisation",
        label: "Utilisation",
        kind: "timeline",
        columns: [...WEEKS],
        rows: [
          "Excavator 30t — EX-114",
          "Excavator 13t — EX-207",
          "Franna 25t — CR-003",
          "Roller — RL-051",
          "Water cart — WC-018",
          "Telehandler — TH-092",
          "Dozer D6 — DZ-011",
          "Site office — accommodation",
        ],
      },
      {
        slug: "map",
        label: "Where",
        kind: "map",
        rows: [
          "Excavator 30t — EX-114",
          "Franna 25t — CR-003",
          "Roller — RL-051",
          "Water cart — WC-018",
          "Telehandler — TH-092",
          "Site office — accommodation",
        ],
      },
    ],
    siteView: {
      label: "Plant on Site",
      kind: "table",
      columns: [
        "Asset",
        "Type",
        "Operator",
        "Prestart",
        "Service due",
        "Off hire",
        "Status",
      ],
    },
  },

  "operations/timesheets": {
    summary:
      "Capture here, rates in Workforce, cost in Commercial. On a phone, offline, approved by the supervisor before it leaves the site.",
    tier: "stakes",
    views: [
      { label: "Week", kind: "grid" },
      {
        slug: "list",
        label: "List",
        kind: "table",
        columns: [
          "Person",
          "Crew",
          "Site",
          "Cost code",
          "Ordinary",
          "Overtime",
          "Allowances",
          "Approval",
        ],
      },
    ],
    siteView: { label: "Timesheets", kind: "grid" },
  },

  "operations/claims": {
    summary:
      "Quantities and percentages captured at the site, handed to Commercial when there is a Commercial to hand them to.",
    tier: "parity",
    views: [
      {
        label: "Claim",
        kind: "grid",
        columns: ["Qty", "%", "Rate", "Previous", "This claim", "To complete"],
        rows: [
          "Bulk earthworks",
          "Subgrade preparation",
          "Drainage — pits",
          "Drainage — pipe",
          "Kerb and channel",
          "Asphalt — base",
        ],
      },
      {
        slug: "list",
        label: "Register",
        kind: "table",
        columns: [
          "Item",
          "Lot",
          "Site",
          "Quantity",
          "Complete",
          "Rate",
          "This claim",
          "Status",
        ],
      },
    ],
    siteView: { label: "Progress Claims", kind: "grid" },
  },

  "operations/photos": {
    summary:
      "By site, by date, by tag, by pin on a plan. Every competitor has one and every customer's is a phone camera roll.",
    tier: "parity",
    views: [
      { label: "Gallery", kind: "gallery" },
      {
        slug: "map",
        label: "On plan",
        kind: "map",
        rows: [
          "Pour 14 — pre-pour",
          "Pour 14 — post-pour",
          "Service trench — bedding",
          "Abutment — reinforcement",
          "Site establishment",
          "Gate 3 — access",
        ],
      },
    ],
    siteView: { label: "Photos", kind: "gallery" },
  },

  "operations/insights": {
    summary:
      "Hours, delays, plant utilisation, open defects and diary completion — scoped to whatever asked for it.",
    tier: "parity",
    views: [
      {
        label: "Insights",
        kind: "dashboard",
        metrics: [
          "Hours this week",
          "Open defects",
          "Plant utilisation",
          "Diary completion",
        ],
        groups: ["Hours by site", "Defect ageing", "Delay causes"],
      },
      { slug: "days", label: "By day", kind: "heatmap", rows: ["Mon", "Wed", "Fri"] },
    ],
    siteView: {
      label: "Insights",
      kind: "dashboard",
      metrics: ["Hours this week", "Open defects", "Plant on site", "Days since delay"],
      groups: ["Hours by crew", "Defect ageing", "Delay causes"],
    },
  },

  // ─── Compliance ────────────────────────────────────────────────────────────

  "compliance/safety": {
    summary:
      "Incidents, near misses, hazards and injuries — with notifiability flagged at entry rather than remembered, because s38 is a clock.",
    tier: "stakes",
    views: [
      {
        label: "Register",
        kind: "table",
        columns: [
          "Ref",
          "Type",
          "Site",
          "Severity",
          "Notifiable",
          "Reported",
          "Owner",
          "Status",
        ],
      },
      {
        slug: "board",
        label: "Board",
        kind: "board",
        columns: ["Reported", "Investigating", "Actions open", "Verifying", "Closed"],
      },
    ],
    siteView: {
      label: "Safety",
      kind: "table",
      columns: ["Ref", "Type", "Severity", "Notifiable", "Reported", "Owner", "Status"],
    },
  },

  "compliance/risk": {
    summary:
      "Hierarchy of control, residual scoring, review dates, and the line from a risk to the SWMS that treats it.",
    tier: "stakes",
    views: [
      {
        label: "Register",
        kind: "table",
        columns: [
          "Ref",
          "Hazard",
          "Site",
          "Inherent",
          "Controls",
          "Residual",
          "Owner",
          "Review",
        ],
      },
      {
        slug: "matrix",
        label: "Matrix",
        kind: "matrix",
        heat: true,
        columns: ["Insignificant", "Minor", "Moderate", "Major", "Catastrophic"],
        rows: ["Almost certain", "Likely", "Possible", "Unlikely", "Rare"],
      },
    ],
    siteView: {
      label: "Risk",
      kind: "table",
      columns: ["Ref", "Hazard", "Inherent", "Controls", "Residual", "Owner", "Review"],
    },
  },

  "compliance/quality": {
    summary:
      "ITPs with hold and witness points, NCRs, inspection records, handover and O&M. The part most safety tools skip.",
    tier: "stakes",
    views: [
      {
        slug: "list",
        label: "Register",
        kind: "table",
        columns: ["Ref", "Item", "Lot", "Site", "Point", "Inspected", "Result", "Status"],
      },
      {
        label: "ITPs",
        kind: "checklist",
        groups: ["Earthworks — ITP-04", "Concrete — ITP-11", "Structural steel — ITP-19"],
      },
    ],
    siteView: {
      slug: "list",
      label: "Quality",
      kind: "table",
      columns: ["Ref", "Item", "Lot", "Site", "Point", "Inspected", "Result", "Status"],
    },
  },

  "compliance/environment": {
    summary:
      "Waste, water, dust, noise and spills, against the EPA licence conditions and the dates they report on.",
    tier: "stakes",
    views: [
      {
        label: "Register",
        kind: "table",
        columns: [
          "Ref",
          "Aspect",
          "Site",
          "Licence",
          "Monitoring",
          "Result",
          "Due",
          "Status",
        ],
      },
    ],
    siteView: {
      label: "Environment",
      kind: "table",
      columns: ["Ref", "Aspect", "Licence", "Monitoring", "Result", "Due", "Status"],
    },
  },

  "compliance/chemicals": {
    summary:
      "The chemical register with SDS currency against the five-year rule, and a manifest per site.",
    tier: "parity",
    views: [
      {
        label: "Register",
        kind: "table",
        columns: [
          "Product",
          "Supplier",
          "Class",
          "Site",
          "Quantity",
          "SDS issued",
          "Status",
        ],
      },
    ],
    siteView: {
      label: "Chemicals & SDS",
      kind: "table",
      columns: ["Product", "Supplier", "Class", "Quantity", "SDS issued", "Status"],
    },
  },

  "compliance/contractors": {
    summary:
      "Insurances, licences and prequal status for the companies you engage. The interim home until Subcontractors earns a tile of its own.",
    tier: "parity",
    views: [
      {
        label: "Companies",
        kind: "table",
        columns: [
          "Company",
          "ABN",
          "Trade",
          "Prequal",
          "Public liability",
          "Workers comp",
          "Expires",
          "Status",
        ],
      },
      { slug: "directory", label: "Directory", kind: "cards" },
    ],
    siteView: {
      label: "Contractor Compliance",
      kind: "table",
      columns: [
        "Company",
        "Trade",
        "Prequal",
        "Insurances",
        "On site",
        "Expires",
        "Status",
      ],
    },
  },

  "compliance/emergency": {
    summary:
      "Plans, wardens, drills and kit checks, per site. The one register whose test is whether it works on the worst day rather than at audit.",
    tier: "parity",
    views: [
      {
        label: "By site",
        kind: "table",
        columns: [
          "Site",
          "Plan version",
          "Wardens",
          "First aiders",
          "Last drill",
          "Kit check",
          "Status",
        ],
      },
    ],
    siteView: {
      label: "Emergency & First Aid",
      kind: "split",
      rows: [
        "Emergency response plan",
        "Evacuation diagram",
        "Warden register",
        "First aiders and kit",
        "Muster points",
        "Drill records",
        "Emergency contacts",
      ],
    },
  },

  "compliance/swms": {
    summary:
      "A live SWMS, not a document store: written against the 18 high risk activities, versioned, and acknowledged by everyone who does the task.",
    tier: "stakes",
    views: [
      {
        slug: "issue",
        label: "Issue",
        kind: "wizard",
        groups: [
          "Activity",
          "Hazards and controls",
          "Controls in place",
          "Emergency procedures",
          "Crew",
          "Authorisation",
        ],
      },
      {
        label: "SWMS",
        kind: "split",
        rows: [
          "Working at height — edge protection",
          "Excavation over 1.5m",
          "Confined space entry",
          "Crane lifts over live traffic",
          "Demolition — partial",
          "Asbestos removal — Class B",
          "Live electrical isolation",
          "Concrete pumping",
          "Traffic management — arterial",
        ],
      },
      {
        slug: "list",
        label: "Register",
        kind: "table",
        columns: [
          "Ref",
          "Activity",
          "HRCW",
          "Company",
          "Version",
          "Reviewed",
          "Signed",
          "Status",
        ],
      },
      {
        slug: "versions",
        label: "Versions",
        kind: "compare",
        columns: ["Version 3", "Version 4"],
      },
    ],
    siteView: {
      label: "SWMS",
      kind: "split",
      rows: [
        "Working at height — edge protection",
        "Excavation over 1.5m",
        "Crane lifts over live traffic",
        "Traffic management — arterial",
        "Concrete pumping",
      ],
    },
  },

  "compliance/permits": {
    summary:
      "Hot work, confined space, live electrical, excavation, height, lifts. Issued, time-boxed, closed — and visible at the gate.",
    tier: "stakes",
    views: [
      { label: "Calendar", kind: "calendar" },
      {
        slug: "list",
        label: "Register",
        kind: "table",
        columns: [
          "Permit",
          "Type",
          "Site",
          "Issued to",
          "Valid from",
          "Expires",
          "Status",
        ],
      },
      {
        slug: "issue",
        label: "Issue",
        kind: "wizard",
        groups: [
          "Activity",
          "Hazards and controls",
          "Atmosphere and isolation",
          "Authorisation",
          "Close out",
        ],
      },
    ],
    siteView: { label: "Permits", kind: "calendar" },
  },

  "compliance/inspections": {
    summary:
      "Templated, scheduled, scored and assigned. This is the SafetyCulture surface and it has to be as fast as SafetyCulture.",
    tier: "stakes",
    views: [
      {
        slug: "list",
        label: "Schedule",
        kind: "table",
        columns: ["Inspection", "Template", "Site", "Assigned", "Due", "Score", "Status"],
      },
      {
        label: "Inspection",
        kind: "checklist",
        groups: [
          "Site establishment",
          "Access and egress",
          "Plant and equipment",
          "Working at height",
          "Housekeeping",
        ],
      },
    ],
    siteView: {
      slug: "list",
      label: "Inspections",
      kind: "table",
      columns: ["Inspection", "Template", "Site", "Assigned", "Due", "Score", "Status"],
    },
  },

  "compliance/toolbox": {
    summary:
      "Scheduled, delivered, and the attendance captured on site rather than after it.",
    tier: "parity",
    views: [
      {
        label: "Talks",
        kind: "table",
        columns: [
          "Topic",
          "Site",
          "Presenter",
          "Delivered",
          "Attendance",
          "Crew",
          "Status",
        ],
      },
    ],
    siteView: {
      label: "Toolbox Talks",
      kind: "table",
      columns: ["Topic", "Presenter", "Delivered", "Attendance", "Crew", "Status"],
    },
  },

  "compliance/actions": {
    summary:
      "One queue across every register. An action from an incident, an audit, an NCR or an inspection is the same object with the same escalation.",
    tier: "parity",
    views: [
      {
        label: "Board",
        kind: "board",
        columns: ["Raised", "Assigned", "In progress", "Verifying", "Closed", "Overdue"],
      },
      {
        slug: "list",
        label: "List",
        kind: "table",
        columns: ["Ref", "Action", "Source", "Site", "Owner", "Raised", "Due", "Status"],
      },
    ],
    siteView: {
      label: "Actions",
      kind: "board",
      columns: ["Raised", "Assigned", "In progress", "Verifying", "Closed"],
    },
  },

  "compliance/blueprints": {
    summary:
      "45001, 9001 and 14001 on the harmonised structure — one clause, and every standard that shares it.",
    tier: "edge",
    views: [
      {
        label: "Crosswalk",
        kind: "matrix",
        // Clause groups down, standards across. The overlap is the whole point
        // of the page: the three were published to the same high-level
        // structure, so most rows are ticked three times and one control closes
        // all three at once.
        columns: ["ISO 45001", "ISO 9001", "ISO 14001"],
        rows: [
          "4 · Context",
          "5 · Leadership",
          "6 · Planning",
          "7 · Support",
          "8 · Operation",
          "9 · Performance",
          "10 · Improvement",
        ],
      },
      {
        slug: "clauses",
        label: "Clauses",
        kind: "table",
        columns: [
          "Clause",
          "Title",
          "45001",
          "9001",
          "14001",
          "Controls",
          "Evidence",
          "Status",
        ],
      },
      {
        slug: "pack",
        label: "Audit pack",
        kind: "report",
        columns: ["Standard", "Scope", "Period", "Prepared by"],
        groups: [
          "Scope and exclusions",
          "Clause coverage",
          "Findings and observations",
          "Evidence index",
          "Corrective actions",
        ],
      },
    ],
  },

  "compliance/documents": {
    summary:
      "Controlled documents: version, owner, review date, acknowledgement, and superseded copies nobody can reach.",
    tier: "stakes",
    views: [
      {
        label: "Documents",
        kind: "documents",
        groups: [
          "Management system",
          "Policies",
          "Procedures",
          "Forms and templates",
          "Site packs",
          "Certificates",
        ],
      },
      {
        slug: "versions",
        label: "Versions",
        kind: "compare",
        columns: ["Rev C", "Rev D"],
      },
    ],
    siteView: {
      label: "Documents",
      kind: "documents",
      groups: ["Site pack", "Permits", "Certificates", "Drawings", "Handover"],
    },
  },

  "compliance/insights": {
    summary:
      "Lead and lag together: TRIFR and LTIFR beside action ageing, audit scores and inspection coverage.",
    tier: "parity",
    views: [
      {
        label: "Insights",
        kind: "dashboard",
        metrics: ["TRIFR", "LTIFR", "Open actions", "Inspection coverage"],
        groups: ["Incidents by month", "Action ageing", "Audit scores by site"],
      },
      { slug: "days", label: "By day", kind: "heatmap", rows: ["Mon", "Wed", "Fri"] },
    ],
    siteView: {
      label: "Insights",
      kind: "dashboard",
      metrics: ["Days LTI free", "Open actions", "Inspections due", "Last audit score"],
      groups: ["Incidents by month", "Action ageing", "Inspection coverage"],
    },
  },

  // ─── Workforce ─────────────────────────────────────────────────────────────

  "workforce/people": {
    summary:
      "Employees, labour hire and subcontractor workers in one register, told apart by engagement rather than by living in different systems.",
    tier: "stakes",
    views: [
      {
        label: "People",
        kind: "table",
        columns: ["Name", "Role", "Trade", "Engagement", "Site", "Started", "Status"],
      },
      { slug: "directory", label: "Directory", kind: "cards" },
    ],
    siteView: {
      label: "Crew",
      kind: "table",
      columns: ["Name", "Role", "Trade", "Engagement", "Crew", "Inducted", "Status"],
    },
  },

  "workforce/onboarding": {
    summary:
      "Offer through first day: documents, policies, PPE issue, super and TFN, licence collection. Half of it is compliance evidence in an HR hat.",
    tier: "parity",
    views: [
      {
        label: "Pipeline",
        kind: "board",
        columns: [
          "Offer out",
          "Accepted",
          "Documents",
          "Compliance",
          "Equipment",
          "First day",
        ],
      },
      // The same process as the board beside it, from the other end: that one is
      // every person at one step, this is every step for one person.
      {
        slug: "checklist",
        label: "One person",
        kind: "wizard",
        groups: [
          "Offer",
          "Documents",
          "Super and tax",
          "Licences and tickets",
          "PPE issue",
          "First day",
        ],
      },
    ],
  },

  "workforce/leave": {
    summary: "Requests, approvals, balances and the RDO calendar the roster has to read.",
    tier: "parity",
    views: [
      {
        slug: "list",
        label: "Requests",
        kind: "table",
        columns: [
          "Person",
          "Type",
          "From",
          "To",
          "Days",
          "Balance",
          "Approver",
          "Status",
        ],
      },
      { label: "Calendar", kind: "calendar" },
    ],
  },

  "workforce/performance": {
    summary:
      "Cycles, reviewers, ratings. Deliberately light — nobody has ever switched construction platforms over a review form.",
    tier: "parity",
    views: [
      {
        label: "Reviews",
        kind: "table",
        columns: [
          "Person",
          "Role",
          "Cycle",
          "Reviewer",
          "Rating",
          "Reviewed",
          "Next due",
        ],
      },
    ],
  },

  "workforce/training": {
    summary:
      "White card, HRW licences, EWP, confined space, first aid, VOCs. Expiry is the whole feature.",
    tier: "stakes",
    views: [
      {
        label: "Tickets",
        kind: "table",
        columns: ["Person", "Ticket", "Number", "Class", "Issued", "Expires", "Status"],
      },
      {
        slug: "expiry",
        label: "Expiry",
        kind: "timeline",
        columns: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
        rows: [
          "White card",
          "HRW — forklift",
          "HRW — dogging",
          "EWP over 11m",
          "Confined space",
          "First aid",
          "Traffic control",
          "Asbestos awareness",
          "Working at heights",
        ],
      },
    ],
    siteView: {
      label: "Training",
      kind: "table",
      columns: ["Person", "Ticket", "Number", "Issued", "Expires", "Status"],
    },
  },

  "workforce/inductions": {
    summary:
      "Company, site and task inductions delivered before the gate, versioned, with a pass mark and a record.",
    tier: "stakes",
    views: [
      {
        label: "Inductions",
        kind: "table",
        columns: [
          "Person",
          "Company",
          "Induction",
          "Version",
          "Completed",
          "Score",
          "Expires",
        ],
      },
      {
        slug: "deliver",
        label: "Deliver",
        kind: "wizard",
        groups: [
          "Who",
          "Company induction",
          "Site rules",
          "High risk work",
          "Assessment",
          "Record",
        ],
      },
    ],
    siteView: {
      label: "Inductions",
      kind: "table",
      columns: ["Person", "Company", "Induction", "Version", "Completed", "Expires"],
    },
  },

  "workforce/competency": {
    summary:
      "Who is qualified for what, by role and by task — read straight by the lookahead and by SWMS acknowledgement.",
    tier: "stakes",
    views: [
      {
        label: "Matrix",
        kind: "matrix",
        columns: [
          "Excavation",
          "Height",
          "Confined",
          "Traffic",
          "Hot work",
          "Rigging",
          "EWP",
        ],
        rows: [
          "Alex Kerr",
          "Priya Tan",
          "Marcus Reid",
          "Jo Lin",
          "Sam Okafor",
          "Ruth Alvarez",
          "Dana Whitlock",
          "Tom Ihaka",
        ],
      },
    ],
    siteView: {
      label: "Competency",
      kind: "matrix",
      columns: ["Excavation", "Height", "Confined", "Traffic", "Hot work", "Rigging"],
      rows: ["Alex Kerr", "Priya Tan", "Marcus Reid", "Jo Lin", "Sam Okafor"],
    },
  },

  "workforce/medicals": {
    summary:
      "Pre-employment, periodic, D&A testing, and the restrictions that come back with them.",
    tier: "parity",
    views: [
      {
        label: "Medicals",
        kind: "table",
        columns: [
          "Person",
          "Type",
          "Provider",
          "Assessed",
          "Outcome",
          "Restrictions",
          "Next due",
        ],
      },
    ],
  },

  "workforce/injury": {
    summary:
      "Claims, return to work and suitable duties — sitting beside the incident in Safety rather than duplicating it.",
    tier: "parity",
    views: [
      {
        label: "Cases",
        kind: "table",
        columns: [
          "Person",
          "Incident",
          "Claim",
          "Insurer",
          "Lodged",
          "Duties",
          "Days lost",
          "Status",
        ],
      },
    ],
  },

  "workforce/ppe": {
    summary: "What was issued to whom, when, and what is due for replacement.",
    tier: "parity",
    views: [
      {
        label: "Issue register",
        kind: "table",
        columns: ["Person", "Item", "Size", "Issued", "Site", "Replace due", "Status"],
      },
    ],
    siteView: {
      label: "PPE & Issue",
      kind: "table",
      columns: ["Person", "Item", "Size", "Issued", "Replace due", "Status"],
    },
  },

  "workforce/rates": {
    summary:
      "Award interpretation for MA000020 and the EBAs over it, allowances, site allowances, portable long service. Payroll itself is an integration.",
    tier: "parity",
    views: [
      {
        label: "Rates",
        kind: "table",
        columns: [
          "Classification",
          "Award",
          "Base",
          "Site allowance",
          "Travel",
          "Overtime",
          "From",
        ],
      },
    ],
  },

  "workforce/insights": {
    summary:
      "Headcount and turnover beside the numbers that stop work: expiring competencies and induction coverage.",
    tier: "parity",
    views: [
      {
        label: "Insights",
        kind: "dashboard",
        metrics: ["Headcount", "Expiring in 30 days", "Induction coverage", "Turnover"],
        groups: ["Headcount by site", "Expiry runway", "Training spend"],
      },
      { slug: "days", label: "By day", kind: "heatmap", rows: ["Mon", "Wed", "Fri"] },
    ],
    siteView: {
      label: "Insights",
      kind: "dashboard",
      metrics: [
        "Crew on site",
        "Expiring in 30 days",
        "Induction coverage",
        "Gate blocks",
      ],
      groups: ["Crew by trade", "Expiry runway", "Attendance"],
    },
  },

  // ─── Admin ─────────────────────────────────────────────────────────────────

  "admin/settings": {
    summary:
      "Legal entity, ABN, branding, timezone, financial year, and the state defaults for everywhere WHS diverges.",
    tier: "stakes",
    views: [
      {
        label: "Settings",
        kind: "form",
        groups: ["Organisation", "Localisation", "Work health and safety", "Branding"],
      },
    ],
  },

  "admin/members": {
    summary:
      "Invite, deactivate, transfer ownership. Deactivation has to be instant and total — a departed supervisor with a live phone is an audit finding.",
    tier: "stakes",
    views: [
      {
        label: "Members",
        kind: "table",
        columns: ["Name", "Email", "Role", "Sites", "Last active", "Invited", "Status"],
      },
    ],
  },

  "admin/roles": {
    summary:
      "Role by domain and by site, not one global role. A site manager over two of six sites is the normal case and the one most tools cannot express.",
    tier: "stakes",
    views: [
      {
        label: "Permissions",
        kind: "matrix",
        columns: ["Read", "Create", "Edit", "Approve", "Close out", "Export", "Admin"],
        rows: [
          "Owner",
          "HSEQ manager",
          "Project manager",
          "Site manager",
          "Supervisor",
          "Worker",
          "Subcontractor",
          "Auditor (read only)",
        ],
      },
    ],
  },

  "admin/billing": {
    summary:
      "Plan, seats and invoices — with entitlement per domain, which the app list already is.",
    tier: "stakes",
    views: [
      {
        label: "Billing",
        kind: "table",
        columns: ["Invoice", "Period", "Plan", "Seats", "Amount", "Issued", "Status"],
      },
    ],
  },

  "admin/integrations": {
    summary:
      "Connections, keys, sync status, last error, retry. This is how payroll, accounting and prequal networks stay out of scope.",
    tier: "stakes",
    views: [{ label: "Integrations", kind: "cards" }],
  },

  "admin/audit": {
    summary:
      "Who changed what, when, and from where. Immutable — this is a compliance control rather than a nice-to-have.",
    tier: "stakes",
    views: [{ label: "Audit log", kind: "feed" }],
  },

  "admin/authentication": {
    summary:
      "SSO against Entra ID and Google, SCIM provisioning, session policy. Procurement asks on the first call and disqualifies on the answer.",
    tier: "parity",
    views: [
      {
        label: "Authentication",
        kind: "form",
        groups: ["Single sign-on", "Provisioning (SCIM)", "Sessions", "Multi-factor"],
      },
    ],
  },

  "admin/retention": {
    summary:
      "AU residency stated plainly, retention per record type, and a full tenant export. Refusing the last one reads as lock-in and costs more deals than it saves.",
    tier: "parity",
    views: [
      {
        label: "Data & retention",
        kind: "form",
        groups: ["Residency", "Retention", "Export", "Subprocessors"],
      },
    ],
  },
}

export const moduleFor = (domain: string, section: string): Module | undefined =>
  MODULES[`${domain}/${section}`]
