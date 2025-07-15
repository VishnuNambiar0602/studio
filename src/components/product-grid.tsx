import { ProductCard } from "./product-card";
import { getParts } from "@/lib/data";

export async function ProductGrid() {
  const parts = await getParts();
  
  // Only show parts that are visible for sale
  const visibleParts = parts.filter(part => part.isVisibleForSale);

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Featured Inventory</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              A curated selection of high-quality parts, available for local pickup or fast delivery.
            </p>
        </div>
        
        {visibleParts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleParts.map((part) => (
              <ProductCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No parts available at the moment.</p>
        )}
      </div>
    </section>
  );
}
