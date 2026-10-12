import { SareeProduct } from './product.types';

export type SareeAngleType = 'full_drape' | 'pallu_macro' | 'border_selvedge' | 'blouse_piece';

export interface SareeAngleImage {
  angle: SareeAngleType;
  label: string;
  hindiLabel: string;
  url: string;
  description: string;
}

export type ZoomLevel = 2.0 | 3.0 | 4.5;

export interface TechnicalWeaveSpecs {
  loomType: string;
  warpComposition: string;
  weftComposition: string;
  threadCountWarpWeft: string;
  interlockTechnique: string;
  approxDaysOnLoom: number;
}

export interface PurityZariSpecs {
  silkMarkRegNumber: string;
  silkType: string;
  zariGrade: 'Pure 24K Gold Electroplated' | '2G Tested Silver-Gilt Zari' | 'Rich Metallic Resham';
  approxSareeWeightGrams: number;
  zariPurityRating: string;
}

export interface BlouseStylingSpecs {
  blouseLengthMeters: number;
  blouseType: 'Contrast' | 'Running' | 'Heavy Brocade';
  sleeveBorderWidthInches: number;
  recommendedNecklines: string[];
  recommendedJewelry: string[];
  auspiciousOccasions: string[];
}

/**
 * Standard Angle Metadata definitions
 */
export const SAREE_ANGLE_DEFINITIONS: Record<
  SareeAngleType,
  { label: string; hindiLabel: string; defaultDescription: string }
> = {
  full_drape: {
    label: 'Full Drape',
    hindiLabel: 'పూర్తి చీర (Full)',
    defaultDescription: 'Full silhouette, pleat fall, and complete body motif distribution',
  },
  pallu_macro: {
    label: 'Grand Pallu',
    hindiLabel: 'కొంగు / పల్లు (Pallu)',
    defaultDescription: 'High-density gold zari jaal and intricate temple motifs',
  },
  border_selvedge: {
    label: 'Zari Border',
    hindiLabel: 'జరీ అంచు (Border)',
    defaultDescription: 'Hand-locked Korvai selvedge and warp/weft interlock detail',
  },
  blouse_piece: {
    label: 'Blouse Piece',
    hindiLabel: 'బ్లౌజ్ ముక్క (Blouse)',
    defaultDescription: 'Unstitched matching blouse fabric with heavy sleeve zari borders',
  },
};

/**
 * Generates calibrated angle image list for any SareeProduct.
 * Maps all uploaded images in product.images so shoppers can inspect all uploaded angles.
 */
export function getProductAngleImages(product: SareeProduct): SareeAngleImage[] {
  if (product.angleImages && product.angleImages.length >= 4) {
    return product.angleImages;
  }

  const imgs = product.images && product.images.length > 0 ? product.images : [];
  
  if (imgs.length === 0) {
    return [
      {
        angle: 'full_drape',
        label: 'Front Drape',
        hindiLabel: 'ముందు భాగం',
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
        description: SAREE_ANGLE_DEFINITIONS.full_drape.defaultDescription,
      },
    ];
  }

  const standardMeta: { angle: SareeAngleType; label: string; hindiLabel: string; desc: string }[] = [
    {
      angle: 'full_drape',
      label: 'Front Drape',
      hindiLabel: 'ముందు భాగం',
      desc: SAREE_ANGLE_DEFINITIONS.full_drape.defaultDescription,
    },
    {
      angle: 'pallu_macro',
      label: 'Grand Pallu',
      hindiLabel: 'భవ్య పల్లూ',
      desc: product.zariType
        ? `${product.zariType} featuring high-density motifs and regal finish`
        : SAREE_ANGLE_DEFINITIONS.pallu_macro.defaultDescription,
    },
    {
      angle: 'border_selvedge',
      label: 'Zari Border',
      hindiLabel: 'అంచు / బార్డర్',
      desc: product.weaveSpecs?.interlockTechnique
        ? `${product.weaveSpecs.interlockTechnique} and warp/weft interlock detail`
        : SAREE_ANGLE_DEFINITIONS.border_selvedge.defaultDescription,
    },
    {
      angle: 'blouse_piece',
      label: 'Blouse / Back',
      hindiLabel: 'బ్లౌజ్ / బ్యాక్',
      desc: product.blouseDetails || SAREE_ANGLE_DEFINITIONS.blouse_piece.defaultDescription,
    },
  ];

  return imgs.map((url, idx) => {
    if (idx < standardMeta.length) {
      return {
        angle: standardMeta[idx].angle,
        label: standardMeta[idx].label,
        hindiLabel: standardMeta[idx].hindiLabel,
        url,
        description: standardMeta[idx].desc,
      };
    }

    return {
      angle: 'full_drape' as SareeAngleType,
      label: `Angle ${idx + 1}`,
      hindiLabel: `ఓపెన్ వ్యూ ${idx + 1}`,
      url,
      description: `Detailed perspective #${idx + 1} of the saree`,
    };
  });
}
