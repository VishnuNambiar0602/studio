
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/settings-context";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { ColorScheme, ColorDefinition } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

const DEFAULT_LIGHT_SCHEME: ColorScheme = {
    primary: { h: '25', s: '55', l: '35' },
    background: { h: '35', s: '50', l: '98' },
    accent: { h: '30', s: '45', l: '92' },
};

function ColorSliderGroup({ label, color, onChange }: { label: string, color: ColorDefinition, onChange: (part: 'h' | 's' | 'l', value: string) => void }) {
    const handleSliderChange = (part: 'h' | 's' | 'l', value: number[]) => {
        onChange(part, value[0].toString());
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div style={{ backgroundColor: `hsl(${color.h} ${color.s}% ${color.l}%)` }} className="h-8 w-8 shrink-0 rounded-full border" />
                <h4 className="font-medium text-md capitalize">{label}</h4>
            </div>
            <div className="space-y-4 pl-3">
                {(['h', 's', 'l'] as const).map((part) => (
                    <div key={part} className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor={`${label}-${part}`} className="text-sm uppercase text-muted-foreground col-span-1">{part}</Label>
                        <Slider
                            id={`${label}-${part}`}
                            min={0}
                            max={part === 'h' ? 360 : 100}
                            step={1}
                            value={[Number(color[part])]}
                            onValueChange={(val) => handleSliderChange(part, val)}
                            className="col-span-4"
                        />
                        <span className="text-sm font-mono text-right col-span-1">{color[part]}{part !== 'h' && '%'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ColorSchemeSettings() {
  const { colorScheme, setColorScheme } = useSettings();
  const [localScheme, setLocalScheme] = useState<ColorScheme>(colorScheme);
  const { toast } = useToast();

  const handleInputChange = (color: 'primary' | 'background' | 'accent', part: 'h' | 's' | 'l', value: string) => {
    setLocalScheme(prev => ({
      ...prev,
      [color]: {
        ...prev[color],
        [part]: value
      }
    }));
  };

  const handleSave = () => {
    setColorScheme(localScheme);
    toast({
      title: "Color Scheme Updated!",
      description: "The new colors have been applied across the site.",
    });
  };
  
  const handleReset = () => {
      setLocalScheme(DEFAULT_LIGHT_SCHEME);
      setColorScheme(DEFAULT_LIGHT_SCHEME);
      toast({
        title: "Color Scheme Reset",
        description: "The default light theme colors have been restored.",
      });
  }

  return (
    <div className="space-y-6 rounded-lg border p-4">
        <div>
          <h3 className="font-semibold">Global Color Scheme</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust the primary, background, and accent colors using HSL sliders.
          </p>
        </div>

        <div className="space-y-6">
             <ColorSliderGroup 
                label="Primary"
                color={localScheme.primary}
                onChange={(part, value) => handleInputChange('primary', part, value)}
            />
            <Separator />
            <ColorSliderGroup 
                label="Background"
                color={localScheme.background}
                onChange={(part, value) => handleInputChange('background', part, value)}
            />
            <Separator />
            <ColorSliderGroup 
                label="Accent"
                color={localScheme.accent}
                onChange={(part, value) => handleInputChange('accent', part, value)}
            />
        </div>

        <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" onClick={handleReset} size="sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Default
            </Button>
            <Button onClick={handleSave} size="sm">Save Colors</Button>
        </div>
    </div>
  );
}
