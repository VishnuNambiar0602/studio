
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Camera, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatCameraProps {
  onPhotoTaken: (dataUri: string) => void;
}

export function ChatCamera({ onPhotoTaken }: ChatCameraProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const getCameraDevices = useCallback(async () => {
    try {
      const availableDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = availableDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        // Prefer the back camera ('environment')
        const backCamera = videoDevices.find((device) =>
          device.label.toLowerCase().includes("back")
        );
        setSelectedDeviceId(backCamera ? backCamera.deviceId : videoDevices[0].deviceId);
      } else {
        setError("No camera found.");
      }
    } catch (e) {
      setError("Could not list camera devices.");
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getCameraDevices();
  }, [getCameraDevices]);

  const startStream = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setLoading(true);
    setError(null);
    if (selectedDeviceId) {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
        });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        setError("Could not start camera. Please ensure permissions are granted.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedDeviceId, stream]);

  useEffect(() => {
    startStream();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [selectedDeviceId]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL("image/png");
      onPhotoTaken(dataUri);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Camera Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
        {loading && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
        <video
          ref={videoRef}
          className={cn("w-full h-full object-cover", loading && "hidden")}
          autoPlay
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {devices.length > 1 && (
          <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
            <SelectTrigger>
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${devices.indexOf(device) + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button onClick={handleCapture} disabled={loading || !!error} className="w-full">
          <Camera className="mr-2 h-4 w-4" /> Capture Photo
        </Button>
      </div>
    </div>
  );
}
