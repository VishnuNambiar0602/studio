
"use client";

import { Header } from "@/components/header";
import { SettingsForm } from "./_components/settings-form";
import { UserProfile } from "./_components/user-profile";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";
import { Footer } from "@/components/footer";

export default function SettingsPage() {
  const { language } = useSettings();
  const t = getDictionary(language);
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">{t.settings.title}</h1>
        </div>
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <UserProfile />
            <SettingsForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
