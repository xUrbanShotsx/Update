import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { Frame } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"

type Stage = "offer" | "accepted" | "documents" | "compliance" | "equipment" | "firstday"

type OnboardingPerson = {
  name: string
  role: string
  company: string
  site: string
  startDate: string
  stage: Stage
  initials: string
  urgent?: boolean
}

const STAGE_LABELS: Record<Stage, string> = {
  offer: "Offer out",
  accepted: "Accepted",
  documents: "Documents",
  compliance: "Compliance",
  equipment: "Equipment",
  firstday: "First day",
}

const STAGE_ORDER: Stage[] = [
  "offer",
  "accepted",
  "documents",
  "compliance",
  "equipment",
  "firstday",
]

const PEOPLE: readonly OnboardingPerson[] = [
  {
    name: "Liam Zhao",
    role: "Steel fixer",
    company: "Rebar Specialists Pty Ltd",
    site: "Melbourne Depot",
    startDate: "18 Aug",
    stage: "offer",
    initials: "LZ",
  },
  {
    name: "Brennan Shaw",
    role: "Scaffolder",
    company: "ScaffCo Australia",
    site: "Geelong Site",
    startDate: "25 Aug",
    stage: "offer",
    initials: "BS",
  },
  {
    name: "Sophie Wren",
    role: "Site supervisor",
    company: "Direct hire",
    site: "Sydney Yard",
    startDate: "25 Aug",
    stage: "accepted",
    initials: "SW",
  },
  {
    name: "Mia Chen",
    role: "Estimator",
    company: "Direct hire",
    site: "Sydney Yard",
    startDate: "1 Sep",
    stage: "accepted",
    initials: "MC",
  },
  {
    name: "Dev Mehta",
    role: "Crane operator",
    company: "Lift Solutions",
    site: "Brisbane Terminal",
    startDate: "1 Sep",
    stage: "documents",
    initials: "DM",
    urgent: true,
  },
  {
    name: "Rania Osman",
    role: "Environmental officer",
    company: "Direct hire",
    site: "Perth Workshop",
    startDate: "11 Aug",
    stage: "documents",
    initials: "RO",
  },
  {
    name: "Caitlin Moore",
    role: "Traffic controller",
    company: "SafeFlow TC",
    site: "Perth Workshop",
    startDate: "18 Aug",
    stage: "compliance",
    initials: "CM",
  },
  {
    name: "Hiro Nakamura",
    role: "Concreter",
    company: "Formwork First",
    site: "Adelaide Depot",
    startDate: "18 Aug",
    stage: "compliance",
    initials: "HN",
  },
  {
    name: "Jake Nolan",
    role: "Concreter",
    company: "Direct hire",
    site: "Adelaide Depot",
    startDate: "11 Aug",
    stage: "equipment",
    initials: "JN",
  },
  {
    name: "Priya Sundaram",
    role: "Project engineer",
    company: "Direct hire",
    site: "Melbourne Depot",
    startDate: "11 Aug",
    stage: "equipment",
    initials: "PS",
  },
  {
    name: "Yuki Tanaka",
    role: "WHS officer",
    company: "Direct hire",
    site: "Melbourne Depot",
    startDate: "11 Aug",
    stage: "firstday",
    initials: "YT",
  },
]

const ONBOARDING_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Person details", type: "section" },
  {
    name: "first_name",
    label: "First name",
    type: "text",
    required: true,
    placeholder: "Given name",
  },
  {
    name: "last_name",
    label: "Last name",
    type: "text",
    required: true,
    placeholder: "Family name",
  },
  {
    name: "role",
    label: "Role / position",
    type: "text",
    required: true,
    placeholder: "e.g. Site supervisor, Concreter",
  },
  {
    name: "trade",
    label: "Trade",
    type: "select",
    options: [
      "Concrete / formwork",
      "Carpentry",
      "Steel fixing",
      "Scaffolding",
      "Rigging",
      "Electrical",
      "Traffic control",
      "Plant operation",
      "Crane operation",
      "Survey",
      "Engineering",
      "WHS",
      "Management",
      "Other",
    ],
  },
  { name: "s2", label: "Employment", type: "section" },
  {
    name: "engagement",
    label: "Engagement type",
    type: "select",
    required: true,
    options: [
      "Direct employee",
      "Labour hire",
      "Subcontractor — individual",
      "Subcontractor — company",
    ],
  },
  {
    name: "company",
    label: "Employer / company",
    type: "text",
    placeholder: "If labour hire or sub",
  },
  {
    name: "site",
    label: "Primary site",
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
  { name: "start_date", label: "Start date", type: "date", required: true },
  { name: "s3", label: "Contact", type: "section" },
  {
    name: "mobile",
    label: "Mobile",
    type: "tel",
    required: true,
    placeholder: "0400 000 000",
  },
  { name: "email", label: "Email", type: "email", placeholder: "name@company.com.au" },
]

const INITIALS_COLORS = [
  "bg-violet-500/20 text-violet-400",
  "bg-sky-500/20 text-sky-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
  "bg-indigo-500/20 text-indigo-400",
  "bg-teal-500/20 text-teal-400",
  "bg-orange-500/20 text-orange-400",
]

function avatarColor(initials: string) {
  const idx = (initials.charCodeAt(0) + initials.charCodeAt(1)) % INITIALS_COLORS.length
  return INITIALS_COLORS[idx]
}

export function OnboardingBoard() {
  const byStage = (stage: Stage) => PEOPLE.filter((p) => p.stage === stage)
  const total = PEOPLE.length
  const complete = byStage("firstday").length

  return (
    <PageScroll overflows>
      <Frame>
        {/* Stat strip */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "In pipeline", value: total },
            { label: "Starting this week", value: 2 },
            { label: "Docs overdue", value: 1, warn: true },
            { label: "Completed", value: complete },
          ].map((s) => (
            <div className="rounded-xl border bg-card p-3" key={s.label}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p
                className={`mt-1 text-xl font-semibold tabular-nums ${s.warn ? "text-amber-500" : ""}`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {total} people in the onboarding pipeline
          </p>
          <AddSheet
            title="New starter"
            fields={ONBOARDING_FIELDS}
            submitLabel="Add to pipeline"
          />
        </div>

        {/* Board */}
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-3">
            {STAGE_ORDER.map((stage) => {
              const cards = byStage(stage)
              return (
                <div className="flex w-52 shrink-0 flex-col" key={stage}>
                  {/* Column header */}
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-xs font-medium">{STAGE_LABELS[stage]}</span>
                    <span className="rounded-full bg-fill px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {cards.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2">
                    {cards.map((person) => (
                      <div
                        className="rounded-xl border bg-card p-3 shadow-sm"
                        key={person.name}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(person.initials)}`}
                          >
                            {person.initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold">
                              {person.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {person.role}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2.5 space-y-1">
                          <p className="truncate text-[11px] text-muted-foreground">
                            {person.company}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="truncate text-[11px] text-muted-foreground">
                              {person.site}
                            </span>
                            <span
                              className={`ml-1 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                                person.urgent
                                  ? "bg-amber-500/15 text-amber-500"
                                  : "bg-fill text-muted-foreground"
                              }`}
                            >
                              {person.startDate}
                            </span>
                          </div>
                        </div>
                        {person.urgent && (
                          <p className="mt-2 text-[10px] font-medium text-amber-500">
                            ⚠ Docs required
                          </p>
                        )}
                      </div>
                    ))}

                    {cards.length === 0 && (
                      <div className="rounded-xl border border-dashed p-4 text-center">
                        <p className="text-[11px] text-muted-foreground/50">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
