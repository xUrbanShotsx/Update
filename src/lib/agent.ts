/**
 * What the assistant panel knows about where you are.
 *
 * Scope comes from `scopeFromPath`, the same resolver the sidebar and every page
 * use. That is the point: the panel cannot believe you are somewhere the nav says
 * you are not, and a route that changes shape changes here for free.
 *
 * There is no model behind this yet. The prompt builder and the route that used
 * to call the API have been removed; what is left is the scope the panel reads
 * and the starters it offers, which are the parts a backend would slot in
 * underneath rather than replace.
 *
 * No "use client": plain data and pure functions, and the panel that imports
 * them is a client component either way.
 */

import {
  defaultDomain,
  locationHref,
  orgHref,
  scopeFromPath,
  type Org,
} from "@/lib/scope"

export type AgentRole = "user" | "assistant"

export type AgentMessage = {
  role: AgentRole
  content: string
  /**
   * The reasoning behind an answer, on assistant turns that have any.
   *
   * Optional and absent everywhere today, because nothing produces an assistant
   * turn while there is no service behind the panel. It is declared all the same
   * for the reason the assistant branch of `Turn` is: this is the shape a
   * backend would fill, and the shelf layout reads it — a field added later
   * would mean changing the renderer as well as the transport.
   */
  thinking?: string
}

/**
 * A starter chip. Two strings, not one: the chip has room for two or three words
 * and the model wants a whole question, so the label is what you read and the
 * prompt is what gets sent. Writing one string for both jobs means either a chip
 * that wraps to three lines or a question too clipped to answer well.
 */
export type Suggestion = { label: string; prompt: string }

/** What the panel offers before you have typed anything — things you would
 *  actually ask standing where you are standing. A generic "how can I help?"
 *  teaches nothing about what the assistant is for. */
export type AgentScope = {
  /** The place, in the fewest words that identify it. */
  label: string
  suggestions: readonly Suggestion[]
}

const ORG_SUGGESTIONS: Suggestion[] = [
  {
    label: "Our exposure",
    prompt: "Where is a contractor our size usually most exposed?",
  },
  {
    label: "ISO 45001 gaps",
    prompt: "What does ISO 45001 require that contractors most often fail at audit?",
  },
  {
    label: "Find a module",
    prompt: "Which module owns contractor prequalification, and what belongs in it?",
  },
]

const SITE_SUGGESTIONS: Suggestion[] = [
  {
    label: "Before crew start",
    prompt: "What should a site supervisor check before crew start tomorrow?",
  },
  {
    label: "Permit to work",
    prompt: "What has to be recorded on a permit to work, and who signs it?",
  },
  {
    label: "Toolbox talk",
    prompt: "Draft a five-minute toolbox talk on working at heights.",
  },
]

const SECTION_SUGGESTIONS: Record<string, readonly Suggestion[]> = {
  safety: [
    {
      label: "SWMS contents",
      prompt: "What has to be in a SWMS, and who has to sign it?",
    },
    {
      label: "Notifiable incidents",
      prompt: "When does an incident become notifiable, and how quickly?",
    },
    { label: "Emergency drills", prompt: "How often should we run an emergency drill?" },
  ],
  risk: [
    {
      label: "Writing controls",
      prompt: "How do I write a control an auditor will accept as effective?",
    },
    {
      label: "Critical controls",
      prompt: "What belongs in a critical control verification on site?",
    },
    {
      label: "Hierarchy of controls",
      prompt: "Explain the hierarchy of controls with construction examples.",
    },
  ],
  quality: [
    {
      label: "Hold points",
      prompt: "What is the difference between a hold point and a witness point?",
    },
    {
      label: "Closing an NCR",
      prompt: "How should a nonconformance be closed out properly?",
    },
    {
      label: "ITP for concrete",
      prompt: "What goes in an ITP for structural concrete works?",
    },
  ],
  environment: [
    {
      label: "Erosion control",
      prompt: "What do we need in place for erosion and sediment control?",
    },
    { label: "Reportable spills", prompt: "When is a spill reportable, and to whom?" },
    { label: "Waste dockets", prompt: "What has to be tracked on waste dockets?" },
  ],
  training: [
    {
      label: "Ticket expiries",
      prompt: "How much notice should we give before a high-risk work licence expires?",
    },
    {
      label: "Verification of competency",
      prompt: "What is a verification of competency, and when is one required?",
    },
    { label: "Induction content", prompt: "What should a site induction cover?" },
  ],
  people: [
    {
      label: "Subcontractor records",
      prompt: "What records do we have to keep for a subcontractor?",
    },
    {
      label: "WHS consultation",
      prompt: "What does consultation actually require under WHS law?",
    },
    {
      label: "Fatigue",
      prompt: "How should fatigue be managed on a construction roster?",
    },
  ],
}

export function agentScope(pathname: string, org: Org): AgentScope {
  const scope = scopeFromPath(pathname, org)
  if (!scope) return { label: "Briesa", suggestions: ORG_SUGGESTIONS }

  if (scope.kind === "location") {
    return {
      label: scope.section
        ? `${scope.location.name} · ${scope.section.label}`
        : scope.location.name,
      suggestions:
        (scope.section && SECTION_SUGGESTIONS[scope.section.slug]) ?? SITE_SUGGESTIONS,
    }
  }

  if (scope.kind === "project") {
    return {
      label: `${scope.org.name} · ${scope.project.name}`,
      suggestions: ORG_SUGGESTIONS,
    }
  }

  // The domain rather than the org when there is no section: standing at the top
  // of Compliance, "Company #1" would be the one label that didn't say which
  // half of the app the answer would come from.
  return {
    label: scope.section
      ? `${scope.org.name} · ${scope.section.label}`
      : `${scope.org.name} · ${scope.domain.label}`,
    suggestions:
      (scope.section && SECTION_SUGGESTIONS[scope.section.slug]) ?? ORG_SUGGESTIONS,
  }
}

/**
 * What the scope picker can be set to: the organisation, or any one of its
 * sites. Sections aren't offered — a section narrows what you are *reading*, not
 * what the assistant should reason about, and a list of every module on every
 * site would be forty rows to answer a question about one of them.
 *
 * Each option is a path rather than an id, so picking one runs through the same
 * `scopeFromPath` the page does. There is no second way to describe a scope, and
 * so no second way for it to be wrong.
 */
export type ScopeOption = { path: string; label: string; detail: string }

export function agentScopeOptions(pathname: string, org: Org): ScopeOption[] {
  // Scoped to the app you are already in, so picking a scope changes the *place*
  // and nothing else. Switching app is the switcher's job, and a picker that
  // quietly did both would be the one control in the product that changed two
  // things at once.
  const domain = scopeFromPath(pathname, org)?.domain ?? defaultDomain(org)
  return [
    {
      path: orgHref(domain),
      label: org.name,
      detail: `${org.locations.length} ${org.locations.length === 1 ? "site" : "sites"}`,
    },
    ...org.locations.map((location) => ({
      path: locationHref(domain, location),
      label: location.name,
      detail: location.region,
    })),
  ]
}
