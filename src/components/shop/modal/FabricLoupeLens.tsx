import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ZoomIn, Maximize2, Sparkles } from 'lucide-react';
import { ZoomLevel } from '@/types/inspection.types';

interface FabricLoupeLensProps {
  imageSrc: string;
  altText: string;
  zoomLevel: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
  onOpenLightbox: () => void;
  currentAngleLabel?: string;
  onNextAngle?: () => void;
  onPrevAngle?: () => void;
}

export const FabricLoupeLens: React.FC<FabricLoupeLensProps> = ({
  imageSrc,
  altText,
  zoomLevel,
  onZoomChange,
  onOpenLightbox,
  currentAngleLabel,
  onNextAngle,
  onPrevAngle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const rafId = useRef<number | null>(null);

  // Optical coordinates tracking
  const lastPosRef = useRef<{ clientX: number; clientY: number; isTouch: boolean } | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  const updateLoupePosition = useCallback(
    (clientX: number, clientY: number, isTouch = false) => {
      if (!containerRef.current || !lensRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      lastPosRef.current = { clientX, clientY, isTouch };

      // Relative inspected pixel point within image container
      const inspectX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const inspectY = Math.max(0, Math.min(rect.height, clientY - rect.top));

      // Lens physical dimensions (h-44 w-44 = 176px x 176px)
      const lensDiameter = 176;
      const lensRadius = lensDiameter / 2;

      // Position of lens center
      let lensCenterX = inspectX;
      // On mobile touch, offset upward so finger does not obscure magnified view
      let lensCenterY = isTouch ? inspectY - 75 : inspectY;

      // Clamp lens center inside image container with 4px padding so lens ring stays intact
      lensCenterX = Math.max(lensRadius + 4, Math.min(rect.width - lensRadius - 4, lensCenterX));
      lensCenterY = Math.max(lensRadius + 4, Math.min(rect.height - lensRadius - 4, lensCenterY));

      // Optical magnification math:
      // The virtual background image is sized to container * zoomLevel
      const bgWidth = rect.width * zoomLevel;
      const bgHeight = rect.height * zoomLevel;

      // Center the exact inspected point under the lens crosshair
      const bgPosX = lensRadius - inspectX * zoomLevel;
      const bgPosY = lensRadius - inspectY * zoomLevel;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (lensRef.current) {
          lensRef.current.style.transform = `translate3d(${lensCenterX}px, ${lensCenterY}px, 0) translate(-50%, -50%)`;
          lensRef.current.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
          lensRef.current.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
        }
      });
    },
    [zoomLevel]
  );

  // Instant optical recalibration when zoomLevel changes while active
  useEffect(() => {
    if (lastPosRef.current && (isActive || isTouchActive)) {
      updateLoupePosition(
        lastPosRef.current.clientX,
        lastPosRef.current.clientY,
        lastPosRef.current.isTouch
      );
    }
  }, [zoomLevel, updateLoupePosition, isActive, isTouchActive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateLoupePosition(e.clientX, e.clientY, false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      setIsTouchActive(true);
      updateLoupePosition(touch.clientX, touch.clientY, true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateLoupePosition(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsTouchActive(false);

    if (touchStartRef.current && e.changedTouches.length > 0) {
      const endTouch = e.changedTouches[0];
      const deltaX = endTouch.clientX - touchStartRef.current.x;
      const deltaY = endTouch.clientY - touchStartRef.current.y;
      const duration = Date.now() - touchStartRef.current.time;

      // Mobile double-tap detection for Theatre View
      const now = Date.now();
      if (now - lastTapRef.current < 320 && Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
        onOpenLightbox();
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      // Horizontal swipe gesture to cycle angles
      if (duration < 400 && Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        if (deltaX < 0) {
          onNextAngle?.();
        } else {
          onPrevAngle?.();
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="relative flex flex-col gap-2">
      {/* Primary Image Box */}
      <div
        ref={containerRef}
        onMouseEnter={(e) => {
          setIsActive(true);
          updateLoupePosition(e.clientX, e.clientY, false);
        }}
        onMouseLeave={() => {
          setIsActive(false);
          lastPosRef.current = null;
        }}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onDoubleClick={onOpenLightbox}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-[#e5dfd3] bg-[#f4efeb] cursor-crosshair select-none group shadow-sm touch-none"
      >
        <img
          src={imageSrc}
          alt={altText}
          className="h-full w-full object-cover transition-opacity duration-200 pointer-events-none"
        />

        {/* Current Angle Badge if available */}
        {currentAngleLabel && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="rounded-sm bg-[#4c0d17] px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-white shadow-md">
              {currentAngleLabel}
            </span>
          </div>
        )}

        {/* Ref-Based Circular Magnification Loupe Lens */}
        <div
          ref={lensRef}
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundRepeat: 'no-repeat',
            opacity: isActive || isTouchActive ? 1 : 0,
            pointerEvents: 'none',
          }}
          className="absolute h-44 w-44 rounded-full border border-[#b08a47] shadow-[0_0_20px_rgba(76,13,23,0.15),0_10px_25px_rgba(0,0,0,0.1)] ring-4 ring-[#f4efeb] z-30 overflow-hidden transition-opacity duration-150 will-change-transform"
        >
          {/* Crosshair Target Centering Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-4 w-4 rounded-full border border-[#4c0d17]/50 flex items-center justify-center shadow-sm">
              <div className="h-1 w-1 rounded-full bg-[#4c0d17]" />
            </div>
          </div>

          <div className="absolute bottom-2.5 inset-x-0 text-center pointer-events-none">
            <span className="rounded-sm bg-white/95 px-2.5 py-1 text-[9px] font-sans tracking-widest uppercase font-bold text-[#4c0d17] border border-[#e5dfd3] shadow-sm">
              {zoomLevel}x Macro Lens
            </span>
          </div>
        </div>

        {/* Full-Screen Theatre Lightbox Trigger */}
        <button
          type="button"
          onClick={onOpenLightbox}
          className="absolute top-4 right-4 flex items-center gap-2 rounded-sm bg-[#4c0d17] hover:bg-[#4c0d17]/90 px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-white shadow-md transition hover:scale-105 cursor-pointer z-20"
          aria-label="Open Full-Screen Theatre View"
        >
          <Maximize2 className="h-3.5 w-3.5 text-[#b08a47]" />
          <span className="hidden sm:inline">Theatre View</span>
        </button>

        {/* Instruction Pill (hidden during active inspection) */}
        {!isActive && !isTouchActive && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-sm bg-white/95 backdrop-blur-sm border border-[#e5dfd3] px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-[#4c0d17] shadow-sm pointer-events-none transition-opacity">
            <ZoomIn className="h-3.5 w-3.5 text-[#b08a47]" />
            <span>Hover / Hold for {zoomLevel}x Macro Weave Inspection</span>
          </div>
        )}
      </div>

      {/* Optical Zoom Multiplier Bar */}
      <div className="flex items-center justify-between px-1 text-xs mt-1">
        <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px] flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#b08a47]" /> Inspection Magnification:
        </span>
        <div className="flex items-center gap-1.5 bg-transparent rounded-sm">
          {([2.0, 3.0, 4.5] as ZoomLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onZoomChange(level)}
              className={`px-3 py-1 rounded-sm text-[10px] tracking-widest font-mono font-bold transition border cursor-pointer ${
                zoomLevel === level
                  ? 'bg-white text-[#4c0d17] border-[#e5dfd3] shadow-sm'
                  : 'text-[#8a7a6b] hover:text-[#4c0d17] border-transparent hover:bg-white/50'
              }`}
            >
              {level}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
