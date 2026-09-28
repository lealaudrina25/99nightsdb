import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { LegalPage } from '@/components/LegalPage'
import { SidebarNav } from '@/components/SidebarNav'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'About this Wiki',
  description:
    'What VV: ULTIMATUM Wiki is, how the guides are researched, and how often the data is refreshed.'
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex gap-8">
        <main className="min-w-0 flex-1">
          <LegalPage
            title="About this Wiki"
            updated="Last updated: September 11, 2026"
            intro="VV Ultimatum Wiki documents VV: ULTIMATUM for Roblox players — built by players, kept deliberately practical."
            breadcrumbs={[{ label: 'About this Wiki' }]}
            sections={[
              {
                title: 'Why this site exists',
                body: [
                  'Progression in VV: ULTIMATUM spans three races, 130+ skills, and dozens of bosses. Most answers are scattered across videos and Discord threads.',
                  'This wiki collects those answers into route notes and reference tables you can read in one sitting.'
                ]
              },
              {
                title: 'How guides are researched',
                body: [
                  'Every stat table is checked in game before publication, and anything still unconfirmed is labelled as pending instead of being presented as fact.',
                  'Ranked lists separate measured performance from opinion so you can see which part is which.'
                ]
              },
              {
                title: 'Update cadence',
                body: [
                  'Pages are refreshed after every documented release. The Roblox statistics block on the home page always carries the date of the last snapshot.'
                ]
              },
              {
                title: 'Get in touch',
                body: [
                  'Corrections are welcome. Use the official Discord linked in the footer to report outdated numbers or missing bosses.'
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
