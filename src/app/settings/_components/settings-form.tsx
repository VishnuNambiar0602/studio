// Edited

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SettingsControls } from "./settings-controls";
import { AccountManagement } from "./account-management";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { ProfilePictureEditor } from "./profile-picture-editor";

export function SettingsForm() {
    const { language } = useSettings();
    const t = getDictionary(language);

    return (
        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>{t.settings.profilePicture}</CardTitle>
                    <CardDescription>
                        {t.settings.profilePictureDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfilePictureEditor />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.settings.preferences}</CardTitle>
                    <CardDescription>
                        {t.settings.preferencesDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                        <div>
                            <h3 className="font-semibold">{t.settings.appearance}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t.settings.appearanceDescription}
                            </p>
                        </div>
                        <ThemeSwitcher />
                    </div>
                    <SettingsControls />
                </CardContent>
            </Card>
            
            <AccountManagement />
        </div>
    )
}
