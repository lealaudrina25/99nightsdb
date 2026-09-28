import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Icon } from '@/components/icons'
import { cn } from '@/lib/utils'

export async function SiteFooter() {
  const t = await getTranslations('footer')
  const tSite = await getTranslations('site')
  const columns = t.raw('columns') as {
    title: string
    links: { label: string; href: string; external?: boolean }[]
  }[]
  const social = t.raw('social') as { label: string; href: string; icon: string }[]

  return (
    <footer className="bg-neutral-950 text-neutral-100">
      <div className="border-b border-white/8 bg-[radial-gradient(circle_at_top,hsl(var(--nav-theme)/0.18),transparent_48%),linear-gradient(135deg,hsl(var(--nav-theme)/0.05),transparent)]">
        <div className="mx-auto max-w-7xl px-6 py-4 sm:px-10 lg:px-16">
          <p className="text-center text-sm font-medium tracking-[0.16em] text-neutral-100 uppercase">
            {tSite('footerBadge')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-12 pb-6 sm:px-10 sm:pt-14 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <span className="relative inline-flex shrink-0 overflow-hidden rounded-xl ring-1 ring-white/12 shadow-[0_0_24px_hsl(var(--nav-theme)/0.16)]">
                <Image src="/logo.png" alt={tSite('shortName')} width={44} height={44} />
              </span>
              <div>
                <p className="font-serif text-2xl tracking-[0.08em] text-neutral-50">
                  {tSite('footerBrand')}
                </p>
                <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-400">
                  {tSite('footerDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-12">
            {columns.map((column) => (
              <div key={column.title} className="space-y-5">
                <h4 className="text-[13px] font-semibold tracking-[0.16em] text-neutral-100 uppercase">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="text-neutral-300 transition-colors hover:text-neutral-100"
              >
                <Icon name={item.icon} className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-5">
          <span className="text-sm text-neutral-500">{tSite('copyright')}</span>
          <span className="text-sm text-neutral-500">{tSite('footerNote')}</span>
        </div>
      </div>
    </footer>
  )
}

/** Shared wrapper so every page keeps the same bottom spacing. */
export function FooterSpacer({ className }: { className?: string }) {
  return <div className={cn('mt-32 sm:mt-40 lg:mt-48', className)} />
}
