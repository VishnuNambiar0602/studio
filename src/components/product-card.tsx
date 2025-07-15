
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import type { Part } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, ShoppingCart, CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { BookViewingDialog } from "./book-viewing-dialog";
import Link from "next/link";
import { getVendorMapUrl } from "@/lib/actions";

interface ProductCardProps {
  part: Part;
}

export function ProductCard({ part }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  const handleAddToCart = () => {
    addToCart(part);
    toast({
      title: "Added to Cart",
      description: `${part.name} has been added to your cart.`,
    });
  }

  useState(() => {
    const fetchMapUrl = async () => {
      const url = await getVendorMapUrl(part.vendorAddress);
      setMapUrl(url);
    };
    fetchMapUrl();
  });


  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image src={part.imageUrl} alt={part.name} fill className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105" data-ai-hint="car part" />
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
            {mapUrl ? (
                <Link href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary transition-colors">
                    <MapPin className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate hover:underline">{part.vendorAddress}</span>
                </Link>
            ) : (
                <>
                    <MapPin className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{part.vendorAddress}</span>
                </>
            )}
        </div>
         <div className="text-3xl font-bold text-primary font-headline">${part.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-6 pt-0">
        <BookViewingDialog part={part}>
            <Button variant="secondary" className="w-full" disabled={!part.inStock}>
              <CalendarPlus className="mr-2 h-4 w-4" /> Book a Viewing
            </Button>
        </BookViewingDialog>
        <Button onClick={handleAddToCart} disabled={!part.inStock}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
