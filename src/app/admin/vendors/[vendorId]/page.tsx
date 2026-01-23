

import { getVendorDetailsForAdmin } from "@/lib/actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Package, BarChart, DollarSign, CalendarDays, Car, Percent, ShieldCheck, ShieldX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { VendorPartsTable } from "./_components/vendor-parts-table";

export default async function VendorProfilePage({ params }: { params: { vendorId: string } }) {
  const vendorDetails = await getVendorDetailsForAdmin(params.vendorId);

  if (!vendorDetails) {
    notFound();
  }

  const { user, parts, stats } = vendorDetails;
  const membershipDuration = formatDistanceToNow(user.createdAt || new Date());

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        {/* Vendor Details Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
              <AvatarFallback className="text-3xl">
                <Car className="h-12 w-12"/>
              </AvatarFallback>
            </Avatar>
            <CardTitle>{user.name}</CardTitle>
            <div className="pt-2 flex items-center justify-center gap-2">
                <Badge variant={user.isBlocked ? "destructive" : "secondary"}>
                   {user.isBlocked ? <ShieldX className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                   {user.isBlocked ? 'Blocked' : 'Verified Vendor'}
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm pt-4">
             <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <span className="break-all">{user.email}</span>
            </div>
             <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{user.shopAddress}, {user.zipCode}</span>
            </div>
             <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>Member for {membershipDuration}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 content-start">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} OMR</div>
                    <p className="text-xs text-muted-foreground">From all completed sales</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSales}</div>
                     <p className="text-xs text-muted-foreground">Total number of items sold</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeListings}</div>
                     <p className="text-xs text-muted-foreground">Parts currently available for sale</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Custom Surcharge</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{user.surcharge || 0}%</div>
                     <p className="text-xs text-muted-foreground">Custom transaction fee for this vendor</p>
                </CardContent>
            </Card>
        </div>
      </div>
      
      {/* Parts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listed Parts</CardTitle>
          <CardDescription>A list of all parts managed by {user.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <VendorPartsTable parts={parts} />
        </CardContent>
      </Card>

    </main>
  );
}
