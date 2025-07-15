
"use client";

import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import Image from "next/image";
import { Button } from "./ui/button";
import { Camera, Bot } from "lucide-react";

export function HeroSection() {
    const { language } = useSettings();
    const t = getDictionary(language);

    const scrollToAiSuggester = () => {
        document.getElementById('ai-suggester')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
            <Image 
              src="https://placehold.co/1920x1080.png" 
              alt={t.hero.alt} 
              fill 
              className="object-cover"
              priority
              data-ai-hint="desert illustration"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/70" />
            <div className="relative z-10 p-4 text-white">
                <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg">{t.hero.title}</h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                    {t.hero.subtitle}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary">
                        <Camera className="mr-2 h-5 w-5" />
                        Take a Snap
                    </Button>
                    <Button size="lg" onClick={scrollToAiSuggester}>
                        <Bot className="mr-2 h-5 w-5" />
                        Just Genie
                    </Button>
                </div>
            </div>
        </section>
    )
}
