
import { VendorTaskTable } from "@/components/vendor-task-table";

export default function VendorTasksPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Tasks & Bookings</h1>
      </div>
      <VendorTaskTable />
    </main>
  );
}
