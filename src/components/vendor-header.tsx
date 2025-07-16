
"use client";

import Link from "next/link"
import {
  Car,
  Home,
  ListTodo,
  Package,
  Settings,
  User as UserIcon,
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
import Image from "next/image"
import { useSettings } from "@/context/settings-context";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";


export function VendorHeader() {
    const { setIsLoggedIn } = useSettings();
    const pathname = usePathname();

    const handleLogout = () => {
        setIsLoggedIn(false);
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
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Car className="h-6 w-6 text-primary" />
              <span className="sr-only">Desert Drive Depot Vendor</span>
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
          <div className="ml-auto flex-1 sm:flex-initial">
            {/* Can add search here later */}
          </div>
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
                    data-ai-hint="logo"
                />
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
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
