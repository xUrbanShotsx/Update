"use client"
// The feedback modal, behind the account menu's "Feedback" item.

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export function FeedbackDialog({
  open,
  onOpenChange,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}) {
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const close = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    // Reset on the way out rather than on the way in, so the closing frame
    // doesn't flash an empty box over the message that was just sent.
    if (!nextOpen) {
      setMessage("")
      setSent(false)
    }
  }

  return (
    <Dialog onOpenChange={close} open={open}>
      <DialogContent className="gap-0 p-0" size="sm">
        <DialogTitle className="border-b border-border px-4 py-3 text-sm font-medium">
          Send feedback
        </DialogTitle>

        {sent ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Thanks — that&apos;s been noted.
          </p>
        ) : (
          <>
            <textarea
              autoFocus
              className="thin-scrollbar h-40 w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What's working, what isn't?"
              value={message}
            />
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Goes to the team with your account and page.
              </p>
              <Button
                disabled={!message.trim()}
                onClick={() => setSent(true)}
                size="sm"
                type="button"
              >
                Send
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
