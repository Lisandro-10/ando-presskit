import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'ANDO Studio',
  robots: 'noindex, nofollow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
