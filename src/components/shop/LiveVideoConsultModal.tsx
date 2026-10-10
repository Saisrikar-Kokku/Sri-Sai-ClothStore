import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video, CheckCircle2 } from 'lucide-react';
import { SareeProduct } from '@/types/product.types';
import {
  PreferredLanguage,
  VideoPlatform,
  TimeSlotCategory,
  VideoConsultBooking,
} from '@/types/whatsapp.types';
import { getWhatsAppVideoConsultBookingUrl } from '@/lib/whatsapp';

interface LiveVideoConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: SareeProduct[];
  preSelectedProduct?: SareeProduct | null;
}

export const LiveVideoConsultModal: React.FC<LiveVideoConsultModalProps> = ({
  isOpen,
  onClose,
  availableProducts,
  preSelectedProduct,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => {
    return preSelectedProduct ? [preSelectedProduct.id] : [];
  });

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [language, setLanguage] = useState<PreferredLanguage>('Telugu');
  const [platform, setPlatform] = useState<VideoPlatform>('WhatsApp Video Call');
  const [timeSlot, setTimeSlot] = useState<TimeSlotCategory>('Auspicious Godhuli Vela (5:45 PM – 8:30 PM)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (preSelectedProduct) {
        setSelectedProductIds([preSelectedProduct.id]);
      } else {
        setSelectedProductIds([]);
      }
    }
  }, [preSelectedProduct, isOpen]);

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleConfirmBooking = () => {
    const candidateList = preSelectedProduct
      ? [preSelectedProduct, ...availableProducts.filter((p) => p.id !== preSelectedProduct.id)]
      : availableProducts;
    const selectedSarees = candidateList.filter((p) => selectedProductIds.includes(p.id));

    const booking: VideoConsultBooking = {
      customerName,
      customerPhone,
      customerCity,
      preferredLanguage: language,
      preferredPlatform: platform,
      timeSlot,
      selectedProducts: selectedSarees,
      specialNotes: notes,
    };

    const url = getWhatsAppVideoConsultBookingUrl(booking);
    window.open(url, '_blank');
    onClose();
  };

  const displayProducts = React.useMemo(() => {
    const pool = availableProducts.slice(0, 18);
    if (!preSelectedProduct) return pool;
    const hasPre = pool.some((p) => p.id === preSelectedProduct.id);
    if (hasPre) return pool;
    return [preSelectedProduct, ...availableProducts.filter((p) => p.id !== preSelectedProduct.id).slice(0, 17)];
  }, [availableProducts, preSelectedProduct]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl border border-[#e5dfd3]/60 bg-[#f9f5ec] p-5 sm:p-7 text-[#4c0d17] sm:rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl [&>button]:!text-[#8a7a6b] [&>button:hover]:!text-[#4c0d17]">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#4c0d17]/5 border border-[#4c0d17]/20 px-3 py-1 text-[10px] font-bold text-[#4c0d17] uppercase tracking-widest flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-[#b08a47]" />
              VIP Boutique Service
            </span>
            <span className="rounded-full bg-[#065f46]/5 border border-[#065f46]/20 px-2.5 py-1 text-[10px] font-bold text-[#065f46] uppercase tracking-widest">
              Free 5-Min Trial
            </span>
          </div>

          <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold text-[#4c0d17] leading-snug">
            Book a Live Video Saree Call • లైవ్ వీడియో కాల్
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[#8a7a6b] font-sans">
            ఇంట్లో కూర్చునే చీరల రంగు, జరీ మెరుపు, ఫాల్ వీడియో కాల్ లో ప్రత్యక్షంగా చూడండి.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Step 1: Select Sarees */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b] block">
                1. Select Sarees • చీరలను ఎంచుకోండి (గరిష్టంగా 3)
              </label>
              <span className="text-[11px] text-[#b08a47] font-mono font-bold">
                {selectedProductIds.length}/3 selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#e5dfd3] scrollbar-track-transparent">
              {displayProducts.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-[#b08a47] bg-[#b08a47]/5 shadow-sm ring-1 ring-[#b08a47]/20'
                        : 'border-[#e5dfd3] bg-white opacity-80 hover:opacity-100 hover:border-[#b08a47]/40'
                    }`}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover shrink-0 border border-[#e5dfd3]/50"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-xs font-bold text-[#4c0d17] truncate">{product.name}</p>
                      <p className="text-[10px] text-[#8a7a6b] font-mono mt-0.5">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-[#b08a47] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Time Slot Picker */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b] block mb-3">
              2. Select Timing Slot • సమయం ఎంచుకోండి
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                'Morning Pooja (10:30 AM – 1:00 PM)',
                'Afternoon High Tea (2:30 PM – 5:00 PM)',
                'Auspicious Godhuli Vela (5:45 PM – 8:30 PM)',
              ] as TimeSlotCategory[]).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    timeSlot === slot
                      ? 'border-[#4c0d17] bg-[#4c0d17] text-[#f9f5ec] font-semibold shadow-md ring-1 ring-[#4c0d17]/20'
                      : 'border-[#e5dfd3] bg-white text-[#8a7a6b] hover:border-[#b08a47]/40'
                  }`}
                >
                  <span className={`font-serif text-xs block mb-1 ${timeSlot === slot ? 'text-white' : 'text-[#4c0d17]'}`}>
                    {slot.split(' (')[0]}
                  </span>
                  <span className={`text-[10px] font-mono ${timeSlot === slot ? 'text-[#f9f5ec]/80' : 'text-[#8a7a6b]'}`}>
                    {slot.split(' (')[1]?.replace(')', '') || ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Preferred Language & Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[#e5dfd3] pt-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b] block mb-2">
                3. Preferred Language • భాషను ఎంచుకోండి
              </label>
              <div className="grid grid-cols-4 gap-1 bg-white border border-[#e5dfd3] p-1 rounded-xl shadow-sm">
                {([
                  { id: 'Telugu', label: 'తెలుగు (Telugu)' },
                  { id: 'Hindi', label: 'हिंदी (Hindi)' },
                  { id: 'English', label: 'English' },
                  { id: 'Tamil', label: 'தமிழ் (Tamil)' },
                ] as { id: PreferredLanguage; label: string }[]).map(({ id: lang, label }) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer text-center ${
                      language === lang
                        ? 'bg-[#4c0d17] text-[#f9f5ec] shadow-sm'
                        : 'text-[#8a7a6b] hover:text-[#4c0d17] hover:bg-[#f9f5ec]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b] block mb-2">
                4. Video Channel • వీడియో మాధ్యమం
              </label>
              <div className="grid grid-cols-2 gap-1 bg-white border border-[#e5dfd3] p-1 rounded-xl shadow-sm">
                {(['WhatsApp Video Call', 'Google Meet'] as VideoPlatform[]).map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPlatform(plat)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer text-center ${
                      platform === plat
                        ? 'bg-[#065f46] text-white shadow-sm'
                        : 'text-[#8a7a6b] hover:text-[#4c0d17] hover:bg-[#f9f5ec]'
                    }`}
                  >
                    {plat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4: Customer Details */}
          <div className="border-t border-[#e5dfd3] pt-5">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a7a6b] block mb-3">
              5. Contact Details • మీ వివరాలు
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="మీ పేరు / Your Name (e.g., Lakshmi)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-serif placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 shadow-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-white border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-mono placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 shadow-sm"
              />
              <input
                type="text"
                placeholder="City (e.g., Hyderabad)"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="w-full bg-white border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-serif placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 shadow-sm"
              />
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Special notes or drape preferences (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-[#e5dfd3] rounded-xl px-4 py-2.5 text-xs text-[#4c0d17] font-serif placeholder-[#8a7a6b]/70 focus:outline-none focus:border-[#b08a47] focus:ring-1 focus:ring-[#b08a47]/20 shadow-sm"
              />
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-4 border-t border-[#e5dfd3]">
            <Button
              onClick={handleConfirmBooking}
              className="w-full bg-[#065f46] hover:bg-[#044030] text-white font-bold py-6 text-sm sm:text-base rounded-xl shadow-lg cursor-pointer transition hover:scale-[1.01]"
            >
              <Video className="mr-2 h-5 w-5 text-[#b08a47]" />
              Confirm Video Appointment • వాట్సాప్‌లో బుక్ చేయండి
            </Button>
            <p className="text-[11px] text-[#8a7a6b] font-sans text-center mt-3">
              Our boutique staff will immediately accept and coordinate your live drape session.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
