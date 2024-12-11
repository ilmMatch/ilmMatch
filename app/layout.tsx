import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';
import { AuthProvider } from '@/context/AuthProvider';
import { SidebarComponent } from '@/components/sidebar/app-sidebar';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <AuthProvider>
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
            <SidebarProvider>
              <SidebarComponent />
              <div className="relative flex flex-col w-full">
                <Navbar />
                <main className="container mx-auto px-6 flex-grow">
                  {children}
                </main>
                <footer className="w-full flex items-center justify-center py-3">
                  <Link
                    isExternal
                    className="flex items-center gap-1 text-current"
                    href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                    title="nextui.org homepage"
                  >
                    <span className="text-default-600">Powered by</span>
                    <p className="text-primary">NextUI</p>
                  </Link>
                </footer>
              </div>
            </SidebarProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
