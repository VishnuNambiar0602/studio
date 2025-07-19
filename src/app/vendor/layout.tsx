// Edited

import { VendorHeader } from "@/components/vendor-header";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <VendorHeader />
            {children}
        </div>
    );
}
