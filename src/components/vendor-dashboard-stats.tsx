
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getParts } from "@/lib/actions";
import { DollarSign, Package, Hourglass } from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react";

export function VendorDashboardStats() {
    const [inventoryCount, setInventoryCount] = useState(0);

    useEffect(() => {
        const fetchParts = async () => {
            const parts = await getParts();
            setInventoryCount(parts.length);
        }
        fetchParts();
    }, []);

    // Mocked total revenue for now
    const totalRevenue = 45231.89;

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items on Hold</CardTitle>
                    <Hourglass className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+12</div>
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
                        <div className="text-2xl font-bold">{inventoryCount}</div>
                        <p className="text-xs text-muted-foreground">Total parts available for sale</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}
