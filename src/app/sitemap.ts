import type { MetadataRoute } from 'next'
import { getAllContent, getAllContentPaths } from '@/lib/content'
import { HREFLANG, routing } from '@/i18n/routing'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://99nightsdb.com'

/** `/bosses` for the default locale, `/zh/bosses` for everything else. */
function localized(locale: string, path: string) {
  const clean = path === '/' ? '' : path
  return locale === routing.defaultLocale ? `${clean || '/'}` : `/${locale}${clean || ''}`
}

function alternates(path: string) {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[HREFLANG[locale]] = `${SITE_URL}${localized(locale, path)}`
  }
  return { languages }
}

/**
 * Only used when an entry has no date of its own. Google ignores `lastmod`
 * that is not verifiably accurate, so a fixed date here would mean no
 * freshness signal at all — every real page now carries its own.
 */
const FALLBACK_DATE = new Date('2026-09-11T00:00:00.000Z')

/**
 * IMPORTANT: every URL below either has a real MDX file behind it or is a
 * hand-written page. Nothing is generated from the locale copy / card arrays,
 * so a card that has no article yet never lands in the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  const add = (
    locale: string,
    path: string,
    priority: number,
    changeFrequency: 'weekly' | 'monthly' | 'daily' | 'yearly',
    lastModified?: Date
  ) => {
    const url = `${SITE_URL}${localized(locale, path)}`
    if (entries.some((entry) => entry.url === url)) return
    entries.push({
      url,
      lastModified: lastModified ?? FALLBACK_DATE,
      changeFrequency,
      priority,
      alternates: alternates(path)
    })
  }

  const addEverywhere = (
    path: string,
    priority: number,
    changeFrequency: 'weekly' | 'monthly' | 'daily' | 'yearly'
  ) => {
    for (const locale of routing.locales) {
      add(locale, path, priority, changeFrequency)
    }
  }

  // 1. Hand-written pages
  addEverywhere('/', 1, 'weekly')
  for (const path of ['/privacy-policy', '/terms-of-service', '/copyright', '/about']) {
    addEverywhere(path, 0.3, 'yearly')
  }

  // 2. Everything that actually exists under content/ — per locale, because a
  //    translation-only article must not leak into the English sitemap.
  for (const locale of routing.locales) {
    const paths = getAllContentPaths(locale)
    if (paths.length === 0) continue

    // list pages, derived from the scan (never from NAVIGATION_CONFIG alone)
    const typesWithContent = new Set(paths.map((item) => item.slug[0]))

    // Real dates, read from each MDX file's `lastModified` (falling back to
    // `date`). This is what tells Google an article was genuinely updated.
    const dates = new Map<string, Date>()
    for (const type of typesWithContent) {
      for (const entry of getAllContent(type, locale)) {
        const stamp = entry.lastModified ?? entry.date
        if (!stamp) continue
        const parsed = new Date(stamp)
        if (Number.isNaN(parsed.getTime())) continue
        dates.set(`${type}/${entry.slug}`, parsed)
      }
    }

    // A category page is as fresh as the newest article it lists.
    for (const type of typesWithContent) {
      let newest: Date | undefined
      for (const [key, value] of dates) {
        if (!key.startsWith(`${type}/`)) continue
        if (!newest || value > newest) newest = value
      }
      add(locale, `/${type}`, 0.8, 'weekly', newest)
    }

    for (const { slug } of paths) {
      add(locale, `/${slug.join('/')}`, 0.7, 'monthly', dates.get(slug.join('/')))
    }
  }

  return entries
}
