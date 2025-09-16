
"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  const { language } = useSettings();
  const t = getDictionary(language);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="mt-4 text-3xl">{t.privacy.title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-6 space-y-4 text-muted-foreground prose max-w-none">
                <p>{t.privacy.p1}</p>
                
                <h3 className="font-semibold text-foreground pt-4">{t.privacy.h3_1}</h3>
                <p>{t.privacy.p2}</p>
                
                <h3 className="font-semibold text-foreground pt-4">{t.privacy.h3_2}</h3>
                <p>{t.privacy.p3}</p>

                <h3 className="font-semibold text-foreground pt-4">{t.privacy.h3_3}</h3>
                <p>{t.privacy.p4}</p>

                 <h3 className="font-semibold text-foreground pt-4">{t.privacy.h3_4}</h3>
                <p>{t.privacy.p5}</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
