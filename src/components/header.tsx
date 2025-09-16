"use client";

import { LogOut, Settings, ShoppingCart, User, ListOrdered, LayoutDashboard, HelpCircle, Car, Menu, Languages, Wrench, Sprout, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "./ui/dropdown-menu";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { useState } from "react";
import type { Language } from "@/lib/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


export function Header() {
  const { cart } = useCart();
  const { language, setLanguage, isLoggedIn, loggedInUser, logoutUser } = useSettings();
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
      case 'admin': return "/admin";
      case 'vendor': return "/vendor/dashboard";
      default: return "/my-orders";
    }
  }

  const getAvatarIcon = () => {
    if (!loggedInUser) return <User />;
    return loggedInUser.role === 'vendor' ? <Car /> : <User />;
  }

  const partsComponents: { title: string; href: string; description: string }[] = [
    {
      title: t.header.newParts,
      href: "/new-parts",
      description:
        "Brand new, factory-sealed parts for optimal performance and reliability.",
    },
    {
      title: t.header.usedParts,
      href: "/used-parts",
      description:
        "Cost-effective, inspected used parts to get you back on the road.",
    },
    {
      title: t.header.oemParts,
      href: "/oem-parts",
      description:
        "Original Equipment Manufacturer parts for a guaranteed perfect fit.",
    },
  ]
  
  const servicesComponents: { title: string; href: string; description: string }[] = [
    {
        title: "Book an Appointment",
        href: "/support",
        description: "Schedule a time to meet with a vendor or get professional advice."
    },
    {
        title: "Next Service",
        href: "/support",
        description: "Plan and get reminders for your vehicle's next scheduled service."
    }
  ]
  
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
        <NavigationMenu className="hidden md:flex flex-1">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Parts</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {partsComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
               <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {servicesComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 md:flex-none items-center justify-end space-x-2">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
                  <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ar">العربية (Arabic)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

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
                    <AvatarImage src={loggedInUser.profilePictureUrl} alt={loggedInUser.name} />
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
                  <Link href="#" className="font-semibold">Parts</Link>
                  {partsComponents.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">{link.title}</Link>
                  ))}
                  <Link href="#" className="font-semibold pt-4 border-t">Services</Link>
                  {servicesComponents.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">{link.title}</Link>
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
