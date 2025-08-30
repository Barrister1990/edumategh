import { pageConfigs, seoConfig } from "@/config/seo";
import type { Metadata } from 'next';
export const metadata: Metadata = {
  ...seoConfig,
  ...pageConfigs.download,
  alternates: {
    canonical: 'https://edumategh.com/download'
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
