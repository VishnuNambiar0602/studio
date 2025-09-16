
"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { Building2 } from "lucide-react";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  const { language } = useSettings();
  const t = getDictionary(language);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Building2 className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="mt-4 text-3xl">{t.about.title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-6 space-y-6 text-muted-foreground prose prose-lg max-w-none">
              <p>
                {t.about.p1}
              </p>
              <p>
                {t.about.p2}
              </p>
              <p>
                {t.about.p3}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
