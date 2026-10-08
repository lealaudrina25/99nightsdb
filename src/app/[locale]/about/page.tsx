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
    'What the 99 Nights in the Forest Wiki is, how the guides are researched, and how often the data is refreshed.'
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
            updated="Last updated: October 8, 2026"
            intro="A fan-built reference for 99 Nights in the Forest — written by players, kept deliberately practical."
            breadcrumbs={[{ label: 'About this Wiki' }]}
            sections={[
              {
                title: 'Why this site exists',
                body: [
                  'A single run in 99 Nights in the Forest spans a six-level campfire, dozens of classes, and a map split into four biomes. Most answers are scattered across videos and Discord threads.',
                  'This wiki collects those answers into route notes and reference tables you can read in one sitting.'
                ]
              },
              {
                title: 'How guides are researched',
                body: [
                  'Every stat table is checked against published sources before it goes live, and anything still unconfirmed is labelled as unconfirmed instead of being presented as fact.',
                  'Ranked lists separate what sources actually state from our own arithmetic, so you can see which part is which.'
                ]
              },
              {
                title: 'Update cadence',
                body: [
                  'Pages are refreshed after every documented release. The update log records what each patch changed and when the next one is expected.'
                ]
              },
              {
                title: 'Corrections',
                body: [
                  'Corrections are welcome. If a number on this site disagrees with what you see in game, trust the game — the footer links to the official experience.',
                  'This is an unofficial fan project and is not affiliated with the developers or with Roblox.'
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
