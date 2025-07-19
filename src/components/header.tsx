
"use client";

import { LogOut, Settings, ShoppingCart, User, ListOrdered, LayoutDashboard, HelpCircle, Car, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { useState } from "react";

export function Header() {
  const { cart } = useCart();
  const { language, isLoggedIn, loggedInUser, logoutUser } = useSettings();
  const t = getDictionary(language);
  const itemCount = cart.length;
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  }

  const getDashboardLink = () => {
    if (!loggedInUser) return "/";
    switch (loggedInUser.role) {
      case 'admin': return "/admin/dashboard";
      case 'vendor': return "/vendor/dashboard";
      default: return "/my-orders";
    }
  }

  const getAvatarIcon = () => {
    if (!loggedInUser) return <User />;
    return loggedInUser.role === 'vendor' ? <Car /> : <User />;
  }
  
  const navLinks = [
      { href: "/new-parts", label: t.header.newParts },
      { href: "/used-parts", label: t.header.usedParts },
      { href: "/oem-parts", label: t.header.oemParts },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">
            {t.header.brand}
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-2">
           {navLinks.map(link => (
              <Button key={link.href} variant="ghost" asChild><Link href={link.href}>{link.label}</Link></Button>
           ))}
        </nav>

        <div className="flex flex-1 md:flex-none items-center justify-end space-x-2">
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

          {isLoggedIn && loggedInUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full h-9 w-9"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                       {getAvatarIcon()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t.header.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(loggedInUser.role === 'admin' || loggedInUser.role === 'vendor') && (
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                  </DropdownMenuItem>
                )}
                 <DropdownMenuItem asChild>
                  <Link href="/my-orders"><ListOrdered className="mr-2 h-4 w-4" />My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" />{t.header.settings}</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/support"><HelpCircle className="mr-2 h-4 w-4" />Support</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.header.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild className="hidden sm:inline-flex">
              <Link href="/auth">
                  <User className="mr-2 h-4 w-4" />
                  {t.header.login}
              </Link>
            </Button>
          )}

           {/* Mobile Menu */}
           <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                 <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium pt-8">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">{link.label}</Link>
                  ))}
                  <div className="border-t pt-6">
                    {!isLoggedIn && (
                       <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-muted-foreground hover:text-foreground">
                         <User className="mr-2 h-5 w-5" />
                         {t.header.login}
                       </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
