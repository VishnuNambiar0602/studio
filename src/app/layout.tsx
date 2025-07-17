
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter as FontSans } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { SettingsProvider } from '@/context/settings-context';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { PartProvider } from '@/context/part-context';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'GulfCarX',
  description: 'AI-powered automotive parts platform for used, OEM, and new parts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" dir="ltr" className={fontSans.variable}>
      <body
        className={cn('min-h-screen bg-background font-sans antialiased')}
        suppressHydrationWarning={true}
      >
        <SettingsProvider>
          <PartProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </PartProvider>
        </SettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}
