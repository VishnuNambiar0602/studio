
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Filters {
  search: string;
  vendors: string[];
  priceRange: [number, number];
  sort: 'price-asc' | 'price-desc';
}

interface ProductFiltersProps {
  availableVendors: string[];
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onApply: () => void;
}

export function ProductFilters({ availableVendors, filters, onFilterChange, onApply }: ProductFiltersProps) {
    const handleVendorToggle = (vendor: string) => {
        const newVendors = filters.vendors.includes(vendor)
            ? filters.vendors.filter(v => v !== vendor)
            : [...filters.vendors, vendor];
        onFilterChange({ vendors: newVendors });
    };

    const clearFilters = () => {
        onFilterChange({
            search: '',
            vendors: [],
            priceRange: [0, 2000],
            sort: 'price-asc',
        });
    };

  return (
    <div className="space-y-6">
        {/* Search Input */}
        <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
                id="search"
                placeholder="Search by name or description..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
            />
        </div>

        {/* Vendor Select */}
        <div className="space-y-2">
            <Label>Vendor</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                    >
                        <span className="truncate">
                            {filters.vendors.length > 0 ? `${filters.vendors.length} selected` : "Select vendors..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search vendors..." />
                        <CommandEmpty>No vendor found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                            {availableVendors.map((vendor) => (
                                <CommandItem
                                    key={vendor}
                                    value={vendor}
                                    onSelect={() => handleVendorToggle(vendor)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            filters.vendors.includes(vendor) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {vendor}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-1 pt-1">
                {filters.vendors.map(vendor => (
                    <Badge key={vendor} variant="secondary" className="pl-2">
                        {vendor}
                        <button onClick={() => handleVendorToggle(vendor)} className="ml-1 rounded-full p-0.5 hover:bg-background/50">
                            <X className="h-3 w-3"/>
                        </button>
                    </Badge>
                ))}
            </div>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="price-range">Price Range</Label>
                <span className="text-sm font-medium text-muted-foreground">
                    ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
            </div>
            <Slider
                id="price-range"
                min={0}
                max={2000}
                step={50}
                value={filters.priceRange}
                onValueChange={(value) => onFilterChange({ priceRange: value as [number, number] })}
            />
        </div>

        {/* Sort Select */}
        <div className="space-y-2">
            <Label htmlFor="sort">Sort by</Label>
            <Select
                value={filters.sort}
                onValueChange={(value) => onFilterChange({ sort: value as Filters['sort'] })}
            >
                <SelectTrigger id="sort">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
        <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4"/>
                Clear All
            </Button>
             <Button onClick={onApply}>
                Apply Filters
            </Button>
        </div>
    </div>
  );
}
