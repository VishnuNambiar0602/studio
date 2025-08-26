"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ExternalLink, ShieldCheck, ShieldX } from "lucide-react";
import { getAllUsers } from "@/lib/actions";
import type { PublicUser } from "@/lib/types";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function AdminVendorTable() {
  const [vendors, setVendors] = React.useState<PublicUser[]>([]);

  const fetchVendors = React.useCallback(async () => {
    const allUsers = await getAllUsers();
    const vendorUsers = allUsers.filter(user => user.role === 'vendor');
    setVendors(vendorUsers);
  }, []);

  React.useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);


  const statusBadgeVariants = cva(
    "capitalize",
    {
      variants: {
        status: {
          active: "border-green-300 text-green-800 dark:text-green-300",
          blocked: "border-red-300 text-red-800 dark:text-red-300",
        },
      },
    }
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
          <CardDescription>
            A list of all vendors on the platform. On small screens, the table is scrollable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 border">
                                <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{vendor.name}</span>
                        </div>
                      </TableCell>
                       <TableCell className="whitespace-nowrap">
                        <div>{vendor.email}</div>
                        <div className="text-muted-foreground text-xs">{vendor.phone}</div>
                       </TableCell>
                      <TableCell className="whitespace-nowrap">{vendor.shopAddress}</TableCell>
                       <TableCell>
                        <Badge variant="outline" className={statusBadgeVariants({ status: vendor.isBlocked ? 'blocked' : 'active' })}>
                           {vendor.isBlocked ? (
                                <ShieldX className="mr-2 h-3.5 w-3.5" />
                            ) : (
                                <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                            )}
                          {vendor.isBlocked ? 'Blocked' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/vendors/${vendor.id}`}>
                                View Profile <ExternalLink className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No vendors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
