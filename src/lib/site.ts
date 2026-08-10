/**
 * The app's own identity, in one place. `version` comes from the environment so
 * a build can stamp itself; the fallback is what package.json says today, which
 * is right for local runs and wrong nowhere that matters.
 */
const name = "Briesa"

export const site = {
  name,
  /** What the whole product is called, where no single app is in view — the
   *  workspace picker, and the suffix on every tab outside a workspace. */
  product: `${name} IMS`,
  version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
} as const
