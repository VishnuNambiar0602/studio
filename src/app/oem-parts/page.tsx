import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { Suspense } from "react";

export default function OemPartsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid 
                category="oem"
                title="OEM Parts"
                description="Original Equipment Manufacturer parts for a perfect fit."
              />
            </Suspense>
      </main>
    </div>
  );
}
