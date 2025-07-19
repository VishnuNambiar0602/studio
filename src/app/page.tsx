// Edited

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductSection } from "@/components/product-section";
import { Chatbot } from "@/components/chatbot";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

export default async function Home() {
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<ProductGridSkeleton/>}>
          <ProductSection />
        </Suspense>
        <Chatbot />
      </main>
    </div>
  );
}
