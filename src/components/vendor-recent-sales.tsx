
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { getVendorBookings } from "@/lib/actions";
import { useEffect, useState } from "react";
import type { Booking } from "@/lib/types";
import { useSettings } from "@/context/settings-context";

export function VendorRecentSales() {
  const [recentSales, setRecentSales] = useState<Booking[]>([]);
  const { loggedInUser } = useSettings();

  useEffect(() => {
    async function fetchSales() {
      if (loggedInUser?.name) {
        const allBookings = await getVendorBookings(loggedInUser.name);
        const completedSales = allBookings
          .filter(b => b.status === 'Completed')
          .slice(0, 5); // Get the 5 most recent
        setRecentSales(completedSales);
      }
    }
    fetchSales();
  }, [loggedInUser]);

  const totalSalesThisMonth = recentSales.length; // This is just the count of recent sales, not a monthly total

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          {totalSalesThisMonth > 0
            ? `You have ${totalSalesThisMonth} recent completed sales.`
            : "No recent sales."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentSales.length > 0 ? (
          recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                {/* Fallback with initials */}
                <AvatarFallback>
                  {sale.userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{sale.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {sale.partName}
                </p>
              </div>
              <div className="ml-auto font-medium">+${sale.cost.toFixed(2)}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center">Your recent sales will appear here.</p>
        )}
      </CardContent>
    </Card>
  );
}
