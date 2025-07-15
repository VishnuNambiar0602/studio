import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";

export default function OemPartsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">OEM Parts</h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
                    Original Equipment Manufacturer parts for a perfect fit.
                </p>
            </div>
            <ProductGrid />
          </div>
        </section>
      </main>
    </div>
  );
}
