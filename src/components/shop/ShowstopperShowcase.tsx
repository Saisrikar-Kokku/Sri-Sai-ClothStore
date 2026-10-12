import React, { useState } from 'react';
import { SareeProduct } from '@/types/product.types';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import { BorderBeam } from '@/components/reactbits/BorderBeam';
import { Sparkles, Video, Eye, ShieldCheck, MapPin, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWhatsAppVideoConsultUrl } from '@/lib/whatsapp';

interface Props {
  showstoppers: SareeProduct[];
  onQuickView: (product: SareeProduct) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (product: SareeProduct) => void;
  onOpenVideoConsult?: (product: SareeProduct) => void;
}

const ShowstopperCard: React.FC<{
  saree: SareeProduct;
  onQuickView: (product: SareeProduct) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: SareeProduct) => void;
  onOpenVideoConsult?: (product: SareeProduct) => void;
}> = ({ saree, onQuickView, isWishlisted: externalIsWishlisted, onToggleWishlist, onOpenVideoConsult }) => {
  const [internalWishlisted, setInternalWishlisted] = useState(false);
  const isWishlisted = externalIsWishlisted !== undefined ? externalIsWishlisted : internalWishlisted;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalIsWishlisted === undefined) {
      setInternalWishlisted((prev) => !prev);
    }
    onToggleWishlist?.(saree);
  };

  return (
    <TiltedCard
      maxTilt={10}
      scale={1.035}
      perspective={1100}
      glareOpacity={0.28}
      className="h-full"
    >
      <div className="relative flex flex-col h-full rounded-2xl bg-gradient-to-b from-[#1E141B] to-[#120D11] border border-dasara-gold/40 shadow-2xl overflow-hidden group">
        {/* Continuous Luminous Temple Gold Ray BorderBeams */}
        <BorderBeam
          size={220}
          duration={6}
          borderWidth={1.5}
          colorFrom="#FFE58F"
          colorTo="#D4AF37"
          className="opacity-90"
        />
        <BorderBeam
          size={220}
          duration={6}
          delay={3}
          borderWidth={1.5}
          colorFrom="#D4AF37"
          colorTo="#B8860B"
          className="opacity-80"
        />

        {/* 1. Saree Image Frame */}
        <div
          onClick={() => onQuickView(saree)}
          className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 cursor-pointer select-none"
        >
          {/* Base Saree Image */}
          <img
            src={saree.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
            alt={saree.name}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />

          {/* Dual-Angle Image Hover Peek (Pallu / Zari Detail) */}
          {saree.images[1] && (
            <img
              src={saree.images[1]}
              alt={`${saree.name} - Pallu & Zari Detail`}
              className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              loading="lazy"
            />
          )}

          {/* Ambient Lighting Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120D11] via-transparent to-black/40 opacity-80 group-hover:opacity-45 transition-opacity duration-300 pointer-events-none" />

          {/* Minimalist Floating 3D Badges */}
          <div
            className="absolute top-3 left-3 right-3 flex justify-between items-center z-20"
            style={{ transform: 'translateZ(36px)' }}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full backdrop-blur-md bg-black/45 border border-dasara-gold/40 px-2.5 py-1 text-[11px] font-semibold text-dasara-goldLight shadow-lg pointer-events-none">
              <Sparkles className="h-3 w-3 text-dasara-gold shrink-0" />
              <span>Single Piece • ఒక్కటే పీస్</span>
            </div>

            <button
              type="button"
              onClick={handleHeartClick}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className={cn(
                'group/heart relative flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer pointer-events-auto',
                'bg-black/40 border border-white/10 hover:border-dasara-gold/50 hover:bg-black/60',
                'active:scale-75 hover:scale-110',
                isWishlisted && 'border-rose-500/40 bg-black/70 text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
              )}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all duration-300',
                  isWishlisted
                    ? 'fill-rose-500 text-rose-500 scale-110'
                    : 'text-zinc-300 group-hover/heart:text-white'
                )}
              />
            </button>
          </div>

          {/* Pallu Peek Badge on Hover */}
          {saree.images[1] && (
            <div className="absolute top-12 right-3 pointer-events-none opacity-0 group-hover:opacity-95 transition-opacity duration-300 z-10">
              <span className="rounded-full backdrop-blur-md bg-black/60 border border-white/10 px-2 py-0.5 text-[9px] font-mono tracking-wider text-dasara-goldLight">
                PALLU VIEW
              </span>
            </div>
          )}

          {/* Bottom Translucent Badges */}
          <div
            className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs z-20 pointer-events-none"
            style={{ transform: 'translateZ(24px)' }}
          >
            {saree.provenance ? (
              <span className="inline-flex items-center gap-1.5 rounded-full backdrop-blur-md bg-black/45 border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-300 font-normal">
                <MapPin className="h-2.5 w-2.5 text-dasara-gold shrink-0" />
                <span>{saree.provenance.split(',')[0]}</span>
              </span>
            ) : null}

            {saree.isSilkMarkCertified && (
              <span className="inline-flex items-center gap-1 rounded-full backdrop-blur-md bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-300 shadow-md">
                <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Silk Mark</span>
              </span>
            )}
          </div>

            {/* Sleek "View Saree" Overlay Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-30">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(saree);
              }}
              style={{ transform: 'translateZ(42px)' }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-dasara-gold via-dasara-goldLight to-dasara-gold px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_25px_rgba(212,175,55,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(247,231,169,0.7)] active:scale-95 cursor-pointer"
            >
              <Eye className="h-4 w-4 text-zinc-950" />
              <span className="tracking-wide">View Saree • చూడండి</span>
            </button>
          </div>
        </div>

        {/* 2. Saree Information */}
        <div
          className="flex flex-1 flex-col justify-between p-4 space-y-3"
          style={{ transform: 'translateZ(26px)' }}
        >
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1 font-mono">
              <span className="text-zinc-500">{saree.sku}</span>
              <span className="text-amber-400 font-sans font-semibold text-[11px] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-dasara-gold" />
                Only 1 in stock
              </span>
            </div>
            <h3
              onClick={() => onQuickView(saree)}
              className="cursor-pointer font-serif text-base font-bold text-dasara-champagne leading-snug line-clamp-1 group-hover:text-dasara-gold transition-colors"
              title={saree.name}
            >
              {saree.name}
            </h3>
            {[saree.fabric, saree.zariType].filter(Boolean).length > 0 && (
              <p className="mt-1 text-xs text-zinc-400 line-clamp-1 font-sans font-light">
                {[saree.fabric, saree.zariType].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>

          {/* 3. Pricing & Sleek Action CTAs */}
          <div className="pt-3 border-t border-zinc-800">
            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif text-2xl font-bold text-dasara-gold tracking-tight">
                  ₹{saree.price.toLocaleString('en-IN')}
                </span>
                {saree.originalPrice > saree.price && (
                  <span className="text-xs text-zinc-500 line-through font-sans">
                    ₹{saree.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {saree.discountPercent > 0 && (
                <span className="rounded-full bg-dasara-maroon/35 border border-dasara-gold/25 px-2 py-0.5 text-[10px] font-semibold text-dasara-goldLight tracking-wider">
                  -{saree.discountPercent}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onQuickView(saree)}
                className="w-full inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-dasara-gold/50 hover:bg-dasara-gold/[0.08] hover:text-dasara-gold active:scale-[0.98] cursor-pointer"
              >
                Details • వివరాలు
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onOpenVideoConsult) {
                    onOpenVideoConsult(saree);
                  } else {
                    window.open(getWhatsAppVideoConsultUrl(saree), '_blank');
                  }
                }}
                className="group/vip w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/35 bg-gradient-to-r from-emerald-950 via-[#0e3b2e] to-emerald-950 px-3 py-2 text-xs font-semibold text-emerald-300 shadow-lg shadow-emerald-950/70 transition-all duration-200 hover:border-dasara-gold/70 hover:from-emerald-900 hover:to-emerald-800 hover:text-dasara-goldLight hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-[0.98] cursor-pointer"
              >
                <Video className="h-3.5 w-3.5 text-emerald-400 group-hover/vip:text-dasara-gold transition-colors" />
                <span className="tracking-wide">Video Call • వీడియో కాల్</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TiltedCard>
  );
};

export const ShowstopperShowcase: React.FC<Props> = ({
  showstoppers,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  onOpenVideoConsult,
}) => {
  if (!showstoppers || showstoppers.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-dasara-gold/40 bg-gradient-to-br from-[#1C0F17] via-[#120B10] to-[#0E0C0F] p-6 sm:p-10 shadow-2xl">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-dasara-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-dasara-maroon/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-dasara-gold/20 pb-6 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-dasara-maroon/90 border border-dasara-gold/40 px-3.5 py-1 text-xs font-semibold text-dasara-goldLight shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-dasara-gold" />
            <span>ప్రత్యేక చీరలు • Special Single Pieces</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Unique Pieces Available{' '}
            <span className="block sm:inline text-dasara-gold font-sans text-base sm:text-xl font-normal">
              (ఒక్కటే పీస్ - Single Piece Only)
            </span>
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
            ఈ చీరలలో ప్రతి డిజైన్ ఒక్కటే పీస్ ఉంటుంది. ఒకరు కొంటే మళ్లీ అదే డిజైన్ దొరకదు.
            <span className="block text-zinc-400 text-xs mt-0.5">
              Only 1 piece available for each design. Once booked, this exact saree cannot be re-ordered.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300 font-mono bg-black/60 border border-dasara-gold/30 px-3.5 py-2 rounded-xl backdrop-blur-md self-start md:self-auto">
          <Sparkles className="h-3.5 w-3.5 text-dasara-gold animate-pulse" />
          <span>{showstoppers.length} Unique Pieces Available</span>
        </div>
      </div>

      {/* Grid of Showstoppers with 3D Tilt & Continuous Border Beam */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {showstoppers.map((saree) => (
          <ShowstopperCard
            key={saree.id}
            saree={saree}
            onQuickView={onQuickView}
            isWishlisted={wishlistIds?.includes(saree.id)}
            onToggleWishlist={onToggleWishlist}
            onOpenVideoConsult={onOpenVideoConsult}
          />
        ))}
      </div>
    </section>
  );
};
