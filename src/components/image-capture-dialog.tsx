
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Camera, X, RefreshCw, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageCapture: (dataUri: string) => void;
}

export function ImageCaptureDialog({ open, onOpenChange, onImageCapture }: ImageCaptureDialogProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const stopCameraStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCameraStream();
    setLoading(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { exact: facingMode } }
        });
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Could not access the camera. Please check permissions.',
        });
        onOpenChange(false); // Close dialog on error
      } finally {
        setLoading(false);
      }
    } else {
      toast({ variant: 'destructive', title: 'Camera Not Supported' });
      onOpenChange(false);
      setLoading(false);
    }
  }, [facingMode, onOpenChange, stopCameraStream, toast]);

  // Effect to start the camera when the dialog opens
  useEffect(() => {
    if (open) {
      navigator.mediaDevices?.enumerateDevices().then(devices => {
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      });
      startCamera();
    } else {
      stopCameraStream();
      setIsCameraActive(false);
      setCapturedImage(null);
    }
  }, [open, startCamera, stopCameraStream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      stopCameraStream();
      setIsCameraActive(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onImageCapture(capturedImage);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => stopCameraStream();
  }, [stopCameraStream]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Take a Photo</DialogTitle>
          <DialogDescription>
            Center the part in the frame and take a clear picture.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
          {loading && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
          <video
            ref={videoRef}
            className={cn("w-full h-full object-cover", !isCameraActive && "hidden")}
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          {capturedImage && (
            <Image src={capturedImage} alt="Captured preview" layout="fill" objectFit="contain" />
          )}
        </div>

        <DialogFooter className="gap-2">
          {isCameraActive ? (
            <>
              {hasMultipleCameras && (
                <Button variant="outline" onClick={handleSwitchCamera}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Switch Camera
                </Button>
              )}
              <Button onClick={handleCapture}>
                <Camera className="mr-2 h-4 w-4" /> Capture
              </Button>
            </>
          ) : capturedImage ? (
            <>
              <Button variant="ghost" onClick={handleRetake}>
                <X className="mr-2 h-4 w-4" /> Retake
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" /> Use Photo
              </Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
