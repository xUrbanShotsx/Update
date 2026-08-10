/**
 * The views built around one record rather than many: a settings form, an audit
 * stream, a document beside the list it came from, a dashboard of the lot.
 *
 * The two split layouts here answer the same question two ways, deliberately.
 * `SplitView` is full bleed with a scroller in each pane; `DocumentsView` still
 * sits on the page as a card and scrolls as one region.
 *
 * What separates them is whether the split *is* the page or is on it. A SWMS
 * open beside its register is the whole screen, so it takes the whole card and
 * the panes scroll independently — and the card's edge behaviour goes quiet,
 * since the rounding reads `data-more-*` off the page's own scroller and a
 * nested pair publishes nothing. That is the price, and for a screen with no
 * page-level scroll to describe there is nothing being given up. A document tree
 * beside a file list is a browser you look *at*, so it keeps its margin.
 */

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  PlusIcon,
} from "lucide-react"

import {
  Avatar,
  Bar,
  Frame,
  GroupHeading,
  Pill,
  Toolbar,
  pick,
  spread,
} from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import type { ModuleView } from "@/lib/modules"
import { cn } from "@/lib/utils"

/**
 * Settings, in sections.
 *
 * Label on the left, control on the right, one row each. The two-column form is
 * the right shape for a screen you read down looking for one thing you already
 * know the name of — which is every settings page ever opened.
 */
export function FormView({ view }: { readonly view: ModuleView }) {
  const groups = view.groups ?? ["General", "Advanced"]

  return (
    <PageScroll overflows>
      <Frame className="max-w-3xl">
        <div className="flex flex-col gap-6">
          {groups.map((group, groupIndex) => (
            <section key={group}>
              <GroupHeading>{group}</GroupHeading>

              <div className="mt-2 divide-y overflow-hidden rounded-xl border bg-card">
                {Array.from({ length: 3 + spread(groupIndex * 5, 3) }, (_, row) => {
                  const seed = groupIndex * 19 + row * 7
                  // A toggle where a boolean belongs and a field where a value
                  // does. Every third row, so the column of controls has some
                  // shape to it rather than reading as one long input.
                  const toggle = spread(seed, 3) === 0
                  return (
                    <div className="flex items-center gap-4 px-4 py-3" key={row}>
                      <div className="min-w-0 flex-1">
                        <Bar className="w-32" seed={seed} />
                        <Bar className="mt-2" seed={seed + 1} soft />
                      </div>
                      {toggle ? (
                        <span className="flex h-5 w-9 shrink-0 items-center rounded-full bg-fill-strong px-0.5">
                          <span className="size-4 rounded-full bg-card shadow-sm" />
                        </span>
                      ) : (
                        <span className="h-8 w-48 shrink-0 rounded-md border bg-fill/40" />
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          <div className="flex items-center gap-2">
            <span className="h-8 w-24 rounded-md bg-fill-strong" />
            <span className="h-8 w-20 rounded-md border" />
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}

/**
 * Things that happened, newest first.
 *
 * The rail down the left is what makes it a stream rather than a table with the
 * borders taken off: the eye follows the line and reads it as one sequence, and
 * the gaps between entries can then carry the date headings without needing
 * their own rows.
 */
export function FeedView({ view }: { readonly view: ModuleView }) {
  const days = ["Today", "Yesterday", "Monday", "Last week"]
  const subjects = view.rows

  return (
    <PageScroll overflows>
      <Frame className="max-w-4xl">
        <Toolbar filters={2} />

        <div className="mt-4 flex flex-col gap-6">
          {days.map((day, dayIndex) => (
            <section key={day}>
              <div className="flex items-center gap-3">
                <GroupHeading>{day}</GroupHeading>
                <span className="h-px flex-1 bg-border" />
              </div>

              {/* The rail is a border on the container, inset to run through the
                  middle of the dots rather than beside them. */}
              <div className="mt-3 ml-3 flex flex-col gap-4 border-l pl-6">
                {Array.from({ length: 2 + spread(dayIndex * 7, 3) }, (_, index) => {
                  const seed = dayIndex * 23 + index * 5
                  const subject = subjects?.[spread(seed, subjects.length)]
                  return (
                    <article className="relative" key={index}>
                      <span
                        aria-hidden
                        className="absolute top-2 -left-[1.9rem] size-2.5 rounded-full border-2 border-card bg-fill-strong"
                      />
                      <div className="rounded-xl border bg-card p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-5" />
                          {subject ? (
                            <span className="truncate text-sm font-medium">
                              {subject}
                            </span>
                          ) : (
                            <Bar className="w-28" seed={seed} />
                          )}
                          <Bar className="ml-auto w-12 shrink-0" seed={seed + 1} soft />
                        </div>
                        <div className="mt-3 flex flex-col gap-2">
                          <Bar className="w-full" seed={seed + 2} soft />
                          <Bar className="w-3/5" seed={seed + 3} soft />
                        </div>
                        {spread(seed, 2) === 0 ? (
                          <div className="mt-3 flex items-center gap-2">
                            {Array.from({ length: 3 }, (_, thumb) => (
                              <span className="size-12 rounded-md bg-fill" key={thumb} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </Frame>
    </PageScroll>
  )
}

/**
 * A list beside the thing it selects.
 *
 * The list keeps its real row labels where the module has them — a SWMS register
 * is nine activities you recognise, and nine grey bars would be the one place a
 * scaffold could have said something true and didn't.
 *
 * Full bleed, alone among the views here: no gutter, no radius, no card of its
 * own, and the page card's own corners are what clip it. The others are content
 * laid on a page and a margin is what says so; this one *is* the page, the way a
 * mail client is, and a rounded card floating inside a rounded card reads as a
 * panel that failed to fill its window. It gets no `PageScroll` for the same
 * reason — the two panes scroll independently and the page behind them does not
 * move, so there is nothing for the card's edge behaviour to report.
 */
export function SplitView({ view }: { readonly view: ModuleView }) {
  const rows = view.rows ?? ["One", "Two", "Three", "Four", "Five"]

  return (
    <div className="flex min-h-0 flex-1">
      <div className="thin-scrollbar flex w-72 shrink-0 flex-col overflow-y-auto border-r">
        <div className="shrink-0 border-b p-2">
          <span className="block h-7 rounded-md bg-fill" />
        </div>
        {rows.map((row, index) => (
          <div
            className={cn(
              "flex shrink-0 flex-col gap-2 border-b px-3 py-2.5 last:border-b-0",
              index === 0 ? "bg-accent/60" : "hover:bg-accent/30",
            )}
            key={row}
          >
            <span className="truncate text-sm font-medium">{row}</span>
            <div className="flex items-center gap-2">
              <Pill seed={index} />
              <Bar className="w-10" seed={index * 3} soft />
            </div>
          </div>
        ))}
      </div>

      {/* Below `md` the detail pane is gone and the list is the page. A
              master-detail squeezed onto a phone gives you two unusable columns
              instead of one usable one. */}
      <div className="thin-scrollbar hidden min-w-0 flex-1 overflow-y-auto md:block">
        <div className="border-b p-4">
          <h3 className="truncate text-sm font-medium">{rows[0]}</h3>
          <div className="mt-3 flex items-center gap-2">
            <Pill seed={1} wide />
            <Bar className="w-20" seed={2} soft />
            <span className="ml-auto h-7 w-20 rounded-md bg-fill-strong" />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-b p-4 text-sm">
          {["Version", "Owner", "Reviewed", "Next review", "Sites", "Signatures"].map(
            (term, index) => (
              <div className="flex items-center gap-3" key={term}>
                <dt className="w-24 shrink-0 text-muted-foreground">{term}</dt>
                <dd className="min-w-0 flex-1">
                  <Bar seed={index * 11} soft />
                </dd>
              </div>
            ),
          )}
        </dl>

        <div className="flex flex-col gap-6 p-4">
          {Array.from({ length: 4 }, (_, block) => (
            <div key={block}>
              <Bar className="w-40" seed={block * 13} />
              <div className="mt-3 flex flex-col gap-2">
                {Array.from({ length: 3 }, (_, line) => (
                  <Bar
                    className={line === 2 ? "w-2/3" : "w-full"}
                    key={line}
                    seed={block * 7 + line}
                    soft
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Controlled documents: the tree on the left, what is in the open folder on the
 * right.
 *
 * A tree rather than a flat list with a folder column, because document control
 * is the one place the hierarchy is the point — a procedure two levels under
 * Management System is governed by what is above it, and a flat list says
 * nothing about that.
 */
export function DocumentsView({ view }: { readonly view: ModuleView }) {
  const folders = view.groups ?? ["Policies", "Procedures", "Forms", "Records"]

  return (
    <PageScroll>
      <Frame className="flex h-full min-h-[34rem] flex-col">
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border bg-card">
          <div className="thin-scrollbar hidden w-64 shrink-0 flex-col overflow-y-auto border-r p-2 sm:flex">
            {folders.map((folder, index) => (
              <div key={folder}>
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm",
                    index === 0 ? "bg-accent/60" : "hover:bg-accent/30",
                  )}
                >
                  {index === 0 ? (
                    <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
                  ) : (
                    <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
                  )}
                  <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{folder}</span>
                </div>

                {index === 0
                  ? Array.from({ length: 3 }, (_, child) => (
                      <div
                        className="flex items-center gap-1.5 rounded-md py-1.5 pr-2 pl-8 hover:bg-accent/30"
                        key={child}
                      >
                        <FolderIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
                        <Bar seed={child * 5} soft />
                      </div>
                    ))
                  : null}
              </div>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b p-3">
              <Toolbar filters={2} />
            </div>
            <div className="thin-scrollbar min-h-0 flex-1 divide-y overflow-y-auto">
              {Array.from({ length: 14 }, (_, index) => (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-accent/30"
                  key={index}
                >
                  <FileTextIcon className="size-4 shrink-0 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <Bar className="w-48" seed={index * 3} />
                  </div>
                  {/* Version, owner and review date — the three columns that make
                      a document controlled rather than merely stored. */}
                  <Bar className="hidden w-10 shrink-0 md:block" seed={index * 5} soft />
                  <Bar className="hidden w-20 shrink-0 lg:block" seed={index * 7} soft />
                  <Pill seed={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}

/** Bar heights for the column chart, as percentages. Literal numbers rather than
 *  a random walk, for the reason every other seed here is fixed. */
const COLUMN_HEIGHTS = [42, 68, 55, 81, 34, 72, 60, 90, 47, 63, 38, 76] as const

/**
 * The domain's numbers.
 *
 * Four tiles, one big chart, two small ones. Insights is one slug in three
 * domains and one more at site scope, so what differs between them is the
 * metrics — which is why they come off the module rather than out of here.
 */
export function DashboardView({ view }: { readonly view: ModuleView }) {
  const metrics = view.metrics ?? ["Total", "Open", "Overdue", "Closed"]
  const charts = view.groups ?? ["Over time", "By site", "By owner"]
  const [lead, ...rest] = charts

  return (
    <PageScroll overflows>
      <Frame>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div className="rounded-xl border bg-card p-4" key={metric}>
              <p className="truncate text-xs text-muted-foreground">{metric}</p>
              <span className="mt-3 block h-7 w-20 rounded-md bg-fill-strong" />
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={cn(
                    "block h-1.5 w-1.5 rounded-full",
                    pick(["bg-emerald-500", "bg-amber-500", "bg-sky-500"], index),
                  )}
                />
                <Bar className="w-16" seed={index * 9} soft />
              </div>
            </div>
          ))}
        </div>

        {lead ? (
          <div className="mt-2 rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium">{lead}</h3>
              <span className="ml-auto h-6 w-24 rounded-md bg-fill" />
            </div>
            <div className="mt-4 flex h-44 items-end gap-1.5 sm:gap-2.5">
              {COLUMN_HEIGHTS.map((height, index) => (
                <span
                  className="flex-1 rounded-t-sm bg-fill-strong"
                  key={index}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-1.5 sm:gap-2.5">
              {COLUMN_HEIGHTS.map((_, index) => (
                <span className="h-1.5 flex-1 rounded-full bg-fill" key={index} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-2 grid gap-2 lg:grid-cols-2">
          {rest.map((chart, chartIndex) => (
            <div className="rounded-xl border bg-card p-4" key={chart}>
              <h3 className="text-sm font-medium">{chart}</h3>
              <div className="mt-4 flex flex-col gap-3">
                {Array.from({ length: 6 }, (_, row) => {
                  const seed = chartIndex * 17 + row * 3
                  return (
                    <div className="flex items-center gap-3" key={row}>
                      <Bar className="w-20 shrink-0" seed={seed} soft />
                      <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-fill">
                        <span
                          className={cn(
                            "block h-full rounded-full",
                            pick(
                              ["bg-sky-500/50", "bg-emerald-500/50", "bg-violet-500/50"],
                              chartIndex,
                            ),
                          )}
                          style={{ width: `${20 + spread(seed, 70)}%` }}
                        />
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Frame>
    </PageScroll>
  )
}

/**
 * One record, open.
 *
 * The template with the most modules behind it and the last one to exist: there
 * were forty-five registers in this app and no page for the row you click. Every
 * table implies one of these — an incident with its investigation and its
 * regulator clock, a person with their tickets, a plant item with its servicing
 * history — and a register you cannot open is a spreadsheet with better fonts.
 *
 * Four bands, in the order the questions arrive. What is this and what state is
 * it in; the facts that fit on one screen; the body, which is where the detail
 * lives; and what has happened to it, down the side where it can be ignored.
 */
export function RecordView({ view }: { readonly view: ModuleView }) {
  const facts = view.columns ?? ["Reference", "Raised", "Owner", "Due", "Site", "Status"]
  const sections = view.groups ?? ["Detail", "Controls", "Evidence"]

  return (
    <PageScroll overflows>
      <Frame>
        {/* The identity band. A record's status is the one fact that changes what
            you do next, so it sits with the name rather than among the fields. */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-fill">
            <span className="size-4 rounded bg-fill-strong" />
          </span>
          <div className="min-w-0 flex-1">
            <Bar className="w-56" seed={1} />
            <Bar className="mt-2 w-32" seed={2} soft />
          </div>
          <Pill seed={3} wide />
          <span className="h-8 w-24 rounded-md bg-fill-strong" />
          <span className="h-8 w-8 rounded-md border" />
        </div>

        <dl className="mt-6 grid gap-x-8 gap-y-3 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact, index) => (
            <div className="flex items-baseline gap-3" key={fact}>
              <dt className="w-24 shrink-0 text-xs text-muted-foreground">{fact}</dt>
              <dd className="min-w-0 flex-1">
                <Bar seed={index * 7} soft />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="min-w-0">
            {/* The body's own tabs, which are not the header's. The header switches
                *readings of a register*; these switch parts of one record, and a
                record deep enough to need them is deep enough that they cannot
                live two levels up. */}
            <div className="flex items-center gap-0.5 rounded-md bg-fill p-0.5">
              {sections.map((section, index) => (
                <span
                  className={cn(
                    "flex h-6 items-center rounded-[5px] px-2.5 text-xs font-medium",
                    index === 0
                      ? "bg-card text-foreground dark:bg-fill-strong"
                      : "text-muted-foreground/60",
                  )}
                  key={section}
                >
                  {section}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-6">
              {Array.from({ length: 3 }, (_, block) => (
                <div key={block}>
                  <Bar className="w-40" seed={block * 13} />
                  <div className="mt-3 flex flex-col gap-2">
                    {Array.from({ length: 3 }, (_, line) => (
                      <Bar
                        className={line === 2 ? "w-2/3" : "w-full"}
                        key={line}
                        seed={block * 5 + line}
                        soft
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The rail. Everything that happened *to* the record rather than in it
              — and on a narrow window it drops under the body rather than
              squeezing, because half of a two-column layout is not a layout. */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-xl border bg-card p-4">
              <GroupHeading>Activity</GroupHeading>
              <div className="mt-3 ml-1 flex flex-col gap-3 border-l pl-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div className="relative" key={index}>
                    <span
                      aria-hidden
                      className="absolute top-1 -left-[1.4rem] size-2 rounded-full border-2 border-card bg-fill-strong"
                    />
                    <Bar className="w-28" seed={index * 3} />
                    <Bar className="mt-1.5 w-20" seed={index * 5} soft />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4">
              <GroupHeading>Attachments</GroupHeading>
              <div className="mt-3 flex flex-col gap-2">
                {Array.from({ length: 3 }, (_, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <FileTextIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
                    <Bar className="w-24" seed={index * 11} soft />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Frame>
    </PageScroll>
  )
}

/**
 * Something issued rather than edited.
 *
 * A permit, an induction, a person's first day. These are not forms with a Save
 * button — they are sequences with a gate at each step, where the order is the
 * control: you do not authorise a confined space entry before the atmosphere has
 * been tested, and a form that let you would be worse than paper.
 *
 * So the steps are a rail rather than a scroll, the completed ones stay visible
 * to be gone back to, and the ones ahead are legible but not reachable. The
 * pipeline board a module like Onboarding also carries is the same process from
 * the other end — that one is every person at one step, this is every step for
 * one person.
 */
export function WizardView({ view }: { readonly view: ModuleView }) {
  const steps = view.groups ?? ["Details", "Controls", "Sign off"]
  // Far enough in that there is something behind you and something ahead, which
  // is the only state where a stepper shows all three of its treatments.
  const current = Math.min(1, steps.length - 1)

  return (
    <PageScroll overflows>
      <Frame className="max-w-5xl">
        <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
          <ol className="flex flex-col gap-1">
            {steps.map((step, index) => {
              const done = index < current
              const here = index === current
              return (
                <li
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-2",
                    here && "bg-fill",
                  )}
                  key={step}
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-medium",
                      done && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                      here && "bg-fill-strong text-foreground",
                      !done && !here && "border text-muted-foreground/60",
                    )}
                  >
                    {done ? <CheckIcon className="size-3" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 truncate text-sm",
                      here ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step}
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="min-w-0">
            {/* The bar says how far, the rail says where. Both, because a stepper
                with only the rail makes you count and one with only the bar makes
                you guess what is left. */}
            <div className="h-1 overflow-hidden rounded-full bg-fill">
              <span
                className="block h-full rounded-full bg-fill-strong"
                style={{ width: `${((current + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="mt-4 rounded-xl border bg-card">
              <div className="border-b px-4 py-3">
                <Bar className="w-40" seed={7} />
              </div>
              <div className="divide-y">
                {Array.from({ length: 4 }, (_, row) => (
                  <div className="flex items-center gap-4 px-4 py-3" key={row}>
                    <div className="min-w-0 flex-1">
                      <Bar className="w-32" seed={row * 9} />
                      <Bar className="mt-2" seed={row * 4} soft />
                    </div>
                    <span className="h-8 w-48 shrink-0 rounded-md border bg-fill/40" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-8 w-20 rounded-md border" />
              <span className="ml-auto h-8 w-28 rounded-md bg-fill-strong" />
            </div>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}

/**
 * The screen a record is *made* on, standing up, outdoors, on a phone.
 *
 * The most important layout in the product and the last one to exist. The site
 * diary is the record that wins disputes and `modules.txt` says it has to be the
 * fastest screen here; sign-on and prestarts are the same shape. All of them
 * rendered as a feed or a table until now — which are the shapes for *reading*
 * what was captured, by somebody at a desk, afterwards.
 *
 * So: one column and one question at a time, targets big enough for a gloved
 * thumb, and the actions pinned to the bottom of the screen rather than at the
 * end of a scroll. The pulled facts — weather, crew, plant — come first and
 * already answered, because the fastest field form is the one that has filled
 * itself in.
 *
 * The offline mark is the only decoration and it is load-bearing. Capture that
 * silently fails in a lift well is worse than capture that refuses, so the state
 * is on screen before you start typing rather than in a toast afterwards.
 */
export function CaptureView({ view }: { readonly view: ModuleView }) {
  const groups = view.groups ?? ["Conditions", "Work done", "Evidence"]

  return (
    <PageScroll overflows>
      {/* Narrow even on a desktop. This is a phone layout and widening it on a
          big screen would mean two designs to keep honest — and the person
          filling it in on a laptop is filling in the same form. */}
      <Frame className="max-w-lg pb-24">
        <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">
            Saved on this device — syncs when you have signal
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {groups.map((group, groupIndex) => (
            <section className="overflow-hidden rounded-xl border bg-card" key={group}>
              <div className="border-b px-4 py-2.5">
                <h2 className="text-sm font-medium">{group}</h2>
              </div>

              <div className="divide-y">
                {Array.from({ length: 2 + spread(groupIndex * 7, 2) }, (_, row) => {
                  const seed = groupIndex * 23 + row * 5
                  const kind = spread(seed, 4)
                  return (
                    <div className="px-4 py-3" key={row}>
                      <Bar className="w-36" seed={seed} />
                      {/* Four ways to answer, and every one of them a target
                          rather than a field: on site the difference between a
                          tap and a keyboard is the difference between the form
                          being filled in and being skipped. */}
                      {kind === 0 ? (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {["Yes", "No", "N/A"].map((label, index) => (
                            <span
                              className={cn(
                                "flex h-10 items-center justify-center rounded-md text-sm font-medium",
                                index === spread(seed + 1, 3)
                                  ? "bg-fill-strong text-foreground"
                                  : "border text-muted-foreground",
                              )}
                              key={label}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      ) : kind === 1 ? (
                        <div className="mt-3 flex gap-2">
                          {Array.from({ length: 3 }, (_, tile) => (
                            <span
                              className="grid size-16 place-items-center rounded-md bg-fill"
                              key={tile}
                            >
                              <ImageIcon className="size-4 text-muted-foreground/40" />
                            </span>
                          ))}
                          <span className="grid size-16 place-items-center rounded-md border border-dashed">
                            <PlusIcon className="size-4 text-muted-foreground/50" />
                          </span>
                        </div>
                      ) : kind === 2 ? (
                        <span className="mt-3 block h-20 rounded-md border bg-fill/40" />
                      ) : (
                        <span className="mt-3 block h-10 rounded-md border bg-fill/40" />
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          {/* The signature is its own band. It is the thing that makes the entry
              evidence rather than notes, and burying it as the last row of the
              last section is how it gets missed. */}
          <section className="rounded-xl border bg-card p-4">
            <h2 className="text-sm font-medium">Signature</h2>
            <span className="mt-3 block h-24 rounded-md border border-dashed bg-fill/30" />
            <Bar className="mt-3 w-40" seed={99} soft />
          </section>
        </div>
      </Frame>

      {/* Pinned, not appended. A form you scroll to submit is a form submitted by
          people who scrolled, and the whole point of this layout is the person
          who is halfway up a scaffold. */}
      <div className="sticky bottom-0 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-lg items-center gap-2">
          <span className="h-10 w-24 rounded-md border" />
          <span className="ml-auto h-10 flex-1 rounded-md bg-fill-strong" />
        </div>
      </div>
    </PageScroll>
  )
}
