import { parts } from "@/lib/data";
import { ProductCard } from "./product-card";

export async function ProductGrid() {
  // In a real app, this would be a database call.
  // We'll add a delay to simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 1500));
  const allParts = parts;

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Featured Parts</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              Hand-picked selection of our most popular and reliable parts for desert driving.
            </p>
        </div>
        
        {allParts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allParts.map((part) => (
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
