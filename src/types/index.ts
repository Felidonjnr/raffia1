export type ProductCategory =
  | 'ALL'
  | 'TRADITIONAL CRAFT'
  | 'OBJECTS & LIVING'
  | 'ART & TEXTILES'
  | 'FASHION & ACCESSORIES'
  | 'HOME & LIFESTYLE'
  | 'ART & DESIGN'
  | 'GIFTS'
  | 'FESTIVAL MERCHANDISE';

export interface ProductMaker {
  id: string;
  slug: string;
  name: string;
  region: string;
  story: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  category: ProductCategory;
  collection: string; // e.g., 'the-river-and-the-loom', 'living-architecture', 'gallery-tapestries'
  maker: ProductMaker;
  image: string;
  gallery: string[];
  materials: string[];
  origin: string;
  availability: 'IN STOCK' | 'MADE TO ORDER' | 'LIMITED EDITION' | 'ARCHIVE ONLY';
  leadTime?: string;
  description: string;
  dimensions: string;
  care: string;
  featured?: boolean;
  newArrival?: boolean;
  isNewArrival?: boolean;
  featuredObject?: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  aspectRatio: '16:9' | '4:3' | '3:4' | '1:1';
  curatorNotes: string;
  productIds: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Maker {
  id: string;
  slug: string;
  name: string;
  title: string;
  location: string;
  discipline: string;
  speciality: string;
  bio: string;
  quote: string;
  heritageNotes: string;
  image: string;
  productIds: string[];
}

export interface Pillar {
  number: string;
  title: string;
  tagline: string;
  description: string;
  details: string[];
  accentColor?: string;
}

export interface LegacyYearStage {
  step: string;
  title: string;
  program: string;
  timeframe: string;
  summary: string;
  outcomes: string[];
}

export interface FestivalExperience {
  number: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
}

export interface RaffiaTopic {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  shortDesc: string;
  content: string[];
  keyFacts: { label: string; value: string }[];
  quote?: string;
}

export type ViewRoute =
  | { type: 'home' }
  | { type: 'marketplace'; category?: ProductCategory; collection?: string }
  | { type: 'product'; slug: string }
  | { type: 'collections'; slug?: string }
  | { type: 'makers' }
  | { type: 'maker_detail'; slug: string }
  | { type: 'raffia'; topicSlug?: string }
  | { type: 'project'; section?: 'about' | 'vision' | 'legacy-year' | 'programmes' | 'impact' | 'partners' }
  | { type: 'legacy_year' }
  | { type: 'festival' }
  | { type: 'checkout' }
  | { type: 'get_involved'; section?: 'partner' | 'sponsor' | 'donate' | 'volunteer' | 'maker' | 'schools' | 'young-people' | 'creatives' | 'businesses' | 'media' }
  | { type: 'coming_soon'; title: string; subtitle: string; returnTo?: string };
