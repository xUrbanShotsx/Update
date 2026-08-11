"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export type FieldDef =
  | {
      name: string
      label: string
      type: "text" | "email" | "tel" | "number" | "date" | "time"
      required?: boolean
      placeholder?: string
    }
  | {
      name: string
      label: string
      type: "textarea"
      required?: boolean
      placeholder?: string
      rows?: number
    }
  | {
      name: string
      label: string
      type: "select"
      options: readonly string[]
      required?: boolean
    }
  | {
      name: string
      label: string
      type: "section"
    }

const INPUT_CLS =
  "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"

export function AddSheet({
  title,
  fields,
  submitLabel,
}: {
  readonly title: string
  readonly fields: readonly FieldDef[]
  readonly submitLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setValues({})
      setSubmitted(false)
    }, 1800)
  }

  const handleClose = () => {
    setOpen(false)
    setValues({})
    setSubmitted(false)
  }

  return (
    <>
      <button
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        onClick={() => setOpen(true)}
        type="button"
      >
        + Add {title.toLowerCase()}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            aria-hidden
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleClose}
          />

          <div
            className="relative z-10 flex w-full max-w-lg flex-col rounded-2xl bg-card shadow-2xl ring-1 ring-border"
            style={{ maxHeight: "min(85vh, 700px)" }}
          >
            <div className="flex shrink-0 items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold">Add {title}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  All required fields must be completed.
                </p>
              </div>
              <button
                aria-label="Close"
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={handleClose}
                type="button"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                  <svg
                    className="size-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 12l5 5L20 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Saved successfully</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {title} has been added to the register.
                  </p>
                </div>
              </div>
            ) : (
              <form
                className="flex flex-1 flex-col overflow-hidden"
                onSubmit={handleSubmit}
              >
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  {fields.map((field) => {
                    if (field.type === "section") {
                      return (
                        <div
                          className="border-t pt-4 first:border-t-0 first:pt-0"
                          key={field.name}
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                            {field.label}
                          </p>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-1.5" key={field.name}>
                        <label className="block text-xs font-medium">
                          {field.label}
                          {field.required && (
                            <span aria-hidden className="ml-0.5 text-red-500">
                              *
                            </span>
                          )}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            className={cn(INPUT_CLS, "resize-none")}
                            name={field.name}
                            onChange={(e) => set(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            rows={field.rows ?? 3}
                            value={values[field.name] ?? ""}
                          />
                        ) : field.type === "select" ? (
                          <select
                            className={INPUT_CLS}
                            name={field.name}
                            onChange={(e) => set(field.name, e.target.value)}
                            required={field.required}
                            value={values[field.name] ?? ""}
                          >
                            <option value="">Select…</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className={INPUT_CLS}
                            name={field.name}
                            onChange={(e) => set(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            type={field.type}
                            value={values[field.name] ?? ""}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex shrink-0 items-center justify-end gap-2 border-t px-5 py-3">
                  <button
                    className="rounded-md px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
                    onClick={handleClose}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    type="submit"
                  >
                    {submitLabel ?? `Save ${title}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
