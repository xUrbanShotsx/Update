import { PageHeader } from "@/components/shared/page-header"
import { PageScroll } from "@/components/shared/page-scroll"

/**
 * The honest stand-in for a section nobody has built yet. It exists so the nav
 * never points at a 404: the route, the scope and the sidebar are all real, and
 * only the content is missing — which is what the panel says.
 */
export function SectionPlaceholder({
  scope,
  title,
}: {
  /** Whose section this is — the org's name, or the site's. */
  readonly scope: string
  readonly title: string
}) {
  return (
    <>
      <PageHeader title={title} subtitle={scope} />

      <PageScroll>
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{scope}</p>

          <div className="mt-8 rounded-xl border border-dashed bg-card/40 px-6 py-16 text-center">
            <p className="text-sm font-medium">Nothing here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {title} for {scope} hasn&apos;t been built out. The route, the nav and the
              scope all work — this is where the content goes.
            </p>
          </div>
        </div>
      </PageScroll>
    </>
  )
}
