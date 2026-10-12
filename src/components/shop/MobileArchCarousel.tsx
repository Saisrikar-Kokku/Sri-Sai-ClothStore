import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SareeProduct } from '@/types/product.types';
import { HERO_ARCH_ITEMS } from '@/lib/teluguDictionary';

interface MobileArchCarouselProps {
  products: SareeProduct[];
  onProductSelect: (product: SareeProduct) => void;
}

export const MobileArchCarousel: React.FC<MobileArchCarouselProps> = ({
  products,
  onProductSelect,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const items = HERO_ARCH_ITEMS.map((item, idx) => ({
    ...item,
    product: products[idx] || products[0],
  }));

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentItem = items[activeIndex];

  return (
    <div 
      className="block md:hidden w-full px-4 relative z-10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mughal Arch Card Container */}
      <div className="relative max-w-sm mx-auto">
        <div
          onClick={() => currentItem.product && onProductSelect(currentItem.product)}
          className="relative w-full aspect-[2/3] group cursor-pointer overflow-hidden bg-[#4c0d17] shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-500"
          style={{
            clipPath: 'url(#mughal-arch)',
          }}
        >
          <img
            src={currentItem.image}
            alt={currentItem.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />

          {/* Gold Border SVG Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,100 L 0,25 C 5,25 10,20 20,15 C 30,10 40,5 50,0 C 60,5 70,10 80,15 C 90,20 95,25 100,25 L 100,100"
              fill="none"
              stroke="#b08a47"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Caption Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a070c] via-[#4c0d17]/50 to-transparent flex flex-col items-center justify-end pb-8 px-4 text-center">
            <span className="text-dasara-gold font-serif text-xl sm:text-2xl font-bold tracking-wider drop-shadow-md">
              {currentItem.name}
            </span>
            <span className="text-[#f9f5ec] font-serif text-sm font-medium mt-1 telugu-text drop-shadow">
              {currentItem.teluguName}
            </span>
            <span className="text-white/80 font-sans text-[10px] tracking-[0.2em] mt-2.5 border-b border-dasara-gold/40 pb-1 uppercase">
              {currentItem.subtitle} • {currentItem.teluguSubtitle}
            </span>

            {currentItem.product && (
              <div className="mt-3 flex items-center gap-2 bg-[#b08a47]/20 border border-[#b08a47]/50 rounded-full px-3 py-1">
                <Sparkles className="w-3 h-3 text-[#d2b471]" />
                <span className="text-white text-xs font-bold font-sans">
                  ₹ {currentItem.product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-dasara-gold text-[10px] font-serif telugu-text">
                  • వివరాలు చూడండి
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#4c0d17]/80 backdrop-blur-md border border-[#b08a47]/50 text-white flex items-center justify-center shadow-lg active:scale-90 transition z-20"
          aria-label="Previous Arch Saree"
        >
          <ChevronLeft className="w-6 h-6 text-dasara-gold" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#4c0d17]/80 backdrop-blur-md border border-[#b08a47]/50 text-white flex items-center justify-center shadow-lg active:scale-90 transition z-20"
          aria-label="Next Arch Saree"
        >
          <ChevronRight className="w-6 h-6 text-dasara-gold" />
        </button>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-2.5 mt-5">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === idx
                ? 'w-7 h-2 bg-dasara-gold'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
