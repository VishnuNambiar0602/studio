// Edited
"use client";

import Link from "next/link"
import {
  Car,
  Home,
  Users,
  Sparkles,
} from "lucide-react"

import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";


export function AdminHeader() {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: Home },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/ai-analytics", label: "AI Analytics", icon: Sparkles },
    ];


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
                        pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          
      </div>
    </header>
  )
}
