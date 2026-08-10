"use client"
// The secondary (right) sidebar — Briesa Agent, beside whatever you are
// looking at rather than on top of it. That placement is the design: you ask a
// question about the page without leaving the page, and the answer sits next to
// the thing it is about.
//
// The composition is v0's: a centred empty state over short pill starters, a
// composer that is a raised card rather than a bare input, and one round send
// button in its corner. The palette and the radii are this app's — `bg-sidebar`
// under it, `bg-card` and `border` for the composer, the same `rounded-2xl` the
// page card uses. Borrowing the shapes without the tokens is how a panel ends up
// looking like something embedded from another product.

import {
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  // lucide's `history` glyph — a clock with the counter-clockwise arrow — under
  // the name it was given in v1. There is no `History` export any more.
  RotateCcwClockIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BrandLogo } from "@/components/shared/brand-logo"
import { useCurrentOrg } from "@/layouts/app-shell"
import { agentScope, agentScopeOptions, type AgentMessage } from "@/lib/agent"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

/** The primary sidebar's chrome button, to the letter — the two panels bracket
 *  the card and their head rows have to read as a pair. */
const chromeButtonClass = "size-7 shrink-0 text-muted-foreground/55"

/**
 * A conversation you have moved on from. Kept in memory for the life of the
 * panel and no longer: starting a new chat should not silently discard the one
 * you were in, but nothing here is worth a storage decision — these are
 * questions, not records, and the app's own rule is that anything persisted goes
 * in a cookie the server can read on the first paint. A transcript is neither
 * small enough for that nor needed before the panel is opened.
 */
type Conversation = { id: string; messages: AgentMessage[] }

/** What a past conversation is called: the question that started it. Nobody
 *  titles these, and the first thing you asked is what you will recognise. */
const conversationTitle = (conversation: Conversation) =>
  conversation.messages.find((message) => message.role === "user")?.content ??
  "Empty conversation"

/**
 * The user's turn is a bubble, the assistant's is bare text across the panel.
 * Only one side needs a container: an answer *is* the content of the panel, and
 * boxing both would turn the column into a transcript of a chat rather than a
 * reply to a question. The one squared corner points the bubble back at the
 * composer it was typed in.
 *
 * Nothing produces an assistant turn while there is no service behind the panel.
 * The branch stays because the transcript is the shape a backend would fill, and
 * deleting the half that renders its output would mean writing it again.
 */
function Turn({ message }: { readonly message: AgentMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-fill-strong px-3 py-2 text-sm break-words whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    )
  }
  return (
    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
      {message.content}
    </p>
  )
}

export function SecondarySidebar({
  onClose,
  open = true,
}: {
  readonly onClose: () => void
  /** The shell animates this panel's width to zero rather than unmounting it, so
   *  "closed" has to be passed in — it is what stops the composer being focused
   *  by a panel nobody can see. */
  readonly open?: boolean
}) {
  const pathname = usePathname()
  // `null` means follow the page. Pinning is the exception rather than the mode:
  // most of the time the thing you want to ask about is the thing you are
  // looking at, and having to set that every time you navigate would be the
  // panel asking you to repeat yourself.
  const [pinned, setPinned] = useState<string | null>(null)
  const scopePath = pinned ?? pathname
  // The workspace comes from the host, so a pinned scope is always a place
  // inside this company — which is the point: pinning narrows *where* the
  // assistant is looking, and it cannot narrow to somebody else's records.
  const org = useCurrentOrg()
  const scope = agentScope(scopePath, org)
  const options = agentScopeOptions(pathname, org)

  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [past, setPast] = useState<Conversation[]>([])
  const [draft, setDraft] = useState("")
  /** One string, because there is now one thing that can go wrong. The kinds it
   *  used to carry — auth, rate limit, refusal — all belonged to the service. */
  const [notice, setNotice] = useState<string | null>(null)
  /**
   * Which question the shelf is showing the answer to, as an index into
   * `messages`, or `null` to follow the latest.
   *
   * `null` rather than eagerly storing the last index, for the same reason the
   * scope picker holds `null` for "follow the page": the common case is the
   * question you just asked, and a stored index would have to be corrected on
   * every send. Only picking an older one out of the list makes it explicit.
   *
   * Cleared on send, on new, and on restore — in all three the list you were
   * choosing from has been replaced, and an index into the old one would land
   * on an unrelated turn.
   */
  const [selected, setSelected] = useState<number | null>(null)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  /** A counter, not a random id — the panel is client-only so `randomUUID` would
   *  work, but a counter is deterministic and these never leave the session. */
  const nextId = useRef(1)

  // Before paint, not after: a new turn appended post-paint shows one frame of
  // the view sitting a line behind it.
  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const scrollToEnd = () => bottomRef.current?.scrollIntoView({ block: "end" })

  /**
   * Takes the question, keeps it, and says plainly that nothing is listening.
   *
   * The service this called has been removed, so there is no request to make and
   * no answer to stream. What it does *not* do is pretend: no canned reply, no
   * spinner that resolves into filler. The turn goes into the transcript exactly
   * as typed — so the scope picker, the history, the composer and the empty
   * state are all still live and still worth iterating on — and the panel states
   * the one true thing about its situation.
   *
   * Wiring a backend back up means replacing this body and nothing else: the
   * transcript shape it appends to is what a streamed answer would append to.
   */
  function send(text: string) {
    const question = text.trim()
    if (!question) return

    setMessages((current) => [...current, { role: "user", content: question }])
    setSelected(null)
    setDraft("")
    setNotice(`No ${site.name} Agent is connected yet, so this hasn't been answered.`)
    if (inputRef.current) inputRef.current.style.height = "auto"
    requestAnimationFrame(scrollToEnd)
  }

  /** Files the conversation on screen, if there is one, and hands back the rest.
   *  Both buttons below do this first — starting a new chat and opening an old
   *  one are the same move as far as the current one is concerned. */
  const archive = (list: Conversation[]) =>
    messages.length > 0 ? [{ id: String(nextId.current++), messages }, ...list] : list

  const startNew = () => {
    setPast(archive)
    setMessages([])
    setSelected(null)
    setNotice(null)
    inputRef.current?.focus()
  }

  const restore = (conversation: Conversation) => {
    // Filed first, then the one being opened is lifted out — so the list is
    // always the conversations you are *not* in, and reopening the same one
    // twice can't leave two copies of it behind.
    setPast((list) => archive(list).filter((item) => item.id !== conversation.id))
    setMessages(conversation.messages)
    setSelected(null)
    setNotice(null)
    inputRef.current?.focus()
  }

  /**
   * The question the shelf's left column is answering, and the answer to it.
   *
   * Turns are a flat append-only list, so a question's answer is simply the turn
   * after it — no pairing to store, and nothing to keep in step when a
   * conversation is archived and restored.
   *
   * The stored index is validated rather than trusted: `restore` can hand back a
   * shorter list than the one an index was taken from, and a stale index would
   * otherwise select a turn nobody clicked. Anything that no longer points at a
   * question falls back to the most recent one.
   */
  const lastUserIndex = messages.reduce(
    (last, message, index) => (message.role === "user" ? index : last),
    -1,
  )
  const askedIndex =
    selected !== null && messages[selected]?.role === "user" ? selected : lastUserIndex
  const replied = messages[askedIndex + 1]
  const answer = replied?.role === "assistant" ? replied : undefined

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      {/* The page header's height, so the two line up across the card — and the
          primary sidebar's head shape: what you are looking at on the left, one
          hairline, the buttons that act on it. */}
      <div className="flex h-11 shrink-0 items-center gap-2 px-3">
        {/* The mark on a phone, the sparkle above it.

            With the agent open, the app bar is gone and this row is the top of
            the window — so it takes the bar's job as well as its own, and the
            brand belongs at the top of a screen. From `md` up the bar or the
            panel's own brand row is still on show, and a second mark here would
            be the same thing twice; the sparkle goes back to saying what kind of
            panel this is rather than whose. */}
        <BrandLogo className="size-5 shrink-0 md:hidden" />
        <SparklesIcon className="hidden size-3.5 shrink-0 text-muted-foreground/70 md:block" />
        <p className="shrink-0 text-sm font-medium">{site.name} Agent</p>
        <span aria-hidden className="h-4 w-px shrink-0 bg-border" />

        {/* What the assistant has been told it is looking at — and the control
            that changes it. Shown rather than described: the scope is the only
            thing separating this from a chat window, and unshown it may as well
            not exist. Making it the picker as well means the one element that
            answers "what does it know about?" is also the one that answers "and
            what if I meant a different site?".

            A single chevron, like the account menu's and unlike the org
            switcher's double: it points at where the menu comes out, and turns
            over to point back at the trigger once the menu is out and the
            trigger is the way to dismiss it. */}
        <DropdownMenu>
          {/* No `flex-1` — the hover fill hugs the name rather than running the
              width of the panel, the same way the account switcher at the foot
              of the primary sidebar hugs its own. A fill that stretches to the
              far edge reads as a bar you can click anywhere on, when the target
              is the two words in it. `min-w-0` still matters: it is what lets a
              long scope truncate instead of shoving the buttons off. */}
          <DropdownMenuTrigger className="group flex h-7 min-w-0 items-center gap-1 rounded-md px-1.5 text-left text-xs text-muted-foreground/70 transition-colors hover:bg-fill hover:text-foreground">
            <span className="truncate">{scope.label}</span>
            <ChevronDownIcon className="size-3 shrink-0 transition-transform duration-200 group-data-[popup-open]:rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-56" sideOffset={4}>
            <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground">
              Ask about
            </p>
            {/* Following the page is its own row rather than an implied default,
                because it is a state you need to be able to get back to — and
                the tick is the only thing that tells you which of the two you
                are in. */}
            <DropdownMenuItem
              className="gap-2 px-2 py-1 text-xs"
              onClick={() => setPinned(null)}
            >
              <span className="min-w-0 flex-1 truncate">Whatever I&apos;m viewing</span>
              {pinned === null ? <CheckIcon className="size-3.5 shrink-0" /> : null}
            </DropdownMenuItem>
            <div className="-mx-1 my-1 h-px bg-border" />
            {options.map((option) => (
              <DropdownMenuItem
                className="gap-2 px-2 py-1 text-xs"
                key={option.path}
                onClick={() => setPinned(option.path)}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {option.detail}
                </span>
                {/* No blank placeholder on the unticked rows, unlike the org
                    switcher's menu. There the right-hand element is a plan tag
                    and reserving the tick's width keeps a tidy column; here it
                    is a region name, so every row's right edge is ragged
                    already — a permanent 14px gutter would only pull all seven
                    details in to accommodate a tick on one of them. Only the
                    row that has something to show makes room for it. */}
                {pinned === option.path ? (
                  <CheckIcon className="size-3.5 shrink-0" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Pinned to the far edge now that the trigger no longer stretches to
            it, and their own flex context so they read as a pair rather than as
            two more items in the row — the primary sidebar's footer treatment. */}
        <div className="ml-auto flex items-center">
          {/* History and new, where the bin used to be. Clearing a conversation
              was the only way to start another one, which made throwing the last
              one away a precondition for asking the next question. These two
              split that: one files it, the other fetches it back.

              Both stay mounted rather than appearing with the first message —
              buttons that come and go move the ones beside them, and the close
              button should not shift under the pointer. New is disabled on an
              empty conversation, since there is nothing to start away from. */}
          <DropdownMenu>
            {/* Rendered as a `Button`, not a styled trigger. Hand-matching the
                classes gets the 28px box right and still lands a different
                radius, a different hover tint and no focus ring — three ways for
                the trio to look like two things. `render` hands the trigger's
                behaviour to the same component the other two already are. */}
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label="Past conversations"
                  className={chromeButtonClass}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <RotateCcwClockIcon className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="min-w-56" sideOffset={4}>
              <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground">
                This session
              </p>
              {past.length === 0 ? (
                // Says what the list is rather than that it is empty: the panel
                // keeps these for as long as it is open and no longer, and
                // finding that out by losing one would be the wrong way round.
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  Conversations you start are kept here until you reload.
                </p>
              ) : (
                past.map((conversation) => (
                  <DropdownMenuItem
                    className="gap-2 px-2 py-1 text-xs"
                    key={conversation.id}
                    onClick={() => restore(conversation)}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {conversationTitle(conversation)}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {conversation.messages.length}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="New conversation"
            className={chromeButtonClass}
            disabled={messages.length === 0}
            onClick={startNew}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <PlusIcon className="size-3.5" />
          </Button>

          <Button
            aria-label={`Close ${site.name} Agent`}
            className={chromeButtonClass}
            onClick={onClose}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* The two halves below the head, and the axis they sit on.
          
          Stacked, then split, then stacked again — and the middle one is the
          exception rather than the rule.

          At `lg` the panel is a tall strip: the conversation fills it and the
          composer is pinned under it, which is the shape every chat has. Below
          `md` it is a shelf but a narrow one, and two columns of a phone's width
          are two columns of nothing — so it goes back to the same stack, which
          reads fine because there is height to give it. Only in between, where
          the shelf is 45dvh tall and as wide as a tablet, is stacking wrong: the
          transcript would be three lines high with the composer eating the rest,
          so the two go side by side — what the assistant said on the left, what
          you are asking on the right.
          
          The composer is last in the DOM either way — its reading order in the
          column and its tab order in both — so the row needs no reversing, and
          the two orientations are one markup with one axis swapped. */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row lg:flex-col">
        <div className="thin-scrollbar flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-3">
          {messages.length === 0 ? (
            // Centred in the space above the composer, so an unused panel reads as
            // an invitation rather than as a page that failed to load. The chips
            // are two or three words each — they are read at a glance and send a
            // full question, which is why the label and the prompt are separate.
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="grid size-9 place-items-center rounded-full bg-fill">
                <SparklesIcon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-tight">How can I help?</p>
                <p className="mt-1 text-xs leading-relaxed text-balance text-muted-foreground">
                  WHS law, the ISO standards, or where something lives in Briesa. I
                  can&apos;t see your records — only which page you&apos;re on.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {scope.suggestions.map((suggestion) => (
                  <button
                    className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-fill hover:text-foreground"
                    key={suggestion.label}
                    onClick={() => send(suggestion.prompt)}
                    type="button"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* In the split band this column answers *one* question —
                  whichever is selected in the list beside it — rather than
                  replaying the thread. A 45dvh letterbox cannot hold a
                  conversation, and scrolling one in it is worse than reading a
                  single answer. On a phone the panel is stacked again and the
                  thread below takes over. */}
              <div className="hidden flex-col gap-3 py-2 md:flex lg:hidden">
                {answer ? (
                  <>
                    {/* Set apart rather than styled down: the reasoning is a
                        different kind of thing from the answer, not a quieter
                        version of it, and a dashed rule says "workings" where
                        grey text would only say "less important". */}
                    {answer.thinking ? (
                      <div className="rounded-lg border border-dashed px-3 py-2">
                        <p className="text-[10px] font-medium tracking-wide text-muted-foreground/70 uppercase">
                          Thinking
                        </p>
                        <p className="mt-1 text-xs leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">
                          {answer.thinking}
                        </p>
                      </div>
                    ) : null}
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
                      {answer.content}
                    </p>
                  </>
                ) : (
                  // The same true thing the notice says, in the place you looked
                  // for the answer. A blank column would read as a panel that
                  // failed rather than one nothing is listening to.
                  <p className="py-8 text-center text-xs text-balance text-muted-foreground">
                    Nothing has answered this yet — no {site.name} Agent is connected.
                  </p>
                )}
              </div>

              {/* The thread itself, wherever the panel is stacked — a phone and
                  a desktop column, both of which read down. Index as key: turns are append-only and never reordered,
                  and the last one is rewritten on every token — a
                  content-derived key would remount it on every delta. */}
              <div className="flex flex-col gap-4 py-2 md:hidden lg:flex">
                {messages.map((message, index) => (
                  <Turn key={index} message={message} />
                ))}
              </div>
            </>
          )}

          {/* Amber rather than destructive: nothing has failed. The panel is
            working exactly as built and is short a backend, which is a state to
            be told about once, not an error to be alarmed by. */}
          {notice ? (
            <div className="mb-2 rounded-lg border border-amber-600/40 px-3 py-2 text-xs text-amber-600 dark:border-amber-400/40 dark:text-amber-400">
              {notice}
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>

        {/* The composer is a raised card, not a trough — it is the one thing on
          this panel you act *with*, so it sits above the surface rather than
          cut into it. `rounded-2xl` and `bg-card` are the page card's own, which
          is what keeps a v0-shaped box speaking this app's language.

          In the split band it is a column of its own: capped at 22rem so it
          cannot take more than a composer needs, and at half the panel so it
          cannot crowd the answer. `justify-end` keeps the card at the
          bottom of that column, which is where it sits in the tall layout too —
          the composer should not move up the panel just because the panel got
          short. The hairline is on its left, the edge that faces the answer; at
          `lg` the two are stacked and the composer's own raised card is the only
          separation the seam needs. */}
        <div className="flex shrink-0 flex-col justify-end p-2 md:w-[min(50%,22rem)] md:border-l lg:w-auto lg:border-l-0">
          {/* Your side of the conversation, as a list you pick from. Only in the
              split band: everywhere else these already sit in the thread beside
              their answers, and a second copy would be the same content twice on
              one screen.

              The rows are what make the left column mean anything — it shows one
              answer, and this is how you say which. Newest last, so the list
              reads in the order it happened and the live one is nearest the
              composer. */}
          {messages.length > 0 ? (
            <div className="thin-scrollbar mb-2 hidden min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto md:flex lg:hidden">
              {messages.map((message, index) =>
                message.role === "user" ? (
                  <button
                    aria-current={index === askedIndex ? "true" : undefined}
                    className={cn(
                      "shrink-0 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                      index === askedIndex
                        ? "bg-fill-strong text-foreground"
                        : "text-muted-foreground hover:bg-fill hover:text-foreground",
                    )}
                    key={index}
                    onClick={() => setSelected(index)}
                    type="button"
                  >
                    {/* Two lines, not one: a question clipped mid-clause is one
                        you have to open to recognise, which is the opposite of
                        what a list of them is for. */}
                    <span className="line-clamp-2 break-words">{message.content}</span>
                  </button>
                ) : null,
              )}
            </div>
          ) : null}

          <div className="shrink-0 rounded-2xl border bg-card shadow-sm transition-colors focus-within:border-foreground/20">
            <textarea
              className="thin-scrollbar max-h-40 w-full resize-none bg-transparent px-3 pt-2.5 pb-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              onChange={(event) => {
                setDraft(event.target.value)
                // Grows with the text. Reset to `auto` first so the box can shrink
                // again when a line is deleted — `scrollHeight` never falls on its
                // own once the element has been made taller.
                const el = event.target
                el.style.height = "auto"
                el.style.height = `${Math.min(el.scrollHeight, 160)}px`
              }}
              onKeyDown={(event) => {
                // Enter sends, Shift+Enter breaks the line: the common case here
                // is a one-line question.
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  send(draft)
                }
              }}
              // Trailing ellipsis, and the single character rather than three
              // periods — the same typography the rest of the app uses for its
              // dashes and middots. It reads as a sentence you are meant to
              // finish, where the bare "Ask about Melbourne Depot" reads as a
              // label for the box.
              placeholder={`Ask about ${scope.label}…`}
              ref={inputRef}
              rows={1}
              value={draft}
            />
            <div className="flex items-center gap-2 px-2 pb-2">
              <p className="min-w-0 flex-1 truncate pl-1 text-[10px] text-muted-foreground/60">
                Claude can be wrong — check anything that matters
              </p>
              {/* Send only. It used to double as a stop button while an answer
                streamed; with no request to make there is nothing to stop, and a
                mode that can never be entered is a mode to delete rather than
                keep warm. Round, where every other button in the app is a
                rounded rectangle: it is the panel's single primary action, and
                the one place worth spending a shape on. */}
              <Button
                aria-label="Send"
                className="size-7 shrink-0 rounded-full"
                disabled={!draft.trim()}
                onClick={() => send(draft)}
                size="icon-sm"
                type="button"
              >
                <ArrowUpIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
