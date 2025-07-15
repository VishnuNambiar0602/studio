
import { SettingsForm } from "@/app/settings/_components/settings-form";


export default function VendorSettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        </div>
        <SettingsForm />
      </main>
    </div>
  );
}
