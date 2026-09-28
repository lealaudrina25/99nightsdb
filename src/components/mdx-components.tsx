import type { ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'
import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Callout box used inside MDX:
 *   <Callout>
 *   **Why this matters**
 *   Body text…
 *   </Callout>
 */
export function Callout({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-amber-300/40 bg-amber-50 px-5 py-4 dark:bg-amber-950/20',
        className
      )}
    >
      <div className="flex items-start gap-2">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        <div className="mt-1 space-y-3 text-sm leading-6 text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}

type AnchorProps = ComponentPropsWithoutRef<'a'>

/**
 * Maps every Markdown element to the same Tailwind classes the reference wiki
 * renders, so MDX bodies match hand-written pages without duplicating styles.
 */
export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      {...props}
      className={cn('mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight', props.className)}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      {...props}
      className={cn('mt-8 scroll-mt-24 text-xl font-semibold tracking-tight', props.className)}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      {...props}
      className={cn('mt-6 scroll-mt-24 text-base font-semibold tracking-tight', props.className)}
    />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p {...props} className={cn('text-base leading-7 text-muted-foreground', props.className)} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      {...props}
      className={cn(
        'list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground',
        props.className
      )}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      {...props}
      className={cn(
        'list-decimal space-y-2 pl-6 text-base leading-7 text-muted-foreground',
        props.className
      )}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li {...props} className={cn('marker:text-muted-foreground/70', props.className)} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong {...props} className={cn('font-semibold text-foreground', props.className)} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      {...props}
      className={cn(
        'border-l-2 border-primary/40 pl-4 text-base leading-7 text-muted-foreground',
        props.className
      )}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="mt-4 overflow-x-auto">
      <table {...props} className={cn('w-full rounded-lg border border-border text-sm', props.className)} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => <thead {...props} />,
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr {...props} className={cn('border-b border-border', props.className)} />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th {...props} className={cn('bg-muted/50 px-4 py-2 text-left font-semibold', props.className)} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td {...props} className={cn('px-4 py-2 align-top', props.className)} />
  ),
  a: ({ href = '', children, ...props }: AnchorProps) => {
    const external = /^https?:\/\//.test(href)
    const className =
      'font-medium text-nav-theme underline underline-offset-4 transition-colors hover:opacity-80'
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    )
  },
  Callout
}
