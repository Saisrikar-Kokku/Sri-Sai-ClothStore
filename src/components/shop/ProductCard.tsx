import React, { useState } from 'react';
import { SareeProduct } from '@/types/product.types';
import { Heart, Video } from 'lucide-react';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

interface Props {
  product: SareeProduct;
  onQuickView: (product: SareeProduct) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: SareeProduct) => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  onQuickView,
  isWishlisted: externalIsWishlisted,
  onToggleWishlist,
}) => {
  const [internalWishlisted, setInternalWishlisted] = useState(false);
  const isWishlisted = externalIsWishlisted !== undefined ? externalIsWishlisted : internalWishlisted;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalIsWishlisted === undefined) {
      setInternalWishlisted((prev) => !prev);
    }
    onToggleWishlist?.(product);
  };

  return (
    <div className="text-left group flex flex-col h-full bg-transparent">
      {/* Seamless Borderless Image with strict aspect ratio lock */}
      <div
        onClick={() => onQuickView(product)}
        className="w-full relative pb-[133%] bg-transparent overflow-hidden mb-6 cursor-pointer rounded-t-sm"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Dual-Angle Hover Image Cross-Fade */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} - Alternate View`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />
        )}
      </div>

      {/* Product Details with Strict Heights for Perfect Alignment */}
      <div className="flex flex-col flex-grow px-1">
        {/* Badges / Scarcity - locked min-height */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[22px]">
          {product.isSilkMarkCertified && (
            <span className="text-[9px] font-sans tracking-widest text-[#b08a47] uppercase border border-[#b08a47]/40 px-2 py-0.5 rounded-sm flex items-center gap-1.5">
              Silk Mark <span className="opacity-40">|</span> <span className="font-serif tracking-normal">సిల్క్ మార్క్</span>
            </span>
          )}
          {product.stockCount === 1 && (
            <span className="text-[9px] font-sans tracking-widest text-[#4c0d17] uppercase border border-[#4c0d17]/20 px-2 py-0.5 rounded-sm bg-[#4c0d17]/5 flex items-center gap-1.5">
              1-of-1 Unique <span className="opacity-40">|</span> <span className="font-serif tracking-normal">ఒక్కటే పీస్</span>
            </span>
          )}
        </div>

        <div className="pr-4 mb-4 flex-grow">
          <h4
            onClick={() => onQuickView(product)}
            className="font-serif text-lg text-[#4c0d17] leading-snug group-hover:text-dasara-gold transition-colors line-clamp-2 min-h-[52px] cursor-pointer"
          >
            {product.name}
          </h4>
          <p className="font-sans text-[10px] tracking-[0.15em] text-[#8a7a6b] mt-3 uppercase line-clamp-1">
            {product.fabric} • {product.zariType}
          </p>
          <p className="font-serif italic text-xs text-[#b08a47] mt-1 line-clamp-1">
            {product.provenance}
          </p>
        </div>

        <div className="mt-auto pt-5 border-t border-[#e5dfd3]/50">
          <div className="flex justify-between items-end mb-4">
            <div className="min-h-[44px] flex flex-col justify-end">
              {product.discountPercent > 0 ? (
                <>
                  <span className="font-sans text-[10px] text-[#8a7a6b] line-through decoration-[#4c0d17]/50 tracking-wider">
                    ₹ {product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="font-serif text-[#4c0d17] text-lg font-bold leading-none mt-1">
                    ₹ {product.price.toLocaleString('en-IN')}
                  </span>
                </>
              ) : (
                <span className="font-serif text-[#4c0d17] text-lg font-bold leading-none mt-1">
                  ₹ {product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <button
              onClick={handleHeartClick}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                isWishlisted
                  ? 'bg-[#4c0d17] text-white hover:bg-[#4c0d17]/90'
                  : 'bg-[#b08a47]/10 text-dasara-gold hover:bg-dasara-gold hover:text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex flex-col items-center justify-center rounded-xl bg-[#4c0d17] border border-[#4c0d17] py-2 transition-all hover:bg-[#3d1118] group shadow-sm cursor-pointer"
            >
              <span className="text-[#f9f5ec] text-[11px] font-sans font-semibold tracking-wide flex items-center gap-1.5">
                Details <span className="h-1.5 w-1.5 rounded-full bg-[#b08a47] group-hover:bg-[#d2b471]"></span>
              </span>
              <span className="text-[#f9f5ec]/70 text-[10px] font-serif mt-0.5 group-hover:text-[#f9f5ec]">
                వివరాలు
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(getWhatsAppOrderUrl(product), '_blank');
              }}
              className="flex flex-col items-center justify-center rounded-xl bg-transparent border border-[#b08a47]/50 py-2 transition-all hover:bg-[#b08a47]/10 group shadow-sm cursor-pointer"
            >
              <span className="text-[#4c0d17] text-[11px] font-sans font-semibold tracking-wide flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 -ml-1 text-[#b08a47]" /> Video Call <span className="h-1.5 w-1.5 rounded-full bg-[#4c0d17]"></span>
              </span>
              <span className="text-[#4c0d17]/80 text-[10px] font-serif mt-0.5 group-hover:text-[#4c0d17]">
                వీడియో కాల్
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
