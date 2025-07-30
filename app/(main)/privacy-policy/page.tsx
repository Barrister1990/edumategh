import {
    BarChart3,
    Calendar,
    CheckCircle,
    Database,
    Eye,
    Lock,
    Mail,
    Settings,
    Shield,
    UserCheck,
    Users
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "who-we-are",
      title: "Who We Are",
      icon: <Users className="h-5 w-5" />,
      content: "EduMate GH is Ghana's leading AI-powered educational platform, designed to revolutionize learning for students and teaching for educators. We're committed to providing quality education aligned with the GES curriculum while maintaining the highest standards of privacy and data protection."
    },
    {
      id: "age-requirement", 
      title: "Age Requirement",
      icon: <UserCheck className="h-5 w-5" />,
      content: "EduMate GH is designed for users aged 16 years and older. By using our app, you confirm that you meet this age requirement or have received explicit consent from a parent or legal guardian. We take youth privacy seriously and comply with all applicable laws regarding minors' data protection."
    },
    {
      id: "information-collected",
      title: "Information We Collect", 
      icon: <Database className="h-5 w-5" />,
      subsections: [
        {
          title: "Personal Information",
          items: [
            "Full name (optional for personalization)",
            "Email address (for account management and support)",
            "Unique user ID (for content delivery and progress tracking)",
            "Educational level and preferred subjects"
          ]
        },
        {
          title: "Learning Analytics",
          items: [
            "Lessons accessed and completion rates",
            "Quiz attempts and performance scores", 
            "Learning path preferences and progress",
            "Study time and engagement patterns",
            "Areas of strength and improvement needs"
          ]
        },
        {
          title: "Device & Technical Data",
          items: [
            "Device type, model, and operating system",
            "App version and crash logs for improvements",
            "IP address and general location (city level)",
            "Network connection type and stability"
          ]
        },
        {
          title: "Financial Information",
          items: [
            "In-app purchase history (coins, premium features)",
            "Transaction IDs and payment confirmations",
            "We never store credit card or banking details directly"
          ]
        }
      ]
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: <Settings className="h-5 w-5" />,
      purposes: [
        {
          title: "Personalized Learning",
          description: "Deliver AI-powered content recommendations and adaptive learning paths tailored to your academic needs and progress."
        },
        {
          title: "Performance Improvement", 
          description: "Analyze app usage to enhance features, fix bugs, and optimize the overall user experience."
        },
        {
          title: "Educational Support",
          description: "Provide customer support, answer questions, and help resolve technical issues promptly."
        },
        {
          title: "Progress Tracking",
          description: "Monitor learning milestones, generate progress reports, and celebrate academic achievements."
        },
        {
          title: "Content Development",
          description: "Understand learning patterns to create better lessons, quizzes, and educational materials."
        }
      ]
    },
    {
      id: "data-sharing",
      title: "Data Sharing & Third Parties",
      icon: <Eye className="h-5 w-5" />,
      content: "We partner with trusted third-party services to enhance your learning experience. These partnerships are governed by strict data protection agreements."
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: <Shield className="h-5 w-5" />,
      rights: [
        "Access your personal data and download your information",
        "Request correction of inaccurate or incomplete data", 
        "Delete your account and associated data",
        "Opt out of personalized advertising",
        "Control data processing for marketing purposes",
        "Port your data to another service provider"
      ]
    }
  ];

  const thirdPartyServices = [
    {
      name: "Google AdMob",
      purpose: "Advertising & Monetization",
      description: "Displays relevant educational ads to support free access to premium features."
    },
    {
      name: "Firebase Analytics",
      purpose: "App Performance & Insights", 
      description: "Helps us understand user behavior to improve the learning experience."
    },
    {
      name: "RevenueCat",
      purpose: "In-App Purchase Management",
      description: "Securely processes premium subscriptions and coin purchases."
    },
    {
      name: "Crashlytics",
      purpose: "Bug Reporting & Stability",
      description: "Automatically reports crashes to help us fix issues quickly."
    }
  ];

  const lastUpdated = "January 15, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your privacy is fundamental to everything we do at EduMate GH. 
              Learn how we protect your data while delivering world-class education.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-white/80">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4" />
            GDPR & CCPA Compliant
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            At EduMate GH, we believe transparency builds trust. This policy explains exactly 
            how we collect, use, and protect your information to deliver the best possible 
            learning experience while respecting your privacy rights.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  {section.icon}
                </div>
                <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                {section.content && (
                  <p className="text-gray-600 leading-relaxed mb-6">{section.content}</p>
                )}

                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, idx) => (
                      <div key={idx}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {subsection.title}
                        </h3>
                        <ul className="space-y-2">
                          {subsection.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.purposes && (
                  <div className="grid gap-4">
                    {section.purposes.map((purpose, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-2">{purpose.title}</h3>
                        <p className="text-gray-600 text-sm">{purpose.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.rights && (
                  <div className="grid gap-3">
                    {section.rights.map((right, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{right}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}

          {/* Third Party Services */}
          <section className="scroll-mt-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Trusted Partners</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                We work with industry-leading partners to enhance your learning experience. 
                All partnerships are governed by strict data protection agreements.
              </p>
              <div className="grid gap-4">
                {thirdPartyServices.map((service, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{service.name}</h3>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {service.purpose}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="scroll-mt-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-500 text-white rounded-xl">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                We implement industry-standard security measures including end-to-end encryption, 
                secure data centers, and regular security audits. Your learning data is protected 
                with the same level of security used by leading financial institutions.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">256-bit Encryption</h3>
                  <p className="text-sm text-gray-600">Bank-level security for all data transmission</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Secure Servers</h3>
                  <p className="text-sm text-gray-600">Data stored in certified, monitored facilities</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Regular Audits</h3>
                  <p className="text-sm text-gray-600">Continuous security monitoring and testing</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="scroll-mt-8">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Our privacy team is ready to help. Contact us for any questions about 
                  this policy or to exercise your privacy rights.
                </p>
                <a
                  href="mailto:edumategh@gmail.com"
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  edumategh@gmail.com
                </a>
                <div className="mt-6 text-sm text-white/70">
                  <p>We typically respond within 48 hours</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            This privacy policy is effective as of {lastUpdated} and will remain in effect 
            except with respect to any changes in its provisions in the future.
          </p>
        </div>
      </div>
    </div>
  );
}