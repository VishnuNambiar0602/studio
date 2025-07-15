
"use client";

import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import Image from "next/image";
import { Button } from "./ui/button";
import { Camera, Bot } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { AiPartSuggester } from "./ai-part-suggester";
import { TakeSnap } from "./take-snap";
import { useState } from "react";
import { suggestParts } from "@/ai/flows/suggest-parts-from-request";
import { useParts } from "@/context/part-context";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function HeroSection() {
    const { language } = useSettings();
    const t = getDictionary(language);
    const [snapDialogOpen, setSnapDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
    const { parts } = useParts();


    const scrollToAiSuggester = () => {
        document.getElementById('ai-suggester')?.scrollIntoView({ behavior: 'smooth' });
    }

    const onGetSuggestion = async (data: { partDescription: string }) => {
        setLoading(true);
        setResult(null);
        setError(null);
        try {
          const availableParts = JSON.stringify(
            parts.map(({ id, name, description, price }) => ({ id, name, description, price }))
          );
          const response = await suggestParts({
            partDescription: data.partDescription || "The user has provided an image, please identify the part.",
            availableParts,
            photoDataUri: photoDataUri || undefined,
          });
          setResult(response.suggestedParts);
        } catch (e) {
          setError("An error occurred while suggesting parts. Please try again.");
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

    return (
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
            <Image 
              src="https://placehold.co/1920x1080.png" 
              alt={t.hero.alt} 
              fill 
              className="object-cover"
              priority
              data-ai-hint="desert road cars"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/70" />
            <div className="relative z-10 p-4 text-white">
                <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg">{t.hero.title}</h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                    {t.hero.subtitle}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Dialog open={snapDialogOpen} onOpenChange={setSnapDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" variant="secondary">
                                <Camera className="mr-2 h-5 w-5" />
                                Take a Snap
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                             <TakeSnap 
                                onGetSuggestion={onGetSuggestion} 
                                setPhotoDataUri={setPhotoDataUri}
                                photoDataUri={photoDataUri}
                                loading={loading}
                             />
                             {result && (
                                <div className="mt-4">
                                    <Alert>
                                    <AlertTitle className="font-headline">Suggested Parts</AlertTitle>
                                    <AlertDescription>
                                        <pre className="whitespace-pre-wrap font-body text-sm">{result}</pre>
                                    </AlertDescription>
                                    </Alert>
                                </div>
                                )}
                                {error && (
                                <div className="mt-4">
                                    <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                </div>
                                )}
                        </DialogContent>
                    </Dialog>
                    <Button size="lg" onClick={scrollToAiSuggester}>
                        <Bot className="mr-2 h-5 w-5" />
                        Genie
                    </Button>
                </div>
            </div>
        </section>
    )
}
