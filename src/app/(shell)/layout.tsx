import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { AppShell } from "@/layouts/app-shell"
import { ALERTS_COOKIE, parseAlertPrefs } from "@/lib/alert-prefs"
import { LOCATIONS_COOKIE, parseLocationPrefs } from "@/lib/location-prefs"
import { PREFERENCES_COOKIE, parsePreferences } from "@/lib/preferences"
import { RECENT_PAGES_COOKIE, parseRecentPages } from "@/lib/recent-pages"
import { requestOrg } from "@/lib/request"
import { SIDEBAR_COOKIE, parseSidebar } from "@/lib/sidebar-state"

/**
 * Every cookie the shell owns, read in the one place that can read them. The
 * preferences dialog is mounted inside a client component and could parse
 * `document.cookie` itself, but then its switches would be blank for a frame and
 * correct afterwards — which is the flash this layout exists to avoid.
 *
 * And the workspace, for exactly the same reason. It is in the hostname, and the
 * hostname is a fact only the server has: a client component reading
 * `location.hostname` would render nothing on the server, and the whole sidebar
 * would arrive a frame late on every load. So it is read here and handed down as
 * a slug — the slug rather than the `Org`, because a layout is a server
 * component and everything it passes a client one has to survive serialisation.
 *
 * `notFound` on a hostname naming no workspace, before any page renders. Every
 * route under this layout is inside one, so there is no page here that could
 * sensibly draw without it — and failing at the layout means one check instead
 * of the same check at the top of five pages.
 */
export default async function ShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [jar, org] = await Promise.all([cookies(), requestOrg()])
  if (!org) notFound()

  return (
    <AppShell
      orgSlug={org.slug}
      initialAlerts={parseAlertPrefs(jar.get(ALERTS_COOKIE)?.value)}
      initialLocations={parseLocationPrefs(jar.get(LOCATIONS_COOKIE)?.value)}
      initialPreferences={parsePreferences(jar.get(PREFERENCES_COOKIE)?.value)}
      initialRecent={parseRecentPages(jar.get(RECENT_PAGES_COOKIE)?.value)}
      initialSidebar={parseSidebar(jar.get(SIDEBAR_COOKIE)?.value)}
    >
      {children}
    </AppShell>
  )
}
