
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
import { MoreHorizontal } from "lucide-react";
import { getAllUsers } from "@/lib/actions";
import type { PublicUser } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cva } from "class-variance-authority";
import { AdminEditUserDialog } from "./admin-edit-user-dialog";

export function AdminUserTable() {
  const [users, setUsers] = React.useState<PublicUser[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<PublicUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

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

  const roleBadgeVariants = cva(
    "capitalize",
    {
      variants: {
        role: {
          admin: "bg-red-100 text-red-800",
          vendor: "bg-blue-100 text-blue-800",
          customer: "bg-green-100 text-green-800",
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
                            <DropdownMenuItem>Block</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
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
