import { ArrowRightIcon, LayoutGridIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"

import { RootHeader } from "@/components/shared/root-header"
import { orgUrl } from "@/lib/host"
import { domainsFor, ORGS, orgHref, defaultDomain, type Org } from "@/lib/scope"
import type { Preferences } from "@/lib/preferences"
import { site } from "@/lib/site"

/**
 * One workspace, as a card. Everything the switcher's menu row shows and the
 * things it has no room for — the sector, the apps, the size — because here
 * there is a page rather than a 224px popup, and choosing between two companies
 * you belong to is worth more than two lines.
 */
function WorkspaceCard({ org }: { readonly org: Org }) {
  const apps = domainsFor(org)

  return (
    <Link
      className="group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40"
      // Absolute, and unconditionally so: this page is served from the host
      // with no workspace on it, so there is no "here" for a path to be
      // relative to. Every card crosses an origin, which is the isolation
      // working rather than a cost.
      href={orgUrl(org, orgHref(defaultDomain(org)))}
    >
      <div className="flex items-center gap-2">
        <h2 className="min-w-0 flex-1 truncate text-sm font-medium">{org.name}</h2>
        {/* The same chip the switcher gives a plan, so the one fact wears one
            treatment in both places. */}
        <span className="shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {org.plan}
        </span>
        <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground/45 transition-colors group-hover:text-foreground" />
      </div>

      <p className="text-xs text-muted-foreground">
        {org.industry} · {org.tags.join(" · ")}
      </p>

      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {org.description}
      </p>

      <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground/70">
        <span className="flex items-center gap-1.5">
          <MapPinIcon className="size-3" />
          {org.locations.length} {org.locations.length === 1 ? "site" : "sites"}
        </span>
        <span className="flex items-center gap-1.5">
          <LayoutGridIcon className="size-3" />
          {apps.map((app) => app.label).join(" · ")}
        </span>
      </div>
    </Link>
  )
}

/**
 * What `/` is: the app with no workspace selected.
 *
 * Outside the shell, and that is the honest shape rather than a shortcut. Every
 * screen in this product is a screen *of a workspace* — the nav is a workspace's
 * apps, the apps are its sections, the sections are its records — so with none
 * chosen there is no nav to draw and no page to put beside one. A shell rendered
 * empty around this would be three panels of chrome explaining that they have
 * nothing in them.
 *
 * This is also the other half of the brand row. Inside the shell that row names
 * the workspace and its sector; here, where there is none, it names the product
 * and its version — which is the only thing true at this point.
 *
 * The account is the one control that survives having no workspace, and it keeps
 * its corner. Everything else in the shell's chrome is a workspace's — its apps,
 * its sites, its notifications — but you are you before you have picked one, and
 * the theme, your preferences and the way out all have to be reachable from the
 * first screen rather than only from inside a company.
 */
export function WorkspacePicker({
  preferences,
}: {
  /** Read from the cookie by the page above, so the dialog's switches are right
   *  on the frame it opens rather than a beat after hydration. */
  readonly preferences?: Preferences
}) {
  return (
    <main className="flex min-h-dvh flex-col bg-sidebar text-foreground">
      <RootHeader preferences={preferences} />

      {/* Wider than the reading measure the rest of the app uses, because this
          is not reading. The cards are a set you compare across — two companies,
          their sectors, their sites, their apps — and at `max-w-2xl` they were
          narrow enough that the description wrapped to four lines and the
          comparison ran vertically instead of side by side. */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Choose a workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every screen in {site.name} belongs to one. Pick the company you are working in
          and its apps come with it.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {ORGS.map((org) => (
            <WorkspaceCard key={org.slug} org={org} />
          ))}
        </div>
      </div>
    </main>
  )
}
