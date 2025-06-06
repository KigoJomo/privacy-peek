import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import Sidebar from '@/lib/components/navigation/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://privacy-peek.vercel.app'),
  title: 'Privacy Peek',
  description: 'Privacy Peek',
  openGraph: {
    title: 'Privacy Peek',
    description: 'Privacy Peek',
    type: 'website',
    url: 'https://privacy-peek.vercel.app',
    siteName: 'Privacy Peek',
    images: '/images/og.webp',
  },
};

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="hide-scrollbar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden flex`}>
        <ConvexClientProvider>
          <Sidebar />
          <main className="flex flex-col">
            {children}
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
