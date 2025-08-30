"use client";

import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    HelpCircle,
    Mail,
    Search,
    Tag,
    User
} from 'lucide-react';
import { useState } from 'react';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  user: {
    name: string;
    email: string;
    type: 'student' | 'teacher' | 'premium';
  };
  category: 'technical' | 'billing' | 'content' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdated: string;
  assignedTo?: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'T001',
    title: 'Cannot access BECE past questions',
    description: 'I\'m trying to access the BECE past questions but getting an error message. Please help.',
    user: {
      name: 'Kwame Asante',
      email: 'kwame.asante@email.com',
      type: 'student'
    },
    category: 'technical',
    priority: 'high',
    status: 'open',
    createdAt: '2 hours ago',
    lastUpdated: '2 hours ago'
  },
  {
    id: 'T002',
    title: 'Premium subscription not working',
    description: 'I upgraded to premium but still can\'t access premium features. Payment was successful.',
    user: {
      name: 'Ama Osei',
      email: 'ama.osei@email.com',
      type: 'premium'
    },
    category: 'billing',
    priority: 'urgent',
    status: 'in-progress',
    createdAt: '1 day ago',
    lastUpdated: '4 hours ago',
    assignedTo: 'Support Team'
  },
  {
    id: 'T003',
    title: 'Need help with lesson planning',
    description: 'I\'m a teacher and would like guidance on how to use the lesson planning features effectively.',
    user: {
      name: 'Dr. Mensah',
      email: 'dr.mensah@school.edu.gh',
      type: 'teacher'
    },
    category: 'content',
    priority: 'medium',
    status: 'open',
    createdAt: '3 days ago',
    lastUpdated: '3 days ago'
  },
  {
    id: 'T004',
    title: 'App crashes on startup',
    description: 'The app keeps crashing immediately after opening on my Android device.',
    user: {
      name: 'Kofi Addo',
      email: 'kofi.addo@email.com',
      type: 'student'
    },
    category: 'technical',
    priority: 'high',
    status: 'resolved',
    createdAt: '1 week ago',
    lastUpdated: '2 days ago',
    assignedTo: 'Tech Team'
  }
];

export default function CustomerSupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      closed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const getUserTypeColor = (type: string) => {
    const colors = {
      student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      teacher: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      premium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return colors[type as keyof typeof colors] || colors.student;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
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
                Customer Support
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Manage support tickets and help requests
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Open', count: mockTickets.filter(t => t.status === 'open').length, color: 'bg-blue-500' },
            { label: 'In Progress', count: mockTickets.filter(t => t.status === 'in-progress').length, color: 'bg-yellow-500' },
            { label: 'Resolved', count: mockTickets.filter(t => t.status === 'resolved').length, color: 'bg-green-500' },
            { label: 'Total', count: mockTickets.length, color: 'bg-gray-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ticket List */}
          <div className="lg:col-span-2">
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Ticket List */}
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm cursor-pointer transition-all border-2 ${
                    selectedTicket === ticket.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{ticket.user.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full ${getUserTypeColor(ticket.user.type)}`}>
                        {ticket.user.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{ticket.createdAt}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Ticket Details */}
          <div className="space-y-6">
            {selectedTicket ? (
              (() => {
                const ticket = mockTickets.find(t => t.id === selectedTicket);
                if (!ticket) return null;
                
                return (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Ticket Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{ticket.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Priority:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">User Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{ticket.user.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{ticket.user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-400" />
                            <span className={`px-2 py-1 rounded-full text-xs ${getUserTypeColor(ticket.user.type)}`}>
                              {ticket.user.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Reply</h5>
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        />
                        <div className="flex gap-2 mt-2">
                          <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Send Reply
                          </button>
                          <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a Ticket
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose a ticket from the list to view details and respond
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
