// The header the two workspace-less pages share.

import Link from "next/link"

import { AccountButton } from "@/components/shared/account-menu"
import { BrandLogo } from "@/components/shared/brand-logo"
import { NotificationsMenu } from "@/components/shared/notifications-menu"
import { ThemeButton } from "@/components/shared/theme-button"
import type { Preferences } from "@/lib/preferences"
import { site } from "@/lib/site"

const chromeButtonClass =
  "grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground/55 transition-colors hover:bg-fill hover:text-foreground"

/**
 * The picker and the account page, which are the only two screens that belong to
 * no workspace, and therefore the only two outside the shell.
 *
 * They share this rather than each drawing their own, because they are the same
 * chrome doing the same job: name the product, and keep the three controls that
 * are true of you regardless of which company you are in. Inside the shell those
 * three live in the sidebar's foot; here there is no sidebar, so they take the
 * top right in the order the foot row uses them.
 *
 * The mark is a link on the account page and plain text on the picker — there is
 * nowhere to go back to from the root, and a logo that navigates to the page you
 * are already on is a control that does nothing.
 */
export function RootHeader({
  home,
  preferences,
}: {
  /** Where the mark goes, when there is anywhere. */
  readonly home?: string
  readonly preferences?: Preferences
}) {
  const brand = (
    <>
      <BrandLogo className="size-5" />
      <span className="truncate text-sm font-semibold">{site.name}</span>
      <span className="shrink-0 text-2xs font-normal text-muted-foreground/70">
        v{site.version}
      </span>
    </>
  )

  return (
    <header className="flex h-11 shrink-0 items-center gap-2 px-4">
      {home ? (
        <Link
          className="flex min-w-0 items-center gap-2 rounded-md transition-opacity hover:opacity-70"
          href={home}
        >
          {brand}
        </Link>
      ) : (
        brand
      )}

      {/* No `org` on either: there is no workspace open. The bell then spans
          every workspace you belong to rather than picking one, and the account
          menu keeps all of its rows — it is the same menu here as it is in the
          panel, which is the whole point of it being one component. */}
      <div className="ml-auto flex items-center gap-1.5">
        <NotificationsMenu align="end" className={chromeButtonClass} side="bottom" />
        <ThemeButton className={chromeButtonClass} />
        <AccountButton initialPreferences={preferences} />
      </div>
    </header>
  )
}
