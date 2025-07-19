// Edited

"use client";

import { useState, useMemo } from "react";
import type { Part } from "@/lib/types";
import { ProductCard } from "./product-card";
import { ProductFilters, type Filters } from "./product-filters";
import { Button } from "./ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useParts } from "@/context/part-context";

interface ProductGridProps {
    title?: string;
    description?: string;
    category?: 'new' | 'used' | 'oem';
}

export function ProductGrid({ title, description, category }: ProductGridProps) {
  const { parts } = useParts(); // Use the context to get parts
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Filters>({
    search: '',
    vendors: [],
    priceRange: [0, 2000],
    sort: 'price-asc',
  });
  const [activeFilters, setActiveFilters] = useState<Filters>(tempFilters);
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempFilters(prev => ({ ...prev, search: event.target.value }));
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setActiveFilters(tempFilters);
  };
  
  const handleTempFilterChange = (newFilters: Partial<Filters>) => {
    setTempFilters(prev => ({...prev, ...newFilters}));
  };

  const applyFilters = () => {
    setActiveFilters(tempFilters);
    setIsFilterDialogOpen(false);
  };

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
    if (activeFilters.search) {
      const searchTerm = activeFilters.search.toLowerCase();
      processedParts = processedParts.filter(part =>
        part.name.toLowerCase().includes(searchTerm) ||
        part.description.toLowerCase().includes(searchTerm)
      );
    }

    // 2. Filter by vendors
    if (activeFilters.vendors.length > 0) {
      processedParts = processedParts.filter(part =>
        activeFilters.vendors.includes(part.vendorAddress)
      );
    }

    // 3. Filter by price range
    processedParts = processedParts.filter(part =>
      part.price >= activeFilters.priceRange[0] && part.price <= activeFilters.priceRange[1]
    );

    // 4. Sort
    switch (activeFilters.sort) {
      case 'price-asc':
        processedParts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedParts.sort((a, b) => b.price - a.price);
        break;
    }

    return processedParts;
  }, [allParts, activeFilters]);

  const availableVendors = useMemo(() => {
    const vendorSet = new Set(allParts.map(part => part.vendorAddress));
    return Array.from(vendorSet);
  }, [allParts]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex-grow flex gap-2">
              <Input 
                  placeholder="Search by part name or keyword..."
                  value={tempFilters.search}
                  onChange={handleSearchChange}
                  className="flex-grow"
              />
               <Button type="submit" variant="secondary">
                  <Search className="mr-2 h-4 w-4" /> Search
              </Button>
          </form>
           <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                      <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Filter & Sort</DialogTitle>
                  </DialogHeader>
                  <ProductFilters 
                      availableVendors={availableVendors}
                      filters={tempFilters}
                      onFilterChange={handleTempFilterChange}
                      onApply={applyFilters}
                  />
              </DialogContent>
          </Dialog>
      </div>
      
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
    </>
  );
}
