// app/layout.tsx (fixed for hydration error)
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { Toaster } from '@/components/ui/toaster';
import { WhatsAppFloatingIcon } from '@/components/WhatsAppFloatingIcon';

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className={inter.className}
        suppressHydrationWarning={true}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster />
        <WhatsAppFloatingIcon />
      </body>
    </html>
  );
}