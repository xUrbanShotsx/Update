"use client"

import { useMediaQuery } from "@/hooks/use-media-query"

/**
 * Below Tailwind's `md`. The same number the `md:` variants in the JSX resolve
 * against, so a component that branches in JS and one that restyles in CSS can't
 * disagree about where the line is.
 */
export const MOBILE_BREAKPOINT = 768

/** True below `md` — one column, no room for anything beside the content. */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}
