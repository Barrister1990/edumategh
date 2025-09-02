"use client";

import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  GraduationCap,
  Send,
  Target,
  UserCheck,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotificationForm {
  title: string;
  message: string;
  targetAudience: 'all' | 'students' | 'teachers';
  category: 'announcement' | 'reminder' | 'update' | 'promotion';
}



export default function SendNotificationsPage() {
  const [form, setForm] = useState<NotificationForm>({
    title: '',
    message: '',
    targetAudience: 'all',
    category: 'announcement'
  });
  const [isSending, setIsSending] = useState(false);
  const [userCounts, setUserCounts] = useState({
    all: 0,
    students: 0,
    teachers: 0
  });

  // Fetch user counts on component mount
  useEffect(() => {
    fetchUserCounts();
  }, []);

  const fetchUserCounts = async () => {
    try {
      // Get all users with expo push tokens
      const { data: allUsers, count: allCount } = await supabase
        .from('users')
        .select('id, expoPushToken, role', { count: 'exact' })
        .not('expoPushToken', 'is', null);

      // Get students with expo push tokens
      const { count: studentsCount } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('role', 'student')
        .not('expoPushToken', 'is', null);

      // Get teachers with expo push tokens
      const { count: teachersCount } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('role', 'teacher')
        .not('expoPushToken', 'is', null);

      setUserCounts({
        all: allCount || 0,
        students: studentsCount || 0,
        teachers: teachersCount || 0
      });
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

  const handleInputChange = (field: keyof NotificationForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendNotification = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/send-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          message: form.message,
          targetAudience: form.targetAudience,
          category: form.category
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notifications');
      }

      console.log("✅ Notifications sent successfully:", result);
      alert(`Successfully sent ${result.totalSent} notifications to ${result.totalUsers} users!`);
      
      // Reset form
      setForm({
        title: '',
        message: '',
        targetAudience: 'all',
        category: 'announcement'
      });

    } catch (error: any) {
      console.error("❌ Error sending notifications:", error);
      const errorMessage = error?.message || 'Unknown error occurred';
      alert(`Failed to send notifications: ${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all': return <Users className="h-4 w-4" />;
      case 'students': return <GraduationCap className="h-4 w-4" />;
      case 'teachers': return <UserCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'reminder': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'update': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'promotion': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                Send Push Notifications
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Send Expo push notifications to your users
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notification Details
              </h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter notification title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Enter your message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="reminder">Reminder</option>
                    <option value="update">Update</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings & Preview */}
          <div className="space-y-4 sm:space-y-6">
            {/* Target Audience */}
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target Audience
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'all', label: 'All Users', icon: Users, count: userCounts.all },
                  { id: 'students', label: 'Students Only', icon: GraduationCap, count: userCounts.students },
                  { id: 'teachers', label: 'Teachers Only', icon: UserCheck, count: userCounts.teachers }
                ].map((audience) => (
                  <label key={audience.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value={audience.id}
                      checked={form.targetAudience === audience.id}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <audience.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {audience.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {audience.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Preview
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {form.title || 'Notification Title'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {form.message || 'Your notification message will appear here...'}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(form.category)}`}>
                    {form.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    To: {form.targetAudience === 'all' ? 'All Users' : 
                         form.targetAudience === 'students' ? 'Students Only' : 'Teachers Only'} 
                    ({userCounts[form.targetAudience].toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendNotification}
              disabled={isSending || !form.title.trim() || !form.message.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Notification
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}