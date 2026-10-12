import { SareeProduct } from '@/types/product.types';
import {
  WhatsAppOrderPayload,
  VideoConsultBooking,
  MultiItemInquiryPayload,
  StoreContactConfig,
} from '@/types/whatsapp.types';

export const STORE_CONFIG: StoreContactConfig = {
  primaryPhone:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STORE_WHATSAPP_NUMBER) ||
    '918500581272',
  displayPhone: '+91 85005 81272',
  storeName: 'Sri Sai ClothStore',
  storeAddress: 'Mahadevpur (Near Pathangadi Bazaar), Telangana',
  googleMapsUrl: 'https://maps.app.goo.gl/LFGRZcLxPDVP2j9A7',
  storeHours: '10:00 AM – 9:30 PM (Dasara Special Extended Hours)',
  inStoreCouponCode: 'DASARA500',
  inStoreDiscountAmount: 500,
};

export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);

  // In Node.js / non-browser test runner environment, default to standard universal link
  if (typeof window === 'undefined') {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

export function getWhatsAppOrderUrl(
  product: SareeProduct,
  payloadOrAngleLabel?: Partial<WhatsAppOrderPayload> | string,
  imageUrl?: string
): string {
  let isHold = true;
  let city = '';
  let selectedAngleUrl = imageUrl || product.images[0] || '';
  let customNote = '';

  if (typeof payloadOrAngleLabel === 'string') {
    selectedAngleUrl = imageUrl || product.images[0] || '';
    if (payloadOrAngleLabel) {
      customNote = `Inspected Angle: ${payloadOrAngleLabel}`;
    }
  } else if (payloadOrAngleLabel && typeof payloadOrAngleLabel === 'object') {
    isHold = payloadOrAngleLabel.isHoldRequest ?? true;
    city = payloadOrAngleLabel.customerCity ? ` (${payloadOrAngleLabel.customerCity})` : '';
    selectedAngleUrl = payloadOrAngleLabel.selectedAngleUrl || product.images[0] || '';
    customNote = payloadOrAngleLabel.customNote || '';
  }

  const message = [
    `Namaste ${STORE_CONFIG.storeName}! 🙏✨`,
    `I would like to ${isHold ? '*reserve & hold*' : '*purchase*'} this Dasara Special saree${city}:`,
    '',
    `🥻 *Product:* ${product.name}`,
    `🏷️ *SKU:* ${product.sku}`,
    product.provenance ? `📍 *Origin:* ${product.provenance}` : '',
    `💰 *Festive Price:* ₹${product.price.toLocaleString('en-IN')} (MRP: ₹${product.originalPrice.toLocaleString('en-IN')})`,
    product.fabric ? `🧵 *Fabric:* ${product.fabric}` : '',
    product.zariType ? `✨ *Zari:* ${product.zariType}` : '',
    selectedAngleUrl ? `📸 *Reference Photo:* ${selectedAngleUrl}` : '',
    '',
    isHold
      ? `⏳ *Request:* Please hold this 1-of-1 piece for 24 hours while I confirm booking details.`
      : `📦 *Request:* Please share payment details (UPI/Bank) and courier delivery timeline.`,
    customNote ? `💬 *Note:* ${customNote}` : '',
    '',
    `Please confirm availability! Thank you.`
  ].filter(Boolean).join('\n');

  return buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);
}

export function getWhatsAppVideoConsultBookingUrl(booking: VideoConsultBooking): string {
  const sareeList =
    booking.selectedProducts.length > 0
      ? booking.selectedProducts
          .map((p, i) => `${i + 1}. *${p.name}* (SKU: ${p.sku} | ₹${p.price.toLocaleString('en-IN')})`)
          .join('\n')
      : '• New Dasara Consignment Showstoppers';

  const message = [
    `Namaste ${STORE_CONFIG.storeName}! 🙏🥻`,
    `I would like to book a *5-Minute Live Video Call Saree Drape Consultation*:`,
    '',
    `👤 *Customer Name:* ${booking.customerName || 'Shopper'}`,
    `📱 *Phone:* ${booking.customerPhone || 'N/A'}`,
    `📍 *Location:* ${booking.customerCity || 'India'}`,
    `🗣️ *Preferred Language:* ${booking.preferredLanguage}`,
    `⏰ *Preferred Time Slot:* ${booking.timeSlot}`,
    `📹 *Platform:* ${booking.preferredPlatform}`,
    '',
    `👗 *Sarees to Display on Stand:*`,
    sareeList,
    '',
    booking.specialNotes ? `📝 *Special Request:* ${booking.specialNotes}\n` : '',
    `Please confirm the appointment slot and share the video call link! Thank you.`
  ].filter(Boolean).join('\n');

  return buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);
}

export function getWhatsAppMultiItemInquiryUrl(payload: MultiItemInquiryPayload): string {
  const totalAmount = payload.products.reduce((acc, p) => acc + p.price, 0);
  const totalSavings = payload.products.reduce((acc, p) => acc + (p.originalPrice - p.price), 0);

  const buildMessage = (includePhotos: boolean, maxItems?: number) => {
    const list = maxItems !== undefined ? payload.products.slice(0, maxItems) : payload.products;
    const overflow = payload.products.length - list.length;

    const itemsFormatted = list.map((p, idx) => {
      const originStr = p.provenance ? ` | Origin: ${p.provenance}` : '';
      if (includePhotos) {
        return `${idx + 1}. *${p.name}*\n   SKU: ${p.sku} | Price: ₹${p.price.toLocaleString('en-IN')}${originStr}\n   Photo: ${p.images[0] || 'N/A'}`;
      }
      return `${idx + 1}. *${p.name}* (SKU: ${p.sku} | ₹${p.price.toLocaleString('en-IN')}${originStr})`;
    }).join(includePhotos ? '\n\n' : '\n');

    return [
      `Namaste ${STORE_CONFIG.storeName}! 🙏✨`,
      `I have shortlisted a *Bridal Trousseau Package* of ${payload.products.length} saree(s) for Dasara:`,
      '',
      itemsFormatted,
      overflow > 0 ? `... and ${overflow} more shortlisted piece(s) in package` : '',
      '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `💰 *Package Total:* ₹${totalAmount.toLocaleString('en-IN')}`,
      `🎉 *Total Festive Savings:* ₹${totalSavings.toLocaleString('en-IN')}`,
      payload.occasionType ? `🎊 *Occasion:* ${payload.occasionType}` : '',
      payload.customerCity ? `📍 *City:* ${payload.customerCity}` : '',
      payload.customNotes ? `💬 *Notes:* ${payload.customNotes}` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      '',
      `Please confirm availability and package pricing! Thank you.`
    ].filter(Boolean).join('\n');
  };

  // 1. Try with photos if few items
  let message = buildMessage(payload.products.length <= 2);
  let url = buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);

  // 2. If url length exceeds 1,750, switch to compact (no photos)
  if (url.length > 1750) {
    message = buildMessage(false);
    url = buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);
  }

  // 3. If still exceeds 1,750, progressively trim items while keeping total accurate
  let limit = payload.products.length;
  while (url.length > 1750 && limit > 1) {
    limit--;
    message = buildMessage(false, limit);
    url = buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);
  }

  return url;
}

export function getWhatsAppShareUrl(product: SareeProduct, imageUrl?: string): string {
  const displayImage = imageUrl || product.images[0];
  const message = [
    `Look at this gorgeous saree from ${STORE_CONFIG.storeName}! ✨🥻`,
    '',
    `*${product.name}*`,
    `🏷️ SKU: ${product.sku}`,
    product.provenance ? `📍 Origin: ${product.provenance}` : '',
    `💰 Festive Price: ₹${product.price.toLocaleString('en-IN')} (MRP: ₹${product.originalPrice.toLocaleString('en-IN')})`,
    product.fabric ? `🧵 Fabric: ${product.fabric}` : '',
    product.zariType ? `✨ Zari: ${product.zariType}` : '',
    displayImage ? `📸 Photo: ${displayImage}` : '',
    '',
    `What do you think? Should we shortlist this for the Dasara festival pooja?`
  ].filter(Boolean).join('\n');

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppGeneralChatUrl(): string {
  const message = `Namaste ${STORE_CONFIG.storeName}! 🙏 I am browsing your Dasara 2026 Silk Collection online and had a quick inquiry about your new dealer arrivals.`;
  return buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);
}

export function getWhatsAppVideoConsultUrl(product?: SareeProduct): string {
  const message = [
    `Namaste ${STORE_CONFIG.storeName}! 🙏`,
    `I would like to request a 5-minute Live Video Call to view the sarees and check the drape/pallu under light:`,
    product ? `Interested in: *${product.name}* (SKU: ${product.sku})` : 'Interested in the new Dasara arrivals.',
    '',
    `Please let me know when you can start the call!`
  ].join('\n');

  return buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);
}

export function getWhatsAppShortlistUrl(products: SareeProduct[]): string {
  const totalValue = products.reduce((acc, p) => acc + p.price, 0);

  const buildMessage = (includePhotos: boolean, maxItems?: number) => {
    const list = maxItems !== undefined ? products.slice(0, maxItems) : products;
    const overflow = products.length - list.length;

    const listItems = list.map((p, idx) => {
      if (includePhotos) {
        return `${idx + 1}. *${p.name}*\n   SKU: ${p.sku} | Price: ₹${p.price.toLocaleString('en-IN')}\n   Origin: ${p.provenance}\n   Fabric: ${p.fabric}\n   Photo: ${p.images[0] || 'N/A'}`;
      }
      return `${idx + 1}. *${p.name}* (SKU: ${p.sku} | ₹${p.price.toLocaleString('en-IN')} | ${p.provenance.split(',')[0]})`;
    }).join(includePhotos ? '\n\n' : '\n');

    return [
      `Namaste ${STORE_CONFIG.storeName}! 🙏✨`,
      `I have shortlisted ${products.length} saree(s) from your Dasara collection:`,
      '',
      listItems,
      overflow > 0 ? `... and ${overflow} more piece(s)` : '',
      '',
      `Total Shortlist Value: ₹${totalValue.toLocaleString('en-IN')}`,
      '',
      `Please let me know how we can proceed with booking!`
    ].filter(Boolean).join('\n');
  };

  let message = buildMessage(products.length <= 2);
  let url = buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);

  if (url.length > 1750) {
    message = buildMessage(false);
    url = buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);
  }

  let limit = products.length;
  while (url.length > 1750 && limit > 1) {
    limit--;
    message = buildMessage(false, limit);
    url = buildWhatsAppUrl(STORE_CONFIG.primaryPhone, message);
  }

  return url;
}
