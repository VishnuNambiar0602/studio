"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/context/settings-context";
import type { Language, FontSize } from "@/lib/types";


export function SettingsControls() {
  const { fontSize, setFontSize, language, setLanguage } = useSettings();

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
        <div>
          <h3 className="font-semibold">Font Size</h3>
          <p className="text-sm text-muted-foreground">
            Adjust the text size for better readability.
          </p>
        </div>
        <RadioGroup
          value={fontSize}
          onValueChange={(value) => setFontSize(value as FontSize)}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sm" id="font-sm" />
            <Label htmlFor="font-sm" className="text-sm">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="md" id="font-md" />
            <Label htmlFor="font-md" className="text-md">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lg" id="font-lg" />
            <Label htmlFor="font-lg" className="text-lg">Large</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
        <div>
          <h3 className="font-semibold">Language</h3>
          <p className="text-sm text-muted-foreground">
            Choose your preferred language for the dashboard.
          </p>
        </div>
        <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية (Arabic)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
