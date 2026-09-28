import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-muted text-muted-foreground',
        primary: 'border-primary/30 bg-primary/10 text-primary',
        outline: 'border-border/60 bg-card/40 text-muted-foreground',
        blue: 'border-transparent bg-blue-500/15 text-blue-600 dark:text-blue-400'
      }
    },
    defaultVariants: { tone: 'neutral' }
  }
)

export function Badge({
  className,
  tone,
  children
}: {
  className?: string
  tone?: VariantProps<typeof badgeVariants>['tone']
  children: React.ReactNode
}) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>
}
