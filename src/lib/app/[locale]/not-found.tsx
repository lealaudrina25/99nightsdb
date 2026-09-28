import Link from 'next/link'
import { Home, Swords } from 'lucide-react'

/**
 * Copy stays in English on purpose (same rule as the legal pages): this page is
 * rendered outside the normal i18n request flow, where locale strings are not
 * guaranteed to be available.
 */
export default function NotFound() {
  const sections = [
    { label: 'Boss Guides', href: '/bosses', Icon: Swords },
    { label: 'Guides', href: '/guides', Icon: Swords },
    { label: 'Home', href: '/', Icon: Home }
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex gap-8">
        <main className="min-w-0 flex-1 pb-16">
          <div className="pt-16 sm:pt-24">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">404</p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              That page has moved or does not exist yet. Try one of the sections below.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((section) => {
                const SectionIcon = section.Icon
                return (
                  <Link
                    key={section.label}
                    href={section.href}
                    className="group flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-foreground/80 transition-colors group-hover:bg-foreground group-hover:text-background">
                      <SectionIcon className="size-5" aria-hidden="true" />
                    </span>
                    <h2 className="font-semibold group-hover:text-primary">{section.label}</h2>
                  </Link>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
