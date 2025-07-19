
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";

export function AdminAdToggle() {
    const [adsEnabled, setAdsEnabled] = useState(false);
    const { toast } = useToast();
    const { language } = useSettings();
    const t = getDictionary(language);

    const handleToggle = (checked: boolean) => {
        setAdsEnabled(checked);
        toast({
            title: `${t.adminAdToggle.ads} ${checked ? t.adminAdToggle.enabled : t.adminAdToggle.disabled}`,
            description: `${t.adminAdToggle.adsWillNow} ${checked ? t.adminAdToggle.beDisplayed : t.adminAdToggle.beHidden'} ${t.adminAdToggle.acrossSite}`,
        });
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="ad-toggle" className="text-base">
                    {t.adminAdToggle.enableAds}
                </Label>
                <p className="text-sm text-muted-foreground">
                   {t.adminAdToggle.description}
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
