
import { UserManagementTable } from "@/components/admin-user-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsers } from "@/lib/actions";

export default async function AdminUsersPage() {
    const users = await getUsers();
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>View and manage all user accounts on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserManagementTable users={users} />
                </CardContent>
            </Card>
        </div>
    )
}
