/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com'], // ✅ Allow external image domain
  },
  async rewrites() {
    return [
      {
        source: '/server-sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
};

export default nextConfig;
