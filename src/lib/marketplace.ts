import { Product, Collection, Maker, ProductCategory } from '../types';
import { supabase, supabaseConfigured } from './supabase';

export type DbProduct = any;
export type MarketplaceCategory = { id: string; name: string; slug: string };

const fallbackModules = {
  products: () => import('../data/products'),
  collections: () => import('../data/collections'),
  makers: () => import('../data/makers'),
};

function mapProduct(row: any): Product {
  const maker = row.makers || {};
  const images = (row.product_images || [])
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((x: any) => x.url)
    .filter(Boolean);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.short_description || row.subtitle || '',
    price: Number(row.price),
    currency: row.currency || 'NGN',
    category: (row.categories?.name || row.category || 'TRADITIONAL CRAFT') as ProductCategory,
    collection: row.collections?.slug || row.collection_slug || '',
    maker: {
      id: maker.id || row.maker_id || '',
      slug: maker.slug || '',
      name: maker.name || 'Raffia Legacy Maker',
      region: maker.location || '',
      story: maker.bio || '',
    },
    image: row.cover_image || images[0] || '',
    gallery: images.length ? images : row.cover_image ? [row.cover_image] : [],
    materials: row.materials || [],
    origin: row.origin || '',
    availability: row.availability || 'IN STOCK',
    leadTime: row.lead_time || undefined,
    description: row.description || '',
    dimensions: row.dimensions || '',
    care: row.care || '',
    featured: Boolean(row.is_featured),
    newArrival: Boolean(row.is_new),
    isNewArrival: Boolean(row.is_new),
    featuredObject: Boolean(row.is_featured),
  };
}


export async function getMarketplaceCategories(): Promise<MarketplaceCategory[]> {
  if (!supabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('id,name,slug')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error || !data) return [];
  return data;
}

export async function getMarketplaceProducts(): Promise<Product[]> {
  if (!supabaseConfigured || !supabase) {
    return (await fallbackModules.products()).PRODUCTS;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id,name,slug), collections(id,name,slug), makers(id,name,slug,location,bio), product_images(id,url,alt_text,sort_order,is_primary)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.warn('Marketplace database unavailable; using local catalog.', error?.message);
    return (await fallbackModules.products()).PRODUCTS;
  }

  return data.map(mapProduct);
}

export async function getMarketplaceCollections(): Promise<Collection[]> {
  if (!supabaseConfigured || !supabase) return (await fallbackModules.collections()).COLLECTIONS;

  const { data, error } = await supabase
    .from('collections')
    .select('*, products(id)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error || !data) return (await fallbackModules.collections()).COLLECTIONS;

  return data.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.name,
    subtitle: row.subtitle || '',
    description: row.description || '',
    coverImage: row.cover_image || '',
    aspectRatio: row.aspect_ratio || '4:3',
    curatorNotes: row.curator_notes || '',
    productIds: (row.products || []).map((p: any) => p.id),
  }));
}

export async function getMarketplaceMakers(): Promise<Maker[]> {
  if (!supabaseConfigured || !supabase) return (await fallbackModules.makers()).MAKERS;

  const { data, error } = await supabase
    .from('makers')
    .select('*, products(id)')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error || !data) return (await fallbackModules.makers()).MAKERS;

  return data.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title || '',
    location: row.location || '',
    discipline: row.discipline || '',
    speciality: row.speciality || '',
    bio: row.bio || '',
    quote: row.quote || '',
    heritageNotes: row.heritage_notes || '',
    image: row.image || '',
    productIds: (row.products || []).map((p: any) => p.id),
  }));
}

export async function getMarketplaceSettings() {
  if (!supabaseConfigured || !supabase) {
    return { whatsapp_number: import.meta.env.VITE_WHATSAPP_NUMBER || '', shipping_flat_rate: 15000 };
  }

  const { data } = await supabase
    .from('site_settings')
    .select('whatsapp_number,shipping_flat_rate')
    .eq('id', 1)
    .maybeSingle();

  return data || { whatsapp_number: import.meta.env.VITE_WHATSAPP_NUMBER || '', shipping_flat_rate: 15000 };
}

export function buildWhatsAppUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : '';
}

export async function createManualOrder(payload: {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    stateRegion: string;
    country: string;
    postalCode?: string;
    patronNotes?: string;
  };
  items: { productId: string; quantity: number }[];
}) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.rpc('create_manual_order', {
    p_customer: payload.customer,
    p_items: payload.items,
  });

  if (error) throw error;
  return data as { order_id: string; order_number: string; subtotal: number; shipping_fee: number; total: number; whatsapp_number: string };
}
