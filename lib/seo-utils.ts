export function generatePageTitle(title: string, template?: string): string {
  if (template) {
    return template.replace('%s', title);
  }
  return `${title} | EduMate GH - AI Education Platform Ghana`;
}

export function generateCanonicalUrl(path: string): string {
  const baseUrl = 'https://edumategh.com';
  return `${baseUrl}${path}`;
}

export function generateMetaTags(config: any) {
  return {
    title: config.title,
    description: config.description,
    keywords: Array.isArray(config.keywords) ? config.keywords.join(', ') : config.keywords,
    openGraph: config.openGraph,
    twitter: config.twitter,
    canonical: generateCanonicalUrl(config.path || '/'),
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
  };
}

// Enhanced local SEO data for Ghana
export const localSEOData = {
  businessHours: [
    { day: 'Monday', opens: '08:00', closes: '17:00' },
    { day: 'Tuesday', opens: '08:00', closes: '17:00' },
    { day: 'Wednesday', opens: '08:00', closes: '17:00' },
    { day: 'Thursday', opens: '08:00', closes: '17:00' },
    { day: 'Friday', opens: '08:00', closes: '17:00' },
    { day: 'Saturday', opens: '09:00', closes: '13:00' },
    { day: 'Sunday', closes: 'closed' }
  ],
  serviceAreas: [
    'Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Takoradi', 'Ho', 'Koforidua',
    'Sunyani', 'Bolgatanga', 'Wa', 'Greater Accra Region', 'Ashanti Region',
    'Northern Region', 'Central Region', 'Western Region', 'Volta Region',
    'Eastern Region', 'Brong-Ahafo Region', 'Upper East Region', 'Upper West Region'
  ],
  languages: ['English', 'Twi', 'Ga', 'Ewe', 'Fante', 'Hausa', 'Dagbani']
};

// Page-specific structured data generators
export function generateArticleSchema(article: {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate: string;
  author: string;
  url: string;
  imageUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.imageUrl,
    "datePublished": article.publishDate,
    "dateModified": article.modifiedDate,
    "author": {
      "@type": "Organization",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "EduMate GH",
      "logo": {
        "@type": "ImageObject",
        "url": "https://edumategh.com/images/logo-512x512.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
}

export function generateSoftwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EduMate GH",
    "operatingSystem": ["iOS", "Android", "Web"],
    "applicationCategory": "EducationalApplication",
    "description": "AI-powered education platform for Ghana with voice learning, offline access, and GES curriculum alignment.",
    "downloadUrl": [
      "https://apps.apple.com/app/edumate-gh/id123456789",
      "https://play.google.com/store/apps/details?id=com.edumate.gh"
    ],
    "screenshot": [
      "https://edumategh.com/images/app-screenshot-1.jpg",
      "https://edumategh.com/images/app-screenshot-2.jpg",
      "https://edumategh.com/images/app-screenshot-3.jpg",
      "https://edumategh.com/images/app-screenshot-4.jpg"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "2547",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GHS",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "50,000+ Quiz Questions",
      "AI-Powered Tutoring",
      "Voice Learning with Ghanaian Accents",
      "Offline Access",
      "GES Curriculum Aligned",
      "Teacher Resource Generator",
      "Progress Analytics",
      "BECE & WASSCE Preparation",
      "Multi-language Support",
      "Collaborative Learning"
    ],
    "requirements": "iOS 12.0+ or Android 6.0+",
    "fileSize": "45MB",
    "version": "2.1.0",
    "datePublished": "2023-06-01",
    "creator": {
      "@type": "Organization",
      "name": "EduMate GH"
    }
  };
}

// Advanced SEO monitoring and analytics
export const seoAnalytics = {
  gtag: 'G-XXXXXXXXXX', // Replace with your Google Analytics ID
  gtm: 'GTM-XXXXXXX',   // Replace with your Google Tag Manager ID
  fbPixel: '1234567890', // Replace with your Facebook Pixel ID
  hotjar: '1234567',     // Replace with your Hotjar ID
  clarity: 'xxxxxxxxx'   // Replace with your Microsoft Clarity ID
};

// Critical Web Vitals optimization
export const performanceConfig = {
  preloadFonts: [
    '/fonts/inter-var.woff2',
    '/fonts/space-grotesk-var.woff2'
  ],
  preloadImages: [
    '/images/hero-bg.webp',
    '/images/app-preview.webp',
    '/images/logo-192x192.png'
  ],
  prefetchRoutes: [
    '/features',
    '/download',
    '/contact'
  ]
};

// Social media optimization
export const socialMediaConfig = {
  facebook: {
    appId: '123456789012345', // Replace with your Facebook App ID
    pages: ['EduMateGH'],
    admins: ['123456789']
  },
  twitter: {
    site: '@edumate_gh',
    creator: '@edumate_gh'
  },
  instagram: {
    profile: 'edumate_gh'
  },
  linkedin: {
    company: 'edumate-gh'
  },
  youtube: {
    channel: '@edumategh'
  }
};