"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/stores/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Moon,
  Sun,
  Volume2,
  Bell,
  Globe,
  User,
  Mail,
  Briefcase,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { profile, settings, updateProfile, updateSettings } = useSettingsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Profile settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile settings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Name
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Role
                </Label>
                <Input
                  id="role"
                  value={profile.role}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-gradient hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* App Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-6">App Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4" />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <Label htmlFor="ai-reading">AI Reading</Label>
                </div>
                <Switch
                  id="ai-reading"
                  checked={settings.aiReading}
                  onCheckedChange={(checked) => updateSettings({ aiReading: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="notifications">Notifications</Label>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Language
                </Label>
                <Select
                  value={settings.language}
                  onValueChange={(value: 'en' | 'tw') => updateSettings({ language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="tw">Twi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-type">Voice Type</Label>
                <Select
                  value={settings.voiceType}
                  onValueChange={(value: 'male' | 'female') => updateSettings({ voiceType: value })}
                >
                  <SelectTrigger id="voice-type">
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reading-speed">Reading Speed</Label>
                <Select
                  value={settings.readingSpeed}
                  onValueChange={(value: 'slow' | 'normal' | 'fast') => updateSettings({ readingSpeed: value })}
                >
                  <SelectTrigger id="reading-speed">
                    <SelectValue placeholder="Select reading speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}