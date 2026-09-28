import { defineRouting } from 'next-intl/routing'

/**
 * SINGLE SOURCE OF TRUTH for the language list.
 *
 * Adding a language requires touching exactly three places:
 *   1. `locales` below
 *   2. the imports + `messages` map in `src/i18n/request.ts`
 *   3. a new JSON file in `src/locales/<locale>.json`
 */
export const routing = defineRouting({
  // English only — the first site targets English Google traffic,
  // and the course explicitly advises against shipping Chinese on these sites.
  locales: ['en'],
  defaultLocale: 'en',
  // English lives at `/classes`, every other language at `/zh/classes`
  localePrefix: 'as-needed',
  localeDetection: true
})

export type AppLocale = (typeof routing.locales)[number]

export const LOCALES = routing.locales as readonly AppLocale[]
export const DEFAULT_LOCALE = routing.defaultLocale as AppLocale

/** BCP-47 tags used for `alternates.languages` (hreflang). */
export const HREFLANG: Record<AppLocale, string> = {
  en: 'en'
}
