import { useState, useMemo, useEffect } from 'react';
import { Sparkles, Lock, PhoneCall, Heart, Search, User, ShoppingBag, Instagram, Facebook, Youtube, Twitter, Mail, Video, MapPin as Location, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useProducts } from '@/hooks/useProducts';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductQuickViewModal } from '@/components/shop/ProductQuickViewModal';
import { WishlistDrawer } from '@/components/shop/WishlistDrawer';
import { AdminLoginModal } from '@/components/admin/AdminLoginModal';
import { AdminPortalModal } from '@/components/admin/AdminPortalModal';
import { GuildExplorerModal } from '@/components/shop/GuildExplorerModal';
import { WeavingGuild } from '@/types/guild.types';
import { LiveVideoConsultModal } from '@/components/shop/LiveVideoConsultModal';
import { WhatsAppInquiryBagModal } from '@/components/shop/WhatsAppInquiryBagModal';
import { CatalogExplorer } from '@/components/shop/CatalogExplorer';
import { FloatingWhatsAppButton } from '@/components/shop/FloatingWhatsAppButton';
import { SareeProduct } from '@/types/product.types';
import { STORE_CONFIG } from '@/lib/whatsapp';

const Filigree = ({ className, flipped }: { className?: string; flipped?: boolean }) => (
  <svg viewBox="0 0 120 40" fill="currentColor" className={className} style={flipped ? { transform: 'scaleX(-1)' } : {}}>
    <path d="M0,20 C30,0 40,20 60,20 C80,20 90,0 120,20 C90,40 80,20 60,20 C40,20 30,40 0,20 Z" />
    <circle cx="60" cy="20" r="4" />
    <circle cx="20" cy="20" r="2" />
    <circle cx="100" cy="20" r="2" />
  </svg>
);

const DecorativeLine = () => (
  <div className="flex items-center justify-center gap-4 text-dasara-gold my-6 opacity-70">
    <div className="w-16 h-px bg-dasara-gold/50" />
    <span className="text-xl">♦</span>
    <div className="w-16 h-px bg-dasara-gold/50" />
  </div>
);


const MughalArchMask = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <clipPath id="mughal-arch" clipPathUnits="objectBoundingBox">
        <path d="M 0,1 L 0,0.25 C 0.05,0.25 0.1,0.2 0.2,0.15 C 0.3,0.1 0.4,0.05 0.5,0 C 0.6,0.05 0.7,0.1 0.8,0.15 C 0.9,0.2 0.95,0.25 1,0.25 L 1,1 Z" />
      </clipPath>
    </defs>
  </svg>
);

const HERO_VISUALS = [
  { name: "Royal Kanchipuram Silk", image: "/hero-1.jpg", subtitle: "AUTHENTIC PURE ZARI" },
  { name: "Emerald Banarasi Brocade", image: "/hero-2.jpg", subtitle: "HERITAGE WEAVE" },
  { name: "Majestic Gadwal Handloom", image: "/hero-3.jpg", subtitle: "CONTRASTING BORDERS" },
  { name: "Golden Tissue Silk", image: "/hero-4.jpg", subtitle: "SHIMMERING ELEGANCE" },
];

export const DISPLAY_CATEGORIES = [
  { id: 'Kanchi Pattu', name: 'Kanchi Pattu', teluguName: 'కంచి పట్టు', desc: 'Premium South Indian Silks' },
  { id: 'Banarasi Silk', name: 'Banarasi Silk', teluguName: 'బనారస్ సిల్క్', desc: 'Traditional North Indian Silks' },
  { id: 'Organza', name: 'Organza', teluguName: 'ఆర్గంజా', desc: 'Lightweight, sheer, modern silks' },
  { id: 'Fancy Sarees', name: 'Fancy Sarees', teluguName: 'ఫ్యాన్సీ చీరలు', desc: 'Designer, contemporary, mixed blends' },
  { id: 'Partywear & Kurtis', name: 'Partywear & Kurtis', teluguName: 'పార్టీవేర్ & కుర్తీలు', desc: 'Ready-to-wear and heavy designer pieces' },
];

const URGENCIES = [
  "కంచి పట్టు చీర ఇప్పుడే బుక్ చేయబడింది • Kanchipuram Silk Reserved",
  "బనారస్ చీర షార్ట్‌లిస్ట్ చేయబడింది • Banarasi Silk in High Demand",
  "గద్వాల్ చేనేత చీర ఆర్డర్ చేయబడింది • Gadwal Handloom Ordered",
  "గోల్డెన్ టిష్యూ సిల్క్ స్టాక్ త్వరగా అయిపోతోంది • Low Stock Alert",
];

function LiveUrgencyTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % URGENCIES.length);
        setVisible(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`fixed bottom-8 left-8 bg-dasara-champagne border border-[#e5dfd3] shadow-[0_10px_40px_rgba(76,13,23,0.15)] py-3 px-6 rounded-sm flex items-center gap-3 z-[9999] transition-all duration-500 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="w-2 h-2 rounded-full bg-dasara-gold animate-pulse" />
      <span className="font-serif italic text-[#551a24] text-sm">{URGENCIES[index]}</span>
    </div>
  );
}

export default function App() {
  const { isAdmin } = useAdminAuth();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SareeProduct | null>(null);
  const [selectedGuild, setSelectedGuild] = useState<WeavingGuild | null>(null);
  const [isVideoConsultModalOpen, setIsVideoConsultModalOpen] = useState(false);
  const [videoConsultProduct, setVideoConsultProduct] = useState<SareeProduct | null>(null);
  const [isInquiryBagModalOpen, setIsInquiryBagModalOpen] = useState(false);

  const handleOpenVideoConsult = (product?: SareeProduct | null) => {
    setVideoConsultProduct(product || null);
    setIsVideoConsultModalOpen(true);
  };

  const handleOpenInquiryBag = () => {
    setIsInquiryBagModalOpen(true);
  };

  const {
    wishlist,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    compareIds,
    toggleCompare,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useWishlist();

  const {
    products,
    allProducts,
    setProducts,
  } = useProducts();

  const featuredShowstoppers = useMemo(() => {
    const starred = allProducts.filter((p) => p.isFeaturedShowstopper && p.isPublished !== false);
    const fallbackUnique = allProducts.filter(
      (p) => !p.isFeaturedShowstopper && p.isPublished !== false && (p.isDealerUnique || p.stockCount === 1)
    );
    if (starred.length >= 4) return starred;
    return [...starred, ...fallbackUnique].slice(0, Math.max(4, Math.min(starred.length, allProducts.length)));
  }, [allProducts]);

  return (
    <>
    <div className="min-h-screen bg-dasara-champagne text-[#3d1118] font-serif overflow-x-hidden selection:bg-dasara-maroon selection:text-dasara-champagne relative">
      <MughalArchMask />
      
      {/* 1. UTILITY TOP BAR */}
      <div className="bg-dasara-maroon text-white text-xs font-sans tracking-widest py-2 px-8 flex justify-between items-center border-b border-white/10 relative z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-dasara-gold" />
          <span>DASARA GRAND FESTIVE UTSAV • IN-STORE VOUCHER: DASARA500</span>
        </div>
        <div className="text-white/80">DIRECT LOOM WHOLESALE PRICING</div>
      </div>

      {/* 2. MAIN HEADER & LOGO STRIP */}
      <header className="bg-dasara-champagne py-6 px-4 sm:px-8 sticky top-0 z-40 shadow-sm border-b border-[#e5dfd3]/50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          
          {/* LEFT: Admin Access */}
          <div className="flex-1 flex justify-start items-center">
            <button
              onClick={() => { if (isAdmin) setIsAdminPortalOpen(true); else setIsAdminModalOpen(true); }}
              className="group flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#551a24] uppercase font-sans hover:text-dasara-gold transition-colors"
            >
              {isAdmin ? <Lock className="h-4 w-4" /> : <User className="h-4 w-4" />}
              <span className="hidden sm:inline border-b border-transparent group-hover:border-dasara-gold transition-colors">
                {isAdmin ? 'Admin Portal' : 'Admin Access'}
              </span>
            </button>
          </div>

          {/* CENTER: Brand Identity */}
          <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer">
            <Filigree className="hidden md:block w-20 h-6 text-dasara-gold" flipped />
            <div className="flex flex-col items-center">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black tracking-widest text-[#551a24] text-center">SRI SAI CLOTHSTORE</h1>
              <span className="font-serif text-xs sm:text-sm tracking-normal text-[#b08a47] mt-1 text-center font-medium telugu-text">శ్రీ సాయి క్లాత్ స్టోర్</span>
            </div>
            <Filigree className="hidden md:block w-20 h-6 text-dasara-gold" />
          </div>

          {/* RIGHT: User Actions */}
          <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6 text-[#551a24]">
            <button className="hidden sm:block hover:text-dasara-gold transition" aria-label="Search"><Search className="h-5 w-5 stroke-[1.5]" /></button>
            <button onClick={() => handleOpenVideoConsult()} className="hover:text-dasara-gold transition" aria-label="Live Video">
              <Video className="h-5 w-5 stroke-[1.5]" />
            </button>
            <button onClick={() => setIsDrawerOpen(true)} className="relative hover:text-dasara-gold transition" aria-label="Wishlist">
              <Heart className="h-5 w-5 stroke-[1.5]" />
            </button>
            <button onClick={handleOpenInquiryBag} className="relative hover:text-dasara-gold transition" aria-label="Shopping Bag">
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-dasara-maroon text-dasara-champagne text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold font-sans shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. SUB-NAVIGATION MENU */}
      <div className="bg-dasara-maroon border-y border-dasara-gold/30 py-2.5 relative z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-dasara-gold text-sm font-sans tracking-[0.15em] uppercase px-4">
          <button className="hover:text-white transition flex flex-col items-center">
            <span>KANCHIPURAM</span>
            <span className="text-[10px] tracking-normal font-serif text-dasara-gold/75 capitalize -mt-0.5 font-normal telugu-text">కంచి పట్టు</span>
          </button>
          <div className="w-px h-5 bg-dasara-gold/30" />
          <button className="hover:text-white transition flex flex-col items-center">
            <span>VARANASI</span>
            <span className="text-[10px] tracking-normal font-serif text-dasara-gold/75 capitalize -mt-0.5 font-normal telugu-text">బనారస్</span>
          </button>
          <div className="w-px h-5 bg-dasara-gold/30" />
          <button className="hover:text-white transition flex flex-col items-center">
            <span>DHARMAVARAM</span>
            <span className="text-[10px] tracking-normal font-serif text-dasara-gold/75 capitalize -mt-0.5 font-normal telugu-text">ధర్మవరం</span>
          </button>
          <div className="w-px h-5 bg-dasara-gold/30" />
          <button className="hover:text-white transition flex flex-col items-center">
            <span>GADWAL</span>
            <span className="text-[10px] tracking-normal font-serif text-dasara-gold/75 capitalize -mt-0.5 font-normal telugu-text">గద్వాల్</span>
          </button>
        </div>
      </div>

      {/* 4. ARCHWAY HERO SHOWCASE */}
      <section className="bg-dasara-maroon py-12 px-8 relative overflow-hidden flex justify-center pb-24">
        {/* watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
          <h2 className="text-[12rem] font-serif font-black text-white whitespace-nowrap">DASARA 2026</h2>
        </div>
        <div className="max-w-[1400px] w-full flex items-center justify-between gap-6 z-10 relative mt-4">
          {featuredShowstoppers.slice(0, 4).map((saree, i) => {
            const visual = HERO_VISUALS[i];
            return (
            <div 
              key={i} 
              className="relative w-full aspect-[2/3] group cursor-pointer overflow-hidden bg-[#4c0d17]"
              style={{
                clipPath: 'url(#mughal-arch)',
              }}
              onClick={() => setSelectedProduct(saree)}
            >
              <img 
                src={visual.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={visual.name}
              />
              {/* Gold Border SVG Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M 0,100 L 0,25 C 5,25 10,20 20,15 C 30,10 40,5 50,0 C 60,5 70,10 80,15 C 90,20 95,25 100,25 L 100,100" 
                  fill="none" 
                  stroke="#b08a47" 
                  strokeWidth="1.5" 
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a070c] via-[#4c0d17]/40 to-transparent flex flex-col items-center justify-end pb-8 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-dasara-gold font-serif text-lg tracking-widest text-center px-4 drop-shadow-md transition-transform duration-700 group-hover:-translate-y-1">{visual.name}</span>
                <span className="text-white/90 font-sans text-[10px] tracking-[0.2em] mt-3 border-b border-dasara-gold/30 pb-1 uppercase transition-transform duration-700 group-hover:-translate-y-1">{visual.subtitle}</span>
              </div>
            </div>
          )})}
        </div>
      </section>

      <CatalogExplorer
        products={allProducts}
        onProductSelect={setSelectedProduct}
        toggleWishlist={toggleWishlist}
        handleOpenVideoConsult={handleOpenVideoConsult}
        wishlistIds={wishlist.map((p) => p.id)}
      />

      {/* 6. BOUTIQUE VISIT */}
      <section className="bg-white py-24 px-8 border-y border-[#e5dfd3]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <DecorativeLine />
            <h2 className="text-3xl font-bold tracking-[0.2em] text-[#551a24] uppercase mb-4">BOUTIQUE VISIT</h2>
            <p className="text-sm font-sans tracking-[0.3em] text-[#8a7a6b] uppercase">Experience Tradition in Person</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center text-left">
            {/* Left Image */}
            <div className="relative h-[600px] p-4 border border-[#e5dfd3]">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-dasara-gold" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-dasara-gold" />
              <img 
                src="/heritage-saree.jpg" 
                alt="Heritage Boutique Saree" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Middle Content */}
            <div className="flex flex-col justify-center px-4">
              <h3 className="text-4xl font-serif text-[#551a24] mb-2 leading-tight">Step into our<br/><span className="italic">Heritage Flagship</span></h3>
              <h4 className="text-lg font-serif text-[#b08a47] mb-8 leading-relaxed tracking-normal font-medium telugu-text">మా హెరిటేజ్ ఫ్లాగ్‌షిప్ స్టోర్‌లోకి అడుగుపెట్టండి</h4>
              <p className="text-[#8a7a6b] leading-relaxed mb-10 text-base font-sans">
                At Sri Sai Clothstore, we bring you the timeless beauty of Indian tradition with a modern touch. Our curated collection of premium silk sarees celebrates heritage, craftsmanship and elegance.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <Sparkles className="w-5 h-5 text-dasara-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold font-sans text-sm uppercase tracking-wider text-[#551a24] mb-1">
                      Direct Looms <span className="text-xs font-serif text-[#b08a47] font-normal tracking-normal telugu-text">• నేరుగా మగ్గాల నుండి</span>
                    </h4>
                    <p className="text-sm font-sans text-[#8a7a6b]">Authentic weaves sourced straight from master artisans. (చేనేత కళాకారుల నుండి నేరుగా లభించును)</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Sparkles className="w-5 h-5 text-dasara-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold font-sans text-sm uppercase tracking-wider text-[#551a24] mb-1">
                      Silk Mark Certified <span className="text-xs font-serif text-[#b08a47] font-normal tracking-normal telugu-text">• 100% స్వచ్ఛమైన పట్టు</span>
                    </h4>
                    <p className="text-sm font-sans text-[#8a7a6b]">100% pure silk guaranteed across our premium range. (సిల్క్ మార్క్ సర్టిఫైడ్ నాణ్యత)</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Sparkles className="w-5 h-5 text-dasara-gold mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold font-sans text-sm uppercase tracking-wider text-[#551a24] mb-1">
                      WhatsApp Concierge <span className="text-xs font-serif text-[#b08a47] font-normal tracking-normal telugu-text">• వీడియో కాల్ షాపింగ్</span>
                    </h4>
                    <p className="text-sm font-sans text-[#8a7a6b]">Personalized video shopping experience from home. (ఇంట్లో కూర్చునే వీడియో కాల్ లో చూడవచ్చు)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Offer */}
            <div className="flex flex-col justify-center h-[600px] border border-[#e5dfd3] bg-dasara-champagne p-12 text-center relative group">
              <Sparkles className="mx-auto text-dasara-gold mb-6 w-8 h-8" />
              <h4 className="text-xs uppercase tracking-wider text-[#8a7a6b] font-sans font-bold mb-8">FESTIVE INVITATION <span className="text-xs font-serif text-[#b08a47] font-normal tracking-normal telugu-text">• దసరా ఆహ్వానం</span></h4>
              
              <div className="text-5xl font-serif italic text-[#551a24] mb-8 leading-tight">
                Dasara <br/><span className="font-black not-italic text-6xl">Special</span>
              </div>
              
              <div className="text-sm font-sans text-[#8a7a6b] mb-4">Present this code at our boutique • స్టోర్‌లో ఈ కోడ్ చూపించండి</div>
              <div className="text-3xl font-serif text-dasara-gold font-bold tracking-widest mb-10 border-y border-dasara-gold/30 py-4">
                DASARA500
              </div>
              
              <button 
                className="bg-gradient-to-r from-[#d2b471] to-[#b08a47] text-white py-4 px-8 uppercase tracking-widest text-sm font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-full group-hover:scale-105 duration-300"
              >
                <span>GET DIRECTIONS • రూట్ మ్యాప్</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MASSIVE FOOTER */}
      <footer className="bg-[#2a0c12] text-[#e5dfd3] pt-24 pb-8 px-8 text-sm font-sans mt-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Filigree className="w-8 h-3 text-dasara-gold" flipped />
                <h3 className="font-serif text-xl font-bold tracking-widest text-white">SRI SAI</h3>
                <Filigree className="w-8 h-3 text-dasara-gold" />
              </div>
              <p className="text-white/60 leading-relaxed mb-2">
                Timeless Indian Ethnic Wear<br/>For Every Generation.
              </p>
              <p className="font-serif text-[#b08a47] text-xs tracking-normal mb-8 opacity-80">
                ప్రతి తరానికి సరిపోయే సాంప్రదాయ భారతీయ దుస్తులు.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/60 hover:text-dasara-gold transition"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-white/60 hover:text-dasara-gold transition"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="text-white/60 hover:text-dasara-gold transition"><Youtube className="w-5 h-5" /></a>
                <a href="#" className="text-white/60 hover:text-dasara-gold transition"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-white text-lg tracking-widest uppercase mb-8">Artisan Clusters</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-dasara-gold transition">Kanchipuram Silks</a></li>
                <li><a href="#" className="hover:text-dasara-gold transition">Varanasi Brocades</a></li>
                <li><a href="#" className="hover:text-dasara-gold transition">Dharmavaram Weaves</a></li>
                <li><a href="#" className="hover:text-dasara-gold transition">Gadwal Handlooms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-white text-lg tracking-widest uppercase mb-8">Boutique Flagship</h4>
              <ul className="space-y-4 text-white/60">
                <li className="flex items-start gap-3">
                  <Location className="w-5 h-5 text-dasara-gold shrink-0 mt-0.5" />
                  <span>{STORE_CONFIG.storeAddress}</span>
                </li>
                <li className="flex items-start gap-3 mt-6">
                  <PhoneCall className="w-5 h-5 text-dasara-gold shrink-0 mt-0.5" />
                  <span>{STORE_CONFIG.displayPhone}</span>
                </li>
                <li className="flex items-start gap-3 mt-6">
                  <Mail className="w-5 h-5 text-dasara-gold shrink-0 mt-0.5" />
                  <span>support@srisaiclothstore.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-white text-lg tracking-widest uppercase mb-8">Authenticity</h4>
              <p className="text-white/60 leading-relaxed mb-6">
                Every piece is accompanied by a silk mark certification and weaver authenticity guarantee.
              </p>
              <div className="w-24 h-24 border border-dasara-gold/30 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-6 h-6 text-dasara-gold mx-auto mb-1" />
                  <div className="text-[10px] uppercase tracking-widest text-dasara-gold">100%<br/>PURE SILK</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-white/40 text-xs">
            <p>&copy; {new Date().getFullYear()} Sri Sai Clothstore. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0 font-serif italic text-sm text-dasara-gold/60">
              <span className="w-12 h-px bg-dasara-gold/30" />
              Elegance Woven in Tradition
              <span className="w-12 h-px bg-dasara-gold/30" />
            </div>
          </div>
        </div>
      </footer>

      {/* 8. FLOATING WHATSAPP & TOASTS */}
      <button 
        onClick={handleOpenInquiryBag}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#d2b471] to-[#b08a47] rounded-full shadow-[0_0_20px_rgba(176,138,71,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform z-50 group"
      >
        <PhoneCall className="w-6 h-6 fill-white" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#551a24] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-dasara-champagne">
            {wishlistCount}
          </span>
        )}
      </button>


      <GuildExplorerModal
        guild={selectedGuild}
        isOpen={Boolean(selectedGuild)}
        onClose={() => setSelectedGuild(null)}
        onFilterByGuild={() => {}}
      />
      <ProductQuickViewModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? isInWishlist(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
        onOpenVideoConsult={(p) => handleOpenVideoConsult(p)}
      />
      <WishlistDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        wishlist={wishlist}
        onRemove={removeFromWishlist}
        onClear={clearWishlist}
        onQuickView={(p) => setSelectedProduct(p)}
        compareIds={compareIds}
        onToggleCompare={toggleCompare}
        onOpenInquiryBag={handleOpenInquiryBag}
      />
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onOpenPortal={() => setIsAdminPortalOpen(true)}
      />
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        products={allProducts}
        setProducts={setProducts}
      />
      <LiveVideoConsultModal
        isOpen={isVideoConsultModalOpen}
        onClose={() => { setIsVideoConsultModalOpen(false); setVideoConsultProduct(null); }}
        availableProducts={allProducts || products}
        preSelectedProduct={videoConsultProduct}
      />
      <WhatsAppInquiryBagModal
        isOpen={isInquiryBagModalOpen}
        onClose={() => setIsInquiryBagModalOpen(false)}
        items={wishlist}
        onRemoveItem={removeFromWishlist}
        onClearBag={clearWishlist}
      />
    </div>
    <LiveUrgencyTicker />
    <FloatingWhatsAppButton />
    </>
  );
}
