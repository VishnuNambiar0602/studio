import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { Suspense } from "react";

export default function UsedPartsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid 
                category="used"
                title="Used Parts"
                description="High-quality, inspected used parts at great prices."
              />
            </Suspense>
      </main>
    </div>
  );
}
