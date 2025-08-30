import { sitemapConfig } from '@/config/seo';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://edumategh.com';
  
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: sitemapConfig.changeFrequency['/'] as any,
      priority: sitemapConfig.priority['/']
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: sitemapConfig.changeFrequency['/features'] as any,
      priority: sitemapConfig.priority['/features']
    },
    {
      url: `${baseUrl}/download`,
      lastModified: new Date(),
      changeFrequency: sitemapConfig.changeFrequency['/download'] as any,
      priority: sitemapConfig.priority['/download']
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: sitemapConfig.changeFrequency['/contact'] as any,
      priority: sitemapConfig.priority['/contact']
    },
    // Additional important pages for sitelinks
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as any,
      priority: 0.7
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as any,
      priority: 0.5
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as any,
      priority: 0.5
    },
    // App store links for sitelinks
    {
      url: 'https://apps.apple.com/app/edumate-gh/id6747842263',
      lastModified: new Date(),
      changeFrequency: 'weekly' as any,
      priority: 0.9
    },
    {
      url: 'https://play.google.com/store/apps/details?id=com.edumategh.app',
      lastModified: new Date(),
      changeFrequency: 'weekly' as any,
      priority: 0.9
    }
  ];

  return routes;
}
