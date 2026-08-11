"use client"
import { type ReactNode, useState } from "react"

export function DetailModal({
  trigger,
  title,
  subtitle,
  children,
}: {
  readonly trigger: ReactNode
  readonly title: string
  readonly subtitle?: string
  readonly children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {trigger}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl"
            style={{ maxHeight: "min(90vh, 820px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold leading-snug">{title}</h2>
                {subtitle && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
              <button
                aria-label="Close"
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 16 16"
                >
                  <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {/* Scrollable body */}
            <div
              className="overflow-y-auto px-6 py-5"
              style={{ maxHeight: "calc(min(90vh, 820px) - 72px)" }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Reusable section within a detail modal */
export function DetailSection({
  label,
  children,
}: {
  readonly label: string
  readonly children: ReactNode
}) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

/** Key-value grid row */
export function DetailRow({
  label,
  value,
  tone,
}: {
  readonly label: string
  readonly value: ReactNode
  readonly tone?: string
}) {
  return (
    <div className="flex min-h-[32px] items-start gap-3 border-b py-2 last:border-0">
      <span className="w-40 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className={`flex-1 text-xs font-medium ${tone ?? ""}`}>{value}</span>
    </div>
  )
}
