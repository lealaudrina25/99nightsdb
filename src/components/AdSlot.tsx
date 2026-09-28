import { cn } from '@/lib/utils'

/**
 * Ad placeholders. Swap the src for your own ad code — files live in
 * public/ads/ and are served by Netlify/Vercel static hosting.
 */
const SIZES = {
  leaderboard: {
    file: '/ads/leaderboard-728x90.html',
    className: 'h-[50px] w-[320px] md:h-[90px] md:w-[728px]'
  },
  rectangle: {
    file: '/ads/rectangle-300x250.html',
    className: 'h-[250px] w-[300px]'
  },
  native: {
    file: '/ads/native-banner.html',
    className: 'h-[120px] w-full max-w-[728px]'
  }
} as const

export function AdSlot({
  slot = 'leaderboard',
  className,
  label = 'Advertisement'
}: {
  slot?: keyof typeof SIZES
  className?: string
  label?: string
}) {
  const size = SIZES[slot]
  return (
    <div className="mx-auto mt-8 flex max-w-[728px] justify-center">
      <iframe
        src={size.file}
        title={label}
        loading="lazy"
        aria-label={label}
        className={cn('mx-auto border-0', size.className, className)}
      />
    </div>
  )
}
