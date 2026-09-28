import { ChevronRight, Home } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export type Crumb = {
  label: string
  href?: string
}

export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = await getTranslations('common')

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
    >
      <span className="flex items-center gap-1.5">
        <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-foreground">
          <Home className="size-3.5" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">{t('home')}</span>
        </Link>
      </span>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
