import { Suspense } from 'react';
import { ProductGrid } from './product-grid';
import { ProductGridSkeleton } from './product-grid-skeleton';

export function ProductSection() {
    return (
        <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
        </Suspense>
    );
}
