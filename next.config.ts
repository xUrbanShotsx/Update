import type { NextConfig } from "next"

/**
 * The hostname part of `NEXT_PUBLIC_ROOT_HOST`, with any scheme and port taken
 * off — `allowedDevOrigins` matches hosts, and an entry carrying either is an
 * entry that silently never matches.
 */
const rootHost = (process.env.NEXT_PUBLIC_ROOT_HOST ?? "localhost:3000")
  .replace(/^https?:\/\//, "")
  .replace(/:\d+$/, "")

const nextConfig: NextConfig = {
  /**
   * Hosts allowed to pull dev resources — HMR, the RSC payloads — from `next
   * dev`. Next blocks anything but localhost by default, which is right: a dev
   * server is unauthenticated and a page on another origin should not be able to
   * read your source through it.
   *
   * **Every workspace is a subdomain, so this has to be a wildcard.** It was a
   * bare LAN address, which allowed the machine itself and blocked every
   * workspace served from it — the page loaded and then sat there with HMR
   * refused, because `company-1.<host>` is a different origin from `<host>`.
   *
   * Derived from the same variable the app routes by, rather than written out.
   * A hardcoded address is a DHCP lease with a comment attached: it goes stale
   * on the next network change, and the failure it produces then is a blocked
   * request that names a host nobody has edited in months.
   *
   * `localhost` stays alongside it so the default flow keeps working when the
   * variable is set to something else for an afternoon of device testing.
   *
   * Dev only — `next build` and `next start` ignore it entirely.
   */
  allowedDevOrigins: [...new Set(["localhost", rootHost])].flatMap((host) => [
    host,
    `*.${host}`,
  ]),
}

export default nextConfig
