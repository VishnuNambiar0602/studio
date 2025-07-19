
"use client";

import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import Image from "next/image";
import { Button } from "./ui/button";
import { Camera, Bot } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { TakeSnap } from "./take-snap";
import { useState } from "react";
import { suggestParts, SuggestPartsOutput } from "@/ai/flows/suggest-parts-from-request";
import { useParts } from "@/context/part-context";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";

export function HeroSection() {
    const { language } = useSettings();
    const { parts } = useParts();
    const t = getDictionary(language);
    const router = useRouter();

    const [snapDialogOpen, setSnapDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SuggestPartsOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);


    const onGetSuggestion = async (data: { partDescription: string }) => {
        setLoading(true);
        setResult(null);
        setError(null);
        try {
          const partsList = parts; // Use parts directly from context
          const availableParts = JSON.stringify(
            partsList.map(({ id, name, description, price }) => ({ id, name, description, price }))
          );
          const response = await suggestParts({
            partDescription: data.partDescription || "The user has provided an image, please identify the part.",
            availableParts,
            photoDataUri: photoDataUri || undefined,
          });
          setResult(response);
          if (response.isPartQuery && response.suggestions.length > 0) {
            // Optional: directly navigate if only one suggestion?
            // For now, let's just show the suggestions.
          }
        } catch (e) {
          setError("An error occurred while suggesting parts. Please try again.");
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      
    const handleSuggestionClick = (partId: string) => {
      setSnapDialogOpen(false);
      router.push(`/part/${partId}`);
    };

    return (
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
            <Image 
              src="https://images.unsplash.com/photo-1559607723-ee16c9ecb103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZGVzZXJ0JTIwY2FydG9vbiUyMHdpdGglMjBjYXJ8ZW58MHx8fHwxNzUyODI4MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt={t.hero.alt} 
              fill 
              className="object-cover"
              priority
              data-ai-hint="desert car"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/70" />
            <div className="relative z-10 p-4 text-white">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg">{t.hero.title}</h1>
                {t.hero.subtitle && (
                  <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                      {t.hero.subtitle}
                  </p>
                )}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Dialog open={snapDialogOpen} onOpenChange={setSnapDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" variant="secondary">
                                <Camera className="mr-2 h-5 w-5" />
                                Take a Snap
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                             <DialogHeader>
                                <DialogTitle>Find a Part with an Image</DialogTitle>
                                <DialogDescription>
                                  Use your camera or upload a photo. The AI Genie will try to identify the part and find matches.
                                </DialogDescription>
                            </DialogHeader>
                             <TakeSnap 
                                onGetSuggestion={onGetSuggestion} 
                                setPhotoDataUri={setPhotoDataUri}
                                photoDataUri={photoDataUri}
                                loading={loading}
                             />
                             {result && (
                                <div className="mt-4">
                                  {result.isPartQuery && result.suggestions.length > 0 ? (
                                    <div className="space-y-2">
                                      <h4 className="font-semibold">Here's what I found:</h4>
                                      {result.suggestions.map(s => (
                                        <button key={s.id} onClick={() => handleSuggestionClick(s.id)} className="w-full text-left">
                                          <Card className="hover:bg-muted/50 transition-colors">
                                            <CardContent className="p-3">
                                              <p className="font-semibold text-primary">{s.name}</p>
                                              <p className="text-sm text-muted-foreground">{s.reason}</p>
                                            </CardContent>
                                          </Card>
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <Alert>
                                      <AlertTitle>Genie's Response</AlertTitle>
                                      <AlertDescription>{result.answer || "I couldn't identify a specific part, but I'm here to answer any automotive questions you have!"}</AlertDescription>
                                    </Alert>
                                  )}
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
                    <Button size="lg" asChild>
                        <Link href="/genie">
                            <Bot className="mr-2 h-5 w-5" />
                            Ask the Genie
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
