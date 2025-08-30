"use client";
import { supabase } from '@/lib/supabase';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Loader2,
    Mail,
    MessageSquare
} from 'lucide-react';
import { useState } from 'react';

// Supabase client setup


// Type definitions
interface FormData {
  email: string;
  reason: string;
  customReason: string;
}

interface FormErrors {
  email?: string;
  reason?: string;
  customReason?: string;
}

interface DeletionReason {
  value: string;
  label: string;
}

export default function AccountDeletePage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    reason: '',
    customReason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const deletionReasons: DeletionReason[] = [
    { value: 'not_using', label: 'I no longer use the app' },
    { value: 'privacy_concerns', label: 'Privacy concerns' },
    { value: 'poor_experience', label: 'Poor user experience' },
    { value: 'found_alternative', label: 'Found a better alternative' },
    { value: 'too_expensive', label: 'Subscription too expensive' },
    { value: 'technical_issues', label: 'Technical issues' },
    { value: 'other', label: 'Other (please specify)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Please select a reason for deletion';
    }
    
    if (formData.reason === 'other' && !formData.customReason.trim()) {
      newErrors.customReason = 'Please specify your reason';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .insert([
          {
            email: formData.email,
            reason: formData.reason,
            custom_reason: formData.reason === 'other' ? formData.customReason : null,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error saving deletion request:', error);
        // Handle error (you might want to show an error message to the user)
        alert('There was an error submitting your request. Please try again.');
        return;
      }

      // Success
      setIsSubmitted(true);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('There was an unexpected error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = (): void => {
    window.history.back();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 max-w-md">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-2">Account Deletion</h1>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Request Submitted
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              We have received your account deletion request. We will process it within 7-14 business days and send a confirmation to your email.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-amber-800 mb-1">
                    Important Notice
                  </p>
                  <p className="text-sm text-amber-700">
                    Once deleted, your account and all associated data cannot be recovered. Make sure to download any important content before the deletion is processed.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleBack}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
            >
              Back to Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">Delete Account</h1>
        </div>

        {/* Warning Card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">
                This action cannot be undone
              </h3>
              <p className="text-sm text-red-700">
                Deleting your account will permanently remove all your progress, saved lessons, and personal data from EduMate GH.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          {/* Reason Field */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reason for Deletion
            </label>
            <div className="space-y-3">
              {deletionReasons.map((reasonOption) => (
                <label key={reasonOption.value} className="flex items-center">
                  <input
                    type="radio"
                    name="reason"
                    value={reasonOption.value}
                    checked={formData.reason === reasonOption.value}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {reasonOption.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.reason && (
              <p className="text-red-600 text-sm mt-2">{errors.reason}</p>
            )}
          </div>

          {/* Custom Reason Field */}
          {formData.reason === 'other' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Please specify your reason
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="customReason"
                  value={formData.customReason}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your reason for leaving..."
                  rows={4}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${
                    errors.customReason ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.customReason && (
                <p className="text-red-600 text-sm mt-2">{errors.customReason}</p>
              )}
            </div>
          )}

          {/* Alternative Options */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">
              Before you go...
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Consider these alternatives instead of deleting your account:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Pause your subscription temporarily</li>
              <li>• Contact support for help with issues</li>
              <li>• Export your progress data first</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-medium hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing Request...</span>
              </>
            ) : (
              <span>Submit Deletion Request</span>
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}