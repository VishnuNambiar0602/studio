
"use client";

import { useSettings } from "@/context/settings-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, loggedInUser } = useSettings();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/admin/login');
        } else if (loggedInUser?.role !== 'admin') {
            // If logged in but not an admin, deny access.
            // Redirect to home page or an "access denied" page.
            router.push('/'); 
        }
    }, [isLoggedIn, loggedInUser, router, pathname]);

    // While checking auth, show a loading state on the admin pages
    if (!isLoggedIn || loggedInUser?.role !== 'admin') {
         // Don't show loader on the login page itself
        if (pathname === '/admin/login') {
            return <>{children}</>;
        }
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AdminHeader />
            {children}
        </div>
    );
}
