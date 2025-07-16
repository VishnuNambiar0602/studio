
"use client";

import { useState, useMemo } from "react";
import type { Part } from "@/lib/types";
import { ProductCard } from "./product-card";
import { ProductFilters, type Filters } from "./product-filters";
import { useParts } from "@/context/part-context";

interface ProductGridProps {
    title?: string;
    description?: string;
    category?: 'new' | 'used' | 'oem';
}

export function ProductGrid({ title, description, category }: ProductGridProps) {
  const { parts } = useParts();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    vendors: [],
    priceRange: [0, 2000],
    sort: 'price-asc',
  });

  const allParts = useMemo(() => {
    let baseParts = parts.filter(part => part.isVisibleForSale);
    if (category) {
      baseParts = baseParts.filter(part => part.category.includes(category));
    }
    return baseParts;
  }, [parts, category]);

  const filteredAndSortedParts = useMemo(() => {
    let processedParts = [...allParts];

    // 1. Filter by search query
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      processedParts = processedParts.filter(part =>
        part.name.toLowerCase().includes(searchTerm) ||
        part.description.toLowerCase().includes(searchTerm)
      );
    }

    // 2. Filter by vendors
    if (filters.vendors.length > 0) {
      processedParts = processedParts.filter(part =>
        filters.vendors.includes(part.vendorAddress)
      );
    }

    // 3. Filter by price range
    processedParts = processedParts.filter(part =>
      part.price >= filters.priceRange[0] && part.price <= filters.priceRange[1]
    );

    // 4. Sort
    switch (filters.sort) {
      case 'price-asc':
        processedParts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedParts.sort((a, b) => b.price - a.price);
        break;
    }

    return processedParts;
  }, [allParts, filters]);

  const availableVendors = useMemo(() => {
    const vendorSet = new Set(allParts.map(part => part.vendorAddress));
    return Array.from(vendorSet);
  }, [allParts]);

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title || 'Featured Inventory'}</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              {description || 'A curated selection of high-quality parts, available for local pickup or fast delivery.'}
            </p>
        </div>
        
        <ProductFilters 
            availableVendors={availableVendors}
            filters={filters}
            onFilterChange={setFilters}
        />
        
        {filteredAndSortedParts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {filteredAndSortedParts.map((part) => (
              <ProductCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No Matching Parts Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
