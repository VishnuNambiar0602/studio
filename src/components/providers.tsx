
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
            
            const newBackground = `${colorScheme.background.h} ${colorScheme.background.s}% ${colorScheme.background.l}%`;

            // --- Apply User-Defined Base Colors ---
            root.style.setProperty('--primary', `${colorScheme.primary.h} ${colorScheme.primary.s}% ${colorScheme.primary.l}%`);
            root.style.setProperty('--background', newBackground);
            root.style.setProperty('--accent', `${colorScheme.accent.h} ${colorScheme.accent.s}% ${colorScheme.accent.l}%`);
            
            // Also update card and popover to match the new background for consistency
            root.style.setProperty('--card', newBackground);
            root.style.setProperty('--popover', newBackground);

            // --- Auto-adjust Foreground Colors for Readability ---
            const bgLightness = Number(colorScheme.background.l);
            if (bgLightness < 55) { // Threshold for dark background
                // Use light text colors
                root.style.setProperty('--foreground', '35 30% 90%');
                root.style.setProperty('--card-foreground', '35 30% 90%');
                root.style.setProperty('--popover-foreground', '35 30% 90%');
                root.style.setProperty('--secondary-foreground', '35 30% 90%');
                root.style.setProperty('--muted-foreground', '35 30% 70%');
            } else {
                // Use dark text colors
                root.style.setProperty('--foreground', '25 35% 15%');
                root.style.setProperty('--card-foreground', '25 35% 15%');
                root.style.setProperty('--popover-foreground', '25 35% 15%');
                root.style.setProperty('--secondary-foreground', '25 35% 15%');
                root.style.setProperty('--muted-foreground', '25 30% 45%');
            }

            const primaryLightness = Number(colorScheme.primary.l);
            if (primaryLightness < 55) { // Threshold for dark primary
                // Use light text
                root.style.setProperty('--primary-foreground', '35 50% 98%');
            } else {
                // Use dark text
                 root.style.setProperty('--primary-foreground', '25 30% 12%');
            }

            const accentLightness = Number(colorScheme.accent.l);
            if (accentLightness < 55) { // Threshold for dark accent
                // Use light text
                root.style.setProperty('--accent-foreground', '30 60% 75%');
            } else {
                // Use dark text
                root.style.setProperty('--accent-foreground', '25 55% 35%');
            }
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
