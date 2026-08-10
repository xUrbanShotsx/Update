import type { Metadata } from "next"
import { cookies } from "next/headers"

import { WorkspacePicker } from "@/components/features/workspace-picker"
import { site } from "@/lib/site"
import { PREFERENCES_COOKIE, parsePreferences } from "@/lib/preferences"

/**
 * The root is a page now, not a redirect.
 *
 * It used to hand straight over to the first org, on the reasoning that every
 * route is scoped to one and the bare root had nothing of its own to show. That
 * was true of the *routes* and false of the product: having no workspace open is
 * a real state, and it is where deselecting one leaves you.
 *
 * Async only for the preferences cookie, which the account menu in the corner
 * needs. The shell layout reads it for every other route in the app; this route
 * is outside the shell, so it reads it here — same cookie, same reason, which is
 * that a dialog whose switches arrive a frame late has shown you the wrong
 * answer once already.
 */
/**
 * Spelled out rather than left to the root layout's template, which Next applies
 * to *descendant* segments only — this page shares a segment with that layout,
 * so a bare "Workspaces" would arrive unsuffixed. The same rule catches each
 * app's own overview one level down.
 */
export const metadata: Metadata = { title: `Workspaces · ${site.product}` }

export default async function RootPage() {
  const jar = await cookies()
  return (
    <WorkspacePicker preferences={parsePreferences(jar.get(PREFERENCES_COOKIE)?.value)} />
  )
}
