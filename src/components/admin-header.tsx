
"use client";

import Link from "next/link"
import {
  Home,
  LogOut,
  Package,
  Settings,
  User,
  Users,
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
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";


export function AdminHeader() {
    const { logoutUser } = useSettings();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        router.push('/');
    };

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: Home },
        { href: "/admin/users", label: "Users", icon: Users },
    ];


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
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
          <div className="ml-auto flex items-center gap-2">
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full h-9 w-9"
            >
                 <Avatar className="h-9 w-9">
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
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
