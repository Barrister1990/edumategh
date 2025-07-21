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

  // Set your launch date here
  const launchDate = new Date('2025-08-01T12:00:00Z');

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
    const handleMouseMove = (e) => {
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>EduMate Ghana - AI-Powered Learning Platform Coming Soon</title>
        <meta name="title" content="EduMate Ghana - AI-Powered Learning Platform Coming Soon" />
        <meta name="description" content="Revolutionary AI-powered e-learning platform for Ghanaian students and teachers. Master BECE & WASSCE prep, generate lesson notes instantly, and learn in Twi, Ewe & Hausa. Join 3,200+ educators waiting for launch!" />
        <meta name="keywords" content="EduMate Ghana, AI learning, BECE, WASSCE, Ghana education, Twi, Ewe, Hausa, e-learning" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="EduMate Ghana" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://edumate.gh/" />
        <meta property="og:title" content="EduMate Ghana - AI-Powered Learning Platform Coming Soon 🇬🇭" />
        <meta property="og:description" content="Revolutionary AI-powered e-learning platform for Ghanaian students and teachers. Master BECE & WASSCE prep, generate lesson notes instantly, and learn in Twi, Ewe & Hausa. Join 3,200+ educators waiting for launch!" />
        <meta property="og:image" content="https://edumate.gh/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="EduMate Ghana - AI-Powered Learning Platform Coming Soon" />
        <meta property="og:site_name" content="EduMate Ghana" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://edumate.gh/" />
        <meta property="twitter:title" content="EduMate Ghana - AI-Powered Learning Platform Coming Soon 🇬🇭" />
        <meta property="twitter:description" content="Revolutionary AI-powered e-learning platform for Ghanaian students and teachers. Master BECE & WASSCE prep, generate lesson notes instantly, and learn in Twi, Ewe & Hausa." />
        <meta property="twitter:image" content="https://edumate.gh/og-image.png" />

        {/* WhatsApp specific */}
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="theme-color" content="#10b981" />

        {/* Additional Meta Tags */}
        <link rel="canonical" href="https://edumate.gh/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>

      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Subtle accent elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-orange-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/5 rounded-full filter blur-3xl"></div>
        </div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>

        {/* Subtle mouse follower */}
        <div 
          className="fixed w-96 h-96 rounded-full pointer-events-none opacity-5 blur-3xl transition-all duration-500 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-start lg:items-center">
            
            {/* Left side - Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Main heading */}
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-full border border-gray-700 text-sm text-gray-300 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  AI-Powered Education • Made in Ghana 🇬🇭
                </div>
                
                <h1 className="text-xl sm:text-5xl lg:text-7xl font-black leading-tight">
                  <span className="text-white">
                    EduMate
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Ghana
                  </span>
                  <br />
                  <span className="text-gray-300">is Coming</span>
                </h1>
              </div>

              <p className="text-sm sm:text-xl text-gray-400 leading-relaxed max-w-lg lg:max-w-none">
                Revolutionary AI-powered e-learning platform designed for Ghanaian students and teachers. Master BECE & WASSCE prep, generate lesson notes instantly, and learn in Twi, Ewe & Hausa.
              </p>

              {/* Key features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm max-w-lg lg:max-w-none">
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>BECE & WASSCE Questions</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>AI Lesson Generation</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Interactive Quizzes</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Twi • Ewe • Hausa Support</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="space-y-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">Launch Countdown</p>
                <div className="text-lg sm:text-4xl lg:text-5xl font-mono font-bold text-white bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
                  {timeLeft}
                </div>
              </div>

              {/* Email signup */}
              <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your email for early access to EduMate GH"
                    className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !email.trim()}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-orange-600 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative">
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </div>
                    ) : isSubmitted ? (
                      '✨ You\'re on the list!'
                    ) : (
                      'Get Early Access'
                    )}
                  </span>
                </button>

                {/* Message display */}
                {message && (
                  <div className={`text-center text-sm p-3 rounded-xl transition-all duration-300 ${
                    message.includes('already') || message.includes('Welcome') 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {message}
                  </div>
                )}
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs">👨‍🎓</div>
                    <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-orange-400 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs">👩‍🏫</div>
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs">👨‍💻</div>
                  </div>
                  <span>Join 3,200+ Ghanaian educators</span>
                </div>
              </div>
            </div>

            {/* Right side - Phone mockup with video */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                {/* Phone frame with subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-orange-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-gray-800 rounded-[3rem] p-2 shadow-2xl border border-gray-700">
                  {/* Phone screen */}
                  <div className="w-80 h-[640px] bg-black rounded-[2.5rem] overflow-hidden relative">
                    
                    {/* Video placeholder - Replace with your actual video */}
                    <video 
                      className="w-full h-full object-cover rounded-[2.5rem]"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    >
                      <source src="edumate-gh-demo.mp4" type="video/mp4" />
                      {/* Fallback content for demo purposes */}
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <div className="text-gray-400 text-center p-8">
                          <div className="text-4xl mb-4">🎓</div>
                          <p className="text-sm">EduMate GH<br />Demo Video</p>
                        </div>
                      </div>
                    </video>

                    {/* Status bar overlay */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white text-sm z-10 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="font-semibold">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-3 bg-white rounded-full opacity-60"></div>
                          <div className="w-1 h-3 bg-white rounded-full opacity-80"></div>
                          <div className="w-1 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="w-6 h-3 border border-white rounded-sm">
                          <div className="w-4 h-1.5 bg-white rounded-sm m-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Video overlay elements */}
                    <div className="absolute bottom-20 left-6 right-6 z-10">
                      <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-600">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl">🎓</span>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-sm">EduMate GH</h3>
                            <p className="text-gray-300 text-xs">AI-Powered Learning</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-xs text-gray-300">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                            <span>BECE & WASSCE Ready</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-300">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                            <span>Twi • Ewe • Hausa</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-gray-400 text-xs mb-1">LAUNCHING IN</p>
                          <p className="text-white font-mono font-bold text-sm">{timeLeft}</p>
                        </div>
                      </div>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-10"></div>
                  </div>
                </div>

                {/* Floating elements around phone */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-full animate-bounce opacity-40"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}