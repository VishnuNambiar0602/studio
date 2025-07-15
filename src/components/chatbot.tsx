
"use client";

import { Bot, Loader2, MessageSquare, Send, User } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { useState } from "react";
import { generalChat } from "@/ai/flows/general-chat-flow";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await generalChat({ message: input });
      const assistantMessage: Message = { role: 'assistant', content: response.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Chatbot error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
          <MessageSquare className="h-7 w-7" />
          <span className="sr-only">Open Chatbot</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <span>AI Assistant</span>
            </div>
          </SheetTitle>
           <SheetDescription>
            Ask me anything about our services or parts.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-grow my-4 pr-4">
            <div className="space-y-6">
                {messages.map((message, index) => (
                    <div key={index} className={cn("flex items-start gap-3", {
                        'justify-end': message.role === 'user'
                    })}>
                        {message.role === 'assistant' && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot /></AvatarFallback>
                             </Avatar>
                        )}
                        <div className={cn("rounded-lg px-4 py-2 text-sm max-w-[80%]", {
                            "bg-primary text-primary-foreground": message.role === 'user',
                            "bg-muted": message.role === 'assistant',
                        })}>
                           {message.content}
                        </div>
                         {message.role === 'user' && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback><User /></AvatarFallback>
                             </Avatar>
                        )}
                    </div>
                ))}
                 {loading && (
                    <div className="flex items-start gap-3">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot /></AvatarFallback>
                         </Avatar>
                        <div className="bg-muted rounded-lg px-4 py-3 text-sm">
                           <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                 )}
            </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
