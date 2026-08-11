import { PageScroll } from "@/components/shared/page-scroll"
import { Frame } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"
import type { Domain, Org } from "@/lib/scope"

type MemberRole = "Owner" | "Admin" | "Manager" | "Member" | "Viewer"
type MemberStatus = "Active" | "Invited" | "Suspended"

type Member = {
  name: string
  initials: string
  email: string
  role: MemberRole
  lastActive: string
  sites: string
  status: MemberStatus
}

type AuditEntry = {
  actor: string
  initials: string
  action: string
  detail: string
  when: string
}

const ROLE_TONE: Record<MemberRole, string> = {
  Owner: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Admin: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Manager: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Member: "bg-fill text-muted-foreground",
  Viewer: "bg-fill text-muted-foreground",
}

const MEMBER_STATUS_TONE: Record<MemberStatus, string> = {
  Active: "text-emerald-600 dark:text-emerald-400",
  Invited: "text-amber-600 dark:text-amber-400",
  Suspended: "text-red-600 dark:text-red-400",
}

const MEMBERS: Member[] = [
  {
    name: "Alex Kerr",
    initials: "AK",
    email: "alex.kerr@company1.com.au",
    role: "Owner",
    lastActive: "Today, 08:41",
    sites: "All sites",
    status: "Active",
  },
  {
    name: "Priya Tan",
    initials: "PT",
    email: "priya.tan@company1.com.au",
    role: "Admin",
    lastActive: "Today, 09:12",
    sites: "All sites",
    status: "Active",
  },
  {
    name: "Marcus Reid",
    initials: "MR",
    email: "marcus.reid@company1.com.au",
    role: "Manager",
    lastActive: "Today, 07:55",
    sites: "Brisbane Terminal",
    status: "Active",
  },
  {
    name: "Ruth Alvarez",
    initials: "RA",
    email: "ruth.alvarez@company1.com.au",
    role: "Manager",
    lastActive: "Yesterday",
    sites: "Geelong Site",
    status: "Active",
  },
  {
    name: "Jo Lin",
    initials: "JL",
    email: "jo.lin@company1.com.au",
    role: "Manager",
    lastActive: "2 days ago",
    sites: "Perth Workshop",
    status: "Active",
  },
  {
    name: "Sam Okafor",
    initials: "SO",
    email: "sam.okafor@company1.com.au",
    role: "Member",
    lastActive: "3 days ago",
    sites: "Adelaide Depot",
    status: "Active",
  },
  {
    name: "Dana Whitlock",
    initials: "DW",
    email: "dana.whitlock@company1.com.au",
    role: "Viewer",
    lastActive: "Never",
    sites: "Melbourne Depot",
    status: "Invited",
  },
  {
    name: "Tom Gerber",
    initials: "TG",
    email: "tom.gerber@company1.com.au",
    role: "Member",
    lastActive: "2 weeks ago",
    sites: "Sydney Yard",
    status: "Suspended",
  },
]

const AUDIT_LOG: AuditEntry[] = [
  {
    actor: "Alex Kerr",
    initials: "AK",
    action: "Member added",
    detail: "Invited dana.whitlock@company1.com.au as Viewer",
    when: "Today, 09:31",
  },
  {
    actor: "Alex Kerr",
    initials: "AK",
    action: "Role changed",
    detail: "Ruth Alvarez promoted from Member to Manager",
    when: "Yesterday, 14:02",
  },
  {
    actor: "Priya Tan",
    initials: "PT",
    action: "Site created",
    detail: "Added Geelong Site to organisation",
    when: "4 Aug, 11:17",
  },
  {
    actor: "Alex Kerr",
    initials: "AK",
    action: "Member suspended",
    detail: "Tom Gerber account suspended",
    when: "28 Jul, 16:44",
  },
  {
    actor: "Priya Tan",
    initials: "PT",
    action: "Plan upgraded",
    detail: "Upgraded from Starter to Pro",
    when: "1 Jul, 09:00",
  },
  {
    actor: "Alex Kerr",
    initials: "AK",
    action: "App enabled",
    detail: "Workforce module activated for organisation",
    when: "15 Jun, 10:22",
  },
]

export function AdminOverview({ domain, org }: { domain: Domain; org: Org }) {
  const activeMembers = MEMBERS.filter((m) => m.status === "Active").length

  return (
    <PageScroll overflows>
      <Frame>
        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Team members", value: "12", sub: `${activeMembers} active` },
            {
              label: "Active sites",
              value: org.locations.length.toString(),
              sub: "across 4 states",
            },
            { label: "Plan", value: org.plan, sub: "$299 / month" },
            { label: "Storage used", value: "4.2 GB", sub: "of 20 GB" },
          ].map((kpi) => (
            <div className="rounded-xl border bg-card px-4 py-3" key={kpi.label}>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{kpi.value}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/70">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Members table */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">Members</h2>
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Role</th>
                    <th className="px-4 py-2.5 font-medium">Last active</th>
                    <th className="px-4 py-2.5 font-medium">Sites</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {MEMBERS.map((member) => (
                    <tr
                      className={cn(
                        "transition-colors hover:bg-accent/40",
                        member.status === "Suspended" && "opacity-50",
                      )}
                      key={member.email}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                            {member.initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {member.name}
                            </p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                            ROLE_TONE[member.role],
                          )}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                        {member.lastActive}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {member.sites}
                      </td>
                      <td
                        className={cn(
                          "whitespace-nowrap px-4 py-2.5 text-xs font-medium",
                          MEMBER_STATUS_TONE[member.status],
                        )}
                      >
                        {member.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Billing + Activity row */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* Billing */}
          <div className="rounded-xl border bg-card p-4">
            <h2 className="mb-4 text-sm font-semibold">Billing</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Current plan</span>
                <span className="text-xs font-semibold">Pro — $299 / month</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Next billing</span>
                <span className="text-xs font-medium">1 Sep 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Seat usage</span>
                <span className="text-xs font-medium">12 / 15 seats</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-fill">
                <div className="h-full w-[80%] rounded-full bg-sky-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active sites</span>
                <span className="text-xs font-medium">6 sites</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Storage</span>
                <span className="text-xs font-medium">4.2 GB / 20 GB</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-fill">
                <div className="h-full w-[21%] rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-xl border bg-card p-4">
            <h2 className="mb-4 text-sm font-semibold">Recent activity</h2>
            <div className="space-y-3">
              {AUDIT_LOG.map((entry, i) => (
                <div className="flex items-start gap-2.5" key={i}>
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                    {entry.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-fill px-1 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {entry.action}
                      </span>
                      <span className="ml-auto shrink-0 text-[10px] text-muted-foreground/60">
                        {entry.when}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{entry.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Domain context footer */}
        <p className="mt-4 text-[10px] text-muted-foreground/40">
          {org.name} · {domain.label} · {org.plan} plan
        </p>
      </Frame>
    </PageScroll>
  )
}
