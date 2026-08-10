import type { MetadataRoute } from "next"

/**
 * The web app manifest, which is what makes "Add to Home Screen" produce an app
 * rather than a bookmark.
 *
 * `display: "standalone"` is the point of it here: launched that way there is no
 * Safari toolbar along the bottom, so the shell reaches the physical edge of the
 * screen and the only thing over it is the home indicator — which the layout
 * already keeps clear of with `env(safe-area-inset-bottom)`. Inside a Safari tab
 * that strip is the browser's own chrome; `theme-color` can tint it and nothing
 * can draw beneath it.
 *
 * `background_color` is the splash screen while the app boots, so it matches
 * `--sidebar` rather than the card — the first thing painted should be the same
 * ground everything else sits on.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Briesa IMS",
    short_name: "Briesa",
    description:
      "Safety, compliance and operations for contractors running work across multiple sites.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#fafafa",
    icons: [
      {
        src: "/logos/icon-dark-512-rounded.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logos/apple-touch-icon-180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
