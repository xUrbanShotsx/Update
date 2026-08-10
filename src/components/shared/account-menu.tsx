"use client"
// You, in a menu — and the one piece of chrome that outlives the workspace.

import { LogOutIcon, MessageSquareIcon, SettingsIcon, UserIcon } from "lucide-react"
import { useState, type ReactNode } from "react"

import { AccountDialog } from "@/components/shared/account-dialog"
import { FeedbackDialog } from "@/components/shared/feedback-dialog"
import { PreferencesDialog } from "@/components/shared/preferences-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ACCOUNT } from "@/lib/account"
import {
  DEFAULT_PREFERENCES,
  serialisePreferences,
  type Preferences,
} from "@/lib/preferences"
import { cn } from "@/lib/utils"

/**
 * Lifted out of `app-sidebar` when the workspace picker needed one too.
 *
 * It had been a sidebar export for as long as the sidebar was the only place it
 * appeared. Importing it from there into the picker would have pulled the entire
 * nav — the search index, the module catalogue, forty icons — into the one route
 * that has no nav at all, to render a 24px avatar.
 */
export function AccountMenu({
  align = "start",
  children,
  label,
  onAccount,
  onFeedback,
  onPreferences,
  side = "top",
}: {
  readonly align?: "start" | "end"
  readonly children: ReactNode
  readonly label?: string
  readonly onAccount: () => void
  readonly onFeedback: () => void
  readonly onPreferences: () => void
  readonly side?: "bottom" | "right" | "top"
}) {
  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger render={children as React.ReactElement} />
      <DropdownMenuContent align={align} className="min-w-48" side={side} sideOffset={8}>
        <div className="px-2 py-1">
          <p className="truncate text-xs font-medium text-foreground">{ACCOUNT.name}</p>
          <p className="truncate text-[10px] text-muted-foreground">{ACCOUNT.email}</p>
        </div>
        <div className="-mx-1 my-1 h-px bg-border" />
        {/* Two items where there was one Settings. They are different questions:
            Account is who you are — name, email, sessions, which orgs you belong
            to — and Preferences is how the app behaves for you. One gear
            covering both meant every trip to change a notification setting went
            through a page about your identity. The gear stays with Preferences,
            since that is the half it was always describing.

            All three open over the page now — there used to be a rule under
            Account, back when it was the one row that navigated, and it came out
            with the route. The rule below Preferences is a different cut: these
            two are about *you*, and Feedback is about the product. */}
        <DropdownMenuItem className="gap-2 px-2 py-1 text-xs" onClick={onAccount}>
          <UserIcon className="size-3.5" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 px-2 py-1 text-xs" onClick={onPreferences}>
          <SettingsIcon className="size-3.5" />
          Preferences
        </DropdownMenuItem>
        <div className="-mx-1 my-1 h-px bg-border" />
        <DropdownMenuItem className="gap-2 px-2 py-1 text-xs" onClick={onFeedback}>
          <MessageSquareIcon className="size-3.5" />
          Feedback
        </DropdownMenuItem>
        <div className="-mx-1 my-1 h-px bg-border" />
        <DropdownMenuItem className="gap-2 px-2 py-1 text-xs text-destructive">
          <LogOutIcon className="size-3.5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // Collapsed, the trigger is a bare avatar with no label beside it, so the
  // tooltip is the only thing naming it.
  return label ? (
    <Tooltip>
      <TooltipTrigger render={menu} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  ) : (
    menu
  )
}

/**
 * The whole thing in one tag: the avatar, the menu, and the two dialogs behind
 * it.
 *
 * For callers with nowhere to keep the dialog state. The shell holds its own —
 * the sidebar is mounted twice and two copies of a preferences dialog with
 * separate state would diverge the moment one was used — but the picker is a
 * single server-rendered page with no client owner above it, and giving it one
 * just to hold two booleans would be a shell by another name.
 *
 * So the state is local here, and the preferences are seeded from the server
 * rather than read from `document.cookie`: the dialog's switches have to be
 * right on the frame it opens, not a beat later.
 */
export function AccountButton({
  className,
  initialPreferences = DEFAULT_PREFERENCES,
  side = "bottom",
}: {
  readonly className?: string
  readonly initialPreferences?: Preferences
  readonly side?: "bottom" | "right" | "top"
}) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [accountOpen, setAccountOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  return (
    <>
      <AccountMenu
        align="end"
        onAccount={() => setAccountOpen(true)}
        onFeedback={() => setFeedbackOpen(true)}
        onPreferences={() => setPreferencesOpen(true)}
        side={side}
      >
        <button
          aria-label="Account"
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-full bg-fill-strong text-[10px] font-medium text-foreground transition-colors hover:bg-fill",
            className,
          )}
          type="button"
        >
          {ACCOUNT.initials}
        </button>
      </AccountMenu>

      <AccountDialog onOpenChange={setAccountOpen} open={accountOpen} />
      <FeedbackDialog onOpenChange={setFeedbackOpen} open={feedbackOpen} />
      <PreferencesDialog
        onChange={(next) => {
          setPreferences(next)
          // Written here rather than by a parent, since there is no parent. The
          // same cookie the shell writes, so a change made from the picker is
          // already in force by the time a workspace is opened.
          // biome-ignore lint/suspicious/noDocumentCookie: cookieStore lacks the support this needs.
          document.cookie = serialisePreferences(next)
        }}
        onOpenChange={setPreferencesOpen}
        open={preferencesOpen}
        preferences={preferences}
      />
    </>
  )
}
