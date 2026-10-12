import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SareeProduct } from '@/types/product.types';
import { ZoomLevel, getProductAngleImages } from '@/types/inspection.types';
import { FabricLoupeLens } from './modal/FabricLoupeLens';
import { MultiAngleGallery } from './modal/MultiAngleGallery';
import { FullScreenLightbox } from './modal/FullScreenLightbox';
import { SareeSpecTabs } from './modal/SareeSpecTabs';
import { PurityCertificateCard } from './modal/PurityCertificateCard';
import { ModalConversionBar } from './modal/ModalConversionBar';
import { Sparkles, ShieldCheck, Heart, Clock } from 'lucide-react';
import { getProductTeluguSubtitle } from '@/lib/teluguDictionary';

interface Props {
  product: SareeProduct | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: SareeProduct) => void;
  onOpenVideoConsult?: (product: SareeProduct) => void;
}

export const ProductQuickViewModal: React.FC<Props> = ({
  product,
  isOpen,
  onClose,
  isWishlisted = false,
  onToggleWishlist,
  onOpenVideoConsult,
}) => {
  const [selectedAngleIdx, setSelectedAngleIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(2.0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset state whenever modal opens or active product changes
  useEffect(() => {
    if (isOpen) {
      setSelectedAngleIdx(0);
      setZoomLevel(2.0);
      setIsLightboxOpen(false);
    }
  }, [isOpen, product?.id]);

  if (!product) return null;

  // Resolve 4 saree inspection angles
  const angleImages = getProductAngleImages(product);
  const currentAngle = angleImages[selectedAngleIdx] || angleImages[0];

  const handleNextAngle = () => {
    setSelectedAngleIdx((prev) => (prev + 1) % angleImages.length);
  };

  const handlePrevAngle = () => {
    setSelectedAngleIdx((prev) => (prev - 1 + angleImages.length) % angleImages.length);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="max-w-6xl w-full border-none bg-dasara-champagne p-4 sm:p-10 text-[#3d1118] rounded-t-2xl sm:rounded-none max-h-[94vh] overflow-y-auto shadow-2xl [&>button]:!text-[#8a7a6b] [&>button:hover]:!text-[#4c0d17] [&>button]:!top-4 sm:[&>button]:!top-6 [&>button]:!right-4 sm:[&>button]:!right-6">
          {/* Mobile Drag Indicator Bar */}
          <div className="w-12 h-1 bg-[#8a7a6b]/30 rounded-full mx-auto -mt-1 mb-3 block sm:hidden" />

          <div className="grid grid-cols-1 gap-6 lg:gap-12 lg:grid-cols-12">
            {/* ================= LEFT COLUMN: LOUPE & MULTI-ANGLE GALLERY (5 Cols) ================= */}
            <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {product.isDealerUnique ? (
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#4c0d17] px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-white shadow-sm">
                    <Sparkles className="h-3 w-3 text-[#b08a47]" /> 1-of-1 Exclusive • ప్రత్యేక డిజైన్
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-white px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-[#4c0d17] shadow-sm border border-[#e5dfd3]">
                    Masterweaver Handloom Lot
                  </span>
                )}

                {product.isSilkMarkCertified && (
                  <div className="inline-flex items-center gap-1.5 rounded-sm bg-[#065f46] px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-white shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5" /> Silk Mark Certified • సిల్క్ మార్క్
                  </div>
                )}
              </div>

              {/* 60/120 FPS Fabric Loupe Lens Box */}
              <FabricLoupeLens
                imageSrc={currentAngle.url}
                altText={`${product.name} - ${currentAngle.label}`}
                zoomLevel={zoomLevel}
                onZoomChange={setZoomLevel}
                onOpenLightbox={() => setIsLightboxOpen(true)}
                currentAngleLabel={currentAngle.label}
                onNextAngle={handleNextAngle}
                onPrevAngle={handlePrevAngle}
              />

              {/* 4-Angle Saree Gallery Carousel */}
              <MultiAngleGallery
                angleImages={angleImages}
                selectedAngleIndex={selectedAngleIdx}
                onSelectAngle={setSelectedAngleIdx}
              />
            </div>

            {/* ================= RIGHT COLUMN: METADATA, SPECS & CTAs (7 Cols) ================= */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <DialogHeader className="text-left space-y-2 sm:space-y-4">
                  {/* Category, SKU, Provenance & Wishlist button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5dfd3]/60 pb-3 sm:pb-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className="rounded-sm border border-[#b08a47]/40 bg-[#b08a47]/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] uppercase tracking-widest font-bold text-[#b08a47]">
                        {product.category}
                      </span>
                      <span className="text-[10px] sm:text-[11px] tracking-widest uppercase font-sans text-[#8a7a6b]">SKU: {product.sku}</span>
                      <span className="text-[10px] sm:text-[11px] tracking-widest uppercase font-sans text-[#8a7a6b] flex items-center gap-1"><span className="text-[#b08a47]">📍</span> {product.provenance}</span>
                    </div>

                    {/* Shortlist Toggle */}
                    {onToggleWishlist && (
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(product)}
                        className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold transition border cursor-pointer ${
                          isWishlisted
                            ? 'bg-[#4c0d17] text-white border-[#4c0d17] shadow-sm'
                            : 'bg-transparent text-[#4c0d17] border-[#4c0d17]/30 hover:border-[#4c0d17] hover:bg-[#4c0d17]/5'
                        }`}
                        aria-label={isWishlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                      >
                        <Heart
                          className={`h-3 w-3 ${
                            isWishlisted ? 'fill-white' : ''
                          }`}
                        />
                        <span>{isWishlisted ? 'Shortlisted' : 'Add to Shortlist'}</span>
                      </button>
                    )}
                  </div>

                  <DialogTitle className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#4c0d17] leading-tight pt-1">
                    {product.name}
                  </DialogTitle>
                  <span className="font-serif text-sm sm:text-base text-[#b08a47] font-medium telugu-text block">
                    {getProductTeluguSubtitle(product.category)}
                  </span>
                  <DialogDescription className="sr-only">
                    Comprehensive multi-angle fabric inspection, weave architecture, and Silk Mark purity specs for {product.name}
                  </DialogDescription>
                </DialogHeader>

                {/* Pricing Block */}
                <div className="mt-3 sm:mt-4 flex flex-wrap items-baseline gap-2 sm:gap-4 pb-3 sm:pb-4">
                  <span className="font-serif text-3xl sm:text-5xl font-bold text-[#b08a47]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base sm:text-lg font-sans tracking-widest text-[#8a7a6b] line-through decoration-[#4c0d17]/40">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="rounded-sm bg-[#4c0d17] text-white px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold shadow-sm">
                    {product.discountPercent}% OFF • Dasara Special
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#065f46] font-bold tracking-widest uppercase font-sans">
                    (You Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')})
                  </span>
                </div>

                {/* Stock Status Bar */}
                <div className="mt-2 flex items-center justify-between text-xs bg-white/50 rounded-sm px-3 sm:px-4 py-2.5 sm:py-3 border border-[#e5dfd3]">
                  <span className="text-[#8a7a6b] font-sans tracking-widest uppercase text-[10px] font-bold">Stock Available:</span>
                  <span className={`font-semibold flex items-center gap-1.5 font-sans tracking-wider text-[10px] sm:text-[11px] uppercase ${
                    product.stockCount === 0
                      ? 'text-red-700'
                      : product.stockCount === 1
                      ? 'text-[#b08a47]'
                      : 'text-[#065f46]'
                  }`}>
                    <Clock className="h-3.5 w-3.5" />
                    {product.stockCount === 0
                      ? 'Sold Out (స్టాక్ అయిపోయింది)'
                      : product.stockCount === 1
                      ? 'Single Piece (ఒక్కటే పీస్ - Exclusive)'
                      : `${product.stockCount} Pieces Available (అందుబాటులో ఉన్నాయి)`}
                  </span>
                </div>

                {/* Silk Mark & GI Authenticity Credential Card */}
                <div className="mt-3.5">
                  <PurityCertificateCard product={product} />
                </div>

                {/* Technical Saree Specification Tabs */}
                <SareeSpecTabs product={product} />
              </div>

              {/* High-Conversion Regional Commerce Bar */}
              <ModalConversionBar
                product={product}
                activeAngleLabel={currentAngle.label}
                activeImageUrl={currentAngle.url}
                onOpenVideoConsult={onOpenVideoConsult}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-Screen Theatre Lightbox Modal */}
      <FullScreenLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        angleImages={angleImages}
        initialIndex={selectedAngleIdx}
        productName={product.name}
      />
    </>
  );
};
