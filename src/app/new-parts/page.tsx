import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { Suspense } from "react";

export default function NewPartsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid 
                category="new" 
                title="New Parts"
                description="Brand new parts, ready for your vehicle."
              />
            </Suspense>
      </main>
    </div>
  );
}
