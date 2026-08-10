import type { Metadata } from "next"

import { requestOrg } from "@/lib/request"
import { domainBySlug } from "@/lib/scope"

/**
 * The tab's suffix, for everything inside an app.
 *
 * A layout rather than a per-page concern, because a template applies to every
 * descendant: the pages under here go on returning a bare `"Safety"` or
 * `"Lookahead"` and the app name is added once, in the one place that knows
 * which app the segment named.
 *
 * `Safety · Compliance` rather than `Safety · Briesa IMS`. Four apps means four
 * tabs open at once for anyone working across them, and the product name
 * repeated four times identifies none of them — the app is the only part of the
 * suffix carrying information. Outside a workspace there is no app, so the root
 * layout's `Briesa IMS` stands.
 *
 * The `default` is what an app's own page gets if it sets no title. It is not
 * run through the template — Next applies templates to descendants only — which
 * is why it spells the whole thing out.
 */
type Params = { params: Promise<{ app: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [{ app }, org] = await Promise.all([params, requestOrg()])
  const domain = org && domainBySlug(app, org)
  if (!domain) return {}

  // The app's own name and nothing else — `Safety · Compliance`, not `Safety ·
  // Briesa Compliance`. Prefixing the company turns four short suffixes into
  // four long ones that all start with the same word, in a place that truncates
  // at about twenty characters.
  return { title: { default: domain.label, template: `%s · ${domain.label}` } }
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children
}
