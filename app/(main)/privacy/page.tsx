import { pageConfigs, seoConfig } from "@/config/seo";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...seoConfig,
  ...pageConfigs.privacy,
  alternates: {
    canonical: 'https://edumategh.com/privacy'
  }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 lg:pt-24 lg:pb-16 bg-blue-600">
        <div className="container mx-auto px-3 lg:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-base lg:text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Learn how EduMate GH protects student and teacher data in our Ghana education app
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
                EduMate GH Privacy Policy
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-GH', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-gray-600">
                At EduMate GH, we are committed to protecting the privacy and security of all users of our 
                AI-powered education platform. This policy explains how we collect, use, and safeguard your information.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  1. Information We Collect
                </h3>
                <p className="text-gray-600 mb-4">
                  To provide our remedial education services, BECE preparation tools, and WASSCE resources, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Name, email, phone number, and educational level</li>
                  <li><strong>Educational Data:</strong> Learning progress, quiz results, and study preferences</li>
                  <li><strong>Usage Analytics:</strong> App usage patterns and feature interactions</li>
                  <li><strong>Device Information:</strong> Device type, operating system, and app version</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  2. How We Use Your Information
                </h3>
                <p className="text-gray-600 mb-4">
                  Your information helps us provide personalized educational experiences:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Deliver GES curriculum-aligned lessons and past questions</li>
                  <li>Provide AI-powered remedial education support</li>
                  <li>Track learning progress and suggest improvements</li>
                  <li>Generate personalized quiz questions for BECE, WASSCE, and NOVDEC</li>
                  <li>Improve our educational technology platform</li>
                  <li>Send important updates about our services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  3. Data Security and Protection
                </h3>
                <p className="text-gray-600 mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>End-to-end encryption for all data transmission</li>
                  <li>Secure cloud storage with regular backups</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Regular security audits and updates</li>
                  <li>Compliance with Ghana&apos;s data protection regulations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  4. Student Data Protection
                </h3>
                <p className="text-gray-600 mb-4">
                  As an educational platform serving Ghanaian students, we take extra precautions:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Never share student information with third parties</li>
                  <li>Use anonymized data for educational research</li>
                  <li>Provide parents/guardians access to student accounts</li>
                  <li>Allow easy deletion of student data upon request</li>
                  <li>Comply with educational privacy standards</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  5. Teacher Data and Resources
                </h3>
                <p className="text-gray-600 mb-4">
                  For teachers using our platform for lesson planning and exam generation:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Protect teacher lesson plans and materials</li>
                  <li>Secure storage of generated exam questions</li>
                  <li>Confidential handling of class performance data</li>
                  <li>Professional development insights remain private</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  6. Data Sharing and Third Parties
                </h3>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information. We may share data only when:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Required by Ghanaian law or educational regulations</li>
                  <li>Necessary to provide our educational services</li>
                  <li>You explicitly consent to sharing</li>
                  <li>Required for legal proceedings or investigations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  7. Your Rights and Choices
                </h3>
                <p className="text-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Access and review your personal data</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of non-essential communications</li>
                  <li>Control privacy settings in your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  8. Contact Our Privacy Team
                </h3>
                <p className="text-gray-600 mb-4">
                  For privacy-related questions or concerns:
                </p>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-gray-700">
                    <strong>Privacy Officer:</strong> EduMate GH Privacy Team<br/>
                    <strong>Email:</strong> edumategh@gmail.com<br/>
                    <strong>Phone:</strong> +233241940783<br/>
                    <strong>Address:</strong> 123 Innovation Street, Accra, Ghana
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl">
                <p className="text-green-800">
                  <strong>Commitment:</strong> EduMate GH is committed to maintaining the highest standards of data protection 
                  for our Ghanaian education community. We regularly review and update our privacy practices to ensure 
                  compliance with local and international standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
