
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export function AdminAdToggle() {
    const [adsEnabled, setAdsEnabled] = useState(false);
    const { toast } = useToast();

    const handleToggle = (checked: boolean) => {
        setAdsEnabled(checked);
        toast({
            title: `Advertisements ${checked ? 'Enabled' : 'Disabled'}`,
            description: `Ads will now ${checked ? 'be displayed' : 'be hidden'} across the site. (Simulated)`,
        });
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="ad-toggle" className="text-base">
                    Enable Website Ads
                </Label>
                <p className="text-sm text-muted-foreground">
                   Control the display of advertisements across the entire platform.
                </p>
            </div>
            <Switch
                id="ad-toggle"
                checked={adsEnabled}
                onCheckedChange={handleToggle}
                aria-label="Toggle website advertisements"
            />
        </div>
    )
}
