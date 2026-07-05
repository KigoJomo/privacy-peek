import type { Metadata, Viewport } from 'next';
import { Funnel_Display } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { NavBar } from '@/components/global/Navbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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

const funnel = Funnel_Display({
  variable: '--font-funnel',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="hide-scrollbar overflow-x-hidden overflow-y-auto relative">
      <body
        className={`${funnel.variable} antialiased overflow-x-hidden overflow-y-auto relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <ConvexClientProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>
            <NavBar />
            <div className="fixed -top-24 -left-24 -z-10 w-128 aspect-square rounded-full bg-gradient-to-br from-primary/15 via-accent/60 to-transparent blur-3xl animate-blob" />
            <div className="fixed -bottom-24 -right-24 -z-10 w-128 aspect-square rounded-full bg-gradient-to-tl from-accent/60 via-primary/15 to-transparent blur-3xl animate-blob-delayed" />
            <ErrorBoundary>
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
            </ErrorBoundary>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
