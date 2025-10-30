
"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/settings-context";
import { Loader2, User as UserIcon, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// This is a placeholder for a future server action
// import { updateUserProfilePicture } from "@/lib/actions";

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export function ProfilePictureEditor() {
    const { loggedInUser, loginUser } = useSettings();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    if (!loggedInUser) return null;

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
                toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 100MB." });
                return;
            }
            if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
                toast({ variant: "destructive", title: "Invalid file type", description: "Please upload a JPG, PNG, or WEBP image." });
                return;
            }
            setFile(selectedFile);
            const dataUrl = await fileToDataUrl(selectedFile);
            setPreview(dataUrl);
        }
    };
    
    const handleSave = async () => {
        if (!file || !loggedInUser) return;
        setLoading(true);

        try {
            // In a real app, you would upload the file to a storage service (like Cloud Storage)
            // and get back a URL. For this simulation, we'll use the data URL directly.
            const newImageUrl = await fileToDataUrl(file);

            // This is a placeholder for the actual server action.
            // await updateUserProfilePicture(loggedInUser.id, newImageUrl);

            // To simulate success, we update the user in our client-side context.
            const updatedUser = { ...loggedInUser, profilePictureUrl: newImageUrl };
            loginUser(updatedUser); // This updates the global state

            toast({
                title: "Success!",
                description: "Your profile picture has been updated.",
            });

            setPreview(null);
            setFile(null);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "There was a problem updating your picture. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const currentAvatarSrc = preview || loggedInUser.profilePictureUrl || "";

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-background rounded-lg border">
            <div className="relative">
                <Avatar className="h-24 w-24 border">
                    <AvatarImage src={currentAvatarSrc} alt={loggedInUser.name} />
                    <AvatarFallback>
                        <UserIcon className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
                 <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                 >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change profile picture</span>
                </Button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
            </div>
            <div className="flex-grow text-center sm:text-left">
                <h3 className="font-semibold text-lg">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                    Upload a new photo. Recommended size: 200x200px.
                </p>
            </div>
            {preview && (
                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                    <Button variant="ghost" onClick={() => setPreview(null)}>Cancel</Button>
                </div>
            )}
        </div>
    );
}
