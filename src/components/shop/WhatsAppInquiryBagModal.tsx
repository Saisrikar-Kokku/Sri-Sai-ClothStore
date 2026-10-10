import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Trash2, Sparkles, Heart } from 'lucide-react';
import { SareeProduct } from '@/types/product.types';
import { getWhatsAppMultiItemInquiryUrl } from '@/lib/whatsapp';

interface WhatsAppInquiryBagModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SareeProduct[];
  onRemoveItem: (id: string) => void;
  onClearBag: () => void;
}

export const WhatsAppInquiryBagModal: React.FC<WhatsAppInquiryBagModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearBag,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [occasionType, setOccasionType] = useState('Dasara Pooja & Family Muhurtham');
  const [notes, setNotes] = useState('');

  const totalAmount = items.reduce((acc, p) => acc + p.price, 0);
  const totalOriginal = items.reduce((acc, p) => acc + p.originalPrice, 0);
  const totalSavings = totalOriginal - totalAmount;

  const handleSendBagToWhatsApp = () => {
    const url = getWhatsAppMultiItemInquiryUrl({
      products: items,
      customerName,
      customerCity,
      occasionType,
      customNotes: notes,
    });
    window.open(url, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl border border-[#e5dfd3]/60 bg-[#f9f5ec] p-5 sm:p-7 text-[#4c0d17] sm:rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl [&>button]:!text-[#8a7a6b] [&>button:hover]:!text-[#4c0d17]">
        <DialogHeader className="text-left space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#b08a47]/10 border border-[#b08a47]/20 px-3 py-1 text-[10px] font-bold text-[#b08a47] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#b08a47]" />
              Inquiry Bag • ఎంక్వైరీ బ్యాగ్
            </span>
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearBag}
                className="text-[10px] font-bold uppercase tracking-widest text-[#8a7a6b] hover:text-[#4c0d17] transition cursor-pointer"
              >
                Clear All • అన్నీ తొలగించండి
              </button>
            )}
          </div>

          <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold text-[#4c0d17] leading-snug">
            Multi-Saree Inquiry • వాట్సాప్ విచారణ
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[#8a7a6b] font-sans">
            మీరు ఎంచుకున్న చీరల వివరాలను ఒకేసారి వాట్సాప్‌లో పంపి ఆర్డర్ చేయవచ్చు.
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="py-12 text-center text-[#8a7a6b] space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-white border border-[#e5dfd3] flex items-center justify-center text-[#8a7a6b]/50 shadow-sm">
              <Heart className="h-5 w-5" />
            </div>
            <p className="text-sm font-serif font-bold text-[#4c0d17]">మీ బ్యాగ్ ఖాళీగా ఉంది (Inquiry Bag is Empty)</p>
            <p className="text-xs text-[#8a7a6b]">క్యాటలాగ్ నుండి మీకు నచ్చిన చీరలను సెలెక్ట్ చేసుకోండి!</p>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {/* Items List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#e5dfd3] scrollbar-track-transparent">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e5dfd3] bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-14 w-14 rounded-lg object-cover shrink-0 border border-[#e5dfd3]/50"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold font-serif text-[#4c0d17] truncate">{product.name}</p>
                      <p className="text-[10px] text-[#8a7a6b] font-mono mt-1">
                        SKU: {product.sku} • {product.provenance}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-sans text-[11px] font-bold text-[#4c0d17]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id)}
                      className="text-[#8a7a6b] hover:text-[#4c0d17] p-1.5 cursor-pointer transition rounded-full hover:bg-[#e5dfd3]/30"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculation Box */}
            <div className="rounded-xl border border-[#b08a47]/30 bg-[#f9f5ec] p-4 space-y-2 text-xs shadow-inner">
              <div className="flex justify-between text-[#8a7a6b]">
                <span className="uppercase tracking-widest text-[10px] font-bold">Items in Package:</span>
                <span className="font-mono text-[#4c0d17] font-bold">{items.length} Sarees</span>
              </div>
              <div className="flex justify-between text-[#8a7a6b]">
                <span className="uppercase tracking-widest text-[10px] font-bold">Total MRP:</span>
                <span className="font-mono line-through">₹{totalOriginal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#065f46] font-bold">
                <span className="uppercase tracking-widest text-[10px]">Dasara Festive Savings:</span>
                <span className="font-mono">- ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#b08a47]/20 text-sm font-bold mt-1">
                <span className="text-[#4c0d17] font-serif">Estimated Package Total:</span>
                <span className="font-sans text-lg text-[#b08a47]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="మీ పేరు / Name (e.g., Lakshmi)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-serif placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="మీ ఊరు / City (e.g., Mahadevpur)"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full bg-white border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-serif placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="శుభకార్యం / Occasion (Pooja, Wedding)"
                  value={occasionType}
                  onChange={(e) => setOccasionType(e.target.value)}
                  className="w-full bg-white border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-serif placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="మీ ప్రశ్నలు / Special Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-serif placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 shadow-sm"
                />
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 border-t border-[#e5dfd3]">
              <Button
                onClick={handleSendBagToWhatsApp}
                className="w-full bg-[#065f46] hover:bg-[#044030] text-white font-bold py-6 text-sm sm:text-base rounded-xl shadow-lg cursor-pointer transition hover:scale-[1.01]"
              >
                <MessageCircle className="mr-2 h-5 w-5 text-[#b08a47]" />
                Send to WhatsApp • వాట్సాప్‌లో పంపండి
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
