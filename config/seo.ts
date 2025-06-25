// lib/seo.ts
import type { Metadata, Viewport } from 'next';


export const viewportConfig: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light', // or 'dark' or 'light dark' depending on your needs
};

export const seoConfig: Metadata = {
  metadataBase: new URL('https://edumategh.com'),
  title: {
    default: 'EduMate GH - #1 AI-Powered Education App for Ghana Students & Teachers | GES Curriculum Aligned',
    template: '%s | EduMate GH - AI Education Platform Ghana'
  },
  description: 'EduMate GH is Ghana\'s leading AI-powered education app with 50,000+ quiz questions, voice learning, offline access, and GES curriculum alignment. Join 50K+ students and 2K+ teachers improving grades by 95%. Download for iOS & Android.',
  keywords: [
    // Primary Keywords
    'Ghana education app', 'AI education Ghana', 'GES curriculum app', 'BECE preparation app', 'WASSCE preparation Ghana',
    // Student-focused
    'Ghana student app', 'learn offline Ghana', 'voice learning app', 'AI tutor Ghana', 'quiz app Ghana',
    // Teacher-focused  
    'teacher resources Ghana', 'lesson plan generator', 'exam questions generator', 'Ghana teacher app',
    // Curriculum specific
    'Basic education Ghana', 'Senior High School Ghana', 'curriculum aligned learning', 'Ghana syllabus app',
    // Technology
    'educational technology Ghana', 'EdTech Ghana', 'personalized learning', 'adaptive learning',
    // Local SEO
    'education app Accra', 'learning app Kumasi', 'student app Tamale', 'Ghana EdTech',
    // Competition
    'best education app Ghana', 'top learning app West Africa', 'Ghana e-learning platform'
  ],
  authors: [
    { name: 'EduMate GH Development Team', url: 'https://edumategh.com/about' },
    { name: 'Ghana Education Technology Experts' }
  ],
  creator: 'EduMate GH - Ghana EdTech Innovation',
  publisher: 'EduMate GH Educational Technology',
  applicationName: 'EduMate GH',
  category: 'Education',
  classification: 'Educational Technology Application',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    alternateLocale: ['en_US', 'en_GB'],
    url: 'https://edumategh.com',
    siteName: 'EduMate GH - AI Education Platform Ghana',
    title: 'EduMate GH - Transform Ghana Education with AI | 50K+ Students, 95% Grade Improvement',
    description: 'Join Ghana\'s #1 AI education platform. 50,000+ quiz questions, voice learning, offline access, and GES curriculum alignment. Trusted by 50K+ students and 2K+ teachers.',
    images: [
      {
        url: 'https://edumategh.com/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'EduMate GH - AI-Powered Education App for Ghana Students',
        type: 'image/jpeg',
      },
      {
        url: 'https://edumategh.com/images/og-features.jpg',
        width: 1200,
        height: 630,
        alt: 'EduMate GH Features - Voice Learning, AI Tutor, Offline Access',
        type: 'image/jpeg',
      },
      {
        url: 'https://edumategh.com/images/og-app-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'EduMate GH Mobile App Interface - Student Dashboard',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduMate GH - Ghana\'s #1 AI Education App | 50K+ Students Trust Us',
    description: '🇬🇭 Transform your education with AI! 50K+ quiz questions, voice learning, offline access. GES curriculum aligned. Join 50K+ students improving grades by 95%! 📚✨',
    creator: '@edumate_gh',
    site: '@edumate_gh',
    images: ['https://edumategh.com/images/twitter-card.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },

  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  themeColor: '#667eea',
  colorScheme: 'light dark',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EduMate GH',
    startupImage: '/apple-splash-screen.png'
  },
  verification: {
    google: 'your-google-search-console-verification-code',
  },
  alternates: {
    canonical: 'https://edumategh.com',
    languages: {
      'en-GH': 'https://edumategh.com',
      'en-US': 'https://edumategh.com/en-us',
      'x-default': 'https://edumategh.com'
    }
  },
  other: {
    'msapplication-TileColor': '#667eea',
    'msapplication-config': '/browserconfig.xml',
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#667eea',
    // Schema.org structured data will be added separately
    'application-name': 'EduMate GH',
    'apple-mobile-web-app-title': 'EduMate GH',
    'format-detection': 'telephone=no',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
  },
};

// Page-specific SEO configs
export const pageConfigs = {
  home: {
    title: 'EduMate GH - #1 AI Education App Ghana | 50K+ Students, 95% Grade Improvement',
    description: 'Transform your education with Ghana\'s leading AI-powered learning app. 50,000+ quiz questions, voice learning, offline access, GES curriculum aligned. Join 50K+ students and 2K+ teachers. Download now!',
    keywords: 'Ghana education app, AI learning Ghana, BECE preparation, WASSCE app, GES curriculum, student app Ghana, teacher resources',
    openGraph: {
      title: 'EduMate GH - Transform Ghana Education with AI | Trusted by 50K+ Students',
      description: 'Join Ghana\'s #1 AI education platform with 50K+ quiz questions, voice learning, and 95% grade improvement rate. GES curriculum aligned. Download for iOS & Android.',
      url: 'https://edumategh.com',
      images: [{ url: 'https://edumategh.com/images/og-home.jpg', width: 1200, height: 630 }]
    }
  },
  
  features: {
    title: 'Features - AI Tutor, Voice Learning & 50K+ Quiz Questions | EduMate GH',
    description: 'Discover EduMate GH\'s powerful features: 24/7 AI tutor, voice learning with Ghanaian accents, 50,000+ vetted quiz questions, offline access, lesson generators for teachers, and GES curriculum alignment.',
    keywords: 'AI tutor Ghana, voice learning app, quiz questions Ghana, offline learning, lesson generator, teacher resources, BECE questions, WASSCE preparation',
    openGraph: {
      title: 'EduMate GH Features - AI Tutor, Voice Learning & Teacher Resources',
      description: 'Explore comprehensive features: 24/7 AI tutor, 50K+ quiz questions, voice learning, offline access, and teacher tools. All aligned with Ghana\'s GES curriculum.',
      url: 'https://edumategh.com/features',
      images: [{ url: 'https://edumategh.com/images/og-features.jpg', width: 1200, height: 630 }]
    }
  },
  
  download: {
    title: 'Download EduMate GH - Free AI Education App for iOS & Android',
    description: 'Download EduMate GH for free on iOS App Store and Google Play Store. Start learning with AI-powered education, voice lessons, and offline access. Compatible with all devices.',
    keywords: 'download EduMate GH, iOS app store, Google Play Store, Ghana education app download, free learning app, student app download',
    openGraph: {
      title: 'Download EduMate GH - Free on iOS & Android | Start Learning Today',
      description: 'Get EduMate GH free on App Store and Google Play. AI-powered education with voice learning and offline access. Join 50K+ students in Ghana.',
      url: 'https://edumategh.com/download',
      images: [{ url: 'https://edumategh.com/images/og-download.jpg', width: 1200, height: 630 }]
    }
  },
  
  contact: {
    title: 'Contact EduMate GH - Support, Partnership & Feedback | Ghana EdTech',
    description: 'Get in touch with EduMate GH team. Email: hello@edumate.gh | Phone: +233 20 123 4567 | Visit us in Accra, Ghana. Support hours: Mon-Fri 8AM-5PM, Sat 9AM-1PM.',
    keywords: 'contact EduMate GH, Ghana education support, EdTech contact, customer service Ghana, partnership inquiries',
    openGraph: {
      title: 'Contact EduMate GH - Customer Support & Partnership Inquiries',  
      description: 'Reach out to EduMate GH for support, partnerships, or feedback. Located in Accra, Ghana. Available Mon-Fri 8AM-5PM.',
      url: 'https://edumategh.com/contact',
      images: [{ url: 'https://edumategh.com/images/og-contact.jpg', width: 1200, height: 630 }]
    }
  }
};

// Structured Data Schema for rich snippets and sitelinks
export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EduMate GH",
    "alternateName": ["EduMate Ghana", "EduMate GH App"],
    "url": "https://edumategh.com",
    "logo": "https://edumategh.com/images/logo-512x512.png",
    "description": "Ghana's leading AI-powered education platform with 50,000+ quiz questions, voice learning, and GES curriculum alignment.",
    "foundingDate": "2023",
    "foundingLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Innovation Street",
        "addressLocality": "Accra",
        "addressCountry": "Ghana"
      }
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+233-20-123-4567",
        "contactType": "customer service",
        "availableLanguage": ["English"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        }
      },
      {
        "@type": "ContactPoint",
        "email": "hello@edumate.gh",
        "contactType": "customer service"
      }
    ],
    "sameAs": [
      "https://twitter.com/edumate_gh",
      "https://facebook.com/edumategh",
      "https://instagram.com/edumate_gh",
      "https://linkedin.com/company/edumate-gh",
      "https://youtube.com/@edumategh"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Ghana"
    },
    "serviceType": "Educational Technology",
    "slogan": "Transform Education with AI"
  },

  mobileApplication: {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "EduMate GH",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": ["iOS", "Android"],
    "description": "AI-powered education app for Ghana students with 50,000+ quiz questions, voice learning, and GES curriculum alignment.",
    "downloadUrl": [
      "https://apps.apple.com/app/edumate-gh/id123456789",
      "https://play.google.com/store/apps/details?id=com.edumate.gh"
    ],
    "screenshot": [
      "https://edumategh.com/images/app-screenshot-1.jpg",
      "https://edumategh.com/images/app-screenshot-2.jpg",
      "https://edumategh.com/images/app-screenshot-3.jpg"
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
    "creator": {
      "@type": "Organization",
      "name": "EduMate GH"
    },
    "datePublished": "2023-06-01",
    "version": "2.1.0",
    "fileSize": "45MB",
    "permissions": ["Camera", "Microphone", "Storage"],
    "requirements": "iOS 12.0+ or Android 6.0+",
    "features": [
      "AI-Powered Learning",
      "Voice Learning",
      "Offline Access", 
      "50,000+ Quiz Questions",
      "GES Curriculum Aligned",
      "Teacher Resources"
    ]
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EduMate GH",
    "alternateName": "EduMate Ghana Education Platform",
    "url": "https://edumategh.com",
    "description": "Ghana's leading AI-powered education platform with comprehensive learning resources for students and teachers.",
    "inLanguage": "en-GH",
    "isAccessibleForFree": true,
    "publisher": {
      "@type": "Organization",
      "name": "EduMate GH"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": "https://edumategh.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "DownloadAction",
        "target": "https://edumategh.com/download",
        "object": {
          "@type": "MobileApplication",
          "name": "EduMate GH"
        }
      }
    ],
    "mainEntity": {
      "@type": "ItemList",
      "name": "EduMate GH Main Sitelinks",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Features",
          "description": "AI Tutor, Voice Learning, 50K+ Quiz Questions",
          "url": "https://edumategh.com/features"
        },
        {
          "@type": "SiteNavigationElement", 
          "position": 2,
          "name": "Download App",
          "description": "Download for iOS and Android",
          "url": "https://edumategh.com/download"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Contact Support",
          "description": "Get help and support",
          "url": "https://edumategh.com/contact"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "iOS App Store",
          "description": "Download from App Store",
          "url": "https://apps.apple.com/app/edumate-gh/id123456789"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "Google Play Store", 
          "description": "Download from Google Play",
          "url": "https://play.google.com/store/apps/details?id=com.edumate.gh"
        }
      ]
    }
  },

  educationalOrganization: {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduMate GH",
    "url": "https://edumategh.com",
    "description": "Educational technology organization providing AI-powered learning solutions aligned with Ghana's GES curriculum.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Innovation Street",
      "addressLocality": "Accra",
      "addressRegion": "Greater Accra",
      "postalCode": "GA-123-4567",
      "addressCountry": "GH"
    },
    "telephone": "+233-20-123-4567",
    "email": "hello@edumate.gh",
    "curriculumStandards": "Ghana Education Service (GES) Curriculum",
    "educationalLevel": ["Basic Education", "Senior High School"],
    "teachingLanguage": "English",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "EduMate GH Educational Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "AI-Powered Learning Platform",
            "description": "Comprehensive learning platform with voice learning and offline access"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Course",
            "name": "Teacher Resource Platform",
            "description": "Lesson planning and exam generation tools for educators"
          }
        }
      ]
    }
  },

  faqPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download EduMate GH?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduMate GH is available for free download on both iOS App Store and Google Play Store. Visit our download page or search 'EduMate GH' in your device's app store."
        }
      },
      {
        "@type": "Question",
        "name": "Is EduMate GH aligned with Ghana's curriculum?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Yes, EduMate GH is fully aligned with Ghana Education Service (GES) curriculum standards, organized by strands, sub-strands, content standards, and indicators for both Basic and Senior High School levels."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use EduMate GH offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, EduMate GH offers offline functionality. You can download lessons, quizzes, and resources to access them without an internet connection."
        }
      },
      {
        "@type": "Question",
        "name": "How many quiz questions are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduMate GH features over 50,000 vetted quiz questions across all subjects for Basic and Senior High School curriculum, with new questions added regularly."
        }
      }
    ]
  }
};

// Sitemap configuration for better indexing
export const sitemapConfig = {
  changeFrequency: {
    '/': 'daily',
    '/features': 'weekly', 
    '/download': 'weekly',
    '/contact': 'monthly'
  },
  priority: {
    '/': 1.0,
    '/features': 0.8,
    '/download': 0.9,
    '/contact': 0.6
  }
};