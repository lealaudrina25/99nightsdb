import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

/**
 * MUST live in src/ (not the project root) or Turbopack never wires it up.
 *
 * localePrefix:'as-needed'  -> /bosses for English, /zh/bosses for Chinese
 * alternateLinks:false      -> we emit our own hreflang
 */
export default createMiddleware({ ...routing, alternateLinks: false })

export const config = {
  // Skip api routes, Next internals and every static asset (icons, images, txt).
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)']
}
