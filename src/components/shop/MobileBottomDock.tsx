import React from 'react';
import { ShoppingBag, Video, MessageCircle } from 'lucide-react';
import { getWhatsAppGeneralChatUrl } from '@/lib/whatsapp';
import { SareeProduct } from '@/types/product.types';

interface MobileBottomDockProps {
  wishlist: SareeProduct[];
  onOpenInquiryBag: () => void;
  onOpenVideoConsult: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  wishlist,
  onOpenInquiryBag,
  onOpenVideoConsult,
}) => {
  const count = wishlist.length;
  const totalPrice = wishlist.reduce((acc, p) => acc + p.price, 0);

  const handleOpenWhatsApp = () => {
    window.open(getWhatsAppGeneralChatUrl(), '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#f9f5ec]/95 backdrop-blur-lg border-t border-[#b08a47]/30 shadow-[0_-8px_30px_rgba(76,13,23,0.18)] px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* 1. INQUIRY BAG (Thumb zone left) */}
        <button
          type="button"
          onClick={onOpenInquiryBag}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg bg-white border border-[#e5dfd3] active:bg-[#f9f5ec] text-[#4c0d17] shadow-sm relative transition-transform active:scale-95 cursor-pointer"
          aria-label="Open Inquiry Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#b08a47]" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#4c0d17] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold font-sans shadow">
                {count}
              </span>
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider leading-tight text-[#4c0d17]">
              Inquiry Bag
            </span>
            <span className="text-[9px] font-serif text-[#b08a47] telugu-text leading-tight font-medium">
              విచారణ బ్యాగ్ {count > 0 ? `(₹${totalPrice.toLocaleString('en-IN')})` : ''}
            </span>
          </div>
        </button>

        {/* 2. LIVE VIDEO CALL (Thumb zone center) */}
        <button
          type="button"
          onClick={onOpenVideoConsult}
          className="flex items-center justify-center w-11 h-11 rounded-lg bg-white border border-[#065f46]/30 text-[#065f46] active:bg-[#065f46]/10 shadow-sm shrink-0 transition-transform active:scale-95 cursor-pointer"
          title="Live Video Shopping • వీడియో కాల్ షాపింగ్"
          aria-label="Live Video Shopping"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* 3. WHATSAPP CHAT CONCIERGE (Thumb zone primary right) */}
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="flex-[1.2] flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#065f46] to-[#047857] text-white shadow-md active:opacity-90 font-sans transition-transform active:scale-95 cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider leading-tight">
              WhatsApp Chat
            </span>
            <span className="text-[9px] font-serif text-white/90 telugu-text leading-tight">
              వాట్సాప్‌లో మాట్లాడండి
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
