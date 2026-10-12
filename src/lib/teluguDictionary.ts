// Authentic, low-literacy-friendly Telugu translations for Sri Sai Cloth Store

export const TELUGU_STRINGS = {
  storeName: 'శ్రీ సాయి క్లాత్ స్టోర్',
  festiveOffer: 'దసరా పండుగ ప్రత్యేక రాయితీ',
  voucherCode: 'కూపన్ కోడ్: DASARA500',
  directLooms: 'నేరుగా మగ్గాల హోల్‌సేల్ ధరలు',
  adminAccess: 'అడ్మిన్ లాగిన్',
  adminPortal: 'అడ్మిన్ పోర్టల్',
  search: 'వెతకండి',
  liveVideo: 'వీడియో కాల్ షాపింగ్',
  wishlist: 'ఇష్టమైనవి',
  inquiryBag: 'విచారణ బ్యాగ్',
  details: 'వివరాలు',
  videoCall: 'వీడియో కాల్',
  chatWhatsApp: 'వాట్సాప్‌లో మాట్లాడండి',
  bookVideoDrape: 'వీడియో కాల్‌లో చూడండి',
  addToBag: 'బ్యాగ్‌కు జోడించండి',
  inStock: 'స్టాక్ ఉంది',
  silkMark: '100% స్వచ్ఛమైన పట్టు (సిల్క్ మార్క్)',
  silkMarkShort: 'సిల్క్ మార్క్',
  dealerUnique: 'ఒకే ఒక్క ప్రత్యేక చీర',
  dealerUniqueShort: 'ప్రత్యేకం',
  viewCategory: 'మొత్తం చూడండి',
  backToAll: '← అన్ని కలెక్షన్లు చూడండి',
  showingPieces: 'చేనేత చీరలు లభించును',
  boutiqueVisit: 'మా బ్యూటీక్ సందర్శించండి',
  experienceTradition: 'ప్రత్యక్షంగా పట్టు చీరల నాణ్యత చూడండి',
  stepIntoHeritage: 'మా హెరిటేజ్ ఫ్లాగ్‌షిప్ స్టోర్‌లోకి రండి',
  boutiqueDesc: 'శ్రీ సాయి క్లాత్ స్టోర్‌లో సంప్రదాయ చేనేత కళా వైభవం, అత్యుత్తమ నాణ్యత గల స్వచ్ఛమైన పట్టు చీరలు నేరుగా మగ్గాల ధరలకే లభించును.',
  directLoomsTitle: 'నేరుగా మగ్గాల నుండి',
  directLoomsDesc: 'మాస్టర్ చేనేత కళాకారుల నుండి నేరుగా లభించును.',
  silkMarkTitle: '100% స్వచ్ఛమైన పట్టు',
  silkMarkDesc: 'ప్రతి చీరకు సిల్క్ మార్క్ సర్టిఫైడ్ గ్యారెంటీ.',
  whatsappConciergeTitle: 'వీడియో కాల్ షాపింగ్',
  whatsappConciergeDesc: 'ఇంట్లో కూర్చునే వాట్సాప్ వీడియో కాల్‌లో చీరలు చూడవచ్చు.',
  dasaraInvitation: 'దసరా పండుగ ఆహ్వానం',
  dasaraSpecial: 'దసరా స్పెషల్ ఆఫర్',
  presentCode: 'మా స్టోర్‌లో ఈ కూపన్ కోడ్ చూపించి ₹500 ప్రత్యేక రాయితీ పొందండి',
  tapToCopy: 'కోడ్ కాపీ చేసుకోండి',
  codeCopied: 'కోడ్ కాపీ అయ్యింది! ✓',
  getDirections: 'రూట్ మ్యాప్ (గూగుల్ మ్యాప్స్)',
  artisanClusters: 'చేనేత కేంద్రాలు',
  boutiqueFlagship: 'ప్రధాన షోరూమ్',
  authenticity: 'నాణ్యతా ప్రమాణాలు',
  authenticityDesc: 'ప్రతి చీరకు సిల్క్ మార్క్ మరియు చేనేత నాణ్యత సర్టిఫికేట్ లభిస్తుంది.',
  pureSilkBadge: '100% ప్యూర్ సిల్క్',
  copyright: 'అన్ని హక్కులు ప్రత్యేకించబడ్డాయి',
  tagline: 'సంప్రదాయం ఉట్టిపడే చేనేత కళా వైభవం',
};

export function getProductTeluguSubtitle(category: string): string {
  switch (category) {
    case 'Kanchi Pattu':
      return 'కంచి పట్టు చేనేత చీర (ప్యూర్ జరీ)';
    case 'Banarasi Silk':
      return 'బనారస్ రాయల్ జరీ పట్టు చీర';
    case 'Organza':
      return 'తేలికపాటి ఆర్గంజా డిజైనర్ చీర';
    case 'Fancy Sarees':
      return 'నూతన ఫ్యాన్సీ పార్టీవేర్ చీర';
    case 'Partywear & Kurtis':
      return 'గ్రాండ్ పార్టీవేర్ కుర్తీ డ్రెస్';
    default:
      return 'స్వచ్ఛమైన చేనేత పట్టు చీర';
  }
}

export function getTeluguSareeName(name: string, category?: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('kanchi') || lower.includes('kanchipuram')) {
    return 'కంచి పట్టు చేనేత చీర';
  }
  if (lower.includes('banaras') || lower.includes('banarasi')) {
    return 'బనారస్ రాయల్ జరీ చీర';
  }
  if (lower.includes('gadwal')) {
    return 'గద్వాల్ సంప్రదాయ చేనేత';
  }
  if (lower.includes('dharmavaram')) {
    return 'ధర్మవరం పట్టు చీర';
  }
  if (lower.includes('mysore')) {
    return 'మైసూర్ పట్టు చీర';
  }
  if (lower.includes('organza')) {
    return 'ఆర్గంజా డిజైనర్ చీర';
  }
  if (lower.includes('tissue')) {
    return 'గోల్డెన్ టిష్యూ పట్టు చీర';
  }
  if (lower.includes('fancy')) {
    return 'నూతన ఫ్యాన్సీ చీర';
  }
  if (lower.includes('pattu')) {
    return 'స్వచ్ఛమైన పట్టు చీర';
  }
  if (category) {
    return getProductTeluguSubtitle(category);
  }
  return 'స్వచ్ఛమైన చేనేత చీర';
}

export const HERO_ARCH_ITEMS = [
  {
    name: 'Royal Kanchipuram Silk',
    teluguName: 'రాజసం ఉట్టిపడే కంచి పట్టు',
    image: '/hero-1.jpg',
    subtitle: 'AUTHENTIC PURE ZARI',
    teluguSubtitle: 'స్వచ్ఛమైన జరీ చేనేత',
  },
  {
    name: 'Emerald Banarasi Brocade',
    teluguName: 'ఎమరాల్డ్ బనారస్ బ్రోకేడ్',
    image: '/hero-2.jpg',
    subtitle: 'HERITAGE WEAVE',
    teluguSubtitle: 'వారసత్వ కళా నేత',
  },
  {
    name: 'Majestic Gadwal Handloom',
    teluguName: 'సాంప్రదాయ గద్వాల్ చేనేత',
    image: '/hero-3.jpg',
    subtitle: 'CONTRASTING BORDERS',
    teluguSubtitle: 'కాంట్రాస్ట్ జరీ అంచు',
  },
  {
    name: 'Golden Tissue Silk',
    teluguName: 'మేలిమి గోల్డెన్ టిష్యూ పట్టు',
    image: '/hero-4.jpg',
    subtitle: 'SHIMMERING ELEGANCE',
    teluguSubtitle: 'ధగధగలాడే మేలిమి మెరుపు',
  },
];
