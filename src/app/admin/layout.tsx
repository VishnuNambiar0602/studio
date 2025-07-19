import { AdminHeader } from "@/components/admin-header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AdminHeader />
            {children}
        </div>
    );
}
