
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter as FontSans } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { SettingsProvider, useSettings } from '@/context/settings-context';
import { cn } from '@/lib/utils';
import { PartProvider } from '@/context/part-context';
import { Footer } from '@/components/footer';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Client-side component to apply settings from context
function AppClientLayout({ children }: { children: React.ReactNode }) {
  'use client';
  const { language, fontSize } = useSettings();

  return (
    <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className={cn(fontSans.variable, `font-${fontSize}`)}>
      <body
        className={cn('min-h-screen bg-background font-sans antialiased flex flex-col')}
        suppressHydrationWarning={true}
      >
        <PartProvider>
            <CartProvider>
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </CartProvider>
          </PartProvider>
        <Toaster />
      </body>
    </html>
  );
}

// metadata can only be exported from a Server Component
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
    <SettingsProvider>
      <AppClientLayout>{children}</AppClientLayout>
    </SettingsProvider>
  );
}
