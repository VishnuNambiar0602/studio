
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/context/settings-context";
import { Percent } from "lucide-react";


export function AdminTaxSettings() {
    const { taxRate, setTaxRate } = useSettings();
    const [currentRate, setCurrentRate] = useState(taxRate.toString());
    const { toast } = useToast();
    
    const handleSave = () => {
        const newRate = parseFloat(currentRate);
        if (isNaN(newRate) || newRate < 0) {
            toast({
                variant: "destructive",
                title: "Invalid Tax Rate",
                description: "Please enter a valid, non-negative number for the tax rate.",
            });
            return;
        }
        setTaxRate(newRate);
        toast({
            title: "Tax Rate Updated",
            description: `The site-wide tax rate has been set to ${newRate}%.`,
        });
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="tax-rate" className="text-base">
                    Set Global Tax Rate
                </Label>
                <p className="text-sm text-muted-foreground">
                   This rate will be applied to all orders at checkout.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Input 
                        id="tax-rate"
                        type="number"
                        value={currentRate}
                        onChange={(e) => setCurrentRate(e.target.value)}
                        className="w-24 pl-2 pr-7"
                    />
                    <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}
