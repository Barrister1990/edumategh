'use client';

import { AdminSidebar } from '@/components/AdminSidebar';
import { useAdminAuthStore } from '@/stores/adminAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {pathname === '/admin/login' ? (
        children
      ) : (
        <>
          <AdminSidebar />
          {/* Main content area with proper spacing for desktop sidebar */}
          <div className="lg:pl-64">
            <div className="p-4 lg:p-8 pt-16 lg:pt-8">
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  );
}