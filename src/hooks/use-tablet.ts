"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { MOBILE_BREAKPOINT } from "@/hooks/use-mobile"

/**
 * Tailwind's `lg`, and the one breakpoint this app's layout actually turns on:
 * above it the shell has a sidebar column and can open the secondary panel,
 * below it the nav is a drawer and the page takes the whole window.
 */
export const TABLET_BREAKPOINT = 1024

/**
 * True in the band between the two — `md` up to but not including `lg`.
 *
 * Bounded at both ends rather than open below, so the three states are exclusive
 * and a caller can read them as a set: mobile, tablet, and neither-of-those,
 * which is desktop. A `useIsTablet` that were merely "under `lg`" would be true
 * on a phone as well, and every call site would have to remember to exclude it.
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`,
  )
}
