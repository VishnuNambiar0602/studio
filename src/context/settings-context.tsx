// Edited

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
  taxRate: number;
  setTaxRate: (rate: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [language, setLanguage] = useState<Language>('en');
  const [taxRate, setTaxRate] = useState<number>(0); // Default tax rate
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
        const storedFontSize = localStorage.getItem("fontSize") as FontSize;
        if (storedFontSize) setFontSize(storedFontSize);

        const storedLanguage = localStorage.getItem("language") as Language;
        if (storedLanguage) setLanguage(storedLanguage);
        
        const storedTaxRate = localStorage.getItem("taxRate");
        if (storedTaxRate) setTaxRate(parseFloat(storedTaxRate));

    } catch (error) {
        console.error("Failed to parse from localStorage", error);
        localStorage.clear();
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleSetFontSize = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
  }
  
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  }
  
  const handleSetTaxRate = (rate: number) => {
    setTaxRate(rate);
    localStorage.setItem("taxRate", rate.toString());
  }

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

  // The loading state is for hydrating from localStorage, we don't need a visual spinner for this,
  // as it would cause a flicker. The main loading spinner is now in the PartProvider.
  if (isLoading) {
    return null; 
  }

  return (
    <SettingsContext.Provider value={{ 
      fontSize, setFontSize: handleSetFontSize,
      language, setLanguage: handleSetLanguage,
      taxRate, setTaxRate: handleSetTaxRate,
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
