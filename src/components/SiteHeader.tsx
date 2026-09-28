'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { NAV_ITEMS } from '@/config/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const t = useTranslations('nav')
  const tSite = useTranslations('site')
  const tActions = useTranslations('actions')
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative inline-flex shrink-0 overflow-hidden rounded-lg ring-1 ring-white/12 shadow-[0_0_24px_hsl(var(--nav-theme)/0.16)]">
            <Image src="/logo.png" alt={tSite('shortName')} width={36} height={36} />
          </span>
          <span className="font-serif text-base tracking-[0.14em] text-foreground sm:text-lg">
            {tSite('shortName')}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.path}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="md:hidden p-2"
          aria-label={tActions('openCategories')}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div className={cn('md:hidden', open ? 'block' : 'hidden')}>
        <nav className="space-y-1 border-t border-border/60 px-4 py-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.path}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="px-2 pt-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
