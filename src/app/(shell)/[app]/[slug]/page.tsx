import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LocationOverview } from "@/components/features/location-overview"
import { OrgModulePage } from "@/components/features/module-page"
import { requestOrg } from "@/lib/request"
import { scopeFromPath } from "@/lib/scope"

type Params = { params: Promise<{ app: string; slug: string }> }

/** The same resolver the sidebar uses, so a page and the nav can never disagree
 *  about what a URL means — with the app now coming off the host rather than out
 *  of the path, which is the only part of it that changed. */
const resolve = async (params: Params["params"]) => {
  const [{ app, slug }, org] = await Promise.all([params, requestOrg()])
  return org ? scopeFromPath(`/${app}/${slug}`, org) : undefined
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const scope = await resolve(params)
  if (!scope) return { title: "Not found" }
  if (scope.kind === "location") return { title: scope.location.name }
  // A project needs three segments, so it cannot reach this route — the union
  // says it might, and the check costs a line.
  if (scope.kind === "project") return { title: scope.project.name }
  return { title: scope.section?.label ?? "Not found" }
}

export default async function SlugPage({ params }: Params) {
  const scope = await resolve(params)
  // A hostname naming no workspace, an app this workspace hasn't bought, an
  // unknown section and an unknown site all land here — the resolver returns
  // nothing for every one of them, so there is one 404 rather than four.
  if (!scope) notFound()

  if (scope.kind === "location") {
    return (
      <LocationOverview domain={scope.domain} location={scope.location} org={scope.org} />
    )
  }

  // Two segments means the second named a section — the resolver 404s anything
  // else — so neither a project nor a sectionless scope can reach this route.
  if (scope.kind === "project" || !scope.section) notFound()

  // Every section is a catalogue module, and the shape is chosen by
  // `lib/modules` rather than by a case here — so a new module needs a nav row
  // and an entry and nothing else. There used to be two exceptions; the sites
  // index has gone, and Projects moved onto the template.
  return <OrgModulePage domain={scope.domain} org={scope.org} section={scope.section} />
}
