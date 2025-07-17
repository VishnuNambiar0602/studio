
import type { Part } from '@/lib/types';
import { ProductGrid } from './product-grid';

export function ProductSection() {
    return (
        <section className="py-16 lg:py-24">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Inventory</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                        A curated selection of high-quality parts, available for local pickup or fast delivery.
                    </p>
                </div>
                <ProductGrid />
            </div>
        </section>
    );
}
