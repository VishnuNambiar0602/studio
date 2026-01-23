
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/settings-context";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { ColorScheme, ColorDefinition } from "@/lib/types";

const DEFAULT_LIGHT_SCHEME: ColorScheme = {
    primary: { h: '25', s: '55', l: '35' },
    background: { h: '35', s: '50', l: '98' },
    accent: { h: '30', s: '45', l: '92' },
};

function ColorInputGroup({ label, color, onChange }: { label: string, color: ColorDefinition, onChange: (part: 'h' | 's' | 'l', value: string) => void }) {
    return (
        <div className="space-y-2">
            <h4 className="font-medium text-sm capitalize">{label}</h4>
            <div className="flex items-center gap-2">
                 <div style={{ backgroundColor: `hsl(${color.h} ${color.s}% ${color.l}%)` }} className="h-10 w-10 shrink-0 rounded-md border" />
                <div className="grid grid-cols-3 gap-2 flex-grow">
                    <div>
                        <Label htmlFor={`${label}-h`} className="text-xs text-muted-foreground">H</Label>
                        <Input id={`${label}-h`} type="number" min="0" max="360" value={color.h} onChange={(e) => onChange('h', e.target.value)} />
                    </div>
                     <div>
                        <Label htmlFor={`${label}-s`} className="text-xs text-muted-foreground">S%</Label>
                        <Input id={`${label}-s`} type="number" min="0" max="100" value={color.s} onChange={(e) => onChange('s', e.target.value)} />
                    </div>
                     <div>
                        <Label htmlFor={`${label}-l`} className="text-xs text-muted-foreground">L%</Label>
                        <Input id={`${label}-l`} type="number" min="0" max="100" value={color.l} onChange={(e) => onChange('l', e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )
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
    <div className="space-y-4 rounded-lg border p-4">
        <div>
          <h3 className="font-semibold">Global Color Scheme</h3>
          <p className="text-sm text-muted-foreground">
            Customize the primary, background, and accent colors using HSL values.
          </p>
        </div>

        <div className="space-y-3">
             <ColorInputGroup 
                label="Primary"
                color={localScheme.primary}
                onChange={(part, value) => handleInputChange('primary', part, value)}
            />
            <ColorInputGroup 
                label="Background"
                color={localScheme.background}
                onChange={(part, value) => handleInputChange('background', part, value)}
            />
            <ColorInputGroup 
                label="Accent"
                color={localScheme.accent}
                onChange={(part, value) => handleInputChange('accent', part, value)}
            />
        </div>

        <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" onClick={handleReset} size="sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
            </Button>
            <Button onClick={handleSave} size="sm">Save Colors</Button>
        </div>
    </div>
  );
}
