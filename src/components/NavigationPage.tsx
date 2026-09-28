import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { ContentEntry } from '@/lib/content'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { AdSlot } from '@/components/AdSlot'
import { JsonLd } from '@/components/JsonLd'
import { Badge } from '@/components/ui/badge'

type Props = {
  contentType: string
  entries: ContentEntry[]
  /** resolved href of this list page, used for canonical + JSON-LD */
  pathname: string
  siteUrl: string
  title: string
  description: string
  lead: string
  highlights: string[]
  gridTitle: string
  breadcrumbs: Crumb[]
  locale: string
}

export async function NavigationPage({
  contentType,
  entries,
  pathname,
  siteUrl,
  title,
  description,
  lead,
  highlights,
  gridTitle,
  breadcrumbs,
  locale
}: Props) {
  const t = await getTranslations('common')

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
    about: { '@type': 'Thing', name: contentType },
    inLanguage: locale,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.title,
      url: `${siteUrl}${pathname}/${entry.slug}`
    }))
  }

  return (
    <>
      <JsonLd data={itemList} />
      <article className="pb-16">
        <div className="pt-6 sm:pt-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="relative mt-4 overflow-hidden rounded-xl">
          <Image
            src="/images/hero.webp"
            alt={title}
            width={1200}
            height={420}
            priority
            className="aspect-[1200/420] w-full object-cover"
          />
          <span className="absolute bottom-2 right-3 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white/80">
            {t('officialMedia')}
          </span>
        </div>

        <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{lead}</p>

        <AdSlot />

        <div className="mt-8">
          <p className="text-base leading-7 text-muted-foreground">
            {description}{' '}
            {highlights.map((item, index) => (
              <span key={item}>
                <strong className="font-semibold text-foreground">{item}</strong>
                {index < highlights.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </div>

        <h2 className="mt-10 text-xl font-semibold tracking-tight">{gridTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={entry.href}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary">
                  {entry.title}
                </h3>
                {entry.tags?.includes('new') && <Badge tone="primary">{t('badgeNew')}</Badge>}
                {entry.tags?.includes('popular') && <Badge tone="primary">{t('badgePopular')}</Badge>}
              </div>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
              <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
                <span>{t('readMore')}</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        {entries.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">
            {locale === 'zh'
              ? '这个栏目还没有文章，稍后补齐。'
              : 'No articles in this section yet — check back soon.'}
          </p>
        )}

        <AdSlot />
      </article>
    </>
  )
}
