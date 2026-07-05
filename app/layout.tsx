import type { Metadata, Viewport } from 'next';
import { Funnel_Display } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { NavBar } from '@/components/global/Navbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  metadataBase: new URL('https://privacy-peek.vercel.app'),
  title: {
    default: 'Privacy Peek — Understand How Sites Handle Your Data',
    template: '%s | Privacy Peek',
  },
  description:
    'Scan and analyze privacy policies to get clear, actionable insights into how websites handle your personal data. Compare privacy practices across sites.',
  openGraph: {
    title: 'Privacy Peek — Privacy Policy Analyzer',
    description:
      'Get clear, actionable insights into how websites handle your personal data.',
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
