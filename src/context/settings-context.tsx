
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { FontSize, Language, User } from "@/lib/types";
import { loginUser as serverLogin } from "@/lib/actions";

interface SettingsContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  loggedInUser: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-sm', 'font-md', 'font-lg');
    root.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const loginUser = (user: User) => {
    setLoggedInUser(user);
    setIsLoggedIn(true);
  }

  const logoutUser = () => {
    setLoggedInUser(null);
    setIsLoggedIn(false);
  }


  return (
    <SettingsContext.Provider value={{ 
      fontSize, setFontSize,
      language, setLanguage,
      isLoggedIn, setIsLoggedIn,
      loggedInUser, loginUser, logoutUser
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
