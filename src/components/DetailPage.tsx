import { ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { ContentEntry, ContentMetadata } from '@/lib/content'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { AdSlot } from '@/components/AdSlot'
import { JsonLd } from '@/components/JsonLd'
import { mdxComponents } from '@/components/mdx-components'

type Props = {
  metadata: ContentMetadata
  Content: React.ComponentType<{ components?: Record<string, unknown> }>
  pathname: string
  siteUrl: string
  breadcrumbs: Crumb[]
  related: ContentEntry[]
  defaultImage: string
}

export async function DetailPage({
  metadata,
  Content,
  pathname,
  siteUrl,
  breadcrumbs,
  related,
  defaultImage
}: Props) {
  const t = await getTranslations('common')
  const tRelated = await getTranslations('related')
  const url = `${siteUrl}${pathname}`
  const image = metadata.image ?? defaultImage

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.description,
    image: image.startsWith('http') ? image : `${siteUrl}${image}`,
    inLanguage: 'en',
    datePublished: metadata.date,
    dateModified: metadata.lastModified ?? metadata.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: metadata.category,
    author: { '@type': 'Organization', name: 'VV Ultimatum Wiki', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'VV Ultimatum Wiki', url: siteUrl }
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.concat([{ label: metadata.title }]).map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? `${siteUrl}${crumb.href}` : url
    }))
  }

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <article className="pb-16">
        <div className="pt-6 sm:pt-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">{metadata.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{metadata.description}</p>

        {metadata.lastModified && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <span>
              {t('lastUpdated')} {metadata.lastModified}
            </span>
          </div>
        )}

        <AdSlot />

        <div className="mt-8">
          <Content components={mdxComponents} />
        </div>

        <AdSlot />

        {related.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">{tRelated('title')}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => (
                <Link
                  key={entry.slug}
                  href={entry.href}
                  className="group flex flex-col gap-2 rounded-2xl border border-border bg-card/60 p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {entry.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>
                  <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
                    <span>{t('readMore')}</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
