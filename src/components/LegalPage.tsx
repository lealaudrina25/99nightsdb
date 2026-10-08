import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'

export type LegalSection = {
  title: string
  body: string[]
}

/**
 * Legal copy is plain text, but advertising disclosures have to link out to
 * vendor opt-out pages, so a paragraph may contain [text](url) markers.
 */
function renderInline(text: string, key: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  if (parts.length === 1) return text
  return (
    <>
      {parts.map((part, index) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
        if (!link) return <span key={`${key}-${index}`}>{part}</span>
        return (
          <a
            key={`${key}-${index}`}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {link[1]}
          </a>
        )
      })}
    </>
  )
}

/**
 * Shared shell for the hand-written legal pages.
 * Copy is intentionally hardcoded English in each page file.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
  breadcrumbs
}: {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
  breadcrumbs: Crumb[]
}) {
  return (
    <article className="pb-16">
      <div className="pt-6 sm:pt-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{intro}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground/70">{updated}</p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{renderInline(paragraph, paragraph.slice(0, 32))}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}

export function LegalLayoutShell({ children }: { children: ReactNode }) {
  return children
}
