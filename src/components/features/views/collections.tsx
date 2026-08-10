/**
 * The views that show many records at once: a table, a matrix, a checklist, a
 * card grid, a photo gallery.
 *
 * Each takes the module's own headings, so the scaffold says what the columns
 * will be even though it can't say what is in them. Column names are the part of
 * a screen worth arguing about early — they are the data model in the only
 * notation the customer reads — and a grey box with no headings can't be
 * argued with.
 */

import { CheckIcon, ImageIcon, MinusIcon } from "lucide-react"

import {
  Bar,
  Frame,
  GroupHeading,
  Pill,
  Toolbar,
  pick,
  spread,
} from "@/components/features/views/primitives"
import { PageScroll, PageScrollX } from "@/components/shared/page-scroll"
import type { ModuleView } from "@/lib/modules"
import { cn } from "@/lib/utils"

const ROW_COUNT = 16

/**
 * A register.
 *
 * The horizontal scroll is the table's own, inside the card, rather than the
 * page's: eight columns don't fit a narrow card and the alternative — letting
 * every heading truncate to three characters — makes the one honest part of the
 * scaffold unreadable. The card's edges keep answering to the vertical region
 * outside it, which is what the rounding logic reads.
 */
export function TableView({ view }: { readonly view: ModuleView }) {
  const columns = view.columns ?? ["Ref", "Name", "Site", "Owner", "Updated", "Status"]

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar />

        <div className="mt-3 overflow-hidden rounded-xl border bg-card">
          <div className="thin-scrollbar overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th
                      className="px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap text-muted-foreground"
                      key={column}
                      scope="col"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {Array.from({ length: ROW_COUNT }, (_, row) => (
                  <tr className="transition-colors hover:bg-accent/40" key={row}>
                    {columns.map((column, index) => (
                      <td className="px-3 py-2.5" key={column}>
                        {index === columns.length - 1 ? (
                          <Pill seed={row * 5 + index} />
                        ) : (
                          <Bar
                            className={index === 0 ? "w-28" : undefined}
                            seed={row * 7 + index * 3}
                            soft={index > 1}
                          />
                        )}
                      </td>
                    ))}
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

/**
 * Risk heat, by likelihood against consequence. Five by five because that is
 * what every AU contractor's risk procedure already says, and a tool that
 * renumbers the matrix makes every historical score a translation exercise.
 */
const HEAT = [
  "bg-emerald-500/15",
  "bg-amber-400/25",
  "bg-orange-500/25",
  "bg-red-500/25",
] as const

const heatFor = (likelihood: number, consequence: number): string => {
  const score = likelihood * consequence
  if (score >= 15) return HEAT[3]
  if (score >= 10) return HEAT[2]
  if (score >= 5) return HEAT[1]
  return HEAT[0]
}

/**
 * A grid of one thing against another: risks by likelihood and consequence,
 * people by competency, roles by permission.
 *
 * Two readings of the same shape, split by `heat`. A risk matrix's cell is a
 * band and its meaning is the colour; a coverage grid's cell is a yes or a no
 * and its meaning is the mark. Drawing both the same way would make the coverage
 * grid look like a heat map of nothing.
 */
export function MatrixView({ view }: { readonly view: ModuleView }) {
  const columns = view.columns ?? ["A", "B", "C", "D", "E"]
  const rows = view.rows ?? ["One", "Two", "Three", "Four", "Five"]
  const template = `minmax(9rem, 1.3fr) repeat(${columns.length}, minmax(5rem, 1fr))`

  return (
    <PageScroll>
      <Frame>
        <div className="thin-scrollbar overflow-x-auto rounded-xl border bg-card">
          <div className="min-w-[44rem]">
            {/* The corner cell is deliberately empty — it belongs to neither
                axis, and every label put in one is a caption for the wrong
                thing. */}
            <div
              className="grid border-b text-xs font-medium text-muted-foreground"
              style={{ gridTemplateColumns: template }}
            >
              <span className="px-3 py-2.5" />
              {columns.map((column) => (
                <span className="px-2 py-2.5 text-center" key={column}>
                  {column}
                </span>
              ))}
            </div>

            <div className="divide-y">
              {rows.map((row, rowIndex) => (
                <div
                  className="grid items-center"
                  key={row}
                  style={{ gridTemplateColumns: template }}
                >
                  <span className="truncate px-3 py-2 text-sm">{row}</span>
                  {columns.map((column, columnIndex) => (
                    <div className="px-1.5 py-1.5" key={column}>
                      {view.heat ? (
                        <span
                          className={cn(
                            "block h-8 rounded-md",
                            heatFor(rows.length - rowIndex, columnIndex + 1),
                          )}
                        />
                      ) : (
                        <MatrixMark seed={rowIndex * 11 + columnIndex * 5} />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}

/** Held, not held, or held and expiring — the three states a coverage grid has
 *  to tell apart, since the third is the only one anybody acts on. */
function MatrixMark({ seed }: { readonly seed: number }) {
  const state = spread(seed, 5)
  if (state === 0) {
    return (
      <span className="grid h-8 place-items-center rounded-md">
        <MinusIcon className="size-3.5 text-muted-foreground/35" />
      </span>
    )
  }
  const expiring = state === 1
  return (
    <span
      className={cn(
        "grid h-8 place-items-center rounded-md",
        expiring ? "bg-amber-500/15" : "bg-emerald-500/12",
      )}
    >
      <CheckIcon
        className={cn(
          "size-3.5",
          expiring
            ? "text-amber-600 dark:text-amber-400"
            : "text-emerald-600 dark:text-emerald-400",
        )}
      />
    </span>
  )
}

/**
 * An inspection or an ITP: grouped rows, each answered.
 *
 * The three answers get equal width rather than the selected one growing. On a
 * form filled at a handrail with one thumb, a target that moves once you have
 * answered the row above it is the whole difference between fast and infuriating.
 */
export function ChecklistView({ view }: { readonly view: ModuleView }) {
  const groups = view.groups ?? ["Section one", "Section two", "Section three"]

  return (
    <PageScroll overflows>
      <Frame className="max-w-4xl">
        <Toolbar filters={2} />

        <div className="mt-4 flex flex-col gap-6">
          {groups.map((group, groupIndex) => (
            <section key={group}>
              <div className="flex items-center gap-3">
                <GroupHeading>{group}</GroupHeading>
                <span className="h-px flex-1 bg-border" />
                <Pill seed={groupIndex} />
              </div>

              <div className="mt-2 overflow-hidden rounded-xl border bg-card divide-y">
                {Array.from({ length: 4 + spread(groupIndex, 3) }, (_, row) => {
                  const seed = groupIndex * 13 + row * 3
                  const answer = spread(seed, 3)
                  return (
                    <div className="flex items-center gap-3 px-3 py-2.5" key={row}>
                      <div className="min-w-0 flex-1">
                        <Bar className="w-40" seed={seed} />
                        {/* Hold and witness points are the reason an ITP is not
                            a checklist — the row can't be passed by the person
                            filling it in. Marked on some rows, not all. */}
                        {spread(seed + 1, 3) === 0 ? (
                          <span className="mt-1.5 inline-block rounded bg-fill px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Hold point
                          </span>
                        ) : (
                          <Bar className="mt-1.5" seed={seed + 2} soft />
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-fill p-0.5">
                        {["Pass", "Fail", "N/A"].map((label, index) => (
                          <span
                            className={cn(
                              "flex h-6 items-center rounded-[5px] px-2.5 text-xs font-medium",
                              index === answer
                                ? "bg-card text-foreground dark:bg-fill-strong"
                                : "text-muted-foreground/60",
                            )}
                            key={label}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
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
 * A grid of things with a face or a logo: the people directory, the integrations
 * catalogue.
 *
 * A card grid rather than a table when the identifying feature is a picture. The
 * moment the answer to "which one" is a name in the second column, the table is
 * the better screen and this is decoration.
 */
export function CardsView({ view }: { readonly view: ModuleView }) {
  const count = view.rows?.length ?? 15

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={2} />

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, index) => (
            <div
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40"
              key={index}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-fill">
                <span className="size-4 rounded bg-fill-strong" />
              </span>
              <div className="min-w-0 flex-1">
                <Bar className="w-28" seed={index * 3} />
                <Bar className="mt-2" seed={index * 5 + 1} soft />
              </div>
              <Pill seed={index} />
            </div>
          ))}
        </div>
      </Frame>
    </PageScroll>
  )
}

/** The photo wall, grouped by the day the photos were taken — which is the only
 *  grouping anybody looks for and the one a camera roll can't offer. */
export function GalleryView() {
  const days = ["Today", "Yesterday", "Friday", "Thursday"]

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mt-4 flex flex-col gap-6">
          {days.map((day, dayIndex) => (
            <section key={day}>
              <div className="flex items-center gap-3">
                <GroupHeading>{day}</GroupHeading>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 + spread(dayIndex, 5) }, (_, index) => (
                  <figure
                    className="overflow-hidden rounded-xl border bg-card"
                    key={index}
                  >
                    <span
                      className={cn(
                        "grid aspect-4/3 place-items-center",
                        pick(
                          ["bg-fill", "bg-fill-strong/60", "bg-fill-strong/40"],
                          index,
                        ),
                      )}
                    >
                      <ImageIcon className="size-5 text-muted-foreground/30" />
                    </span>
                    <figcaption className="flex items-center gap-2 px-2.5 py-2">
                      <Bar className="w-20" seed={dayIndex * 9 + index} soft />
                      <span className="ml-auto size-4 shrink-0 rounded-full bg-fill-strong" />
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Frame>
    </PageScroll>
  )
}

/**
 * A register you type into rather than one you read.
 *
 * `table` and this are not the same screen wearing different fonts. A table is
 * sorted, filtered and scanned; a grid is *entered* — a foreman on a Friday
 * putting seven days of hours against twelve people, tabbing across, watching a
 * total. Timesheets and progress claims rendered as tables until now, which made
 * the commonest weekly job in the product look like a report about itself.
 *
 * Three things follow from being an entry surface. The first column is frozen,
 * because the row you are typing into has to keep saying whose it is. The totals
 * are a real row rather than a footnote, because the number people check before
 * submitting is the sum. And the cells look like cells — a visible box each —
 * since an editable area that looks like text is one nobody edits.
 */
export function GridView({ view }: { readonly view: ModuleView }) {
  const columns = view.columns ?? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const rows = view.rows ?? [
    "Alex Kerr",
    "Priya Tan",
    "Marcus Reid",
    "Jo Lin",
    "Sam Okafor",
    "Ruth Alvarez",
  ]
  const template = `minmax(10rem, 14rem) repeat(${columns.length}, minmax(4.5rem, 1fr)) minmax(5rem, 6rem)`

  return (
    <PageScrollX overflows overflowsDown>
      <div className="w-max min-w-full p-4">
        {/* No `overflow-hidden` on the card: the frozen column is `sticky`, and a
            clipped ancestor is a scroll container of its own that sticky would
            stick to instead. Same trap the timeline hit — the corners are
            rounded on the cells that paint into them. */}
        <div className="min-w-[52rem] rounded-xl border bg-card">
          <div
            className="grid border-b text-xs font-medium text-muted-foreground"
            style={{ gridTemplateColumns: template }}
          >
            <span className="sticky left-0 z-10 rounded-tl-xl border-r bg-card px-3 py-2.5">
              {rows.length} people
            </span>
            {columns.map((column) => (
              <span className="px-2 py-2.5 text-center" key={column}>
                {column}
              </span>
            ))}
            <span className="border-l px-2 py-2.5 text-center">Total</span>
          </div>

          <div className="divide-y">
            {rows.map((row, rowIndex) => (
              <div
                className="grid items-center"
                key={row}
                style={{ gridTemplateColumns: template }}
              >
                <span className="sticky left-0 z-10 truncate border-r bg-card px-3 py-1.5 text-sm">
                  {row}
                </span>
                {columns.map((column, columnIndex) => {
                  const seed = rowIndex * 13 + columnIndex * 3
                  // Weekends mostly blank, weekdays mostly filled — the shape of
                  // a real week, so the grid reads as data rather than as noise.
                  const filled =
                    columnIndex < 5 ? spread(seed, 6) > 0 : spread(seed, 4) === 0
                  return (
                    <div className="p-1" key={column}>
                      <span
                        className={cn(
                          "flex h-8 items-center justify-center rounded-md border text-sm",
                          filled ? "bg-card" : "border-dashed bg-fill/30",
                        )}
                      >
                        {filled ? <Bar className="w-6" seed={seed} /> : null}
                      </span>
                    </div>
                  )
                })}
                <div className="border-l p-1">
                  <span className="flex h-8 items-center justify-center rounded-md bg-fill/60 text-sm">
                    <Bar className="w-8" seed={rowIndex * 31} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="grid items-center border-t bg-fill/40"
            style={{ gridTemplateColumns: template }}
          >
            <span className="sticky left-0 z-10 rounded-bl-xl border-r bg-fill/40 px-3 py-2.5 text-xs font-medium">
              Total
            </span>
            {columns.map((column, index) => (
              <span className="px-2 py-2.5 text-center" key={column}>
                <Bar className="mx-auto w-8" seed={index * 17} />
              </span>
            ))}
            <span className="border-l px-2 py-2.5 text-center">
              <Bar className="mx-auto w-10" seed={5} />
            </span>
          </div>
        </div>
      </div>
    </PageScrollX>
  )
}
