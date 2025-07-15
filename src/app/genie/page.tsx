import { AiPartSuggester } from "@/components/ai-part-suggester";
import { Header } from "@/components/header";

export default function GeniePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <AiPartSuggester />
      </main>
    </div>
  );
}
