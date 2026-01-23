
"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/context/settings-context";
import { TtsVoice } from "@/lib/types";

export function AdminAudioSettings() {
    const { ttsVoice, setTtsVoice } = useSettings();
    const { toast } = useToast();

    const handleToggle = (checked: boolean) => {
        const newVoice: TtsVoice = checked ? "female" : "male";
        setTtsVoice(newVoice);
        toast({
            title: `TTS Voice Profile Updated`,
            description: `The global assistive audio voice is now set to ${newVoice}.`,
        });
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="tts-voice-toggle" className="text-base">
                    TTS Audio Profile
                </Label>
                <p className="text-sm text-muted-foreground">
                   Set the global Text-to-Speech voice to Male or Female.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Male</span>
                <Switch
                    id="tts-voice-toggle"
                    checked={ttsVoice === 'female'}
                    onCheckedChange={handleToggle}
                    aria-label="Toggle TTS voice between male and female"
                />
                 <span className="text-sm text-muted-foreground">Female</span>
            </div>
        </div>
    )
}
