


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, ExternalLink, Settings, ShieldCheck, Building, Percent, ImageIcon, Sparkles, Share2 } from "lucide-react";
import { AdminTrafficChart } from "./_components/admin-traffic-chart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminVendorPerformance } from "./_components/admin-vendor-performance";
import { getAdminDashboardStats } from "@/lib/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ChartSkeleton() {
  return (
    <div className="h-[350px] flex items-end gap-2 p-4">
      <Skeleton className="h-[50%] w-12" />
      <Skeleton className="h-[75%] w-12" />
      <Skeleton className="h-[30%] w-12" />
      <Skeleton className="h-[90%] w-12" />
      <Skeleton className="h-[60%] w-12" />
      <Skeleton className="h-[40%] w-12" />
      <Skeleton className="h-[80%] w-12" />
    </div>
  )
}

export default async function AdminDashboard() {
  const stats = await getAdminDashboardStats();

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} OMR</div>
              <p className="text-xs text-muted-foreground">
                From all completed sales
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Total registered users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                Total registered vendors
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Parts Listed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.totalParts}</div>
              <p className="text-xs text-muted-foreground">
                Across all vendors
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <AdminVendorPerformance />
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>An overview of new user sign-ups for the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <AdminTrafficChart />
              </Suspense>
            </CardContent>
          </Card>
          <div className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Super Admin Settings</CardTitle>
                    <CardDescription>Manage global settings, governance, and platform controls.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/admin/settings">
                            Go to Governance Dashboard <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> User & Vendor Management</CardTitle>
                      <CardDescription>View, edit, or manage all users and vendors on the platform.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button asChild className="w-full">
                          <Link href="/admin/users">
                              Go to User Management <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                  </CardContent>
              </Card>
          </div>
        </div>
      </main>
    </>
  );
}
