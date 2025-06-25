"use client";

import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/stores/adminAuth";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileQuestion,
  FileText,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  Plus,
  Settings,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    subItems: []
  },
  {
    title: "Curriculum",
    icon: BookOpen,
    href: "/admin/curriculum",
    subItems: [
      {
        title: "View Curriculum",
        href: "/admin/curriculum",
        icon: BookOpen
      },
      {
        title: "Add New Curriculum",
        href: "/admin/curriculum/new",
        icon: Plus
      }
    ]
  },
{
  title: "Curriculum Strands",
  icon: GitBranch,
  href: "/admin/curriculum-strands",
  subItems: [
    {
      title: "View Curriculum Strands",
      href: "/admin/curriculum-strands",
      icon: GitBranch
    },
    {
      title: "Add New Strand",
      href: "/admin/curriculum-strands/strand",
      icon: Plus
    },
    {
      title: "Add New Sub-Strand",
      href: "/admin/curriculum-strands/sub-strand",
      icon: Plus
    },
    {
      title: "Add New Content Standard",
      href: "/admin/curriculum-strands/content-standard",
      icon: Plus
    },
    {
      title: "Add New Indicator",
      href: "/admin/curriculum-strands/indicator",
      icon: Plus
    }
  ]
},

  {
    title: "Textbooks",
    icon: Library,
    href: "/admin/textbooks",
    subItems: [
      {
        title: "View Textbooks",
        href: "/admin/textbooks",
        icon: Library
      },
      {
        title: "Add New Textbook",
        href: "/admin/textbooks/new",
        icon: Plus
      }
    ]
  },
  {
    title: "Lessons",
    icon: GraduationCap,
    href: "/admin/lessons",
    subItems: [
      {
        title: "View Lessons",
        href: "/admin/lessons",
        icon: GraduationCap
      },
      {
        title: "Add New Lesson",
        href: "/admin/lessons/new",
        icon: Plus
      }
    ]
  },
  {
    title: "Lesson Notes",
    icon: FileText,
    href: "/admin/notes",
    subItems: [
      {
        title: "View Notes",
        href: "/admin/notes",
        icon: FileText
      },
      {
        title: "Add New Note",
        href: "/admin/notes/new",
        icon: Plus
      }
    ]
  },
  {
    title: "Quizzes",
    icon: FileQuestion,
    href: "/admin/quizzes",
    subItems: [
      {
        title: "View Quizzes",
        href: "/admin/quizzes",
        icon: FileQuestion
      },
      {
        title: "Add New Quiz",
        href: "/admin/quizzes/new",
        icon: Plus
      }
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    subItems: []
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAdminAuthStore((state) => state.logout);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const toggleSubMenu = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isItemExpanded = (title: string) => expandedItems.includes(title);

  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30">
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-8 w-8 text-edumate-purple" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-primary-gradient">
                EduMate Admin
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-1"
              >
                {/* Main Menu Item */}
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors flex-1",
                      pathname === item.href
                        ? "bg-edumate-purple/10 text-edumate-purple"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                  
                  {/* Expand/Collapse Button for items with sub-menus */}
                  {item.subItems.length > 0 && (
                    <button
                      onClick={() => toggleSubMenu(item.title)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {isItemExpanded(item.title) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Sub Menu Items */}
                <AnimatePresence>
                  {item.subItems.length > 0 && isItemExpanded(item.title) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700"
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center space-x-3 px-4 py-2 ml-4 rounded-lg transition-colors text-sm",
                            pathname === subItem.href
                              ? "bg-edumate-purple/10 text-edumate-purple"
                              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 flex-shrink-0" />
                          <span>{subItem.title}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: menuItems.length * 0.1 }}
              className="pt-4 mt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Logout</span>
              </button>
            </motion.div>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isMobileOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 overflow-y-auto w-80 lg:hidden"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center space-x-2"
            onClick={closeMobileSidebar}
          >
            <BookOpen className="h-8 w-8 text-edumate-purple" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-primary-gradient">
              EduMate Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-1"
            >
              {/* Main Menu Item */}
              <div className="flex items-center">
                <Link
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors flex-1 min-h-[48px]",
                    pathname === item.href
                      ? "bg-edumate-purple/10 text-edumate-purple"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.title}</span>
                </Link>
                
                {/* Expand/Collapse Button for items with sub-menus */}
                {item.subItems.length > 0 && (
                  <button
                    onClick={() => toggleSubMenu(item.title)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isItemExpanded(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              {/* Sub Menu Items */}
              <AnimatePresence>
                {item.subItems.length > 0 && isItemExpanded(item.title) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700"
                  >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={closeMobileSidebar}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2 ml-4 rounded-lg transition-colors text-sm min-h-[40px]",
                          pathname === subItem.href
                            ? "bg-edumate-purple/10 text-edumate-purple"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <subItem.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: menuItems.length * 0.1 }}
            className="pt-4 mt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => {
                logout();
                closeMobileSidebar();
              }}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[48px]"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        </nav>
      </motion.div>
    </>
  );
}