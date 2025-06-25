import { supabase } from '@/lib/supabase'; // Adjust the import path to your supabase client
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      
      login: async (email: string, password: string) => {
        set({ loading: true });
        
        try {
          // First, authenticate with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
console.log("This is my id ",authData.user?.id)
          if (authError) {
            throw new Error(authError.message);
          }

          if (!authData.user) {
            throw new Error('Authentication failed');
          }

          // Check if the authenticated user exists in the admin table
          const { data: adminData, error: adminError } = await supabase
            .from('admin') // Assuming your admin table is named 'admins'
            .select('*')
            .eq('id', authData.user.id)
            .single();
            console.log("From database ",adminData)
          if (adminError) {
            // If user doesn't exist in admin table
            if (adminError.code === 'PGRST116') {
              // Sign out the user since they don't have admin access
              await supabase.auth.signOut();
              throw new Error('You do not have admin access. Kindly download our app to continue.');
            }
            throw new Error('Failed to verify admin access');
          }

          if (!adminData) {
            // Sign out the user since they don't have admin access
            await supabase.auth.signOut();
            throw new Error('You do not have admin access. Kindly download our app to continue1.');
          }

          // Set the admin user data
          set({
            user: {
              id: adminData.id,
              email: adminData.email,
              name: adminData.name || adminData.full_name || 'Admin User', // Adjust field names as needed
              role: adminData.role || "role",
            },
            isAuthenticated: true,
            loading: false,
          });

        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        
        try {
          // Sign out from Supabase
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Logout error:', error);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear the store regardless of Supabase logout success
          set({ 
            user: null, 
            isAuthenticated: false, 
            loading: false 
          });
        }
      },

      checkAuthStatus: async () => {
        set({ loading: true });
        
        try {
          // Get current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }

          if (!session || !session.user) {
            set({ 
              user: null, 
              isAuthenticated: false, 
              loading: false 
            });
            return;
          }

          // Verify the user still exists in admin table
          const { data: adminData, error: adminError } = await supabase
            .from('admin')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (adminError || !adminData) {
            // User no longer has admin access, sign them out
            await supabase.auth.signOut();
            set({ 
              user: null, 
              isAuthenticated: false, 
              loading: false 
            });
            return;
          }

          // Update user data
          set({
            user: {
              id: adminData.id,
              email: adminData.email,
              name: adminData.name || adminData.full_name || 'Admin User',
              role: adminData.role || "admin",
            },
            isAuthenticated: true,
            loading: false,
          });

        } catch (error) {
          console.error('Auth check error:', error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            loading: false 
          });
        }
      },
    }),
    {
      name: 'admin-auth',
      // Only persist user data, not loading state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  const { checkAuthStatus } = useAdminAuthStore.getState();
  
  if (event === 'SIGNED_OUT' || !session) {
    useAdminAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      loading: false 
    });
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    // Re-check admin status when auth state changes
    checkAuthStatus();
  }
});