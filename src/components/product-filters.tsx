
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

export interface Filters {
  search: string;
  locations: string[];
  priceRange: [number, number];
  sort: 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc';
}

interface ProductFiltersProps {
  availableLocations: string[];
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onApply: () => void;
  onClear: () => void;
}

export function ProductFilters({ 
    availableLocations,
    filters, 
    onFilterChange, 
    onApply,
    onClear 
}: ProductFiltersProps) {
    const handleLocationToggle = (location: string) => {
        const newLocations = filters.locations.includes(location)
            ? filters.locations.filter(v => v !== location)
            : [...filters.locations, location];
        onFilterChange({ locations: newLocations });
    };

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Select */}
            <div className="space-y-2 md:col-span-2">
                <Label>Location(s)</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between font-normal"
                        >
                            <span className="truncate">
                                {filters.locations.length > 0 ? `${filters.locations.length} selected` : "Select locations..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search locations..." />
                            <CommandList>
                                <CommandEmpty>No location found.</CommandEmpty>
                                <CommandGroup>
                                    {availableLocations.map((location) => (
                                        <CommandItem
                                            key={location}
                                            value={location}
                                            onSelect={() => handleLocationToggle(location)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    filters.locations.includes(location) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {location}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                 <div className="flex flex-wrap gap-1 pt-1 min-h-[20px]">
                    {filters.locations.map(location => (
                        <Badge key={location} variant="secondary" className="pl-2">
                            {location}
                            <button onClick={() => handleLocationToggle(location)} className="ml-1 rounded-full p-0.5 hover:bg-background/50">
                                <X className="h-3 w-3"/>
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>
        </div>

        <Separator />
        
        {/* Price Range Slider */}
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="price-range">Price Range</Label>
                <span className="text-sm font-medium text-muted-foreground">
                    ${filters.priceRange[0]} - ${filters.priceRange[1] === 5000 ? 'Any' : `$${filters.priceRange[1]}`}
                </span>
            </div>
            <Slider
                id="price-range"
                min={0}
                max={5000}
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
        
        <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={onClear}>
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
