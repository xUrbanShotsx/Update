"use client"
// The theme control, in the one place it is written.
//
// It used to flip light and dark only, which meant that once you had pressed it
// there was no way back to following the system short of clearing storage — the
// preferences dialog grew a three-way picker to fix exactly that, and then the
// chrome and the dialog disagreed about how many themes there are. This cycles
// all three, in the dialog's order.
//
// It appears three times — the collapsed rail, the expanded panel's foot, and
// the phone bar — and those are three sizes of one control.

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/** The dialog's list, in the dialog's order and with the dialog's glyphs, which
 *  is also the order the button steps through. Two surfaces offering the same
 *  three choices in two orders would read as two different settings. */
const THEMES = [
  { value: "system", label: "System", icon: MonitorIcon },
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
] as const

export function ThemeButton({
  className,
  iconClassName = "size-3.5",
}: {
  /** The button's own shape. The rail passes its 32px tile, the two chrome rows
   *  pass their 28px button — the glyph is the same either way. */
  readonly className?: string
  readonly iconClassName?: string
}) {
  const { setTheme, theme } = useTheme()
  // The stored choice is only knowable in the browser, so until the mount there
  // is no setting to name — see the glyph below, which falls back to the one
  // thing that *is* known before hydration.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const index = mounted ? THEMES.findIndex((item) => item.value === theme) : -1
  const current = THEMES[index]
  const next = THEMES[(index + 1) % THEMES.length] ?? THEMES[0]

  return (
    <button
      // Both halves, because a cycling button is the one kind whose next press
      // cannot be guessed from its face.
      aria-label={current ? `Theme: ${current.label}. Switch to ${next.label}.` : "Theme"}
      className={cn(
        "grid shrink-0 place-items-center rounded-md text-muted-foreground/55 transition-colors hover:bg-fill hover:text-foreground",
        className,
      )}
      onClick={() => setTheme(next.value)}
      type="button"
    >
      {/* The glyph is the *setting*, not the appearance — a cycling button whose
          face didn't say where in the cycle you were would be unpressable with
          any confidence.

          Before hydration there is no setting to show, so it falls back to the
          sun-and-moon pair swapped in CSS: `dark` is on `<html>` before paint,
          courtesy of next-themes' own inline script, so that much is right on
          the first frame. Someone pinned to light or dark then sees the same
          glyph again on mount and nothing moves; someone following the system
          sees it become a monitor. That one swap is the price of a face that
          tells the truth, and it is paid on the glyph rather than the layout. */}
      {current ? (
        <current.icon className={iconClassName} />
      ) : (
        <>
          <SunIcon className={cn("block dark:hidden", iconClassName)} />
          <MoonIcon className={cn("hidden dark:block", iconClassName)} />
        </>
      )}
    </button>
  )
}
