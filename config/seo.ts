// lib/seo.ts
import type { Metadata, Viewport } from 'next';


export const viewportConfig: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#667eea' }
  ],
  colorScheme: 'light dark',
};

export const seoConfig: Metadata = {
  metadataBase: new URL('https://edumategh.com'),
  title: {
    default: 'EduMate GH - #1 AI-Powered Education App for Ghana Students & Teachers | BECE, WASSCE, NOVDEC Past Questions & GES Curriculum',
    template: '%s | EduMate GH - AI Education Platform Ghana'
  },
  description: 'EduMate GH is Ghana\'s leading AI-powered education app with 50,000+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, voice learning, offline access, and comprehensive study materials. Join 50K+ students and 2K+ teachers improving grades by 95%. Download for iOS & Android.',
  keywords: [
    // Primary Brand Keywords - High Search Volume
    'EduMate', 'EduMate GH', 'EduMate Ghana', 'EduMate app', 'EduMate education',
    'EduMate learning', 'EduMate Ghana app', 'EduMate GH app', 'EduMate GH education',
    
    // High-Ranking Educational Keywords
    'Past Questions', 'past questions Ghana', 'past questions app', 'past questions online',
    'BECE past questions', 'BECE past questions Ghana', 'BECE past questions app',
    'WASSCE past questions', 'WASSCE past questions Ghana', 'WASSCE past questions app',
    'NOVDEC past questions', 'NOVDEC past questions Ghana', 'NOVDEC past questions app',
    
    // Curriculum & GES Keywords
    'Curriculum', 'GES curriculum', 'Ghana curriculum', 'curriculum app', 'curriculum online',
    'GES lessons', 'GES lessons Ghana', 'GES lessons app', 'GES curriculum lessons',
    'Ghana Education Service', 'GES curriculum app', 'GES curriculum online',
    
    // Quiz & Assessment Keywords
    'Quizzes', 'quiz app', 'quiz Ghana', 'online quiz', 'educational quiz',
    'practice quiz', 'quiz questions', 'quiz app Ghana', 'quiz online Ghana',
    'BECE quiz', 'WASSCE quiz', 'NOVDEC quiz', 'GES quiz',
    
    // Subject-Specific Keywords
    'Mathematics past questions', 'Integrated Science past questions', 'English past questions',
    'Social Studies past questions', 'Core Mathematics past questions', 'Elective Mathematics past questions',
    'Physics past questions', 'Chemistry past questions', 'Biology past questions',
    
    // Exam Preparation Keywords
    'BECE preparation', 'WASSCE preparation', 'NOVDEC preparation', 'exam preparation Ghana',
    'BECE study guide', 'WASSCE study guide', 'NOVDEC study guide', 'exam study guide Ghana',
    'BECE practice', 'WASSCE practice', 'NOVDEC practice', 'exam practice Ghana',
    
    // Technology & Features
    'AI education Ghana', 'AI learning app', 'voice learning Ghana', 'offline learning app',
    'AI tutor Ghana', 'smart education Ghana', 'digital learning Ghana', 'EdTech Ghana',
    
    // Local SEO - Geographic Targeting
    'education app Accra', 'learning app Kumasi', 'student app Tamale', 'Ghana EdTech',
    'Ghana learning platform', 'West Africa education app', 'African EdTech',
    
    // Competition & Market Positioning
    'best education app Ghana', 'top learning app West Africa', 'Ghana e-learning platform',
    '#1 education app Ghana', 'leading learning platform Ghana', 'best past questions app'
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
    title: 'EduMate GH - Transform Ghana Education with AI | 50K+ Students, 95% Grade Improvement | BECE, WASSCE, NOVDEC Past Questions & GES Curriculum',
    description: 'Join Ghana\'s #1 AI education platform. 50,000+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, voice learning, offline access, and comprehensive study materials. Trusted by 50K+ students and 2K+ teachers.',
    images: [
      {
        url: 'https://edumategh.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EduMate GH - AI-Powered Education App with BECE, WASSCE, NOVDEC Past Questions & GES Curriculum',
        type: 'image/png',
      }
    ],
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
    // Schema.org structured data will be added separately
    'application-name': 'EduMate GH',
    'apple-mobile-web-app-title': 'EduMate GH',
    'format-detection': 'telephone=no',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
    // WhatsApp specific meta tags
    'og:image:type': 'image/png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'EduMate GH - AI-Powered Education App for Ghana Students',
    'theme-color': '#10b981',
    // Additional WhatsApp support
    'og:image:secure_url': 'https://edumategh.com/images/og-image-main.png'
  },
};

// Page-specific SEO configs
export const pageConfigs = {
  home: {
    title: 'EduMate GH - #1 AI Education App Ghana | 50K+ Students, 95% Grade Improvement | BECE, WASSCE, NOVDEC Past Questions & GES Curriculum',
    description: 'Transform your education with EduMate GH - Ghana\'s leading AI-powered learning app. Access 50,000+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, and comprehensive study materials. Join 50K+ students and 2K+ teachers improving grades by 95%. Download free for iOS & Android.',
    keywords: [
      // Primary Brand Keywords - High Search Volume
      'EduMate', 'EduMate GH', 'EduMate Ghana', 'EduMate app', 'EduMate education',
      'EduMate learning', 'EduMate Ghana app', 'EduMate GH app', 'EduMate GH education',
      
      // High-Ranking Educational Keywords
      'Past Questions', 'past questions Ghana', 'past questions app', 'past questions online',
      'BECE past questions', 'BECE past questions Ghana', 'BECE past questions app',
      'WASSCE past questions', 'WASSCE past questions Ghana', 'WASSCE past questions app',
      'NOVDEC past questions', 'NOVDEC past questions Ghana', 'NOVDEC past questions app',
      
      // Curriculum & GES Keywords
      'Curriculum', 'GES curriculum', 'Ghana curriculum', 'curriculum app', 'curriculum online',
      'GES lessons', 'GES lessons Ghana', 'GES lessons app', 'GES curriculum lessons',
      'Ghana Education Service', 'GES curriculum app', 'GES curriculum online',
      
      // Quiz & Assessment Keywords
      'Quizzes', 'quiz app', 'quiz Ghana', 'online quiz', 'educational quiz',
      'practice quiz', 'quiz questions', 'quiz app Ghana', 'quiz online Ghana',
      'BECE quiz', 'WASSCE quiz', 'NOVDEC quiz', 'GES quiz',
      
      // Subject-Specific Keywords
      'Mathematics past questions', 'Integrated Science past questions', 'English past questions',
      'Social Studies past questions', 'Core Mathematics past questions', 'Elective Mathematics past questions',
      'Physics past questions', 'Chemistry past questions', 'Biology past questions',
      
      // Exam Preparation Keywords
      'BECE preparation', 'WASSCE preparation', 'NOVDEC preparation', 'exam preparation Ghana',
      'BECE study guide', 'WASSCE study guide', 'NOVDEC study guide', 'exam study guide Ghana',
      'BECE practice', 'WASSCE practice', 'NOVDEC practice', 'exam practice Ghana',
      
      // Technology & Features
      'AI education Ghana', 'AI learning app', 'voice learning Ghana', 'offline learning app',
      'AI tutor Ghana', 'smart education Ghana', 'digital learning Ghana', 'EdTech Ghana',
      
      // Local SEO - Geographic Targeting
      'education app Accra', 'learning app Kumasi', 'student app Tamale', 'Ghana EdTech platform',
      'West Africa education app', 'African learning platform', 'Ghana digital education',
      
      // Competition & Market Positioning
      '#1 education app Ghana', 'leading learning platform West Africa', 'best student app Ghana',
      'top teacher resources Ghana', 'premium education technology Ghana', 'best past questions app'
    ].join(', '),
    openGraph: {
      title: 'EduMate GH - Transform Ghana Education with AI | BECE, WASSCE, NOVDEC Past Questions & GES Curriculum',
      description: 'Join Ghana\'s #1 AI education platform with 50K+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, and comprehensive study materials. Download free for iOS & Android.',
      url: 'https://edumategh.com',
      siteName: 'EduMate GH - AI Education Platform Ghana',
      locale: 'en_GH',
      type: 'website',
      images: [
        { 
          url: 'https://edumategh.com/og-image.png', 
          width: 1200, 
          height: 630,
          alt: 'EduMate GH - AI-Powered Education App with BECE, WASSCE, NOVDEC Past Questions & GES Curriculum'
        },
        {
          url: 'https://edumategh.com/og-image-mobile.png',
          width: 600,
          height: 315,
          alt: 'EduMate GH Mobile - Ghana Education App with Past Questions & Curriculum'
        }
      ]
    },
    additionalMetaTags: [
      {
        name: 'application-name',
        content: 'EduMate GH'
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'EduMate GH'
      },
      {
        name: 'msapplication-TileColor',
        content: '#667eea'
      },
      {
        name: 'theme-color',
        content: '#667eea'
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      {
        name: 'HandheldFriendly',
        content: 'true'
      },
      {
        name: 'MobileOptimized',
        content: '320'
      },
      // Enhanced SEO Meta Tags
      {
        name: 'keywords',
        content: 'EduMate, EduMate GH, Past Questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum, GES lessons, Quizzes, Ghana education, AI education'
      },
      {
        name: 'author',
        content: 'EduMate GH - Ghana Education Technology'
      },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      },
      {
        name: 'googlebot',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      }
    ]
  },
  
  privacy: {
    title: 'Privacy Policy - EduMate GH | Data Protection & User Privacy Ghana',
    description: 'EduMate GH privacy policy and data protection practices. Learn how we protect student and teacher data in our Ghana education app.',
    keywords: 'EduMate GH privacy, Ghana education app privacy, data protection, student privacy, teacher data security, Ghana EdTech privacy',
    openGraph: {
      title: 'Privacy Policy - EduMate GH Educational App',
      description: 'Learn about EduMate GH data protection practices and how we safeguard student and teacher information in Ghana.',
      url: 'https://edumategh.com/privacy',
      images: [{ url: 'https://edumategh.com/og-image.png', width: 1200, height: 630 }]
    }
  },
  
  features: {
    title: 'EduMate GH Features - AI Tutor, Voice Learning & 50K+ Past Questions | BECE, WASSCE, NOVDEC & GES Curriculum',
    description: 'Discover EduMate GH\'s powerful features: 24/7 AI tutor, voice learning with Ghanaian accents, 50,000+ past questions including BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, offline access, and comprehensive teacher resources.',
    keywords: [
      // Brand Keywords
      'EduMate features', 'EduMate GH features', 'EduMate app features', 'EduMate Ghana features',
      
      // High-Ranking Educational Keywords
      'Past Questions features', 'BECE past questions features', 'WASSCE past questions features',
      'NOVDEC past questions features', 'GES curriculum features', 'GES lessons features',
      'Quiz features', 'quiz app features', 'educational quiz features',
      
      // AI & Technology Features
      'AI tutor features', 'AI learning features', 'voice learning features', 'offline learning features',
      'AI education features', 'smart education features', 'digital learning features',
      
      // Subject-Specific Features
      'Mathematics features', 'Science features', 'English features', 'Social Studies features',
      'Core Mathematics features', 'Elective Mathematics features', 'Physics features',
      'Chemistry features', 'Biology features',
      
      // Exam Preparation Features
      'BECE preparation features', 'WASSCE preparation features', 'NOVDEC preparation features',
      'exam preparation features', 'study guide features', 'practice test features',
      
      // Teacher & Student Features
      'teacher resources features', 'student app features', 'lesson plan features',
      'curriculum alignment features', 'progress tracking features'
    ].join(', '),
    openGraph: {
      title: 'EduMate GH Features - AI Tutor, Voice Learning & 50K+ Past Questions | BECE, WASSCE, NOVDEC & GES Curriculum',
      description: 'Explore comprehensive features: 24/7 AI tutor, 50K+ past questions including BECE, WASSCE, NOVDEC past questions, GES curriculum lessons, voice learning, offline access, and teacher tools. All aligned with Ghana\'s GES curriculum.',
      url: 'https://edumategh.com/features',
      images: [{ url: 'https://edumategh.com/og-image.png', width: 1200, height: 630 }]
    }
  },
  
  download: {
    title: 'Download EduMate GH - Free AI Education App with BECE, WASSCE, NOVDEC Past Questions & GES Curriculum | iOS & Android',
    description: 'Download EduMate GH for free on iOS App Store and Google Play Store. Access 50K+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, and AI-powered learning. Start learning with EduMate GH today!',
    keywords: [
      // Brand Keywords
      'Download EduMate', 'Download EduMate GH', 'Download EduMate Ghana', 'EduMate app download',
      'EduMate GH app download', 'EduMate Ghana app download', 'EduMate download',
      
      // High-Ranking Educational Keywords
      'Download past questions app', 'Download BECE past questions app', 'Download WASSCE past questions app',
      'Download NOVDEC past questions app', 'Download GES curriculum app', 'Download GES lessons app',
      'Download quiz app', 'Download educational quiz app', 'Download curriculum app',
      
      // Platform-Specific Keywords
      'iOS app download', 'Android app download', 'App Store download', 'Google Play download',
      'iPhone app download', 'iPad app download', 'Android phone app download', 'Android tablet app download',
      
      // Subject-Specific Download Keywords
      'Download Mathematics app', 'Download Science app', 'Download English app', 'Download Social Studies app',
      'Download Core Mathematics app', 'Download Elective Mathematics app', 'Download Physics app',
      'Download Chemistry app', 'Download Biology app',
      
      // Exam Preparation Download Keywords
      'Download BECE preparation app', 'Download WASSCE preparation app', 'Download NOVDEC preparation app',
      'Download exam preparation app', 'Download study guide app', 'Download practice test app',
      
      // Technology Download Keywords
      'Download AI education app', 'Download AI learning app', 'Download voice learning app',
      'Download offline learning app', 'Download smart education app', 'Download digital learning app'
    ].join(', '),
    openGraph: {
      title: 'Download EduMate GH - Free AI Education App with BECE, WASSCE, NOVDEC Past Questions & GES Curriculum',
      description: 'Get EduMate GH free on App Store and Google Play. Access 50K+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, and AI-powered learning. Join 50K+ students in Ghana.',
      url: 'https://edumategh.com/download',
      images: [{ url: 'https://edumategh.com/og-image.png', width: 1200, height: 630 }]
    }
  }
};

// Structured Data Schema for rich snippets and sitelinks
export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EduMate GH",
    "alternateName": ["EduMate Ghana", "EduMate GH App", "EduMate", "EduMate Education"],
    "url": "https://edumategh.com",
    "logo": "https://edumategh.com/images/logo-512x512.png",
    "description": "Ghana's leading AI-powered education platform with 50,000+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, voice learning, and comprehensive study materials.",
    "foundingDate": "2023",
    "foundingLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Accra",
        "addressCountry": "Ghana"
      }
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+233-241-940-783",
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
        "email": "edumategh@gmail.com",
        "contactType": "customer service"
      }
    ],
    "sameAs": [
      "https://facebook.com/edumategh",
      "https://instagram.com/edumate_gh",
      "https://tiktok.com/@edumategh",
      "https://youtube.com/@edumategh"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Ghana"
    },
    "serviceType": "Educational Technology",
    "slogan": "Transform Education with AI",
    "keywords": "EduMate, EduMate GH, Past Questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum, GES lessons, Quizzes, Ghana education, AI education"
  },

  mobileApplication: {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "EduMate GH",
    "alternateName": ["EduMate", "EduMate Ghana", "EduMate Education App"],
    "applicationCategory": "EducationalApplication",
    "operatingSystem": ["iOS", "Android"],
    "description": "AI-powered education app for Ghana students with 50,000+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, voice learning with Ghanaian accents, offline access, and comprehensive study materials. Trusted by 50K+ students and 2K+ teachers.",
    "downloadUrl": [
      "https://apps.apple.com/app/edumate-gh/id6747842263",
      "https://play.google.com/store/apps/details?id=com.edumate.gh"
    ],
    "screenshot": [
      "https://edumategh.com/images/Home.jpg",
      "https://edumategh.com/images/quiz.jpg",
      "https://edumategh.com/images/result.jpg",
      "https://edumategh.com/images/generate.jpg",
      "https://edumategh.com/images/AI.jpg"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "2547",
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": "1893"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Kwame Asante"
        },
        "reviewBody": "EduMate GH helped me improve my BECE scores significantly. The AI tutor is amazing and the voice learning feature is perfect for Ghanaian students. The past questions and GES curriculum alignment are excellent!"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Ama Osei"
        },
        "reviewBody": "As a teacher, this app has revolutionized my lesson planning. The AI-generated content is curriculum-aligned and saves me hours of work. The BECE, WASSCE, and NOVDEC past questions are comprehensive."
      }
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GHS",
      "availability": "https://schema.org/InStock",
      "description": "Free download with premium features available"
    },
    "creator": {
      "@type": "Organization",
      "name": "EduMate GH"
    },
    "datePublished": "2025-10-01",
    "dateModified": "2025-10-07",
    "version": "1.0.0",
    "fileSize": "90MB",
    "permissions": ["Camera", "Microphone", "Storage", "Internet"],
    "requirements": "iOS 12.0+ or Android 6.0+",
    "features": [
      "AI-Powered Learning",
      "Voice Learning with Ghanaian Accents",
      "Offline Access", 
      "50,000+ Vetted Past Questions",
      "BECE Past Questions",
      "WASSCE Past Questions",
      "NOVDEC Past Questions",
      "GES Curriculum Alignment",
      "GES Lessons",
      "Comprehensive Quizzes",
      "Teacher Resources & Lesson Plans",
      "Personalized Learning Paths",
      "Progress Tracking",
      "Multi-language Support"
    ],
    "educationalLevel": ["Basic Education", "Senior High School"],
    "curriculumStandards": "Ghana Education Service (GES)",
    "subjectArea": [
      "Mathematics", "Integrated Science", "English Language", "Social Studies",
      "Core Mathematics", "Elective Mathematics", "Physics", "Chemistry", "Biology"
    ],
    "keywords": "EduMate, EduMate GH, Past Questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum, GES lessons, Quizzes, Ghana education, AI education"
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EduMate GH",
    "alternateName": ["EduMate Ghana", "EduMate Education Platform", "EduMate", "EduMate GH App"],
    "url": "https://edumategh.com",
    "description": "Ghana's leading AI-powered education platform with comprehensive learning resources including 50K+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, and study materials for students and teachers.",
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
          "description": "AI Tutor, Voice Learning, 50K+ Past Questions, BECE, WASSCE, NOVDEC & GES Curriculum",
          "url": "https://edumategh.com/features"
        },
        {
          "@type": "SiteNavigationElement", 
          "position": 2,
          "name": "Download App",
          "description": "Download EduMate GH for iOS and Android with Past Questions & GES Curriculum",
          "url": "https://edumategh.com/download"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Contact Support",
          "description": "Get help and support for EduMate GH app",
          "url": "https://edumategh.com/contact"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "iOS App Store",
          "description": "Download EduMate GH from App Store",
          "url": "https://apps.apple.com/app/edumate-gh/id6747842263"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "Google Play Store", 
          "description": "Download EduMate GH from Google Play",
          "url": "https://play.google.com/store/apps/details?id=com.edumategh.app"
        }
      ]
    },
    "keywords": "EduMate, EduMate GH, Past Questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum, GES lessons, Quizzes, Ghana education, AI education"
  },

  educationalOrganization: {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduMate GH",
    "url": "https://edumategh.com",
    "description": "Educational technology organization providing AI-powered learning solutions aligned with Ghana's GES curriculum.",
    "address": {
      "@type": "PostalAddress",
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

  educationalContent: {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "EduMate GH Educational Resources",
    "description": "Comprehensive collection of educational content including 50K+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, and study materials aligned with Ghana's GES curriculum",
    "numberOfItems": "50000",
    "itemListElement": [
      {
        "@type": "Course",
        "position": 1,
        "name": "BECE Preparation Course",
        "description": "Complete preparation course for Basic Education Certificate Examination with BECE past questions, practice questions, AI tutoring, and comprehensive study materials",
        "educationalLevel": "Basic Education",
        "curriculumStandards": "GES Curriculum",
        "subjectArea": ["Mathematics", "Integrated Science", "English Language", "Social Studies"],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "GHS",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Course",
        "position": 2,
        "name": "WASSCE Preparation Course",
        "description": "Comprehensive preparation for West African Senior School Certificate Examination with WASSCE past questions, AI-powered learning, and targeted practice materials",
        "educationalLevel": "Senior High School",
        "curriculumStandards": "GES Curriculum",
        "subjectArea": ["Core Mathematics", "Elective Mathematics", "Physics", "Chemistry", "Biology"],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "GHS",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Course",
        "position": 3,
        "name": "NOVDEC Preparation Course",
        "description": "Specialized preparation for November/December examination with NOVDEC past questions, targeted practice, AI tutoring, and comprehensive study resources",
        "educationalLevel": "Senior High School",
        "curriculumStandards": "GES Curriculum",
        "subjectArea": ["Core Mathematics", "Elective Mathematics", "Physics", "Chemistry", "Biology"],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "GHS",
          "availability": "https://schema.org/InStock"
        }
      }
    ],
    "keywords": "EduMate, EduMate GH, Past Questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum, GES lessons, Quizzes, Ghana education, AI education"
  },

  learningResource: {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": "EduMate GH Learning Platform",
    "alternateName": ["EduMate Learning Platform", "EduMate GH Education Platform"],
    "description": "AI-powered learning platform with 50,000+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, voice learning, offline access, and comprehensive study materials",
    "educationalLevel": ["Basic Education", "Senior High School"],
    "curriculumStandards": "Ghana Education Service (GES) Curriculum",
    "subjectArea": [
      "Mathematics", "Integrated Science", "English Language", "Social Studies",
      "Core Mathematics", "Elective Mathematics", "Physics", "Chemistry", "Biology"
    ],
    "learningResourceType": ["Past Questions", "Quiz", "Lesson Plan", "Practice Test", "Video Tutorial", "Audio Lesson", "Study Guide"],
    "interactivityType": "active",
    "isAccessibleForFree": true,
    "inLanguage": "en-GH",
    "audience": {
      "@type": "Audience",
      "audienceType": "Students and Teachers in Ghana"
    },
    "creator": {
      "@type": "Organization",
      "name": "EduMate GH"
    },
    "provider": {
      "@type": "Organization",
      "name": "EduMate GH",
      "url": "https://edumategh.com"
    },
    "keywords": "EduMate, EduMate GH, Past Questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum, GES lessons, Quizzes, Ghana education, AI education"
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
          "text": "EduMate GH is available for free download on both iOS App Store and Google Play Store. Visit our download page or search 'EduMate GH' in your device's app store. The app is compatible with iOS 12.0+ and Android 6.0+ devices."
        }
      },
      {
        "@type": "Question",
        "name": "Is EduMate GH aligned with Ghana's curriculum?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Yes, EduMate GH is fully aligned with Ghana Education Service (GES) curriculum standards, organized by strands, sub-strands, content standards, and indicators for both Basic and Senior High School levels. All content follows the official GES curriculum guidelines."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use EduMate GH offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, EduMate GH offers comprehensive offline functionality. You can download lessons, quizzes, and resources to access them without an internet connection. This feature is especially useful for students in areas with limited internet access."
        }
      },
      {
        "@type": "Question",
        "name": "How many quiz questions are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduMate GH features over 50,000 vetted quiz questions across all subjects for Basic and Senior High School curriculum, with new questions added regularly. Questions are categorized by subject, topic, and difficulty level for targeted practice."
        }
      },
      {
        "@type": "Question",
        "name": "Does EduMate GH support voice learning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, EduMate GH features advanced voice learning technology with Ghanaian accents. Students can listen to lessons, practice pronunciation, and engage with audio content that's culturally relevant and easy to understand."
        }
      },
      {
        "@type": "Question",
        "name": "Is EduMate GH free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduMate GH is completely free to download and use. All core features including AI tutoring, quiz questions, voice learning, and offline access are available at no cost. Premium features may be available for enhanced learning experiences."
        }
      },
      {
        "@type": "Question",
        "name": "How does the AI tutor work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduMate GH's AI tutor provides personalized learning experiences by analyzing student performance, identifying knowledge gaps, and recommending targeted practice. It adapts to individual learning styles and provides real-time feedback and explanations."
        }
      },
      {
        "@type": "Question",
        "name": "Can teachers use EduMate GH?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! EduMate GH includes comprehensive teacher resources including AI-powered lesson plan generators, exam question creators, progress tracking tools, and curriculum-aligned content. Teachers can create custom quizzes and track student performance."
        }
      },
      {
        "@type": "Question",
        "name": "What subjects are covered in EduMate GH?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduMate GH covers all major subjects including Mathematics, Integrated Science, English Language, Social Studies, Core Mathematics, Elective Mathematics, Physics, Chemistry, and Biology. Content is organized according to GES curriculum standards."
        }
      },
      {
        "@type": "Question",
        "name": "How can I track my learning progress?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EduMate GH provides comprehensive progress tracking including performance analytics, subject mastery levels, quiz scores, time spent learning, and personalized recommendations. Students can view detailed reports and identify areas for improvement."
        }
      }
    ]
  },

  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "EduMate GH",
    "alternateName": "EduMate Ghana",
    "description": "Ghana's leading AI-powered education technology company providing comprehensive learning solutions for students and teachers",
    "url": "https://edumategh.com",
    "telephone": "+233-241-940-783",
    "email": "edumategh@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Osu Street",
      "addressLocality": "Accra",
      "addressRegion": "Greater Accra",
      "postalCode": "GA-123-4567",
      "addressCountry": "GH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "5.5600",
      "longitude": "-0.2057"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "priceRange": "Free",
    "paymentAccepted": ["Free", "Credit Card", "Mobile Money"],
    "currenciesAccepted": "GHS",
    "areaServed": {
      "@type": "Country",
      "name": "Ghana"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "7.9465",
        "longitude": "-1.0232"
      },
      "geoRadius": "500000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "EduMate GH Educational Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI-Powered Learning Platform",
            "description": "Comprehensive learning platform with voice learning and offline access"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Teacher Resource Platform",
            "description": "Lesson planning and exam generation tools for educators"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Student Progress Tracking",
            "description": "Comprehensive analytics and progress monitoring for students"
          }
        }
      ]
    },
    "sameAs": [
      "https://twitter.com/edumate_gh",
      "https://facebook.com/edumategh",
      "https://instagram.com/edumate_gh",
      "https://linkedin.com/company/edumate-gh",
      "https://youtube.com/@edumategh"
    ]
  }
};

// Sitemap configuration for better indexing
export const sitemapConfig = {
  changeFrequency: {
    '/': 'daily',
    '/features': 'weekly', 
    '/download': 'weekly',
    '/contact': 'monthly',
    '/terms': 'yearly',
    '/privacy': 'yearly',
    '/about': 'monthly',
    '/blog': 'weekly',
    '/support': 'monthly',
    '/partners': 'monthly',
    '/careers': 'monthly'
  },
  priority: {
    '/': 1.0,
    '/features': 0.9,
    '/download': 0.95,
    '/contact': 0.7,
    '/about': 0.6,
    '/blog': 0.8,
    '/support': 0.6,
    '/partners': 0.5,
    '/careers': 0.4,
    '/terms': 0.3,
    '/privacy': 0.3
  },
  excludeFromSitemap: [
    '/admin',
    '/api',
    '/_next',
    '/404',
    '/500'
  ],
  additionalPaths: [
    '/features/ai-tutor',
    '/features/voice-learning',
    '/features/offline-access',
    '/features/teacher-resources',
    '/download/ios',
    '/download/android',
    '/download/web-app',
    '/contact/support',
    '/contact/partnership',
    '/contact/feedback'
  ]
};

// Performance and Technical SEO Optimizations
export const performanceConfig = {
  coreWebVitals: {
    targetLCP: 2.5, // Largest Contentful Paint (seconds)
    targetFID: 100, // First Input Delay (milliseconds)
    targetCLS: 0.1, // Cumulative Layout Shift
    targetFCP: 1.8, // First Contentful Paint (seconds)
    targetTTFB: 600  // Time to First Byte (milliseconds)
  },
  
  imageOptimization: {
    formats: ['webp', 'avif', 'png', 'jpg'],
    sizes: [
      { width: 320, suffix: 'sm' },
      { width: 640, suffix: 'md' },
      { width: 1024, suffix: 'lg' },
      { width: 1920, suffix: 'xl' }
    ],
    quality: 85,
    placeholder: 'blur'
  },
  
  caching: {
    staticAssets: '1 year',
    images: '1 month',
    apiResponses: '1 hour',
    htmlPages: '1 day'
  },
  
  security: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    }
  },
  
  compression: {
    gzip: true,
    brotli: true,
    minify: {
      html: true,
      css: true,
      js: true,
      images: true
    }
  }
};

// Social Media SEO Configuration
export const socialMediaConfig = {
  // Platform-specific configurations
  platforms: {
    // Facebook Configuration
    facebook: {
      appId: 'your-facebook-app-id',
      pageId: 'edumategh',
      pixelId: 'your-facebook-pixel-id',
      ogType: 'website',
      ogLocale: 'en_GH',
      ogSiteName: 'EduMate GH - AI Education Platform Ghana'
    },

    // Instagram Configuration
    instagram: {
      username: '@edumate_gh',
      businessAccount: true,
      hashtags: ['#EduMateGH', '#AIEducation', '#GhanaEducation', '#BECE', '#WASSCE', '#NOVDEC', '#GESCurriculum'],
      storyHighlights: ['BECE Past Questions', 'WASSCE Past Questions', 'NOVDEC Past Questions', 'GES Curriculum', 'AI Tutoring']
    },

    // TikTok Configuration
    tiktok: {
      username: '@edumategh',
      businessAccount: true,
      hashtags: ['#EduMateGH', '#AIEducation', '#GhanaEducation', '#BECE', '#WASSCE', '#NOVDEC', '#GESCurriculum', '#EducationTikTok'],
      trendingTopics: ['Ghana Education', 'AI Learning', 'Exam Preparation', 'Past Questions', 'GES Curriculum']
    },

    // YouTube Configuration
    youtube: {
      channelId: 'your-youtube-channel-id',
      channelName: 'EduMate GH',
      playlistIds: ['BECE Preparation', 'WASSCE Preparation', 'NOVDEC Preparation', 'GES Curriculum Lessons', 'AI Tutoring Tips'],
      keywords: ['EduMate GH', 'AI Education', 'Ghana Education', 'BECE Past Questions', 'WASSCE Past Questions', 'NOVDEC Past Questions', 'GES Curriculum']
    }
  },

  // Content strategy for each platform
  contentStrategy: {
    facebook: {
      postTypes: ['Educational Tips', 'Past Questions Highlights', 'Student Success Stories', 'Teacher Resources', 'App Updates'],
      bestTimes: ['Monday 9AM', 'Wednesday 3PM', 'Friday 7PM'],
      engagement: ['Questions', 'Polls', 'Live Videos', 'Educational Content']
    },

    instagram: {
      postTypes: ['Past Questions Visuals', 'Curriculum Infographics', 'Student Life', 'Teacher Tips', 'Behind the Scenes'],
      stories: ['Daily Tips', 'Question of the Day', 'Student Spotlights', 'Curriculum Highlights'],
      reels: ['Quick Tips', 'Study Hacks', 'App Features', 'Success Stories']
    },

    tiktok: {
      contentTypes: ['Educational Shorts', 'Study Tips', 'Past Questions Explained', 'Curriculum Overview', 'Student Challenges'],
      trends: ['Educational Content', 'Study Motivation', 'Ghana Culture', 'Technology in Education'],
      collaborations: ['Student Influencers', 'Teacher Partners', 'Educational Content Creators']
    },

    youtube: {
      videoTypes: ['Past Questions Tutorials', 'Curriculum Lessons', 'AI Tutoring Demos', 'Student Success Stories', 'Teacher Training'],
      series: ['BECE Preparation Series', 'WASSCE Preparation Series', 'NOVDEC Preparation Series', 'GES Curriculum Series'],
      liveStreams: ['Q&A Sessions', 'Exam Preparation Tips', 'Live Tutoring Sessions']
    }
  },

  // Cross-platform content optimization
  crossPlatform: {
    hashtagStrategy: {
      primary: ['#EduMateGH', '#AIEducation', '#GhanaEducation'],
      secondary: ['#BECE', '#WASSCE', '#NOVDEC', '#GESCurriculum'],
      trending: ['#EducationTikTok', '#StudyTok', '#GhanaStudents', '#EdTech']
    },
    
    contentRepurposing: {
      youtubeToTikTok: 'Convert longer tutorials into short, engaging clips',
      instagramToFacebook: 'Share Instagram posts to Facebook with platform-specific captions',
      tiktokToYouTube: 'Compile TikTok videos into longer YouTube compilations',
      crossPromotion: 'Use each platform to promote content on other platforms'
    }
  }
};

// Comprehensive Sharing Previews and Social Media Cards
export const sharingConfig = {
  // Universal Open Graph Configuration
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    alternateLocale: ['en_US', 'en_GB'],
    siteName: 'EduMate GH - AI Education Platform Ghana',
    title: 'EduMate GH - Transform Ghana Education with AI | 50K+ Students, 95% Grade Improvement',
    description: 'Join Ghana\'s #1 AI education platform with 50K+ quiz questions, voice learning with Ghanaian accents, offline access, and GES curriculum alignment. Download free for iOS & Android.',
    url: 'https://edumategh.com',
    images: [
      {
        url: 'https://edumategh.com/images/og-image-main.png',
        width: 1200,
        height: 630,
        alt: 'EduMate GH - AI-Powered Education App for Ghana Students | BECE, WASSCE, NOVDEC Preparation',
        type: 'image/png'
      },
      {
        url: 'https://edumategh.com/images/og-image-mobile.png',
        width: 600,
        height: 315,
        alt: 'EduMate GH Mobile - Ghana Education App',
        type: 'image/png'
      },
      {
        url: 'https://edumategh.com/images/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'EduMate GH Logo and Branding',
        type: 'image/png'
      }
    ]
  },

  // Twitter Card Configuration
  twitter: {
    card: 'summary_large_image',
    site: '@edumate_gh',
    creator: '@edumate_gh',
    title: 'EduMate GH - Ghana\'s #1 AI Education App | 50K+ Students Trust Us',
    description: '🇬🇭 Transform your education with AI! 50K+ quiz questions, voice learning with Ghanaian accents, offline access. GES curriculum aligned. Join 50K+ students improving grades by 95%! 📚✨',
    images: [
      'https://edumategh.com/images/twitter-card-main.png',
      'https://edumategh.com/images/twitter-card-mobile.png'
    ]
  },

  // WhatsApp Sharing Configuration
  whatsapp: {
    title: 'EduMate GH - Ghana\'s #1 AI Education App',
    description: 'Transform your education with AI! 50K+ quiz questions, voice learning, offline access. GES curriculum aligned. Download free! 📚✨',
    image: 'https://edumategh.com/images/whatsapp-preview.png',
    url: 'https://edumategh.com'
  },

  // LinkedIn Sharing Configuration
  linkedin: {
    title: 'EduMate GH - AI-Powered Education Platform for Ghana',
    description: 'Leading AI education technology company providing comprehensive learning solutions aligned with Ghana\'s GES curriculum. Trusted by 50K+ students and 2K+ teachers.',
    image: 'https://edumategh.com/images/linkedin-preview.png',
    url: 'https://edumategh.com'
  },

  // Facebook Sharing Configuration
  facebook: {
    title: 'EduMate GH - Transform Ghana Education with AI',
    description: 'Join Ghana\'s #1 AI education platform! 50K+ quiz questions, voice learning with Ghanaian accents, offline access. GES curriculum aligned. Download free for iOS & Android.',
    image: 'https://edumategh.com/images/facebook-preview.png',
    url: 'https://edumategh.com',
    type: 'website',
    appId: 'your-facebook-app-id'
  },

  // Instagram Sharing Configuration
  instagram: {
    title: 'EduMate GH - AI Education App Ghana',
    description: '🇬🇭 Transform education with AI! 50K+ quiz questions, voice learning, offline access. GES curriculum aligned. #EduMateGH #AIEducation #GhanaEducation',
    image: 'https://edumategh.com/images/instagram-preview.png',
    url: 'https://edumategh.com'
  },

  // Pinterest Sharing Configuration
  pinterest: {
    title: 'EduMate GH - AI-Powered Education App for Ghana Students',
    description: 'Transform your education with AI! 50K+ quiz questions, voice learning with Ghanaian accents, offline access. GES curriculum aligned. Perfect for BECE, WASSCE, NOVDEC preparation.',
    image: 'https://edumategh.com/images/pinterest-preview.png',
    url: 'https://edumategh.com'
  },

  // Telegram Sharing Configuration
  telegram: {
    title: 'EduMate GH - Ghana\'s #1 AI Education App',
    description: 'Transform your education with AI! 50K+ quiz questions, voice learning with Ghanaian accents, offline access. GES curriculum aligned. Download free! 📚✨',
    image: 'https://edumategh.com/images/telegram-preview.png',
    url: 'https://edumategh.com'
  },

  // Email Sharing Configuration
  email: {
    subject: 'Check out EduMate GH - Ghana\'s #1 AI Education App!',
    body: 'Hi! I found this amazing AI-powered education app for Ghana students. It has 50K+ quiz questions, voice learning with Ghanaian accents, and is fully aligned with GES curriculum. Perfect for BECE, WASSCE, and NOVDEC preparation. Check it out: https://edumategh.com',
    signature: 'Best regards,\n[Your Name]'
  },

  // SMS Sharing Configuration
  sms: {
    message: 'Check out EduMate GH - Ghana\'s #1 AI Education App! 50K+ quiz questions, voice learning, offline access. GES curriculum aligned. Download free: https://edumategh.com'
  }
};

// Video Sharing and Dynamic Content Previews
export const videoSharingConfig = {
  // YouTube Video Sharing
  youtube: {
    title: 'EduMate GH App Demo - AI-Powered Learning in Action',
    description: 'See how EduMate GH transforms education with AI! Watch our app demo showing 50K+ quiz questions, voice learning with Ghanaian accents, offline access, and GES curriculum alignment.',
    thumbnail: 'https://edumategh.com/images/youtube-thumbnail.png',
    duration: 'PT3M30S', // ISO 8601 duration format
    uploadDate: '2024-01-15',
    channelId: 'your-youtube-channel-id',
    tags: ['EduMate GH', 'AI Education', 'Ghana Education', 'BECE', 'WASSCE', 'NOVDEC', 'GES Curriculum']
  },

  // TikTok Video Sharing
  tiktok: {
    title: 'Transform Education with AI! 🇬🇭 #EduMateGH',
    description: 'See how EduMate GH is revolutionizing education in Ghana! 50K+ quiz questions, voice learning, offline access. Perfect for BECE, WASSCE, NOVDEC preparation.',
    hashtags: ['#EduMateGH', '#AIEducation', '#GhanaEducation', '#BECE', '#WASSCE', '#NOVDEC', '#GESCurriculum'],
    music: 'Original Sound - EduMate GH'
  },

  // Instagram Reels Sharing
  instagramReels: {
    title: 'EduMate GH - AI Education Revolution in Ghana 🇬🇭',
    description: 'Transform your education with AI! 50K+ quiz questions, voice learning with Ghanaian accents, offline access. GES curriculum aligned. #EduMateGH #AIEducation #GhanaEducation',
    hashtags: ['#EduMateGH', '#AIEducation', '#GhanaEducation', '#BECE', '#WASSCE', '#NOVDEC', '#GESCurriculum', '#Reels'],
    music: 'Original Audio - EduMate GH'
  }
};

// Dynamic Content Preview Generation
export const dynamicPreviewConfig = {
  // Generate previews based on content type
  generatePreview: (contentType: string, data: any) => {
    const baseConfig = {
      siteName: 'EduMate GH - AI Education Platform Ghana',
      url: 'https://edumategh.com',
      locale: 'en_GH'
    };

    switch (contentType) {
      case 'blog':
        return {
          ...baseConfig,
          type: 'article',
          title: `${data.title} | EduMate GH Blog`,
          description: data.excerpt || 'Read our latest insights on AI-powered education in Ghana.',
          image: data.featuredImage || 'https://edumategh.com/images/blog-default.png',
          publishedTime: data.publishedAt,
          modifiedTime: data.updatedAt,
          author: data.author || 'EduMate GH Team',
          section: data.category || 'Education Technology'
        };

      case 'quiz':
        return {
          ...baseConfig,
          type: 'website',
          title: `${data.subject} Quiz - ${data.topic} | EduMate GH`,
          description: `Practice ${data.subject} with our ${data.topic} quiz. ${data.questionCount} questions aligned with GES curriculum.`,
          image: data.quizImage || 'https://edumategh.com/images/quiz-default.png'
        };

      case 'lesson':
        return {
          ...baseConfig,
          type: 'website',
          title: `${data.subject} Lesson - ${data.topic} | EduMate GH`,
          description: `Learn ${data.subject} with our comprehensive ${data.topic} lesson. AI-powered explanations and practice questions included.`,
          image: data.lessonImage || 'https://edumategh.com/images/lesson-default.png'
        };

      default:
        return baseConfig;
    }
  },

  // Social media specific previews
  socialMediaPreviews: {
    facebook: (config: any) => ({
      'og:title': config.title,
      'og:description': config.description,
      'og:image': config.image,
      'og:url': config.url,
      'og:type': config.type || 'website',
      'og:site_name': config.siteName,
      'og:locale': config.locale
    }),

    // Social Media Meta Tags for Facebook, Instagram, TikTok, and YouTube
    socialMedia: (config: any) => ({
      'og:title': config.title,
      'og:description': config.description,
      'og:image': config.image,
      'og:url': config.url,
      'og:type': config.type || 'website',
      'og:site_name': config.siteName || 'EduMate GH - AI Education Platform Ghana',
      'og:locale': 'en_GH'
    }),

    linkedin: (config: any) => ({
      'og:title': config.title,
      'og:description': config.description,
      'og:image': config.image,
      'og:url': config.url,
      'og:type': config.type || 'website',
      'og:site_name': config.siteName
    })
  }
};

// Platform-Specific Meta Tags for Better Sharing
export const platformMetaTags = {
  // Facebook Meta Tags
  facebook: {
    'fb:app_id': 'your-facebook-app-id',
    'fb:page_id': 'edumategh',
    'og:type': 'website',
    'og:site_name': 'EduMate GH - AI Education Platform Ghana',
    'og:locale': 'en_GH',
    'og:locale:alternate': ['en_US', 'en_GB'],
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'og:image:alt': 'EduMate GH - AI-Powered Education App for Ghana Students'
  },

  // Instagram Meta Tags
  instagram: {
    'og:image': 'https://edumategh.com/images/instagram-preview.png',
    'og:title': 'EduMate GH - AI Education App Ghana',
    'og:description': '🇬🇭 Transform education with AI! 50K+ past questions, voice learning, offline access. GES curriculum aligned. #EduMateGH #AIEducation #GhanaEducation',
    'og:url': 'https://edumategh.com'
  },

  // TikTok Meta Tags
  tiktok: {
    'og:image': 'https://edumategh.com/images/tiktok-preview.png',
    'og:title': 'Transform Education with AI! 🇬🇭 #EduMateGH',
    'og:description': 'See how EduMate GH is revolutionizing education in Ghana! 50K+ past questions, voice learning, offline access. Perfect for BECE, WASSCE, NOVDEC preparation.',
    'og:url': 'https://edumategh.com'
  },

  // WhatsApp Meta Tags
  whatsapp: {
    'og:image': 'https://edumategh.com/images/whatsapp-preview.png',
    'og:title': 'EduMate GH - Ghana\'s #1 AI Education App',
    'og:description': 'Transform your education with AI! 50K+ quiz questions, voice learning, offline access. GES curriculum aligned. Download free! 📚✨'
  },

  // YouTube Meta Tags
  youtube: {
    'og:image': 'https://edumategh.com/images/youtube-preview.png',
    'og:title': 'EduMate GH App Demo - AI-Powered Learning in Action',
    'og:description': 'See how EduMate GH transforms education with AI! Watch our app demo showing 50K+ past questions, voice learning with Ghanaian accents, offline access, and GES curriculum alignment.',
    'og:url': 'https://edumategh.com',
    'og:type': 'video.other'
  },

  // Pinterest Meta Tags
  pinterest: {
    'og:image': 'https://edumategh.com/images/pinterest-preview.png',
    'og:title': 'EduMate GH - AI-Powered Education App for Ghana Students',
    'og:description': 'Transform your education with AI! 50K+ quiz questions, voice learning with Ghanaian accents, offline access. GES curriculum aligned. Perfect for BECE, WASSCE, NOVDEC preparation.'
  }
};

// Rich Preview Cards for Enhanced Social Sharing
export const richPreviewCards = {
  // Homepage Rich Preview
  homepage: {
    title: 'EduMate GH - #1 AI Education App Ghana | 50K+ Students, 95% Grade Improvement | BECE, WASSCE, NOVDEC Past Questions & GES Curriculum',
    description: 'Transform your education with EduMate GH - Ghana\'s leading AI-powered learning app. Access 50,000+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, and comprehensive study materials. Join 50K+ students and 2K+ teachers improving grades by 95%. Download free for iOS & Android.',
    image: 'https://edumategh.com/images/homepage-preview.jpg',
    url: 'https://edumategh.com',
    type: 'website',
    keywords: 'EduMate, EduMate GH, Past Questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum, GES lessons, Quizzes, Ghana education, AI education',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'EduMate GH - AI Education Platform Ghana',
      'description': 'Ghana\'s leading AI-powered education app with 50K+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, and quizzes',
      'url': 'https://edumategh.com',
      'mainEntity': {
        '@type': 'Organization',
        'name': 'EduMate GH',
        'description': 'AI-powered education platform for Ghana students and teachers'
      }
    }
  },

  // Features Page Rich Preview
  features: {
    title: 'EduMate GH Features - AI Tutor, Voice Learning & 50K+ Past Questions | BECE, WASSCE, NOVDEC & GES Curriculum',
    description: 'Discover EduMate GH\'s powerful features: 24/7 AI tutor, voice learning with Ghanaian accents, 50,000+ past questions including BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, offline access, and comprehensive teacher resources.',
    image: 'https://edumategh.com/images/features-preview.jpg',
    url: 'https://edumategh.com/features',
    type: 'website',
    keywords: 'EduMate features, EduMate GH features, Past Questions features, BECE past questions features, WASSCE past questions features, NOVDEC past questions features, GES curriculum features, Quiz features',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'EduMate GH Features',
      'description': 'AI Tutor, Voice Learning & 50K+ Past Questions for BECE, WASSCE, NOVDEC & GES Curriculum',
      'url': 'https://edumategh.com/features'
    }
  },

  // Download Page Rich Preview
  download: {
    title: 'Download EduMate GH - Free AI Education App with BECE, WASSCE, NOVDEC Past Questions & GES Curriculum | iOS & Android',
    description: 'Download EduMate GH for free on iOS App Store and Google Play Store. Access 50K+ past questions, BECE past questions, WASSCE past questions, NOVDEC past questions, GES curriculum lessons, quizzes, and AI-powered learning. Start learning with EduMate GH today!',
    image: 'https://edumategh.com/images/download-preview.jpg',
    url: 'https://edumategh.com/download',
    type: 'website',
    keywords: 'Download EduMate, Download EduMate GH, Download past questions app, Download BECE past questions app, Download WASSCE past questions app, Download NOVDEC past questions app, Download GES curriculum app',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Download EduMate GH',
      'description': 'Free AI Education App with BECE, WASSCE, NOVDEC Past Questions & GES Curriculum for iOS & Android',
      'url': 'https://edumategh.com/download'
    }
  },

  // Contact Page Rich Preview
  contact: {
    title: 'Contact EduMate GH - Support, Partnership & Feedback | Ghana EdTech',
    description: 'Get in touch with EduMate GH team. Email: edumategh@gmail.com | Phone: +233241940783 | Visit us in Accra, Ghana. Support hours: Mon-Fri 8AM-5PM, Sat 9AM-1PM.',
    image: 'https://edumategh.com/images/contact-preview.jpg',
    url: 'https://edumategh.com/contact',
    type: 'website',
    keywords: 'contact EduMate GH, Ghana education support, EdTech contact, customer service Ghana, partnership inquiries, remedial education support, BECE help, WASSCE assistance',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact EduMate GH',
      'description': 'Get support, partnerships, or feedback for EduMate GH - Ghana\'s leading AI education app',
      'url': 'https://edumategh.com/contact'
    }
  },

  // Past Questions Rich Preview
  pastQuestions: {
    title: 'Past Questions - BECE, WASSCE, NOVDEC | EduMate GH Ghana Education App',
    description: 'Access comprehensive past questions for BECE, WASSCE, and NOVDEC examinations on EduMate GH. Over 50,000 past questions aligned with GES curriculum, including Mathematics, Science, English, and Social Studies. Perfect for exam preparation and practice.',
    image: 'https://edumategh.com/images/past-questions-preview.jpg',
    url: 'https://edumategh.com/past-questions',
    type: 'website',
    keywords: 'Past Questions, BECE past questions, WASSCE past questions, NOVDEC past questions, past questions Ghana, past questions app, past questions online',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'EduMate GH Past Questions',
      'description': 'Comprehensive collection of BECE, WASSCE, and NOVDEC past questions aligned with GES curriculum',
      'url': 'https://edumategh.com/past-questions'
    }
  },

  // Curriculum Rich Preview
  curriculum: {
    title: 'GES Curriculum - Basic Education & Senior High School | EduMate GH Ghana Education App',
    description: 'Access complete GES curriculum for Basic Education and Senior High School on EduMate GH. Comprehensive curriculum materials, lessons, and resources aligned with Ghana Education Service standards. Perfect for students and teachers.',
    image: 'https://edumategh.com/images/curriculum-preview.jpg',
    url: 'https://edumategh.com/curriculum',
    type: 'website',
    keywords: 'GES curriculum, Ghana curriculum, curriculum app, curriculum online, GES lessons, GES lessons Ghana, GES lessons app, GES curriculum lessons',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'EduMate GH GES Curriculum',
      'description': 'Complete GES curriculum materials for Basic Education and Senior High School',
      'url': 'https://edumategh.com/curriculum'
    }
  },

  // Quizzes Rich Preview
  quizzes: {
    title: 'Educational Quizzes - Practice Tests & Assessments | EduMate GH Ghana Education App',
    description: 'Practice with comprehensive educational quizzes on EduMate GH. Access quizzes for Mathematics, Science, English, Social Studies, and more subjects. Perfect for BECE, WASSCE, and NOVDEC preparation with AI-powered feedback.',
    image: 'https://edumategh.com/images/quizzes-preview.jpg',
    url: 'https://edumategh.com/quizzes',
    type: 'website',
    keywords: 'Quizzes, quiz app, quiz Ghana, online quiz, educational quiz, practice quiz, quiz questions, quiz app Ghana, quiz online Ghana',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'EduMate GH Educational Quizzes',
      'description': 'Comprehensive collection of educational quizzes for all subjects and exam preparation',
      'url': 'https://edumategh.com/quizzes'
    }
  }
};