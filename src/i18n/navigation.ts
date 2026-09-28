import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Locale-aware navigation helpers.
 * Always link through these so `/bosses` stays prefix-free for English
 * and becomes `/zh/bosses` for every other language.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
