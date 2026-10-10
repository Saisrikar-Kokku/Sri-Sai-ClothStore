import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, MessageCircle, Navigation, Copy, Check, Clock, ShieldCheck, Store, Tag } from 'lucide-react';

interface FestivalCollectionsProps {
  onExploreCatalog?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const FestivalCollections: React.FC<FestivalCollectionsProps> = ({
  onExploreCatalog,
  onSelectCategory,
}) => {
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const categories = [
    { label: 'Sarees', telugu: 'చీరలు', sub: 'Mysore Silk & Pattu • పట్టు చీరలు' },
    { label: 'Blouse Pieces', telugu: 'బ్లౌజ్ పీసులు', sub: 'All Designs • డిజైనర్ పీసులు' },
    { label: 'Half Sarees', telugu: 'లంగా వోణీలు', sub: 'Trendy & Traditional • సంప్రదాయం' },
    { label: 'Kids Wear', telugu: 'పిల్లల దుస్తులు', sub: 'Little Fashion • పండుగ దుస్తులు' },
    { label: 'Fancy & Ethnic', telugu: 'ఫ్యాన్సీ చీరలు', sub: 'Stylish Wear • ఆధునిక డిజైన్లు' },
    { label: 'Daily Wear', telugu: 'డైలీ వేర్', sub: 'Comfort Everyday • రోజూ కట్టుకునేవి' },
    { label: 'Cosmetics', telugu: 'కాస్మెటిక్స్', sub: 'Branded & Affordable • అలంకరణ' },
    { label: 'Bangles & Jewellery', telugu: 'గాజులు & నగలు', sub: 'Earrings & Sets • మ్యాచ్ సెట్స్' },
  ];

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText('DASARA500');
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
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

  return (
    <section className="bg-[#f9f5ec] py-12 px-4 sm:px-8 border-b border-[#e5dfd3] relative z-10">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5dfd3] pb-4">
          <h2 className="font-serif font-bold text-[#b08a47] uppercase tracking-wider text-sm sm:text-base flex items-center gap-2">
            <span>✨ Available Festival Collections</span>
            <span className="font-serif text-xs normal-case tracking-normal text-[#4c0d17] font-medium telugu-text hidden sm:inline">• పండుగ ప్రత్యేక కలెక్షన్స్</span>
          </h2>
          <span className="text-xs text-[#8a7a6b] font-sans">
            అన్ని రంగులు, ఫాల్స్ లభించును • All Colours & Falls Available
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.label);
                scrollToCatalog();
              }}
              className="flex flex-col rounded-xl bg-white border border-[#e5dfd3] hover:border-[#b08a47] hover:shadow-md hover:shadow-[#b08a47]/10 p-4 cursor-pointer transition-all duration-300 group"
            >
              <div className="flex items-baseline justify-between gap-1">
                <span className="font-serif font-bold text-[#4c0d17] text-base group-hover:text-[#b08a47] transition-colors">
                  {cat.label}
                </span>
                <span className="text-xs font-serif text-[#b08a47] tracking-normal telugu-text">
                  {cat.telugu}
                </span>
              </div>
              <span className="text-[11px] text-[#8a7a6b] mt-1 font-sans">
                {cat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
          {/* Explore Collection Button */}
          <button
            type="button"
            onClick={scrollToCatalog}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4c0d17] border border-[#4c0d17] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#4c0d17]/20 hover:bg-[#3d1118] transition-all cursor-pointer w-full sm:w-auto flex-1 sm:flex-none"
          >
            <ShoppingBag className="h-4 w-4 text-[#b08a47]" />
            <span>Explore Collection • చీరలు చూడండి</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* WhatsApp Inquiry Button */}
          <button
            type="button"
            onClick={() => window.open('https://wa.me/91XXXXXXXXXX', '_blank')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#065f46]/5 border border-[#065f46]/30 px-6 py-4 text-sm font-semibold text-[#065f46] shadow-sm transition-all cursor-pointer w-full sm:w-auto"
          >
            <MessageCircle className="h-4 w-4 text-[#065f46]" />
            <span>WhatsApp Store Inquiry • వాట్సాప్ విచారణ</span>
          </button>

          {/* Location Button */}
          <button
            type="button"
            onClick={() => window.open('https://maps.google.com', '_blank')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#f9f5ec] border border-[#b08a47]/40 px-6 py-4 text-sm font-semibold text-[#4c0d17] shadow-sm transition-all cursor-pointer w-full sm:w-auto"
          >
            <Navigation className="h-4 w-4 text-[#b08a47]" />
            <span>Mahadevpur Store • లొకేషన్ రూట్</span>
          </button>
        </div>

        {/* Bottom Info Section (Voucher & Hours) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voucher Box */}
          <div className="flex items-center justify-between rounded-xl bg-white border border-[#e5dfd3] p-5 shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8a7a6b] block mb-1">
                In-Store Voucher Pass • స్టోర్ వోచర్
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl font-black text-[#4c0d17] tracking-wider">
                  DASARA500
                </span>
                <span className="text-xs text-[#065f46] font-bold bg-[#065f46]/10 px-2 py-0.5 rounded-full">
                  (₹500 OFF)
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyVoucher}
              className="flex items-center gap-1.5 rounded-lg bg-[#4c0d17] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d1118] transition-colors cursor-pointer shadow-md shadow-[#4c0d17]/20"
            >
              {copiedVoucher ? (
                <>
                  <Check className="h-4 w-4 text-[#b08a47]" />
                  <span>Copied! (కాపీ అయింది)</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#b08a47]" />
                  <span>Copy (కాపీ)</span>
                </>
              )}
            </button>
          </div>

          {/* Hours Box */}
          <div className="flex items-center gap-4 rounded-xl bg-white border border-[#e5dfd3] p-5 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-[#f9f5ec] flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-[#b08a47]" />
            </div>
            <div>
              <span className="font-serif font-bold text-[#4c0d17] text-lg block">Daily Festive Hours • సమయం</span>
              <span className="text-[#8a7a6b] text-sm font-sans mt-0.5 block">10:00 AM – 9:30 PM (రోజూ తెరిచి ఉంటుంది)</span>
            </div>
          </div>
        </div>

        {/* Assurances Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#065f46]/5 border border-[#065f46]/20 px-3.5 py-2 text-[#065f46] font-semibold text-xs shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Best Quality Products • స్వచ్ఛమైన నాణ్యత</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#b08a47]/10 border border-[#b08a47]/30 px-3.5 py-2 text-[#4c0d17] font-bold text-xs shadow-sm">
            <Store className="h-4 w-4 text-[#b08a47]" />
            <span>Special Navaratri Sarees • దసరా ప్రత్యేక చీరలు</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#4c0d17]/5 border border-[#4c0d17]/20 px-3.5 py-2 text-[#4c0d17] font-semibold text-xs shadow-sm">
            <Tag className="h-4 w-4 text-[#4c0d17]" />
            <span>Wholesale & Reasonable Prices • హోల్‌సేల్ ధరలు</span>
          </span>
        </div>

      </div>
    </section>
  );
};
