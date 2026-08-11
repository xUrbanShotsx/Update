/**
 * Everything the URL means, once the workspace it belongs to is already known.
 *
 * **The workspace is the subdomain.** `company-1.example/compliance/safety` —
 * see `lib/host` for why the tenant and not the app. So a path here is `/<app>`,
 * `/<app>/<section>`, `/<app>/<site>` or `/<app>/<site>/<section>`, and the
 * third position holds either a section or a site. `scopeFromPath` is the single
 * place that decides which, and it takes the org as an argument because the path
 * no longer carries one.
 *
 * The app came back into the path deliberately. It is not an isolation boundary
 * — Operations and Compliance are two navs over one company's records, and a
 * person moves between them all day — so it belongs where a router can handle it
 * rather than where a browser has to reload for it.
 *
 * The org slug is the hostname's label now, which makes it a DNS name: lower
 * case, no underscores, and renaming one is a redirect rather than a rename.
 * Domain slugs went back to being ordinary path segments and carry no such
 * constraint.
 *
 * No "use client": plain data and pure functions, read by server pages and the
 * client sidebar alike. A client module imported into a server component yields
 * a client-reference proxy rather than the values themselves.
 */

/**
 * A job. The noun Operations is built on — see `modules.txt`, where a domain
 * earns a tile by having one — and the only entity besides a site that the nav
 * can drill into.
 *
 * `site` is a slug rather than a `Location`, so the two lists stay independent
 * and a project can name a site that has not been added yet without the data
 * failing to typecheck. Nothing resolves it today; the accordion only needs the
 * name.
 */
export type Project = {
  slug: string
  name: string
  client: string
  /** Where it is in its life, in the contractor's own words. Free text for the
   *  reason `Org.tags` is: the stages differ by contract type and a closed list
   *  would be wrong within a month. */
  stage: string
  site?: string
}

export type Location = {
  slug: string
  name: string
  region: string
  lead: string
  crew: number
  openIncidents: number
  lastAudit: string
}

export type Org = {
  slug: string
  name: string
  plan: string
  /**
   * The sector, in one word — what the brand row shows beside the name once a
   * workspace is selected.
   *
   * Distinct from `tags` below, which is the specialisation. "Construction" is
   * what this company *is*; "Civil · Infrastructure" is what it does inside
   * that. The row has space for one of them and the menu has space for both.
   */
  industry: string
  /** What this org builds. Free-text rather than an enum: a contractor's own
   *  words for its work are what a person recognises in a switcher, and the set
   *  is long and regional enough that a closed list would be wrong within a
   *  month. */
  tags: readonly string[]
  /** Which apps this org has, by domain slug and in no particular order —
   *  `DOMAINS` owns the ordering, so two orgs with the same apps can't present
   *  them in different sequences.
   *
   *  This is the entitlement list: a domain absent from here has no tile in the
   *  switcher and no route, so `/company-1/admin` 404s rather than rendering a
   *  nav the org hasn't got. */
  apps: readonly string[]
  description: string
  locations: readonly Location[]
  /** Ordered as the contractor thinks of them — running work first, won work
   *  after it, finished work last. The nav shows the head of this list, so the
   *  ordering here is what decides which projects are one click away. */
  projects: readonly Project[]
}

/**
 * `readonly [Org, ...Org[]]` rather than `readonly Org[]`: it tells the type
 * system the list is non-empty, so `ORGS[0]` is an `Org` and the default below
 * needs no non-null assertion under `noUncheckedIndexedAccess`.
 */
export const ORGS: readonly [Org, ...Org[]] = [
  {
    slug: "company-1",
    name: "Company #1",
    plan: "Pro",
    industry: "Construction",
    tags: ["Civil", "Infrastructure"],
    apps: ["operations", "compliance", "workforce"],
    description:
      "Six sites across four states, running the same safety system end to end.",
    projects: [
      {
        slug: "m80-upgrade",
        name: "M80 Ring Road Upgrade",
        client: "Major Road Projects Victoria",
        stage: "On site",
        site: "melbourne-depot",
      },
      {
        slug: "westgate-ramps",
        name: "West Gate Ramp Widening",
        client: "Transurban",
        stage: "On site",
        site: "melbourne-depot",
      },
      {
        slug: "sydney-metro-fitout",
        name: "Metro Station Fitout",
        client: "Sydney Metro",
        stage: "On site",
        site: "sydney-yard",
      },
      {
        slug: "brisbane-wharf",
        name: "Hamilton Wharf Remediation",
        client: "Port of Brisbane",
        stage: "Mobilising",
        site: "brisbane-terminal",
      },
      {
        slug: "perth-depot-extension",
        name: "Kewdale Depot Extension",
        client: "Main Roads WA",
        stage: "Awarded",
        site: "perth-workshop",
      },
      {
        slug: "adelaide-culverts",
        name: "Northern Culvert Renewal",
        client: "SA Water",
        stage: "Tendered",
        site: "adelaide-depot",
      },
      {
        slug: "geelong-bypass",
        name: "Geelong Bypass Stage 3",
        client: "Regional Roads Victoria",
        stage: "Practical completion",
        site: "geelong-site",
      },
    ],
    locations: [
      {
        slug: "melbourne-depot",
        name: "Melbourne Depot",
        region: "Victoria",
        lead: "Alex Kerr",
        crew: 48,
        openIncidents: 2,
        lastAudit: "12 days ago",
      },
      {
        slug: "sydney-yard",
        name: "Sydney Yard",
        region: "New South Wales",
        lead: "Priya Tan",
        crew: 63,
        openIncidents: 0,
        lastAudit: "3 days ago",
      },
      {
        slug: "brisbane-terminal",
        name: "Brisbane Terminal",
        region: "Queensland",
        lead: "Marcus Reid",
        crew: 31,
        openIncidents: 5,
        lastAudit: "6 weeks ago",
      },
      {
        slug: "perth-workshop",
        name: "Perth Workshop",
        region: "Western Australia",
        lead: "Jo Lin",
        crew: 19,
        openIncidents: 1,
        lastAudit: "9 days ago",
      },
      {
        slug: "adelaide-depot",
        name: "Adelaide Depot",
        region: "South Australia",
        lead: "Sam Okafor",
        crew: 27,
        openIncidents: 0,
        lastAudit: "3 weeks ago",
      },
      {
        slug: "geelong-site",
        name: "Geelong Site",
        region: "Victoria",
        lead: "Ruth Alvarez",
        crew: 12,
        openIncidents: 3,
        lastAudit: "5 weeks ago",
      },
    ],
  },
  {
    slug: "company-2",
    name: "Company #2",
    plan: "Free",
    industry: "Construction",
    tags: ["Residential", "Fitout"],
    apps: ["operations", "compliance", "workforce", "admin"],
    description: "One site, one crew, and the paperwork that comes with both.",
    projects: [
      {
        slug: "harbour-apartments",
        name: "Harbour View Apartments",
        client: "Kestrel Developments",
        stage: "On site",
        site: "newcastle-yard",
      },
      {
        slug: "wallsend-fitout",
        name: "Wallsend Retail Fitout",
        client: "Novus Property",
        stage: "Awarded",
        site: "newcastle-yard",
      },
    ],
    locations: [
      {
        slug: "newcastle-yard",
        name: "Newcastle Yard",
        region: "New South Wales",
        lead: "Dana Whitlock",
        crew: 8,
        openIncidents: 1,
        lastAudit: "2 weeks ago",
      },
    ],
  },
]

export const DEFAULT_ORG = ORGS[0]

export const orgBySlug = (slug: string): Org | undefined =>
  ORGS.find((org) => org.slug === slug)

/**
 * Above this many sites a flat list stops being scannable and the panel groups
 * by region instead. Below it, grouping is worse than not: six sites across five
 * states is five runs of one, which reads as noise rather than as structure.
 */
const REGION_GROUP_THRESHOLD = 8

export type LocationGroup = { key: string; locations: readonly Location[] }

/**
 * The site list as the panel draws it — one run, or one run per region once the
 * org is big enough for that to be worth the headings. Insertion order, via the
 * Map, so regions come out in the order their first site appears rather than
 * alphabetically; the list author's ordering is the more useful one.
 */
export function locationGroups(org: Org): readonly LocationGroup[] {
  if (org.locations.length <= REGION_GROUP_THRESHOLD) {
    return [{ key: "all", locations: org.locations }]
  }

  const byRegion = new Map<string, Location[]>()
  for (const location of org.locations) {
    const run = byRegion.get(location.region)
    if (run) run.push(location)
    else byRegion.set(location.region, [location])
  }
  return [...byRegion].map(([key, locations]) => ({ key, locations }))
}

/**
 * `children` is the one bit of nesting the routes allow — a page hanging off a
 * section rather than beside it, like the board under Projects. It lives on the
 * section instead of in a slug-keyed map because sections belong to domains, and
 * a shared map would let Operations' `projects` hand its children to a
 * same-named section in another domain.
 */
export type Section = {
  slug: string
  label: string
  children?: readonly Section[]
}

/**
 * A run of sections that sit together in the nav, under a heading. The key is
 * for React and for reading this file; the label is what the panel draws.
 *
 * Grouping lives here rather than in the sidebar because it is a fact about
 * what these sections *are*, not about how one panel draws them.
 */
export type SectionGroup = { key: string; label?: string; sections: readonly Section[] }

/**
 * One of the app's top-level partitions.
 *
 * `orgGroups` and `siteGroups` are the same domain seen from the whole company
 * and from one site. They deliberately differ in content rather than mirroring
 * each other — nothing at org level is per-day and a site has no sites of its
 * own — but a section appearing in both keeps one slug across the two, so the
 * URL names the module rather than the vantage point.
 */
export type Domain = {
  slug: string
  label: string
  orgGroups: readonly SectionGroup[]
  siteGroups: readonly SectionGroup[]
  /** The app you run the workspace *from* rather than one you do the work in.
   *  The switcher rules a line above the first of these, so a flag here rather
   *  than the panel testing for `admin` by name — a second platform app should
   *  join the group instead of needing the divider rewritten. */
  platform?: boolean
}

/** Insights is three different dashboards on one slug: what it reports is
 *  whatever domain you asked it from. */
const INSIGHTS_SECTION: Section = {
  slug: "insights",
  label: "Insights",
  // One child, shared by all three domains that carry Insights: a year of days
  // shaded, which is the reading a monthly average hides. What it counts differs
  // per domain and that lives in the catalogue, not here.
  children: [{ slug: "days", label: "By day" }],
}

/**
 * The alternate readings of a module, as children.
 *
 * A second view is a child rather than a sibling for the same reason the board
 * is one: it is the same records, and a nav that lists Defects twice makes you
 * pick a shape before you have picked a subject. The header's segmented control
 * is where the choice belongs, and `lib/modules` names which shape each of these
 * draws — the label here is what the control says.
 */
const LIST_VIEW: Section = { slug: "list", label: "List" }

export const DOMAINS: readonly [Domain, ...Domain[]] = [
  {
    slug: "operations",
    label: "Operations",
    orgGroups: [
      {
        key: "general",
        label: "General",
        sections: [
          {
            slug: "projects",
            label: "Projects",
            children: [{ slug: "board", label: "Board" }],
          },
          { slug: "lookahead", label: "Lookahead" },
          {
            slug: "defects",
            label: "Defects",
            children: [
              LIST_VIEW,
              { slug: "map", label: "On plan" },
              { slug: "fixes", label: "Before & after" },
            ],
          },
        ],
      },
      {
        key: "field",
        label: "Field",
        sections: [
          // "Diaries" at org level and "Site Diary" at a site: the same slug and
          // the same module, named for what you are actually looking at. One is
          // every site's day, the other is this site's.
          {
            slug: "diary",
            label: "Diaries",
            children: [
              { slug: "today", label: "Today" },
              { slug: "calendar", label: "Calendar" },
            ],
          },
          {
            slug: "access",
            label: "Access & Attendance",
            children: [{ slug: "sign-on", label: "Sign on" }],
          },
          { slug: "deliveries", label: "Deliveries", children: [LIST_VIEW] },
          { slug: "claims", label: "Progress Claims", children: [LIST_VIEW] },
        ],
      },
      {
        key: "resources",
        label: "Resources",
        sections: [
          {
            slug: "assets",
            label: "Assets & Plant",
            children: [
              { slug: "map", label: "Where" },
              { slug: "utilisation", label: "Utilisation" },
            ],
          },
          {
            slug: "timesheets",
            label: "Timesheets",
            children: [LIST_VIEW],
          },
          {
            slug: "photos",
            label: "Photos",
            children: [{ slug: "map", label: "On plan" }],
          },
        ],
      },
      { key: "records", label: "Records", sections: [INSIGHTS_SECTION] },
    ],
    siteGroups: [
      {
        key: "today",
        label: "Today",
        sections: [
          { slug: "diary", label: "Site Diary" },
          { slug: "access", label: "Access & Attendance" },
          { slug: "lookahead", label: "Lookahead" },
        ],
      },
      {
        key: "delivery",
        label: "Delivery",
        sections: [
          { slug: "defects", label: "Defects" },
          { slug: "deliveries", label: "Deliveries" },
          { slug: "claims", label: "Progress Claims" },
        ],
      },
      {
        key: "resources",
        label: "Resources",
        sections: [
          { slug: "assets", label: "Plant on Site" },
          { slug: "timesheets", label: "Timesheets" },
          { slug: "photos", label: "Photos" },
        ],
      },
      { key: "records", label: "Records", sections: [INSIGHTS_SECTION] },
    ],
  },
  {
    slug: "compliance",
    label: "Compliance",
    orgGroups: [
      // Overview alone, which the panel prepends. A one-row group reads thin,
      // and the alternative — folding Overview in above Safety — would put the
      // landing row under a heading that calls it a register.
      { key: "general", label: "General", sections: [] },
      {
        key: "registers",
        label: "Registers",
        sections: [
          {
            slug: "safety",
            label: "Safety",
            children: [{ slug: "board", label: "Board" }],
          },
          {
            slug: "risk",
            label: "Risk",
            children: [{ slug: "matrix", label: "Matrix" }],
          },
          { slug: "quality", label: "Quality", children: [LIST_VIEW] },
          { slug: "environment", label: "Environment" },
          { slug: "chemicals", label: "Chemicals & SDS" },
          {
            slug: "contractors",
            label: "Contractor Compliance",
            children: [{ slug: "directory", label: "Directory" }],
          },
        ],
      },
      {
        // The things that stop the work happening wrongly, as against the
        // registers, which record that it did. A permit is a control and an
        // incident is a register, and filing them together is what makes a
        // safety system read as paperwork.
        key: "controls",
        label: "Controls",
        sections: [
          {
            slug: "swms",
            label: "SWMS",
            children: [{ slug: "issue", label: "Issue" }, LIST_VIEW, { slug: "versions", label: "Versions" }],
          },
          {
            slug: "permits",
            label: "Permits",
            children: [{ slug: "issue", label: "Issue" }, LIST_VIEW],
          },
          { slug: "inspections", label: "Inspections", children: [LIST_VIEW] },
          { slug: "toolbox", label: "Toolbox Talks" },
          { slug: "emergency", label: "Emergency & First Aid" },
        ],
      },
      {
        key: "records",
        label: "Records",
        sections: [
          { slug: "actions", label: "Actions", children: [LIST_VIEW] },
          {
            slug: "documents",
            label: "Documents",
            children: [{ slug: "versions", label: "Versions" }],
          },
          // An ordinary row among the records, where it used to be an add-on
          // reached from the apps menu. It was never sold separately and it has
          // no tile, no site scope and no sections of its own — everything that
          // made it look like a product was the menu it was filed in.
          {
            slug: "blueprints",
            label: "ISO Blueprints",
            children: [
              { slug: "pack", label: "Audit pack" },
              { slug: "clauses", label: "Clauses" },
            ],
          },
          INSIGHTS_SECTION,
        ],
      },
    ],
    siteGroups: [
      {
        key: "registers",
        label: "Registers",
        sections: [
          { slug: "safety", label: "Safety" },
          { slug: "risk", label: "Risk" },
          { slug: "quality", label: "Quality" },
          { slug: "environment", label: "Environment" },
          { slug: "chemicals", label: "Chemicals & SDS" },
          { slug: "contractors", label: "Contractor Compliance" },
        ],
      },
      {
        key: "controls",
        label: "Controls",
        sections: [
          { slug: "swms", label: "SWMS" },
          { slug: "permits", label: "Permits" },
          { slug: "inspections", label: "Inspections" },
          { slug: "toolbox", label: "Toolbox Talks" },
          { slug: "emergency", label: "Emergency & First Aid" },
        ],
      },
      {
        key: "records",
        label: "Records",
        sections: [
          { slug: "actions", label: "Actions" },
          { slug: "documents", label: "Documents" },
          INSIGHTS_SECTION,
        ],
      },
    ],
  },
  {
    slug: "workforce",
    label: "Workforce",
    orgGroups: [
      { key: "general", label: "General", sections: [] },
      {
        key: "people",
        label: "People",
        sections: [
          // `people` rather than `workforce`: a Workforce domain holding a
          // Workforce section names the same thing at two levels of the
          // hierarchy, and the row is the narrower of the two.
          {
            slug: "people",
            label: "People",
            children: [{ slug: "directory", label: "Directory" }],
          },
          {
            slug: "onboarding",
            label: "Onboarding",
            children: [{ slug: "checklist", label: "One person" }],
          },
          { slug: "leave", label: "Leave", children: [LIST_VIEW] },
          { slug: "performance", label: "Performance" },
        ],
      },
      {
        // What a person is allowed to do, as against who they are. The split
        // matters because this group is the one Operations reads before it puts
        // anybody on a roster, and the group above it is the one HR reads.
        key: "capability",
        label: "Capability",
        sections: [
          {
            slug: "training",
            label: "Training",
            children: [{ slug: "expiry", label: "Expiry" }],
          },
          {
            slug: "inductions",
            label: "Inductions",
            children: [{ slug: "deliver", label: "Deliver" }],
          },
          { slug: "competency", label: "Competency" },
        ],
      },
      {
        key: "health",
        label: "Health",
        sections: [
          { slug: "medicals", label: "Medicals" },
          { slug: "injury", label: "Injury Management" },
        ],
      },
      {
        key: "records",
        label: "Records",
        sections: [
          { slug: "ppe", label: "PPE & Issue" },
          { slug: "rates", label: "Rates & Awards" },
          INSIGHTS_SECTION,
        ],
      },
    ],
    siteGroups: [
      {
        key: "people",
        label: "People",
        sections: [
          { slug: "people", label: "Crew" },
          { slug: "training", label: "Training" },
          { slug: "inductions", label: "Inductions" },
          { slug: "competency", label: "Competency" },
        ],
      },
      {
        key: "records",
        label: "Records",
        sections: [{ slug: "ppe", label: "PPE & Issue" }, INSIGHTS_SECTION],
      },
    ],
  },
  {
    slug: "admin",
    label: "Admin",
    orgGroups: [
      { key: "general", label: "General", sections: [] },
      {
        key: "organisation",
        label: "Organisation",
        sections: [
          { slug: "settings", label: "Settings" },
          { slug: "members", label: "Members" },
          { slug: "roles", label: "Roles & permissions" },
        ],
      },
      {
        key: "platform",
        label: "Platform",
        sections: [
          { slug: "billing", label: "Billing" },
          { slug: "integrations", label: "Integrations" },
          { slug: "audit", label: "Audit log" },
        ],
      },
      {
        // The group procurement reads. None of it is sold on and all of it is
        // lost on, which is why it is a group of its own rather than three more
        // rows under Platform where they would be read as optional.
        key: "security",
        label: "Security",
        sections: [
          { slug: "authentication", label: "Authentication" },
          { slug: "retention", label: "Data & retention" },
        ],
      },
    ],
    platform: true,
    // The one domain with no site scope. Settings, members and billing are
    // facts about the company rather than about anywhere it works, so there is
    // no per-site version of them to show — which is what makes the resolver
    // 404 a site under this domain and the panel drop its segmented control.
    siteGroups: [],
    // No sites index either, for the same reason. Every other domain lists the
    // sites because every other domain has something to say about one.
  },
]

export const domainBySlug = (slug: string, org?: Org): Domain | undefined => {
  const domain = DOMAINS.find((item) => item.slug === slug)
  if (!domain) return undefined
  // With an org in hand this is an entitlement check as well as a lookup, so a
  // caller can't accidentally resolve a domain the org hasn't bought.
  return !org || org.apps.includes(domain.slug) ? domain : undefined
}

/** The org's apps, in `DOMAINS` order. */
export const domainsFor = (org: Org): readonly Domain[] =>
  DOMAINS.filter((domain) => org.apps.includes(domain.slug))

/**
 * Where an org lands when nothing in the URL says which app. Its first, rather
 * than a global default: an org without Operations would otherwise be redirected
 * to a domain it cannot open. The fallback covers an org entitled to nothing,
 * which is a data error rather than a state to design for.
 */
export const defaultDomain = (org: Org): Domain => domainsFor(org)[0] ?? DOMAINS[0]

/**
 * Every org-level section of one domain, which is now exactly what the nav
 * draws.
 *
 * There used to be an `ungrouped` list beside this for pages with a route and no
 * row — the sites index and the crosswalk. Both are gone: the sites index because
 * the Locations segment was always the way in and a second one was a duplicate,
 * and the crosswalk because it is an ordinary row now. A page reachable only by
 * typing its URL turned out to be a page nobody reached.
 */
export const orgSections = (domain: Domain): readonly Section[] =>
  domain.orgGroups.flatMap((group) => group.sections)

export const siteSections = (domain: Domain): readonly Section[] =>
  domain.siteGroups.flatMap((group) => group.sections)

/**
 * Slugs a site may not take. `scopeFromPath` checks sections before sites, so a
 * site slugged `safety` would be unreachable — this is the list to validate new
 * site slugs against.
 *
 * Resolution is per-domain, but validation is deliberately global: a site called
 * `training` would resolve fine under Operations and vanish under Workforce, and
 * a site that half-exists is a worse failure than one that is rejected outright.
 *
 * The domain slugs are still in here even though no path position holds one any
 * more. A site called `compliance` would resolve, but `compliance.host` is a
 * different app and the two would be read as the same thing by anybody scanning
 * a URL — and the day a domain is renamed, its old slug wants a redirect rather
 * than a collision with somebody's yard.
 */
/** The one section whose third path position holds an entity rather than a
 *  view. Named rather than inlined, because the resolver and the nav both have
 *  to agree about which section that is. */
export const PROJECTS_SECTION = "projects"

export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  ...DOMAINS.map((domain) => domain.slug),
  ...DOMAINS.flatMap((domain) => orgSections(domain).map((section) => section.slug)),
  // Every view child too, since a project shares their path position: a project
  // slugged `board` would resolve to the projects board and never to itself.
  ...DOMAINS.flatMap((domain) =>
    orgSections(domain).flatMap((section) =>
      (section.children ?? []).map((child) => child.slug),
    ),
  ),
])

/** A project's page. Its own href builder, because it is the one link whose
 *  third segment is an entity rather than a view. */
export const projectHref = (domain: Domain, project: Project): string =>
  `/${domain.slug}/${PROJECTS_SECTION}/${project.slug}`

export type Scope =
  | { kind: "org"; org: Org; domain: Domain; section?: Section; child?: Section }
  | { kind: "project"; org: Org; domain: Domain; project: Project }
  | {
      kind: "location"
      org: Org
      domain: Domain
      location: Location
      section?: Section
    }

/**
 * The URL's meaning inside a given workspace, or undefined if the app, the
 * section or the site doesn't exist — one 404 rather than three.
 *
 * `org` is a parameter rather than a segment because the hostname carries it. On
 * the server it comes from `orgFromHost`; on the client it comes down from the
 * layout that read the host, never from `location.hostname` — see `lib/host`.
 *
 * Entitlement is checked by `domainBySlug`, which is passed the org: a workspace
 * without Admin gets `undefined` for `/admin` rather than a nav it hasn't
 * bought.
 *
 * Sections win the second position over sites. That ordering is the whole reason
 * `RESERVED_SLUGS` exists: whichever is checked first is the one a clashing slug
 * resolves to, and a section disappearing behind a site would be far harder to
 * notice than the reverse.
 */
export function scopeFromPath(pathname: string, org: Org): Scope | undefined {
  const [appSlug, second, third] = pathname.split("/").filter(Boolean)
  if (!appSlug) return undefined
  const domain = domainBySlug(appSlug, org)
  if (!domain) return undefined
  if (!second) return { kind: "org", org, domain }

  const section = orgSections(domain).find((item) => item.slug === second)
  if (section) {
    const child = section.children?.find((item) => item.slug === third)
    if (child) return { kind: "org", org, domain, section, child }
    // A project sits in the same position a view child does, and views win it —
    // the same ordering, and the same reason, as sections beating sites one
    // level up. `RESERVED_SLUGS` is what keeps a project from being slugged
    // `board` and vanishing behind the view of the register it belongs to.
    if (third && section.slug === PROJECTS_SECTION) {
      const project = org.projects.find((item) => item.slug === third)
      if (project) return { kind: "project", org, domain, project }
      return undefined
    }
    return { kind: "org", org, domain, section, child }
  }

  const location = org.locations.find((item) => item.slug === second)
  if (location) {
    // A domain with no site sections has no site scope at all, so the site is
    // not merely empty here — it is not addressable, and the URL is wrong.
    if (!domain.siteGroups.length) return undefined
    return {
      kind: "location",
      org,
      domain,
      location,
      section: siteSections(domain).find((item) => item.slug === third),
    }
  }

  return undefined
}

/**
 * The app a path is asking for, whether or not the rest of it resolves.
 *
 * Separate from `scopeFromPath` because the chrome wants to know which nav to
 * draw even while the page under it is a 404 — and because the shell reads it on
 * every navigation, where running the whole resolver would be three lookups to
 * answer one question.
 */
export function domainFromPath(pathname: string, org: Org): Domain | undefined {
  const [appSlug] = pathname.split("/").filter(Boolean)
  return appSlug ? domainBySlug(appSlug, org) : undefined
}

// Href builders. Every link in the app goes through one of these, so the app can
// never be forgotten and the shape can change in one place.
//
// None of them take an org, and that is the dividend of the move: a path is
// always within the workspace that served it, so no link can name another
// tenant's records by accident. Leaving for another workspace is `orgUrl` in
// `lib/host`, which returns an absolute URL — visibly a different kind of link,
// because it crosses an origin.

export const orgHref = (domain: Domain, section?: string, child?: string): string =>
  `/${domain.slug}${section ? `/${section}` : ""}${child ? `/${child}` : ""}`

export const locationHref = (
  domain: Domain,
  location: Location,
  section?: string,
): string => `/${domain.slug}/${location.slug}${section ? `/${section}` : ""}`
