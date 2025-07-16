
import { AdminUserTable } from "@/components/admin-user-table";
import { Suspense } from "react";

export default function AdminUsersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
      </div>
      <Suspense fallback={<div>Loading users...</div>}>
        <AdminUserTable />
      </Suspense>
    </main>
  );
}
