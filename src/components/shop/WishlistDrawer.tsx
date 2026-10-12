import React, { useState, useEffect } from 'react';
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
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppOrderUrl, getWhatsAppShortlistUrl } from '@/lib/whatsapp';
import { getTeluguSareeName } from '@/lib/teluguDictionary';

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

  // Lock body scroll when drawer is open to prevent underlying page scroll and dual scrollbars
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 flex w-full sm:w-auto max-w-full justify-end z-50">
        <div
          className={`w-full ${
            viewMode === 'compare' ? 'sm:max-w-4xl' : 'sm:max-w-md'
          } bg-[#f9f5ec] border-l border-[#b08a47]/30 shadow-2xl flex flex-col justify-between transition-all duration-300 h-full overflow-hidden`}
        >
          
          {/* 1. Header (Compact, Balanced Luxury) */}
          <div className="p-3.5 sm:p-5 border-b border-[#e5dfd3] bg-white/70 backdrop-blur-md shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#4c0d17]/5 border border-[#4c0d17]/10 flex items-center justify-center shrink-0">
                  <Heart className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#4c0d17] fill-[#4c0d17]" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-sm sm:text-lg font-bold text-[#4c0d17] flex items-center gap-1.5 sm:gap-2 truncate">
                    <span>Festive Shortlist</span>
                    <span className="text-[#b08a47] font-serif font-medium text-xs sm:text-sm telugu-text">
                      ఇష్టమైన చీరలు
                    </span>
                    <span className="rounded-full bg-[#b08a47]/15 text-[#8c6721] border border-[#b08a47]/30 px-2 py-0.2 text-[10px] sm:text-xs font-mono font-bold shrink-0">
                      {wishlist.length}
                    </span>
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-[#8a7a6b] font-sans truncate">
                    ఎంపిక చేసిన చీరలు • Handpicked Silk Sarees
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close shortlist"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-[#e5dfd3] bg-white flex items-center justify-center text-[#8a7a6b] hover:text-[#4c0d17] hover:border-[#b08a47]/40 hover:bg-[#b08a47]/5 transition cursor-pointer shadow-sm shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            {canCompare && (
              <div className="mt-2.5 pt-2 border-t border-[#e5dfd3]/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#8a7a6b] font-bold uppercase tracking-wider hidden sm:inline">
                  డిస్‌ప్లే • Display:
                </span>
                <div className="flex items-center p-0.5 rounded-xl bg-[#f2ede2] border border-[#e5dfd3] text-xs w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[11px] font-medium ${
                      viewMode === 'list'
                        ? 'bg-[#4c0d17] text-[#f9f5ec] font-bold shadow-sm'
                        : 'text-[#8a7a6b] hover:text-[#4c0d17]'
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>జాబితా • List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('compare')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[11px] font-medium ${
                      viewMode === 'compare'
                        ? 'bg-[#4c0d17] text-[#f9f5ec] font-bold shadow-sm'
                        : 'text-[#8a7a6b] hover:text-[#4c0d17]'
                    }`}
                  >
                    <Columns3 className="h-3.5 w-3.5" />
                    <span>పోల్చండి • Compare ({comparedProducts.length})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Main Content Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-thin scrollbar-thumb-[#e5dfd3] scrollbar-track-transparent">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="h-16 w-16 rounded-full bg-white border border-[#b08a47]/30 shadow-sm flex items-center justify-center">
                  <Heart className="h-8 w-8 text-[#b08a47]/60" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#4c0d17]">ఇష్టమైన చీరలు లేవు • Shortlist is Empty</h3>
                  <p className="text-xs text-[#8a7a6b] font-sans max-w-xs leading-relaxed">
                    మీకు నచ్చిన చీరలపై గుండె (Heart) గుర్తును నొక్కి ఇక్కడ భద్రపరచండి. వాట్సాప్‌లో సులభంగా సంప్రదించవచ్చు.
                  </p>
                </div>
                <Button
                  onClick={onClose}
                  className="mt-3 text-xs bg-[#b08a47] hover:bg-[#9a773a] text-white rounded-xl shadow-md cursor-pointer"
                >
                  కలెక్షన్ చూడండి • Explore Collection
                </Button>
              </div>
            ) : viewMode === 'compare' && canCompare ? (
              /* ================= COMPARE MODE ================= */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#8a7a6b] font-bold uppercase tracking-wider">
                  <span>పోలిక • Comparing ({comparedProducts.length} Sarees)</span>
                  <span className="text-[#b08a47] font-mono">Side-by-side</span>
                </div>

                {/* Mobile: Horizontal Snap Scroll, Desktop: Multi-column Grid */}
                <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
                  {comparedProducts.map((p) => {
                    const isSelected = compareIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`w-[260px] sm:w-auto shrink-0 snap-start rounded-2xl border ${
                          isSelected
                            ? 'border-[#b08a47] bg-[#b08a47]/5 shadow-md ring-1 ring-[#b08a47]/30'
                            : 'border-[#e5dfd3] bg-white shadow-sm'
                        } p-3 flex flex-col justify-between space-y-3 transition`}
                      >
                        {/* Image & Header */}
                        <div>
                          <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#e5dfd3]">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                            {p.isSilkMarkCertified && (
                              <span className="absolute top-2 left-2 rounded-full bg-white/95 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-[#b08a47] border border-[#b08a47]/30">
                                సిల్క్ మార్క్
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => onRemove(p.id)}
                              className="absolute top-2 right-2 rounded-full bg-white/95 backdrop-blur-md p-1.5 text-[#8a7a6b] hover:text-[#4c0d17] border border-[#e5dfd3] shadow-sm cursor-pointer transition"
                              title="తొలగించండి • Remove"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <h4 className="mt-2.5 font-serif text-xs font-bold text-[#4c0d17] line-clamp-1 leading-snug">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-[#b08a47] font-serif font-medium telugu-text truncate">
                            {getTeluguSareeName(p.name, p.category)}
                          </p>
                          <span className="text-[10px] text-[#8a7a6b] font-mono">{p.sku}</span>
                        </div>

                        {/* Specs comparison */}
                        <div className="space-y-2 text-[11px] border-t border-[#e5dfd3] pt-2.5">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[#8a7a6b] text-[10px] uppercase tracking-wider font-bold">ధర • Price:</span>
                            <div>
                              <span className="font-sans text-sm font-bold text-[#4c0d17]">
                                ₹{p.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-[#8a7a6b] line-through ml-1 font-mono">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-[#8a7a6b] text-[10px] uppercase tracking-wider font-bold">ఫ్యాబ్రిక్:</span>
                            <span className="text-[#4c0d17] font-medium font-serif text-[11px] text-right truncate max-w-[130px]">{p.fabric.split('(')[0]}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-[#8a7a6b] text-[10px] uppercase tracking-wider font-bold">జరీ • Zari:</span>
                            <span className="text-[#b08a47] font-medium font-serif text-[11px] text-right truncate max-w-[130px]">{p.zariType}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-[#8a7a6b] text-[10px] uppercase tracking-wider font-bold">నేత • Origin:</span>
                            <span className="text-[#4c0d17] font-serif text-[11px] text-right truncate max-w-[130px]">{p.provenance.split(',')[0]}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-1.5 pt-2.5 border-t border-[#e5dfd3]">
                          <button
                            type="button"
                            onClick={() => window.open(getWhatsAppOrderUrl(p), '_blank')}
                            className="w-full text-[11px] py-2 bg-[#065f46] hover:bg-[#044030] text-white rounded-xl shadow-xs cursor-pointer font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <MessageCircle className="h-3.5 w-3.5 text-[#b08a47]" />
                            <span>వాట్సాప్‌లో ఆర్డర్</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onQuickView(p)}
                            className="w-full text-[11px] py-1.5 border border-[#e5dfd3] bg-white text-[#4c0d17] hover:border-[#b08a47]/50 hover:bg-[#b08a47]/5 rounded-xl cursor-pointer font-medium flex items-center justify-center gap-1.5 transition"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#b08a47]" />
                            <span>పూర్తి వివరాలు</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ================= LIST MODE ================= */
              <div className="space-y-2.5">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#e5dfd3] bg-white p-3 transition-all hover:border-[#b08a47]/50 shadow-sm flex flex-col gap-2.5"
                  >
                    {/* Top Row: Thumbnail + Details + Inset Delete */}
                    <div className="flex gap-2.5 sm:gap-3">
                      {/* Thumbnail */}
                      <div
                        onClick={() => onQuickView(item)}
                        className="relative h-24 w-20 sm:h-28 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl border border-[#e5dfd3] cursor-pointer group bg-[#f9f5ec]"
                      >
                        <img
                          src={item.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {item.isSilkMarkCertified && (
                          <span className="absolute top-1 left-1 bg-[#4c0d17]/85 backdrop-blur-xs text-white text-[8px] font-bold px-1 py-0.5 rounded shadow-sm leading-none">
                            సిల్క్ మార్క్
                          </span>
                        )}
                        <div className="absolute inset-0 bg-[#4c0d17]/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="h-4 w-4 text-white" />
                        </div>
                      </div>

                      {/* Information */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="min-w-0 pr-1">
                              <h4
                                onClick={() => onQuickView(item)}
                                className="font-serif text-[13px] sm:text-sm font-bold text-[#4c0d17] truncate hover:text-[#b08a47] cursor-pointer leading-tight"
                              >
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-[#b08a47] font-serif font-medium telugu-text truncate mt-0.5">
                                {getTeluguSareeName(item.name, item.category)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemove(item.id)}
                              className="h-7 w-7 rounded-full bg-[#f9f5ec] text-[#8a7a6b] hover:text-[#9e1c2b] hover:bg-[#ffebee] flex items-center justify-center transition cursor-pointer shrink-0 border border-[#e5dfd3]"
                              title="తొలగించండి • Remove"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-[#8a7a6b] font-mono mt-1">
                            <span>{item.sku}</span>
                            <span>•</span>
                            <span className="text-[#8c6721] font-semibold">{item.provenance.split(',')[0]}</span>
                          </div>
                        </div>

                        {/* Price Row */}
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="font-sans text-sm sm:text-base font-extrabold text-[#4c0d17]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-[#8a7a6b] line-through font-mono">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] bg-[#065f46]/10 text-[#065f46] font-bold px-1.5 py-0.5 rounded font-sans">
                            మగ్గం ధర
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons: Full Width 3-button row */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#e5dfd3]/70">
                      {/* Compare toggle */}
                      <button
                        type="button"
                        onClick={() => onToggleCompare(item)}
                        className={`h-8 sm:h-8.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition flex items-center justify-center gap-1 border cursor-pointer ${
                          compareIds.includes(item.id)
                            ? 'bg-[#b08a47]/15 text-[#8c6721] border-[#b08a47]/50 shadow-xs'
                            : 'bg-[#fcfaf6] text-[#6e5d4f] border-[#e5dfd3] hover:border-[#b08a47]/40 hover:text-[#4c0d17]'
                        }`}
                        title="పోల్చండి • Compare"
                      >
                        {compareIds.includes(item.id) ? (
                          <>
                            <Check className="h-3 w-3 text-[#8c6721]" />
                            <span>పోల్చబడింది</span>
                          </>
                        ) : (
                          <>
                            <span>+ పోల్చండి</span>
                          </>
                        )}
                      </button>

                      {/* Quick view button */}
                      <button
                        type="button"
                        onClick={() => onQuickView(item)}
                        className="h-8 sm:h-8.5 rounded-lg text-[10px] sm:text-[11px] font-bold bg-[#fcfaf6] text-[#4c0d17] border border-[#e5dfd3] hover:border-[#b08a47]/50 hover:bg-[#b08a47]/5 transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        title="వివరాలు చూడండి • View Details"
                      >
                        <Eye className="h-3 w-3 text-[#b08a47]" />
                        <span>వివరాలు</span>
                      </button>

                      {/* WhatsApp order button */}
                      <button
                        type="button"
                        onClick={() => window.open(getWhatsAppOrderUrl(item), '_blank')}
                        className="h-8 sm:h-8.5 rounded-lg text-[10px] sm:text-[11px] font-bold bg-[#065f46] hover:bg-[#044030] text-white shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                        title="వాట్సాప్‌లో ఆర్డర్ • Order on WhatsApp"
                      >
                        <MessageCircle className="h-3 w-3 text-[#f9f5ec]" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Footer Summary (Ultra-Refined, Compact, No Clumsiness) */}
          {wishlist.length > 0 && (
            <div className="p-3 sm:p-4 border-t border-[#b08a47]/30 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.04)] space-y-2.5 shrink-0">
              {/* Financial summary bar */}
              <div className="bg-[#f9f5ec] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-[#e5dfd3] flex items-center justify-between">
                <div>
                  <span className="text-[#8a7a6b] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block">
                    మొత్తం ({wishlist.length} చీరలు) • Shortlist Total:
                  </span>
                  <span className="text-[10px] text-[#065f46] font-bold">
                    ✨ దసరా ఆదా: Save ₹{totalSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-base sm:text-lg font-black text-[#4c0d17]">
                    ₹{totalValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Clean Dual-Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onOpenInquiryBag && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenInquiryBag();
                      onClose();
                    }}
                    className="w-full bg-[#4c0d17] hover:bg-[#3d1118] border border-[#4c0d17] h-11 sm:h-12 text-xs sm:text-[13px] font-bold text-[#f9f5ec] shadow-md rounded-xl cursor-pointer transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-[#b08a47]" />
                    <span>విచారణ బ్యాగ్ • Inquiry Bag ({wishlist.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => window.open(getWhatsAppShortlistUrl(wishlist), '_blank')}
                  className="w-full bg-[#065f46] hover:bg-[#044030] h-11 sm:h-12 text-xs sm:text-[13px] font-bold text-white shadow-md rounded-xl cursor-pointer transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-[#b08a47]" />
                  <span>వాట్సాప్‌లో పంపండి • WhatsApp</span>
                </button>
              </div>

              {/* Utility micro-row */}
              <div className="flex items-center justify-between pt-1 text-[10px] text-[#8a7a6b]">
                <button
                  type="button"
                  onClick={onClear}
                  className="font-bold text-[#8a7a6b] hover:text-[#9e1c2b] transition cursor-pointer"
                >
                  అన్నీ తొలగించండి • Clear All
                </button>

                <span className="text-[#8c6721] font-bold tracking-wider">
                  ✓ 100% స్వచ్ఛమైన పట్టు గ్యారెంటీ
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
