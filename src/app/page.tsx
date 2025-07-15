import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductSection } from "@/components/product-section";
import { Chatbot } from "@/components/chatbot";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductSection />
      </main>
      <Chatbot />
    </div>
  );
}
