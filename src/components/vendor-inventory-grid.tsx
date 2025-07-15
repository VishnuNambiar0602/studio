"use client";

import { useParts } from "@/context/part-context";
import { VendorProductCard } from "./vendor-product-card";

export function VendorInventoryGrid() {
  const { parts } = useParts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {parts.length > 0 ? (
        // We show all parts here, regardless of visibility, so vendors can manage them.
        parts.map((part) => (
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
