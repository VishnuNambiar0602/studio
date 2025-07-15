import { AiPartSuggester } from "@/components/ai-part-suggester";
import { Chatbot } from "@/components/chatbot";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductSection } from "@/components/product-section";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductSection />
        <div id="ai-suggester">
            <AiPartSuggester />
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
