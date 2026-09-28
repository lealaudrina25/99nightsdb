import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { NAV_ITEMS } from '@/config/navigation'
import { getAllContent } from '@/lib/content'

/**
 * Right-hand "Wiki Navigation" rail from the reference site.
 * Groups come from src/config/navigation.ts, children come from real MDX files,
 * so nothing here ever points at a page that does not exist.
 */
export async function SidebarNav() {
  const locale = await getLocale()
  const t = await getTranslations('nav')
  const tSidebar = await getTranslations('sidebar')
  const links = tSidebar.raw('links') as {
    label: string
    href: string
    external?: boolean
  }[]

  const groups = NAV_ITEMS.filter((item) => item.isContentType).map((item) => ({
    key: item.key,
    path: item.path,
    icon: item.icon,
    label: t(item.key),
    children: getAllContent(item.path.replace(/^\//, ''), locale)
  }))

  return (
    <aside className="hidden w-[248px] shrink-0 lg:block xl:w-[264px]">
      <div className="no-scrollbar sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pb-10 pt-4 sm:pt-6">
        <nav className="space-y-4 text-[13px]" aria-label="Sidebar navigation">
          <div className="rounded-xl border border-border/40 bg-card/35 px-3 py-3">
            <h3 className="mb-1 text-[10px] font-semibold tracking-[0.2em] text-primary/60 uppercase">
              {tSidebar('title')}
            </h3>
            <div className="space-y-1.5">
              {groups.map((group) => {
                const GroupIcon = group.icon
                return (
                  <details key={group.key} className="group rounded-lg">
                    <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 transition-colors marker:hidden text-muted-foreground hover:bg-white/4 hover:text-foreground [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary">
                        <GroupIcon className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                        {group.label}
                      </span>
                      {group.children.length > 0 && (
                        <span className="rounded-full bg-white/6 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/80">
                          {group.children.length}
                        </span>
                      )}
                    </summary>
                    <ul className="mt-1 ml-5 space-y-0.5 border-l border-border/50 pl-4">
                      <li>
                        <Link
                          href={group.path}
                          className="flex min-h-8 items-center gap-2 rounded-md px-2 py-1 text-[12px] font-medium leading-[1.25rem] transition-colors text-muted-foreground hover:bg-white/4 hover:text-foreground"
                        >
                          <span className="min-w-0 flex-1 truncate">{group.label}</span>
                        </Link>
                      </li>
                      {group.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={child.href}
                            className="flex min-h-8 items-center gap-2 rounded-md px-2 py-1 text-[12px] leading-[1.25rem] transition-colors text-muted-foreground/72 hover:bg-white/4 hover:text-foreground"
                          >
                            <span className="min-w-0 flex-1 truncate">{child.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/35 px-3 py-3">
            <h3 className="mb-1 text-[10px] font-semibold tracking-[0.2em] text-primary/60 uppercase">
              {tSidebar('communityTitle')}
            </h3>
            <div className="space-y-0.5">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-8 items-center gap-2 rounded-md px-2 py-1 text-[12px] leading-[1.25rem] transition-colors text-muted-foreground hover:bg-white/4 hover:text-foreground"
                >
                  <span className="min-w-0 flex-1 truncate">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}
