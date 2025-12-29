import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ANDO - Progressive & Tech House DJ',
  description: 'Official presskit - Groove, Ritmos Bailables y Underground Elegante',
  keywords: ['ANDO', 'DJ', 'Progressive House', 'Tech House', 'Electronic Music'],
  openGraph: {
    title: 'ANDO - DJ Presskit',
    description: 'Progressive House & Tech House',
    type: 'website',
    images: ['/hero-bg.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
