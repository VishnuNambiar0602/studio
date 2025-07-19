
"use client";

import { useSettings } from "@/context/settings-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin-header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, loggedInUser } = useSettings();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // We explicitly allow access to the login page to break the redirect loop.
        if (!isLoggedIn || loggedInUser?.role !== 'admin') {
            router.push('/admin-login');
        }
    }, [isLoggedIn, loggedInUser, router, pathname]);

    if (!isLoggedIn || loggedInUser?.role !== 'admin') {
        return (
            <div className="flex min-h-screen w-full flex-col bg-muted/40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AdminHeader />
            {children}
        </div>
    );
}
