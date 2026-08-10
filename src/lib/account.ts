/**
 * The signed-in person. Demo data like the orgs and sites beside it, but held
 * here rather than in the sidebar that used to own it: the account menu, the
 * account page and the footer row all name the same person, and three copies of
 * a name is three chances for two of them to disagree.
 *
 * No "use client": read by server pages and the client sidebar alike.
 */

export type Account = {
  name: string
  email: string
  /** Precomputed rather than derived at each call site — a two-letter fallback
   *  from a one-word name is the kind of thing every caller gets subtly
   *  differently. */
  initials: string
  role: string
  joined: string
}

export const ACCOUNT: Account = {
  name: "Briesa",
  email: "hello@briesa.dev",
  initials: "BR",
  role: "Owner",
  joined: "March 2024",
}

/** Just the first name for the sidebar's foot row. The full one is in the menu,
 *  and at the panel's 220px minimum a surname is the first thing to go. */
export const FIRST_NAME = ACCOUNT.name.split(" ")[0] ?? ACCOUNT.name

export type Session = {
  id: string
  device: string
  browser: string
  location: string
  lastActive: string
  /** The one you are reading this on. It gets no revoke control — signing
   *  yourself out from a list of sessions is what the Log out item is for, and a
   *  revoke button here would be the same action wearing a scarier word. */
  current: boolean
}

export const SESSIONS: readonly Session[] = [
  {
    id: "current",
    device: "MacBook Pro",
    browser: "Chrome 141",
    location: "Melbourne, VIC",
    lastActive: "Now",
    current: true,
  },
  {
    id: "ipad",
    device: "iPad Pro",
    browser: "Safari 26",
    location: "Melbourne, VIC",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "site-tablet",
    device: "Site tablet — Brisbane Terminal",
    browser: "Chrome 139",
    location: "Brisbane, QLD",
    lastActive: "Yesterday",
    current: false,
  },
  {
    id: "phone",
    device: "iPhone 17",
    browser: "Briesa mobile",
    location: "Geelong, VIC",
    lastActive: "3 days ago",
    current: false,
  },
]
