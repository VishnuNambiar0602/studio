import { AdminVendorTable } from "@/components/admin-vendor-table";
import { Suspense } from "react";

export default function AdminVendorsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Vendor Management</h1>
      </div>
      <Suspense fallback={<div>Loading vendors...</div>}>
        <AdminVendorTable />
      </Suspense>
    </main>
  );
}
