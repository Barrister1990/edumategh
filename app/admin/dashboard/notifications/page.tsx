"use client";

import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Bell,
    Clock,
    MessageSquare,
    Send,
    Target
} from 'lucide-react';
import { useState } from 'react';

interface NotificationTemplate {
  id: string;
  title: string;
  description: string;
  category: 'announcement' | 'reminder' | 'update' | 'promotion';
  targetAudience: 'all' | 'students' | 'teachers' | 'premium';
  lastUsed: string;
  useCount: number;
}

const notificationTemplates: NotificationTemplate[] = [
  {
    id: '1',
    title: 'New BECE Past Questions Available',
    description: 'Announce the addition of new BECE past questions to the platform',
    category: 'announcement',
    targetAudience: 'students',
    lastUsed: '2 days ago',
    useCount: 15
  },
  {
    id: '2',
    title: 'Weekly Study Reminder',
    description: 'Gentle reminder for students to complete their weekly assignments',
    category: 'reminder',
    targetAudience: 'students',
    lastUsed: '1 week ago',
    useCount: 8
  },
  {
    id: '3',
    title: 'Teacher Training Session',
    description: 'Invite teachers to upcoming training sessions on new features',
    category: 'update',
    targetAudience: 'teachers',
    lastUsed: '3 days ago',
    useCount: 12
  },
  {
    id: '4',
    title: 'Premium Features Promotion',
    description: 'Highlight new premium features available to upgrade users',
    category: 'promotion',
    targetAudience: 'premium',
    lastUsed: '5 days ago',
    useCount: 6
  }
];

export default function SendNotificationsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<'template' | 'custom'>('template');
  const [targetAudience, setTargetAudience] = useState('all');
  const [scheduledTime, setScheduledTime] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    // Show success message
    alert('Notification sent successfully!');
  };

  const getAudienceCount = (audience: string) => {
    const counts = {
      all: 25843,
      students: 18234,
      teachers: 2109,
      premium: 3456
    };
    return counts[audience as keyof typeof counts] || 0;
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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Send Notifications
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Communicate with your users effectively
              </p>
            </div>
          </div>
        </div>

        {/* Notification Type Toggle */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
            <div className="flex">
              <button
                onClick={() => setNotificationType('template')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  notificationType === 'template'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Use Template
              </button>
              <button
                onClick={() => setNotificationType('custom')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  notificationType === 'custom'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Custom Message
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Templates or Custom Form */}
          <div className="lg:col-span-2">
            {notificationType === 'template' ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose Template
                </h3>
                <div className="space-y-3">
                  {notificationTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {template.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full ${
                              template.category === 'announcement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                              template.category === 'reminder' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              template.category === 'update' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            }`}>
                              {template.category}
                            </span>
                            <span>Used {template.useCount} times</span>
                            <span>{template.lastUsed}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Custom Notification
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="Enter notification title"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Enter your message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Settings & Preview */}
          <div className="space-y-6">
            {/* Target Audience */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Target Audience
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'all', label: 'All Users', count: 25843, color: 'bg-blue-500' },
                  { id: 'students', label: 'Students Only', count: 18234, color: 'bg-green-500' },
                  { id: 'teachers', label: 'Teachers Only', count: 2109, color: 'bg-purple-500' },
                  { id: 'premium', label: 'Premium Users', count: 3456, color: 'bg-yellow-500' }
                ].map((audience) => (
                  <label key={audience.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value={audience.id}
                      checked={targetAudience === audience.id}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {audience.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {audience.count.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${audience.color}`}
                          style={{ width: `${(audience.count / 25843) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule
              </h3>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Send Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500">
                  Leave empty to send immediately
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Preview
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {notificationType === 'template' && selectedTemplate 
                      ? notificationTemplates.find(t => t.id === selectedTemplate)?.title 
                      : customTitle || 'Notification Title'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {notificationType === 'template' && selectedTemplate 
                    ? notificationTemplates.find(t => t.id === selectedTemplate)?.description 
                    : customMessage || 'Your notification message will appear here...'}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  To: {targetAudience === 'all' ? 'All Users' : 
                       targetAudience === 'students' ? 'Students Only' :
                       targetAudience === 'teachers' ? 'Teachers Only' : 'Premium Users'} 
                  ({getAudienceCount(targetAudience).toLocaleString()})
                </div>
              </div>
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendNotification}
              disabled={isSending || (!selectedTemplate && notificationType === 'template') || 
                       (notificationType === 'custom' && (!customTitle || !customMessage))}
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
