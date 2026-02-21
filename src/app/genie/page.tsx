
import { GeminiChat } from "@/components/gemini-chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GeniePage() {
  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden">
      <header className="fixed top-0 left-0 z-10 p-4">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Zen Mode
          </Link>
        </Button>
      </header>
      <main className="flex-1 flex flex-col h-screen">
        <div className="w-full h-full max-w-4xl mx-auto flex-grow">
          <GeminiChat />
        </div>
      </main>
    </div>
  );
}
