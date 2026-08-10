// Root layout — fonts, theme, and nothing else. The nav shell used to live here,
// which made it something every route was inside whether it wanted to be or not.
// It has moved down into the `(shell)` group, so a route can now opt out by
// sitting outside that group rather than by fighting a layout above it.
import type { Metadata, Viewport } from "next"
import { Geist_Mono, Outfit } from "next/font/google"

import { ThemeProvider } from "@/components/shared/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { site } from "@/lib/site"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const description =
  "Safety, compliance and operations for contractors running work across multiple sites."

export const metadata: Metadata = {
  // Relative URLs in `openGraph` are resolved against this, and Next warns
  // without it. From the environment rather than hardcoded, the same way
  // `site.ts` reads the version — the localhost fallback is right for local
  // runs and wrong nowhere that matters, since a build that cares sets it.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  // Two parts and no more: the page, then the product. The org used to sit
  // between them, which read well on one tab and pushed the product name past
  // the truncation on a row of them.
  title: {
    default: site.product,
    template: `%s · ${site.product}`,
  },
  description,
  applicationName: "Briesa IMS",
  // The icons below are the *linked* ones, and they are theme-aware the same way
  // `BrandLogo` is: the dark tile on a light tab strip, the light tile on a dark
  // one. `favicon.ico` stays as a file beside this one — it is what a browser
  // hits at /favicon.ico without reading any markup, and what a bookmark keeps.
  icons: {
    icon: [
      { url: "/logos/icon-dark-512-rounded.png", media: "(prefers-color-scheme: light)" },
      { url: "/logos/icon-light-512-rounded.png", media: "(prefers-color-scheme: dark)" },
    ],
    // Always the dark tile: iOS puts it on a home screen against a wallpaper,
    // not against a tab strip, so there is no light or dark chrome to match.
    apple: "/logos/apple-touch-icon-180.png",
  },
  openGraph: {
    type: "website",
    siteName: "Briesa IMS",
    title: "Briesa IMS",
    description,
    locale: "en_AU",
    // No image. The brand assets are 512px squares, and a square in a 1.91:1
    // card is letterboxed or cropped through the mark — worse than the plain
    // text card a crawler falls back to.
  },
  // It is a workspace behind a login rather than a page anyone should find in a
  // search result, and the crawler should be told so by the app rather than by a
  // header someone remembers to set.
  robots: { index: false, follow: false },
  // Added to the Home Screen there is no Safari furniture at all — no bottom
  // toolbar, no address bar — and the app owns the whole screen down to the home
  // indicator, which `viewport-fit: cover` and the shell's safe-area padding
  // already handle. That is the only way the page genuinely runs to the bottom
  // edge; in a Safari tab the strip down there belongs to the browser.
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Briesa" },
}

// Pins the scale so iOS doesn't auto-zoom into sub-16px inputs on focus.
// Pinch-zoom stays available — iOS always honours it for accessibility.
//
// `viewportFit: "cover"` lets the document run under iOS's own furniture —
// the home indicator, and the strip a collapsed toolbar leaves behind. Without
// it Safari insets the page and paints what is left over from the root, which is
// where the black bar at the bottom came from. The shell adds
// `env(safe-area-inset-bottom)` back as padding, so what extends under the
// indicator is the background and never a control.
//
// `themeColor` is `--sidebar`, not `--background` — #fafafa and #191919. The
// browser's own bars sit against the shell's ground, not against the page card
// floating inside it, so matching the card left a seam exactly where the two
// meet.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#191919" },
    // A media-less fallback, last so it only wins where the two above lose.
    // Some Safari builds honour only the first `theme-color` and ignore the
    // media attribute entirely; without this they fall through to the browser's
    // own default, which in dark is the near-black bar this is trying to fix.
    { color: "#fafafa" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
