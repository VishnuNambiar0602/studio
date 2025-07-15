import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SettingsControls } from "./settings-controls";

export function SettingsForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                    Manage your application appearance and settings.
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
                <SettingsControls />
            </CardContent>
        </Card>
    )
}
