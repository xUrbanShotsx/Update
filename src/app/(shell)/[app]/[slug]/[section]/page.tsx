import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OrgModulePage, SiteModulePage } from "@/components/features/module-page"
import { ProjectPage } from "@/components/features/project-page"
import { requestOrg } from "@/lib/request"
import { scopeFromPath } from "@/lib/scope"

type Params = {
  params: Promise<{ app: string; section: string; slug: string }>
}

const resolve = async (params: Params["params"]) => {
  const [{ app, section, slug }, org] = await Promise.all([params, requestOrg()])
  return org ? scopeFromPath(`/${app}/${slug}/${section}`, org) : undefined
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const scope = await resolve(params)
  if (!scope) return { title: "Not found" }
  if (scope.kind === "project") return { title: scope.project.name }
  const leaf = scope.kind === "org" ? scope.child : scope.section
  return { title: leaf?.label ?? "Not found" }
}

export default async function SectionPage({ params }: Params) {
  const scope = await resolve(params)
  if (!scope) notFound()

  // The third position means one of three things, and the resolver has already
  // worked out which: a child of an org section, a project, or a section of a
  // site.
  if (scope.kind === "project") {
    return <ProjectPage domain={scope.domain} project={scope.project} />
  }

  if (scope.kind === "org") {
    if (!scope.child || !scope.section) notFound()
    // The child names which view, and the section still names the page — the
    // header keeps saying "Defects" whichever of its two readings you are on.
    return (
      <OrgModulePage
        child={scope.child}
        domain={scope.domain}
        org={scope.org}
        section={scope.section}
      />
    )
  }

  if (!scope.section) notFound()
  return (
    <SiteModulePage
      domain={scope.domain}
      location={scope.location}
      section={scope.section}
    />
  )
}
