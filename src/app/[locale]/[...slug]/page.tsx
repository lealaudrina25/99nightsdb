import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, HREFLANG } from '@/i18n/routing'
import { CONTENT_TYPE_SET, navKeyForType } from '@/config/navigation'
import { getAllContent, getAllContentPaths, getContent } from '@/lib/content'
import { SidebarNav } from '@/components/SidebarNav'
import { NavigationPage } from '@/components/NavigationPage'
import { DetailPage } from '@/components/DetailPage'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vvultimatum.example'
const OG_IMAGE = `${SITE_URL}/images/hero.webp`

type Params = { locale: string; slug: string[] }

export function generateStaticParams() {
  const paths: Params[] = []
  for (const locale of routing.locales) {
    for (const { slug } of getAllContentPaths(locale)) {
      paths.push({ locale, slug })
    }
  }
  return paths
}

function localizedPath(locale: string, path: string) {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`
}

function alternatesFor(locale: string, path: string) {
  const languages: Record<string, string> = {}
  for (const item of routing.locales) {
    languages[HREFLANG[item]] = `${SITE_URL}${localizedPath(item, path)}`
  }
  return {
    canonical: `${SITE_URL}${localizedPath(locale, path)}`,
    languages
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const path = `/${slug.join('/')}`

  // list page
  if (slug.length === 1) {
    if (!CONTENT_TYPE_SET.has(slug[0])) return {}
    const t = await getTranslations({ locale, namespace: `pages.${slug[0]}` })
    return {
      title: t('title'),
      description: t('description'),
      alternates: alternatesFor(locale, path),
      openGraph: {
        type: 'website',
        title: t('title'),
        description: t('description'),
        url: `${SITE_URL}${localizedPath(locale, path)}`,
        images: [OG_IMAGE]
      }
    }
  }

  // detail page
  const loaded = await getContent(slug[0], slug.slice(1).join('/'), locale)
  if (!loaded) return {}

  const title = loaded.metadata.title
  const description = loaded.metadata.description

  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      publishedTime: loaded.metadata.date,
      modifiedTime: loaded.metadata.lastModified ?? loaded.metadata.date,
      images: [
        loaded.metadata.image
          ? `${SITE_URL}${loaded.metadata.image}`
          : OG_IMAGE
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [loaded.metadata.image ? `${SITE_URL}${loaded.metadata.image}` : OG_IMAGE]
    }
  }
}

export default async function CatchAllPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  // /bosses → list page
  if (slug.length === 1) {
    const contentType = slug[0]
    if (!CONTENT_TYPE_SET.has(contentType)) notFound()

    const t = await getTranslations({ locale, namespace: `pages.${contentType}` })
    const tNav = await getTranslations({ locale, namespace: 'nav' })

    const entries = getAllContent(contentType, locale)
    const path = `/${contentType}`

    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex gap-8">
          <main className="min-w-0 flex-1">
            <NavigationPage
              contentType={contentType}
              entries={entries}
              pathname={localizedPath(locale, path)}
              siteUrl={SITE_URL}
              locale={locale}
              title={t('title')}
              description={t('description')}
              lead={t('lead')}
              highlights={t.raw('highlights') as string[]}
              gridTitle={t('gridTitle')}
              breadcrumbs={[{ label: tNav(navKeyForType(contentType)) }]}
            />
          </main>
          <SidebarNav />
        </div>
      </div>
    )
  }

  // /bosses/gelum → detail page
  const contentType = slug[0]
  const articleSlug = slug.slice(1).join('/')
  const loaded = await getContent(contentType, articleSlug, locale)
  if (!loaded) notFound()

  const entries = getAllContent(contentType, locale)
  const related = entries.filter((entry) => entry.slug !== articleSlug).slice(0, 3)
  const path = `/${contentType}/${articleSlug}`
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex gap-8">
        <main className="min-w-0 flex-1">
          <DetailPage
            metadata={loaded.metadata}
            Content={loaded.Content as unknown as React.ComponentType<{ components?: Record<string, unknown> }>}
            pathname={localizedPath(locale, path)}
            siteUrl={SITE_URL}
            defaultImage={OG_IMAGE}
            related={related}
            breadcrumbs={[
              { label: tNav(navKeyForType(contentType)), href: `/${contentType}` },
              { label: loaded.metadata.title }
            ]}
          />
        </main>
        <SidebarNav />
      </div>
    </div>
  )
}
