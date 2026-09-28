import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { HomePageClient } from './HomePageClient'
import { SidebarNav } from '@/components/SidebarNav'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${prefix || '/'}`,
      languages: Object.fromEntries(
        routing.locales.map((item) => [
          item,
          item === routing.defaultLocale ? '/' : `/${item}`
        ])
      )
    }
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex gap-8">
        <main className="min-w-0 flex-1">
          <HomePageClient />
        </main>
        <SidebarNav />
      </div>
    </div>
  )
}
