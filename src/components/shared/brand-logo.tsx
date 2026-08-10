import { cn } from "@/lib/utils"

/**
 * The rounded app-icon mark. Theme-aware, following the design system's
 * dark-serves-light convention: the dark tile shows on the light canvas, the
 * light tile on the dark one, so the tile always contrasts its background. The
 * PNGs are vendored into public/logos from the design system's brand assets.
 * A wrapper span carries the sizing and any hover class, so callers can hide
 * the whole mark without fighting the per-image `dark:` variants.
 */
export function BrandLogo({ className }: { readonly className?: string }) {
  return (
    <span className={cn("block shrink-0", className)}>
      {/* Plain `img`, not `next/image`: these are fixed at 20px in a panel that
          is server-rendered on every route, so there is no layout shift to
          reserve against and nothing to optimise — the loader would only add a
          request and a wrapper. */}
      <img
        alt=""
        aria-hidden
        className="size-full dark:hidden"
        src="/logos/icon-dark-512-rounded.png"
      />
      <img
        alt=""
        aria-hidden
        className="hidden size-full dark:block"
        src="/logos/icon-light-512-rounded.png"
      />
    </span>
  )
}
