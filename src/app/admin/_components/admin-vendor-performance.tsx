// Edited

"use client";

import { useEffect, useState } from "react";
import { getVendorPerformanceSummary } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface VendorPerformance {
    id: string;
    name: string;
    monthlySales: number;
    recentItems: {
        partName: string;
        cost: number;
    }[];
}

function PerformanceCardSkeleton() {
    return (
         <Card className="flex flex-col h-full">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                   <Skeleton className="h-4 w-1/2 mb-2" />
                   <Skeleton className="h-8 w-1/4" />
                </div>
                <div>
                    <Skeleton className="h-4 w-1/3 mb-3" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function AdminVendorPerformance() {
    const [performanceData, setPerformanceData] = useState<VendorPerformance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getVendorPerformanceSummary();
            setPerformanceData(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <PerformanceCardSkeleton />
               <PerformanceCardSkeleton />
               <PerformanceCardSkeleton />
            </div>
        )
    }

    if (performanceData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Vendor Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No vendor data available.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vendor Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel
                    opts={{
                        align: "start",
                        loop: performanceData.length > 3,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {performanceData.map((vendor) => (
                            <CarouselItem key={vendor.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card className="flex flex-col h-full">
                                        <CardHeader>
                                            <CardTitle>
                                                <Link href={`/admin/vendors/${vendor.id}`} className="hover:underline text-primary">
                                                    {vendor.name}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow space-y-6">
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                    <TrendingUp className="h-4 w-4"/>
                                                    <span>Sales (Last 30 Days)</span>
                                                </div>
                                                <p className="text-2xl font-bold">${vendor.monthlySales.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <Package className="h-4 w-4"/>
                                                    <span>Recent Top Sellers</span>
                                                </div>
                                                {vendor.recentItems.length > 0 ? (
                                                    <ul className="space-y-1 text-sm">
                                                        {vendor.recentItems.map((item, index) => (
                                                            <li key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                                                                <span className="flex-grow truncate pr-2">{item.partName}</span>
                                                                <Badge variant="secondary">${item.cost.toFixed(2)}</Badge>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">No recent sales.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </CardContent>
        </Card>
    );
}
