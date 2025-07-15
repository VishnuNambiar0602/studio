import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Noto_Serif as FontHeadline, Plus_Jakarta_Sans as FontBody } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { PartProvider } from '@/context/part-context';
import { getParts } from '@/lib/actions';


const fontBody = FontBody({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = FontHeadline({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});


export const metadata: Metadata = {
  title: 'GulfCarX',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontBody.variable} ${fontHeadline.variable} font-body`}>
        <PartProvider initialParts={initialParts}>
          <CartProvider>
            {children}
          </CartProvider>
        </PartProvider>
        <Toaster />
      </body>
    </html>
  );
}
