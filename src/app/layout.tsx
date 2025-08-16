import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/footer';
import { Providers } from '@/components/providers';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

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
    // The RootLayout is a Server Component and MUST return <html> and <body>
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased flex flex-col', fontSans.variable)}>
          <Providers>
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
            <Toaster />
          </Providers>
      </body>
    </html>
  );
}
