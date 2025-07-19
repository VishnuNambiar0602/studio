
"use client";

import Link from "next/link"
import {
  Car,
  Home,
  ListTodo,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  User as UserIcon,
  Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSettings } from "@/context/settings-context";
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";


export function VendorHeader() {
    const { loggedInUser, logoutUser } = useSettings();
    const pathname = usePathname();
    const router = useRouter();
    const [companyName, setCompanyName] = useState('Vendor Panel');

    useEffect(() => {
        if (loggedInUser?.name) {
            setCompanyName(loggedInUser.name);
        }
    }, [loggedInUser]);


    const handleLogout = () => {
        logoutUser();
        router.push('/');
    };

    const navItems = [
        { href: "/vendor/dashboard", label: "Dashboard", icon: Home },
        { href: "/vendor/inventory", label: "Inventory", icon: Package },
        { href: "/vendor/tasks", label: "Tasks", icon: ListTodo },
        { href: "/vendor/settings", label: "Settings", icon: Settings },
        { href: "/vendor/account", label: "Account", icon: UserIcon },
    ];


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        {/* Desktop Navigation */}
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <span className="">
                {companyName}
              </span>
            </Link>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "transition-colors hover:text-foreground",
                        pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="/vendor/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                            <span>{companyName}</span>
                        </Link>
                        {navItems.map((item) => (
                           <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 text-muted-foreground hover:text-foreground",
                                    pathname === item.href && "text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline">
                <Link href="/">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Shop
                </Link>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full h-9 w-9"
            >
                 <Avatar className="h-9 w-9">
                    <AvatarFallback><Car /></AvatarFallback>
                  </Avatar>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/vendor/account">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/vendor/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/vendor/support">Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
