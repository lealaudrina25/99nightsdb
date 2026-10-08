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
    'How this wiki handles visitor data, analytics, cookies, and the third-party advertising vendors, including Google, that fund it.'
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
            updated="Last updated: October 8, 2026"
            intro="This fan-made wiki explains what data is collected when you browse it, why it is collected, and how you can opt out."
            breadcrumbs={[{ label: 'Privacy Policy' }]}
            sections={[
              {
                title: 'Who we are',
                body: [
                  'The 99 Nights in the Forest Wiki is an independent, fan-built reference site. It is not affiliated with Grandma\'s Favourite Games or Roblox Corporation.',
                  'The site is run by players for players and is not an official product of any company.'
                ]
              },
              {
                title: 'Data we collect',
                body: [
                  'We use privacy-friendly analytics to count page views and referrers. These metrics are aggregated and cannot be used to identify you.',
                  'We do not run user accounts, newsletters, or comment systems, so we hold no profile of you and nothing you can log in to.',
                  'Advertising partners and embedded content (for example YouTube) may set their own cookies or local storage entries when their resources load.'
                ]
              },
              {
                title: 'Cookies',
                body: [
                  'A cookie is a small text file that a site asks your browser to store. This wiki is fully readable without them, but two kinds may be set while you read a page.',
                  'Analytics cookies record which pages were opened so we can tell which guides are useful. They are reported to us in aggregate and are not tied to your identity.',
                  'Advertising cookies are set by third-party advertising vendors rather than by us. The next section names those vendors and explains how to turn their cookies off.'
                ]
              },
              {
                title: 'Advertising and Google',
                body: [
                  'This site is supported by advertising. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website and to other websites.',
                  'Google\'s use of advertising cookies, including the DoubleClick cookie, enables Google and its partners to serve ads to you based on your visits to this site and/or other sites on the internet.',
                  'Google and its partners may also use web beacons, IP address, and device information when serving those ads, in line with their own policies.',
                  'You can read how Google uses information from sites that use its services at [policies.google.com/technologies/ads](https://policies.google.com/technologies/ads).'
                ]
              },
              {
                title: 'How to opt out of personalized advertising',
                body: [
                  'You can opt out of personalized advertising by Google at [Google Ads Settings](https://www.google.com/settings/ads).',
                  'You can opt out of some third-party vendors\' use of cookies for personalized advertising at [www.aboutads.info](https://www.aboutads.info/choices/).',
                  'You can also block or delete cookies for any site at any time from your browser settings. Blocking advertising cookies does not break this wiki; it only makes the ads you see less relevant.',
                  'If you are in the European Economic Area, the United Kingdom, or Switzerland, Google and its partners ask for your consent before using cookies for advertising, and you can change or withdraw that consent at any time through the consent message shown on the page.'
                ]
              },
              {
                title: 'Your choices',
                body: [
                  'You may browse every page of this wiki without providing any personal information.',
                  'We never sell personal information, and we hold no accounts of our own to delete. Data held by an advertising provider is under that provider\'s control, so use the opt-out links above to remove it.',
                  'This site is not directed at children under 13, and we do not knowingly collect personal information from children.'
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
