import React, { useState } from 'react';
import { SareeProduct } from '@/types/product.types';
import { Plus, Heart, Video, ArrowRight } from 'lucide-react';
import { DISPLAY_CATEGORIES } from '@/App';
import { getProductTeluguSubtitle } from '@/lib/teluguDictionary';

interface CatalogExplorerProps {
  products: SareeProduct[];
  onProductSelect: (product: SareeProduct) => void;
  toggleWishlist: (product: SareeProduct) => void;
  handleOpenVideoConsult: (product: SareeProduct) => void;
  wishlistIds?: string[];
}

export const CatalogExplorer: React.FC<CatalogExplorerProps> = ({
  products,
  onProductSelect,
  toggleWishlist,
  handleOpenVideoConsult,
  wishlistIds = [],
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Category Tabs List
  const tabs = [
    { id: 'All', name: 'All Collections', teluguName: 'అన్నీ' },
    ...DISPLAY_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      teluguName: c.teluguName,
    })),
  ];

  // Helper to get products for a specific category
  const getCategoryProducts = (catId: string, limit = 8) => {
    return products.filter((p) => p.category === catId && p.isPublished !== false).slice(0, limit);
  };

  return (
    <section id="catalog-section" className="bg-[#f9f5ec] py-12 sm:py-20 px-3 sm:px-8 max-w-[1400px] mx-auto">
      
      {/* 1. SECTION HEADER */}
      <div className="text-center mb-10 sm:mb-14">
        {/* Decorative Filigree Line */}
        <div className="flex items-center justify-center gap-4 text-[#b08a47] mb-4 sm:mb-5 opacity-75">
          <div className="w-12 sm:w-16 h-px bg-[#b08a47]/60" />
          <span className="text-sm sm:text-base text-[#b08a47]">♦</span>
          <div className="w-12 sm:w-16 h-px bg-[#b08a47]/60" />
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#551a24] uppercase mb-2 sm:mb-4">
          FEATURED COLLECTION
        </h2>
        
        <p className="font-serif text-[#b08a47] text-sm sm:text-base tracking-normal font-medium mb-2 telugu-text">
          సంప్రదాయ చేనేత పట్టు చీరల ప్రత్యేక కలెక్షన్
        </p>

        <p className="text-[#8a7a6b] font-sans text-[10px] sm:text-xs tracking-[0.2em] uppercase">
          Timeless Elegance &nbsp;&bull;&nbsp; Traditional Craftsmanship &nbsp;&bull;&nbsp; Modern You
        </p>
      </div>

      {/* 2. CATEGORY SWITCHER TABS (Horizontal Swipe on Mobile, Centered Wrap on Desktop) */}
      <div className="flex items-center sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-3 sm:pb-0 mb-8 sm:mb-16 px-2 sm:flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`snap-center flex-shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-sans tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-[#4c0d17] text-[#f9f5ec] font-bold shadow-[#4c0d17]/25 ring-1 ring-[#4c0d17]'
                  : 'bg-white/90 text-[#551a24] border border-[#e5dfd3] hover:border-[#b08a47] hover:bg-[#f9f5ec]'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`text-[10px] tracking-normal font-serif telugu-text ${isActive ? 'text-[#d2b471]' : 'text-[#b08a47]'}`}>
                ({tab.teluguName})
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. PRODUCT SHOWCASE */}
      {activeCategory === 'All' ? (
        // SEPARATE BY CATEGORY SECTIONS (Exact User Design)
        <div className="space-y-16 sm:space-y-24">
          {DISPLAY_CATEGORIES.map((cat) => {
            const categoryProducts = getCategoryProducts(cat.id, 8);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-6 sm:space-y-8">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e5dfd3] pb-3 sm:pb-4 gap-2">
                  <div className="text-left">
                    <div className="flex items-baseline gap-2 sm:gap-3">
                      <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#4c0d17]">
                        {cat.name}
                      </h3>
                      <span className="font-serif text-sm sm:text-base text-[#b08a47] tracking-normal telugu-text">
                        {cat.teluguName}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] sm:text-xs tracking-[0.15em] text-[#8a7a6b] mt-1 uppercase">
                      {cat.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className="text-[11px] sm:text-xs font-sans tracking-widest text-[#b08a47] uppercase hover:text-[#4c0d17] transition-colors flex items-center gap-1.5 group cursor-pointer self-start sm:self-auto"
                  >
                    <span>View Category • మొత్తం చూడండి ({categoryProducts.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 2-Column on Mobile, 4-Column on Desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 gap-y-8 sm:gap-y-14">
                  {categoryProducts.map((saree) => (
                    <ProductItemCard
                      key={saree.id}
                      product={saree}
                      onProductSelect={onProductSelect}
                      toggleWishlist={toggleWishlist}
                      handleOpenVideoConsult={handleOpenVideoConsult}
                      isWishlisted={wishlistIds.includes(saree.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // FILTERED CATEGORY VIEW (2-column on mobile, 4-column on desktop)
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e5dfd3] pb-4 gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4c0d17]">
                  {tabs.find((t) => t.id === activeCategory)?.name}
                </h3>
                <span className="font-serif text-base text-[#b08a47] telugu-text">
                  {tabs.find((t) => t.id === activeCategory)?.teluguName}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8a7a6b] font-sans tracking-widest uppercase mt-1">
                Showing {products.filter((p) => p.category === activeCategory).length} Handcrafted Pieces • చేనేత చీరలు
              </p>
            </div>
            <button
              onClick={() => setActiveCategory('All')}
              className="text-xs font-sans tracking-widest text-[#b08a47] uppercase hover:text-[#4c0d17] transition-colors self-start sm:self-auto cursor-pointer"
            >
              ← Back to All Collections • అన్ని కలెక్షన్లు
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 gap-y-8 sm:gap-y-14">
            {products
              .filter((p) => p.category === activeCategory && p.isPublished !== false)
              .map((saree) => (
                <ProductItemCard
                  key={saree.id}
                  product={saree}
                  onProductSelect={onProductSelect}
                  toggleWishlist={toggleWishlist}
                  handleOpenVideoConsult={handleOpenVideoConsult}
                  isWishlisted={wishlistIds.includes(saree.id)}
                />
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

// Saree Card Component: 2-column mobile optimized with authentic Telugu typography
interface ProductItemCardProps {
  product: SareeProduct;
  onProductSelect: (p: SareeProduct) => void;
  toggleWishlist: (p: SareeProduct) => void;
  handleOpenVideoConsult: (p: SareeProduct) => void;
  isWishlisted: boolean;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  product,
  onProductSelect,
  toggleWishlist,
  handleOpenVideoConsult,
  isWishlisted,
}) => {
  return (
    <div
      onClick={() => onProductSelect(product)}
      className="group flex flex-col text-left cursor-pointer transition-all duration-300"
    >
      {/* 1. BORDERLESS PRODUCT IMAGE (4:5 Aspect Ratio) */}
      <div className="relative w-full aspect-[4/5] bg-white/60 overflow-hidden mb-2.5 sm:mb-4 shadow-[0_4px_20px_rgba(76,13,23,0.04)] group-hover:shadow-[0_8px_30px_rgba(76,13,23,0.12)] transition-shadow duration-500 rounded-sm">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10 pointer-events-none">
          {product.isSilkMarkCertified && (
            <span className="bg-white/95 backdrop-blur-sm border border-[#b08a47]/30 text-[#b08a47] text-[8px] sm:text-[9px] font-sans font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-sm shadow-sm uppercase">
              సిల్క్ మార్క్
            </span>
          )}
          {product.stockCount === 1 && (
            <span className="bg-[#4c0d17]/90 backdrop-blur-sm text-[#f9f5ec] text-[8px] sm:text-[9px] font-sans font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-sm shadow-sm uppercase">
              ప్రత్యేకం
            </span>
          )}
        </div>

        {/* Quick Heart Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer z-20 active:scale-90 ${
            isWishlisted
              ? 'bg-[#4c0d17] text-white'
              : 'bg-white/90 text-[#8a7a6b] hover:text-[#4c0d17] hover:bg-white'
          }`}
          aria-label="Wishlist saree"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* 2. PRODUCT DETAILS & GOLD PLUS BUTTON ROW */}
      <div className="flex justify-between items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="space-y-0.5 min-w-0 flex-1">
          <h4 className="font-serif text-xs sm:text-base font-bold text-[#4c0d17] group-hover:text-[#b08a47] transition-colors leading-snug line-clamp-1 sm:line-clamp-2">
            {product.name}
          </h4>
          <span className="text-[10px] sm:text-xs text-[#b08a47] font-serif telugu-text line-clamp-1 block leading-tight font-medium">
            {getProductTeluguSubtitle(product.category)}
          </span>
          <div className="flex items-baseline gap-1.5 sm:gap-2 pt-0.5">
            <span className="font-serif text-xs sm:text-base font-bold text-[#4c0d17]">
              ₹ {product.price.toLocaleString('en-IN')}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-[10px] sm:text-xs text-[#8a7a6b] line-through font-sans">
                ₹ {product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Golden Round Plus Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#b08a47] hover:bg-[#9c783c] active:scale-95 text-white flex items-center justify-center flex-shrink-0 transition-transform duration-300 shadow-sm cursor-pointer mt-0.5"
          title="Add to Inquiry Bag • బ్యాగ్‌కు జోడించండి"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
        </button>
      </div>

      {/* 3. BILINGUAL MICRO ACTIONS (Details & Video Call) */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-[#e5dfd3]/60">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onProductSelect(product);
          }}
          className="flex flex-col items-center justify-center rounded-md sm:rounded-lg bg-white border border-[#e5dfd3] py-1 sm:py-1.5 hover:border-[#b08a47] hover:bg-[#f9f5ec] active:bg-[#f9f5ec] transition-all cursor-pointer group/btn"
        >
          <span className="text-[10px] sm:text-[11px] font-sans font-bold text-[#4c0d17] tracking-wider uppercase group-hover/btn:text-[#b08a47]">
            Details
          </span>
          <span className="text-[8px] sm:text-[9px] font-serif text-[#8a7a6b] telugu-text -mt-0.5">
            వివరాలు
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenVideoConsult(product);
          }}
          className="flex flex-col items-center justify-center rounded-md sm:rounded-lg bg-white border border-[#065f46]/30 py-1 sm:py-1.5 hover:bg-[#065f46]/5 hover:border-[#065f46] active:bg-[#065f46]/10 transition-all cursor-pointer group/vid"
        >
          <span className="text-[10px] sm:text-[11px] font-sans font-bold text-[#065f46] tracking-wider uppercase flex items-center gap-1">
            <Video className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#065f46]" /> Video
          </span>
          <span className="text-[8px] sm:text-[9px] font-serif text-[#065f46]/80 telugu-text -mt-0.5">
            వీడియో కాల్
          </span>
        </button>
      </div>
    </div>
  );
};
