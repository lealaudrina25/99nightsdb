import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { LegalPage } from '@/components/LegalPage'
import { SidebarNav } from '@/components/SidebarNav'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'Terms of Service',
  description:
    'The terms that apply when you browse and use the 99 Nights in the Forest Wiki, an independent fan-made guide site.'
}

export default async function TermsOfServicePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex gap-8">
        <main className="min-w-0 flex-1">
          <LegalPage
            title="Terms of Service"
            updated="Last updated: October 8, 2026"
            intro="By browsing this wiki you agree to the terms below. If you do not agree with them, please stop using the site."
            breadcrumbs={[{ label: 'Terms of Service' }]}
            sections={[
              {
                title: 'Use of the site',
                body: [
                  'The 99 Nights in the Forest Wiki is provided free of charge for informational purposes. Guides, tables, and tier lists reflect community testing and may change with every game update.',
                  'You are free to read, print, and share links to any page for personal, non-commercial use.'
                ]
              },
              {
                title: 'Accuracy of information',
                body: [
                  'Game data is verified against in-game sources and community reports, but nothing here is guaranteed to be current or complete.',
                  'Always double-check values such as drop rates, respawn timers, and code expiry inside the game before making decisions that cost you resources.'
                ]
              },
              {
                title: 'Third-party links',
                body: [
                  'We link to Roblox, Discord, YouTube, and other community tools. We do not control those services and are not responsible for their content or policies.'
                ]
              },
              {
                title: 'Limitation of liability',
                body: [
                  'This site is provided "as is" without warranties of any kind. We are not liable for losses, in-game or otherwise, that result from using the information published here.'
                ]
              }
            ]}
          />
        </main>
        <SidebarNav />
      </div>
    </div>
  )
}
