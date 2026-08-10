"use client"
// The card's scroll regions. Each publishes whether anything is still hiding
// past its edges as `data-more-*` attributes, which the card reads with
// `:has()` — no context, no parent re-render, and correct on the server.

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Two thresholds, not one. Squaring an edge off takes away the card's 8px
 * gutter on that side, which grows this viewport by the same 8px and so
 * immediately reports a little more room past it — which rounds the edge, which
 * puts the gutter back, and the two oscillate. The gap between these is wider
 * than that shift, so neither transition can trip the other.
 *
 * ENTER: how far from the end before the edge squares off.
 * EXIT: how close to the end before it rounds again.
 */
const ENTER = 24
const EXIT = 4

/**
 * Three edges, not four. The left one is the layout's anchor — the sidebar
 * meets the card there and the eye finds the page by it — so it stays rounded
 * however far a board has been scrolled, and there is nothing to measure.
 */
type Edges = { above: boolean; below: boolean; right: boolean }

/**
 * Distance to each end, not merely whether the content overflows: reaching one
 * has to round that edge back up, because at that point there is nothing left
 * beyond it for the cut-off corner to point at.
 *
 * The top needs no seed the way `below` and `right` do — every load starts at
 * offset 0, so "nothing above" is already right.
 */
function useScrollEdges(seed: Pick<Edges, "below" | "right">) {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState<Edges>({ above: false, ...seed })
  // The threshold to apply depends on which side of it we are already on, and
  // these are read inside a callback the observer holds — refs, not state.
  const current = useRef<Edges>({ above: false, ...seed })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const past = (already: boolean) => (already ? EXIT : ENTER)
    const next: Edges = {
      above: el.scrollTop > past(current.current.above),
      below:
        el.scrollHeight - el.scrollTop - el.clientHeight > past(current.current.below),
      right:
        el.scrollWidth - el.scrollLeft - el.clientWidth > past(current.current.right),
    }
    if (
      next.above === current.current.above &&
      next.below === current.current.below &&
      next.right === current.current.right
    ) {
      return
    }
    current.current = next
    setEdges(next)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    measure()

    // Both boxes matter: the viewport changes when a panel is dragged, and the
    // content changes when the page does.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [measure])

  return { edges, measure, ref }
}

type ScrollProps = {
  readonly children: React.ReactNode
  readonly className?: string
  /**
   * The page's own claim that it is bigger than the card on this region's main
   * axis, used for the first paint only. Nothing on the server can measure a
   * layout, so without this the card renders rounded and then squares off once
   * hydration lands — around 40ms later, which reads as a flash. Set it on pages
   * that scroll; the measurement above corrects it either way.
   */
  readonly overflows?: boolean
}

export function PageScroll({ children, className, overflows = false }: ScrollProps) {
  const { edges, measure, ref } = useScrollEdges({ below: overflows, right: false })

  return (
    <div
      className={cn(
        // `overscroll-contain` keeps a scroll past the end here rather than
        // chaining to the document, where the browser's own pull-to-refresh
        // would fire and reload the page.
        "thin-scrollbar flex-1 overflow-y-auto overscroll-contain",
        className,
      )}
      data-more-above={edges.above ? "" : undefined}
      data-more-below={edges.below ? "" : undefined}
      onScroll={measure}
      ref={ref}
    >
      {children}
    </div>
  )
}

export function PageScrollX({
  children,
  className,
  overflows = false,
  overflowsDown = false,
}: ScrollProps & {
  /**
   * The cross-axis twin of `overflows`, and the reason this component takes two
   * hints where the vertical one takes one: a board runs off the right *and*
   * its longest column can run off the bottom, so both edges have a first paint
   * to get right. Same rule as `overflows` — a claim, not a measurement.
   */
  readonly overflowsDown?: boolean
}) {
  const { edges, measure, ref } = useScrollEdges({
    below: overflowsDown,
    right: overflows,
  })

  return (
    <div
      className={cn(
        // Both axes: the columns inside don't scroll on their own, so a tall one
        // has to make the whole board taller and this is what carries it. The
        // top and bottom edges then behave exactly as they do on a normal page.
        //
        // `overscroll-contain` matters more here than on a vertical page: a
        // two-finger swipe that runs past either end of a horizontal scroller
        // chains to the document, and the browser reads *that* as the back and
        // forward gesture. Without it, flicking to the last column navigates out
        // of the app.
        "thin-scrollbar flex-1 overflow-auto overscroll-contain",
        className,
      )}
      data-more-above={edges.above ? "" : undefined}
      data-more-below={edges.below ? "" : undefined}
      data-more-right={edges.right ? "" : undefined}
      onScroll={measure}
      ref={ref}
    >
      {children}
    </div>
  )
}
