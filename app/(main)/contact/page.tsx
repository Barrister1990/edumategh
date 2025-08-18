"use client";
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  Star,
  Users,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.');
      }

      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          type: 'general'
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Us",
      primary: "edumategh@gmail.com",
      secondary: "edumategh@gmail.com",
      description: "Get in touch via email"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Call Us",
      primary: "+233241940783",
      secondary: "+233241940783",
      description: "Speak with our team"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Visit Us",
      primary: "123 Innovation Street",
      secondary: "Accra, Ghana",
      description: "Come see us in person"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Business Hours",
      primary: "Mon-Fri: 8AM-5PM",
      secondary: "Sat: 9AM-1PM",
      description: "When we're available"
    }
  ];

  const faqData = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login screen, tap 'Forgot Password', and follow the instructions sent to your email address.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "Can I use EduMate GH on multiple devices?",
      answer: "Yes, you can use your EduMate GH account on up to 3 devices simultaneously with the same login credentials.",
      icon: <Users className="h-5 w-5" />
    },
    {
      question: "How do I report a bug or issue?",
      answer: "In the app, go to Settings > Help & Support > Report a Problem, or email us at edumategh@gmail.com with details.",
      icon: <Zap className="h-5 w-5" />
    },
    {
      question: "Is technical support available 24/7?",
      answer: "Our support team is available Monday-Friday from 8 AM to 8 PM, and Saturday from 9 AM to 1 PM (Ghana time).",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      question: "How do I download offline content?",
      answer: "Tap the download icon next to any lesson or quiz. Content will be available offline once downloaded.",
      icon: <Star className="h-5 w-5" />
    },
    {
      question: "Can teachers create custom quizzes?",
      answer: "Yes, teachers can create custom quizzes using our AI-powered quiz generator or manually create questions.",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 lg:pt-24 lg:pb-16 bg-blue-600 overflow-hidden">
        <div className="container mx-auto px-3 lg:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-3 py-2 lg:px-4 lg:py-2 rounded-full bg-white/20 backdrop-blur-xl text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              We&apos;re Here to Help
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-black text-white mb-6">
              Get in
              <br />
              <span className="text-blue-100">
                Touch
              </span>
            </h1>
            
            <p className="text-base lg:text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Have questions about EduMate GH? Our team is ready to help you succeed in your educational journey.
            </p>
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
            <path fill="white" d="M1200 120L0 16.48V0h1200v120z"></path>
          </svg>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg lg:rounded-xl mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {info.icon}
                  </div>
                </div>
                
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2">
                  {info.title}
                </h3>
                
                <p className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3">
                  {info.description}
                </p>
                
                <div className="space-y-1">
                  <p className="text-sm lg:text-base font-semibold text-gray-800">
                    {info.primary}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {info.secondary}
                  </p>
                </div>

                <div className="absolute top-3 right-3 lg:top-4 lg:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-3 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:pr-8"
            >
              <div className="inline-flex items-center px-3 py-2 lg:px-4 lg:py-2 rounded-full bg-blue-100 text-sm font-medium text-blue-700 mb-6">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send us a message
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 lg:mb-6">
                <span className="text-gray-900">Let&apos;s Start a</span>
                <br />
                <span className="text-blue-600">
                  Conversation
                </span>
              </h2>
              
              <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                We&apos;d love to hear from you. Whether you have a question about features, 
                need technical support, or want to provide feedback, our team is ready to help.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm lg:text-base text-gray-600">
                    Average response time: 2 hours
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm lg:text-base text-gray-600">
                    Available Monday to Saturday
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm lg:text-base text-gray-600">
                    Support in English and local languages
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl border border-gray-200">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                                              <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                          placeholder="+233241940783"
                        />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="bug">Bug Report</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-5 h-5 mr-3" />
                          Send Message
                        </div>
                      )}
                    </motion.button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <div className="text-sm text-gray-500">
                      Redirecting in 3 seconds...
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-3 lg:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-12 lg:mb-16"
          >
            <div className="inline-flex items-center px-3 py-2 lg:px-4 lg:py-2 rounded-full bg-blue-100 text-sm font-medium text-blue-700 mb-6">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-6">
              <span className="text-gray-900">Quick</span>
              <br />
              <span className="text-blue-600">
                Answers
              </span>
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed">
              Find answers to the most common questions about EduMate GH
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div
                  className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 cursor-pointer"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 lg:space-x-4 flex-1">
                      <div className="inline-flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg lg:rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-white">
                          <div className="lg:hidden">
                            {React.cloneElement(faq.icon, { className: "h-4 w-4" })}
                          </div>
                          <div className="hidden lg:block">
                            {faq.icon}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 lg:mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          {faq.question}
                        </h3>
                        <motion.div
                          initial={false}
                          animate={{
                            height: expandedFAQ === index ? "auto" : 0,
                            opacity: expandedFAQ === index ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm lg:text-base text-gray-600 leading-relaxed pb-2">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-2"
                    >
                      <ArrowUpRight className="h-5 w-5 text-gray-400" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-20 bg-blue-600 relative overflow-hidden">
        <div className="container mx-auto px-3 lg:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4 lg:mb-6">
              Still Have Questions?
            </h2>
            
            <p className="text-base lg:text-lg xl:text-xl text-blue-100 mb-6 lg:mb-8 leading-relaxed max-w-3xl mx-auto">
              Our support team is here to help you get the most out of EduMate GH
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a 
                href="mailto:edumategh@gmail.com"
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-bold rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
              >
                <Mail className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                Email Support
              </motion.a>
              
              <motion.a 
                href="tel:+233241940783"
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 text-white hover:bg-white/10 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-bold rounded-xl lg:rounded-2xl transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
              >
                <Phone className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                Call Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;