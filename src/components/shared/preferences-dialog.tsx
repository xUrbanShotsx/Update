"use client"
// Preferences, behind the account menu's "Preferences" item. A modal rather than
// a page: nothing in here is about the org you are standing in, and none of it
// is worth losing your place over — you change a notification channel and carry
// on with the screen you were reading still behind you.

import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState, type ComponentType } from "react"

import { SettingsPanels, type SettingsPanel } from "@/components/shared/settings-panels"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  CHANNELS,
  NOTIFY_EVENTS,
  isEnabled,
  toggleChannel,
  type ChannelKey,
  type Preferences,
} from "@/lib/preferences"
import { cn } from "@/lib/utils"

const THEMES: {
  value: string
  label: string
  icon: ComponentType<{ className?: string }>
}[] = [
  { value: "system", label: "System", icon: MonitorIcon },
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
]

/**
 * The theme picker is the one control here that was already wired —
 * `next-themes` persists it, and the sidebar's sun and moon have been toggling
 * it all along. What this adds is the third option: the toggle can only flip
 * between light and dark, so once you had used it there was no way back to
 * following the system short of clearing storage.
 */
function ThemePicker() {
  const { setTheme, theme } = useTheme()
  // The stored value is only knowable in the browser. Inside a dialog that never
  // renders until it is opened this is close to moot, but the component would be
  // wrong the moment it was used anywhere else, and a correctness that depends
  // on where it is mounted is not one.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="grid grid-cols-3 gap-2">
      {THEMES.map((option) => {
        const active = mounted && theme === option.value
        return (
          <button
            aria-pressed={active}
            className={cn(
              "flex flex-col items-start gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-accent/40",
              // The chosen card, in the accent rather than in a slightly less
              // faint grey. Three cards side by side is a radio group, and
              // `border-foreground/20` against `border-border` was a difference
              // you had to look for to find which one you were on.
              active && "border-primary",
            )}
            key={option.value}
            onClick={() => setTheme(option.value)}
            type="button"
          >
            <option.icon className="size-4 text-muted-foreground" />
            <span className="flex w-full items-center gap-1.5 text-sm font-medium">
              {option.label}
              {active ? <CheckIcon className="ml-auto size-3.5 text-primary" /> : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** A cell in the notification matrix. A button rather than a checkbox input:
 *  there is no form here and nothing to submit — the change is the whole action,
 *  and it is saved by the time the tick has finished drawing. */
function ChannelCell({
  channel,
  event,
  on,
  onToggle,
}: {
  readonly channel: string
  readonly event: string
  readonly on: boolean
  readonly onToggle: () => void
}) {
  return (
    <button
      aria-label={`${channel} for ${event}`}
      aria-pressed={on}
      className={cn(
        "grid size-5 place-items-center rounded-[5px] border transition-colors",
        // Accent, not `foreground`. A checked box is the one place in this
        // dialog where colour is carrying the answer: the grid is 20-odd
        // identical squares and the only thing distinguishing the ones you
        // chose is their fill, so that fill should not also be the colour every
        // piece of text on the screen is wearing.
        on
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border hover:border-foreground/40",
      )}
      onClick={onToggle}
      type="button"
    >
      {on ? <CheckIcon className="size-3" /> : null}
    </button>
  )
}

/** Every chord listed is one the app binds today. A shortcuts panel that lists
 *  aspirations is worse than none, because it is the one screen people trust
 *  literally. */
const SHORTCUTS = [
  { keys: "⌘ K", label: "Search — opens and closes" },
  // Listed as a pair and in that order, because that is how they sit on the
  // keyboard and what they do is mirrored.
  { keys: "⌘ ,", label: "Nav panel — collapses and expands" },
  { keys: "⌘ .", label: "Agent panel — opens and closes" },
  { keys: "⌘ O", label: "Show the organisation" },
  { keys: "⌘ L", label: "Show locations" },
  { keys: "/", label: "Commands, once search is open" },
  { keys: ">", label: "Documents, once search is open" },
]

export function PreferencesDialog({
  onChange,
  open,
  onOpenChange,
  preferences,
}: {
  /** Held by the shell, not here. Two copies of this dialog are mounted — the
   *  desktop column's sidebar and the drawer's — and state kept locally would
   *  diverge the moment one of them was used. */
  readonly onChange: (next: Preferences) => void
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly preferences: Preferences
}) {
  const toggle = (event: string, channel: ChannelKey) =>
    onChange(toggleChannel(preferences, event, channel))

  const panels: SettingsPanel[] = [
    {
      key: "appearance",
      label: "Appearance",
      title: "Appearance",
      description:
        "Follow the system, or pin it. The sun and moon in the sidebar flip between light and dark; this is the only place that hands it back to the system.",
      content: <ThemePicker />,
    },
    {
      key: "notifications",
      label: "Notifications",
      title: "Notifications",
      description:
        "An incident and a weekly summary do not deserve the same channel. Pick per row.",
      // The matrix is the point. Which channel a message arrives on is the whole
      // decision on a site — an incident at 2am is an SMS and the weekly summary
      // never is — and one "notifications: on" switch is how people end up
      // turning off the lot.
      content: (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center gap-3 border-b px-3 py-2">
            <span className="min-w-0 flex-1 text-xs text-muted-foreground">
              Tell me about
            </span>
            {CHANNELS.map((channel) => (
              <span
                className="w-9 shrink-0 text-center text-xs text-muted-foreground"
                key={channel.key}
              >
                {channel.label}
              </span>
            ))}
          </div>
          {NOTIFY_EVENTS.map((event) => (
            <div
              className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0"
              key={event.key}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{event.label}</p>
                <p className="truncate text-xs text-muted-foreground">{event.hint}</p>
              </div>
              {CHANNELS.map((channel) => (
                <span className="flex w-9 shrink-0 justify-center" key={channel.key}>
                  <ChannelCell
                    channel={channel.label}
                    event={event.label}
                    on={isEnabled(preferences, event.key, channel.key)}
                    onToggle={() => toggle(event.key, channel.key)}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "keyboard",
      label: "Keyboard",
      title: "Keyboard",
      description: "Bound today, and not yet re-bindable.",
      content: (
        <dl className="rounded-xl border bg-card px-3">
          {SHORTCUTS.map((row) => (
            <div
              className="flex items-center gap-4 border-b py-2.5 last:border-b-0"
              key={row.keys}
            >
              <dt className="w-24 shrink-0">
                <kbd className="rounded-md border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {row.keys}
                </kbd>
              </dt>
              <dd className="min-w-0 flex-1 text-sm text-muted-foreground">
                {row.label}
              </dd>
            </div>
          ))}
        </dl>
      ),
    },
  ]

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {/* `md`: a rung above the feedback form and a rung below Account. It is a
          two-pane surface rather than a form, so the rail and the panel it opens
          both need room — but the panels are rows of switches, and at Account's
          width they were short controls stranded on a long line. Taller than its
          content needs, too, so switching panels doesn't resize the dialog under
          the pointer. */}
      <DialogContent className="gap-0 overflow-hidden p-0" size="md">
        <DialogTitle className="border-b border-border px-4 py-3 text-sm font-medium">
          Preferences
        </DialogTitle>
        <SettingsPanels layout="stacked" panels={panels} surface="dialog" />
      </DialogContent>
    </Dialog>
  )
}
