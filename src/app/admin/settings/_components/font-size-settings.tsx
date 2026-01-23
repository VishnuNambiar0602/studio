"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import type { FontSize } from "@/lib/types";

export function AdminFontSizeSettings() {
  const { fontSize, setFontSize, language } = useSettings();
  const t = getDictionary(language);

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <h3 className="font-semibold">Global Font Size</h3>
          <p className="text-sm text-muted-foreground">
            Adjust the base text size across the entire platform.
          </p>
        </div>
        <RadioGroup
          value={fontSize}
          onValueChange={(value) => setFontSize(value as FontSize)}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sm" id="font-sm-admin" />
            <Label htmlFor="font-sm-admin" className="text-sm">{t.settings.small}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="md" id="font-md-admin" />
            <Label htmlFor="font-md-admin" className="text-md">{t.settings.medium}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lg" id="font-lg-admin" />
            <Label htmlFor="font-lg-admin" className="text-lg">{t.settings.large}</Label>
          </div>
        </RadioGroup>
    </div>
  );
}
