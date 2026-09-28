import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type ButtonLinkProps = {
  href: string
  external?: boolean
  className?: string
  variant?: Parameters<typeof buttonVariants>[0] extends undefined
    ? undefined
    : NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
  children: React.ReactNode
}

/**
 * Anchor that keeps the target's pill / ghost button styles.
 * Internal links are locale-aware through next-intl's Link.
 */
export function ButtonLink({
  href,
  external,
  className,
  variant = 'default',
  size = 'default',
  children
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className)

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
