// Edited

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getParts, getVendorStats } from "@/lib/actions";
import { DollarSign, Package, Hourglass } from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParts } from "@/context/part-context";
import { useSettings } from "@/context/settings-context";

interface VendorStats {
    totalRevenue: number;
    itemsOnHold: number;
    activeListings: number;
}

export function VendorDashboardStats() {
    const { parts } = useParts();
    const { loggedInUser } = useSettings();
    const [stats, setStats] = useState<VendorStats>({
        totalRevenue: 0,
        itemsOnHold: 0,
        activeListings: 0,
    });
    
    useEffect(() => {
        async function fetchStats() {
            if (loggedInUser?.name) {
                const fetchedStats = await getVendorStats(loggedInUser.name);
                setStats({
                    totalRevenue: fetchedStats.totalRevenue,
                    itemsOnHold: fetchedStats.itemsOnHold,
                    activeListings: fetchedStats.activeListings
                });
            }
        }
        fetchStats();
    }, [loggedInUser, parts]); // Re-fetch when parts change (e.g., new part added)

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">From completed sales</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items on Hold</CardTitle>
                    <Hourglass className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.itemsOnHold}</div>
                    <p className="text-xs text-muted-foreground">Awaiting customer pickup/payment</p>
                </CardContent>
            </Card>
             <Link href="/vendor/inventory">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Count</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeListings}</div>
                        <p className="text-xs text-muted-foreground">Total parts available for sale</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}
