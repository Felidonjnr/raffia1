import { createClient } from '@supabase/supabase-js';

// Parse environment variables with intelligent detection
let envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
let envKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Smart recovery: If the user configured the Supabase URL in VITE_SUPABASE_PUBLISHABLE_KEY, detect it!
if (!envUrl && (envKey.startsWith('http://') || envKey.startsWith('https://'))) {
  envUrl = envKey;
  envKey = '';
} else if (envUrl && !envUrl.startsWith('http') && (envKey.startsWith('http://') || envKey.startsWith('https://'))) {
  const tmp = envUrl;
  envUrl = envKey;
  envKey = tmp;
}

const localUrl = typeof window !== 'undefined' ? (window.localStorage.getItem('raffia_supabase_url') || '').trim() : '';
const localKey = typeof window !== 'undefined' ? (window.localStorage.getItem('raffia_supabase_key') || '').trim() : '';

export const supabaseUrl = (localUrl || envUrl).trim();
export const supabasePublishableKey = (localKey || envKey).trim();

export const supabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabasePublishableKey &&
  supabasePublishableKey.length > 10
);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function setLocalSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      window.localStorage.setItem('raffia_supabase_url', url.trim());
      window.localStorage.setItem('raffia_supabase_key', key.trim());
    } else {
      window.localStorage.removeItem('raffia_supabase_url');
      window.localStorage.removeItem('raffia_supabase_key');
    }
    window.location.reload();
  }
}

export function clearLocalSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('raffia_supabase_url');
    window.localStorage.removeItem('raffia_supabase_key');
    window.location.reload();
  }
}

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY or connect in Admin.');
  }
  return supabase;
}

export interface SupabaseHealthReport {
  configured: boolean;
  connected: boolean;
  url: string;
  hasKey: boolean;
  projectRef: string;
  tables: {
    categories: boolean;
    collections: boolean;
    makers: boolean;
    products: boolean;
    product_images: boolean;
    site_settings: boolean;
    orders: boolean;
  };
  storageBucket: boolean;
  error?: string;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealthReport> {
  const url = supabaseUrl;
  const hasKey = Boolean(supabasePublishableKey);
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/);
  const projectRef = match ? match[1] : '';

  const report: SupabaseHealthReport = {
    configured: supabaseConfigured,
    connected: false,
    url,
    hasKey,
    projectRef,
    tables: {
      categories: false,
      collections: false,
      makers: false,
      products: false,
      product_images: false,
      site_settings: false,
      orders: false,
    },
    storageBucket: false,
  };

  if (!supabase || !hasKey) {
    report.error = !url
      ? 'Supabase Project URL is missing.'
      : 'Supabase Anon / Publishable API key is missing.';
    return report;
  }

  try {
    const [catRes, colRes, makRes, prodRes, imgRes, setRes, ordRes] = await Promise.all([
      supabase.from('categories').select('id').limit(1),
      supabase.from('collections').select('id').limit(1),
      supabase.from('makers').select('id').limit(1),
      supabase.from('products').select('id').limit(1),
      supabase.from('product_images').select('id').limit(1),
      supabase.from('site_settings').select('id').limit(1),
      supabase.from('orders').select('id').limit(1),
    ]);

    report.tables.categories = !catRes.error;
    report.tables.collections = !colRes.error;
    report.tables.makers = !makRes.error;
    report.tables.products = !prodRes.error;
    report.tables.product_images = !imgRes.error;
    report.tables.site_settings = !setRes.error;
    report.tables.orders = !ordRes.error;

    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      report.storageBucket = Boolean(buckets?.some((b) => b.name === 'marketplace' || b.id === 'marketplace'));
    } catch {
      report.storageBucket = false;
    }

    const anyOk = Object.values(report.tables).some(Boolean);
    report.connected = anyOk;

    if (!anyOk) {
      const err = prodRes.error || catRes.error || ordRes.error;
      report.error = err ? err.message : 'Database tables not found. Run SQL migration in Supabase.';
    }
  } catch (err: any) {
    report.error = err?.message || 'Failed to reach Supabase API.';
  }

  return report;
}
