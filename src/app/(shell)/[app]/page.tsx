import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OrgOverview } from "@/components/features/org-overview"
import { requestOrg } from "@/lib/request"
import { domainBySlug } from "@/lib/scope"

/**
 * An app's landing page inside a workspace.
 *
 * `company-1.host/operations` and `company-1.host/compliance` are this same
 * route and this same component — the overview is the same company either way,
 * and the app is what decides which figures it leads with and where its links
 * point.
 *
 * `domainBySlug` is passed the org, so this 404s for an app the workspace hasn't
 * bought rather than rendering a nav it has no records for.
 */
type Params = { params: Promise<{ app: string }> }

const resolve = async (params: Params["params"]) => {
  const [{ app }, org] = await Promise.all([params, requestOrg()])
  if (!org) return undefined
  const domain = domainBySlug(app, org)
  return domain ? { domain, org } : undefined
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const found = await resolve(params)
  // `absolute`, and both halves of that matter. Suffixed here rather than by the
  // layout beside it, because a template reaches descendant segments only and
  // this page is the layout's own — and *absolute* because the root layout's
  // template does reach it, which appended a second product name to the string
  // this had already finished. Every page below returns a bare label and gets
  // its suffix for free.
  if (!found) return { title: "Not found" }
  return { title: { absolute: `Overview · ${found.domain.label}` } }
}

export default async function AppPage({ params }: Params) {
  const found = await resolve(params)
  if (!found) notFound()

  return <OrgOverview domain={found.domain} org={found.org} />
}
