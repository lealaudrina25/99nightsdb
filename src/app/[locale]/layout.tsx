import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, HREFLANG } from '@/i18n/routing'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { JsonLd } from '@/components/JsonLd'
import { themeScript } from '@/components/ThemeToggle'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://99nightsdb.com'
const OG_IMAGE = `${SITE_URL}/images/hero.webp`

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    return {}
  }
  const t = await getTranslations({ locale, namespace: 'site' })

  const languages: Record<string, string> = {}
  for (const item of routing.locales) {
    languages[HREFLANG[item]] =
      item === routing.defaultLocale ? `${SITE_URL}/` : `${SITE_URL}/${item}`
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: `%s · ${t('name')}`
    },
    description: t('description'),
    alternates: {
      canonical: locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
      languages
    },
    openGraph: {
      type: 'website',
      siteName: t('name'),
      title: t('title'),
      description: t('description'),
      url: SITE_URL,
      locale,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: t('ogImageAlt')
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [OG_IMAGE]
    },
    robots: { index: true, follow: true }
  }
}

/** Decorative blurred blobs used behind every page. */
function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background opacity-80 blur-sm" />
      <div className="absolute top-0 right-0 size-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 size-[400px] rounded-full bg-nav-theme/3 blur-[100px]" />
      <div className="absolute inset-0 bg-background/50" />
    </div>
  )
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'site' })

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t('footerBrand'),
    alternateName: t('name'),
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: OG_IMAGE,
    description: t('footerDesc')
  }

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        {/* Google AdSense — publisher ID ca-pub-94867555764574054 (site verification + Auto ads) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-94867555764574054"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <JsonLd data={organization} />
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <BackgroundGlow />
            <div className="relative z-10">
              <SiteHeader />
              {children}
              <div className="mt-32 sm:mt-40 lg:mt-48">
                <SiteFooter />
              </div>
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
