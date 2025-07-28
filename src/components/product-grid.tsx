
"use client";

import { useState, useMemo, useCallback } from "react";
import type { Part } from "@/lib/types";
import { ProductCard } from "./product-card";
import { ProductFilters, type Filters } from "./product-filters";
import { Button } from "./ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { useParts } from "@/context/part-context";
import { Card } from "./ui/card";

interface ProductGridProps {
    category?: 'new' | 'used' | 'oem';
}

export function ProductGrid({ category }: ProductGridProps) {
  const { parts } = useParts(); // Use the context to get parts
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const initialFilters: Filters = {
    search: '',
    locations: [],
    make: '',
    model: '',
    year: '',
    priceRange: [0, 5000],
    sort: 'price-asc',
  };

  const [tempFilters, setTempFilters] = useState<Filters>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<Filters>(initialFilters);
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This updates the search term live for the main input
    setActiveFilters(prev => ({ ...prev, search: event.target.value }));
  };
  
  const handleTempFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setTempFilters(prev => ({...prev, ...newFilters}));
  }, []);

  const applyFilters = useCallback(() => {
    setActiveFilters(tempFilters);
    setIsFilterSheetOpen(false);
  }, [tempFilters]);

  const clearFilters = useCallback(() => {
    setTempFilters(initialFilters);
    setActiveFilters(initialFilters);
    setIsFilterSheetOpen(false);
  }, [initialFilters]);

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
        part.description.toLowerCase().includes(searchTerm) ||
        part.manufacturer?.toLowerCase().includes(searchTerm)
      );
    }

    // 2. Filter by locations
    if (activeFilters.locations.length > 0) {
      processedParts = processedParts.filter(part =>
        activeFilters.locations.includes(part.vendorAddress)
      );
    }
    
    // 3. Filter by make
    if (activeFilters.make) {
        processedParts = processedParts.filter(part => part.make === activeFilters.make);
    }

    // 4. Filter by model
    if (activeFilters.model) {
        processedParts = processedParts.filter(part => part.model === activeFilters.model);
    }
    
    // 5. Filter by year
    if (activeFilters.year) {
        processedParts = processedParts.filter(part => part.vehicleYear?.toString() === activeFilters.year);
    }

    // 6. Filter by price range
    processedParts = processedParts.filter(part =>
      part.price >= activeFilters.priceRange[0] && part.price <= (activeFilters.priceRange[1] < 5000 ? activeFilters.priceRange[1] : Infinity)
    );

    // 7. Sort
    switch (activeFilters.sort) {
      case 'price-asc':
        processedParts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedParts.sort((a, b) => b.price - a.price);
        break;
      case 'year-asc':
        processedParts.sort((a, b) => (a.vehicleYear || 0) - (b.vehicleYear || 0));
        break;
      case 'year-desc':
        processedParts.sort((a, b) => (b.vehicleYear || 0) - (a.vehicleYear || 0));
        break;
    }

    return processedParts;
  }, [allParts, activeFilters]);

  const availableFilterOptions = useMemo(() => {
        let relevantParts = allParts;
        if (tempFilters.make) {
            relevantParts = relevantParts.filter(p => p.make === tempFilters.make);
        }
        if (tempFilters.model) {
            relevantParts = relevantParts.filter(p => p.model === tempFilters.model);
        }

        const locations = new Set(allParts.map(part => part.vendorAddress));
        const makes = new Set(allParts.map(part => part.make).filter(Boolean));
        const models = new Set(relevantParts.map(part => part.model).filter(Boolean));
        const years = new Set(relevantParts.map(part => part.vehicleYear?.toString()).filter(Boolean));
        
        return {
            locations: Array.from(locations).sort(),
            makes: Array.from(makes).sort(),
            models: Array.from(models).sort(),
            years: Array.from(years).sort((a,b) => parseInt(b) - parseInt(a)), // Sort years descending
        }
  }, [allParts, tempFilters.make, tempFilters.model]);

  return (
    <>
      <Card className="p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow flex gap-2">
                <Input 
                    placeholder="Search by part name, description or manufacturer..."
                    value={activeFilters.search}
                    onChange={handleSearchChange}
                    className="flex-grow text-base h-12"
                />
            </div>
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto h-12">
                      <SlidersHorizontal className="mr-2 h-4 w-4" /> Advanced
                  </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                      <SheetTitle>Advanced Search & Filter</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <ProductFilters 
                        availableLocations={availableFilterOptions.locations}
                        availableMakes={availableFilterOptions.makes}
                        availableModels={availableFilterOptions.models}
                        availableYears={availableFilterOptions.years}
                        filters={tempFilters}
                        onFilterChange={handleTempFilterChange}
                        onApply={applyFilters}
                        onClear={clearFilters}
                    />
                  </div>
              </SheetContent>
            </Sheet>
        </div>
      </Card>
      
      {filteredAndSortedParts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
