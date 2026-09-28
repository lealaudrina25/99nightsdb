import './globals.css'

/**
 * Root layout is a pure passthrough — src/app/[locale]/layout.tsx owns
 * <html>, fonts and the i18n provider.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
