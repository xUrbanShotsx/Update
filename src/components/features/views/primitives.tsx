/**
 * The pieces every scaffold view is drawn from.
 *
 * A scaffold is not a loading state and shouldn't be mistaken for one: nothing
 * here pulses. The point is to show what shape a module's screen takes — that
 * Safety is a table and Actions is a board — while being obviously, permanently
 * empty. A shimmer would promise records that are two seconds away.
 *
 * Server components, all of them. No "use client" and no hooks, so a page of
 * these ships no JavaScript.
 */

import { cn } from "@/lib/utils"

/**
 * Bar widths, as literal classes.
 *
 * Tailwind reads source text rather than runtime values, so a computed
 * `w-[${n}px]` produces no CSS at all. A fixed set of literals is the only way a
 * varied width survives the build.
 */
const WIDTHS = ["w-10", "w-14", "w-20", "w-24", "w-28", "w-32", "w-40"] as const

/**
 * A stable scramble of an index.
 *
 * `Math.random()` is the obvious way to vary a skeleton and the wrong one twice
 * over: the server and the client would disagree on every width and React would
 * shout about it, and a scaffold that reshuffles on each navigation reads as
 * data changing. Same seed, same layout, forever.
 */
function hash(seed: number): number {
  let x = Math.imul(seed + 1, 2654435761)
  x ^= x >>> 15
  x = Math.imul(x, 2246822507)
  x ^= x >>> 13
  return x >>> 0
}

/** One of `items`, chosen by seed. The tuple type is what lets the fallback be
 *  `items[0]` rather than a non-null assertion under `noUncheckedIndexedAccess`. */
export function pick<T>(items: readonly [T, ...T[]], seed: number): T {
  return items[hash(seed) % items.length] ?? items[0]
}

/** A whole number in `[0, bound)`, from the same scramble. */
export const spread = (seed: number, bound: number): number => hash(seed) % bound

/**
 * A line of absent text.
 *
 * `bg-fill-strong` rather than `bg-fill` because only one of them carries on a
 * card in both themes: light lifts the card to white and fill-strong sits below
 * it, dark drops the card to 0.265 and fill-strong sits above it. `bg-fill` is
 * within 0.03 of the card in dark, which is not enough of a step to read as a
 * line of text at all.
 */
export function Bar({
  className,
  seed = 0,
  soft,
}: {
  readonly className?: string
  readonly seed?: number
  /** Secondary text — a subtitle under a title, a meta line under a row. */
  readonly soft?: boolean
}) {
  return (
    <span
      className={cn(
        "block h-2 max-w-full rounded-full",
        soft ? "bg-fill-strong/55" : "bg-fill-strong",
        pick(WIDTHS, seed),
        className,
      )}
    />
  )
}

/** A round nothing where a face goes. */
export function Avatar({ className }: { readonly className?: string }) {
  return (
    <span
      className={cn("block size-6 shrink-0 rounded-full bg-fill-strong", className)}
    />
  )
}

/**
 * A status, as a shape rather than a word.
 *
 * Four tones and no labels: which status a row is in is exactly the thing a
 * scaffold has no way of knowing, and inventing "Open" against a made-up
 * incident is how a demo starts getting quoted back at you.
 */
const PILL_TONES = [
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "bg-fill-strong text-muted-foreground",
] as const

export function Pill({
  seed = 0,
  wide,
}: {
  readonly seed?: number
  readonly wide?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-block h-4 rounded-full",
        wide ? "w-16" : "w-12",
        pick(PILL_TONES, seed),
      )}
    />
  )
}

/**
 * The row of controls that sits above a collection: search, a few filters, and
 * whatever the page's primary verb is.
 *
 * Shapes rather than working controls — spans, not buttons. A search box that
 * takes focus and then filters nothing is a worse lie than an obvious
 * placeholder, and it would also put a tab stop in front of every scaffold in
 * the app. Nothing here is focusable, and nothing here has a label, so a screen
 * reader passes over it and reaches the headings and the module's description,
 * which are the parts that are true.
 */
export function Toolbar({ filters = 3 }: { readonly filters?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-7 w-56 max-w-[45%] rounded-md border bg-card" />
      {Array.from({ length: filters }, (_, index) => (
        <span
          className={cn(
            "hidden h-7 rounded-md bg-fill sm:block",
            pick(["w-20", "w-24", "w-16"], index),
          )}
          key={index}
        />
      ))}
      <span className="ml-auto h-7 w-24 rounded-md bg-fill-strong" />
    </div>
  )
}

/** A heading over a run of rows — the group label a real screen would show. */
export function GroupHeading({ children }: { readonly children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </h3>
  )
}

/**
 * The padded column the vertical views sit in.
 *
 * Wider than the prose pages at `max-w-3xl`: a table of eight columns and a
 * dashboard of four tiles are both unreadable squeezed to reading width, and the
 * card they sit in is as wide as the window.
 */
export function Frame({
  children,
  className,
}: {
  readonly children: React.ReactNode
  readonly className?: string
}) {
  return <div className={cn("mx-auto w-full max-w-6xl p-4", className)}>{children}</div>
}
