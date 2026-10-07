'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, TRANSLATIONS } from '@/lib/app-config';
import { AdminUser } from '@/lib/types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  adminUser: AdminUser | null;
  setAdminUser: (admin: AdminUser | null) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
  notifications: string[];
  addNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [adminUser, setAdminUserState] = useState<AdminUser | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang && ['ar', 'en', 'fr'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
      setThemeState(savedTheme);
    } else {
      setThemeState('dark');
    }
    const savedAdmin = localStorage.getItem('app_admin');
    if (savedAdmin) {
      try { setAdminUserState(JSON.parse(savedAdmin)); } catch(e){}
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const setTheme = (th: Theme) => {
    setThemeState(th);
    localStorage.setItem('app_theme', th);
  };

  const setAdminUser = (admin: AdminUser | null) => {
    setAdminUserState(admin);
    if (admin) {
      localStorage.setItem('app_admin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('app_admin');
    }
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev]);
  };

  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        adminUser,
        setAdminUser,
        t,
        notifications,
        addNotification
      }}
    >
      <div className={language === 'ar' ? 'font-amiri' : 'font-sans'}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
