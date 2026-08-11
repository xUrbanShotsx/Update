import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { Frame } from "@/components/features/views/primitives"
import { PageScroll } from "@/components/shared/page-scroll"
import { cn } from "@/lib/utils"

type Rating =
  | "Outstanding"
  | "Exceeds expectations"
  | "Meets expectations"
  | "Developing"
  | "Not yet reviewed"

type Review = {
  name: string
  role: string
  site: string
  cycle: string
  reviewer: string
  rating: Rating
  reviewed: string
  nextDue: string
}

const REVIEWS: readonly Review[] = [
  {
    name: "Alex Kerr",
    role: "Site manager",
    site: "Melbourne Depot",
    cycle: "Annual 2025",
    reviewer: "N. Patel (GM)",
    rating: "Outstanding",
    reviewed: "15 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Sharon Nguyen",
    role: "Senior supervisor",
    site: "Sydney Yard",
    cycle: "Annual 2025",
    reviewer: "N. Patel (GM)",
    rating: "Exceeds expectations",
    reviewed: "2 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Marcus Reid",
    role: "Construction manager",
    site: "Brisbane Terminal",
    cycle: "Annual 2025",
    reviewer: "N. Patel (GM)",
    rating: "Meets expectations",
    reviewed: "18 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Jo Lin",
    role: "HSEQ manager",
    site: "Perth Workshop",
    cycle: "Annual 2025",
    reviewer: "N. Patel (GM)",
    rating: "Outstanding",
    reviewed: "20 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Sam Okafor",
    role: "Project engineer",
    site: "Adelaide Depot",
    cycle: "Annual 2025",
    reviewer: "Alex Kerr",
    rating: "Exceeds expectations",
    reviewed: "10 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Ruth Alvarez",
    role: "Site supervisor",
    site: "Geelong Site",
    cycle: "Annual 2025",
    reviewer: "Marcus Reid",
    rating: "Meets expectations",
    reviewed: "5 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Dean Kowalski",
    role: "Leading hand",
    site: "Melbourne Depot",
    cycle: "Annual 2025",
    reviewer: "Alex Kerr",
    rating: "Meets expectations",
    reviewed: "22 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Grace Park",
    role: "Project coordinator",
    site: "Sydney Yard",
    cycle: "Annual 2025",
    reviewer: "Sharon Nguyen",
    rating: "Developing",
    reviewed: "8 Jul 2025",
    nextDue: "Jan 2026",
  },
  {
    name: "Tom Ihaka",
    role: "Foreman",
    site: "Brisbane Terminal",
    cycle: "Annual 2025",
    reviewer: "Marcus Reid",
    rating: "Meets expectations",
    reviewed: "12 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Dana Whitlock",
    role: "Site supervisor",
    site: "Perth Workshop",
    cycle: "Annual 2025",
    reviewer: "Jo Lin",
    rating: "Exceeds expectations",
    reviewed: "9 Jul 2025",
    nextDue: "Jul 2026",
  },
  {
    name: "Priya Tan",
    role: "Environmental officer",
    site: "Adelaide Depot",
    cycle: "Annual 2025",
    reviewer: "Jo Lin",
    rating: "Not yet reviewed",
    reviewed: "—",
    nextDue: "Aug 2025",
  },
  {
    name: "Carlos Vega",
    role: "Plant supervisor",
    site: "Geelong Site",
    cycle: "Annual 2025",
    reviewer: "Ruth Alvarez",
    rating: "Not yet reviewed",
    reviewed: "—",
    nextDue: "Aug 2025",
  },
]

const RATING_STYLE: Record<Rating, string> = {
  Outstanding: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "Exceeds expectations": "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "Meets expectations": "bg-fill text-muted-foreground",
  Developing: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "Not yet reviewed": "bg-red-500/10 text-red-500",
}

const PERFORMANCE_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Employee", type: "section" },
  {
    name: "name",
    label: "Employee name",
    type: "text",
    required: true,
    placeholder: "Full name",
  },
  {
    name: "role",
    label: "Role / position",
    type: "text",
    required: true,
    placeholder: "e.g. Site supervisor",
  },
  {
    name: "site",
    label: "Primary site",
    type: "select",
    required: true,
    options: [
      "Melbourne Depot",
      "Sydney Yard",
      "Brisbane Terminal",
      "Perth Workshop",
      "Adelaide Depot",
      "Geelong Site",
    ],
  },
  { name: "s2", label: "Review details", type: "section" },
  {
    name: "cycle",
    label: "Review cycle",
    type: "select",
    required: true,
    options: [
      "Annual 2025",
      "Mid-year 2025",
      "Probation — 3 month",
      "Probation — 6 month",
      "Performance improvement plan",
    ],
  },
  {
    name: "reviewer",
    label: "Reviewer",
    type: "text",
    required: true,
    placeholder: "Full name and role",
  },
  { name: "due_date", label: "Review due date", type: "date", required: true },
  { name: "s3", label: "Outcome", type: "section" },
  {
    name: "rating",
    label: "Rating",
    type: "select",
    options: [
      "Outstanding",
      "Exceeds expectations",
      "Meets expectations",
      "Developing",
      "Not yet reviewed",
    ],
  },
  { name: "reviewed_date", label: "Date reviewed", type: "date" },
  {
    name: "notes",
    label: "Notes / actions",
    type: "textarea",
    rows: 3,
    placeholder: "Development goals, follow-up actions, succession notes…",
  },
]

export function PerformanceTable() {
  const outstanding = REVIEWS.filter((r) => r.rating === "Outstanding").length
  const overdue = REVIEWS.filter((r) => r.rating === "Not yet reviewed").length
  const developing = REVIEWS.filter((r) => r.rating === "Developing").length

  return (
    <PageScroll overflows>
      <Frame>
        {/* Stat strip */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Total reviews", value: REVIEWS.length },
            { label: "Outstanding", value: outstanding, cls: "text-emerald-500" },
            { label: "Developing", value: developing, cls: "text-amber-500" },
            { label: "Not yet reviewed", value: overdue, cls: "text-red-500" },
          ].map((s) => (
            <div className="rounded-xl border bg-card p-3" key={s.label}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`mt-1 text-xl font-semibold tabular-nums ${s.cls ?? ""}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Annual review cycle — FY 2025</p>
          <AddSheet title="Performance Review" fields={PERFORMANCE_FIELDS} />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Person</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Cycle</th>
                  <th className="px-4 py-3 font-medium">Reviewer</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">Reviewed</th>
                  <th className="px-4 py-3 font-medium">Next due</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {REVIEWS.map((review) => (
                  <tr className="hover:bg-accent/40" key={review.name}>
                    <td className="px-4 py-2.5">
                      <p className="font-medium">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.site}</p>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">
                      {review.role}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">
                      {review.cycle}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">
                      {review.reviewer}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[11px] font-medium",
                          RATING_STYLE[review.rating],
                        )}
                      >
                        {review.rating}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm tabular-nums text-muted-foreground">
                      {review.reviewed}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 text-sm tabular-nums",
                        review.rating === "Not yet reviewed"
                          ? "font-medium text-red-500"
                          : "text-muted-foreground",
                      )}
                    >
                      {review.nextDue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Frame>
    </PageScroll>
  )
}
