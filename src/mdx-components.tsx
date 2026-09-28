import type { MDXComponents } from 'mdx/types'
import { mdxComponents } from '@/components/mdx-components'

/**
 * Entry point injected into every compiled MDX file by `@next/mdx`.
 *
 * The plugin aliases its internal `next-mdx-import-source-file` to
 * `src/mdx-components` → `mdx-components` → `@mdx-js/react` → its own stub,
 * so this file wins over `@mdx-js/react`.
 *
 * We deliberately avoid `@mdx-js/react`'s context provider: it calls
 * `React.createContext`, which does not exist in the React Server Components
 * build. Articles are rendered inside Server Components, so that import threw
 * at runtime and every `/:type/:slug` page fell through to `notFound()`.
 *
 * A plain merge of the shared styles + whatever the caller passes keeps the
 * same behaviour on the server with zero client-side context involved.
 */
export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components } as MDXComponents
}
