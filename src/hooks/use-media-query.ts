"use client"

import { useEffect, useState } from "react"

/**
 * One media query, as a boolean. The primitive the named breakpoint hooks are
 * built from, so the `matchMedia` handling exists once rather than once per
 * breakpoint.
 *
 * `false` until mounted, deliberately. The server has no viewport, so any
 * initial guess is wrong half the time and correcting it after hydration is a
 * flash — where `false` means "render the layout that doesn't depend on this"
 * and the first effect settles it. Anything that must be right on the first
 * paint belongs in CSS, where the breakpoint is resolved before paint rather
 * than after; these hooks are for the cases where a component has to *branch*,
 * not merely restyle.
 *
 * The subscription reads `event.matches` rather than measuring the window
 * again: the query is what was asked, so the query's own answer is the one to
 * trust, and re-deriving it from `innerWidth` is a second source that can
 * disagree at the boundary.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    // Set before subscribing, so a viewport that never changes still resolves.
    setMatches(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}
