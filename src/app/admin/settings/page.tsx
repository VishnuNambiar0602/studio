import { AdminAdToggle } from "../_components/admin-ad-toggle";
import { AdminHeroImageUploader } from "../_components/admin-hero-image-uploader";
import { AdminPriceOptimizationToggle } from "../_components/admin-price-optimization-toggle";
import { AdminSocialMediaSettings } from "../_components/admin-social-media-settings";
import { AdminTaxSettings } from "../_components/admin-tax-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Share2, Sparkles, Percent, Languages, Palette } from "lucide-react";
import { AdminAudioSettings } from "./_components/audio-settings";
import { LocalizationSettings } from "./_components/localization-settings";
import { AdminFontSizeSettings } from "./_components/font-size-settings";
import { AdminThemeSettings } from "./_components/theme-settings";

export default function AdminSettingsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Super Admin Settings</h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {/* Column 1 */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Appearance</CardTitle>
                            <CardDescription>Control the look and feel of the public-facing website.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <AdminHeroImageUploader />
                            <AdminSocialMediaSettings />
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2 */}
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Feature Controls</CardTitle>
                            <CardDescription>Enable or disable specific platform features.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <AdminPriceOptimizationToggle />
                            <AdminAdToggle />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5" /> Financial & Tax</CardTitle>
                            <CardDescription>Manage global financial settings. Per-vendor surcharges can be set in the Vendor Management section.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminTaxSettings />
                        </CardContent>
                    </Card>
                </div>

                {/* Column 3 */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> UI & UX Controls</CardTitle>
                            <CardDescription>Manage global user interface and experience settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <AdminThemeSettings />
                            <AdminFontSizeSettings />
                            <AdminAudioSettings />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Languages className="h-5 w-5" /> Localization</CardTitle>
                            <CardDescription>Manage website languages and translations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <LocalizationSettings />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
