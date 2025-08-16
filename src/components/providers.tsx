"use client";

import { useEffect } from "react";
import { useSettings, SettingsProvider } from "@/context/settings-context";
import { PartProvider } from "@/context/part-context";
import { CartProvider } from "@/context/cart-context";
import { cn } from "@/lib/utils";

// This component applies settings to the <html> tag
function SettingsApplier({ children }: { children: React.ReactNode }) {
    const { language, fontSize } = useSettings();

    useEffect(() => {
        const html = document.documentElement;
        html.lang = language;
        html.dir = language === 'ar' ? 'rtl' : 'ltr';
        // Remove previous font size classes to avoid conflicts
        html.classList.remove('font-sm', 'font-md', 'font-lg');
        // Add the current font size class
        html.classList.add(`font-${fontSize}`);
    }, [language, fontSize]);

    return <>{children}</>;
}


// This is the main provider component that wraps all client-side contexts
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <SettingsApplier>
        <PartProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </PartProvider>
      </SettingsApplier>
    </SettingsProvider>
  );
}
