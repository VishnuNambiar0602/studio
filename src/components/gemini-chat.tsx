// Edited

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
import { Bot, User, CornerDownLeft, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { useParts } from "@/context/part-context";
import { suggestParts, SuggestPartsOutput } from "@/ai/flows/suggest-parts-from-request";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSettings } from "@/context/settings-context";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: SuggestPartsOutput['suggestions'];
}

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty."),
});

const examplePrompts = [
  { title: "Find a part", description: "Brake pads for a 2021 Toyota Land Cruiser" },
  { title: "Ask a question", description: "What's the difference between OEM and aftermarket parts?" },
  { title: "Get a recommendation", description: "I need a durable oil filter for off-road use" },
  { title: "Identify from description", description: "A filter that sits in a black box in the engine bay" },
];

export function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { parts } = useParts();
  const { setLanguage } = useSettings();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      setError("An error occurred while processing your request. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePrompt = (prompt: string) => {
    form.setValue("prompt", prompt);
    handleSubmit({ prompt });
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="py-6 px-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative mb-4">
                <div className="absolute -inset-2 bg-primary/10 rounded-full blur-2xl"></div>
                <Image src="https://images.unsplash.com/photo-1559607723-ee16c9ecb103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZGVzZXJ0JTIwY2FydG9vbiUyMHdpdGglMjBjYXJ8ZW58MHx8fHwxNzUyODI4MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080" width={96} height={96} alt="Genie Avatar" className="relative rounded-full border" />
              </div>
              <h1 className="text-4xl font-bold">Hello!</h1>
              <p className="text-xl text-muted-foreground mt-2">How can I help you today?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full">
                {examplePrompts.map((prompt) => (
                  <Card key={prompt.title} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => handleExamplePrompt(prompt.description)}>
                    <CardContent className="p-4 text-left">
                      <p className="font-semibold">{prompt.title}</p>
                      <p className="text-sm text-muted-foreground">{prompt.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
        <Card className="p-2 rounded-2xl shadow-lg">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-center gap-2">
            <Input
              {...form.register("prompt")}
              placeholder="Message the Genie..."
              className="flex-grow border-none focus-visible:ring-0 shadow-none text-base"
              disabled={loading}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={loading} className="rounded-xl h-10 w-10">
              {loading ? (
                <div className="h-4 w-4 border-2 border-background/50 border-t-background rounded-full animate-spin"></div>
              ) : (
                <CornerDownLeft className="h-5 w-5" />
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
