/**
 * The two views whose output is a *document* rather than a screen.
 *
 * Everything else in this vocabulary is a way of reading records. These two are
 * ways of producing something to hand over — an evidence pack for a surveillance
 * audit, a comparison of the SWMS you signed against the one in force. The
 * artefact is the point, and both are shaped by where they end up rather than by
 * the window they are drawn in.
 */

import { FileTextIcon } from "lucide-react"

import { Bar, Frame, GroupHeading } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import type { ModuleView } from "@/lib/modules"
import { cn } from "@/lib/utils"

/**
 * Something to be printed, emailed, or handed to an auditor.
 *
 * Drawn as sheets on a desk rather than as a page in a browser: a fixed measure,
 * a shadow, a margin, a number at the foot. That is not decoration — the week
 * before a surveillance audit is spent assembling exactly this, and a screen that
 * looks like the thing you are going to send is a screen you can check before you
 * send it. A dashboard of the same numbers cannot be checked that way, because
 * nobody knows what it will become.
 *
 * Two sheets, so the pagination is visible. One would read as a card.
 */
export function ReportView({ view }: { readonly view: ModuleView }) {
  const sections = view.groups ?? ["Scope", "Findings", "Evidence", "Actions"]
  const meta = view.columns ?? ["Standard", "Scope", "Period", "Prepared by"]

  return (
    <PageScroll overflows>
      <Frame className="max-w-4xl">
        {/* The controls sit outside the sheet, because they are not part of what
            gets sent. Everything inside the paper is the document. */}
        <div className="flex items-center gap-2">
          <span className="h-7 w-32 rounded-md bg-fill" />
          <span className="h-7 w-24 rounded-md bg-fill" />
          <span className="ml-auto h-7 w-24 rounded-md bg-fill-strong" />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {[0, 1].map((sheet) => (
            <article
              className="mx-auto w-full max-w-2xl rounded-sm border bg-card px-10 py-12 shadow-sm"
              key={sheet}
            >
              {sheet === 0 ? (
                <>
                  {/* The cover. A report that opens on its first finding has
                      lost the two things an auditor checks first: what it
                      covers, and when. */}
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="size-4 text-muted-foreground/60" />
                    <Bar className="w-24" seed={1} soft />
                  </div>
                  <Bar className="mt-6 h-3 w-3/4" seed={2} />
                  <Bar className="mt-3 h-3 w-1/2" seed={3} soft />

                  <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-3 border-t pt-6 text-sm">
                    {meta.map((label, index) => (
                      <div className="flex items-baseline gap-3" key={label}>
                        <dt className="w-24 shrink-0 text-xs text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="min-w-0 flex-1">
                          <Bar seed={index * 7} soft />
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-10 border-t pt-6">
                    <GroupHeading>Contents</GroupHeading>
                    <ol className="mt-3 flex flex-col gap-2">
                      {sections.map((section, index) => (
                        <li className="flex items-baseline gap-3 text-sm" key={section}>
                          <span className="w-4 shrink-0 text-muted-foreground">
                            {index + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate">{section}</span>
                          {/* The leader dots are what make a list a contents
                              page rather than a list. */}
                          <span
                            aria-hidden
                            className="h-px min-w-6 flex-1 self-center border-b border-dotted"
                          />
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {index + 2}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : (
                sections.slice(0, 2).map((section, index) => (
                  <section className={cn(index > 0 && "mt-10")} key={section}>
                    <h2 className="text-sm font-semibold tracking-tight">
                      {index + 1}. {section}
                    </h2>
                    <div className="mt-3 flex flex-col gap-2">
                      {Array.from({ length: 4 }, (_, line) => (
                        <Bar
                          className={line === 3 ? "w-2/3" : "w-full"}
                          key={line}
                          seed={index * 11 + line}
                          soft
                        />
                      ))}
                    </div>
                    <div className="mt-4 rounded-sm border">
                      <div className="border-b bg-fill/40 px-3 py-2">
                        <Bar className="w-20" seed={index * 3} soft />
                      </div>
                      {Array.from({ length: 3 }, (_, row) => (
                        <div className="border-b px-3 py-2 last:border-b-0" key={row}>
                          <Bar seed={index * 17 + row} soft />
                        </div>
                      ))}
                    </div>
                  </section>
                ))
              )}

              <p className="mt-12 border-t pt-4 text-center text-[10px] text-muted-foreground/60">
                {sheet + 1}
              </p>
            </article>
          ))}
        </div>
      </Frame>
    </PageScroll>
  )
}

/** Which lines differ, by row. Fixed rather than seeded: a diff is a claim about
 *  two specific documents, and marks that moved when the list grew would be a
 *  claim about nothing. */
const CHANGES: Record<number, "added" | "removed" | "same"> = {
  2: "removed",
  3: "added",
  7: "added",
  11: "removed",
  12: "added",
}

/**
 * Two versions, side by side.
 *
 * Document control is the whole reason this exists. A SWMS is versioned and
 * acknowledged by every worker who does the task — so when the method changes,
 * the question is never "what does it say" but "what changed, and who signed the
 * old one". A register of versions answers the first half; only this answers the
 * second.
 *
 * Both columns scroll together as one region rather than independently. Panes
 * that scroll apart stop being a comparison at the first flick.
 *
 * `media` swaps the lines for images and the argument is the same one: a defect
 * and its fix, a pour before and after, are two versions of one thing and the
 * question is what changed. The layout does not move — only what fills it — so
 * the two readings stay recognisably the same screen.
 */
export function CompareView({ view }: { readonly view: ModuleView }) {
  const sides = view.columns ?? ["Version 3", "Version 4"]

  return (
    <PageScroll overflows>
      <Frame>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="grid grid-cols-2 divide-x border-b">
            {sides.slice(0, 2).map((side, index) => (
              <div className="flex items-center gap-2 px-4 py-2.5" key={side}>
                <span className="text-sm font-medium">{side}</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                    index === 0
                      ? "bg-fill text-muted-foreground"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {index === 0 ? "Superseded" : "In force"}
                </span>
              </div>
            ))}
          </div>

          {view.media ? (
            <div className="grid grid-cols-2 divide-x">
              {[0, 1].map((column) => (
                <div className="flex flex-col gap-2 p-3" key={column}>
                  {Array.from({ length: 3 }, (_, index) => (
                    <figure key={index}>
                      <span
                        className={cn(
                          "grid aspect-4/3 place-items-center rounded-md",
                          column === 0 ? "bg-fill" : "bg-fill-strong/50",
                        )}
                      >
                        <FileTextIcon className="size-5 text-muted-foreground/30" />
                      </span>
                      <figcaption className="mt-1.5">
                        <Bar className="w-24" seed={column * 13 + index} soft />
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 divide-x">
              {[0, 1].map((column) => (
                <div className="flex flex-col" key={column}>
                  {Array.from({ length: 16 }, (_, line) => {
                    const change = CHANGES[line] ?? "same"
                    // A line added on the right is a line missing on the left, and
                    // vice versa — so each side shows the change that belongs to
                    // it and a blank where the other side gained something. That
                    // blank is what keeps the two columns on the same line number.
                    const mine =
                      (column === 0 && change === "removed") ||
                      (column === 1 && change === "added")
                    const theirs = change !== "same" && !mine
                    return (
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-1.5",
                          mine && change === "added" && "bg-emerald-500/10",
                          mine && change === "removed" && "bg-red-500/10",
                          theirs && "bg-fill/40",
                        )}
                        key={line}
                      >
                        <span className="w-5 shrink-0 text-right text-[10px] text-muted-foreground/50">
                          {theirs ? "" : line + 1}
                        </span>
                        {theirs ? (
                          <span className="h-2 flex-1" />
                        ) : (
                          <Bar className="flex-1" seed={column * 31 + line} soft />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </Frame>
    </PageScroll>
  )
}
