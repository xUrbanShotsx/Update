import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { AddSheet, type FieldDef } from "@/components/shared/add-sheet"
import { cn } from "@/lib/utils"

type DocCategory = "Policy" | "Procedure" | "Form" | "Plan" | "Register" | "ITP"
type DocStatus = "Current" | "Under review" | "Superseded"

type Document = {
  title: string
  category: DocCategory
  version: string
  owner: string
  reviewed: string
  nextReview: string
  status: DocStatus
}

const CATEGORY_TONE: Record<DocCategory, string> = {
  Policy: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Procedure: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Form: "bg-fill text-muted-foreground",
  Plan: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Register: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  ITP: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
}

const STATUS_TONE: Record<DocStatus, string> = {
  Current: "text-emerald-600 dark:text-emerald-400",
  "Under review": "text-amber-600 dark:text-amber-400",
  Superseded: "text-muted-foreground",
}

const DOCUMENTS: Document[] = [
  {
    title: "Work Health & Safety Policy",
    category: "Policy",
    version: "v3.1",
    owner: "Alex Kerr",
    reviewed: "Feb 2025",
    nextReview: "Feb 2026",
    status: "Current",
  },
  {
    title: "Environmental Management Policy",
    category: "Policy",
    version: "v2.0",
    owner: "Ruth Alvarez",
    reviewed: "Jan 2025",
    nextReview: "Jan 2026",
    status: "Current",
  },
  {
    title: "Incident Reporting Procedure",
    category: "Procedure",
    version: "v4.2",
    owner: "Marcus Reid",
    reviewed: "Mar 2025",
    nextReview: "Mar 2026",
    status: "Current",
  },
  {
    title: "Working at Heights Procedure",
    category: "Procedure",
    version: "v3.0",
    owner: "Ruth Alvarez",
    reviewed: "Apr 2025",
    nextReview: "Apr 2026",
    status: "Current",
  },
  {
    title: "Permit to Work Procedure",
    category: "Procedure",
    version: "v2.5",
    owner: "Marcus Reid",
    reviewed: "May 2025",
    nextReview: "May 2026",
    status: "Current",
  },
  {
    title: "Confined Space Entry Procedure",
    category: "Procedure",
    version: "v2.1",
    owner: "Jo Lin",
    reviewed: "Jun 2025",
    nextReview: "Jun 2026",
    status: "Current",
  },
  {
    title: "Emergency Response Plan",
    category: "Plan",
    version: "v5.0",
    owner: "Priya Tan",
    reviewed: "Jan 2025",
    nextReview: "Jan 2026",
    status: "Current",
  },
  {
    title: "Traffic Management Plan — Sydney Yard",
    category: "Plan",
    version: "v1.4",
    owner: "Priya Tan",
    reviewed: "Jul 2025",
    nextReview: "Jul 2026",
    status: "Under review",
  },
  {
    title: "Construction Environmental Management Plan",
    category: "Plan",
    version: "v3.3",
    owner: "Alex Kerr",
    reviewed: "Mar 2025",
    nextReview: "Mar 2026",
    status: "Current",
  },
  {
    title: "Incident Report Form",
    category: "Form",
    version: "v2.0",
    owner: "Marcus Reid",
    reviewed: "Feb 2025",
    nextReview: "Feb 2026",
    status: "Current",
  },
  {
    title: "Pre-start / Toolbox Talk Record",
    category: "Form",
    version: "v1.3",
    owner: "Ruth Alvarez",
    reviewed: "Apr 2025",
    nextReview: "Apr 2026",
    status: "Current",
  },
  {
    title: "Hazardous Chemicals Register",
    category: "Register",
    version: "v2.4",
    owner: "Sam Okafor",
    reviewed: "Jun 2025",
    nextReview: "Jun 2026",
    status: "Current",
  },
  {
    title: "Contractor Compliance Register",
    category: "Register",
    version: "v1.9",
    owner: "Alex Kerr",
    reviewed: "Jul 2025",
    nextReview: "Jul 2026",
    status: "Under review",
  },
  {
    title: "Concrete Works ITP — M80 Ring Road",
    category: "ITP",
    version: "v2.0",
    owner: "Sam Okafor",
    reviewed: "May 2025",
    nextReview: "May 2026",
    status: "Current",
  },
  {
    title: "Earthworks & Drainage ITP",
    category: "ITP",
    version: "v1.7",
    owner: "Alex Kerr",
    reviewed: "Jun 2025",
    nextReview: "Jun 2026",
    status: "Current",
  },
  {
    title: "WHS Policy (superseded)",
    category: "Policy",
    version: "v2.3",
    owner: "Alex Kerr",
    reviewed: "Feb 2023",
    nextReview: "—",
    status: "Superseded",
  },
]

const DOCUMENT_FIELDS: readonly FieldDef[] = [
  { name: "s1", label: "Document details", type: "section" },
  {
    name: "name",
    label: "Document name",
    type: "text",
    required: true,
    placeholder: "e.g. WHS Management Plan",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      "Policy",
      "Procedure",
      "Management plan",
      "Form / template",
      "Register",
      "Drawing",
      "Specification",
      "Certificate / licence",
      "Report",
      "Other",
    ],
  },
  {
    name: "version",
    label: "Version",
    type: "text",
    required: true,
    placeholder: "e.g. v2.1",
  },
  { name: "s2", label: "Ownership", type: "section" },
  {
    name: "owner",
    label: "Document owner",
    type: "text",
    required: true,
    placeholder: "Full name or role",
  },
  { name: "approver", label: "Approver", type: "text", placeholder: "Full name or role" },
  { name: "s3", label: "Review cycle", type: "section" },
  { name: "issue_date", label: "Issue / revision date", type: "date", required: true },
  { name: "next_review", label: "Next review date", type: "date", required: true },
  {
    name: "file_ref",
    label: "File reference / location",
    type: "text",
    placeholder: "SharePoint path or doc number",
  },
]

export function DocumentsLibrary() {
  const current = DOCUMENTS.filter((d) => d.status === "Current")
  const underReview = DOCUMENTS.filter((d) => d.status === "Under review")
  const superseded = DOCUMENTS.filter((d) => d.status === "Superseded")

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Register overview</p>
          <AddSheet title="Document" fields={DOCUMENT_FIELDS} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Total documents", value: DOCUMENTS.length, tone: "" },
            {
              label: "Current",
              value: current.length,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Under review",
              value: underReview.length,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Superseded",
              value: superseded.length,
              tone: "text-muted-foreground",
            },
          ].map((stat) => (
            <div className="rounded-xl border bg-card px-4 py-3" key={stat.label}>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("mt-1 text-xl font-semibold tabular-nums", stat.tone)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Document</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Version</th>
                  <th className="px-4 py-2.5 font-medium">Owner</th>
                  <th className="px-4 py-2.5 font-medium">Reviewed</th>
                  <th className="px-4 py-2.5 font-medium">Next review</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {DOCUMENTS.map((doc) => (
                  <tr
                    className={cn(
                      "transition-colors hover:bg-accent/40",
                      doc.status === "Superseded" && "opacity-50",
                    )}
                    key={doc.title}
                  >
                    <td className="px-4 py-2.5 text-sm font-medium">{doc.title}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          CATEGORY_TONE[doc.category],
                        )}
                      >
                        {doc.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {doc.version}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {doc.owner}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {doc.reviewed}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {doc.nextReview}
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-2.5 text-xs font-medium",
                        STATUS_TONE[doc.status],
                      )}
                    >
                      {doc.status}
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
