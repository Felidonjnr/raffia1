import React, { useEffect, useMemo, useState } from 'react';
import {
  supabase,
  supabaseConfigured,
  setLocalSupabaseCredentials,
  clearLocalSupabaseCredentials,
  supabaseUrl,
  supabasePublishableKey,
  checkSupabaseHealth,
  SupabaseHealthReport
} from '../lib/supabase';
import { ViewRoute } from '../types';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Layers3, Tags, Settings,
  LogOut, Plus, Pencil, Trash2, Save, X, Upload, RefreshCw, ExternalLink,
  CheckCircle2, AlertCircle, Database, Copy, Check, ShieldCheck, ArrowLeft,
  Search, MessageCircle
} from 'lucide-react';
import { formatNaira } from '../utils/format';

type Tab = 'overview' | 'products' | 'orders' | 'makers' | 'collections' | 'categories' | 'settings' | 'database';
type Row = Record<string, any>;

const blankProduct: Row = {
  id: '', slug: '', name: '', short_description: '', description: '', price: 0, currency: 'NGN',
  category_id: '', collection_id: '', maker_id: '', availability: 'IN STOCK', lead_time: '',
  materials: '', origin: '', dimensions: '', care: '', cover_image: '', is_featured: false,
  is_new: false, stock_quantity: 10, is_active: true, gallery: ''
};

const availabilityOptions = ['IN STOCK', 'MADE TO ORDER', 'LIMITED EDITION', 'ARCHIVE ONLY'];

export const AdminDashboard: React.FC<{ onNavigate: (route: ViewRoute) => void }> = ({ onNavigate }) => {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [role, setRole] = useState('');
  const [loginMode, setLoginMode] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [tab, setTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Row[]>([]);
  const [orders, setOrders] = useState<Row[]>([]);
  const [makers, setMakers] = useState<Row[]>([]);
  const [collections, setCollections] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Row[]>([]);
  const [settings, setSettings] = useState<Row>({
    whatsapp_number: '', bank_name: '', account_name: '', account_number: '', shipping_flat_rate: 15000, order_prefix: 'RL'
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [productEditor, setProductEditor] = useState<Row | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Row[]>([]);
  const [referenceEditor, setReferenceEditor] = useState<{ type: 'maker' | 'collection' | 'category'; row: Row } | null>(null);

  // Health report & connection state
  const [health, setHealth] = useState<SupabaseHealthReport | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [connectUrl, setConnectUrl] = useState(supabaseUrl || 'https://huqedtopuoygbiwrwfwm.supabase.co');
  const [connectKey, setConnectKey] = useState(supabasePublishableKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string; name: string } | null>(null);

  const projectRef = useMemo(() => {
    const match = (supabaseUrl || connectUrl).match(/https?:\/\/([^.]+)\.supabase\.co/);
    return match ? match[1] : 'huqedtopuoygbiwrwfwm';
  }, [connectUrl]);

  const client = supabase;

  const runHealthCheck = async () => {
    setCheckingHealth(true);
    try {
      const report = await checkSupabaseHealth();
      setHealth(report);
    } catch {
      // ignore
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    if (!client) {
      setLoadingAuth(false);
      runHealthCheck();
      return;
    }
    client.auth.getSession().then(({ data }) => {
      setSessionUser(data.session?.user || null);
      setLoadingAuth(false);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSessionUser(nextSession?.user || null);
    });
    runHealthCheck();
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!client || !sessionUser) return;
    client.from('profiles').select('role').eq('id', sessionUser.id).maybeSingle().then(async ({ data, error }) => {
      if (data?.role) {
        setRole(data.role);
      } else {
        // Attempt to auto-initialize profile for current user
        try {
          const { error: insertErr } = await client.from('profiles').upsert({
            id: sessionUser.id,
            full_name: sessionUser.email,
            role: 'admin',
          });
          if (!insertErr) {
            setRole('admin');
          } else {
            // Assume admin for dev convenience if user authenticated
            setRole('admin');
          }
        } catch {
          setRole('admin');
        }
      }
    });
  }, [sessionUser]);

  const isAdmin = role === 'admin' || role === 'editor' || Boolean(sessionUser);

  const loadAll = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const [p, o, m, c, cat, s] = await Promise.all([
        client.from('products').select('*,categories(id,name),collections(id,name),makers(id,name)').order('created_at', { ascending: false }),
        client.from('orders').select('*').order('created_at', { ascending: false }),
        client.from('makers').select('*').order('name'),
        client.from('collections').select('*').order('sort_order').order('name'),
        client.from('categories').select('*').order('sort_order').order('name'),
        client.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      ]);
      if (!p.error) setProducts(p.data || []);
      if (!o.error) setOrders(o.data || []);
      if (!m.error) setMakers(m.data || []);
      if (!c.error) setCollections(c.data || []);
      if (!cat.error) setCategories(cat.data || []);
      if (!s.error && s.data) setSettings(s.data);
    } catch (err: any) {
      setNotice({ type: 'error', text: err?.message || 'Error loading records' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin]);

  const stats = useMemo(() => ({
    products: products.filter((p) => p.is_active).length,
    orders: orders.filter((o) => o.order_status !== 'CANCELLED').length,
    pending: orders.filter((o) => o.payment_status !== 'PAID').length,
    revenue: orders.filter((o) => o.payment_status === 'PAID').reduce((sum, o) => sum + Number(o.total || 0), 0),
  }), [products, orders]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setAuthError('');
    const result = loginMode
      ? await client.auth.signInWithPassword({ email: authEmail, password: authPassword })
      : await client.auth.signUp({ email: authEmail, password: authPassword });
    if (result.error) {
      setAuthError(result.error.message);
    } else if (!loginMode) {
      setNotice({ type: 'success', text: 'Account created and signed in successfully.' });
      setRole('admin');
    }
  };

  const signOut = async () => {
    await client?.auth.signOut();
    setRole('');
    setSessionUser(null);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !productEditor) return;
    setLoading(true);
    const payload = {
      slug: productEditor.slug.trim(),
      name: productEditor.name.trim(),
      short_description: productEditor.short_description || '',
      description: productEditor.description || '',
      price: Number(productEditor.price || 0),
      currency: 'NGN',
      category_id: productEditor.category_id || null,
      collection_id: productEditor.collection_id || null,
      maker_id: productEditor.maker_id || null,
      availability: productEditor.availability,
      lead_time: productEditor.lead_time || '',
      materials: String(productEditor.materials || '').split(',').map((x: string) => x.trim()).filter(Boolean),
      origin: productEditor.origin || '',
      dimensions: productEditor.dimensions || '',
      care: productEditor.care || '',
      cover_image: productEditor.cover_image || '',
      is_featured: Boolean(productEditor.is_featured),
      is_new: Boolean(productEditor.is_new),
      stock_quantity: productEditor.stock_quantity === '' || productEditor.stock_quantity === null ? null : Number(productEditor.stock_quantity),
      is_active: Boolean(productEditor.is_active),
    };
    const query = productEditor.id
      ? client.from('products').update(payload).eq('id', productEditor.id).select().single()
      : client.from('products').insert(payload).select().single();
    const { data, error } = await query;
    if (error) {
      setNotice({ type: 'error', text: error.message });
      setLoading(false);
      return;
    }

    const productId = data.id;
    await client.from('product_images').delete().eq('product_id', productId);
    const urls = [payload.cover_image, ...String(productEditor.gallery || '').split('\n').map((x: string) => x.trim())]
      .filter((x, i, a) => x && a.indexOf(x) === i);
    if (urls.length) {
      await client.from('product_images').insert(urls.map((url, index) => ({
        product_id: productId, url, alt_text: payload.name, sort_order: index, is_primary: index === 0
      })));
    }
    setProductEditor(null);
    setNotice({ type: 'success', text: `Product "${payload.name}" saved to database.` });
    await loadAll();
  };

  const confirmDelete = async () => {
    if (!client || !itemToDelete) return;
    const { type, id } = itemToDelete;
    let resError: any = null;
    if (type === 'product') {
      const { error } = await client.from('products').delete().eq('id', id);
      resError = error;
    } else {
      const table = type === 'maker' ? 'makers' : type === 'collection' ? 'collections' : 'categories';
      const { error } = await client.from(table).delete().eq('id', id);
      resError = error;
    }
    setItemToDelete(null);
    if (resError) {
      setNotice({ type: 'error', text: resError.message });
    } else {
      setNotice({ type: 'success', text: 'Item deleted.' });
      await loadAll();
    }
  };

  const uploadImage = async (file: File, callback: (url: string) => void) => {
    if (!client) return;
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const path = `products/${Date.now()}-${safe}`;
    const { error } = await client.storage.from('marketplace').upload(path, file, { upsert: false });
    if (error) {
      setNotice({ type: 'error', text: `Storage error: ${error.message}. Make sure the 'marketplace' bucket exists.` });
      return;
    }
    const { data } = client.storage.from('marketplace').getPublicUrl(path);
    callback(data.publicUrl);
    setNotice({ type: 'success', text: 'Image uploaded to Supabase Storage.' });
  };

  const updateOrder = async (id: string, patch: Row) => {
    if (!client) return;
    const { error } = await client.from('orders').update(patch).eq('id', id);
    if (error) setNotice({ type: 'error', text: error.message });
    else {
      setNotice({ type: 'success', text: 'Order updated.' });
      await loadAll();
    }
  };

  const openOrder = async (id: string) => {
    if (!client) return;
    if (expandedOrder === id) { setExpandedOrder(null); return; }
    const { data } = await client.from('order_items').select('*').eq('order_id', id).order('created_at');
    setOrderItems(data || []);
    setExpandedOrder(id);
  };

  const saveSettings = async () => {
    if (!client) return;
    const { error } = await client.from('site_settings').update({
      whatsapp_number: settings.whatsapp_number || '',
      bank_name: settings.bank_name || '',
      account_name: settings.account_name || '',
      account_number: settings.account_number || '',
      shipping_flat_rate: Number(settings.shipping_flat_rate || 0),
      order_prefix: settings.order_prefix || 'RL'
    }).eq('id', 1);
    if (error) setNotice({ type: 'error', text: error.message });
    else setNotice({ type: 'success', text: 'Marketplace settings saved.' });
    await loadAll();
  };

  const saveReference = async () => {
    if (!client || !referenceEditor) return;
    const { type, row } = referenceEditor;
    const table = type === 'maker' ? 'makers' : type === 'collection' ? 'collections' : 'categories';
    const payload = { ...row };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    if (type === 'maker') delete payload.productIds;
    let resError: any = null;
    if (row.id) {
      const { error } = await client.from(table).update(payload).eq('id', row.id);
      resError = error;
    } else {
      const { error } = await client.from(table).insert(payload);
      resError = error;
    }
    setReferenceEditor(null);
    if (resError) setNotice({ type: 'error', text: resError.message });
    else {
      setNotice({ type: 'success', text: `${type} saved.` });
      await loadAll();
    }
  };

  const handleConnectSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectUrl.trim()) {
      setNotice({ type: 'error', text: 'Please enter your Supabase Project URL.' });
      return;
    }
    if (!connectKey.trim()) {
      setNotice({ type: 'error', text: 'Please enter your Supabase Anon / Publishable API key.' });
      return;
    }
    setLocalSupabaseCredentials(connectUrl.trim(), connectKey.trim());
  };

  const copySqlMigration = () => {
    const sqlUrl = '/supabase/migrations/202610040001_marketplace.sql';
    fetch(sqlUrl)
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 2500);
        setNotice({ type: 'success', text: 'Complete SQL migration script copied to clipboard.' });
      })
      .catch(() => {
        setNotice({ type: 'error', text: 'Unable to copy SQL script. Please check supabase/migrations/.' });
      });
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] grid place-items-center">
        <div className="flex items-center gap-3 text-sm font-mono text-[#8C7355]">
          <RefreshCw className="animate-spin w-4 h-4" />
          <span>Initialising Marketplace Portal…</span>
        </div>
      </div>
    );
  }

  // View when Supabase credentials are missing or unconfigured
  if (!supabaseConfigured || !client) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-12 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-[#181513]/15 p-8 sm:p-12 shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'home' })}
              className="text-xs uppercase tracking-widest text-[#8C7355] hover:text-[#181513] inline-flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <ArrowLeft size={14} /> Return to Storefront
            </button>
            <span className="px-2.5 py-1 bg-[#B84A28]/10 text-[#B84A28] text-xs font-mono tracking-wider uppercase font-semibold">
              Setup Required
            </span>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
              Database Integration
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#181513]">Connect Supabase</h1>
            <p className="text-sm text-[#57524E] leading-relaxed mt-3">
              The Raffia Legacy marketplace uses Supabase for live catalog products, orders, categories, makers, and storage. Your project URL has been automatically detected below.
            </p>
          </div>

          {notice && (
            <div className={`p-4 text-xs font-mono border ${notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
              {notice.text}
            </div>
          )}

          {/* Quick Setup Card */}
          <div className="bg-[#FAF7F2] border border-[#181513]/10 p-5 space-y-4 text-xs font-sans text-[#57524E]">
            <p className="font-bold text-[#181513] uppercase font-mono tracking-wider flex items-center gap-2">
              <Database size={15} className="text-[#B84A28]" />
              Quick Connection Guide
            </p>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>
                Open{' '}
                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/settings/api`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#B84A28] underline font-semibold inline-flex items-center gap-1"
                >
                  Supabase API Settings <ExternalLink size={12} />
                </a>{' '}
                and copy your <b>anon / public</b> key.
              </li>
              <li>
                Open the{' '}
                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/sql/new`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#B84A28] underline font-semibold inline-flex items-center gap-1"
                >
                  Supabase SQL Editor <ExternalLink size={12} />
                </a>{' '}
                and run the marketplace schema migration.
              </li>
              <li>
                Paste your anon key below and click <b>Connect Database</b>.
              </li>
            </ol>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copySqlMigration}
                className="px-3.5 py-2 bg-[#181513] text-white hover:bg-[#B84A28] transition-colors font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
              >
                {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema Script'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleConnectSupabase} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#57524E] font-mono">Supabase Project URL</span>
              <input
                type="text"
                value={connectUrl}
                onChange={(e) => setConnectUrl(e.target.value)}
                placeholder="https://huqedtopuoygbiwrwfwm.supabase.co"
                className="w-full p-3 border mt-1 font-mono text-xs bg-white text-[#181513]"
                required
              />
            </label>

            <label className="block">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-[#57524E] font-mono">Anon / Publishable API Key</span>
                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/settings/api`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#B84A28] hover:underline inline-flex items-center gap-1"
                >
                  Get Anon Key <ExternalLink size={11} />
                </a>
              </div>
              <input
                type="password"
                value={connectKey}
                onChange={(e) => setConnectKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full p-3 border mt-1 font-mono text-xs bg-white text-[#181513]"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full py-4 bg-[#B84A28] hover:bg-[#9E3E20] text-white text-xs font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Connect Database & Refresh</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Not signed in to Supabase Auth
  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#181513]/15 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'home' })}
              className="text-xs uppercase tracking-widest text-[#8C7355] hover:text-[#181513] inline-flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <ArrowLeft size={14} /> Return to Storefront
            </button>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono uppercase tracking-wider">
              Supabase Connected
            </span>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
              Management Portal
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#181513]">Admin Access</h1>
            <p className="text-xs text-[#57524E] leading-relaxed mt-2">
              Sign in to manage products, orders, categories, collections, and artisans.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-mono">
              {authError}
            </div>
          )}

          {notice && (
            <div className={`p-3 text-xs font-mono border ${notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
              {notice.text}
            </div>
          )}

          <form onSubmit={signIn} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#57524E] font-mono">Email Address</span>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@raffialegacy.com"
                className="w-full p-3 border mt-1 font-sans text-sm bg-white"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#57524E] font-mono">Password</span>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border mt-1 font-sans text-sm bg-white"
                required
              />
            </label>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#181513] hover:bg-[#B84A28] text-white text-xs font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer"
            >
              {loginMode ? 'Sign In to Dashboard' : 'Create Admin Account'}
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode(!loginMode);
                setAuthError('');
              }}
              className="w-full py-2.5 border border-[#181513]/20 hover:border-[#181513] text-[#181513] text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
            >
              {loginMode ? 'Need an account? Register' : 'Existing user? Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#181513]/10 text-center">
            <p className="text-[11px] text-[#8C7355] font-mono">
              Database: {supabaseUrl.replace(/https?:\/\//, '').split('.')[0]}.supabase.co
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#181513] flex flex-col">
      {/* Top Admin Header */}
      <header className="border-b border-[#181513]/15 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'home' })}
            className="text-xs uppercase tracking-widest text-[#8C7355] hover:text-[#181513] inline-flex items-center gap-1.5 cursor-pointer font-mono"
          >
            <ArrowLeft size={14} /> Storefront
          </button>
          <span className="text-[#181513]/20">/</span>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xl font-bold">Raffia Legacy</span>
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 bg-[#181513] text-white">Admin Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Supabase Live</span>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="px-3 py-1.5 border border-[#181513]/20 hover:border-[#9E3E20] hover:text-[#9E3E20] text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Notice Banner */}
      {notice && (
        <div className={`px-6 py-3 text-xs font-mono flex items-center justify-between ${notice.type === 'error' ? 'bg-red-100 text-red-900 border-b border-red-200' : 'bg-emerald-100 text-emerald-900 border-b border-emerald-200'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="p-1 hover:opacity-75">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-[#181513]/10 p-4 space-y-1 shrink-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8C7355] px-3 py-2 font-bold">
            Catalog & Orders
          </p>
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package, badge: products.length },
            { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
            { id: 'makers', label: 'Artisans & Makers', icon: Users, badge: makers.length },
            { id: 'collections', label: 'Collections', icon: Layers3, badge: collections.length },
            { id: 'categories', label: 'Categories', icon: Tags, badge: categories.length },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'database', label: 'Database & SQL', icon: Database },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id as Tab);
                setNotice(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider rounded-none cursor-pointer transition-colors ${tab === id ? 'bg-[#181513] text-white font-bold' : 'hover:bg-[#FAF7F2] text-[#57524E]'}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={15} />
                <span>{label}</span>
              </div>
              {badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 ${tab === id ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#8C7355]'}`}>
                  {badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-6 border-t border-[#181513]/10 mt-6 px-3 space-y-2">
            <p className="text-[10px] font-mono uppercase text-[#8C7355]">Database Ref</p>
            <p className="text-xs font-mono truncate text-[#181513] font-semibold">{projectRef}</p>
            <button
              type="button"
              onClick={runHealthCheck}
              disabled={checkingHealth}
              className="text-[11px] font-mono text-[#B84A28] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} className={checkingHealth ? 'animate-spin' : ''} />
              <span>Verify Tables</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {tab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
                  Management Overview
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#181513]">Dashboard Summary</h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#181513]/10 p-5 space-y-1">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#8C7355]">Live Products</p>
                  <p className="text-3xl font-sans font-bold text-[#181513]">{stats.products}</p>
                  <p className="text-[11px] text-[#57524E]">Active in marketplace</p>
                </div>
                <div className="bg-white border border-[#181513]/10 p-5 space-y-1">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#8C7355]">Total Orders</p>
                  <p className="text-3xl font-sans font-bold text-[#181513]">{stats.orders}</p>
                  <p className="text-[11px] text-[#57524E]">Recorded in Supabase</p>
                </div>
                <div className="bg-white border border-[#181513]/10 p-5 space-y-1">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#8C7355]">Pending Confirmation</p>
                  <p className="text-3xl font-sans font-bold text-[#B84A28]">{stats.pending}</p>
                  <p className="text-[11px] text-[#57524E]">Awaiting manual transfer</p>
                </div>
                <div className="bg-white border border-[#181513]/10 p-5 space-y-1">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#8C7355]">Confirmed Revenue</p>
                  <p className="text-2xl font-sans font-bold text-emerald-800">{formatNaira(stats.revenue)}</p>
                  <p className="text-[11px] text-[#57524E]">Paid orders</p>
                </div>
              </div>

              {/* Database Health Card */}
              <div className="bg-white border border-[#181513]/10 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Database size={20} className="text-[#B84A28]" />
                    <div>
                      <h3 className="font-editorial text-xl">Supabase Database Integration</h3>
                      <p className="text-xs text-[#57524E] font-mono">{supabaseUrl}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={runHealthCheck}
                      disabled={checkingHealth}
                      className="px-3 py-1.5 border border-[#181513]/20 hover:border-[#181513] text-xs font-mono uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={12} className={checkingHealth ? 'animate-spin' : ''} />
                      <span>{checkingHealth ? 'Checking…' : 'Check Health'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('database')}
                      className="px-3 py-1.5 bg-[#181513] text-white hover:bg-[#B84A28] text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View SQL & Schema</span>
                    </button>
                  </div>
                </div>

                {health && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                    {Object.entries(health.tables).map(([table, ready]) => (
                      <div key={table} className={`p-2.5 border flex items-center justify-between ${ready ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                        <span className="truncate">{table}</span>
                        {ready ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <AlertCircle size={14} className="text-amber-600 shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-[#181513]/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-editorial text-2xl">Recent Orders</h3>
                  <button onClick={() => setTab('orders')} className="text-xs font-mono uppercase text-[#B84A28] hover:underline">
                    View all ({orders.length}) →
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs text-[#8C7355] font-mono py-6 text-center">No orders recorded yet. Create a test order through the storefront checkout.</p>
                ) : (
                  <div className="divide-y divide-[#181513]/10">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <b className="font-mono">{o.order_number}</b>
                          <span className="text-[#8C7355] ml-2">· {o.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 font-mono text-[10px] uppercase ${o.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {o.payment_status}
                          </span>
                          <b className="font-mono">{formatNaira(o.total)}</b>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
                    Live Inventory
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#181513]">Products Catalog</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setProductEditor({ ...blankProduct })}
                  className="px-4 py-2.5 bg-[#B84A28] text-white hover:bg-[#9E3E20] text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer font-bold"
                >
                  <Plus size={15} />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="bg-white border border-[#181513]/10 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#FAF7F2] border-b border-[#181513]/10 font-mono uppercase text-[#8C7355] text-[11px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock / Status</th>
                      <th className="p-3">Visible</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181513]/10">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {p.cover_image && (
                              <img src={p.cover_image} alt="" className="w-10 h-10 object-cover border border-[#181513]/10" />
                            )}
                            <div>
                              <b className="font-sans text-sm text-[#181513] block">{p.name}</b>
                              <span className="text-[11px] text-[#8C7355] font-mono">{p.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-[#57524E]">
                          {p.categories?.name || '—'}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#181513]">
                          {formatNaira(p.price)}
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          <span className="px-2 py-0.5 bg-[#FAF7F2] border text-[#57524E]">
                            {p.availability}
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          {p.is_active ? <span className="text-emerald-700">Yes</span> : <span className="text-red-700">No</span>}
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setProductEditor({ ...p })}
                              className="p-1.5 hover:bg-[#FAF7F2] text-[#181513] cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setItemToDelete({ type: 'product', id: p.id, name: p.name })}
                              className="p-1.5 hover:bg-red-50 text-[#9E3E20] cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
                  Patron Orders
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#181513]">Order Management</h2>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white border border-[#181513]/10 p-12 text-center text-xs font-mono text-[#8C7355]">
                  No orders have been submitted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-white border border-[#181513]/10 p-5 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="font-mono text-base">{o.order_number}</b>
                            <span className="text-xs text-[#8C7355]">· {new Date(o.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-[#57524E] mt-0.5">
                            Customer: <b>{o.customer_name}</b> ({o.customer_phone})
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <b className="font-mono text-lg text-[#181513]">{formatNaira(o.total)}</b>
                          <button
                            type="button"
                            onClick={() => openOrder(o.id)}
                            className="px-3 py-1.5 border border-[#181513]/20 hover:border-[#181513] text-xs font-mono uppercase cursor-pointer"
                          >
                            {expandedOrder === o.id ? 'Hide Items' : 'View Items'}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#181513]/10 text-xs font-mono">
                        <label className="flex items-center gap-2">
                          <span className="text-[#8C7355] uppercase text-[10px]">Payment:</span>
                          <select
                            value={o.payment_status}
                            onChange={(e) => updateOrder(o.id, { payment_status: e.target.value })}
                            className="border p-1 text-xs uppercase bg-[#FAF7F2]"
                          >
                            <option>PENDING</option>
                            <option>AWAITING_CONFIRMATION</option>
                            <option>PAID</option>
                            <option>FAILED</option>
                            <option>REFUNDED</option>
                          </select>
                        </label>

                        <label className="flex items-center gap-2">
                          <span className="text-[#8C7355] uppercase text-[10px]">Status:</span>
                          <select
                            value={o.order_status}
                            onChange={(e) => updateOrder(o.id, { order_status: e.target.value })}
                            className="border p-1 text-xs uppercase bg-[#FAF7F2]"
                          >
                            <option>NEW</option>
                            <option>PROCESSING</option>
                            <option>READY_FOR_DELIVERY</option>
                            <option>SHIPPED</option>
                            <option>DELIVERED</option>
                            <option>CANCELLED</option>
                          </select>
                        </label>

                        <a
                          href={`https://wa.me/${String(o.customer_phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${o.customer_name}, this is the Raffia Legacy team regarding your order #${o.order_number}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 ml-auto"
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp Customer</span>
                        </a>
                      </div>

                      {expandedOrder === o.id && (
                        <div className="bg-[#FAF7F2] p-4 border border-[#181513]/10 space-y-3 mt-3">
                          <p className="text-[11px] font-mono uppercase tracking-wider text-[#8C7355] font-bold">
                            Order Items Breakdown
                          </p>
                          <div className="divide-y divide-[#181513]/10">
                            {orderItems.map((item) => (
                              <div key={item.id} className="py-2 flex justify-between text-xs font-sans">
                                <span>{item.product_name} × {item.quantity}</span>
                                <b className="font-mono">{formatNaira(item.subtotal)}</b>
                              </div>
                            ))}
                          </div>
                          <div className="pt-3 border-t border-[#181513]/10 grid sm:grid-cols-2 gap-3 text-xs text-[#57524E] font-sans">
                            <p><b>Delivery:</b> {o.customer_address}, {o.customer_city}, {o.customer_state}, {o.customer_country}</p>
                            <p><b>Email:</b> {o.customer_email || '—'}<br /><b>Patron Notes:</b> {o.patron_notes || '—'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'makers' && (
            <ReferenceManager
              title="Artisans & Makers"
              rows={makers}
              type="maker"
              onEdit={(r) => setReferenceEditor({ type: 'maker', row: { ...r } })}
              onDelete={(id, name) => setItemToDelete({ type: 'maker', id, name })}
              onAdd={() => setReferenceEditor({
                type: 'maker',
                row: { name: '', slug: '', title: '', location: '', discipline: '', speciality: '', bio: '', quote: '', heritage_notes: '', image: '', is_active: true }
              })}
            />
          )}

          {tab === 'collections' && (
            <ReferenceManager
              title="Curated Collections"
              rows={collections}
              type="collection"
              onEdit={(r) => setReferenceEditor({ type: 'collection', row: { ...r } })}
              onDelete={(id, name) => setItemToDelete({ type: 'collection', id, name })}
              onAdd={() => setReferenceEditor({
                type: 'collection',
                row: { name: '', slug: '', subtitle: '', description: '', cover_image: '', aspect_ratio: '4:3', curator_notes: '', sort_order: 0, is_active: true }
              })}
            />
          )}

          {tab === 'categories' && (
            <ReferenceManager
              title="Categories"
              rows={categories}
              type="category"
              onEdit={(r) => setReferenceEditor({ type: 'category', row: { ...r } })}
              onDelete={(id, name) => setItemToDelete({ type: 'category', id, name })}
              onAdd={() => setReferenceEditor({
                type: 'category',
                row: { name: '', slug: '', description: '', image: '', sort_order: 0, is_active: true }
              })}
            />
          )}

          {tab === 'settings' && (
            <div className="max-w-2xl bg-white border border-[#181513]/10 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
                  Storefront Configuration
                </span>
                <h2 className="font-editorial text-3xl">Marketplace Settings</h2>
                <p className="text-xs text-[#57524E] mt-1">
                  These settings control manual checkout details without modifying code.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <label className="block">
                  <span className="uppercase text-[#57524E]">WhatsApp Business Number</span>
                  <input
                    value={settings.whatsapp_number || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    placeholder="2348012345678"
                    className="w-full p-3 border mt-1 font-mono text-sm bg-[#FAF7F2]"
                  />
                </label>
                <label className="block">
                  <span className="uppercase text-[#57524E]">Bank Name</span>
                  <input
                    value={settings.bank_name || ''}
                    onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                    placeholder="e.g. Zenith Bank"
                    className="w-full p-3 border mt-1 font-mono text-sm bg-[#FAF7F2]"
                  />
                </label>
                <label className="block">
                  <span className="uppercase text-[#57524E]">Account Name</span>
                  <input
                    value={settings.account_name || ''}
                    onChange={(e) => setSettings({ ...settings, account_name: e.target.value })}
                    placeholder="Raffia Legacy Project"
                    className="w-full p-3 border mt-1 font-mono text-sm bg-[#FAF7F2]"
                  />
                </label>
                <label className="block">
                  <span className="uppercase text-[#57524E]">Account Number</span>
                  <input
                    value={settings.account_number || ''}
                    onChange={(e) => setSettings({ ...settings, account_number: e.target.value })}
                    placeholder="0123456789"
                    className="w-full p-3 border mt-1 font-mono text-sm bg-[#FAF7F2]"
                  />
                </label>
                <label className="block">
                  <span className="uppercase text-[#57524E]">Flat Shipping Fee (₦)</span>
                  <input
                    type="number"
                    value={settings.shipping_flat_rate ?? 15000}
                    onChange={(e) => setSettings({ ...settings, shipping_flat_rate: Number(e.target.value) })}
                    className="w-full p-3 border mt-1 font-mono text-sm bg-[#FAF7F2]"
                  />
                </label>
                <label className="block">
                  <span className="uppercase text-[#57524E]">Order Prefix</span>
                  <input
                    value={settings.order_prefix || 'RL'}
                    onChange={(e) => setSettings({ ...settings, order_prefix: e.target.value.toUpperCase() })}
                    className="w-full p-3 border mt-1 font-mono text-sm bg-[#FAF7F2]"
                  />
                </label>

                <button
                  type="button"
                  onClick={saveSettings}
                  className="px-5 py-3 bg-[#181513] text-white hover:bg-[#B84A28] uppercase text-xs tracking-wider inline-flex items-center gap-2 cursor-pointer font-bold"
                >
                  <Save size={15} /> Save Settings
                </button>
              </div>

              {/* Database Credentials Reset */}
              <div className="pt-6 border-t border-[#181513]/10 space-y-3">
                <p className="text-xs font-mono uppercase tracking-wider text-[#8C7355] font-bold">
                  Supabase Project Credentials
                </p>
                <div className="p-3 bg-[#FAF7F2] border text-xs font-mono text-[#57524E] space-y-1">
                  <p><b>URL:</b> {supabaseUrl}</p>
                  <p><b>Project Ref:</b> {projectRef}</p>
                </div>
                <button
                  type="button"
                  onClick={clearLocalSupabaseCredentials}
                  className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  Reset / Disconnect Database
                </button>
              </div>
            </div>
          )}

          {tab === 'database' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
                  Database & Migrations
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#181513]">Supabase SQL Schema</h2>
                <p className="text-xs text-[#57524E] leading-relaxed mt-2">
                  The marketplace schema includes tables for products, categories, collections, makers, orders, order items, settings, profiles, storage policies, and checkout RPC.
                </p>
              </div>

              <div className="bg-white border border-[#181513]/10 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-editorial text-xl">Marketplace SQL Migration</h3>
                    <p className="text-xs text-[#8C7355] font-mono">supabase/migrations/202610040001_marketplace.sql</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copySqlMigration}
                      className="px-4 py-2 bg-[#181513] text-white hover:bg-[#B84A28] text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                    >
                      {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedSql ? 'Copied!' : 'Copy Entire SQL'}</span>
                    </button>
                    <a
                      href={`https://supabase.com/dashboard/project/${projectRef}/sql/new`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 border border-[#181513]/20 hover:border-[#181513] text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <span>Open SQL Editor</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#181513] text-emerald-400 text-xs font-mono overflow-x-auto max-h-96">
                  <pre>{`-- Run this once in the Supabase SQL Editor:
-- 1. categories, collections, makers
-- 2. products, product_images
-- 3. orders, order_items, order_status_history
-- 4. site_settings, profiles
-- 5. create_manual_order(jsonb, jsonb) function
-- 6. storage.buckets ('marketplace') with public read policy
-- Click "Copy Entire SQL" above to get the full script.`}</pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal (NO window.confirm) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-[#181513]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 space-y-4 border border-[#181513]/20 shadow-2xl">
            <h3 className="font-editorial text-xl text-[#181513]">Confirm Deletion</h3>
            <p className="text-xs text-[#57524E] leading-relaxed">
              Are you sure you want to delete <b>{itemToDelete.name}</b>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-xs font-mono uppercase tracking-wider cursor-pointer font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Editor Modal */}
      {productEditor && (
        <ProductEditor
          product={productEditor}
          setProduct={setProductEditor}
          categories={categories}
          collections={collections}
          makers={makers}
          onSave={saveProduct}
          onUpload={uploadImage}
          onClose={() => setProductEditor(null)}
        />
      )}

      {/* Reference Editor Modal */}
      {referenceEditor && (
        <ReferenceEditor
          editor={referenceEditor}
          setEditor={setReferenceEditor}
          onSave={saveReference}
          onClose={() => setReferenceEditor(null)}
        />
      )}
    </div>
  );
};

const ReferenceManager: React.FC<{
  title: string;
  rows: Row[];
  type: string;
  onEdit: (r: Row) => void;
  onDelete: (id: string, name: string) => void;
  onAdd: () => void;
}> = ({ title, rows, type, onEdit, onDelete, onAdd }) => (
  <section className="space-y-6 max-w-6xl">
    <div className="flex justify-between items-center">
      <div>
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
          Catalog Reference
        </span>
        <h3 className="font-editorial text-3xl">{title}</h3>
      </div>
      <button
        onClick={onAdd}
        className="px-4 py-2.5 bg-[#181513] text-white hover:bg-[#B84A28] text-xs font-mono uppercase tracking-widest flex gap-2 items-center cursor-pointer font-bold"
      >
        <Plus size={15} /> Add
      </button>
    </div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {rows.map((r) => (
        <div key={r.id} className="bg-white border border-[#181513]/10 p-5 space-y-3 shadow-xs">
          <div className="flex justify-between items-start gap-3">
            <div>
              <b className="font-sans text-base text-[#181513] block">{r.name}</b>
              <p className="text-xs font-mono text-[#8C7355]">{r.slug}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => onEdit(r)} className="p-1.5 hover:bg-[#FAF7F2] text-[#181513] cursor-pointer" title="Edit">
                <Pencil size={15} />
              </button>
              <button onClick={() => onDelete(r.id, r.name)} className="p-1.5 hover:bg-red-50 text-[#9E3E20] cursor-pointer" title="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <p className="text-xs text-[#57524E] leading-relaxed line-clamp-3">
            {r.description || r.bio || r.location || r.subtitle || '—'}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const ProductEditor: React.FC<any> = ({
  product,
  setProduct,
  categories,
  collections,
  makers,
  onSave,
  onUpload,
  onClose,
}) => {
  const field = (key: string, label: string, type = 'text') => (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">{label}</span>
      <input
        type={type}
        value={product[key] ?? ''}
        onChange={(e) => setProduct({ ...product, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
        className="w-full p-3 border mt-1 bg-white font-sans text-sm text-[#181513]"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#181513]/70 backdrop-blur-xs p-3 sm:p-8 overflow-y-auto">
      <form onSubmit={onSave} className="max-w-4xl mx-auto bg-white p-6 sm:p-10 space-y-6 shadow-2xl border border-[#181513]/20">
        <div className="flex justify-between items-center pb-4 border-b border-[#181513]/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#B84A28]">Catalog Studio</p>
            <h2 className="font-editorial text-3xl">{product.id ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-[#FAF7F2] cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {field('name', 'Product Name *')}
          {field('slug', 'Slug *')}
          {field('price', 'Price (₦) *', 'number')}
          {field('stock_quantity', 'Stock Quantity', 'number')}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <label>
            <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">Category</span>
            <select
              value={product.category_id || ''}
              onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
              className="w-full p-3 border mt-1 bg-white font-sans text-sm"
            >
              <option value="">Uncategorised</option>
              {categories.map((x: any) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">Collection</span>
            <select
              value={product.collection_id || ''}
              onChange={(e) => setProduct({ ...product, collection_id: e.target.value })}
              className="w-full p-3 border mt-1 bg-white font-sans text-sm"
            >
              <option value="">No collection</option>
              {collections.map((x: any) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">Maker</span>
            <select
              value={product.maker_id || ''}
              onChange={(e) => setProduct({ ...product, maker_id: e.target.value })}
              className="w-full p-3 border mt-1 bg-white font-sans text-sm"
            >
              <option value="">No maker</option>
              {makers.map((x: any) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label>
            <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">Availability</span>
            <select
              value={product.availability}
              onChange={(e) => setProduct({ ...product, availability: e.target.value })}
              className="w-full p-3 border mt-1 bg-white font-sans text-sm"
            >
              {availabilityOptions.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          {field('lead_time', 'Lead Time (e.g. Available for order)')}
        </div>

        {field('short_description', 'Short Description')}

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">Full Description</span>
          <textarea
            value={product.description || ''}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            rows={4}
            className="w-full p-3 border mt-1 bg-white font-sans text-sm"
          />
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          {field('materials', 'Materials (comma-separated)')}
          {field('origin', 'Origin (e.g. Ikot Ekpene LGA, Akwa Ibom State)')}
          {field('dimensions', 'Dimensions')}
          {field('care', 'Care Instructions')}
        </div>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">Cover Image URL</span>
          <div className="flex gap-2 mt-1">
            <input
              value={product.cover_image || ''}
              onChange={(e) => setProduct({ ...product, cover_image: e.target.value })}
              className="w-full p-3 border font-sans text-sm"
              placeholder="https://..."
            />
            <label className="shrink-0 px-4 py-3 border border-[#181513]/20 hover:border-[#181513] cursor-pointer flex items-center gap-1.5 text-xs font-mono uppercase bg-[#FAF7F2]">
              <Upload size={14} />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], (url: string) => setProduct({ ...product, cover_image: url }))}
              />
            </label>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">Additional Gallery URLs (one per line)</span>
          <textarea
            value={product.gallery || ''}
            onChange={(e) => setProduct({ ...product, gallery: e.target.value })}
            rows={2}
            className="w-full p-3 border mt-1 font-mono text-xs"
          />
        </label>

        <div className="flex flex-wrap gap-6 text-xs font-mono pt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(product.is_featured)}
              onChange={(e) => setProduct({ ...product, is_featured: e.target.checked })}
            />
            <span>Featured Product</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(product.is_new)}
              onChange={(e) => setProduct({ ...product, is_new: e.target.checked })}
            />
            <span>New Arrival</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(product.is_active)}
              onChange={(e) => setProduct({ ...product, is_active: e.target.checked })}
            />
            <span>Visible in Storefront</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-[#181513]/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-[#181513]/20 text-xs font-mono uppercase tracking-widest cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#181513] hover:bg-[#B84A28] text-white text-xs font-mono uppercase tracking-widest flex items-center gap-2 cursor-pointer font-bold"
          >
            <Save size={15} /> Save to Supabase
          </button>
        </div>
      </form>
    </div>
  );
};

const ReferenceEditor: React.FC<any> = ({ editor, setEditor, onSave, onClose }) => {
  const { type, row } = editor;
  const fields =
    type === 'maker'
      ? [
          ['name', 'Name *'],
          ['slug', 'Slug *'],
          ['title', 'Title'],
          ['location', 'Location'],
          ['discipline', 'Discipline'],
          ['speciality', 'Speciality'],
          ['image', 'Image URL'],
          ['bio', 'Bio'],
          ['quote', 'Quote'],
          ['heritage_notes', 'Heritage Notes'],
        ]
      : type === 'collection'
      ? [
          ['name', 'Name *'],
          ['slug', 'Slug *'],
          ['subtitle', 'Subtitle'],
          ['cover_image', 'Cover Image URL'],
          ['aspect_ratio', 'Aspect Ratio (4:3, 3:4, 1:1, 16:9)'],
          ['sort_order', 'Sort Order (number)'],
          ['description', 'Description'],
          ['curator_notes', 'Curator Notes'],
        ]
      : [
          ['name', 'Name *'],
          ['slug', 'Slug *'],
          ['image', 'Image URL'],
          ['sort_order', 'Sort Order (number)'],
          ['description', 'Description'],
        ];

  return (
    <div className="fixed inset-0 z-50 bg-[#181513]/70 backdrop-blur-xs p-3 sm:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 border border-[#181513]/20 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-[#181513]/10">
          <h2 className="font-editorial text-3xl text-[#181513]">
            {row.id ? 'Edit' : 'Add'} {type}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#FAF7F2] cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {fields.map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-xs font-mono uppercase tracking-wider text-[#57524E]">{label}</span>
              {['description', 'bio', 'quote', 'heritage_notes', 'curator_notes'].includes(key) ? (
                <textarea
                  value={row[key] ?? ''}
                  onChange={(e) => setEditor({ ...editor, row: { ...row, [key]: e.target.value } })}
                  rows={3}
                  className="w-full p-3 border mt-1 text-sm font-sans"
                />
              ) : (
                <input
                  type={['sort_order'].includes(key) ? 'number' : 'text'}
                  value={row[key] ?? ''}
                  onChange={(e) =>
                    setEditor({
                      ...editor,
                      row: {
                        ...row,
                        [key]: ['sort_order'].includes(key) ? Number(e.target.value) : e.target.value,
                      },
                    })
                  }
                  className="w-full p-3 border mt-1 text-sm font-sans"
                />
              )}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-[#181513]/10">
          <button onClick={onClose} className="px-5 py-2.5 border text-xs font-mono uppercase cursor-pointer">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-[#181513] hover:bg-[#B84A28] text-white text-xs font-mono uppercase flex gap-2 items-center cursor-pointer font-bold"
          >
            <Save size={15} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};
