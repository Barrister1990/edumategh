export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AppSettings {
  darkMode: boolean;
  aiReading: boolean;
  notifications: boolean;
  language: 'en' | 'tw';
  voiceType: 'male' | 'female';
  readingSpeed: 'slow' | 'normal' | 'fast';
}

export interface SettingsState {
  profile: UserProfile;
  settings: AppSettings;
}