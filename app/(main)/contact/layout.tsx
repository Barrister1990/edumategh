import { pageConfigs, seoConfig } from "@/config/seo";
import type { Metadata } from 'next';
export const metadata: Metadata = {
  ...seoConfig,
  ...pageConfigs.contact,
  alternates: {
    canonical: 'https://edumategh.com/contact'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
