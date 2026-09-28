import { getRequestConfig } from 'next-intl/server'
import { routing, type AppLocale } from './routing'

import en from '@/locales/en.json'

// Every additional language is statically imported here.
// (routing.ts locales + this map + src/locales/*.json must stay in sync.)

type Messages = Record<string, unknown>

const messagesByLocale: Partial<Record<AppLocale, Messages>> = {
  en
}

function isPlainObject(value: unknown): value is Messages {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Merge `override` on top of `base` recursively so a partial translation
 * (e.g. zh.json missing a new key) falls back to English instead of throwing.
 */
export function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base }
  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = result[key]
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue)
    } else {
      result[key] = overrideValue
    }
  }
  return result
}

function resolveLocale(requested: string | undefined): AppLocale {
  if (requested && (routing.locales as readonly string[]).includes(requested)) {
    return requested as AppLocale
  }
  return routing.defaultLocale as AppLocale
}

/**
 * UI copy only (nav labels, buttons, breadcrumbs, card blurbs, ...).
 * Article bodies are NOT handled here — see `src/lib/content.ts`, which picks
 * `content/<locale>/**\/*.mdx` and falls back to English.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = resolveLocale(requested)

  const own = messagesByLocale[locale] ?? {}
  const merged =
    locale === (routing.defaultLocale as AppLocale) ? en : deepMerge(en, own)

  return {
    locale,
    messages: merged
  }
})
