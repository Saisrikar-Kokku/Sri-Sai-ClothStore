import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SareeAngleImage } from '@/types/inspection.types';

interface MultiAngleGalleryProps {
  angleImages: SareeAngleImage[];
  selectedAngleIndex: number;
  onSelectAngle: (index: number) => void;
}

export const MultiAngleGallery: React.FC<MultiAngleGalleryProps> = ({
  angleImages,
  selectedAngleIndex,
  onSelectAngle,
}) => {
  const currentAngle = angleImages[selectedAngleIndex] || angleImages[0];
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handlePrev = () => {
    onSelectAngle((selectedAngleIndex - 1 + angleImages.length) % angleImages.length);
  };

  const handleNext = () => {
    onSelectAngle((selectedAngleIndex + 1) % angleImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current && e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div
      className="flex flex-col gap-2.5"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Angle Selector Tabs */}
      <div
        role="tablist"
        aria-label="Saree Inspection Angles"
        className="flex items-center justify-center gap-2 p-1 rounded-sm bg-[#f4efeb] border border-[#e5dfd3] overflow-x-auto scrollbar-none"
      >
        {angleImages.map((item, idx) => {
          const isSelected = selectedAngleIndex === idx;
          return (
            <button
              key={`${item.angle}-${idx}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`${item.label} (${item.hindiLabel}) angle`}
              onClick={() => onSelectAngle(idx)}
              className={`min-w-[75px] max-w-[120px] w-full flex flex-col items-center justify-center py-2 px-1 rounded-sm text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-[#4c0d17] border border-[#b08a47] shadow-sm'
                  : 'text-[#8a7a6b] hover:text-[#4c0d17] hover:bg-white/50 border border-transparent'
              }`}
            >
              <span className="text-[10px] font-bold tracking-widest uppercase truncate w-full">
                {item.label}
              </span>
              <span className="text-[11px] font-serif opacity-80 truncate w-full mt-0.5">
                {item.hindiLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Thumbnail Track with Angle Badges */}
      <div className="relative flex items-center mt-2">
        {angleImages.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute -left-3 z-10 h-8 w-8 rounded-full bg-white border border-[#e5dfd3] text-[#4c0d17] flex items-center justify-center hover:border-[#b08a47] transition cursor-pointer shadow-md"
            aria-label="Previous angle"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-3 overflow-x-auto px-2 py-1 w-full scrollbar-none justify-start sm:justify-center">
          {angleImages.map((item, idx) => {
            const isSelected = selectedAngleIndex === idx;
            return (
              <button
                key={`${item.angle}-${idx}`}
                type="button"
                onClick={() => onSelectAngle(idx)}
                aria-label={`View ${item.label}`}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#b08a47] scale-105 shadow-md'
                    : 'border-[#e5dfd3] opacity-70 hover:opacity-100 hover:border-[#b08a47]/50'
                }`}
              >
                <img src={item.url} alt={item.label} className="h-full w-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm text-[8px] text-center font-sans tracking-widest uppercase font-bold py-0.5 text-[#4c0d17]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {angleImages.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-3 z-10 h-8 w-8 rounded-full bg-white border border-[#e5dfd3] text-[#4c0d17] flex items-center justify-center hover:border-[#b08a47] transition cursor-pointer shadow-md"
            aria-label="Next angle"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Optical Description of Active Angle */}
      <div className="rounded-sm bg-transparent border border-[#e5dfd3] px-4 py-2.5 text-xs text-[#4c0d17] flex items-center gap-2 mt-2">
        <Sparkles className="h-3.5 w-3.5 text-[#b08a47] shrink-0" />
        <span className="italic font-serif">{currentAngle.description}</span>
      </div>
    </div>
  );
};
