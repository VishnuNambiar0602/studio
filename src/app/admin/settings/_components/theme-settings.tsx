"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";

export function AdminThemeSettings() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <h3 className="font-semibold">Global Theme</h3>
          <p className="text-sm text-muted-foreground">
            Set the theme for all users of the application.
          </p>
        </div>
        <ThemeSwitcher />
    </div>
  );
}
