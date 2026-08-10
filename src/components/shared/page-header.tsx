"use client"
// The page's own header — the thin rule across the top of the card, and the
// home of the sidebar controls.

import {
  PanelBottomIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
  PinIcon,
} from "lucide-react"
import Link from "next/link"
import type { CSSProperties } from "react"

import { Button } from "@/components/ui/button"
import { useNavControls } from "@/layouts/app-shell"
import { cn } from "@/lib/utils"

const buttonClass = "size-7 shrink-0 text-muted-foreground/55"

/**
 * One page, read two ways. This is for views of the same thing — a list and the
 * board of that list — and not for navigation: anything that takes you to other
 * *content* belongs in the sidebar, where you can find it without first knowing
 * which page hides it.
 *
 * No icons, deliberately. These are server-rendered pages passing plain data to
 * a client component, and a component reference isn't plain data.
 */
export type PageView = { label: string; href: string; active: boolean }

/**
 * The site this page is about, when it is about one. Plain data rather than a
 * handler, because the pages passing it are server components: the state and the
 * setter both come from the shell's context, and all the page has to say is
 * which site it is looking at.
 */
export type PageLocation = { label: string; locationSlug: string }

/**
 * A small fact about the page, beside its name.
 *
 * Plain data with a tone rather than a class, for the reason `PageView` carries
 * no icon: these come from server components, and a class string is the kind of
 * thing that drifts into being a second styling system if it is allowed across
 * the boundary. Three tones is the whole vocabulary.
 */
export type PageTag = { label: string; tone?: "solid" | "muted" | "accent" | "outline" }

/**
 * How long the description takes to travel, from how much of it there is.
 *
 * A constant would be wrong at both ends — eight seconds is interminable for a
 * short phrase and a canter for a long one — and the honest input, how far it
 * actually has to move, is a layout fact no stylesheet will hand back. Character
 * count is a good enough proxy: the reading speed comes out roughly even, which
 * is the only thing the duration is really for.
 *
 * Clamped at both ends so nothing crawls and nothing whips past.
 */
const marqueeSeconds = (text: string): number =>
  Math.min(9, Math.max(2.5, text.length / 18))

const TAG_TONES: Record<NonNullable<PageTag["tone"]>, string> = {
  solid: "bg-fill-strong text-foreground",
  muted: "bg-fill text-muted-foreground",
  accent: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
  outline: "border border-dashed text-muted-foreground/70",
}

export function PageHeader({
  description,
  location,
  tags,
  title,
  subtitle,
  views,
}: {
  /**
   * What the page is, in a sentence, on the row rather than in a band under it.
   *
   * A module's description used to sit in a strip of its own below this header —
   * a permanent second row carrying one sentence and three chips, on every
   * scaffold in the app. Folded up here it costs no height at all, and the
   * header was already the thing that says what you are looking at.
   *
   * It is the only part of the row allowed to truncate. Everything else is
   * either a control or a word you need whole.
   */
  readonly description?: string
  readonly location?: PageLocation
  readonly tags?: readonly PageTag[]
  readonly title: string
  readonly subtitle?: string
  readonly views?: readonly PageView[]
}) {
  const nav = useNavControls()
  /**
   * The agent is out, so on a phone this header is the whole of the page — the
   * shell has collapsed the card to a pill around it. Everything that acts on
   * the page goes, because there is no page on screen to act on; what stays is
   * the title, which says what is underneath, and the panel toggle, which is how
   * you get back to it. A pill you cannot dismiss from would be a trap.
   *
   * From `md` up the page is still a page and none of this applies, which is why
   * every rule below is a `max-md:` rather than a branch.
   */
  const compact = Boolean(nav?.secondaryOpen)
  const pinned = Boolean(
    location && nav?.locationPrefs.pinned.includes(location.locationSlug),
  )

  return (
    <header
      className={cn(
        "flex h-11 shrink-0 items-center gap-2 border-b px-3",
        // No rule under the title when the title is all there is — inside a pill
        // a bottom border reads as an underline rather than as a seam.
        compact && "max-md:justify-center max-md:border-b-0",
      )}
    >
      {/* Two buttons rather than one that branches on a media query: the
          breakpoint is a CSS fact, and reading it back out in JS to pick a
          handler would only be right after the first paint.

          They split at `lg`, which is where the primary panel stops being a
          drawer and starts being a column you own. Below it — a phone with no
          nav on screen, and a tablet with a rail that cannot expand — the toggle
          raises the drawer, because that is the only place the full nav fits at
          either width. At `lg` it collapses the column to the rail and back.

          Same glyph on both, deliberately: it is one control to the person
          pressing it — "show me the nav" — and only the shape the nav arrives in
          differs. */}
      <Button
        aria-label="Open navigation"
        className={cn(buttonClass, "lg:hidden", compact && "max-md:hidden")}
        onClick={nav?.openNav}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <PanelLeftIcon className="size-3.5" />
      </Button>
      <Button
        aria-label="Toggle primary sidebar"
        className={`${buttonClass} hidden lg:inline-flex`}
        onClick={nav?.togglePrimary}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <PanelLeftIcon className="size-3.5" />
      </Button>

      {/* Between the panel control and the page's own name. The two halves of
          this row do different jobs — the button acts on what surrounds the
          page, everything to its right describes the page — and the rule is what
          stops the glyph reading as the first word of the title. It matches the
          one at the far end, so the row is bracketed by its two controls. */}
      <span
        aria-hidden
        className={cn(
          "h-4 w-px shrink-0 bg-border",
          compact && "max-md:hidden",
          nav ? "" : "hidden",
        )}
      />

      <h1 className="shrink-0 text-sm font-medium">{title}</h1>

      {/* Description then tags, in that order and with only the description
          allowed to give way. A tag is two words and a fact; the sentence is
          long and its first half carries most of it, so truncating the sentence
          costs least. `shrink-0` on the tags is what enforces that.

          Capped at `w-80` so it cuts short on a wide window too, not only on
          a narrow one. `truncate` alone fills whatever width is going, which
          turns the header into a paragraph with a title on the front of it and
          leaves the tags floating somewhere off to the right; a fixed cap makes
          the row the same shape at every width — a name, a phrase, some tags.

          **The rest is read by hovering it, and it travels rather than popping
          up.** A tooltip was the obvious answer and the wrong one: it covers the
          page under the header to explain the header, and it is a second surface
          to look at when the sentence is already in front of you. Sliding the
          text through its own box keeps the reading where the reading started.

          How it works, since it is all in the class list:

            @container       makes this box the unit `cqw` measures, so the slide
                             can be expressed against the width it has to clear
            w-max            the text sizes to its content, not to the box, which
                             is what gives it somewhere to travel
            max-w-full       reins it back in at rest, so `truncate` has an edge
                             to put the ellipsis on
            min(0px, …)      text that already fits does not move. The clamp is
                             what makes this safe to apply unconditionally rather
                             than measuring first and branching

          The return is fast and fixed while the outward trip is paced by length:
          coming back is not reading, and watching a sentence saunter back to the
          start after you have moved on is the part that would grate. */}
      {description ? (
        <div
          className={cn(
            // A *definite* width, not `max-w-80`, and the difference is whether
            // this renders at all.
            //
            // `@container` compiles to `container-type: inline-size`, which
            // contains the inline axis: the box's width is computed as if it had
            // no content. A flex item with `width: auto` then has nothing to
            // measure and resolves to zero, so the description sits in the DOM
            // at 0px wide and invisible — present in the markup, absent from the
            // page, which is a nasty way for it to fail.
            //
            // `flex-shrink` is untouched, so it still narrows below 20rem when
            // the row is tight.
            "group/desc @container w-80 shrink overflow-hidden",
            compact && "max-md:hidden",
          )}
          style={{ "--marquee": `${marqueeSeconds(description)}s` } as CSSProperties}
        >
          <p
            className={cn(
              "w-max max-w-full truncate text-xs text-muted-foreground/70",
              "transition-transform duration-200 ease-linear",
              "group-hover/desc:max-w-none group-hover/desc:text-clip",
              "group-hover/desc:translate-x-[min(0px,calc(100cqw-100%))]",
              "group-hover/desc:duration-(--marquee)",
            )}
          >
            {description}
          </p>
        </div>
      ) : null}

      {/* A step under the title rather than level with it. The two were the same
          size, which made the row read as two headings and left the eye picking
          which one the page was actually called. */}
      {subtitle ? (
        <p
          className={cn(
            "truncate text-xs text-muted-foreground/70",
            compact && "max-md:hidden",
          )}
        >
          {subtitle}
        </p>
      ) : null}

      {tags?.length ? (
        <div
          className={cn(
            "flex shrink-0 items-center gap-1.5",
            // First to go on a narrow card. The title says which page and the
            // description says what it holds; a tier and a shape are the two
            // facts you can most afford to lose at 400px.
            "max-lg:hidden",
            compact && "max-md:hidden",
          )}
        >
          {tags.map((tag) => (
            <span
              className={cn(
                "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-medium",
                TAG_TONES[tag.tone ?? "muted"],
              )}
              key={tag.label}
            >
              {tag.label}
            </span>
          ))}
        </div>
      ) : null}

      {/* The row's right-hand zone. Same shape as the sidebar's head: what you
          do to the thing on the left of the hairline, the panel controls on the
          right of it. */}
      <div className={cn("ml-auto flex items-center gap-1.5", compact && "max-md:ml-0")}>
        {/* The sidebar's segmented control, at header height — the same trough
            and the same raised selection, because it is the same kind of choice.

            Out here with the page's other controls rather than beside the title,
            where it used to sit. It changes what this page *is*, which is why it
            was next to the name — but it is still a control, and a row that
            reads name-then-description-then-a-control-then-more-description had
            the one interactive thing in it buried mid-sentence. Left describes,
            right acts. */}
        {views?.length ? (
          <>
            <div
              className={cn(
                "flex shrink-0 items-center gap-0.5 rounded-md bg-fill p-0.5",
                compact && "max-md:hidden",
              )}
            >
              {views.map((view) => (
                <Link
                  aria-current={view.active ? "page" : undefined}
                  className={cn(
                    "flex h-6 items-center rounded-[5px] px-2.5 text-xs font-medium transition-colors",
                    view.active
                      ? "bg-card text-foreground dark:bg-fill-strong"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  href={view.href}
                  key={view.href}
                >
                  {view.label}
                </Link>
              ))}
            </div>
            <span
              aria-hidden
              className={cn("h-4 w-px shrink-0 bg-border", compact && "max-md:hidden")}
            />
          </>
        ) : null}

        {location ? (
          <>
            {/* The same list the sidebar's Pinned group draws from, reached from
                the page it is about — you decide a site is one you keep while
                you are standing in it, not while scanning the nav for it. Filled
                when pinned: here there is no group heading overhead to say so,
                so the icon has to carry the state on its own.

                The filled state drops the `/55` and takes the solid grey, which
                is the same grey the glyph is drawn in. `fill-current` follows
                the button's text colour, so at 55% alpha the fill sat under a
                55% stroke and doubled along every edge — one flat shape read as
                two tones. Solid on both, and the pin is the colour it looks
                like. */}
            <Button
              aria-label={pinned ? `Unpin ${location.label}` : `Pin ${location.label}`}
              aria-pressed={pinned}
              className={cn(
                buttonClass,
                pinned && "text-muted-foreground",
                compact && "max-md:hidden",
              )}
              onClick={() => nav?.togglePin(location.locationSlug)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <PinIcon className={cn("size-3.5", pinned && "fill-current")} />
            </Button>
            {/* Goes with the button it divides from, which is now at every
                width — the secondary panel exists below `lg` too, as a shelf
                rather than a column. */}
            <span
              aria-hidden
              className={cn("h-4 w-px shrink-0 bg-border", compact && "max-md:hidden")}
            />
          </>
        ) : null}

        {/* Mirrors the primary control at the other end of the row, pointing at
            the edge it opens. At every width, unlike the primary pair: the panel
            it opens exists at every width too, and below `lg` this is the only
            thing that can open it — the shelf has no rail of its own to be
            reached from.

            Three glyphs swapped in CSS rather than one picked in JS, the same
            way the theme button carries its sun and moon: the edge is a
            breakpoint fact, so it resolves before paint instead of a frame
            after. The button points where the panel actually comes from — down
            from the top on a phone, up from the bottom on a tablet, in from the
            right at `lg` — which is the whole job of a panel icon. */}
        <Button
          aria-label="Toggle secondary sidebar"
          className={buttonClass}
          onClick={nav?.toggleSecondary}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <PanelTopIcon className="size-3.5 md:hidden" />
          <PanelBottomIcon className="hidden size-3.5 md:block lg:hidden" />
          <PanelRightIcon className="hidden size-3.5 lg:block" />
        </Button>
      </div>
    </header>
  )
}
