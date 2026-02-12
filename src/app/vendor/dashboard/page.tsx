// Edited

"use client";

import { VendorDashboardStats } from "@/components/vendor-dashboard-stats";
import { VendorRevenueChart } from "@/components/vendor-revenue-chart";
import { VendorRecentSales } from "@/components/vendor-recent-sales";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddPartForm } from "@/components/add-part-form";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";

export default function VendorDashboard() {
  const { language } = useSettings();
  const t = getDictionary(language);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{t.vendor.dashboard}</h1>
            <div className="ml-auto flex items-center gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                {t.vendor.addNewPart}
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{t.vendor.addNewPart}</DialogTitle>
                            <DialogDescription>
                                {t.vendor.addNewPartDescription}
                            </DialogDescription>
                        </DialogHeader>
                        <AddPartForm />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        <VendorDashboardStats />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <VendorRevenueChart />
            <VendorRecentSales />
        </div>
      </main>
    </div>
  );
}
