
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState, useEffect, useRef } from "react";
import { suggestParts, SuggestPartsOutput } from "@/ai/flows/suggest-parts-from-request";
import { Loader2, Bot, Upload, Camera, Mic, MicOff, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TakeSnap } from "./take-snap";
import { useSettings } from "@/context/settings-context";
import { getParts } from "@/lib/actions";
import Link from "next/link";

const FormSchema = z.object({
  partDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

// For cross-browser compatibility with the Web Speech API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || (window as any).webkitSpeechRecognition));


export function AiPartSuggester() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestPartsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const { language } = useSettings();
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      partDescription: "",
    },
  });

  // Effect to initialize and clean up speech recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Process a single utterance
    recognition.interimResults = true; // Get results as the user speaks
    // Set language based on context for better recognition accuracy
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      // Update the form value with the live transcript
      form.setValue('partDescription', transcript);

      // If the speech is final, trigger validation
      if (event.results[0].isFinal) {
         form.trigger('partDescription');
      }
    };

    recognition.onerror = (event: any) => {
      let errorMessage = `Voice recognition error: ${event.error}. Please try again.`;
      if (event.error === 'not-allowed') {
        errorMessage = "Voice recognition was disabled. Please allow microphone access in your browser settings.";
      } else if (event.error === 'no-speech') {
        errorMessage = "No speech was detected. Please make sure your microphone is working and try again.";
      } else if (event.error === 'network') {
        errorMessage = "A network error occurred during voice recognition. Please check your internet connection and try again.";
      }
      setError(errorMessage);
      console.error('Speech recognition error', event.error, event.message);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    }
  }, [form, language]);
  

  const onSubmit = async (data: z.infer<typeof FormSchema> | { partDescription: string }) => {
    if (!data.partDescription && !photoDataUri) {
        form.setError("partDescription", { type: "manual", message: "Please provide a description or an image." });
        return;
    }
    
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const parts = await getParts();
      const availableParts = JSON.stringify(
        parts.map(({ id, name, description, price }) => ({ id, name, description, price }))
      );

      const response = await suggestParts({
        partDescription: data.partDescription || "The user has provided an image, please identify the part.",
        availableParts,
        photoDataUri: photoDataUri || undefined,
      });
      
      setResult(response);
    } catch (e) {
      setError("An error occurred while suggesting parts. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceButtonClick = () => {
    if (!SpeechRecognition) {
      setError("Sorry, your browser does not support voice recognition.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setError(null); // Clear previous errors
      recognitionRef.current?.start();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-none border-none bg-transparent md:bg-card md:border-solid md:shadow-lg md:border">
      <CardHeader className="text-center p-8">
        <Bot className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-3xl font-bold mt-4">The Genie</CardTitle>
        <CardDescription className="text-md text-muted-foreground mt-2">
          Describe the part you need, upload an image, or use your voice. Our AI will find the perfect match.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="text">Describe Part</TabsTrigger>
                <TabsTrigger value="image">Use Image</TabsTrigger>
                <TabsTrigger value="voice">Use Voice</TabsTrigger>
            </TabsList>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="text">
                        <FormField
                        control={form.control}
                        name="partDescription"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Describe your part</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="e.g., 'A brake pad for a 2021 Lexus LX570, it should be OEM...'"
                                className="resize-none"
                                rows={4}
                                {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                For best results, include vehicle make, model, year, and any specific details. You can also use Arabic.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </TabsContent>
                    
                    <TabsContent value="image">
                        <TakeSnap 
                            onGetSuggestion={onSubmit} 
                            setPhotoDataUri={setPhotoDataUri}
                            photoDataUri={photoDataUri}
                            loading={loading}
                        />
                    </TabsContent>

                    <TabsContent value="voice">
                        <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
                           <Button 
                             type="button" 
                             onClick={handleVoiceButtonClick} 
                             size="lg" 
                             variant={isListening ? "destructive" : "outline"}
                             className="w-24 h-24 rounded-full"
                           >
                              {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                           </Button>
                           <p className="text-muted-foreground">
                             {isListening ? "Listening... Click to stop." : "Click the microphone to start speaking."}
                           </p>
                           <FormField
                              control={form.control}
                              name="partDescription"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <Textarea
                                      placeholder="Your transcribed text will appear here..."
                                      className="resize-none text-center"
                                      rows={2}
                                      {...field}
                                      readOnly={isListening}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                           />
                        </div>
                    </TabsContent>

                    {/* Submit button is outside the tabs content to be always visible */}
                    <Button type="submit" disabled={loading} className="w-full" size="lg">
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Bot className="mr-2 h-4 w-4" />
                    )}
                    Ask the Genie
                    </Button>
                </form>
            </Form>
        </Tabs>

        {result && (
          <div className="mt-8 space-y-4">
             <h3 className="text-lg font-semibold">The Genie's Response:</h3>
            {result.isPartQuery ? (
              result.suggestions && result.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {result.suggestions.map((part) => (
                    <Link href={`/part/${part.id}`} key={part.id} className="block">
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-primary">{part.name}</h4>
                                <p className="text-sm text-muted-foreground">{part.reason}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-primary shrink-0"/>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">I couldn't find any specific parts matching your request in our current inventory, but I can help with general questions!</p>
              )
            ) : (
              <p className="text-muted-foreground">{result.answer}</p>
            )}
          </div>
        )}
          {error && (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
