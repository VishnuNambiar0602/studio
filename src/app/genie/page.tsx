// Edited
import { Header } from "@/components/header";
import { GeminiChat } from "@/components/gemini-chat";

export default function GeniePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex-grow h-full">
          <GeminiChat />
        </div>
      </main>
    </div>
  );
}
