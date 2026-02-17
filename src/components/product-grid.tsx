
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Part } from "@/lib/types";
import { ProductCard } from "./product-card";
import { ProductFilters, type Filters } from "./product-filters";
import { Button } from "./ui/button";
import { Search, SlidersHorizontal, Package, History } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Card } from "./ui/card";
import { useParts } from "@/context/part-context";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { getPopularParts } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";

const MAX_RECENT_SEARCHES = 5;

interface ProductGridProps {
    category?: 'new' | 'used' | 'oem';
}

export function ProductGrid({ category }: ProductGridProps) {
  const { parts } = useParts();
  const { language } = useSettings();
  const t = getDictionary(language);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [popularParts, setPopularParts] = useState<Part[]>([]);
  const router = useRouter();

  const initialFilters: Filters = {
    search: '',
    locations: [],
    priceRange: [0, 5000],
    sort: 'price-asc',
  };

  const [tempFilters, setTempFilters] = useState<Filters>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<Filters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  useEffect(() => {
    async function fetchPopular() {
      const popular = await getPopularParts();
      setPopularParts(popular);
    }
    fetchPopular();
    const storedSearches = localStorage.getItem("gulfcarx_recent_searches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const addSearchToHistory = (query: string) => {
    if (!query) return;
    const lowerCaseQuery = query.toLowerCase();
    const updatedSearches = [lowerCaseQuery, ...recentSearches.filter(s => s.toLowerCase() !== lowerCaseQuery)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updatedSearches);
    localStorage.setItem("gulfcarx_recent_searches", JSON.stringify(updatedSearches));
  };


  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value) {
      setActiveFilters(prev => ({ ...prev, search: '' }));
    }
  };

  const handleSearchSubmit = () => {
    addSearchToHistory(searchQuery);
    setActiveFilters(prev => ({ ...prev, search: searchQuery }));
    setIsSearchPopoverOpen(false);
  };

  const handleSuggestionSelect = (partId: string) => {
    setIsSearchPopoverOpen(false);
    router.push(`/part/${partId}`);
  };
  
  const handleTempFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setTempFilters(prev => ({...prev, ...newFilters}));
  }, []);

  const applyFilters = useCallback(() => {
    addSearchToHistory(tempFilters.search);
    setActiveFilters(tempFilters);
    setIsFilterSheetOpen(false);
  }, [tempFilters, addSearchToHistory]);

  const clearFilters = useCallback(() => {
    setTempFilters(initialFilters);
    setActiveFilters(initialFilters);
    setSearchQuery("");
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
    let processedParts: Part[] = [...allParts];
    const searchTerm = activeFilters.search.toLowerCase();

    if (searchTerm) {
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
    
    // 3. Filter by price range
    processedParts = processedParts.filter(part =>
      part.price >= activeFilters.priceRange[0] && part.price <= (activeFilters.priceRange[1] < 5000 ? activeFilters.priceRange[1] : Infinity)
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

  const searchSuggestions = useMemo(() => {
     if (!searchQuery) return popularParts.slice(0,5);
     const lowercasedQuery = searchQuery.toLowerCase();
     return allParts.filter(part => part.name.toLowerCase().includes(lowercasedQuery)).slice(0, 10);
  }, [searchQuery, allParts, popularParts]);

  const availableFilterOptions = useMemo(() => {
        const locations = new Set(allParts.map(part => part.vendorAddress));
        
        return {
            locations: Array.from(locations).sort(),
        }
  }, [allParts]);

  return (
    <>
      <Card className="p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
               <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder={t.home.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setIsSearchPopoverOpen(true)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleSearchSubmit() }}
                        className="pl-10 text-base h-12"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder={t.home.searchPlaceholder}
                        value={searchQuery}
                        onValueChange={handleSearchChange}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleSearchSubmit() }}
                      />
                      <CommandList>
                        <CommandEmpty>{t.home.noResultsFound}</CommandEmpty>
                          {searchQuery.length === 0 && recentSearches.length > 0 && (
                              <CommandGroup heading={t.home.recentSearches}>
                                  {recentSearches.map((searchTerm) => (
                                  <CommandItem
                                      key={searchTerm}
                                      value={searchTerm}
                                      onSelect={() => {
                                          setSearchQuery(searchTerm);
                                          handleSearchSubmit();
                                      }}
                                      className="flex items-center gap-3 cursor-pointer"
                                  >
                                      <History className="h-4 w-4 text-muted-foreground" />
                                      <span>{searchTerm}</span>
                                  </CommandItem>
                                  ))}
                              </CommandGroup>
                          )}
                        <CommandSeparator />
                        <CommandGroup heading={searchQuery ? t.home.suggestions : t.home.recommendedProducts}>
                          {searchSuggestions.map((part) => (
                            <CommandItem
                              key={part.id}
                              value={part.name}
                              onSelect={() => handleSuggestionSelect(part.id)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>{part.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
            </div>
            <Button onClick={handleSearchSubmit} className="w-full sm:w-auto h-12">
                <Search className="mr-2 h-4 w-4" /> {t.home.search}
            </Button>
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto h-12">
                      <SlidersHorizontal className="mr-2 h-4 w-4" /> {t.home.advanced}
                  </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                      <SheetTitle>{t.home.advancedSearchFilter}</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <ProductFilters 
                        availableLocations={availableFilterOptions.locations}
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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {filteredAndSortedParts.map((part) => (
            <ProductCard key={part.id} part={part} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">{t.home.noMatchingParts}</h3>
          <p className="text-muted-foreground mt-2">{t.home.tryAdjusting}</p>
        </div>
      )}
    </>
  );
}
