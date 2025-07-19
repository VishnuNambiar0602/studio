// Edited

import { Header } from "@/components/header";
import { VoiceGenieChat } from "@/components/voice-genie-chat";

export default function VoiceGeniePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-between p-4">
        <div className="w-full max-w-4xl mx-auto flex-grow">
          <VoiceGenieChat />
        </div>
      </main>
    </div>
  );
}
