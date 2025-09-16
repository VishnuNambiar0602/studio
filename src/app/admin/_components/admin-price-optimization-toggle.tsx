"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/context/settings-context";

export function AdminPriceOptimizationToggle() {
    const { isPriceOptimizationEnabled, setIsPriceOptimizationEnabled } = useSettings();
    const { toast } = useToast();

    const handleToggle = (checked: boolean) => {
        setIsPriceOptimizationEnabled(checked);
        toast({
            title: `Price Optimization ${checked ? "Enabled" : "Disabled"}`,
            description: `Vendors will now ${checked ? "be able to" : "not be able to"} use the AI price suggestion tool.`,
        });
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="price-opt-toggle" className="text-base">
                    Enable AI Price Optimization
                </Label>
                <p className="text-sm text-muted-foreground">
                   Allow vendors to use an AI tool to suggest pricing.
                </p>
            </div>
            <Switch
                id="price-opt-toggle"
                checked={isPriceOptimizationEnabled}
                onCheckedChange={handleToggle}
                aria-label="Toggle AI price optimization for vendors"
            />
        </div>
    )
}
