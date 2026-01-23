

"use client";

import Link from "next/link"
import {
  Car,
  Home,
  Users,
  Sparkles,
  Building,
  Landmark,
  Menu,
  Settings
} from "lucide-react"

import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";


export function AdminHeader() {
    const pathname = usePathname();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: Home },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/vendors", label: "Vendors", icon: Building },
        { href: "/admin/ai-analytics", label: "AI Analytics", icon: Sparkles },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];
    
    const currentPageLabel = navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard';


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        {/* Desktop Navigation */}
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Car className="h-6 w-6" />
              <span className="">Admin Panel</span>
            </Link>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "transition-colors hover:text-foreground",
                        pathname.startsWith(item.href) ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
        {/* Mobile Navigation */}
        <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium pt-8">
                         <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setIsSheetOpen(false)}>
                            <Car className="h-6 w-6" />
                            <span>Admin Panel</span>
                        </Link>
                        {navItems.map((item) => (
                           <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 text-muted-foreground hover:text-foreground",
                                    pathname.startsWith(item.href) && "text-foreground"
                                )}
                                onClick={() => setIsSheetOpen(false)}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

      <div className="flex w-full items-center justify-end md:justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <h1 className="text-lg font-semibold md:hidden">
              {currentPageLabel}
          </h1>
      </div>
    </header>
  )
}
