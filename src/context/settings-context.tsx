

"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { FontSize, Language, PublicUser, User, Theme, TtsVoice, ColorScheme } from "@/lib/types";

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1559607723-ee16c9ecb103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZGVzZXJ0JTIwY2FydG9vbiUyMHdpdGglMjBjYXJ8ZW58MHx8fHwxNzUyODI4MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const DEFAULT_LIGHT_SCHEME: ColorScheme = {
    primary: { h: '25', s: '55', l: '35' },
    background: { h: '35', s: '50', l: '98' },
    accent: { h: '30', s: '45', l: '92' },
};


interface SocialLink {
  url: string;
  isEnabled: boolean;
}

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
  heroImageUrl: string;
  setHeroImageUrl: (url: string) => void;
  isPriceOptimizationEnabled: boolean;
  setIsPriceOptimizationEnabled: (enabled: boolean) => void;
  socialLinks: {
    instagram: SocialLink;
    facebook: SocialLink;
    twitter: SocialLink;
  };
  setSocialLink: (platform: 'instagram' | 'facebook' | 'twitter', value: SocialLink) => void;
  ttsVoice: TtsVoice;
  setTtsVoice: (voice: TtsVoice) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [language, setLanguage] = useState<Language>('en');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [heroImageUrl, setHeroImageUrl] = useState<string>(DEFAULT_HERO_IMAGE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPriceOptimizationEnabled, setIsPriceOptimizationEnabled] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagram: { url: "", isEnabled: true },
    facebook: { url: "", isEnabled: true },
    twitter: { url: "", isEnabled: true },
  });
  const [ttsVoice, setTtsVoice] = useState<TtsVoice>('male');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(DEFAULT_LIGHT_SCHEME);


  useEffect(() => {
    try {
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser) {
            const user: PublicUser = JSON.parse(storedUser);
            setLoggedInUser(user);
            setIsLoggedIn(true);
        }
        
        const storedTheme = localStorage.getItem("theme") as Theme;
        if (storedTheme) setTheme(storedTheme);

        const storedFontSize = localStorage.getItem("fontSize") as FontSize;
        if (storedFontSize) setFontSize(storedFontSize);

        const storedLanguage = localStorage.getItem("language") as Language;
        if (storedLanguage) setLanguage(storedLanguage);
        
        const storedTaxRate = localStorage.getItem("taxRate");
        if (storedTaxRate) setTaxRate(parseFloat(storedTaxRate));
        
        const storedHeroImage = localStorage.getItem("heroImageUrl");
        if (storedHeroImage) setHeroImageUrl(storedHeroImage);
        
        const storedPriceOpt = localStorage.getItem("isPriceOptimizationEnabled");
        if (storedPriceOpt) setIsPriceOptimizationEnabled(JSON.parse(storedPriceOpt));

        const storedSocialLinks = localStorage.getItem("socialLinks");
        if (storedSocialLinks) setSocialLinks(JSON.parse(storedSocialLinks));

        const storedTtsVoice = localStorage.getItem("ttsVoice") as TtsVoice;
        if (storedTtsVoice) setTtsVoice(storedTtsVoice);

        const storedColorScheme = localStorage.getItem("colorScheme");
        if (storedColorScheme) setColorSchemeState(JSON.parse(storedColorScheme));


    } catch (error) {
        console.error("Failed to parse from localStorage", error);
        localStorage.clear();
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleSetTheme = (theme: Theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  }

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

  const handleSetHeroImageUrl = (url: string) => {
    setHeroImageUrl(url);
    localStorage.setItem("heroImageUrl", url);
  }
  
  const handleSetIsPriceOptimizationEnabled = (enabled: boolean) => {
    setIsPriceOptimizationEnabled(enabled);
    localStorage.setItem("isPriceOptimizationEnabled", JSON.stringify(enabled));
  }

  const handleSetSocialLink = (platform: 'instagram' | 'facebook' | 'twitter', value: SocialLink) => {
    const newSocialLinks = { ...socialLinks, [platform]: value };
    setSocialLinks(newSocialLinks);
    localStorage.setItem("socialLinks", JSON.stringify(newSocialLinks));
  }
  
  const handleSetTtsVoice = (voice: TtsVoice) => {
      setTtsVoice(voice);
      localStorage.setItem("ttsVoice", voice);
  }

  const handleSetColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    localStorage.setItem("colorScheme", JSON.stringify(scheme));
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

  if (isLoading) {
    return null; 
  }

  return (
    <SettingsContext.Provider value={{ 
      theme, setTheme: handleSetTheme,
      fontSize, setFontSize: handleSetFontSize,
      language, setLanguage: handleSetLanguage,
      taxRate, setTaxRate: handleSetTaxRate,
      heroImageUrl, setHeroImageUrl: handleSetHeroImageUrl,
      isLoggedIn, setIsLoggedIn,
      loggedInUser, loginUser, logoutUser,
      isPriceOptimizationEnabled, setIsPriceOptimizationEnabled: handleSetIsPriceOptimizationEnabled,
      socialLinks, setSocialLink: handleSetSocialLink,
      ttsVoice, setTtsVoice: handleSetTtsVoice,
      colorScheme, setColorScheme: handleSetColorScheme,
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
