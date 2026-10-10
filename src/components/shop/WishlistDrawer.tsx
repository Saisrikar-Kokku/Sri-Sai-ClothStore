import React, { useState } from 'react';
import { SareeProduct } from '@/types/product.types';
import {
  X,
  Heart,
  MessageCircle,
  Eye,
  Trash2,
  Columns3,
  List,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppOrderUrl, getWhatsAppShortlistUrl } from '@/lib/whatsapp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wishlist: SareeProduct[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  onQuickView: (product: SareeProduct) => void;
  compareIds: string[];
  onToggleCompare: (product: SareeProduct) => void;
  onOpenInquiryBag?: () => void;
}

export const WishlistDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  wishlist,
  onRemove,
  onClear,
  onQuickView,
  compareIds,
  onToggleCompare,
  onOpenInquiryBag,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'compare'>('list');

  if (!isOpen) return null;

  const totalValue = wishlist.reduce((acc, p) => acc + p.price, 0);
  const totalSavings = wishlist.reduce((acc, p) => acc + (p.originalPrice - p.price), 0);

  const comparedProducts =
    compareIds.length > 0
      ? wishlist.filter((p) => compareIds.includes(p.id))
      : wishlist.slice(0, 3);

  const canCompare = wishlist.length >= 2;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6">
        <div
          className={`w-screen ${
            viewMode === 'compare' ? 'max-w-4xl' : 'max-w-md sm:max-w-lg'
          } bg-[#f9f5ec] border-l border-[#b08a47]/30 shadow-2xl flex flex-col justify-between transition-all duration-300`}
        >
          
          {/* 1. Header */}
          <div className="p-4 sm:p-5 border-b border-[#e5dfd3] bg-white/50 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#4c0d17]/5 border border-[#4c0d17]/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-[#4c0d17] fill-[#4c0d17]" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#4c0d17] flex items-center gap-2">
                    Festive Shortlist
                    <span className="rounded-full bg-[#b08a47]/10 text-[#b08a47] border border-[#b08a47]/30 px-2 py-0.5 text-xs font-mono font-bold">
                      {wishlist.length}
                    </span>
                  </h2>
                  <p className="text-[11px] text-[#8a7a6b] font-sans">
                    Handpicked sarees saved for consultation & trials
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close shortlist"
                className="rounded-xl border border-[#e5dfd3] bg-white p-2 text-[#8a7a6b] hover:text-[#4c0d17] hover:border-[#b08a47]/40 hover:bg-[#b08a47]/5 transition cursor-pointer shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            {canCompare && (
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#e5dfd3]/80">
                <span className="text-[10px] text-[#8a7a6b] font-bold uppercase tracking-widest">Display Mode:</span>
                <div className="flex items-center p-1 rounded-xl bg-white border border-[#e5dfd3] shadow-sm text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-[#4c0d17] text-[#f9f5ec] font-semibold shadow-sm'
                        : 'text-[#8a7a6b] hover:text-[#4c0d17]'
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('compare')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'compare'
                        ? 'bg-[#4c0d17] text-[#f9f5ec] font-semibold shadow-sm'
                        : 'text-[#8a7a6b] hover:text-[#4c0d17]'
                    }`}
                  >
                    <Columns3 className="h-3.5 w-3.5" />
                    <span>Compare (2-3)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin scrollbar-thumb-[#e5dfd3] scrollbar-track-transparent">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="h-16 w-16 rounded-full bg-white border border-[#b08a47]/30 shadow-sm flex items-center justify-center">
                  <Heart className="h-8 w-8 text-[#b08a47]/60" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#4c0d17]">Your Shortlist is Empty</h3>
                  <p className="text-xs text-[#8a7a6b] font-sans max-w-xs leading-relaxed">
                    Click the heart icon on any saree in our Dasara collection to save it here for side-by-side comparison or direct WhatsApp booking.
                  </p>
                </div>
                <Button
                  onClick={onClose}
                  className="mt-3 text-xs bg-[#b08a47] hover:bg-[#9a773a] text-white rounded-xl shadow-md cursor-pointer"
                >
                  Explore Collection
                </Button>
              </div>
            ) : viewMode === 'compare' && canCompare ? (
              /* ================= COMPARE MODE ================= */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] text-[#8a7a6b] font-bold uppercase tracking-widest">
                  <span>Comparing {comparedProducts.length} Shortlisted Sarees</span>
                  <span className="text-[#b08a47]">Side-by-side Specs</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {comparedProducts.map((p) => {
                    const isSelected = compareIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`rounded-2xl border ${
                          isSelected ? 'border-[#b08a47] bg-[#b08a47]/5 shadow-md ring-1 ring-[#b08a47]/20' : 'border-[#e5dfd3] bg-white shadow-sm'
                        } p-3 flex flex-col justify-between space-y-3 transition`}
                      >

                        {/* Image & Header */}
                        <div>
                          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#e5dfd3]">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                            {p.isSilkMarkCertified && (
                              <span className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-[#b08a47] border border-[#b08a47]/30">
                                Silk Mark
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => onRemove(p.id)}
                              className="absolute top-2 right-2 rounded-full bg-white/90 backdrop-blur-md p-1.5 text-[#8a7a6b] hover:text-[#4c0d17] border border-[#e5dfd3] shadow-sm cursor-pointer transition"
                              title="Remove from shortlist"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>

                          <h4 className="mt-3 font-serif text-xs font-bold text-[#4c0d17] line-clamp-2 leading-snug">
                            {p.name}
                          </h4>
                          <span className="text-[10px] text-[#8a7a6b] font-mono">{p.sku}</span>
                        </div>

                        {/* Specs comparison */}
                        <div className="space-y-2.5 text-[11px] border-t border-[#e5dfd3] pt-3">
                          <div>
                            <span className="text-[#8a7a6b] block text-[9px] uppercase tracking-wider font-bold mb-0.5">Price:</span>
                            <span className="font-sans text-sm font-bold text-[#4c0d17]">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-[#8a7a6b] line-through ml-1.5">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#8a7a6b] block text-[9px] uppercase tracking-wider font-bold mb-0.5">Fabric:</span>
                            <span className="text-[#4c0d17] font-medium font-serif text-xs">{p.fabric}</span>
                          </div>

                          <div>
                            <span className="text-[#8a7a6b] block text-[9px] uppercase tracking-wider font-bold mb-0.5">Zari:</span>
                            <span className="text-[#b08a47] font-medium font-serif text-xs">{p.zariType}</span>
                          </div>

                          <div>
                            <span className="text-[#8a7a6b] block text-[9px] uppercase tracking-wider font-bold mb-0.5">Loom / Origin:</span>
                            <span className="text-[#4c0d17] font-serif text-xs">{p.provenance}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-2 pt-3 border-t border-[#e5dfd3]">
                          <Button
                            onClick={() => window.open(getWhatsAppOrderUrl(p), '_blank')}
                            className="w-full text-xs py-2 bg-[#065f46] hover:bg-[#044030] text-white rounded-xl shadow-sm cursor-pointer"
                          >
                            <MessageCircle className="h-3 w-3 mr-1.5 text-[#b08a47]" />
                            Book Piece
                          </Button>
                          <Button
                            onClick={() => onQuickView(p)}
                            className="w-full text-[11px] py-1.5 border border-[#e5dfd3] bg-white text-[#4c0d17] hover:border-[#b08a47]/40 hover:bg-[#b08a47]/5 rounded-xl cursor-pointer"
                          >
                            <Eye className="h-3 w-3 mr-1.5 text-[#b08a47]" />
                            Loupe Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ================= LIST MODE ================= */
              <div className="space-y-3">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-2xl border border-[#e5dfd3] bg-white p-3 transition-all hover:border-[#b08a47]/40 shadow-sm"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => onQuickView(item)}
                      className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-[#e5dfd3] cursor-pointer group"
                    >
                      <img
                        src={item.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#4c0d17]/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Information */}
                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4
                            onClick={() => onQuickView(item)}
                            className="font-serif text-sm font-bold text-[#4c0d17] line-clamp-2 hover:text-[#b08a47] cursor-pointer leading-snug"
                          >
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="text-[#8a7a6b] hover:text-[#4c0d17] p-1.5 transition cursor-pointer bg-[#f9f5ec] rounded-full hover:bg-[#e5dfd3]/50 shrink-0"
                            title="Remove"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-[#8a7a6b] font-mono mt-1">
                          <span>{item.sku}</span>
                          <span>•</span>
                          <span className="text-[#b08a47] font-bold">{item.provenance.split(',')[0]}</span>
                        </div>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="font-sans text-sm sm:text-base font-bold text-[#4c0d17]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-[#8a7a6b] line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#e5dfd3]/60 mt-3">
                        {canCompare && (
                          <button
                            type="button"
                            onClick={() => onToggleCompare(item)}
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
                              compareIds.includes(item.id)
                                ? 'bg-[#b08a47]/10 text-[#b08a47] border-[#b08a47]/40 shadow-sm'
                                : 'border-[#e5dfd3] bg-white text-[#8a7a6b] hover:border-[#b08a47]/40 hover:text-[#4c0d17]'
                            }`}
                          >
                            {compareIds.includes(item.id) ? '✓ Compare' : '+ Compare'}
                          </button>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                          <Button
                            onClick={() => onQuickView(item)}
                            className="text-[11px] py-1.5 px-3 h-8 border border-[#e5dfd3] bg-white text-[#4c0d17] hover:border-[#b08a47]/40 hover:bg-[#b08a47]/5 rounded-lg shadow-sm cursor-pointer"
                          >
                            <Eye className="h-3 w-3 mr-1 text-[#b08a47]" />
                            Loupe
                          </Button>
                          <Button
                            onClick={() => window.open(getWhatsAppOrderUrl(item), '_blank')}
                            className="text-[11px] py-1.5 px-3 h-8 bg-[#065f46] hover:bg-[#044030] text-white rounded-lg shadow-sm cursor-pointer"
                          >
                            <MessageCircle className="h-3 w-3 mr-1 text-[#b08a47]" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Footer Summary */}
          {wishlist.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#b08a47]/30 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] space-y-4">
              {/* Financial summary */}
              <div className="space-y-1.5 text-xs bg-[#f9f5ec] p-3 rounded-xl border border-[#e5dfd3]">
                <div className="flex justify-between text-[#8a7a6b] font-bold uppercase tracking-wider text-[10px]">
                  <span>Shortlist Total ({wishlist.length} Sarees):</span>
                  <span className="font-sans text-sm font-bold text-[#4c0d17] tracking-normal">
                    ₹{totalValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#065f46] font-bold uppercase tracking-wider text-[10px]">
                  <span>Total Dasara Savings:</span>
                  <span className="font-mono tracking-normal">Save ₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {onOpenInquiryBag && (
                  <Button
                    onClick={() => {
                      onOpenInquiryBag();
                      onClose();
                    }}
                    className="w-full bg-[#4c0d17] hover:bg-[#3d1118] border border-[#4c0d17] py-6 text-xs sm:text-sm font-bold text-[#f9f5ec] shadow-lg rounded-xl cursor-pointer transition hover:scale-[1.01]"
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-[#b08a47]" />
                    Build Bridal Trousseau Inquiry ({wishlist.length} Sarees)
                  </Button>
                )}

                <Button
                  onClick={() => window.open(getWhatsAppShortlistUrl(wishlist), '_blank')}
                  className="w-full bg-[#065f46] hover:bg-[#044030] py-6 text-sm font-bold text-white shadow-lg rounded-xl cursor-pointer transition hover:scale-[1.01]"
                >
                  <MessageCircle className="h-4 w-4 mr-2 text-[#b08a47]" />
                  Quick Shortlist to WhatsApp
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={onClear}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#8a7a6b] hover:text-[#4c0d17] transition cursor-pointer"
                  >
                    Clear All Shortlisted
                  </button>

                  <span className="text-[10px] text-[#b08a47] font-bold uppercase tracking-widest">
                    Sri Sai ClothStore Guarantee
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
