"use client";

import { Car, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-xl">
            Desert Drive Depot
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button variant="ghost">Rentals</Button>
           <Button variant="ghost">About Us</Button>
          <Button variant="outline" size="icon" aria-label="Shopping Cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
