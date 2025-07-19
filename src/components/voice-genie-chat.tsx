
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, CornerDownLeft, Sparkles, AlertCircle, ArrowRight, Mic, MicOff, Volume2 } from "lucide-react";
import { useParts } from "@/context/part-context";
import { suggestParts, SuggestPartsOutput } from "@/ai/flows/suggest-parts-from-request";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSettings } from "@/context/settings-context";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: SuggestPartsOutput['suggestions'];
  audioUrl?: string;
}

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty."),
});

export function VoiceGenieChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { parts } = useParts();
  const { setLanguage } = useSettings();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const userInput = values.prompt;
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setLoading(true);
    setError(null);
    form.reset();

    try {
      const availableParts = JSON.stringify(
        parts.map(({ id, name, description, price }) => ({ id, name, description, price }))
      );
      const response = await suggestParts({ partDescription: userInput, availableParts });

      if (response.detectedLanguage) {
          setLanguage(response.detectedLanguage);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response.answer || "Here's what I found based on your request:",
        suggestions: response.suggestions,
      };
      
      if (response.answer) {
        const audioResponse = await textToSpeech({ text: response.answer });
        if (audioResponse.media) {
            assistantMessage.audioUrl = audioResponse.media;
            setAudioUrl(audioResponse.media);
        }
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      setError("An error occurred while processing your request. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      form.setValue("prompt", transcript);
      handleSubmit({ prompt: transcript });
    };

    recognitionRef.current.start();
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="py-6 px-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="relative mb-4">
                <div className="absolute -inset-2 bg-primary/10 rounded-full blur-2xl"></div>
                 <Avatar className="relative h-24 w-24 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20"><Volume2 className="h-12 w-12 text-primary" /></AvatarFallback>
                </Avatar>
              </div>
              <h1 className="text-4xl font-bold">Talk to the Genie</h1>
              <p className="text-xl text-muted-foreground mt-2">Click the microphone to start the conversation.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className="flex items-start gap-4 mb-8">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback>{message.role === "user" ? <User /> : <Sparkles className="text-primary" />}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <p className="font-semibold">{message.role === "user" ? "You" : "Genie"}</p>
                <div className={cn("prose prose-sm max-w-none text-foreground", { "text-muted-foreground": message.role === "user" })}>
                  {message.content}
                </div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {message.suggestions.map((part) => (
                      <Link href={`/part/${part.id}`} key={part.id} className="block">
                        <Card className="hover:bg-muted/80 transition-colors">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-primary">{part.name}</h4>
                              <p className="text-sm text-muted-foreground">{part.reason}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-4 mb-8">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback><Sparkles className="text-primary animate-pulse" /></AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2 pt-2">
                <div className="h-4 w-24 bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-full bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="px-4 pb-4 mt-auto">
        {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
            </div>
        )}
        <div className="flex items-center justify-center">
            <Button 
                size="lg" 
                className={cn("rounded-full h-20 w-20 transition-all duration-300", isRecording && "bg-destructive scale-110")}
                onClick={handleToggleRecording}
                disabled={loading}
            >
                {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
        </div>
      </div>
    </div>
  );
}
