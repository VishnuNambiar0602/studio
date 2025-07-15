"use client";

import { Car, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { Badge } from "./ui/badge";

export function Header() {
  const { cart } = useCart();
  const itemCount = cart.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-2xl">
            GulfCarX
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button variant="ghost" asChild><Link href="/new-parts">New Parts</Link></Button>
           <Button variant="ghost" asChild><Link href="/used-parts">Used Parts</Link></Button>
           <Button variant="ghost" asChild><Link href="/oem-parts">OEM</Link></Button>
          <Button asChild variant="outline" size="icon" aria-label="Shopping Cart" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth">
                <User className="mr-2 h-4 w-4" />
                Sign Up / Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
