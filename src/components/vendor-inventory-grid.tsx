// Edited

"use client";

import { useMemo } from "react";
import { VendorProductCard } from "./vendor-product-card";
import { useSettings } from "@/context/settings-context";
import { useParts } from "@/context/part-context";

export function VendorInventoryGrid() {
  const { parts } = useParts();
  const { loggedInUser } = useSettings(); 

  const vendorParts = useMemo(() => {
    if (!loggedInUser || loggedInUser.role !== 'vendor') {
      return [];
    }
    // Filter parts to only show those belonging to the logged-in vendor
    return parts.filter(part => part.vendorAddress === loggedInUser.name);
  }, [parts, loggedInUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {vendorParts.length > 0 ? (
        // We show all parts here, regardless of visibility, so vendors can manage them.
        vendorParts.map((part) => (
          <VendorProductCard key={part.id} part={part} />
        ))
      ) : (
        <p className="text-center text-muted-foreground md:col-span-4">
          You haven't added any parts to your inventory yet.
        </p>
      )}
    </div>
  );
}
