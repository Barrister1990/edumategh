'use client';
import { supabase } from '@/lib/supabase';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function ModernComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [videoError, setVideoError] = useState(false);

  // Set your launch date here
  const launchDate = new Date('2025-08-20T12:00:00Z');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft('We are live!');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async () => {
    if (!email || !email.trim()) {
      setMessage('Please enter a valid email address');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Check for existing email
      const { data: existingUser, error: checkError } = await supabase
        .from('early_acess')
        .select('id')
        .eq('email', normalizedEmail)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new emails
        throw checkError;
      }

      if (existingUser) {
        setMessage('You\'re already on our early access list! 🎉');
        setEmail('');
        setTimeout(() => setMessage(''), 3000);
        setIsLoading(false);
        return;
      }

      // Insert new email
      const { error: insertError } = await supabase
        .from('early_acess')
        .insert([
          { 
            email: normalizedEmail,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setIsSubmitted(true);
      setMessage('Welcome to EduMate Ghana early access! ✨');
      setEmail('');
      
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error saving email:', error);
      setMessage('Something went wrong. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>EduMate Ghana - AI-Powered Learning Platform Coming Soon</title>
        <meta name="title" content="EduMate Ghana - AI-Powered Learning Platform Coming Soon" />
        <meta name="description" content="Revolutionary AI-powered e-learning platform for Ghanaian students and teachers. Master BECE & WASSCE prep, generate lesson notes instantly, and learn in Twi, Ewe & Hausa. Students can take lessons and quizzes aligned with the GES curriculum, structured under each strand. Join 3,200+ educators waiting for launch!" />
        <meta name="keywords" content="EduMate Ghana, AI learning, BECE, WASSCE, Ghana education, Twi, Ewe, Hausa, e-learning" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="EduMate Ghana" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
       <meta property="og:url" content="https://edumategh.com/coming-soon" />
        <meta property="og:title" content="EduMate Ghana - AI-Powered Learning Platform Coming Soon 🇬🇭" />
        <meta property="og:description" content="Revolutionary AI-powered e-learning platform for Ghanaian students and teachers. Master BECE & WASSCE prep, generate lesson notes instantly, and learn in Twi, Ewe & Hausa. Students can take lessons and quizzes aligned with the GES curriculum, structured under each strand. Join 3,200+ educators waiting for launch!" />
        <meta property="og:image" content="https://edumategh.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="EduMate Ghana - AI-Powered Learning Platform Coming Soon" />
        <meta property="og:site_name" content="EduMate Ghana" />
        <meta property="og:locale" content="en_US" />
<link rel="canonical" href="https://edumategh.com/coming-soon" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://edumategh.com/coming-soon" />
        <meta property="twitter:title" content="EduMate Ghana - AI-Powered Learning Platform Coming Soon 🇬🇭" />
        <meta property="twitter:description" content="Revolutionary AI-powered e-learning platform for Ghanaian students and teachers. Master BECE & WASSCE prep, generate lesson notes instantly, and learn in Twi, Ewe & Hausa." />
        <meta property="twitter:image" content="https://edumategh.com/og-image.png" />

        {/* WhatsApp specific */}
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="theme-color" content="#10b981" />

        {/* Additional Meta Tags */}
     
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>

      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Subtle accent elements - mobile optimized */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-emerald-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute top-20 right-4 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-orange-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-1/4 w-36 h-36 sm:w-56 sm:h-56 lg:w-80 lg:h-80 bg-yellow-500/5 rounded-full filter blur-3xl"></div>
        </div>

        {/* Grid pattern overlay - mobile optimized */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px sm:40px sm:40px lg:50px lg:50px'
          }}
        ></div>

        {/* Mouse follower - desktop only */}
        <div 
          className="fixed w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full pointer-events-none opacity-5 blur-3xl transition-all duration-500 ease-out hidden md:block"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)',
            left: mousePosition.x - 96,
            top: mousePosition.y - 96,
          }}
        ></div>

        <div className="relative z-10 min-h-screen flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 items-center justify-center p-4 sm:p-6">
            
          {/* Mobile-first content section */}
          <div className="w-full max-w-sm sm:max-w-lg lg:max-w-none text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8">
            
            {/* Badge - mobile optimized */}
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 rounded-full border border-gray-700 text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 lg:mb-6">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
              <span className="hidden sm:inline">AI-Powered Education • Made in Ghana 🇬🇭</span>
              <span className="sm:hidden">Made in Ghana 🇬🇭</span>
            </div>
            
            {/* Main heading - mobile first */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight">
              <span className="text-white">EduMate</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Ghana
              </span>
              <br />
              <span className="text-gray-300">is Coming</span>
            </h1>

            {/* Description - mobile optimized */}
            <p className="text-sm sm:text-lg lg:text-xl text-gray-400 leading-relaxed px-2 sm:px-0">
              Revolutionary AI-powered e-learning platform for Ghanaian students and teachers. Master BECE & WASSCE prep, generate lesson notes instantly, and learn in Twi, Ewe & Hausa.
            </p>

            {/* Key features - mobile grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                <span>BECE & WASSCE Questions</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full"></div>
                <span>AI Lesson Generation</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full"></div>
                <span>Interactive Quizzes</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full"></div>
                <span>Twi • Ewe • Hausa Support</span>
              </div>
            </div>

            {/* Phone mockup - Mobile positioned here */}
            <div className="flex justify-center lg:hidden my-6 sm:my-8">
              <div className="relative group">
                {/* Phone frame with subtle glow - mobile sized */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-gray-800 rounded-2xl sm:rounded-3xl p-1 sm:p-2 shadow-2xl border border-gray-700">
                  {/* Phone screen - mobile optimized */}
                  <div className="w-48 h-[420px] sm:w-56 sm:h-[480px] bg-black rounded-xl sm:rounded-2xl overflow-hidden relative">
                    
                    {/* Video container */}
                    <div className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden">
                      {!videoError ? (
                        <video 
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          autoPlay 
                          muted 
                          loop 
                          playsInline
                          onError={handleVideoError}
                          preload="metadata"
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                        >
                          <source src="https://res.cloudinary.com/dzcnx3v0n/video/upload/v1753180557/demo_frrm5i.mp4" type="video/mp4" />
                          <source src="https://res.cloudinary.com/dzcnx3v0n/video/upload/v1753180557/demo_frrm5i.mp4" type="video/mp4" />
                        </video>
                      ) : null}

                      {/* Fallback content - mobile optimized */}
                      {videoError && (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-center p-4 sm:p-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                              <span className="text-2xl sm:text-3xl">🎓</span>
                            </div>
                            <h3 className="text-white text-lg sm:text-xl font-bold mb-2">EduMate Ghana</h3>
                            <p className="text-gray-400 text-xs sm:text-sm mb-3">AI-Powered Learning</p>
                            <div className="space-y-1.5 text-xs text-gray-500">
                              <div className="flex items-center justify-center space-x-1.5">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span>BECE & WASSCE Ready</span>
                              </div>
                              <div className="flex items-center justify-center space-x-1.5">
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                <span>Multi-Language Support</span>
                              </div>
                              <div className="flex items-center justify-center space-x-1.5">
                                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                                <span>Interactive Learning</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* iPhone Notch - mobile sized */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-4 sm:w-24 sm:h-5 bg-black rounded-b-xl z-30"></div>

                    {/* Home indicator - mobile sized */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-0.5 sm:w-24 sm:h-1 bg-white/40 rounded-full z-30"></div>
                  </div>
                </div>

                {/* Floating elements - mobile sized */}
                <div className="absolute -top-2 -left-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-full animate-bounce opacity-40"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse opacity-30"></div>
              </div>
            </div>

            {/* Countdown - mobile optimized */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider font-medium">Launch Countdown</p>
              <div className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-mono font-bold text-white bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-700 shadow-lg">
                {timeLeft}
              </div>
            </div>

            {/* Email signup - mobile optimized */}
            <div className="space-y-3 sm:space-y-4 w-full">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email for early access"
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-4 bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  disabled={isLoading}
                />
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading || !email.trim()}
                className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-orange-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Joining...</span>
                    </div>
                  ) : isSubmitted ? (
                    '✨ You\'re on the list!'
                  ) : (
                    'Get Early Access'
                  )}
                </span>
              </button>

              {/* Message display - mobile optimized */}
              {message && (
                <div className={`text-center text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  message.includes('already') || message.includes('Welcome') 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  {message}
                </div>
              )}
            </div>

            {/* Social proof - mobile optimized */}
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1 sm:-space-x-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs">👨‍🎓</div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-red-400 to-orange-400 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs">👩‍🏫</div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs">👨‍💻</div>
                </div>
                <span className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Join 3,200+ Ghanaian educators</span>
                  <span className="sm:hidden">3,200+ educators</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop phone mockup - hidden on mobile */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Phone frame with subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-orange-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-gray-800 rounded-[3rem] p-2 shadow-2xl border border-gray-700">
                {/* Phone screen with perfect aspect ratio */}
                <div className="w-80 h-[720px] bg-black rounded-[2.5rem] overflow-hidden relative">
                  
                  {/* Video container with perfect fit */}
                  <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden">
                    {!videoError ? (
                      <video 
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        onError={handleVideoError}
                        preload="metadata"
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center',
                          borderRadius: '2.5rem'
                        }}
                      >
                        <source src="https://res.cloudinary.com/dzcnx3v0n/video/upload/v1753180557/demo_frrm5i.mp4" type="video/mp4" />
                        <source src="https://res.cloudinary.com/dzcnx3v0n/video/upload/v1753180557/demo_frrm5i.mp4" type="video/mp4" />
                      </video>
                    ) : null}

                    {/* Fallback content - shows when video fails or as backup */}
                    {videoError && (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                            <span className="text-4xl">🎓</span>
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">EduMate Ghana</h3>
                          <p className="text-gray-400 text-sm mb-4">AI-Powered Learning Platform</p>
                          <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span>BECE & WASSCE Ready</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              <span>Multi-Language Support</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                              <span>Interactive Learning</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* iPhone Notch - positioned above video */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30"></div>

                  {/* Home indicator - positioned above video */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-30"></div>
                </div>
              </div>

              {/* Floating elements around phone */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-full animate-bounce opacity-40"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse opacity-30"></div>
            </div>
          </div>
        </div>

        {/* WhatsApp Floating Button - mobile optimized */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <a
            href="https://wa.me/233241940783?text=Hi!%20I'm%20interested%20in%20EduMate%20Ghana%20early%20access"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            {/* WhatsApp Icon - mobile sized */}
            <svg 
              className="w-7 h-7 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
            
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
            
            {/* Tooltip - desktop only */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
              Chat with us on WhatsApp
            </div>
          </a>
        </div>


      </div>
    </>
  );
}