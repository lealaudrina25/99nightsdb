import {
  Ticket,
  Users,
  Swords,
  Package,
  Skull,
  Map as MapIcon,
  PawPrint,
  ScrollText,
  type LucideIcon
} from 'lucide-react'

export type NavigationItem = {
  /** Translation key — resolves to `nav.<key>` in src/locales/*.json */
  key: string
  /** URL path. For content types this MUST match the folder name in content/ */
  path: string
  /** lucide-react icon (never an emoji) */
  icon: LucideIcon
  /** true → this path has MDX children served by content/ */
  isContentType?: boolean
}

/**
 * SINGLE SOURCE OF TRUTH for the site's top-level sections.
 * Editing this array automatically updates: header nav, sidebar, sitemap and
 * content loading. `path` doubles as the folder name under `content/<locale>/`.
 */
/**
 * Eight top-level content types — the course caps a wiki at 8 categories.
 * Order matters: it is also the order shown in the header and sidebar.
 */
export const NAVIGATION_CONFIG: NavigationItem[] = [
  { key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
  { key: 'classes', path: '/classes', icon: Users, isContentType: true },
  { key: 'weapons', path: '/weapons', icon: Swords, isContentType: true },
  { key: 'items', path: '/items', icon: Package, isContentType: true },
  { key: 'entities', path: '/entities', icon: Skull, isContentType: true },
  { key: 'locations', path: '/locations', icon: MapIcon, isContentType: true },
  { key: 'taming', path: '/taming', icon: PawPrint, isContentType: true },
  { key: 'guides', path: '/guides', icon: ScrollText, isContentType: true }
]

/** Derived — never edit by hand. */
export const CONTENT_TYPES: string[] = NAVIGATION_CONFIG.filter(
  (item) => item.isContentType
).map((item) => item.path.replace(/^\//, ''))

export const CONTENT_TYPE_SET: ReadonlySet<string> = new Set(CONTENT_TYPES)

export const NAV_ITEMS: NavigationItem[] = NAVIGATION_CONFIG

export function findContentType(path: string): string | undefined {
  const normalized = path.replace(/^\//, '').split('/')[0]
  return CONTENT_TYPE_SET.has(normalized) ? normalized : undefined
}

export function findNavItem(path: string): NavigationItem | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return NAVIGATION_CONFIG.find((item) => item.path === normalized)
}

/** `tier-list` (folder) → `tierList` (translation key) */
export function navKeyForType(contentType: string): string {
  return findNavItem(contentType)?.key ?? contentType
}
