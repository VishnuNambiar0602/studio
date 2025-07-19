
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
import { MoreHorizontal, ShieldCheck, ShieldX } from "lucide-react";
import { getAllUsers, toggleUserBlockStatus, deleteUser } from "@/lib/actions";
import type { PublicUser } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { cva } from "class-variance-authority";
import { AdminEditUserDialog } from "./admin-edit-user-dialog";
import { useToast } from "@/hooks/use-toast";

export function AdminUserTable() {
  const [users, setUsers] = React.useState<PublicUser[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<PublicUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const fetchUsers = React.useCallback(async () => {
    const data = await getAllUsers();
    setUsers(data);
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: PublicUser) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };
  
  const handleUserUpdated = () => {
    setIsEditDialogOpen(false);
    fetchUsers(); // Re-fetch users to show updated data
  }

  const handleToggleBlock = async (userId: string) => {
      const result = await toggleUserBlockStatus(userId);
      toast({
          title: result.success ? "Success" : "Error",
          description: result.message,
          variant: result.success ? "default" : "destructive",
      });
      if (result.success) {
          fetchUsers();
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
          fetchUsers();
      }
  };


  const roleBadgeVariants = cva(
    "capitalize",
    {
      variants: {
        role: {
          admin: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
          vendor: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
          customer: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        },
      },
    }
  );
  
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
          <CardTitle>Users</CardTitle>
          <CardDescription>
            A list of all users in the system. On small screens, the table is scrollable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={roleBadgeVariants({ role: user.role })}>
                          {user.role}
                        </Badge>
                      </TableCell>
                       <TableCell>
                        <Badge variant="outline" className={statusBadgeVariants({ status: user.isBlocked ? 'blocked' : 'active' })}>
                           {user.isBlocked ? (
                                <ShieldX className="mr-2 h-3.5 w-3.5" />
                            ) : (
                                <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                            )}
                          {user.isBlocked ? 'Blocked' : 'Active'}
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
                            <DropdownMenuItem onSelect={() => handleEdit(user)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleToggleBlock(user.id)}>
                                {user.isBlocked ? 'Unblock' : 'Block'}
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
                                            This action cannot be undone. This will permanently delete the user's account and all their data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive hover:bg-destructive/90">
                                            Yes, delete user
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
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <AdminEditUserDialog
            user={selectedUser}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onUserUpdated={handleUserUpdated}
        />
      )}
    </>
  );
}
