
"use client";

import { useEffect } from "react";
import { useSettings, SettingsProvider } from "@/context/settings-context";
import { PartProvider } from "@/context/part-context";
import { CartProvider } from "@/context/cart-context";
import { cn } from "@/lib/utils";

// This component applies settings to the <html> tag
function SettingsApplier({ children }: { children: React.ReactNode }) {
    const { language, fontSize, theme, colorScheme } = useSettings();

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

    useEffect(() => {
        if (colorScheme) {
            const root = document.documentElement;
            root.style.setProperty('--primary', `${colorScheme.primary.h} ${colorScheme.primary.s}% ${colorScheme.primary.l}%`);
            root.style.setProperty('--background', `${colorScheme.background.h} ${colorScheme.background.s}% ${colorScheme.background.l}%`);
            root.style.setProperty('--accent', `${colorScheme.accent.h} ${colorScheme.accent.s}% ${colorScheme.accent.l}%`);
        }
    }, [colorScheme]);


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
