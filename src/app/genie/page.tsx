
"use client";

import { AiPartSuggester } from "@/components/ai-part-suggester";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GeniePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80"
          onClick={() => router.back()}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close Genie</span>
        </Button>
        <div className="grid md:grid-cols-2 min-h-[calc(100vh-80px)] md:min-h-screen">
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
            <div className="flex items-center justify-center p-4 sm:p-8 md:p-12">
                 <AiPartSuggester />
            </div>
        </div>
      </main>
    </div>
  );
}
