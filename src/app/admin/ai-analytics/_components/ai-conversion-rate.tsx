"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAiInteractionStats } from "@/lib/actions";
import { TrendingUp, Percent, CheckCircle } from "lucide-react";

export function AiConversionRate() {
    const [stats, setStats] = useState({ suggestions: 0, clicks: 0, orders: 0 });

    useEffect(() => {
        async function fetchStats() {
            const data = await getAiInteractionStats();
            setStats(data);
        }
        fetchStats();
    }, []);

    const clickThroughRate = stats.suggestions > 0 ? (stats.clicks / stats.suggestions) * 100 : 0;
    const conversionRate = stats.clicks > 0 ? (stats.orders / stats.clicks) * 100 : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Suggestion Performance</CardTitle>
                <CardDescription>Metrics on how users interact with the Genie's suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-shrink-0">
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Total Suggestions Made</p>
                        <p className="text-2xl font-bold">{stats.suggestions}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                     <div className="flex-shrink-0">
                        <Percent className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Suggestion Click-Through Rate (CTR)</p>
                        <p className="text-2xl font-bold">{clickThroughRate.toFixed(1)}%</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-4 rounded-md border p-4">
                     <div className="flex-shrink-0">
                        <CheckCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Suggestion-to-Order Conversion Rate</p>
                        <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
