import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { LegalPage } from '@/components/LegalPage'
import { SidebarNav } from '@/components/SidebarNav'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How VV: ULTIMATUM Wiki handles visitor data, analytics, advertising partners, and cookies.'
}

export default async function PrivacyPolicyPage({
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
            title="Privacy Policy"
            updated="Last updated: September 11, 2026"
            intro="This fan-made wiki explains what data is collected when you browse it, why it is collected, and how you can opt out."
            breadcrumbs={[{ label: 'Privacy Policy' }]}
            sections={[
              {
                title: 'Who we are',
                body: [
                  'VV Ultimatum Wiki is an independent, fan-built reference site. It is not affiliated with Midnight Continent or Roblox Corporation.',
                  'The site is run by players for players and is not an official product of any company.'
                ]
              },
              {
                title: 'Data we collect',
                body: [
                  'We use privacy-friendly analytics to count page views and referrers. These metrics are aggregated and cannot be used to identify you.',
                  'Advertising partners and embedded content (for example YouTube) may set their own cookies or local storage entries when their resources load.'
                ]
              },
              {
                title: 'Cookies and advertising',
                body: [
                  'Third-party ad networks may use cookies to serve ads relevant to your interests. You can block or delete cookies in your browser settings.',
                  'We never sell personal information, and we do not operate user accounts, newsletters, or comment systems that would require one.'
                ]
              },
              {
                title: 'Your choices',
                body: [
                  'You may browse every page of this wiki without providing any personal information.',
                  'If you would like your data removed from a third-party processor, contact that provider directly — we hold no accounts of our own.'
                ]
              },
              {
                title: 'Changes',
                body: [
                  'We may update this policy when the site changes. The date at the top of this page always reflects the latest revision.'
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
