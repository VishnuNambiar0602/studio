import { AiPartSuggester } from "@/components/ai-part-suggester";
import { Header } from "@/components/header";
import Image from "next/image";

export default function GeniePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="grid md:grid-cols-2 min-h-[calc(100vh-80px)]">
            <div className="relative hidden md:block">
                <Image
                    src="https://placehold.co/800x1200.png"
                    alt="Car Engine Bay"
                    fill
                    className="object-cover"
                    data-ai-hint="car engine"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/20 to-transparent" />
                 <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
            </div>
            <div className="flex items-center justify-center p-8 md:p-12">
                 <AiPartSuggester />
            </div>
        </div>
      </main>
    </div>
  );
}
