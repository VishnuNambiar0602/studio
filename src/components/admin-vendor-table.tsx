
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { getAllUsers, toggleUserBlockStatus, deleteUser } from "@/lib/actions";
import type { PublicUser } from "@/lib/types";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function AdminVendorTable() {
  const [vendors, setVendors] = React.useState<PublicUser[]>([]);
  const { toast } = useToast();


  const fetchVendors = React.useCallback(async () => {
    const allUsers = await getAllUsers();
    const vendorUsers = allUsers.filter(user => user.role === 'vendor');
    setVendors(vendorUsers);
  }, []);

  React.useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleToggleBlock = async (userId: string) => {
      const result = await toggleUserBlockStatus(userId);
      toast({
          title: result.success ? "Success" : "Error",
          description: result.message,
          variant: result.success ? "default" : "destructive",
      });
      if (result.success) {
          fetchVendors();
      }
  };

  const handleDelete = async (userId: string) => {
      const result = await deleteUser(userId);
      toast({
          title: result.success ? "Success" : "Error",
          description: result.message,
          variant: result.success ? "default" : "destructive",
      });
      if (result.success) {
          fetchVendors();
      }
  };


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
            A list of all vendors on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 border">
                                <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold break-words">{vendor.name}</span>
                                <span className="text-muted-foreground text-xs break-words">{vendor.shopAddress}</span>
                            </div>
                        </div>
                      </TableCell>
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
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/vendors/${vendor.id}`}>View Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleToggleBlock(vendor.id)}>
                                {vendor.isBlocked ? 'Unblock' : 'Block'}
                            </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This may fail if the vendor has existing parts or orders. It is often safer to block a vendor.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(vendor.id)} className="bg-destructive hover:bg-destructive/90">
                                            Yes, delete vendor
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
