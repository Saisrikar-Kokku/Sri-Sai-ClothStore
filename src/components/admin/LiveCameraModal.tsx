import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, SwitchCamera, Check, X, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { uploadBlobAsSareeImage } from '@/lib/imageUpload';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (url: string) => void;
  sku: string;
  currentAnglesCount: number;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
  sku,
  currentAnglesCount,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [capturedInSession, setCapturedInSession] = useState<string[]>([]);

  // Start / stop camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support live camera access. Please use the "Choose Photos from Phone" button.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.warn('Camera access failed:', err);
      setIsInitializing(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in browser permissions or use the photo upload button.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device detected on this system. You can upload photos directly from your device gallery.');
      } else {
        setCameraError(err.message || 'Unable to open camera.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = async () => {
    if (!videoRef.current || isCapturing) return;

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    setIsCapturing(true);

    // Flash animation effect
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 250);

    try {
      // 1. Render frame to canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // If user camera (selfie), mirror horizontally so it looks natural
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 2. Convert to JPEG blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.9)
      );

      if (!blob) throw new Error('Could not create photo blob');

      // 3. Upload directly to Supabase storage bucket
      const angleIndex = currentAnglesCount + capturedInSession.length;
      const publicUrl = await uploadBlobAsSareeImage(blob, sku, angleIndex);

      setCapturedInSession((prev) => [...prev, publicUrl]);
      onPhotoCaptured(publicUrl);
    } catch (err: any) {
      console.error('Error during photo capture:', err);
      setCameraError(err.message || 'Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDone = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in-0 duration-200">
      <div className="w-full max-w-lg border border-[#b08a47]/30 bg-[#f9f5ec] p-4 text-[#4c0d17] rounded-2xl max-h-[96vh] flex flex-col shadow-2xl relative">
        <div className="text-left space-y-1 pb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#4c0d17] flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#b08a47]" />
              <span>Live Shop Camera (లైవ్ కెమెరా)</span>
            </h3>
            <span className="rounded-full bg-[#4c0d17]/10 border border-[#b08a47]/30 px-2 py-0.5 text-[10px] font-bold text-[#4c0d17]">
              On-The-Flow Snapper
            </span>
          </div>
          <p className="text-[11px] text-[#8a7a6b]">
            Snap saree angles live on the go. Each snap is automatically uploaded and saved!
          </p>
        </div>

        {/* Viewfinder Window */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black border border-[#e5dfd3] flex items-center justify-center">
          {isInitializing ? (
            <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
              <Loader2 className="h-8 w-8 text-[#b08a47] animate-spin" />
              <p className="text-xs text-[#4c0d17]/90">Starting shop camera...</p>
              <span className="text-[10px] text-[#8a7a6b]/70">Please allow camera permissions if prompted</span>
            </div>
          ) : cameraError ? (
            <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center text-red-600">
              <AlertCircle className="h-10 w-10 text-red-600" />
              <p className="text-xs leading-relaxed max-w-xs">{cameraError}</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleDone}
                className="text-xs border-[#e5dfd3] text-[#4c0d17] mt-2"
              >
                Close & Use Device Gallery
              </Button>
            </div>
          ) : (
            <>
              {/* Live Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* 3x3 Saree Framing Guide Lines */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
                <div className="border-r border-b border-[#b08a47]/30" />
                <div className="border-r border-b border-[#b08a47]/30" />
                <div className="border-b border-[#b08a47]/30" />
                <div className="border-r border-b border-[#b08a47]/30" />
                <div className="border-r border-b border-[#b08a47]/30" />
                <div className="border-b border-[#b08a47]/30" />
                <div className="border-r border-[#b08a47]/30" />
                <div className="border-r border-[#b08a47]/30" />
                <div />
              </div>

              {/* Shutter Flash Animation Overlay */}
              {flashEffect && (
                <div className="absolute inset-0 bg-white opacity-80 pointer-events-none transition-opacity duration-200" />
              )}

              {/* Angle Counter Badge */}
              <div className="absolute top-3 left-3 rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#4c0d17] border border-[#b08a47]/30 shadow-lg">
                Angle #{currentAnglesCount + capturedInSession.length + 1} Ready
              </div>

              {/* Flip Camera Button */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md border border-white/20 text-[#4c0d17] flex items-center justify-center hover:bg-black hover:border-[#b08a47] transition cursor-pointer shadow-lg"
                title="Switch between front and rear camera"
              >
                <SwitchCamera className="h-4 w-4" />
              </button>

              {/* Capture in progress spinner overlay */}
              {isCapturing && (
                <div className="absolute inset-0 bg-[#f9f5ec] backdrop-blur-sm flex flex-col items-center justify-center space-y-2 z-30">
                  <Loader2 className="h-8 w-8 text-[#b08a47] animate-spin" />
                  <span className="text-xs font-bold text-[#4c0d17]">Saving & Uploading Angle...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Captured Angles Strip in this session */}
        {capturedInSession.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-[#8a7a6b] mb-1.5">
              <span className="flex items-center gap-1 text-[#065f46] font-semibold">
                <Sparkles className="h-3 w-3" /> {capturedInSession.length} New Photo{capturedInSession.length > 1 ? 's' : ''} Snapped:
              </span>
              <span className="font-mono text-[#8a7a6b]/70">Auto-saved to catalog</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {capturedInSession.map((url, i) => (
                <div
                  key={i}
                  className="relative h-12 w-12 rounded-lg overflow-hidden border border-[#b08a47]/30 shrink-0 bg-black"
                >
                  <img src={url} alt={`Snap ${i + 1}`} className="h-full w-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-white/80 text-[8px] text-center font-mono text-[#b08a47]">
                    #{currentAnglesCount + i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shutter and Action Controls */}
        <div className="pt-3 border-t border-[#e5dfd3] flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDone}
            className="border-[#e5dfd3] text-[#4c0d17]/90 hover:text-[#4c0d17] cursor-pointer text-xs"
          >
            <X className="h-3.5 w-3.5 mr-1" /> Cancel
          </Button>

          {/* Big Golden Shutter Button */}
          <button
            type="button"
            disabled={isInitializing || isCapturing || !!cameraError}
            onClick={handleCapture}
            className={`group relative flex items-center justify-center h-14 w-14 rounded-full border-4 transition-all duration-200 cursor-pointer shadow-xl ${
              isCapturing || !!cameraError
                ? 'border-[#e5dfd3] bg-[#e5dfd3] opacity-50 cursor-not-allowed'
                : 'border-[#b08a47] bg-[#4c0d17] hover:scale-105 active:scale-95 shadow-[#4c0d17]/30'
            }`}
            title="Click to snap photo"
          >
            <div className="h-8 w-8 rounded-full bg-[#b08a47] group-hover:bg-[#b08a47]Light flex items-center justify-center transition">
              <Camera className="h-4 w-4 text-black" />
            </div>
          </button>

          <Button
            type="button"
            onClick={handleDone}
            className="bg-[#065f46] hover:bg-[#044030] text-white text-[#4c0d17] font-bold text-xs px-4 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Done ({capturedInSession.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
