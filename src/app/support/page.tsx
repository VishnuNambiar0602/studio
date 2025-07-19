
"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { LifeBuoy, Mail, Phone } from "lucide-react";

export default function SupportPage() {
  const { language } = useSettings();
  const t = getDictionary(language);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container max-w-4xl mx-auto">
            <Card>
            <CardHeader className="text-center">
                <LifeBuoy className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="mt-4 text-3xl">{t.support.title}</CardTitle>
                <CardDescription className="mt-2 text-md">
                {t.support.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-6 space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg border">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h3 className="font-semibold">{t.support.emailTitle}</h3>
                        <p className="text-sm text-muted-foreground">{t.support.emailDescription}</p>
                        <a href="mailto:support@gulfcarx.com" className="text-sm text-primary font-medium hover:underline">
                            support@gulfcarx.com
                        </a>
                    </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg border">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h3 className="font-semibold">{t.support.phoneTitle}</h3>
                        <p className="text-sm text-muted-foreground">{t.support.phoneDescription}</p>
                        <a href="tel:+96812345678" className="text-sm text-primary font-medium hover:underline">
                            +968 1234 5678
                        </a>
                    </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg border">
                    <LifeBuoy className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h3 className="font-semibold">{t.support.helpCenterTitle}</h3>
                        <p className="text-sm text-muted-foreground">{t.support.helpCenterDescription}</p>
                        <a href="#" className="text-sm text-primary font-medium hover:underline">
                            {t.support.helpCenterLink}
                        </a>
                    </div>
                </div>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
