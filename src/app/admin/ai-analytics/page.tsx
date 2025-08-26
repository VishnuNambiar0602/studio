import { AiConversionRate } from "./_components/ai-conversion-rate";
import { AiInteractionLog } from "./_components/ai-interaction-log";

export default function AiAnalyticsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">AI Genie Analytics</h1>
            </div>
            <div className="grid gap-4 md:gap-8">
                <AiConversionRate />
                <AiInteractionLog />
            </div>
        </main>
    );
}
