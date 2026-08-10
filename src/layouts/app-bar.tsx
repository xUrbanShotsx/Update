"use client"
// The app's own row above the page card, on a phone and nowhere else.
//
// It exists so the product has a face at the top of a window with no nav on
// screen at all — below `md` the panel is a drawer, shut, and without this the
// app opens straight into a page header.
//
// What it names is the workspace, not the product, which is the rule the panel's
// brand row follows too: inside the shell a workspace is always selected, so
// that is the thing worth naming. The product's own name and version have their
// state — the picker at `/`, where nothing is selected and there is nothing else
// to name.
//
// Gone from `md` up. The rail arrives there with the mark at its own top and the
// drawer one tap away carries the switcher; a second brand row over the card
// would be the same thing twice on one screen.
//
// Inert, as the rail's mark is: the one fixed point in the chrome is what the
// eye uses to find its place, and hanging an action on it puts a control where
// the anchor should be. Switching workspace is in the drawer, on the row that
// does it everywhere else.

import { useCurrentOrg } from "@/layouts/app-shell"
import { BrandLogo } from "@/components/shared/brand-logo"

export function AppBar() {
  // Straight off the host — the bar is the same bar in every app, and the
  // workspace is the only thing about the page it needs.
  const org = useCurrentOrg()

  return (
    <div className="flex h-11 shrink-0 items-center gap-2 overflow-hidden px-4 md:hidden">
      <BrandLogo className="size-5" />
      {/* `shrink-0` and no `truncate`: the name never clips. The sector at the
          far edge is what gives way instead — see the note on it.

          `text-xs`, matching the switcher in the sidebar head. This row and that
          one are the same statement in two places — which workspace you are in —
          and they were both `text-sm` until it came down; leaving this one
          behind would make a phone and a laptop disagree about how loud the
          workspace is. */}
      <span className="ml-0.5 shrink-0 text-xs font-semibold text-foreground">
        {org.name}
      </span>
      {/* The tier, against the name it belongs to. The same chip the workspace
          switcher gives a plan and the app switcher gives Admin — one fact,
          one treatment, wherever it turns up. Bordered rather than filled, since
          this row takes no fill of its own for it to fight. */}
      <span className="shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {org.plan}
      </span>
      {/* The sector at the far edge. It is the other kind of fact — what the
          company does, rather than what it is called or what it pays — and the
          row has the width to say so by putting them at opposite ends.

          `shrink-[999]`, matching the switcher in the sidebar head: this was
          `shrink-0` beside a truncating name, so on a narrow phone the whole
          shortfall came out of "Company #1" while "Construction" sat at the far
          edge intact. Flex splits a shortfall in proportion to what each item
          started with, so an even split would still have the name — the wider of
          the two — doing most of the giving; weighted this far the sector
          absorbs effectively all of it, clipping away to nothing before the name
          gives up a character. `min-w-0` is what allows that last part.

          `ml-auto` stays: it only spends *free* space, so it parks the sector at
          the far edge whenever there is room and gets out of the way when there
          isn't. */}
      <span className="ml-auto min-w-0 shrink-[999] truncate text-2xs font-normal text-muted-foreground/70">
        {org.industry}
      </span>
    </div>
  )
}
