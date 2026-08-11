import { PageScroll } from "@/components/shared/page-scroll"
import { Frame, Toolbar } from "@/components/features/views/primitives"
import { cn } from "@/lib/utils"

type PermitType =
  | "Hot work"
  | "Confined space"
  | "Excavation"
  | "Heights"
  | "Electrical isolation"
  | "Asbestos"

type PermitStatus = "Active" | "Closed" | "Cancelled" | "Expired"

type Permit = {
  ref: string
  permitType: PermitType
  site: string
  issuedTo: string
  issuedToInitials: string
  issued: string
  expires: string
  issuer: string
  status: PermitStatus
}

const STATUS_TONE: Record<PermitStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Closed: "bg-fill text-muted-foreground",
  Cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
  Expired: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

const PERMITS: Permit[] = [
  {
    ref: "PTW-112",
    permitType: "Hot work",
    site: "Brisbane Terminal",
    issuedTo: "Darren Voss",
    issuedToInitials: "DV",
    issued: "11 Aug, 07:00",
    expires: "11 Aug, 17:00",
    issuer: "Marcus Reid",
    status: "Active",
  },
  {
    ref: "PTW-111",
    permitType: "Heights",
    site: "Sydney Yard",
    issuedTo: "Carl Nguyen",
    issuedToInitials: "CN",
    issued: "11 Aug, 06:30",
    expires: "11 Aug, 16:30",
    issuer: "Priya Tan",
    status: "Active",
  },
  {
    ref: "PTW-110",
    permitType: "Excavation",
    site: "Melbourne Depot",
    issuedTo: "Ben Stavros",
    issuedToInitials: "BS",
    issued: "11 Aug, 07:15",
    expires: "14 Aug, 17:00",
    issuer: "Alex Kerr",
    status: "Active",
  },
  {
    ref: "PTW-109",
    permitType: "Electrical isolation",
    site: "Geelong Site",
    issuedTo: "Natasha Cole",
    issuedToInitials: "NC",
    issued: "10 Aug, 08:00",
    expires: "12 Aug, 17:00",
    issuer: "Ruth Alvarez",
    status: "Expired",
  },
  {
    ref: "PTW-108",
    permitType: "Confined space",
    site: "Perth Workshop",
    issuedTo: "Phil O'Brien",
    issuedToInitials: "PO",
    issued: "8 Aug, 07:00",
    expires: "8 Aug, 15:00",
    issuer: "Jo Lin",
    status: "Closed",
  },
  {
    ref: "PTW-107",
    permitType: "Hot work",
    site: "Adelaide Depot",
    issuedTo: "Troy Marsh",
    issuedToInitials: "TM",
    issued: "7 Aug, 08:30",
    expires: "7 Aug, 17:00",
    issuer: "Sam Okafor",
    status: "Closed",
  },
  {
    ref: "PTW-106",
    permitType: "Asbestos",
    site: "Melbourne Depot",
    issuedTo: "Kim Fraser",
    issuedToInitials: "KF",
    issued: "5 Aug, 07:00",
    expires: "7 Aug, 17:00",
    issuer: "Alex Kerr",
    status: "Closed",
  },
  {
    ref: "PTW-105",
    permitType: "Heights",
    site: "Brisbane Terminal",
    issuedTo: "Darren Voss",
    issuedToInitials: "DV",
    issued: "4 Aug, 07:00",
    expires: "4 Aug, 17:00",
    issuer: "Marcus Reid",
    status: "Expired",
  },
  {
    ref: "PTW-104",
    permitType: "Excavation",
    site: "Sydney Yard",
    issuedTo: "Carl Nguyen",
    issuedToInitials: "CN",
    issued: "1 Aug, 06:30",
    expires: "3 Aug, 17:00",
    issuer: "Priya Tan",
    status: "Expired",
  },
  {
    ref: "PTW-103",
    permitType: "Electrical isolation",
    site: "Perth Workshop",
    issuedTo: "Natasha Cole",
    issuedToInitials: "NC",
    issued: "30 Jul, 08:00",
    expires: "30 Jul, 16:00",
    issuer: "Jo Lin",
    status: "Expired",
  },
  {
    ref: "PTW-102",
    permitType: "Confined space",
    site: "Geelong Site",
    issuedTo: "Ben Stavros",
    issuedToInitials: "BS",
    issued: "28 Jul, 07:30",
    expires: "28 Jul, 15:30",
    issuer: "Ruth Alvarez",
    status: "Cancelled",
  },
  {
    ref: "PTW-101",
    permitType: "Hot work",
    site: "Adelaide Depot",
    issuedTo: "Troy Marsh",
    issuedToInitials: "TM",
    issued: "25 Jul, 08:00",
    expires: "25 Jul, 17:00",
    issuer: "Sam Okafor",
    status: "Closed",
  },
]

export function PermitsRegister() {
  const active = PERMITS.filter((p) => p.status === "Active")
  const issuedToday = PERMITS.filter((p) => p.issued.startsWith("11 Aug"))
  const expired = PERMITS.filter((p) => p.status === "Expired")
  const cancelled = PERMITS.filter((p) => p.status === "Cancelled")

  return (
    <PageScroll overflows>
      <Frame>
        <Toolbar filters={3} />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            {
              label: "Active",
              value: active.length,
              tone: "text-emerald-600 dark:text-emerald-400",
            },
            { label: "Issued today", value: issuedToday.length, tone: "" },
            {
              label: "Expired",
              value: expired.length,
              tone: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Cancelled",
              value: cancelled.length,
              tone: "text-red-600 dark:text-red-400",
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
                  <th className="px-4 py-2.5 font-medium">Ref</th>
                  <th className="px-4 py-2.5 font-medium">Permit type</th>
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Issued to</th>
                  <th className="px-4 py-2.5 font-medium">Issued</th>
                  <th className="px-4 py-2.5 font-medium">Expires</th>
                  <th className="px-4 py-2.5 font-medium">Issuer</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {PERMITS.map((permit) => (
                  <tr
                    className={cn(
                      "transition-colors hover:bg-accent/40",
                      (permit.status === "Closed" || permit.status === "Cancelled") &&
                        "opacity-50",
                    )}
                    key={permit.ref}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {permit.ref}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-sm">
                      {permit.permitType}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {permit.site}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-strong text-[9px] font-medium">
                          {permit.issuedToInitials}
                        </div>
                        <span className="whitespace-nowrap text-xs">
                          {permit.issuedTo}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {permit.issued}
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-2.5 text-xs",
                        permit.status === "Expired"
                          ? "font-medium text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {permit.expires}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {permit.issuer}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          STATUS_TONE[permit.status],
                        )}
                      >
                        {permit.status}
                      </span>
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
