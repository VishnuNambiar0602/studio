
"use client";

import Link from "next/link"
import {
  Car,
  Home,
  LogOut,
  Package,
  Settings,
  Shield,
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


export function AdminHeader() {
    const { setIsLoggedIn } = useSettings();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        setIsLoggedIn(false);
        router.push('/');
    };

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: Home },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/parts", label: "Parts", icon: Package },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold">Admin Panel</span>
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
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/">View Site</Link>
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
