
"use client";

import { AdminHeader } from "@/components/admin-header";
import { useSettings } from "@/context/settings-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, loggedInUser } = useSettings();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Allow access to login page regardless of auth state
        if (pathname === '/admin/login') {
            return;
        }

        // If not logged in, or is not an admin, redirect to admin login
        if (!isLoggedIn || loggedInUser?.role !== 'admin') {
            router.replace('/admin/login');
        }
    }, [isLoggedIn, loggedInUser, router, pathname]);

    // Do not render the layout for the login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Render layout for authenticated admins
    if (isLoggedIn && loggedInUser?.role === 'admin') {
        return (
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <AdminHeader />
                {children}
            </div>
        );
    }

    // Render a loading state or null while checking auth
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
}
