import type { NextConfig } from 'next'
import createMDXPlugin from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'
import remarkGfm from 'remark-gfm'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withMDX = createMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    // remark-gfm adds pipe tables (and strikethrough / autolinks) — without it
    // every drop-table in content/ renders as a wall of `|`-separated text.
    remarkPlugins: [remarkGfm],
    rehypePlugins: []
  }
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp']
  }
}

export default withNextIntl(withMDX(nextConfig))
