
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/settings-context";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export function AdminHeroImageUploader() {
    const { heroImageUrl, setHeroImageUrl } = useSettings();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

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
        if (!file) return;
        setLoading(true);

        try {
            // In a real app, this would upload to cloud storage.
            // Here, we save the base64 data URL to the settings context.
            const newImageUrl = await fileToDataUrl(file);
            setHeroImageUrl(newImageUrl);

            toast({
                title: "Success!",
                description: "The hero image has been updated successfully.",
            });

            setPreview(null);
            setFile(null);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "There was a problem updating the image.",
            });
        } finally {
            setLoading(false);
        }
    };

    const currentImageSrc = preview || heroImageUrl;
    
    return (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Hero Image</CardTitle>
                <CardDescription>Change the main image on the landing page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative aspect-video w-full rounded-md border-2 border-dashed flex items-center justify-center bg-muted">
                    {currentImageSrc ? (
                        <Image src={currentImageSrc} alt="Hero image preview" fill className="object-cover rounded-md" />
                    ) : (
                        <p className="text-sm text-muted-foreground">No image set</p>
                    )}
                </div>
                 <Input 
                    id="hero-image-upload"
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                {preview ? (
                     <div className="flex justify-end gap-2">
                        <Button onClick={handleSave} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Image
                        </Button>
                        <Button variant="ghost" onClick={() => { setPreview(null); setFile(null); }}>Cancel</Button>
                    </div>
                ) : (
                    <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose New Image
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
