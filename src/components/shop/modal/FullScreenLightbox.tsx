import React, { useEffect, useState, useCallback, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { SareeAngleImage } from '@/types/inspection.types';

interface FullScreenLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  angleImages: SareeAngleImage[];
  initialIndex: number;
  productName: string;
}

export const FullScreenLightbox: React.FC<FullScreenLightboxProps> = ({
  isOpen,
  onClose,
  angleImages,
  initialIndex,
  productName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Touch tracking refs
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % angleImages.length);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + angleImages.length) % angleImages.length);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else if (e.key === '+' || e.key === '=') {
        setScale((s) => Math.min(3.5, Number((s + 0.3).toFixed(1))));
      } else if (e.key === '-') {
        setScale((s) => {
          const next = Math.max(1, Number((s - 0.3).toFixed(1)));
          if (next === 1) setPosition({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0' || e.key.toLowerCase() === 'r') {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    },
    [isOpen, angleImages.length, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleZoomIn = () => setScale((s) => Math.min(3.5, Number((s + 0.4).toFixed(1))));
  const handleZoomOut = () => {
    setScale((s) => {
      const next = Math.max(1, Number((s - 0.4).toFixed(1)));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((s) => Math.min(3.5, Number((s + 0.2).toFixed(1))));
    } else {
      setScale((s) => {
        const next = Math.max(1, Number((s - 0.2).toFixed(1)));
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Touch handlers (pan, pinch-to-zoom, swipe, double-tap)
  const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 fingers = pinch
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      pinchStartRef.current = { dist, scale };
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartRef.current) {
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      const factor = dist / pinchStartRef.current.dist;
      const newScale = Math.min(3.5, Math.max(1, Number((pinchStartRef.current.scale * factor).toFixed(2))));
      setScale(newScale);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    pinchStartRef.current = null;
    setIsDragging(false);

    if (e.changedTouches.length > 0 && touchStartRef.current) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const duration = Date.now() - touchStartRef.current.time;

      // Mobile double-tap to zoom toggle
      const now = Date.now();
      if (now - lastTapRef.current < 320 && Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
        if (scale > 1) {
          setScale(1);
          setPosition({ x: 0, y: 0 });
        } else {
          setScale(2.5);
        }
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      // Swipe navigation when at 1x
      if (scale === 1 && duration < 400 && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        if (deltaX < 0) {
          setCurrentIndex((prev) => (prev + 1) % angleImages.length);
        } else {
          setCurrentIndex((prev) => (prev - 1 + angleImages.length) % angleImages.length);
        }
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const currentImage = angleImages[currentIndex] || angleImages[0];

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-[#f4efeb]/95 backdrop-blur-md transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[70] flex flex-col justify-between select-none outline-none touch-none"
          aria-label="Full-Screen Saree Lightbox Theatre"
        >
          {/* Top Theatre Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#f4efeb] via-[#f4efeb]/90 to-transparent z-20">
            <div>
              <DialogPrimitive.Title className="font-serif text-lg sm:text-2xl font-bold text-[#4c0d17]">
                {productName}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Full-screen high-resolution inspection for {productName}
              </DialogPrimitive.Description>
              <p className="text-[10px] font-sans tracking-widest uppercase font-bold text-[#8a7a6b] mt-1">
                Angle {currentIndex + 1} of {angleImages.length}: {currentImage.label} ({currentImage.description})
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white border border-[#e5dfd3] rounded-sm p-1 shadow-sm text-[#4c0d17]">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-[#f4efeb] rounded-sm text-[#b08a47] cursor-pointer transition"
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-[#f4efeb] rounded-sm text-[#b08a47] cursor-pointer transition"
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 hover:bg-[#f4efeb] rounded-sm text-[#8a7a6b] hover:text-[#4c0d17] cursor-pointer transition"
                  title="Reset Zoom (0 / R)"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <span className="px-2 text-[11px] font-mono font-bold text-[#4c0d17]">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-sm bg-white border border-[#e5dfd3] text-[#8a7a6b] hover:text-[#4c0d17] hover:border-[#4c0d17] transition cursor-pointer shadow-sm"
                aria-label="Close Theatre View"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Viewport Canvas */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative flex-1 flex items-center justify-center overflow-hidden touch-none ${
              scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
          >
            <img
              src={currentImage.url}
              alt={currentImage.label}
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              className="max-h-[85vh] max-w-[85vw] object-contain pointer-events-none drop-shadow-lg"
            />

            {/* Navigation Arrows */}
            {angleImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev - 1 + angleImages.length) % angleImages.length);
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 border border-[#e5dfd3] text-[#4c0d17] flex items-center justify-center hover:border-[#b08a47] hover:bg-white transition cursor-pointer z-10 shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev + 1) % angleImages.length);
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 border border-[#e5dfd3] text-[#4c0d17] flex items-center justify-center hover:border-[#b08a47] hover:bg-white transition cursor-pointer z-10 shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="flex items-center justify-center gap-3 py-4 bg-gradient-to-t from-[#f4efeb] via-[#f4efeb]/90 to-transparent z-20">
            {angleImages.map((img, idx) => (
              <button
                key={`${img.angle}-${idx}`}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                }}
                aria-label={`View ${img.label}`}
                className={`h-16 w-16 rounded-sm overflow-hidden border-2 transition cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#b08a47] scale-110 shadow-md'
                    : 'border-[#e5dfd3] opacity-60 hover:opacity-100 hover:border-[#b08a47]/50'
                }`}
              >
                <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
