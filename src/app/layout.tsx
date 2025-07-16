
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter as FontSans } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { PartProvider } from '@/context/part-context';
import { getParts } from '@/lib/actions';
import { SettingsProvider } from '@/context/settings-context';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Desert Drive Depot',
  description: 'AI-powered automotive parts platform for used, OEM, and new parts.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial parts on the server
  const initialParts = await getParts();

  return (
    <html lang="en" suppressHydrationWarning dir="ltr" className={fontSans.variable}>
      <body
        className={cn('min-h-screen bg-background font-sans antialiased')}
      >
        <SettingsProvider>
          <PartProvider initialParts={initialParts}>
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
