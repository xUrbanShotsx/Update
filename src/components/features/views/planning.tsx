/**
 * The views that put records against something other than a list: stages, dates,
 * a calendar month, a plan.
 *
 * Three of them answer "when" or "how far along" and one answers "where" — all
 * of them questions a table can only answer by being sorted, and a sorted table
 * loses the answer the moment somebody sorts it by something else.
 */

import { MapPinIcon } from "lucide-react"

import {
  Avatar,
  Bar,
  Frame,
  Pill,
  Toolbar,
  pick,
  spread,
} from "@/components/features/views/primitives"
import { PageScroll, PageScrollX } from "@/components/shared/page-scroll"
import type { ModuleView } from "@/lib/modules"
import { cn } from "@/lib/utils"

/** A lane's dot, by position. Ordered the way a pipeline runs — neutral at the
 *  start, warm in the middle, green at the end — so the colour is telling you
 *  the same thing the column order is. */
const LANE_DOTS = [
  "bg-muted-foreground/40",
  "bg-sky-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-destructive",
] as const

/**
 * Work by stage.
 *
 * Columns don't scroll on their own — a long lane makes the whole board taller
 * and the region around it carries that, the same rule the real Projects board
 * follows. Two scrollbars inside one board is how you lose a card.
 */
export function BoardView({ view }: { readonly view: ModuleView }) {
  const lanes = view.columns ?? ["Backlog", "In progress", "Review", "Done"]

  return (
    <PageScrollX overflows overflowsDown>
      {/* `w-max` so the trailing padding survives the overflow — a flex row that
          exceeds its container drops it, and the last lane would sit hard
          against the edge. */}
      <div className="flex w-max items-start gap-3 p-4">
        {lanes.map((lane, laneIndex) => {
          const cards = 2 + spread(laneIndex * 3, 5)
          return (
            <section
              className="flex w-72 shrink-0 flex-col rounded-xl border bg-card/40"
              key={lane}
            >
              <header className="flex shrink-0 items-center gap-2 px-3 py-2.5">
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    pick(LANE_DOTS, laneIndex + lanes.length),
                  )}
                />
                <h2 className="text-sm font-medium">{lane}</h2>
                <span className="text-xs text-muted-foreground/70">{cards}</span>
              </header>

              <div className="flex flex-col gap-2 px-2 pb-2">
                {Array.from({ length: cards }, (_, index) => {
                  const seed = laneIndex * 17 + index * 5
                  return (
                    <article
                      className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40"
                      key={index}
                    >
                      <Bar className="w-44" seed={seed} />
                      <Bar className="mt-2" seed={seed + 1} soft />
                      <div className="mt-3 flex items-center gap-2">
                        <Pill seed={seed} />
                        <Bar className="ml-auto w-10" seed={seed + 2} soft />
                        <Avatar className="size-5" />
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </PageScrollX>
  )
}

/**
 * Bars against a ruler: the three-week lookahead, plant on hire, tickets running
 * out.
 *
 * The label column is `sticky left-0` rather than a second scroller kept in
 * step. Two panes synchronised in JavaScript is the classic Gantt bug — they
 * drift by a pixel per frame under momentum scrolling, and the row you are
 * reading stops being the row you are pointing at.
 */
export function TimelineView({ view }: { readonly view: ModuleView }) {
  const columns = view.columns ?? ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"]
  const rows = view.rows ?? ["One", "Two", "Three", "Four", "Five", "Six"]
  const template = `minmax(12rem, 14rem) repeat(${columns.length}, minmax(6.5rem, 1fr))`
  /** Where "now" falls. One column in, so there is a past to see as well as a
   *  future — a ruler that starts at today hides every overrun on it. */
  const current = 1

  return (
    <PageScrollX overflows overflowsDown>
      <div className="w-max min-w-full p-4">
        {/* No `overflow-hidden`, however much the corners want it: an ancestor
            with a clipped overflow is a scroll container of its own, and a
            `sticky` element inside one sticks to *that* box — which never
            scrolls, so the label column would ride away with the ruler. The two
            corners it would have clipped are rounded on the cells themselves
            instead, which is the only part of the card that paints into
            them. */}
        <div className="min-w-[56rem] rounded-xl border bg-card">
          <div
            className="grid border-b text-xs font-medium text-muted-foreground"
            style={{ gridTemplateColumns: template }}
          >
            <span className="sticky left-0 z-10 rounded-tl-xl border-r bg-card px-3 py-2.5">
              {rows.length} rows
            </span>
            {columns.map((column, index) => (
              <span
                className={cn(
                  "px-3 py-2.5 text-center",
                  index === current && "bg-fill/60 text-foreground",
                )}
                key={column}
              >
                {column}
              </span>
            ))}
          </div>

          <div className="divide-y">
            {rows.map((row, rowIndex) => {
              const span = 1 + spread(rowIndex * 7, Math.min(3, columns.length))
              const start = spread(rowIndex * 13 + 5, columns.length - span + 1)
              return (
                <div
                  className="grid items-center transition-colors hover:bg-accent/30"
                  key={row}
                  style={{ gridTemplateColumns: template }}
                >
                  <span
                    className={cn(
                      "sticky left-0 z-10 truncate border-r bg-card px-3 py-2.5 text-sm",
                      rowIndex === rows.length - 1 && "rounded-bl-xl",
                    )}
                  >
                    {row}
                  </span>
                  {/* The lane, drawn as one cell spanning the whole ruler, with
                      the bar placed inside it by column. Placing the bar in a
                      real grid cell would cap it at one column wide. */}
                  <div
                    className="relative grid py-2"
                    style={{
                      gridColumn: `2 / span ${columns.length}`,
                      gridTemplateColumns: `repeat(${columns.length}, minmax(6.5rem, 1fr))`,
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 bg-fill/50"
                      style={{
                        left: `${(current * 100) / columns.length}%`,
                        width: `${100 / columns.length}%`,
                      }}
                    />
                    <span
                      className={cn(
                        "relative mx-1.5 h-6 rounded-md",
                        pick(
                          [
                            "bg-sky-500/25",
                            "bg-emerald-500/25",
                            "bg-amber-500/25",
                            "bg-violet-500/25",
                          ],
                          rowIndex,
                        ),
                      )}
                      style={{ gridColumn: `${start + 1} / span ${span}` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </PageScrollX>
  )
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

/**
 * A month.
 *
 * Six rows always, rather than five when the month allows it. A calendar that
 * changes height between August and September moves every control under it, and
 * the row you are reaching for is somewhere else each time you come back.
 *
 * Weekends are shaded rather than hidden. Concrete gets poured on Saturdays.
 */
export function CalendarView() {
  /** A month that starts on a Wednesday, so the leading blanks are visible and
   *  the grid isn't quietly a table of four full weeks. */
  const offset = 2
  const days = 31

  return (
    <PageScroll>
      <Frame className="flex h-full min-h-[36rem] flex-col">
        <Toolbar filters={2} />

        <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card">
          <div className="grid shrink-0 grid-cols-7 border-b">
            {WEEKDAYS.map((day, index) => (
              <span
                className={cn(
                  "px-2 py-2 text-center text-xs font-medium text-muted-foreground",
                  index > 4 && "bg-fill/40",
                )}
                key={day}
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
            {Array.from({ length: 42 }, (_, cell) => {
              const date = cell - offset + 1
              const inMonth = date >= 1 && date <= days
              const weekend = cell % 7 > 4
              const events = inMonth ? spread(cell * 3, 4) : 0

              return (
                <div
                  className={cn(
                    "min-w-0 border-r border-b p-1.5 last:border-r-0",
                    weekend && "bg-fill/40",
                    !inMonth && "bg-fill/20",
                  )}
                  key={cell}
                >
                  {inMonth ? (
                    <>
                      <span className="text-[11px] text-muted-foreground">{date}</span>
                      <div className="mt-1 flex flex-col gap-1">
                        {Array.from({ length: events }, (_, index) => (
                          <span
                            className={cn(
                              "block h-4 rounded",
                              pick(
                                [
                                  "bg-sky-500/20",
                                  "bg-emerald-500/20",
                                  "bg-amber-500/20",
                                  "bg-violet-500/20",
                                ],
                                cell + index,
                              ),
                            )}
                            key={index}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}

/** Pin positions, as percentages. Fixed rather than seeded: a plan is a picture
 *  of somewhere real, and pins that drift when a row is added would undo the one
 *  thing a map is for. */
const PINS = [
  { x: 22, y: 31 },
  { x: 47, y: 18 },
  { x: 63, y: 44 },
  { x: 35, y: 62 },
  { x: 74, y: 28 },
  { x: 18, y: 74 },
  { x: 55, y: 71 },
  { x: 82, y: 58 },
] as const

/**
 * Where things are.
 *
 * The one question this product asks constantly and no other template answers. A
 * defect is location-pinned, a photo is taken at a spot on a plan, plant is
 * somewhere or it is missing, and "who is on site" is a muster before it is a
 * list. All of that rendered as rows until this existed, which is to say it
 * rendered as the thing you would print *after* you had already gone and looked.
 *
 * The list stays beside it, and that is deliberate rather than a fallback. A map
 * is unbeatable for "which one is nearest the gate" and useless for "which one
 * is oldest" — so the two are one screen and the same records, and hovering
 * either is meant to light the other once these are real.
 */
export function MapView({ view }: { readonly view: ModuleView }) {
  const rows = view.rows ?? []
  const count = Math.min(PINS.length, rows.length || 6)

  return (
    // Full bleed, like the other split. A plan is not content laid on a page —
    // it is the page, and every pixel spent on a gutter is a pixel of ground you
    // cannot see. The page card's own corners are what clip it, and there is no
    // `PageScroll` because neither pane moves the page: the list scrolls itself
    // and the plan does not scroll at all.
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* The list leads on a narrow window and moves to the left at `lg`. A plan
          squeezed into a phone's width is a picture of nothing, so the rows —
          which still work at any width — take the top rather than being pushed
          under a map nobody can read. Capped there too, or the plan would be a
          strip below the fold. */}
      <div className="thin-scrollbar flex max-h-64 shrink-0 flex-col overflow-y-auto border-b lg:max-h-none lg:w-72 lg:border-b-0 lg:border-r">
        <div className="shrink-0 border-b p-2">
          <span className="block h-7 rounded-md bg-fill" />
        </div>
        {Array.from({ length: count }, (_, index) => (
          <div
            className={cn(
              "flex shrink-0 items-center gap-3 border-b px-3 py-2.5 last:border-b-0",
              index === 0 ? "bg-accent/60" : "hover:bg-accent/30",
            )}
            key={index}
          >
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-fill-strong text-[10px] font-medium">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              {rows[index] ? (
                <span className="block truncate text-sm">{rows[index]}</span>
              ) : (
                <Bar className="w-28" seed={index * 5} />
              )}
              <Bar className="mt-1.5" seed={index * 9} soft />
            </div>
            <Pill seed={index} />
          </div>
        ))}
      </div>

      {/* The plan. A grid rather than a picture of a map: this is a site drawing
          as often as it is a street, and a grey grid reads as "a surface with
          positions on it" without pretending to be either. */}
      <div className="relative min-h-64 flex-1 bg-fill/40">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:2rem_2rem]"
        />
        {PINS.slice(0, count).map((pin, index) => (
          <span
            className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
            key={index}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-[10px] font-medium shadow-sm",
                index === 0
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground ring-1 ring-border",
              )}
            >
              {index + 1}
            </span>
            {/* The stem is what makes the circle a pin — without it the mark
                floats and its anchor is a guess. */}
            <span
              aria-hidden
              className={cn("h-2 w-px", index === 0 ? "bg-foreground" : "bg-border")}
            />
          </span>
        ))}
        <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-md bg-card/90 px-2 py-1 text-[10px] text-muted-foreground ring-1 ring-border">
          <MapPinIcon className="size-3" />
          {count} pinned
        </span>
      </div>
    </div>
  )
}

const HEAT_MONTHS = [
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
] as const

/** Four steps and an empty. More bands would be a gradient, and a gradient is
 *  a picture rather than a reading — the point of this chart is that you can
 *  tell two adjacent days apart at a glance. */
const HEAT_STEPS = [
  "bg-fill",
  "bg-emerald-500/20",
  "bg-emerald-500/40",
  "bg-emerald-500/60",
  "bg-emerald-500/80",
] as const

/**
 * A year of days, shaded.
 *
 * The one chart that answers "is this happening consistently" rather than "how
 * much of it happened". Diary completion is the case `modules.txt` names — a
 * monthly average of 90% hides a site that stopped filling it in for three
 * weeks, and this does not. Same shape reads incident frequency, attendance and
 * the density of tickets falling due.
 *
 * Weeks run down and months across, which is the convention every version of
 * this chart has used since the first one. Sunday-to-Saturday columns are what
 * make a fortnight of blanks look like a fortnight rather than like fourteen
 * scattered squares.
 */
export function HeatmapView({ view }: { readonly view: ModuleView }) {
  const rows = view.rows ?? ["Mon", "Wed", "Fri"]

  return (
    <PageScroll overflows>
      <Frame>
        <div className="rounded-xl border bg-card p-4">
          <div className="thin-scrollbar overflow-x-auto pb-2">
            <div className="min-w-[48rem]">
              <div className="flex gap-[3px] pl-8 text-[10px] text-muted-foreground">
                {HEAT_MONTHS.map((month) => (
                  // Each month is between four and five weeks wide, so the
                  // labels are spaced by column count rather than evenly — an
                  // even split drifts a whole week by June.
                  <span className="w-[calc((0.75rem+3px)*4.4)] shrink-0" key={month}>
                    {month}
                  </span>
                ))}
              </div>

              <div className="mt-1 flex gap-[3px]">
                <div className="flex w-8 shrink-0 flex-col justify-around gap-[3px] pr-1 text-right text-[10px] text-muted-foreground">
                  {rows.map((row) => (
                    <span key={row}>{row}</span>
                  ))}
                </div>

                {Array.from({ length: 53 }, (_, week) => (
                  <div className="flex shrink-0 flex-col gap-[3px]" key={week}>
                    {Array.from({ length: 7 }, (_, day) => {
                      const seed = week * 7 + day
                      // Weekends mostly empty, and a fortnight in the middle of
                      // the year deliberately blank — the gap is the whole
                      // reason to draw this rather than a monthly average.
                      const off = day > 4 || (week > 22 && week < 25)
                      const level = off ? 0 : 1 + spread(seed, 4)
                      return (
                        <span
                          className={cn("size-3 rounded-[2px]", HEAT_STEPS[level])}
                          key={day}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>Less</span>
            {HEAT_STEPS.map((step) => (
              <span className={cn("size-3 rounded-[2px]", step)} key={step} />
            ))}
            <span>More</span>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
