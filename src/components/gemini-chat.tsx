
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
import { Bot, User, Sparkles, AlertCircle, ArrowRight, Mic, Send, Paperclip, Camera, Upload, X } from "lucide-react";
import { useParts } from "@/context/part-context";
import { suggestParts, SuggestPartsOutput } from "@/ai/flows/suggest-parts-from-request";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSettings } from "@/context/settings-context";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ImageCaptureDialog } from "./image-capture-dialog";

interface Message {
  role: "user" | "assistant";
  content: string;
  imagePreview?: string;
  suggestions?: SuggestPartsOutput['suggestions'];
  followUpQuestions?: SuggestPartsOutput['followUpQuestions'];
}

const formSchema = z.object({
  prompt: z.string(), // Prompt is now optional
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
  const { language, setLanguage } = useSettings();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const promptValue = form.watch("prompt");

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
    if (!userInput && !imageUri) return; // Prevent submission if both are empty

    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content;

    setMessages((prev) => [...prev, { role: "user", content: userInput, imagePreview: imageUri || undefined }]);
    setLoading(true);
    setError(null);
    form.reset();
    const submittedImageUri = imageUri;
    setImageUri(null);

    try {
      const availableParts = JSON.stringify(
        parts.map(({ id, name, description, price }) => ({ id, name, description, price }))
      );
      const response = await suggestParts({
        partDescription: userInput,
        previousUserQuery: lastUserMessage,
        availableParts,
        photoDataUri: submittedImageUri || undefined,
      });

      if (response.detectedLanguage) {
          setLanguage(response.detectedLanguage);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response.answer || "Here's what I found based on your request:",
        suggestions: response.suggestions,
        followUpQuestions: response.followUpQuestions,
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
    form.handleSubmit(handleSubmit)();
  };
  
  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
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
    recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      form.setValue("prompt", transcript, { shouldValidate: true });
    };

    recognitionRef.current.start();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full pt-16">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="py-6 px-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative mb-4">
                <div className="absolute -inset-2 bg-primary/10 rounded-full blur-2xl"></div>
                <Image src="https://images.unsplash.com/photo-1559607723-ee16c9ecb103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZGVzZXJ0JTIwY2FydG9vbiUyMHdpdGglMjBjYXJ8ZW58MHx8fHwxNzUyODI4MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080" width={96} height={96} alt="Genie Avatar" className="relative rounded-full border" />
              </div>
              <h1 className="text-4xl font-bold">Hello! I'm the Genie.</h1>
              <p className="text-xl text-muted-foreground mt-2">How can I help you find the perfect part?</p>
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
                {message.imagePreview && (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border">
                    <Image src={message.imagePreview} alt="User upload" layout="fill" objectFit="cover" />
                  </div>
                )}
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
                {message.followUpQuestions && message.followUpQuestions.length > 0 && !loading && index === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {message.followUpQuestions.map((question, qIndex) => (
                      <button key={qIndex} onClick={() => form.handleSubmit(handleSubmit)({ prompt: question })}>
                        <Badge variant="outline" className="text-sm py-1 px-3 hover:bg-muted cursor-pointer">
                          {question}
                        </Badge>
                      </button>
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
      <div className="px-4 pb-4 mt-auto pt-4">
        {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
            </div>
        )}
        <Card className="p-2 rounded-2xl shadow-lg">
          {imageUri && (
            <div className="relative p-2">
              <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                  <Image src={imageUri} alt="Image preview" layout="fill" objectFit="cover" />
              </div>
              <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6 rounded-full bg-background/50" onClick={() => setImageUri(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" size="icon" variant="ghost" className="rounded-xl h-10 w-10 shrink-0">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1">
                <div className="flex flex-col">
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4"/> Upload Image
                  </Button>
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => setIsCameraOpen(true)}>
                    <Camera className="h-4 w-4"/> Take Photo
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Input
              {...form.register("prompt")}
              placeholder="Message the Genie..."
              className="flex-grow border-none focus-visible:ring-0 shadow-none text-base"
              disabled={loading}
              autoComplete="off"
            />
            {promptValue || imageUri ? (
              <Button type="submit" size="icon" disabled={loading} className="rounded-xl h-10 w-10 shrink-0">
                {loading ? (
                  <div className="h-4 w-4 border-2 border-background/50 border-t-background rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            ) : (
              <Button type="button" size="icon" variant="ghost" onClick={handleToggleRecording} disabled={loading} className={cn("rounded-xl h-10 w-10 shrink-0", isRecording && "text-destructive")}>
                <Mic className="h-5 w-5" />
              </Button>
            )}
          </form>
        </Card>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
        />
        <ImageCaptureDialog
          open={isCameraOpen}
          onOpenChange={setIsCameraOpen}
          onImageCapture={(uri) => {
            setImageUri(uri);
            setIsCameraOpen(false);
          }}
        />
      </div>
    </div>
  );
}
