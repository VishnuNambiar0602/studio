
"use client";

import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { Suspense } from "react";

export default function OemPartsPage() {
  const { language } = useSettings();
  const t = getDictionary(language);
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-headline">{t.oemParts.title}</h1>
              <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
                {t.oemParts.description}
              </p>
            </div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid 
                category="oem"
              />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
