import { VendorHeader } from "@/components/vendor-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function VendorSettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <VendorHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Manage your dashboard appearance and settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
              <div>
                <h3 className="font-semibold">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode.
                </p>
              </div>
              <ThemeSwitcher />
            </div>
             <div className="flex items-center justify-between p-4 bg-background rounded-lg border opacity-50">
              <div>
                <h3 className="font-semibold">Language (Coming Soon)</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred language for the dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border opacity-50">
              <div>
                <h3 className="font-semibold">Font Size (Coming Soon)</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust the text size for better readability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
