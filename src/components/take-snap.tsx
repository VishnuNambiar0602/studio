
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, Sparkles, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from "next/image";
import { Textarea } from "./ui/textarea";

interface TakeSnapProps {
  onGetSuggestion: (data: { partDescription: string }) => void;
  setPhotoDataUri: (uri: string | null) => void;
  photoDataUri: string | null;
  loading: boolean;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function TakeSnap({ onGetSuggestion, setPhotoDataUri, photoDataUri, loading }: TakeSnapProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [description, setDescription] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/png');
      setPhotoDataUri(dataUri);
      setIsCameraActive(false); // Turn off camera view
      // Stop the camera stream
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File too large', description: 'Please upload an image smaller than 5MB.' });
        return;
      }
      const dataUri = await fileToDataUrl(file);
      setPhotoDataUri(dataUri);
    }
  };

  const handleSubmit = () => {
    onGetSuggestion({ partDescription: description });
  };
  
  const resetState = () => {
    setPhotoDataUri(null);
    setIsCameraActive(false);
    if(videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  }


  return (
    <div className="space-y-4">
      {!photoDataUri && !isCameraActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" size="lg" onClick={getCameraPermission}>
            <Camera className="mr-2 h-5 w-5" />
            Use Camera
          </Button>
          <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-5 w-5" />
            Upload Image
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>
      )}

      {isCameraActive && hasCameraPermission && (
        <div className="space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleCapture}>
                    <Camera className="mr-2 h-4 w-4" /> Capture
                </Button>
                <Button size="lg" variant="ghost" onClick={() => setIsCameraActive(false)}>
                    Cancel
                </Button>
            </div>
        </div>
      )}
      
      {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
                Please allow camera access in your browser settings to use this feature.
            </AlertDescription>
          </Alert>
      )}

      {photoDataUri && (
        <div className="space-y-4">
          <div className="relative w-full max-w-sm mx-auto aspect-square rounded-md overflow-hidden border">
            <Image src={photoDataUri} alt="Captured part" layout="fill" objectFit="contain" />
            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={resetState}>
                <X className="h-4 w-4" />
            </Button>
          </div>
          <Textarea 
            placeholder="Add an optional description (e.g., 'This part is from a Toyota Land Cruiser 2022')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Ask the Genie
          </Button>
        </div>
      )}
    </div>
  );
}
