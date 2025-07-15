import { SettingsProvider } from "@/context/settings-context";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SettingsProvider>
            {children}
        </SettingsProvider>
    );
}
