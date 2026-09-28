import fs from 'node:fs'
import path from 'node:path'
import type { ComponentType } from 'react'
import { DEFAULT_LOCALE } from '@/i18n/routing'
import { CONTENT_TYPES, CONTENT_TYPE_SET, findContentType } from '@/config/navigation'

/** content/ lives at the project root, next to src/ */
const CONTENT_ROOT = path.join(process.cwd(), 'content')

export type ContentMetadata = {
  title: string
  description: string
  category: string
  date?: string
  lastModified?: string
  image?: string
  tags?: string[]
  /** lower sorts first — use it to pin the order of the cards */
  order?: number
}

export type ContentEntry = ContentMetadata & {
  /** URL slug. Nested folders stay nested: `subdir/slug` */
  slug: string
  /** `/bosses/gelum` (locale prefix added by the caller) */
  href: string
  /** locale the entry was actually read from (may be the fallback locale) */
  locale: string
  /** true when no translation existed and English was used instead */
  fallback: boolean
}

type MDXModule = {
  default: ComponentType<{ components?: Record<string, ComponentType<unknown>> }>
  metadata?: Partial<ContentMetadata>
}

/* ------------------------------------------------------------------------- */
/* filesystem helpers                                                        */
/* ------------------------------------------------------------------------- */

/** `gelum:boss.mdx` → `gelum-boss`, `Feb Patch!.mdx` → `feb-patch` */
export function toSlug(fileName: string): string {
  return fileName
    .replace(/\.mdx?$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function walk(dir: string, base = dir, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, base, acc)
    } else if (/\.mdx?$/.test(entry.name)) {
      acc.push(path.relative(base, full).split(path.sep).join('/'))
    }
  }
  return acc
}

/* ------------------------------------------------------------------------- */
/* metadata extraction (no compile step needed just to list cards)           */
/* ------------------------------------------------------------------------- */

function extractObjectLiteral(source: string, startIndex: number): string {
  let depth = 0
  let inString: string | null = null
  for (let i = startIndex; i < source.length; i += 1) {
    const char = source[i]
    const prev = source[i - 1]
    if (inString) {
      if (char === inString && prev !== '\\') inString = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      inString = char
    } else if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) return source.slice(startIndex, i + 1)
    }
  }
  throw new Error('Unbalanced braces while reading MDX metadata')
}

/** Reads `export const metadata = { ... }` from an .mdx file without compiling it. */
export function extractMetadata(fileContent: string): Partial<ContentMetadata> {
  const marker = 'metadata'
  const match = new RegExp(`export\\s+const\\s+${marker}\\s*=\\s*\\{`).exec(fileContent)
  if (!match) return {}
  const braceIndex = match.index + match[0].length - 1
  const literal = extractObjectLiteral(fileContent, braceIndex)
  try {
    // Trusted build-time input: our own content files.
    const value = new Function(`return ${literal}`)() as Partial<ContentMetadata>
    return value ?? {}
  } catch {
    return {}
  }
}

function readMdxFile(locale: string, type: string, file: string) {
  const full = path.join(CONTENT_ROOT, locale, type, file)
  return fs.readFileSync(full, 'utf8')
}

/* ------------------------------------------------------------------------- */
/* public API                                                                */
/* ------------------------------------------------------------------------- */

/** All MDX entries for one content type, with per-file fallback to English. */
export function getAllContent(contentType: string, language: string): ContentEntry[] {
  if (!CONTENT_TYPE_SET.has(contentType)) return []

  const enDir = path.join(CONTENT_ROOT, DEFAULT_LOCALE, contentType)
  const localeDir = path.join(CONTENT_ROOT, language, contentType)

  const enFiles = walk(enDir)
  const localeFiles = language === DEFAULT_LOCALE ? enFiles : walk(localeDir)

  // Files translated into `language` win; everything else falls back to English.
  const seen = new Map<string, { file: string; locale: string; fallback: boolean }>()
  for (const file of enFiles) {
    seen.set(file, { file, locale: DEFAULT_LOCALE, fallback: language !== DEFAULT_LOCALE })
  }
  for (const file of localeFiles) {
    seen.set(file, { file, locale: language, fallback: false })
  }

  const entries = Array.from(seen.values()).map(({ file, locale, fallback }) => {
    const raw = readMdxFile(locale, contentType, file)
    const metadata = extractMetadata(raw)
    const slug = toSlug(file)
    return {
      title: metadata.title ?? slug,
      description: metadata.description ?? '',
      category: metadata.category ?? contentType,
      date: metadata.date,
      lastModified: metadata.lastModified,
      image: metadata.image,
      tags: metadata.tags,
      order: metadata.order,
      slug,
      href: `/${contentType}/${slug}`,
      locale,
      fallback
    } satisfies ContentEntry
  })

  return entries.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined && a.order !== b.order) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    const dateA = a.date ?? ''
    const dateB = b.date ?? ''
    if (dateA !== dateB) return dateA < dateB ? 1 : -1
    return a.slug.localeCompare(b.slug)
  })
}

/**
 * Load a single MDX article.
 * Uses a plain dynamic `import()` — no next-mdx-remote — so the compiled
 * component ships as part of the bundle.
 */
export async function getContent(
  contentType: string,
  slug: string,
  language: string
): Promise<{ Content: MDXModule['default']; metadata: ContentMetadata } | null> {
  if (!CONTENT_TYPE_SET.has(contentType)) return null

  const attempts = language === DEFAULT_LOCALE ? [language] : [language, DEFAULT_LOCALE]

  for (const attempt of attempts) {
    // Only try to import files that really exist: Webpack turns the dynamic
    // import below into a context module, and asking it for a missing key
    // rejects instead of falling through silently.
    if (!fs.existsSync(path.join(CONTENT_ROOT, attempt, contentType, `${slug}.mdx`))) {
      continue
    }
    try {
      const mod: MDXModule = await import(
        `../../content/${attempt}/${contentType}/${slug}.mdx`
      )
      return {
        Content: mod.default,
        metadata: {
          title: mod.metadata?.title ?? slug,
          description: mod.metadata?.description ?? '',
          category: mod.metadata?.category ?? contentType,
          date: mod.metadata?.date,
          lastModified: mod.metadata?.lastModified,
          image: mod.metadata?.image,
          tags: mod.metadata?.tags,
          order: mod.metadata?.order
        }
      }
    } catch {
      // try the next locale
    }
  }
  return null
}

/**
 * Every MDX file that actually exists (relative to the English content tree),
 * returned as catch-all slug segments for `generateStaticParams`.
 */
export function getAllContentPaths(language: string = DEFAULT_LOCALE): { slug: string[] }[] {
  // English is the source of truth; translations that exist only for another
  // language are added on top. Missing translations fall back to English, so a
  // path that resolves in either tree is renderable.
  const trees = new Set([DEFAULT_LOCALE, language])

  const seen = new Set<string>()
  const paths: { slug: string[] }[] = []

  for (const tree of trees) {
    const rootDir = path.join(CONTENT_ROOT, tree)
    for (const type of CONTENT_TYPES) {
      if (!fs.existsSync(path.join(rootDir, type))) continue
      for (const file of walk(path.join(rootDir, type))) {
        const slug = [type, ...toSlug(file).split('/')]
        const key = slug.join('/')
        if (seen.has(key)) continue
        seen.add(key)
        paths.push({ slug })
      }
    }
  }

  return paths
}

/** `/bosses` → true when bosses is a declared content type */
export function isContentType(segment: string): boolean {
  return findContentType(segment) !== undefined
}
