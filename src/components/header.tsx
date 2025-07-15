
"use client";

import { Car, LogOut, Settings, ShoppingCart, User, ListOrdered } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Image from "next/image";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export function Header() {
  const { cart } = useCart();
  const { language, isLoggedIn, setIsLoggedIn } = useSettings();
  const t = getDictionary(language);
  const itemCount = cart.length;
  const router = useRouter();

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-2xl">
            {t.header.brand}
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button variant="ghost" asChild><Link href="/new-parts">{t.header.newParts}</Link></Button>
           <Button variant="ghost" asChild><Link href="/used-parts">{t.header.usedParts}</Link></Button>
           <Button variant="ghost" asChild><Link href="/oem-parts">{t.header.oemParts}</Link></Button>
          <Button asChild variant="outline" size="icon" aria-label={t.header.cart} className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Image
                      src="https://placehold.co/36x36.png"
                      width={36}
                      height={36}
                      alt="Avatar"
                      className="overflow-hidden rounded-full"
                      data-ai-hint="person avatar"
                    />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t.header.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Link href="/my-orders"><ListOrdered className="mr-2 h-4 w-4" />My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" />{t.header.settings}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.header.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild>
              <Link href="/auth">
                  <User className="mr-2 h-4 w-4" />
                  {t.header.login}
              </Link>
            </Button>
          )}

        </div>
      </div>
    </header>
  );
}
