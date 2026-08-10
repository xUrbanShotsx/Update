# briesa-app

Next.js + TypeScript + shadcn/ui + Tailwind v4, on Bun, linted and formatted by Biome.

One page — `/` — inside a shell modelled on the Briesa **demo** (`apps/web` →
`(subdomains)/demo`): a resizable sidebar on the left that collapses to an icon rail, and
the page floating beside it as a rounded, inset card.

## Running it

```bash
bun install
bun run dev      # http://localhost:3000
```

| Script      | What it does                        |
| ----------- | ----------------------------------- |
| `dev`       | Dev server on :3000                 |
| `build`     | Production build                    |
| `start`     | Serve the production build          |
| `lint`      | `biome check .`                     |
| `tidy`      | `biome check --write .`             |
| `format`    | `biome format --write .`            |
| `typecheck` | `tsc --noEmit`                      |
| `kill`      | Free :3000 if a dev server is stuck |

## Layout

```
src/
  app/
    layout.tsx              fonts, theme, reads the sidebar cookie, mounts the shell
    (shell)/[app]/          every page — the workspace comes from the subdomain
  proxy.ts                the no-workspace host, and every retired URL
  layouts/
    app-shell.tsx         both columns + resize handle + the page card
    app-sidebar.tsx       the primary panel, its search, its 48px rail
    secondary-sidebar.tsx the right panel — empty for now
  lib/
    host.ts           which workspace a hostname is, and how to link to another
    request.ts        the same, for a server render, off the Host header
    scope.ts          what a path means *inside* a workspace: apps, sections, sites
    modules.ts        what each module is for, and the shape of its screen
    blueprints.ts     the ISO 45001/9001/14001 clause map
    sidebar-state.ts  widths, open/collapsed, and their cookie
  components/
    features/         the built screens — overviews, module pages
    features/views/   the module scaffolds, by family
    shared/           page-header, page-scroll, feedback-dialog, theme-provider
    ui/               shadcn primitives — yours to edit
```

**Primary sidebar** (left). Its head row is `Logo │ Company ⇅ │ ＋` — three separate jobs,
so three separate targets: the mark goes home, the name switches workspace, the plus
creates. Nothing else lives there, because theme, notifications and the account are in the
footer, search is the bar below, and collapse is in the page header.

Drag the seam on its right edge to resize between **220px and
360px** (default 256). The grab pill only fades in after a second of hover, or instantly
once a drag starts. Collapse it from the page header and it becomes a **48px icon rail**,
every row reduced to its glyph with a tooltip. Below `lg` the column is gone entirely and
the nav opens as a drawer from the same button.

**Secondary sidebar** (right). Shut by default and empty for now — open it from the panel
button at the right end of the page header. Resizable from its own left seam, with its own
width in the cookie: the two panels are dragged independently and rarely want to match.

Its floor is 240px; **520px is a detent, not a stop**. While the nav is still out the panel
holds there, and only breaks through once the pointer has travelled a further 64px —
which is what folds the nav down to its rail. Past that it runs on to **half the window**.

**The gesture reverses with the same resistance.** Coming back down the panel catches at
520 again and holds for the same 64px, then releases at **456** and brings the nav with
it. Both directions stick for 64px and let go with the same 64px jump, so it reads
identically either way — and the hold is what stops the two trading places around 520.

It only ever restores a nav *this drag* folded. Collapse the nav yourself and no amount of
dragging will undo it — that was a decision. The flag recording which is transient and
never reaches the cookie.

`resizing` names *which* panel is under the pointer rather than merely that one is. Only
the dragged panel must track it 1:1; the nav is folding as a consequence and still eases
over its 200ms. Gating both on one boolean makes the nav snap.

**Search** lives in the primary sidebar and renders its results there, in place of the
nav — no modal. Plain text filters the pages; a leading **`/`** lists commands (each runs
for real); a leading **`>`** lists documents. <kbd>⌘K</kbd> focuses it, <kbd>Esc</kbd>
clears it. The modal that used to hold this is now the **feedback** dialog, behind the
account menu.

**Scrolling** belongs to the card, not the document — `PageScroll` carries
`overscroll-contain`, so a scroll past the end stops there instead of chaining to the
document and firing the browser's own pull-to-refresh. Nothing reloads on overscroll.

**Each edge is squared off only while there is still content past it** — the cut-off corner
is what says so. Reach either end and that side's gutter, radius and border come back,
because by then the edge would be claiming something untrue. The two are independent:

| scroll position | top | bottom |
| --------------- | ------- | ------- |
| at the top | rounded | square |
| in the middle | square | square |
| at the end | square | rounded |
| page that fits | rounded | rounded |

Mid-scroll the card is full bleed, meeting both screen edges.

Three things make that work, and each fixes a bug the obvious version has:

- **`data-more-above` / `data-more-below` + `:has()`, not React state.** Pages that scroll
  pass `<PageScroll overflows>`, so the server emits the attribute and the *first paint* is
  already square. Driving it from state instead means the server renders it rounded and
  hydration corrects it ~40ms later — a visible flash on every load, which no client hook
  can beat. The top needs no such hint: every load starts at scrollTop 0, so "nothing
  above" is already right.
- **Two thresholds, not one** (`ENTER` 24px, `EXIT` 4px). Squaring the edge off removes the
  8px bottom gutter, which grows the scroll viewport by 8px and immediately re-reports
  "more below" — which rounds it, which puts the gutter back. The 20px gap is wider than
  that shift, so the two can't oscillate.
- **`!` on `rounded-b-none!` / `border-b-0!`.** Separate tailwind-merge keys from
  `rounded-2xl` / `border`, so all four survive the merge and the shorthand wins on order
  alone.

Width and collapsed state round-trip through a cookie that the **root layout reads on the
server**, so a reload paints what you left instead of flashing the default first. That is
why `sidebar-state.ts` carries no `"use client"` — importing a value from a client module
into a server component yields a client-reference proxy rather than the value.

Two things are load-bearing and easy to undo by accident:

- **The width transition is suppressed while dragging** (and until hydration). A drag has
  to track the pointer 1:1; with the transition left on, the edge eases along behind the
  cursor.
- **`lg:ml-0` on the card, `m-2` everywhere else.** That closes the gutter against the
  rail so the card sits flush to it, while below `lg` — where there is no rail to sit
  flush against — the left gutter comes back.

## Workspaces are subdomains

`company-1.example/compliance/safety`. The tenant is the host; the app is the
first path segment.

**The origin carries the thing that should be isolated.** Cookies, storage and any
injected script's blast radius all stop at the origin, and in a product sold to
companies the wall belongs between companies — never between Operations and
Compliance, which are two navs over one company's records. An earlier pass put the
*app* on the host and it was wrong in three ways at once: four origins shared by
every tenant, the most frequent navigation in the product turned into a
cross-origin document load, and two cookies hand-partitioned by org slug to
recover what the browser should have been enforcing.

| | |
| --- | --- |
| server | [`requestOrg()`](src/lib/request.ts) reads the `Host` header |
| client | the shell layout hands the slug down; `useCurrentOrg()` picks it up |
| never | `location.hostname` — it renders one tenant on the server and maybe another on hydration |

[`lib/scope.ts`](src/lib/scope.ts) builds paths that always name an app and never
a tenant; [`lib/host.ts`](src/lib/host.ts) builds the links that leave, and
`hrefIn(current, target, path)` decides which you get. Only the workspace switcher
and the picker cross an origin now.

**Per-workspace settings come free, and that is the practical dividend.** Any state
scoped to the origin is scoped to the workspace without a line of code: cookies,
`localStorage`, `IndexedDB`, service workers, cache keys. A setting that should
differ per company simply *does*, and one that shouldn’t is the one that needs an
explicit `Domain=` — so the default is per-tenant and sharing is the deliberate
act, which is the right way round. On a single host it was the reverse: every
per-workspace value had to carry its own org key and every reader had to remember
to index it, which is a rule the browser now enforces instead.

**Two cookie families, and the split is the point:**

- **Per-user** — theme, notification channels. `USER_COOKIE_ATTRS`, with `Domain=`
  on the parent, because you are the same person in every workspace.
- **Per-workspace** — pinned sites, recent pages, the sidebar segment.
  `ORG_COOKIE_ATTRS`, host-only. Both of these used to be `Record<orgSlug, …>`
  maps in a shared jar; the browser partitions them now, so the keying is gone —
  and `RecentPages` lost the `app` field with it, because `/compliance/insights`
  identifies a page on its own again.

The same mechanism is what makes per-workspace *branding* and custom domains
possible later: a tenant that owns its origin can own what is served from it.

`Domain=` is omitted entirely on a single-label host: browsers *drop* a cookie
naming `localhost` rather than widening it. Point `NEXT_PUBLIC_ROOT_HOST` at
`lvh.me:3000` (resolves to 127.0.0.1, no hosts entry) to get production behaviour
locally.

**[`proxy.ts`](src/proxy.ts) redirects both retired schemes** — the original
`/<org>/<app>/…` on one host, and the app-as-subdomain that briefly replaced it —
so every link anyone is holding still resolves. Workspace slugs are DNS names now:
lower case, no underscores, and a rename is a redirect.

## Modules

Four domains — Operations, Compliance, Workforce, Admin — over **46 sections**. What
each one is for is argued in [modules.txt](modules.txt); the same catalogue as data is
[`lib/modules.ts`](src/lib/modules.ts), so the app is a walkable copy of the document
rather than a second description that drifts from it.

Two files, deliberately apart. **`scope.ts` owns the tree** — slugs, labels, groups,
which sections a site has — and is imported by the root layout, every page and the
sidebar, so it stays free of anything bulky. **`modules.ts` owns the content** — the
tier, the one-line summary, and the shape. A section with no catalogue entry falls back
to the plain placeholder: the nav is allowed to be ahead of the catalogue.

Adding a module is a row in `DOMAINS` and an entry keyed `domain/slug`. Routes, the app
switcher, search scoping, the collapsed rail and the page itself all pick it up with no
further change.

**Every unbuilt section renders a scaffold** rather than a "nothing here yet" card — the
right shape, with the module's own column names, lanes or axes, under a strip carrying
its tier and summary. Nineteen shapes cover all of it:

| | |
| ---------- | ----------------------------------------------------------- |
| `table` | a register you filter and sort — 45 of them, unsurprisingly |
| `board` | the same records by stage |
| `timeline` | bars against a ruler: lookahead, plant on hire, tickets expiring |
| `calendar` | a month, for anything booked into a slot |
| `map` | where things are — pinned defects, plant, photos on a plan |
| `matrix` | one axis against another: risk heat, competency, permissions |
| `cards` | things identified by a picture rather than a name |
| `gallery` | photos, by the day they were taken |
| `feed` | what happened, newest first, down a rail |
| `dashboard`| tiles over charts |
| `overview` | an app's front page — real tiles, real links, an activity rail |
| `record` | an entity open: identity, facts, body, activity |
| `split` | a list beside the one it has selected |
| `documents`| a folder tree beside what is in the open folder |
| `checklist`| an inspection or an ITP, answered row by row |
| `wizard` | something issued through steps — a permit, an induction |
| `form` | settings, in sections |
| `report` | an evidence pack, shaped like the paper it becomes |
| `compare` | two versions side by side, with what changed marked |

Three rules hold across all of them:

- **Nothing pulses.** A scaffold is not a loading state, and a shimmer promises records
  that are two seconds away. It is permanently, obviously empty.
- **Widths are seeded, not random.** `Math.random()` would disagree between the server
  render and hydration, and a page that reshuffles on every navigation reads as data
  changing. Same index, same layout, forever.
- **Real headings, fake rows.** Column names are the data model in the only notation a
  customer reads, and they are the one part a scaffold can get right. A grey box with no
  headings can't be argued with, which is the whole point of building it early.

A module with two readings gets both, as the segmented control in the page header —
Defects is a board and a list, Risk is a register and a matrix. Org level only: the
fourth path position is spent on the section once the third is a site, so a site gets
the single reading `siteView` names, which is usually the narrower one. The columns
saying *which* site are dead weight when the answer is already in the URL.

## Surfaces

The two themes stack in opposite directions, so the page is always the surface you are
meant to be looking at:

|       | root / rail | page | cards in the page |
| ----- | ----------- | ---- | ----------------- |
| light | 0.985       | 1.0  | 1.0 + border      |
| dark  | 0.145       | 0.205| 0.246             |

Light puts the page *above* its ground; dark inverts it, so the page reads as lit from
within rather than cut out of the chrome. `--card` and `--popover` are lifted to 0.246 in
dark for that reason — left at the old 0.205 they would be exactly the flipped page, and
every card in the layout would collapse to a bare outline.

The card's drop shadow is `dark:` only. In light the page sits below its ground, where the
border already draws the seam and a shadow only muddied it.
