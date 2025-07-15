"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import type { Part } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye, EyeOff, MapPin } from "lucide-react";
import { useParts } from "@/context/part-context";

interface VendorProductCardProps {
  part: Part;
}

export function VendorProductCard({ part }: VendorProductCardProps) {
  const { togglePartVisibility } = useParts();

  const handleToggleVisibility = () => {
    togglePartVisibility(part.id);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl group">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image src={part.imageUrl} alt={part.name} fill className="object-cover rounded-t-lg" data-ai-hint="car part" />
          {!part.isVisibleForSale && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white font-bold text-lg">SALE PAUSED</p>
            </div>
          )}
        </div>
        <div className="p-6 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="pr-2 font-headline text-lg">{part.name}</CardTitle>
             <Badge variant={part.inStock ? "secondary" : "destructive"} className="shrink-0 mt-1">
              {part.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
          <CardDescription className="pt-2 text-sm">{part.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 p-6 pt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{part.vendorAddress}</span>
        </div>
        <div className="text-3xl font-bold text-primary font-headline">${part.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
            variant={part.isVisibleForSale ? "outline" : "secondary"} 
            className="w-full"
            onClick={handleToggleVisibility}
            disabled={!part.inStock}
        >
          {part.isVisibleForSale ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {part.isVisibleForSale ? "Hold Sales" : "Resume Sales"}
        </Button>
      </CardFooter>
    </Card>
  );
}
