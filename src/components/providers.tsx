"use client";

import { useEffect } from "react";
import { useSettings, SettingsProvider } from "@/context/settings-context";
import { PartProvider } from "@/context/part-context";
import { CartProvider } from "@/context/cart-context";
import { cn } from "@/lib/utils";

// This component applies settings to the <html> tag
function SettingsApplier({ children }: { children: React.ReactNode }) {
    const { language, fontSize, theme } = useSettings();

    useEffect(() => {
        const html = document.documentElement;
        html.lang = language;
        html.dir = language === 'ar' ? 'rtl' : 'ltr';
        
        // Apply theme
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        // Apply font size
        html.classList.remove('font-sm', 'font-md', 'font-lg');
        html.classList.add(`font-${fontSize}`);

    }, [language, fontSize, theme]);

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
