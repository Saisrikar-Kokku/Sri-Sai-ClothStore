import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Video, Share2, Store } from 'lucide-react';
import { SareeProduct } from '@/types/product.types';
import {
  getWhatsAppOrderUrl,
  getWhatsAppVideoConsultUrl,
  getWhatsAppShareUrl,
} from '@/lib/whatsapp';

interface ModalConversionBarProps {
  product: SareeProduct;
  activeAngleLabel?: string;
  activeImageUrl?: string;
  onOpenVideoConsult?: (product: SareeProduct) => void;
}

export const ModalConversionBar: React.FC<ModalConversionBarProps> = ({
  product,
  activeAngleLabel,
  activeImageUrl,
  onOpenVideoConsult,
}) => {
  return (
    <div className="mt-5 space-y-3 pt-4 border-t border-[#e5dfd3]">
      {/* Primary CTA: WhatsApp Direct Reserve */}
      <Button
        onClick={() =>
          window.open(getWhatsAppOrderUrl(product, activeAngleLabel, activeImageUrl), '_blank')
        }
        className="w-full bg-[#065f46] hover:bg-[#065f46]/90 py-6 text-sm sm:text-base font-bold text-white shadow-xl rounded-sm cursor-pointer transition hover:scale-[1.01] flex items-center justify-center gap-2"
      >
        <MessageCircle className="h-5 w-5" />
        <span>Buy via WhatsApp • వాట్సాప్‌లో కొనండి</span>
      </Button>

      {/* Secondary CTA: Video Call Consultation */}
      <Button
        variant="outline"
        onClick={() => {
          if (onOpenVideoConsult) {
            onOpenVideoConsult(product);
          } else {
            window.open(getWhatsAppVideoConsultUrl(product), '_blank');
          }
        }}
        className="w-full border-[#b08a47] text-[#b08a47] hover:bg-[#b08a47]/5 py-5 text-xs sm:text-sm font-semibold rounded-sm cursor-pointer flex items-center justify-center gap-2"
      >
        <Video className="h-4 w-4" />
        <span>Live Video Call • లైవ్ వీడియో కాల్ ట్రయల్</span>
      </Button>

      {/* Tertiary CTA: WhatsApp Family Share */}
      <Button
        variant="outline"
        onClick={() => window.open(getWhatsAppShareUrl(product, activeImageUrl), '_blank')}
        className="w-full border-[#4c0d17]/20 text-[#4c0d17] hover:text-[#4c0d17] hover:bg-[#4c0d17]/5 py-4 text-xs font-medium rounded-sm cursor-pointer flex items-center justify-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        <span>Share with Family • కుటుంబానికి పంపండి</span>
      </Button>

      {/* Boutique Notice */}
      <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[#8a7a6b] font-sans">
        <Store className="h-3.5 w-3.5 text-[#b08a47]" />
        <span>స్టోర్‌లో ప్రత్యక్షంగా చూడవచ్చు • Visit Store 10 AM - 10 PM</span>
      </div>
    </div>
  );
};
