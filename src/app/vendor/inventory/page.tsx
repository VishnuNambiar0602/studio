
import { VendorInventoryGrid } from "@/components/vendor-inventory-grid";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddPartForm } from "@/components/add-part-form";

export default function VendorInventoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">My Inventory</h1>
            <div className="ml-auto flex items-center gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add New Part
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Part</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to add a new part to your inventory.
                            </DialogDescription>
                        </DialogHeader>
                        <AddPartForm />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        <VendorInventoryGrid />
      </main>
    </div>
  );
}
