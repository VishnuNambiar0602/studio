import { AiPartSuggester } from "@/components/ai-part-suggester";
import { Chatbot } from "@/components/chatbot";
import { Header } from "@/components/header";
import { ProductSection } from "@/components/product-section";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductSection />
        <AiPartSuggester />
      </main>
      <Chatbot />
    </div>
  );
}

function HeroSection() {
    return (
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center bg-cover bg-center" style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}} data-ai-hint="oman desert luxury car">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/70" />
          <div className="relative z-10 p-4 text-white">
            <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg">The Future of Auto Parts, Realized</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Your AI-powered platform for high-quality used, OEM, and new car parts across the Sultanate.
            </p>
          </div>
        </section>
    )
}
