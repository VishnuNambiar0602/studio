
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { FontSize, Language, PublicUser, User } from "@/lib/types";

interface SettingsContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  loggedInUser: PublicUser | null;
  loginUser: (user: PublicUser) => void;
  logoutUser: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser) {
            const user: PublicUser = JSON.parse(storedUser);
            setLoggedInUser(user);
            setIsLoggedIn(true);
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("loggedInUser");
    } finally {
        setIsLoading(false);
    }
  }, []);


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

  const loginUser = (user: PublicUser) => {
    setLoggedInUser(user);
    setIsLoggedIn(true);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  }

  const logoutUser = () => {
    setLoggedInUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("loggedInUser");
  }

  if (isLoading) {
    return (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
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
