import { Header } from "@/components/header";
import { SettingsForm } from "./_components/settings-form";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        </div>
        <div className="max-w-4xl mx-auto w-full">
            <SettingsForm />
        </div>
      </main>
    </div>
  );
}
