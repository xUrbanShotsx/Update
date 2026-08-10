import { LoaderCircleIcon } from "lucide-react"

/**
 * The whole shell, while the browser leaves for another workspace.
 *
 * **Only that crossing.** It covered app switches too for a while, and that was
 * the wrong call: an app switch is same-origin, so the router swaps the nav and
 * the page in a frame or two and the cover was a full-screen spinner over a wait
 * that had already finished — it made the move people make all day feel like the
 * heaviest thing in the product. A workspace is a different origin and therefore
 * a fresh document, which is a real wait and the one worth narrating.
 *
 * Over everything rather than over the page card, because everything is what
 * goes: the nav, the chrome and the screen belong to the workspace being left.
 * Covering only the page would leave one company's sidebar standing over another
 * company's loader.
 *
 * `bg-sidebar` is the shell's own ground — the surface the card floats on — so
 * the loader reads as the app between two states rather than as a blank
 * document.
 *
 * It names where you are going. A bare spinner over an emptied window is hard
 * to tell from a crash, and the one thing worth saying during this particular
 * wait is which company you asked for.
 */
export function ShellLoader({ label }: { readonly label?: string }) {
  return (
    <div
      aria-busy
      aria-live="polite"
      className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-3 bg-sidebar"
    >
      <LoaderCircleIcon
        aria-hidden
        className="size-5 animate-spin text-muted-foreground/50"
      />
      {label ? (
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      ) : null}
      <span className="sr-only">Loading{label ? ` ${label}` : ""}</span>
    </div>
  )
}
