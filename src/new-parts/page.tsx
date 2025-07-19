// Edited
import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { Suspense } from "react";

export default function NewPartsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">New Parts</h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
                    Brand new parts, ready for your vehicle.
                </p>
            </div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
