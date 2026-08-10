"use client"

import { ArrowRightIcon, LayersIcon, MapPinIcon, MonitorIcon } from "lucide-react"
import Link from "next/link"

import { SettingsPanels, type SettingsPanel } from "@/components/shared/settings-panels"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ACCOUNT, SESSIONS } from "@/lib/account"
import { orgUrl } from "@/lib/host"
import { defaultDomain, ORGS, orgHref } from "@/lib/scope"
import { cn } from "@/lib/utils"

function Field({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b py-2.5 last:border-b-0">
      <dt className="w-32 shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 truncate text-sm">{value}</dd>
    </div>
  )
}

/**
 * You, in a dialog — over whatever you were reading rather than instead of it.
 *
 * It was a page twice: `/<org>/account` inside the shell, then `/account` beside
 * the picker. Both were wrong in the same way. Reading your own email address is
 * not a change of place, and routing to it meant leaving the work on screen,
 * losing the app you were in, and — after the move to subdomains — a document
 * load across origins to look at four fields and a session list.
 *
 * A dialog, then, exactly like Preferences beside it in the same menu. The two
 * are one kind of thing: settings about you, opened over the page, dismissed
 * back to it. Having one of them be a route and the other a modal was the odd
 * part, and the menu's own divider was already saying so — it separated Account,
 * which "goes somewhere", from the two that don't. Nothing goes anywhere now,
 * and the divider went with it.
 */
export function AccountDialog({
  open,
  onOpenChange,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}) {
  const panels: SettingsPanel[] = [
    {
      key: "profile",
      label: "Profile",
      title: "Profile",
      description: "Who you are across every organisation you belong to.",
      content: (
        <>
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-fill-strong text-base font-medium">
              {ACCOUNT.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{ACCOUNT.name}</p>
              <p className="truncate text-sm text-muted-foreground">{ACCOUNT.email}</p>
            </div>
          </div>
          <dl className="mt-6 rounded-xl border bg-card px-4">
            <Field label="Name" value={ACCOUNT.name} />
            <Field label="Email" value={ACCOUNT.email} />
            <Field label="Role" value={ACCOUNT.role} />
            <Field label="Member since" value={ACCOUNT.joined} />
          </dl>
        </>
      ),
    },
    {
      key: "organisations",
      label: "Organisations",
      title: "Organisations",
      description:
        "Switching here goes to that organisation's overview, the same as the switcher in the sidebar.",
      // Real data, not a stand-in: the same `ORGS` the switcher reads, so this
      // page can't list an org the switcher doesn't offer.
      //
      // Every row crosses an origin — a workspace is a host now — so every href
      // is absolute. Nothing is ticked: the dialog opens over the picker as well
      // as inside a workspace, so "the one you are in" is not a fact it can
      // always state, and a mark that appeared on four screens out of five
      // would be worse than none.
      content: (
        <div className="flex flex-col gap-2">
          {ORGS.map((item) => (
            <Link
              className={cn(
                "group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40",
              )}
              href={orgUrl(item, orgHref(defaultDomain(item)))}
              key={item.slug}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-medium">{item.name}</h3>
                  <span className="shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {item.plan}
                  </span>
                </div>
                <p className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="size-3" />
                    {item.locations.length}{" "}
                    {item.locations.length === 1 ? "site" : "sites"}
                  </span>
                  <span className="flex items-center gap-1">
                    <LayersIcon className="size-3" />
                    {item.locations.reduce((total, location) => total + location.crew, 0)}{" "}
                    crew
                  </span>
                </p>
              </div>
              <ArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground/45 transition-colors group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      ),
    },
    {
      key: "sessions",
      label: "Sessions",
      title: "Sessions",
      description:
        "Every device signed in to this account. Revoking one signs it out immediately.",
      content: (
        <div className="flex flex-col gap-2">
          {SESSIONS.map((session) => (
            <div
              className="flex items-center gap-3 rounded-xl border bg-card p-4"
              key={session.id}
            >
              <MonitorIcon className="size-4 shrink-0 text-muted-foreground/60" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-medium">{session.device}</h3>
                  {session.current ? (
                    <span className="shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                      This device
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {session.browser} · {session.location} · {session.lastActive}
                </p>
              </div>
              {session.current ? null : (
                <button
                  className="shrink-0 rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                  type="button"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {/* The same frame Preferences uses, one rung wider. They open from adjacent
          rows of one menu so they share a shape — but this one holds records
          where that one holds switches, and a workspace card carrying a name, a
          plan, a site count and a crew count wraps at Preferences' width. */}
      <DialogContent className="gap-0 overflow-hidden p-0" size="lg">
        <DialogTitle className="border-b border-border px-4 py-3 text-sm font-medium">
          Account
        </DialogTitle>
        <SettingsPanels panels={panels} surface="dialog" />
      </DialogContent>
    </Dialog>
  )
}
