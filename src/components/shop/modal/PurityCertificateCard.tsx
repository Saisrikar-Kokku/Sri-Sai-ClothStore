import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { SareeProduct } from '@/types/product.types';
import { WEAVING_GUILDS } from '@/data/guilds';

interface PurityCertificateCardProps {
  product: SareeProduct;
}

export const PurityCertificateCard: React.FC<PurityCertificateCardProps> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Match corresponding weaving guild for GI tag
  const matchedGuild = WEAVING_GUILDS.find((g) =>
    product.provenance.toLowerCase().includes(g.name.toLowerCase()) ||
    product.category.toLowerCase().includes(g.name.toLowerCase())
  );

  const regCode = product.puritySpecs?.silkMarkRegNumber || `SM-IN-2024-${product.sku}`;
  const hasOfficialGiTag = Boolean(matchedGuild?.giTagNumber);
  const giDisplay = hasOfficialGiTag
    ? `${matchedGuild!.giTagNumber} (${matchedGuild!.giTagYear})`
    : 'Ministry of Textiles Cluster Weave';

  return (
    <div className="relative overflow-hidden rounded-sm border border-[#b08a47]/30 bg-[#f4efeb] p-4 shadow-sm">
      {/* Subtle gold sheen background decoration */}
      <div className="absolute top-0 right-0 h-28 w-28 bg-[radial-gradient(circle_at_top_right,rgba(176,138,71,0.08),transparent_70%)] pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white border border-[#065f46]/20 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-[#065f46]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-bold text-[#4c0d17]">
                {hasOfficialGiTag ? 'Silk Mark India & GI Tag Certified' : 'Silk Mark India & Cluster Certified'}
              </span>
              <span className="rounded-sm bg-[#065f46] px-1.5 py-0.5 text-[9px] font-sans tracking-widest uppercase font-bold text-white shadow-sm">
                VERIFIED
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#8a7a6b] font-sans mt-0.5">
              Reg: {regCode} • {giDisplay}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-sm bg-white px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-[#b08a47] transition border border-[#e5dfd3] cursor-pointer hover:border-[#b08a47] shadow-sm"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Less' : 'Verify'}</span>
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Trust Highlights Checklist */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] font-sans text-[#4c0d17] font-medium">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#065f46] shrink-0" />
          <span className="truncate">100% Pure Natural Silk</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#065f46] shrink-0" />
          <span className="truncate">Tested Metallic Zari Core</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#065f46] shrink-0" />
          <span className="truncate">Handloom Artisan Lineage</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#065f46] shrink-0" />
          <span className="truncate">{hasOfficialGiTag ? 'Govt. GI Cluster Origin' : 'Artisan Cluster Origin'}</span>
        </div>
      </div>

      {/* Expandable Verification Details */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-[#e5dfd3] space-y-3 animate-fadeIn">
          <div className="p-3 rounded-sm bg-white/60 border border-[#e5dfd3] space-y-1.5 font-mono text-[10px] tracking-wide">
            <div className="flex justify-between">
              <span className="text-[#8a7a6b] uppercase font-sans">Assay Authority:</span>
              <span className="text-[#065f46] font-bold">Silk Mark Organisation of India (SMOI)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a7a6b] uppercase font-sans">Geographical Origin:</span>
              <span className="text-[#4c0d17] font-bold">{product.provenance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a7a6b] uppercase font-sans">Zari Purity Grade:</span>
              <span className="text-[#b08a47] font-bold">{product.zariType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a7a6b] uppercase font-sans">Lot Authenticity:</span>
              <span className="text-[#4c0d17] font-bold">Consignment SKU #{product.sku}</span>
            </div>
          </div>
          <p className="text-[11px] text-[#8a7a6b] leading-relaxed italic font-serif">
            Every bridal and festive consignment piece is inspected by our senior master appraisers in Bangalore. Delivered with our hologram security seal and authenticated Silk Mark certificate tag.
          </p>
        </div>
      )}
    </div>
  );
};
