import { redirect } from 'next/navigation'

/** Safety net for direct hits on `/`. Normally the middleware rewrites first. */
export default function RootPage() {
  redirect('/en')
}
