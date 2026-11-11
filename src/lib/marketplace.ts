import { Product, Collection, Maker, ProductCategory } from '../types';
import { supabase, supabaseConfigured } from './supabase';

export type DbProduct = any;
export type MarketplaceCategory = { id: string; name: string; slug: string };

const fallbackModules = {
  products: () => import('../data/products'),
  collections: () => import('../data/collections'),
  makers: () => import('../data/makers'),
};

const FALLBACK_SLUGS_BY_ID: Record<string, string> = {
  'prod-01': 'sculptural-raffia-vessel-no-04',
  'prod-02': 'archival-woven-tote-in-saddle-leather',
  'prod-03': 'monolithic-fibre-tapestry-solitude',
  'prod-04': 'ancestral-ceremonial-raffia-mask',
  'prod-05': 'woven-palm-table-runner-set',
  'prod-06': 'indigo-dipped-envelope-clutch',
  'prod-07': 'curators-keepsake-box-edition',
  'prod-08': 'festival-inaugural-commemorative-foulard',
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
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id,name,slug')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getMarketplaceProducts(): Promise<Product[]> {
  if (!supabaseConfigured || !supabase) {
    return (await fallbackModules.products()).PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id,name,slug), collections(id,name,slug), makers(id,name,slug,location,bio), product_images(id,url,alt_text,sort_order,is_primary)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return (await fallbackModules.products()).PRODUCTS;
    }

    return data.map(mapProduct);
  } catch (err) {
    console.warn('Marketplace database unavailable; using fallback catalog.', err);
    return (await fallbackModules.products()).PRODUCTS;
  }
}

export async function getMarketplaceCollections(): Promise<Collection[]> {
  if (!supabaseConfigured || !supabase) return (await fallbackModules.collections()).COLLECTIONS;

  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*, products(id)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return (await fallbackModules.collections()).COLLECTIONS;

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
  } catch {
    return (await fallbackModules.collections()).COLLECTIONS;
  }
}

export async function getMarketplaceMakers(): Promise<Maker[]> {
  if (!supabaseConfigured || !supabase) return (await fallbackModules.makers()).MAKERS;

  try {
    const { data, error } = await supabase
      .from('makers')
      .select('*, products(id)')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) return (await fallbackModules.makers()).MAKERS;

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
  } catch {
    return (await fallbackModules.makers()).MAKERS;
  }
}

export async function getMarketplaceSettings() {
  const fallbackSettings = {
    whatsapp_number: import.meta.env.VITE_WHATSAPP_NUMBER || '2348012345678',
    bank_name: '',
    account_name: '',
    account_number: '',
    shipping_flat_rate: 15000,
    order_prefix: 'RL',
  };

  if (!supabaseConfigured || !supabase) {
    return fallbackSettings;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('whatsapp_number,bank_name,account_name,account_number,shipping_flat_rate,order_prefix')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) return fallbackSettings;
    return {
      whatsapp_number: data.whatsapp_number || fallbackSettings.whatsapp_number,
      bank_name: data.bank_name || '',
      account_name: data.account_name || '',
      account_number: data.account_number || '',
      shipping_flat_rate: Number(data.shipping_flat_rate ?? 15000),
      order_prefix: data.order_prefix || 'RL',
    };
  } catch {
    return fallbackSettings;
  }
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
  if (!supabaseConfigured || !supabase) {
    throw new Error('Checkout is temporarily unavailable because the order database is not configured. Your cart has not been submitted.');
  }

  if (!payload.items.length) {
    throw new Error('Your cart is empty.');
  }

  // The database RPC expects snake_case keys. Passing the UI's camelCase
  // fields directly caused the RPC to fail and the old code to fabricate
  // a local order number that was never saved.
  const customer = {
    name: `${payload.customer.firstName.trim()} ${payload.customer.lastName.trim()}`.trim(),
    email: payload.customer.email.trim(),
    phone: payload.customer.phone.trim(),
    address: payload.customer.address.trim(),
    city: payload.customer.city.trim(),
    state: payload.customer.stateRegion.trim(),
    country: payload.customer.country.trim() || 'Nigeria',
    postal_code: payload.customer.postalCode?.trim() || '',
    notes: payload.customer.patronNotes?.trim() || '',
  };

  // Resolve legacy cart IDs/slugs to the live product UUIDs expected by SQL.
  const { data: dbProducts, error: productError } = await supabase
    .from('products')
    .select('id, slug')
    .eq('is_active', true);
  if (productError) {
    throw new Error(`We could not verify product availability: ${productError.message}`);
  }

  const resolvedItems = payload.items.map((item) => {
    const match = dbProducts?.find((product) =>
      product.id === item.productId ||
      product.slug === item.productId ||
      product.slug === FALLBACK_SLUGS_BY_ID[item.productId]
    );
    if (!match) {
      throw new Error('One of the products in your cart is no longer available. Please refresh your cart.');
    }
    return { product_id: match.id, quantity: item.quantity };
  });

  const { data, error } = await supabase.rpc('create_manual_order', {
    p_customer: customer,
    p_items: resolvedItems,
  });

  if (error) {
    console.error('Supabase create_manual_order RPC failed:', error.message);
    throw new Error(`We could not save your order: ${error.message}`);
  }
  if (!data?.success || !data?.order_id || !data?.order_number) {
    throw new Error('The order database did not confirm that your order was saved. Please try again.');
  }

  return data as {
    success: true;
    order_id: string;
    order_number: string;
    subtotal: number;
    shipping_fee: number;
    total: number;
    whatsapp_number: string;
    bank_name: string;
    account_name: string;
    account_number: string;
  };
}
