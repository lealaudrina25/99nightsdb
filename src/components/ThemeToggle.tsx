'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'vvu-theme'

/**
 * Dark by default (same as the reference site): the inline script in the layout
 * paints the correct class before hydration, this button only toggles it after.
 */
export function ThemeToggle() {
  const t = useTranslations('actions')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = () => document.documentElement.classList.contains('dark')

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label={t('toggleTheme')}
      onClick={() => {
        const dark = !isDark()
        document.documentElement.classList.toggle('dark', dark)
        try {
          window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
        } catch {
          /* private mode */
        }
      }}
    >
      {mounted ? (
        <>
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </>
      ) : (
        <Sun className="size-4" />
      )}
      <span className="sr-only">{t('toggleTheme')}</span>
    </Button>
  )
}

/** Runs before paint so the stored theme never flashes. */
export const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem('${STORAGE_KEY}');
    document.documentElement.classList.toggle('dark', stored !== 'light');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`
