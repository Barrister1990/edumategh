import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SettingsState, UserProfile, AppSettings } from '@/types/settings';

interface SettingsStore extends SettingsState {
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      profile: {
        name: 'Admin User',
        email: 'admin@edumate.gh',
        role: 'Administrator',
      },
      settings: {
        darkMode: false,
        aiReading: true,
        notifications: true,
        language: 'en',
        voiceType: 'female',
        readingSpeed: 'normal',
      },
      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: 'edumate-settings',
    }
  )
);