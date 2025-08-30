


export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 lg:pt-24 lg:pb-16 bg-blue-600">
        <div className="container mx-auto px-3 lg:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-base lg:text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Read our terms of service and user agreement for EduMate GH, Ghana&apos;s leading AI-powered education app
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 lg:px-6">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                EduMate GH Terms of Service
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-GH', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-gray-600">
                Welcome to EduMate GH, Ghana&apos;s premier AI-powered education platform. These terms govern your use of our 
                remedial education app, BECE preparation tools, WASSCE resources, and NOVDEC support features.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h3>
                <p className="text-gray-600 mb-4">
                  By accessing and using EduMate GH, you accept and agree to be bound by the terms and provision of this agreement. 
                  Our platform provides GES curriculum-aligned lessons, past questions, and AI-powered learning tools for Ghanaian students.
                </p>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  2. Educational Services
                </h3>
                <p className="text-gray-600 mb-4">
                  EduMate GH offers comprehensive educational services including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>AI-powered remedial education support</li>
                  <li>BECE, WASSCE, and NOVDEC past questions and solutions</li>
                  <li>GES curriculum-aligned lessons and study materials</li>
                  <li>Voice learning with Ghanaian accent options</li>
                  <li>Offline access to educational content</li>
                  <li>Teacher resources and lesson planning tools</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  3. Coin Purchase and Virtual Currency
                </h3>
                <p className="text-gray-600 mb-4">
                  EduMate GH operates a virtual currency system where users can purchase coins to unlock premium content and features:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Coins can be earned through completing tasks, watching ads, or purchased directly</li>
                  <li>New users receive 500 free coins upon registration</li>
                  <li>Coins can be used to unlock premium lessons, AI tutoring sessions, and advanced features</li>
                  <li>Coin prices and packages are subject to change with prior notice</li>
                </ul>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl mt-4">
                  <p className="text-red-800 font-semibold">
                    <strong>IMPORTANT:</strong> All coin purchases are final and non-refundable. Coins cannot be traded for cash, 
                    exchanged for other currencies, or transferred between accounts. Once purchased, coins become the property 
                    of the user account and are subject to our virtual currency terms.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mt-4">
                  <p className="text-blue-800">
                    <strong>Coin Usage Policy:</strong> Coins are valid for the duration of your account and do not expire. 
                    However, coins are tied to your specific account and cannot be transferred or sold to other users. 
                    Unused coins remain in your account until used or until your account is deactivated.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  4. User Accounts and Privacy
                </h3>
                <p className="text-gray-600 mb-4">
                  When you create an account with EduMate GH, you must provide accurate and complete information. 
                  We are committed to protecting student and teacher privacy in accordance with Ghana&apos;s data protection laws.
                </p>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  5. Acceptable Use
                </h3>
                <p className="text-gray-600 mb-4">
                  You agree to use EduMate GH only for educational purposes. You may not:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Share account credentials with others</li>
                  <li>Use the platform for commercial purposes without permission</li>
                  <li>Attempt to reverse engineer our AI technology</li>
                  <li>Upload inappropriate or harmful content</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  6. Intellectual Property
                </h3>
                <p className="text-gray-600 mb-4">
                  All content on EduMate GH, including lessons, quiz questions, and AI-generated materials, is protected by 
                  intellectual property laws. While you may use these materials for personal study, redistribution is prohibited.
                </p>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  7. GES Curriculum Compliance
                </h3>
                <p className="text-gray-600 mb-4">
                  Our educational content is carefully aligned with Ghana Education Service (GES) curriculum standards. 
                  We ensure that all lessons, past questions, and remedial materials meet the highest educational standards 
                  for Basic and Senior High School levels.
                </p>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  8. Limitation of Liability
                </h3>
                <p className="text-gray-600 mb-4">
                  EduMate GH is provided &quot;as is&quot; for educational purposes. While we strive for accuracy in our 
                  BECE, WASSCE, and NOVDEC materials, we cannot guarantee specific exam outcomes or academic performance.
                </p>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  9. Contact Information
                </h3>
                <p className="text-gray-600 mb-4">
                  For questions about these terms, contact us at:
                </p>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong> edumategh@gmail.com<br/>
                    <strong>Phone:</strong> +233241940783<br/>
               
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                <p className="text-yellow-800">
                  <strong>Note:</strong> These terms are specifically designed for our Ghana education platform and comply 
                  with local educational standards and regulations. For the most current version, please check our website regularly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
