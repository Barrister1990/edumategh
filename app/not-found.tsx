'use client';
import { ArrowLeft, BookOpen, Home, Search, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-200/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-violet-200/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main 404 Section */}
        <div className="mb-8">
          {/* Large 404 with floating books */}
          <div className="relative mb-8">
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent select-none">
              4
              <span className="relative inline-block">
                0
                {/* Floating book icon in the "0" */}
                <BookOpen className="absolute inset-0 m-auto w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-indigo-500 animate-pulse" />
              </span>
              4
            </h1>
            
            {/* Floating educational icons */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <Sparkles className="absolute top-10 left-1/4 w-6 h-6 text-purple-400 animate-ping" style={{ animationDelay: '0s' }} />
              <Sparkles className="absolute bottom-10 right-1/4 w-4 h-4 text-indigo-400 animate-ping" style={{ animationDelay: '1s' }} />
              <Sparkles className="absolute top-1/2 left-10 w-5 h-5 text-violet-400 animate-ping" style={{ animationDelay: '2s' }} />
            </div>
          </div>

          {/* Error message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Oops! This page took a study break
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-2">
              Looks like this page went to the library and never came back!
            </p>
            <p className="text-base sm:text-lg text-gray-500">
              Don&apos;t worry, there&apos;s plenty more to explore in EduMate GH
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Back to Home
          </Link>
          
          <Link
            href="/search"
            className="group inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Search Resources
          </Link>
        </div>

        {/* Quick navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Link
            href="/courses"
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <BookOpen className="w-8 h-8 text-indigo-600 mb-3 mx-auto group-hover:animate-bounce" />
            <h3 className="font-semibold text-gray-800 mb-2">Browse Courses</h3>
            <p className="text-sm text-gray-600">Explore our educational content</p>
          </Link>

          <Link
            href="/community"
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Users className="w-8 h-8 text-purple-600 mb-3 mx-auto group-hover:animate-bounce" />
            <h3 className="font-semibold text-gray-800 mb-2">Join Community</h3>
            <p className="text-sm text-gray-600">Connect with fellow learners</p>
          </Link>

          <Link
            href="/help"
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-8 h-8 text-indigo-600 mb-3 mx-auto group-hover:animate-pulse" />
            <h3 className="font-semibold text-gray-800 mb-2">Get Help</h3>
            <p className="text-sm text-gray-600">Find support and resources</p>
          </Link>
        </div>

        {/* Fun educational quote */}
        <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/50">
          <blockquote className="text-lg font-medium text-gray-700 mb-2">
            &apos;Every master was once a disaster&apos;
          </blockquote>
          <cite className="text-sm text-gray-500">- Keep learning with EduMate GH!</cite>
        </div>

        {/* Back button with animation */}
        <button
          onClick={() => window.history.back()}
          className="group inline-flex items-center mt-8 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}