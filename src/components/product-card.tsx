"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import type { Part } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, ShoppingCart, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { holdPart } from "@/lib/actions";
import { useState } from "react";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  part: Part;
}

export function ProductCard({ part }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [isHolding, setIsHolding] = useState(false);

  const handleHold = async () => {
    setIsHolding(true);
    const result = await holdPart(part.id);
    if (result.success) {
      toast({
        title: "Part on Hold!",
        description: result.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
    setIsHolding(false);
  };
  
  const handleAddToCart = () => {
    addToCart(part);
    toast({
      title: "Added to Cart",
      description: `${part.name} has been added to your cart.`,
    });
  }

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
          <MapPin className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{part.vendorAddress}</span>
        </div>
         <div className="text-3xl font-bold text-primary font-headline">${part.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-6 pt-0">
        <Button variant="secondary" disabled={!part.inStock}>
          <Wrench className="mr-2 h-4 w-4" /> Rent
        </Button>
        <Button onClick={handleAddToCart} disabled={!part.inStock}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        <form action={handleHold} className="col-span-2">
            <Button variant="outline" className="w-full" disabled={!part.inStock || isHolding}>
                {isHolding ? 'Holding...' : 'Hold (12hr)'}
            </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
