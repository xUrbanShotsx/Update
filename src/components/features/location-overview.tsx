import { CircleDotIcon, ClipboardCheckIcon, UsersIcon } from "lucide-react"

import {
  LocationOverviewView,
  type LocationDetail,
  type LocationMetric,
} from "@/components/features/views/location-overview"
import { PageHeader, type PageTag } from "@/components/shared/page-header"
import type { Domain, Location, Org } from "@/lib/scope"

/**
 * A site's front page.
 *
 * It used to be a page of its own invention — a prose column at `max-w-3xl` with
 * a heading that repeated the one in the header directly above it — which made
 * the site screens the only ones in the app not built from a view. Now it takes
 * the header treatment every other page takes over `LocationOverviewView`, and
 * what is left here is the part only this component can do: turning one
 * `Location` into the rows and tiles that view draws.
 */
export function LocationOverview({
  domain,
  location,
  org,
}: {
  readonly domain: Domain
  readonly location: Location
  readonly org: Org
}) {
  const metrics: LocationMetric[] = [
    { icon: UsersIcon, label: "Crew on site", value: location.crew },
    {
      icon: CircleDotIcon,
      label: "Open incidents",
      // Zero is the good number here, so it is the only one that stays neutral.
      tone: location.openIncidents > 0 ? "text-amber-600 dark:text-amber-400" : undefined,
      value: location.openIncidents,
    },
    { icon: ClipboardCheckIcon, label: "Last audit", value: location.lastAudit },
  ]

  // The workspace is not among these. It is on the brand row, on every other
  // page, and a site page that spends a line saying which company it belongs to
  // is answering a question nobody standing in the shell can have.
  const details: LocationDetail[] = [
    { term: "Region", value: location.region },
    { term: "Site lead", value: location.lead },
    { term: "Headcount", value: `${location.crew} on the books` },
    { term: "Last audit", value: location.lastAudit },
    { term: "Workspace", value: org.name },
  ]

  const tags: PageTag[] = [
    { label: domain.label, tone: "solid" },
    { label: location.region, tone: "muted" },
  ]

  return (
    <>
      <PageHeader
        description={`Run by ${location.lead}, with ${location.crew} on the books.`}
        location={{
          label: location.name,
          locationSlug: location.slug,
        }}
        tags={tags}
        title={location.name}
      />
      <LocationOverviewView
        details={details}
        headcount={location.crew}
        metrics={metrics}
      />
    </>
  )
}
