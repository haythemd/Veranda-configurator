export interface PlantCalibration {
  realHeightCm: number;
  realSpreadCm: number;
  imageWidthPx: number;
  imageHeightPx: number;
  // Natural display scale: Olive = 0.82, Monstera = 0.86, Ficus = 0.78 (tall standard), Snake Plant = 0.80
  scaleRatio: number;
  // Base stem width percentage relative to pot rim
  baseStemWidthPercent: number;
}

export interface PotCalibration {
  realDiameterCm: number;
  realHeightCm: number;
  imageWidthPx: number;
  imageHeightPx: number;
  // Sits on top of the stone pedestal (15.5% from bottom of container)
  stoneSeatBottomPercent: number;
  // Calibrated width on stage so real pot diameter looks physically proportional to stone
  displayWidthPercent: number;
}

export interface PlantItem {
  id: string;
  name: string;
  botanicalName: string;
  family: string;
  price: number;
  // 100% clean transparent PNG cutout centered on the stem base
  image: string;
  editorialImage: string;
  heightCm: number;
  spreadCm: number;
  plantToPotRatio: string;
  ratioScore: number;
  lightRequirement: string;
  waterFrequency: string;
  humidity: string;
  petSafe: boolean;
  difficulty: 'Beginner' | 'Moderate' | 'Indestructible';
  airPurifying: boolean;
  tagline: string;
  description: string;
  careTips: string[];
  calibration: PlantCalibration;
}

export interface PotItem {
  id: string;
  name: string;
  material: string;
  finish: string;
  colorHex: string;
  price: number;
  diameterCm: number;
  heightCm: number;
  weightKg: number;
  drainage: boolean;
  origin: string;
  description: string;
  features: string[];
  // 100% clean transparent PNG with dark soil inside, zero floor shadow
  image: string;
  // Exact attribute offset for the plant base to sit aligned with the pot soil in the middle
  soilOffsetBottomPercent: number;
  // Backward compatibility alias
  plantBaseAnchorBottomPercent: number;
  calibration: PotCalibration;
}

export interface StudioLightingPreset {
  id: string;
  name: string;
  kelvin: string;
  description: string;
  colorFilter: string;
  ambientTone: string;
}

export const STUDIO_BACKGROUND = '/src/assets/images/travertine_studio_background.jpg';

export const PLANTS: PlantItem[] = [
  {
    id: 'olive',
    name: 'Dwarf Mediterranean Olive',
    botanicalName: 'Olea europaea',
    family: 'Oleaceae',
    price: 130,
    image: '/src/assets/images/clean_plant_olive_final.png',
    editorialImage: '/src/assets/images/olive_tree_travertine_studio_1791494503003.jpg',
    heightCm: 75,
    spreadCm: 56,
    plantToPotRatio: '1.8 : 1',
    ratioScore: 1.8,
    lightRequirement: 'Direct bright sunlight (6+ hours daily)',
    waterFrequency: 'Every 8–10 days with deep drainage',
    humidity: 'Low to moderate (prefers dry air)',
    petSafe: true,
    difficulty: 'Moderate',
    airPurifying: false,
    tagline: 'Artisanal aged woody trunk crowned with soft silvery-sage foliage.',
    description:
      'Imbued with Mediterranean warmth and quiet luxury. Pruned in the classic Tuscan bonsai standard, this dwarf olive tree features a deeply textured cork bark trunk and delicate dual-toned leaves that shimmer silvery-grey in directional studio light.',
    careTips: [
      'Place by a south- or west-facing window for optimal foliage density',
      'Ensure soil dries between watering; sensitive to standing root water',
      '100% non-toxic and certified pet-safe for cats and dogs'
    ],
    calibration: {
      realHeightCm: 75,
      realSpreadCm: 56,
      imageWidthPx: 896,
      imageHeightPx: 1200,
      scaleRatio: 0.82,
      baseStemWidthPercent: 22,
    }
  },
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    botanicalName: 'Monstera deliciosa',
    family: 'Araceae',
    price: 85,
    image: '/src/assets/images/clean_plant_monstera_final.png',
    editorialImage: '/src/assets/images/monstera_ceramic_studio_1791494472472.jpg',
    heightCm: 95,
    spreadCm: 78,
    plantToPotRatio: '2.2 : 1',
    ratioScore: 2.2,
    lightRequirement: 'Bright, indirect ambient sunlight',
    waterFrequency: 'Every 7–10 days when topsoil is dry',
    humidity: '55%–70% preferred',
    petSafe: false,
    difficulty: 'Beginner',
    airPurifying: true,
    tagline: 'Iconic Swiss Cheese architectural foliage with perforated fenestrations.',
    description:
      'Celebrated for its broad, sculptured split leaves, the Monstera Deliciosa introduces instant organic drama to minimalist interiors. Grown slowly under optimal nursery conditions to achieve mature fenestrations, robust aerial roots, and deep emerald pigmentation.',
    careTips: [
      'Wipe foliage monthly with a damp cloth to maximize photosynthesis',
      'Rotate 90 degrees every month to promote balanced directional growth',
      'Thrives when paired with well-draining, airy aroid substrate'
    ],
    calibration: {
      realHeightCm: 95,
      realSpreadCm: 78,
      imageWidthPx: 896,
      imageHeightPx: 1200,
      scaleRatio: 0.86,
      baseStemWidthPercent: 26,
    }
  },
  {
    id: 'ficus',
    name: 'Ficus Lyrata',
    botanicalName: 'Ficus lyrata',
    family: 'Moraceae',
    price: 110,
    image: '/src/assets/images/clean_plant_ficus_final.png',
    editorialImage: '/src/assets/images/ficus_terracotta_studio_1791494483454.jpg',
    heightCm: 140,
    spreadCm: 62,
    plantToPotRatio: '2.8 : 1',
    ratioScore: 2.8,
    lightRequirement: 'High, bright filtered sunlight',
    waterFrequency: 'Every 10–14 days, soak thoroughly',
    humidity: '45%–60% standard',
    petSafe: false,
    difficulty: 'Moderate',
    airPurifying: true,
    tagline: 'Majestic upright standard with oversized violin-shaped leathery leaves.',
    description:
      'A true architectural showstopper. The Fiddle Leaf Fig boasts towering vertical presence and scalloped emerald leaves that catch and reflect studio light. Pruned to a single woody trunk for a clean museum-grade silhouette.',
    careTips: [
      'Position in consistent indirect light; avoid drafty air conditioning vents',
      'Allow the top 2 inches of soil to completely dry out between soakings',
      'Support the single central trunk as it thickens with maturity'
    ],
    calibration: {
      realHeightCm: 140,
      realSpreadCm: 62,
      imageWidthPx: 896,
      imageHeightPx: 1200,
      scaleRatio: 0.78, // Zoomed out to comfortably frame tall canopy
      baseStemWidthPercent: 16,
    }
  },
  {
    id: 'snakeplant',
    name: 'Sansevieria Laurentii',
    botanicalName: 'Dracaena trifasciata',
    family: 'Asparagaceae',
    price: 65,
    image: '/src/assets/images/clean_plant_snake_final.png',
    editorialImage: '/src/assets/images/snakeplant_sandstone_studio_1791494492639.jpg',
    heightCm: 85,
    spreadCm: 38,
    plantToPotRatio: '2.0 : 1',
    ratioScore: 2.0,
    lightRequirement: 'Adaptable (low light to partial direct sun)',
    waterFrequency: 'Every 2–3 weeks, very drought tolerant',
    humidity: 'Tolerates dry indoor heating',
    petSafe: false,
    difficulty: 'Indestructible',
    airPurifying: true,
    tagline: 'Crisp upright sword leaves with prominent gold margins and marble banding.',
    description:
      'Pure geometric modernism. The Snake Plant delivers striking verticality without spreading sideways, making it the premier choice for sleek corners, bedside plinths, and architectural consoles. Highly efficient oxygen producer during evening hours.',
    careTips: [
      'Water sparingly; root ball prefers staying dry over excess moisture',
      'Can survive in low-light office environments with minimal natural windows',
      'Never allow water to stand in the central rosette crown'
    ],
    calibration: {
      realHeightCm: 85,
      realSpreadCm: 38,
      imageWidthPx: 896,
      imageHeightPx: 1200,
      scaleRatio: 0.80,
      baseStemWidthPercent: 20,
    }
  }
];

export const POTS: PotItem[] = [
  {
    id: 'ribbed-alabaster',
    name: 'Ribbed Alabaster Glaze',
    material: 'Kaolin Porcelain & Reactive Dolomite Glaze',
    finish: 'Satin Chalk White / Soft Ribbed',
    colorHex: '#EAE6DF',
    price: 64,
    diameterCm: 30,
    heightCm: 26,
    weightKg: 5.8,
    drainage: true,
    origin: 'Limoges, France',
    description: 'Satin-touch porcelain with gentle undulating ribs that diffuse highlights softly across its circumference.',
    features: [
      'Subtle satin sheen reactive glaze',
      'Understated Scandinavian minimal profile',
      'Seamless concealed water reservoir plug',
      'Stain-resistant wipe-clean vitrified surface'
    ],
    image: '/src/assets/images/clean_pot_alabaster_final.png',
    // Exact calibrated soil offset attribute where the plant base sits in the middle
    soilOffsetBottomPercent: 37.0,
    plantBaseAnchorBottomPercent: 37.0,
    calibration: {
      realDiameterCm: 30,
      realHeightCm: 26,
      imageWidthPx: 833,
      imageHeightPx: 770,
      stoneSeatBottomPercent: 15.5,
      displayWidthPercent: 38.0,
    }
  },
  {
    id: 'basalt-ceramic',
    name: 'Fluted Basalt Ceramic',
    material: 'Vitrified High-Fire Stoneware',
    finish: 'Matte Anthracite / Vertical Fluted',
    colorHex: '#252628',
    price: 68,
    diameterCm: 32,
    heightCm: 28,
    weightKg: 6.2,
    drainage: true,
    origin: 'Hand-thrown in Seto, Japan',
    description: 'Precision vertical fluting creates tactile rhythm and subtle shadow play under directional studio lighting.',
    features: [
      'Precision fluted exterior texture',
      'Recessed integrated drainage basin',
      'Silicone floor-protection bumpers',
      'Non-porous glazed interior lining'
    ],
    image: '/src/assets/images/clean_pot_basalt_final.png',
    soilOffsetBottomPercent: 38.0,
    plantBaseAnchorBottomPercent: 38.0,
    calibration: {
      realDiameterCm: 32,
      realHeightCm: 28,
      imageWidthPx: 547,
      imageHeightPx: 701,
      stoneSeatBottomPercent: 15.5,
      displayWidthPercent: 30.0,
    }
  },
  {
    id: 'terracotta-cylinder',
    name: 'Tuscan Terracotta Cylinder',
    material: 'Natural High-Density Impruneta Clay',
    finish: 'Raw Porous Earthenware / Ochre Patina',
    colorHex: '#C07D5A',
    price: 48,
    diameterCm: 30,
    heightCm: 30,
    weightKg: 5.4,
    drainage: true,
    origin: 'Fired in Tuscany, Italy',
    description: 'Breathes naturally through porous clay walls to regulate root moisture and develop an authentic organic patina over time.',
    features: [
      'Naturally breathable microporous wall',
      'Subtle hand-bevelled top lip',
      'Includes matching low-profile clay saucer',
      '100% natural mineral pigmentation'
    ],
    image: '/src/assets/images/clean_pot_terracotta_final.png',
    soilOffsetBottomPercent: 37.8,
    plantBaseAnchorBottomPercent: 37.8,
    calibration: {
      realDiameterCm: 30,
      realHeightCm: 30,
      imageWidthPx: 572,
      imageHeightPx: 729,
      stoneSeatBottomPercent: 15.5,
      displayWidthPercent: 29.0,
    }
  },
  {
    id: 'sandstone-taper',
    name: 'Cast Sandstone Taper',
    material: 'Sedimentary Quartz & Fine Mineral Composite',
    finish: 'Warm Dune Sand / Tactile Grain',
    colorHex: '#D6C5A9',
    price: 74,
    diameterCm: 29,
    heightCm: 32,
    weightKg: 7.9,
    drainage: true,
    origin: 'Crafted in Jalisco, Mexico',
    description: 'Sculptural conical taper with micro-aggregate mineral flecks that ground large architectural botanicals with weighted stability.',
    features: [
      'Heavy wind-stable weighted base',
      'Fine-grit honed travertine touch',
      'Removable brass internal drainage grommet',
      'Thermal insulation protects root temperature'
    ],
    image: '/src/assets/images/clean_pot_sandstone_final.png',
    soilOffsetBottomPercent: 37.4,
    plantBaseAnchorBottomPercent: 37.4,
    calibration: {
      realDiameterCm: 29,
      realHeightCm: 32,
      imageWidthPx: 683,
      imageHeightPx: 723,
      stoneSeatBottomPercent: 15.5,
      displayWidthPercent: 33.0,
    }
  }
];

export const LIGHTING_PRESETS: StudioLightingPreset[] = [
  {
    id: 'studio-softbox',
    name: 'Studio Softbox',
    kelvin: '4800K',
    description: 'Balanced commercial strobe with diffuse side fill',
    colorFilter: 'brightness(1.0) contrast(1.0)',
    ambientTone: '#F5F4F0',
  },
  {
    id: 'warm-sunrise',
    name: 'Morning Amber',
    kelvin: '3200K',
    description: 'Warm raking sunbeams with rich organic warmth',
    colorFilter: 'sepia(0.06) saturate(1.08) brightness(1.02)',
    ambientTone: '#FAF4E8',
  },
  {
    id: 'moody-architectural',
    name: 'Architectural Charcoal',
    kelvin: '5600K',
    description: 'High-contrast focused key spotlight with deep drop shadow',
    colorFilter: 'contrast(1.06) saturate(0.96)',
    ambientTone: '#EAE9E6',
  }
];

export interface CartItem {
  id: string;
  plant: PlantItem;
  pot: PotItem;
  quantity: number;
  includeSaucer: boolean;
  organicSubstrateIncluded: boolean;
  unitPrice: number;
  totalPrice: number;
}
