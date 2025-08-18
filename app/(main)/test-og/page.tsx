import { seoConfig } from "@/config/seo";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...seoConfig,
  title: 'Test OG Images - EduMate GH | Social Media Preview Testing',
  description: 'Test page for verifying Open Graph images and social media sharing previews for EduMate GH website.',
  openGraph: {
    title: 'Test OG Images - EduMate GH Social Media Preview',
    description: 'Verify that Open Graph images are working correctly for social media sharing.',
    url: 'https://edumategh.com/test-og',
    images: [{ url: 'https://edumategh.com/og-image.png', width: 1200, height: 630 }]
  }
};

export default function TestOGPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 lg:pt-24 lg:pb-16 bg-blue-600">
        <div className="container mx-auto px-3 lg:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6">
              Test OG Images
            </h1>
            <p className="text-base lg:text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Verify Open Graph image implementation and social media sharing previews
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 lg:px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* OG Image Preview */}
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Current OG Image
              </h2>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <img 
                  src="/og-image.png" 
                  alt="EduMate GH OG Image Preview"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  File: /og-image.png (1200x630px)
                </p>
              </div>
            </div>

            {/* Testing Instructions */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  How to Test OG Images
                </h3>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">1. Facebook & LinkedIn Testing</h4>
                  <ul className="list-disc list-inside text-blue-800 space-y-2 ml-4">
                    <li>Go to <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="underline">Facebook Sharing Debugger</a></li>
                    <li>Enter this URL: <code className="bg-blue-100 px-2 py-1 rounded">https://edumategh.com/test-og</code></li>
                    <li>Click "Debug" to see preview</li>
                    <li>Use "Scrape Again" to clear cache</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">2. Twitter Card Testing</h4>
                <div className="bg-green-50 rounded-xl p-6">
                  <ul className="list-disc list-inside text-green-800 space-y-2 ml-4">
                    <li>Visit <a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener noreferrer" className="underline">Twitter Card Validator</a></li>
                    <li>Enter the same URL</li>
                    <li>Check preview and meta tags</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">3. WhatsApp & Telegram Testing</h4>
                <div className="bg-purple-50 rounded-xl p-6">
                  <ul className="list-disc list-inside text-purple-800 space-y-2 ml-4">
                    <li>Copy this page URL</li>
                    <li>Share it in WhatsApp or Telegram chat</li>
                    <li>Check if preview shows correctly</li>
                    <li>Verify image, title, and description</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">4. LinkedIn Post Inspector</h4>
                <div className="bg-indigo-50 rounded-xl p-6">
                  <ul className="list-disc list-inside text-indigo-800 space-y-2 ml-4">
                    <li>Use <a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer" className="underline">LinkedIn Post Inspector</a></li>
                    <li>Test the URL for professional sharing</li>
                    <li>Check preview quality and meta tags</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current Meta Tags */}
            <div className="mt-12 bg-gray-50 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Current Meta Tags
              </h3>
              <div className="bg-white rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-700">
{`<!-- Open Graph Meta Tags -->
<meta property="og:title" content="Test OG Images - EduMate GH Social Media Preview" />
<meta property="og:description" content="Verify that Open Graph images are working correctly for social media sharing." />
<meta property="og:image" content="https://edumategh.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://edumategh.com/test-og" />
<meta property="og:site_name" content="EduMate GH" />

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Test OG Images - EduMate GH Social Media Preview" />
<meta name="twitter:description" content="Verify that Open Graph images are working correctly for social media sharing." />
<meta name="twitter:image" content="https://edumategh.com/og-image.png" />
<meta name="twitter:creator" content="@edumate_gh" />
<meta name="twitter:site" content="@edumate_gh" />`}
                </pre>
              </div>
            </div>

            {/* Expected Results */}
            <div className="mt-8 bg-green-50 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-green-900 mb-4">
                ✅ Expected Results
              </h3>
              <ul className="list-disc list-inside text-green-800 space-y-2 ml-4">
                <li><strong>Image Preview:</strong> EduMate GH logo and branding visible</li>
                <li><strong>Title:</strong> "Test OG Images - EduMate GH Social Media Preview"</li>
                <li><strong>Description:</strong> Clear explanation of the test purpose</li>
                <li><strong>Dimensions:</strong> 1200x630 pixels (1.91:1 aspect ratio)</li>
                <li><strong>Format:</strong> PNG with transparency support</li>
              </ul>
            </div>

            {/* Troubleshooting */}
            <div className="mt-8 bg-yellow-50 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-yellow-900 mb-4">
                🔧 Troubleshooting
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">If image doesn't show:</h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1 ml-4">
                    <li>Check if /og-image.png exists in public folder</li>
                    <li>Verify image dimensions are 1200x630px</li>
                    <li>Clear social platform cache (use debug tools)</li>
                    <li>Check browser console for errors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">If meta tags are wrong:</h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1 ml-4">
                    <li>Verify metadata export in page component</li>
                    <li>Check Next.js metadata configuration</li>
                    <li>Ensure proper import of seoConfig</li>
                    <li>Restart development server if needed</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
