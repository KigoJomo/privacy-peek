import type { Metadata, Viewport } from 'next';
import { Funnel_Display } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { NavBar } from '@/components/global/Navbar';

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
            <NavBar />
            <div className="fixed -top-24 -left-24 -z-10 w-128 aspect-square rounded-full bg-gradient-to-br from-primary/10 via-accent/60 to-transparent blur-3xl" />
            <div className="fixed -bottom-24 -right-24 -z-10 w-128 aspect-square rounded-full bg-gradient-to-tl from-accent/60 via-primary/10 to-transparent blur-3xl" />
            {children}
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
