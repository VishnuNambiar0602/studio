
"use client";

import { VendorHeader } from "@/components/vendor-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, CalendarDays, BarChart } from "lucide-react";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { useSettings } from "@/context/settings-context";

export default function VendorAccountPage() {
    const { loggedInUser } = useSettings();
    const registrationDate = new Date('2023-01-15'); // This should ideally come from user data
    const membershipDuration = formatDistanceToNow(registrationDate);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">My Account</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Vendor Profile</CardTitle>
                <CardDescription>Your information and statistics on GulfCarX.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold">{loggedInUser?.name || 'Your Company'}</div>
                    <Badge variant="secondary">Verified Vendor</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-background rounded-lg border">
                        <CalendarDays className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Member Since</p>
                            <p className="font-semibold">January 15, 2023 ({membershipDuration} ago)</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-background rounded-lg border">
                        <DollarSign className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <p className="font-semibold">$45,231.89</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-3 p-4 bg-background rounded-lg border">
                        <Package className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Active Listings</p>
                            <p className="font-semibold">132</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-3 p-4 bg-background rounded-lg border">
                        <BarChart className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Sales</p>
                            <p className="font-semibold">265</p>
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="text-md font-semibold mb-2">Company Bio</h3>
                    <p className="text-sm text-muted-foreground">
                        {loggedInUser?.name} has been a leading supplier of quality automotive components in the region since 2010. We specialize in both new and OEM parts for a wide range of Japanese and German vehicles. Our commitment is to quality and customer satisfaction.
                    </p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
