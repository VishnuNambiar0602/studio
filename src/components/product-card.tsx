
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import type { Part } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, ShoppingCart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-context";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";

interface ProductCardProps {
  part: Part;
}

function ProductCardSkeleton() {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-6 pt-2">
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-8 w-1/3" />
            </CardContent>
            <CardFooter className="p-6 pt-0 mt-auto">
                 <Skeleton className="h-6 w-1/4" />
            </CardFooter>
        </Card>
    );
}

export function ProductCard({ part }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { language } = useSettings();
  const t = getDictionary(language);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if it's somehow still wrapped
    addToCart(part, 1);
    toast({
      title: t.productCard.addedToCart,
      description: `${part.name} ${t.productCard.addedToCartDescription}`,
    });
  }

  if (!part) {
    return <ProductCardSkeleton />;
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl group">
        <Link href={`/part/${part.id}`} className="flex flex-col h-full">
            <CardHeader className="p-0">
                <div className="relative aspect-video w-full overflow-hidden">
                {part.imageUrls && part.imageUrls.length > 0 ? (
                    <Image 
                        src={part.imageUrls[0]} 
                        alt={part.name} 
                        fill 
                        className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105" 
                        data-ai-hint="car parts" 
                    />
                ) : (
                    <div className="bg-muted h-full w-full flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">{t.productCard.noImage}</span>
                    </div>
                )}
                </div>
                <div className="p-4 sm:p-6 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="pr-2 text-base sm:text-lg">
                        {part.name}
                    </CardTitle>
                    <Badge variant={part.quantity > 0 ? "secondary" : "destructive"} className="shrink-0 mt-1 hidden sm:flex">
                    {part.quantity > 0 ? t.productCard.inStock : t.productCard.outOfStock}
                    </Badge>
                </div>
                <CardDescription className="pt-2 text-sm line-clamp-2 hidden sm:block">{part.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4 p-4 sm:p-6 pt-0 sm:pt-2">
                <div className="items-center text-sm text-muted-foreground hidden sm:flex">
                    <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{part.vendorAddress}</span>
                    </div>
                </div>
                <div className="text-xl sm:text-3xl font-bold text-primary">{part.price.toFixed(2)} OMR</div>
            </CardContent>
            <CardFooter className="p-4 sm:p-6 pt-0 mt-auto hidden sm:flex justify-between items-center">
                <span className="text-sm font-medium text-primary flex items-center">
                    {t.productCard.viewDetails} <ArrowRight className="ml-2 h-4 w-4" />
                </span>
                <Button variant="secondary" size="sm" onClick={handleAddToCart} disabled={part.quantity === 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> {t.productCard.addToCart}
                </Button>
            </CardFooter>
        </Link>
    </Card>
  );
}
