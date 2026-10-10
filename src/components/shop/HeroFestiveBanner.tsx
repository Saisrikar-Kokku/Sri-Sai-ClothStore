import React, { useState } from 'react';
import { 
  MapPin, 
  Sparkles, 
  ZoomIn, 
  X, 
  ChevronDown, 
  Copy, 
  Check, 
  ShoppingBag, 
  MessageCircle,
  Store,
  Tag,
  ShieldCheck,
  Clock,
  Navigation
} from 'lucide-react';

import { STORE_CONFIG, buildWhatsAppUrl } from '@/lib/whatsapp';

interface HeroFestiveBannerProps {
  onExploreCatalog?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const HeroFestiveBanner: React.FC<HeroFestiveBannerProps> = ({ 
  onExploreCatalog,
  onSelectCategory 
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const bannerImagePath = '/images/sri_sai_dasara_banner.jpg';

  const handleCopyVoucher = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('DASARA500');
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2200);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message =
      'Namaste Sri Sai ClothStore! 🙏 I saw your official Dasara Specials banner (Mahadevpur Near Pathangadi Bazaar) and would like to inquire about your new festive arrivals!';
    window.open(buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message), '_blank');
  };

  const handleOpenMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(STORE_CONFIG.googleMapsUrl, '_blank');
  };

  const scrollToCatalog = () => {
    if (onExploreCatalog) {
      onExploreCatalog();
    } else {
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const flyerCategories = [
    { label: 'Sarees', sub: 'Mysore Silk & Pattu' },
    { label: 'Blouse Pieces', sub: 'All Designs' },
    { label: 'Half Sarees', sub: 'Trendy & Traditional' },
    { label: 'Kids Wear', sub: 'Little Fashion' },
    { label: 'Fancy & Ethnic', sub: 'Stylish Wear' },
    { label: 'Daily Wear', sub: 'Comfort Everyday' },
    { label: 'Cosmetics', sub: 'Branded & Affordable' },
    { label: 'Bangles & Jewellery', sub: 'Earrings & Sets' },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[#e5dfd3] bg-[#f9f5ec]">
      {/* 1. Ambient Blurred Backdrop Glow matching authentic banner colors */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110 pointer-events-none transform -translate-y-6"
        style={{ backgroundImage: `url(${bannerImagePath})` }}
      />
      <div className="absolute inset-0 bg-radial-gradient from-[#b08a47]/10 via-transparent to-transparent pointer-events-none" />

      {/* 2. Top Header Ribbon - Snug wrap with the sticky navbar above */}
      <div className="relative z-10 border-b border-[#e5dfd3] bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#4c0d17] font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-serif font-bold text-[#4c0d17] tracking-wide">
              Sri Sai Cloth Store Flagship
            </span>
            <span className="text-[#8a7a6b]/70">•</span>
            <span className="text-[#4c0d17]/80">Mahadevpur, Near Pathangadi Bazaar</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="rounded-full bg-[#f9f5ec] border border-[#e5dfd3] px-3 py-0.5 font-bold text-[#4c0d17] shadow-sm">
              ✨ Dasara Specials Ready to Sale!
            </span>
            <span className="hidden md:inline text-[#8a7a6b]">
              Special Offers & Attractive Festival Discounts
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Showcase Wrapper - Dual Column on Desktop, Seamless Stack on Mobile */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Framed Authentic Boutique Flyer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group w-full max-w-[320px] sm:max-w-sm lg:max-w-[360px] transition-all duration-300">
              
              {/* Luminous Gold Halo Aura */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#4c0d17]/30 via-[#b08a47]/30 to-[#4c0d17]/30 opacity-70 blur-xl group-hover:opacity-100 transition duration-500" />

              {/* Framed Flyer Card */}
              <div 
                onClick={() => setIsZoomOpen(true)}
                className="relative rounded-2xl overflow-hidden border-2 border-[#e5dfd3] bg-white shadow-2xl shadow-[#4c0d17]/10 cursor-pointer select-none group"
                title="Click to view full-resolution official flyer"
              >
                {/* Gold Top Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-dasara-gold to-transparent z-20" />

                {/* Authentic Flyer Image */}
                <img
                  src={bannerImagePath}
                  alt="Sri Sai Cloth Store - Official Dasara Specials Festival Arrivals Flyer"
                  className="w-full h-auto max-h-[480px] lg:max-h-[510px] object-contain mx-auto block transition-transform duration-500 group-hover:scale-[1.015]"
                  loading="eager"
                />

                {/* Interactive Zoom Hover Pill */}
                <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-white/90 hover:bg-[#4c0d17] border border-[#e5dfd3] px-3.5 py-1.5 text-xs font-semibold text-[#4c0d17] backdrop-blur-md shadow-xl transition-all duration-200"
                  >
                    <ZoomIn className="h-3.5 w-3.5 text-[#b08a47]" />
                    <span>Click to Enlarge Official Flyer</span>
                  </button>
                </div>
              </div>

              {/* Address Micro-Bar beneath poster */}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#8a7a6b]">
                <MapPin className="h-3.5 w-3.5 text-white shrink-0" />
                <span>Sri Sai Cloth Store | Mahadevpur Near Pathangadi Bazaar</span>
              </div>
            </div>
          </div>

          {/* Right Column: Boutique Welcome, Highlights & Direct Action Controls */}
          <div className="lg:col-span-7 space-y-3.5">
            
            {/* Header Title & Tagline matching the flyer */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f9f5ec] border border-[#e5dfd3] px-4 py-1 text-xs font-semibold text-[#4c0d17] shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-[#b08a47] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Celebrate Festivals with Tradition & Grace</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#4c0d17] tracking-tight leading-[1.15]">
                Sri Sai Cloth Store <br />
                <span className="text-[#b08a47] font-serif italic text-2xl sm:text-3xl lg:text-4xl font-normal">
                  Tradition • Style • For Every You
                </span>
              </h1>

              <p className="text-[#4c0d17]/80 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
                Your one-stop boutique for all women's festive needs! Fresh <strong className="text-[#4c0d17]">Dasara Specials & Festival Arrivals</strong> have arrived directly from artisan weaver hubs. Ready to sale at direct wholesale & reasonable prices in Mahadevpur.
              </p>
            </div>

            {/* Flyer Categories Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#8a7a6b]">
                <span className="font-serif font-bold text-[#4c0d17] uppercase tracking-wider text-[11px]">
                  ✨ Available Festival Collections
                </span>
                <span className="text-[10px] text-[#8a7a6b]/70">All Colours & Falls Available</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {flyerCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat.label);
                      scrollToCatalog();
                    }}
                    className="flex flex-col rounded-xl bg-white hover:bg-[#f9f5ec] border border-[#e5dfd3] hover:border-[#b08a47]/50 p-2.5 cursor-pointer transition shadow-sm group"
                  >
                    <span className="text-xs font-bold text-[#4c0d17] group-hover:text-[#b08a47] transition">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-[#8a7a6b]">
                      {cat.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              {/* Explore Collection Button */}
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4c0d17] border border-[#4c0d17] px-5 py-3 text-sm font-bold text-white shadow-xl shadow-[#4c0d17]/20 hover:brightness-110 transition cursor-pointer w-full sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4 text-[#b08a47]" />
                <span>Explore Saree Collection</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Direct WhatsApp Concierge */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#065f46]/10 hover:bg-[#065f46]/20 border border-[#065f46]/20 px-4 py-3 text-sm font-semibold text-[#065f46] transition cursor-pointer shadow-md w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4 text-[#065f46]" />
                <span>WhatsApp Store Inquiry</span>
              </button>

              {/* Directions Button */}
              <button
                type="button"
                onClick={handleOpenMaps}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#f9f5ec] border border-[#e5dfd3] px-4 py-3 text-sm font-semibold text-[#4c0d17] transition cursor-pointer shadow-md w-full sm:w-auto"
              >
                <Navigation className="h-4 w-4 text-[#b08a47]" />
                <span>Mahadevpur Location</span>
              </button>
            </div>

            {/* In-Store Coupon & Assurances Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Coupon Box */}
              <div className="flex items-center justify-between rounded-xl bg-white border border-[#e5dfd3] p-3 shadow-md">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8a7a6b]/70 block">
                    In-Store Voucher Pass
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-[#4c0d17] tracking-widest">
                      DASARA500
                    </span>
                    <span className="text-[10px] text-[#b08a47] font-semibold">
                      (₹500 OFF)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVoucher}
                  className="flex items-center gap-1 rounded-lg bg-[#4c0d17] px-2.5 py-1.5 text-xs font-semibold text-[#4c0d17] hover:bg-[#4c0d17]/80 transition cursor-pointer"
                >
                  {copiedVoucher ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#065f46]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Boutique Hours & Trial */}
              <div className="flex items-center gap-2.5 rounded-xl bg-white border border-[#e5dfd3] p-3 shadow-md">
                <Clock className="h-4 w-4 text-white shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#4c0d17] block">Daily Festive Hours</span>
                  <span className="text-[#8a7a6b] text-[11px]">10:00 AM – 9:30 PM (All 10 Days)</span>
                </div>
              </div>
            </div>

            {/* Key Value Badges matching the flyer's footer */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-[11px] text-[#4c0d17]/80">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#065f46]/20 px-3 py-1.5 text-[#065f46] font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Best Quality Products</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#e5dfd3] px-3 py-1.5 text-[#4c0d17] font-medium">
                <Store className="h-3.5 w-3.5 text-[#b08a47]" />
                <span>Special Navaratri Sarees</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#b08a47]/20 px-3 py-1.5 text-[#b08a47] font-medium">
                <Tag className="h-3.5 w-3.5" />
                <span>Wholesale & Reasonable Prices</span>
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Fullscreen High-Resolution Lightbox Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md p-2 sm:p-6"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 border border-[#e5dfd3] text-[#4c0d17] hover:text-[#b08a47] hover:scale-105 transition shadow-2xl cursor-pointer"
            aria-label="Close flyer preview"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Content */}
          <div 
            className="relative max-w-2xl max-h-[92vh] w-full flex flex-col items-center overflow-auto rounded-2xl border-2 border-[#e5dfd3] bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={bannerImagePath}
              alt="Sri Sai Cloth Store Dasara Specials High-Resolution Flyer"
              className="w-full h-auto object-contain rounded-xl"
            />

            {/* Modal Bottom Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-b-xl border-t border-[#e5dfd3] text-xs">
              <div className="flex items-center gap-2 text-[#4c0d17] font-serif">
                <Store className="h-4 w-4 text-[#b08a47]" />
                <span>Sri Sai Cloth Store • Mahadevpur Near Pathangadi Bazaar</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#4c0d17] font-semibold px-3 py-1.5 text-xs transition"
                >
                  WhatsApp Inquiries
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="rounded-lg bg-[#e5dfd3] hover:bg-[#e5dfd3] text-[#4c0d17]/80 px-3 py-1.5 text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
