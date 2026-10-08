import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { LegalPage } from '@/components/LegalPage'
import { SidebarNav } from '@/components/SidebarNav'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'Copyright',
  description:
    'Copyright and content attribution notes for the 99 Nights in the Forest Wiki, an unofficial fan project.'
}

export default async function CopyrightPage({
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
            title="Copyright"
            updated="Last updated: October 8, 2026"
            intro="This page explains what belongs to us, what belongs to the game developers, and how to ask for credit fixes or takedowns."
            breadcrumbs={[{ label: 'Copyright' }]}
            sections={[
              {
                title: 'Game intellectual property',
                body: [
                  '99 Nights in the Forest, its art, music, and gameplay systems are the property of Grandma\'s Favourite Games and their respective owners. All trademarks belong to their holders.',
                  'This wiki is an unofficial fan project and claims no ownership over in-game assets.'
                ]
              },
              {
                title: 'Wiki content',
                body: [
                  'Written guides, tables, route notes, and page layouts published on this site are released for personal reference use. Do not republish them wholesale on another site.',
                  'Screenshots and short quotes used for commentary fall under fair use with attribution to their source.'
                ]
              },
              {
                title: 'Takedown requests',
                body: [
                  'If you own rights to material published here and want it removed or credited differently, reach out through the official community channels listed in the footer and we will act promptly.'
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
