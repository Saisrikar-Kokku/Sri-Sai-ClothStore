import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Award } from 'lucide-react';
import { SareeProduct } from '@/types/product.types';

interface SareeSpecTabsProps {
  product: SareeProduct;
}

export const SareeSpecTabs: React.FC<SareeSpecTabsProps> = ({ product }) => {
  // Loom & interlock resolution
  const loomInterlock =
    product.weaveSpecs?.loomType ||
    (product.category === 'Kanchi Pattu'
      ? 'Pit Loom Korvai 3-Shuttle Interlock'
      : product.category === 'Banarasi Silk'
      ? 'Kadwa Jacquard Draw Loom Weave'
      : product.category === 'Organza'
      ? 'Ultra-Fine Slanted Handloom Weave'
      : 'Artisanal Handloom Interlock Weave');

  const threadCount = product.weaveSpecs?.threadCountWarpWeft || '120s Warp × 140s Weft Double Ply';
  const warpComp = product.weaveSpecs?.warpComposition || 'Pure Mulberry Cultivated Silk';
  const weftComp = product.weaveSpecs?.weftComposition || 'High-Twist Silk & Tested Zari Filaments';
  const interlockTech = product.weaveSpecs?.interlockTechnique || 'Hand-Interlocking Shuttle Technique';

  const weavingDays = product.weaveSpecs?.approxDaysOnLoom
    ? `${product.weaveSpecs.approxDaysOnLoom} Days on Loom`
    : product.category === 'Kanchi Pattu' || product.category === 'Banarasi Silk'
    ? '14 – 22 Days per Single Saree'
    : '8 – 14 Days per Saree';

  const weight = product.puritySpecs?.approxSareeWeightGrams
    ? `~${product.puritySpecs.approxSareeWeightGrams}g`
    : product.category === 'Kanchi Pattu' || product.category === 'Banarasi Silk'
    ? '~680g – 740g (Heavy Bridal Fall Class A)'
    : product.category === 'Organza'
    ? '~380g – 440g (Featherweight Gossamer Drape)'
    : '~520g – 600g (Festive Comfort Fall)';

  const zariRating =
    product.puritySpecs?.zariPurityRating ||
    (product.zariType.toLowerCase().includes('tested') || product.zariType.toLowerCase().includes('gold')
      ? 'Tested 2G Silver-Gilt Core with 24K Gold Flash'
      : 'Pure Metallic Resham & Electroplated Shimmer');

  const silkRegNumber = product.puritySpecs?.silkMarkRegNumber || `SM-IN-2024-${product.sku}`;
  const silkType = product.puritySpecs?.silkType || (product.isSilkMarkCertified ? '100% Pure Natural Mulberry Silk' : 'Handloom Certified Pure Silk');
  const zariGrade = product.puritySpecs?.zariGrade || product.zariType;

  const blouseType = product.stylingSpecs?.blouseType || (product.blouseDetails.toLowerCase().includes('contrast') ? 'Contrast' : 'Running');
  const blouseLength = product.stylingSpecs?.blouseLengthMeters ? `${product.stylingSpecs.blouseLengthMeters}m Cut Piece` : '0.8m Cut Piece';
  const sleeveBorder = product.stylingSpecs?.sleeveBorderWidthInches ? `${product.stylingSpecs.sleeveBorderWidthInches}" Zari Cuff Border` : '4.0" Zari Cuff Border';

  const necklines =
    product.stylingSpecs?.recommendedNecklines && product.stylingSpecs.recommendedNecklines.length > 0
      ? product.stylingSpecs.recommendedNecklines.join(' • ')
      : 'Deep Sweetheart, Royal Mandarin Collar, or Heritage U-Cut with Zari Sleeves';

  const jewelry =
    product.stylingSpecs?.recommendedJewelry && product.stylingSpecs.recommendedJewelry.length > 0
      ? product.stylingSpecs.recommendedJewelry.join(' • ')
      : 'Antique Kemp Vaddanam, Heritage Mango Mala & Temple Gold Jhumkas';

  const occasions =
    product.stylingSpecs?.auspiciousOccasions && product.stylingSpecs.auspiciousOccasions.length > 0
      ? product.stylingSpecs.auspiciousOccasions.join(', ')
      : 'Dasara Pooja, Vijayadashami Muhurtham, Festive Mandap & Weddings';

  return (
    <Tabs defaultValue="weave" className="w-full mt-6">
      <TabsList className="grid w-full grid-cols-3 !bg-[#e5dfd3]/50 p-1 rounded-sm border border-[#e5dfd3]">
        <TabsTrigger value="weave" className="data-[state=active]:!bg-none data-[state=active]:!bg-white data-[state=active]:!text-[#4c0d17] data-[state=active]:!shadow-sm data-[state=active]:!border-[#b08a47] !text-[#8a7a6b] uppercase tracking-wider text-[9px] sm:text-[10px] font-bold rounded-sm border border-transparent py-1.5 flex flex-col items-center">
          <span>Weave & Loom</span>
          <span className="text-[8px] font-serif text-[#b08a47] telugu-text normal-case font-normal -mt-0.5">మగ్గం & నేత</span>
        </TabsTrigger>
        <TabsTrigger value="purity" className="data-[state=active]:!bg-none data-[state=active]:!bg-white data-[state=active]:!text-[#4c0d17] data-[state=active]:!shadow-sm data-[state=active]:!border-[#b08a47] !text-[#8a7a6b] uppercase tracking-wider text-[9px] sm:text-[10px] font-bold rounded-sm border border-transparent py-1.5 flex flex-col items-center">
          <span>Fabric & Zari</span>
          <span className="text-[8px] font-serif text-[#b08a47] telugu-text normal-case font-normal -mt-0.5">పట్టు & జరీ</span>
        </TabsTrigger>
        <TabsTrigger value="styling" className="data-[state=active]:!bg-none data-[state=active]:!bg-white data-[state=active]:!text-[#4c0d17] data-[state=active]:!shadow-sm data-[state=active]:!border-[#b08a47] !text-[#8a7a6b] uppercase tracking-wider text-[9px] sm:text-[10px] font-bold rounded-sm border border-transparent py-1.5 flex flex-col items-center">
          <span>Blouse & Styling</span>
          <span className="text-[8px] font-serif text-[#b08a47] telugu-text normal-case font-normal -mt-0.5">బ్లౌజ్ డిజైన్</span>
        </TabsTrigger>
      </TabsList>

      {/* TAB 1: WEAVE & LOOM ARCHITECTURE */}
      <TabsContent value="weave" className="!bg-transparent !border-none !p-0 space-y-3 text-[11px] sm:text-[13px] mt-4">
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Hub Origin:</span>
          <span className="font-bold text-[#4c0d17] font-serif flex items-center gap-1">
            📍 {product.provenance}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Loom & Architecture:</span>
          <span className="font-bold text-[#b08a47] font-serif">{loomInterlock}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Interlock Technique:</span>
          <span className="font-medium text-[#4c0d17] font-serif text-right max-w-[60%] truncate">{interlockTech}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Warp & Weft Yarn:</span>
          <span className="font-medium text-[#4c0d17] font-serif text-right max-w-[65%] truncate">{warpComp} / {weftComp}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Thread Count Density:</span>
          <span className="font-mono text-[#4c0d17] font-bold">{threadCount}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Consignment SKU:</span>
          <span className="font-mono text-[#4c0d17] font-bold">{product.sku}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Artisan Weaving Time:</span>
          <span className="font-sans font-bold text-[#065f46] tracking-wider text-[11px] uppercase">{weavingDays}</span>
        </div>
        <p className="text-[#4c0d17] font-serif text-xs leading-relaxed pt-2">{product.description}</p>
      </TabsContent>

      {/* TAB 2: FABRIC & ZARI PURITY */}
      <TabsContent value="purity" className="!bg-transparent !border-none !p-0 space-y-3 text-[11px] sm:text-[13px] mt-4">
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Silk Certification:</span>
          <span className="font-bold font-serif text-[#065f46] flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            {product.isSilkMarkCertified ? 'Silk Mark Certified (100% Pure Natural Silk)' : 'Handloom Certified Pure Weave'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Silk Mark Reg. Code:</span>
          <span className="font-mono text-[#4c0d17] font-bold">{silkRegNumber}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Silk Classification:</span>
          <span className="font-bold font-serif text-[#4c0d17]">{silkType}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Zari Specification & Grade:</span>
          <span className="font-bold font-serif text-[#b08a47]">{zariGrade}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Fabric Composition:</span>
          <span className="font-bold font-serif text-[#4c0d17]">{product.fabric}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Net Saree Weight:</span>
          <span className="font-mono text-[#4c0d17] font-bold">{weight}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Zari Purity Assay:</span>
          <span className="font-mono text-[#b08a47] font-bold">{zariRating}</span>
        </div>
      </TabsContent>

      {/* TAB 3: BLOUSE & STYLING CONSULTATION */}
      <TabsContent value="styling" className="!bg-transparent !border-none !p-0 space-y-3 text-[11px] sm:text-[13px] mt-4">
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Included Blouse Piece:</span>
          <span className="font-bold font-serif text-[#065f46]">{product.blouseDetails}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Blouse Cut & Sleeve Border:</span>
          <span className="font-bold font-serif text-[#b08a47]">{blouseType} ({blouseLength} • {sleeveBorder})</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Recommended Neckline:</span>
          <span className="font-bold font-serif text-[#4c0d17]">{necklines}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[#e5dfd3]">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Jewelry Pairing:</span>
          <span className="font-bold font-serif text-[#b08a47]">{jewelry}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px]">Auspicious Occasion:</span>
          <span className="font-bold font-serif text-[#4c0d17]">{occasions}</span>
        </div>
      </TabsContent>
    </Tabs>
  );
};
