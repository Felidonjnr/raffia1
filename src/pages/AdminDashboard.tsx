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
  LayoutDashboard, Package, ShoppingBag, Tags, Settings,
  LogOut, Plus, Pencil, Trash2, Save, X, Upload, RefreshCw, ExternalLink,
  CheckCircle2, AlertCircle, Database, Copy, Check, ShieldCheck, ArrowLeft,
  Search, MessageCircle
} from 'lucide-react';
import { formatNaira } from '../utils/format';

type Tab = 'overview' | 'products' | 'orders' | 'categories' | 'users' | 'settings' | 'database';
type Row = Record<string, any>;

const blankProduct: Row = {
  id: '', slug: '', name: '', short_description: '', description: '', price: 0, currency: 'NGN',
  category_id: '', availability: 'IN STOCK', lead_time: '',
  cover_image: '', is_featured: false,
  is_new: false, stock_quantity: 10, is_active: true, gallery: ''
};

const availabilityOptions = ['IN STOCK', 'MADE TO ORDER', 'LIMITED EDITION', 'ARCHIVE ONLY'];

export const AdminDashboard: React.FC<{ onNavigate: (route: ViewRoute) => void }> = ({ onNavigate }) => {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [role, setRole] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'request'>('signin');
  const [authFullName, setAuthFullName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [tab, setTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Row[]>([]);
  const [orders, setOrders] = useState<Row[]>([]);
  const [makers, setMakers] = useState<Row[]>([]);
  const [collections, setCollections] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Row[]>([]);
  const [users, setUsers] = useState<Row[]>([]);
  const [settings, setSettings] = useState<Row>({
    whatsapp_number: '', bank_name: '', account_name: '', account_number: '', shipping_flat_rate: 15000, order_prefix: 'RL'
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [productEditor, setProductEditor] = useState<Row | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productVisibility, setProductVisibility] = useState<'ALL' | 'VISIBLE' | 'HIDDEN'>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
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
        // Never grant admin access implicitly. Access must come from an approved profile role.
        setRole('');
      }
    });
  }, [sessionUser]);

  const isAdmin = role === 'admin' || role === 'editor';
  const canManageUsers = role === 'admin';

  const loadAll = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const [p, o, m, c, cat, s, u] = await Promise.all([
        client.from('products').select('*,categories(id,name),collections(id,name),makers(id,name)').order('created_at', { ascending: false }),
        client.from('orders').select('*').order('created_at', { ascending: false }),
        client.from('makers').select('*').order('name'),
        client.from('collections').select('*').order('sort_order').order('name'),
        client.from('categories').select('*').order('sort_order').order('name'),
        client.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        client.from('profiles').select('id,email,full_name,role,created_at').order('created_at', { ascending: false }),
      ]);
      if (!p.error) setProducts(p.data || []);
      if (!o.error) setOrders(o.data || []);
      if (!m.error) setMakers(m.data || []);
      if (!c.error) setCollections(c.data || []);
      if (!cat.error) setCategories(cat.data || []);
      if (!s.error && s.data) setSettings(s.data);
      if (!u.error) setUsers(u.data || []);
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

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !query || [p.name, p.slug, p.categories?.name].some((value) => String(value || '').toLowerCase().includes(query));
      const matchesVisibility =
        productVisibility === 'ALL' ||
        (productVisibility === 'VISIBLE' && p.is_active) ||
        (productVisibility === 'HIDDEN' && !p.is_active);
      return matchesQuery && matchesVisibility;
    });
  }, [products, productSearch, productVisibility]);

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesQuery = !query || [o.order_number, o.customer_name, o.customer_phone, o.customer_email]
        .some((value) => String(value || '').toLowerCase().includes(query));
      const matchesPayment = orderPaymentFilter === 'ALL' || o.payment_status === orderPaymentFilter;
      const matchesStatus = orderStatusFilter === 'ALL' || o.order_status === orderStatusFilter;
      return matchesQuery && matchesPayment && matchesStatus;
    });
  }, [orders, orderSearch, orderPaymentFilter, orderStatusFilter]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setAuthError('');
    const result = await client.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });
    if (result.error) {
      setAuthError(result.error.message);
    }
  };

  const requestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setAuthError('');

    if (authPassword.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      return;
    }

    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    const result = await client.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
      options: {
        data: { full_name: authFullName.trim() }
      }
    });

    if (result.error) {
      setAuthError(result.error.message);
      return;
    }

    setAuthPassword('');
    setAuthConfirmPassword('');
    setNotice({
      type: 'success',
      text: 'Access request submitted. An administrator must approve your account before you can enter the dashboard.'
    });
    setAuthMode('signin');
  };

  const updateUserRole = async (userId: string, nextRole: 'pending' | 'editor' | 'admin') => {
    if (!client || !canManageUsers) return;
    if (userId === sessionUser?.id && nextRole !== 'admin') {
      setNotice({ type: 'error', text: 'You cannot remove your own admin access from this screen.' });
      return;
    }
    const { error } = await client.from('profiles').update({ role: nextRole }).eq('id', userId);
    if (error) {
      setNotice({ type: 'error', text: error.message });
      return;
    }
    setNotice({ type: 'success', text: nextRole === 'pending' ? 'User access revoked.' : `User role changed to ${nextRole}.` });
    await loadAll();
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
      availability: productEditor.availability,
      lead_time: productEditor.lead_time || '',
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
        <div className="flex items-center gap-3 text-sm font-sans text-[#8C7355]">
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
              className="text-xs uppercase tracking-widest text-white/60 hover:text-white inline-flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <ArrowLeft size={14} /> Return to Storefront
            </button>
            <span className="px-2.5 py-1 bg-[#B84A28]/10 text-[#B84A28] text-xs font-sans tracking-wider uppercase font-semibold">
              Setup Required
            </span>
          </div>

          <div>
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
              Database Integration
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl text-[#181513]">Connect Supabase</h1>
            <p className="text-sm text-[#57524E] leading-relaxed mt-3">
              The Raffia Legacy marketplace uses Supabase for live catalog products, orders, categories, makers, and storage. Your project URL has been automatically detected below.
            </p>
          </div>

          {notice && (
            <div className={`p-4 text-xs font-sans border ${notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
              {notice.text}
            </div>
          )}

          {/* Quick Setup Card */}
          <div className="bg-[#FAF7F2] border border-[#181513]/10 p-5 space-y-4 text-xs font-sans text-[#57524E]">
            <p className="font-bold text-[#181513] uppercase font-sans tracking-wider flex items-center gap-2">
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
                className="px-3.5 py-2 bg-[#181513] text-white hover:bg-[#B84A28] transition-colors font-sans text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
              >
                {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema Script'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleConnectSupabase} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#57524E] font-sans">Supabase Project URL</span>
              <input
                type="text"
                value={connectUrl}
                onChange={(e) => setConnectUrl(e.target.value)}
                placeholder="https://huqedtopuoygbiwrwfwm.supabase.co"
                className="w-full p-3 border mt-1 font-sans text-xs bg-white text-[#181513]"
                required
              />
            </label>

            <label className="block">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-[#57524E] font-sans">Anon / Publishable API Key</span>
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
                className="w-full p-3 border mt-1 font-sans text-xs bg-white text-[#181513]"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full py-4 bg-[#B84A28] hover:bg-[#9E3E20] text-white text-xs font-sans uppercase tracking-widest font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
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
  if (sessionUser && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#181513]/15 p-8 sm:p-10 shadow-xl text-center space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#B84A28]/10 text-[#B84A28] grid place-items-center">
            <ShieldCheck size={26} />
          </div>
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28]">Restricted Area</span>
            <h1 className="font-sans text-3xl text-[#181513] mt-2">Access not approved</h1>
            <p className="text-sm text-[#57524E] leading-relaxed mt-3">
              Your account is signed in, but it has not been assigned an admin or editor role. Ask the site administrator to approve your account.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button type="button" onClick={() => onNavigate({ type: 'home' })} className="px-5 py-3 border border-[#181513]/20 text-xs font-sans uppercase tracking-wider cursor-pointer">Return to Storefront</button>
            <button type="button" onClick={signOut} className="px-5 py-3 bg-[#181513] text-white text-xs font-sans uppercase tracking-wider cursor-pointer">Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#181513]/15 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'home' })}
              className="text-xs uppercase tracking-widest text-[#8C7355] hover:text-[#181513] inline-flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <ArrowLeft size={14} /> Return to Storefront
            </button>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-sans uppercase tracking-wider">
              Supabase Connected
            </span>
          </div>

          <div>
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
              Management Portal
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl text-[#181513]">
              {authMode === 'signin' ? 'Admin Access' : 'Request Access'}
            </h1>
            <p className="text-xs text-[#57524E] leading-relaxed mt-2">
              {authMode === 'signin'
                ? 'Sign in to manage products, orders, categories, collections, and artisans.'
                : 'Create your account to request access to the Raffia Legacy administration dashboard. Approval is required before you can enter.'}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
              {authError}
            </div>
          )}

          {notice && (
            <div className={`p-3 text-xs font-sans border ${notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : notice.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
              {notice.text}
            </div>
          )}

          <form onSubmit={authMode === 'signin' ? signIn : requestAccess} className="space-y-4">
            {authMode === 'request' && (
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-[#57524E] font-sans">Full Name</span>
                <input
                  type="text"
                  value={authFullName}
                  onChange={(e) => setAuthFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full p-3 border border-[#181513]/15 mt-1 font-sans text-sm bg-white"
                  required
                />
              </label>
            )}

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#57524E] font-sans">Email Address</span>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 border border-[#181513]/15 mt-1 font-sans text-sm bg-white"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#57524E] font-sans">Password</span>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full p-3 border border-[#181513]/15 mt-1 font-sans text-sm bg-white"
                minLength={8}
                required
              />
            </label>

            {authMode === 'request' && (
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-[#57524E] font-sans">Confirm Password</span>
                <input
                  type="password"
                  value={authConfirmPassword}
                  onChange={(e) => setAuthConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full p-3 border border-[#181513]/15 mt-1 font-sans text-sm bg-white"
                  minLength={8}
                  required
                />
              </label>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#181513] hover:bg-[#B84A28] text-white text-xs font-sans uppercase tracking-widest font-bold transition-colors cursor-pointer"
            >
              {authMode === 'signin' ? 'Sign In to Dashboard' : 'Submit Access Request'}
            </button>
          </form>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setAuthError('');
                setNotice(null);
                setAuthMode(authMode === 'signin' ? 'request' : 'signin');
              }}
              className="text-sm font-semibold text-[#B84A28] hover:underline cursor-pointer font-sans"
            >
              {authMode === 'signin' ? 'Request Access' : 'Back to Sign In'}
            </button>
          </div>

          <div className="pt-4 border-t border-[#181513]/10 text-center">
            <p className="text-[11px] text-[#8C7355] font-sans">
              Database: {supabaseUrl.replace(/https?:\/\//, '').split('.')[0]}.supabase.co
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0E9] text-[#181513] flex flex-col">
      {/* Top Admin Header */}
      <header className="border-b border-[#181513]/10 bg-[#181513] text-white px-5 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'home' })}
            className="text-xs uppercase tracking-widest text-[#8C7355] hover:text-[#181513] inline-flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <ArrowLeft size={14} /> Storefront
          </button>
          <span className="text-white/20">/</span>
          <div className="flex items-center gap-2">
            <span className="font-sans text-2xl font-bold tracking-tight">Raffia Legacy</span>
            <span className="text-[11px] font-sans uppercase px-2.5 py-1 bg-[#B84A28] text-white tracking-wider">Admin Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 text-white text-xs font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Supabase Live</span>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="px-3.5 py-2 border border-white/20 hover:border-white hover:bg-white/10 text-white text-xs font-sans uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Notice Banner */}
      {notice && (
        <div className={`px-6 py-3 text-xs font-sans flex items-center justify-between ${notice.type === 'error' ? 'bg-red-100 text-red-900 border-b border-red-200' : 'bg-emerald-100 text-emerald-900 border-b border-emerald-200'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="p-1 hover:opacity-75">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#211D1A] text-white border-r border-[#181513] p-4 lg:p-5 space-y-1 shrink-0 md:min-h-[calc(100vh-73px)]">
          <p className="text-[11px] font-sans uppercase tracking-widest text-white/40 px-3 py-2 font-bold">
            Catalog & Orders
          </p>
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package, badge: products.length },
            { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
            { id: 'categories', label: 'Categories', icon: Tags, badge: categories.length },
            ...(canManageUsers ? [{ id: 'users', label: 'Team & Access', icon: ShieldCheck, badge: users.filter((u) => u.role === 'pending').length }] : []),
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'database', label: 'Database & SQL', icon: Database },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id as Tab);
                setNotice(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-3 text-sm font-sans rounded-lg cursor-pointer transition-colors ${tab === id ? 'bg-[#B84A28] text-white font-bold shadow-sm' : 'hover:bg-white/10 text-white/65'}`}
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

          <div className="pt-6 border-t border-white/10 mt-6 px-3 space-y-2">
            <p className="text-[10px] font-sans uppercase text-white/40">Database Ref</p>
            <p className="text-xs font-sans truncate text-white/80 font-semibold">{projectRef}</p>
            <button
              type="button"
              onClick={runHealthCheck}
              disabled={checkingHealth}
              className="text-[11px] font-sans text-[#B84A28] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} className={checkingHealth ? 'animate-spin' : ''} />
              <span>Verify Tables</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-5 sm:p-7 lg:p-10 overflow-y-auto">
          {tab === 'overview' && (
            <div className="space-y-8 max-w-7xl">
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
                  Management Overview
                </span>
                <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl text-[#181513] tracking-tight">Good to see you. <span className="text-[#B84A28]">Here’s the store.</span></h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white border border-[#181513]/10 p-6 space-y-2 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-sans uppercase tracking-widest text-[#8C7355]">Live Products</p>
                  <p className="text-4xl font-sans font-bold text-[#181513]">{stats.products}</p>
                  <p className="text-[11px] text-[#57524E]">Active in marketplace</p>
                </div>
                <div className="bg-white border border-[#181513]/10 p-5 space-y-1">
                  <p className="text-[11px] font-sans uppercase tracking-widest text-[#8C7355]">Total Orders</p>
                  <p className="text-4xl font-sans font-bold text-[#181513]">{stats.orders}</p>
                  <p className="text-[11px] text-[#57524E]">Recorded in Supabase</p>
                </div>
                <div className="bg-white border border-[#181513]/10 p-5 space-y-1">
                  <p className="text-[11px] font-sans uppercase tracking-widest text-[#8C7355]">Pending Confirmation</p>
                  <p className="text-4xl font-sans font-bold text-[#B84A28]">{stats.pending}</p>
                  <p className="text-[11px] text-[#57524E]">Awaiting manual transfer</p>
                </div>
                <div className="bg-white border border-[#181513]/10 p-5 space-y-1">
                  <p className="text-[11px] font-sans uppercase tracking-widest text-[#8C7355]">Confirmed Revenue</p>
                  <p className="text-3xl font-sans font-bold text-emerald-800">{formatNaira(stats.revenue)}</p>
                  <p className="text-[11px] text-[#57524E]">Paid orders</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <button type="button" onClick={() => setProductEditor({ ...blankProduct })} className="bg-[#181513] text-white p-5 text-left hover:bg-[#B84A28] transition-colors cursor-pointer">
                  <Plus size={20} />
                  <p className="text-lg font-bold mt-5">Add a product</p>
                  <p className="text-sm text-white/60 mt-1">Create a new live catalog item.</p>
                </button>
                <button type="button" onClick={() => setTab('orders')} className="bg-white border border-[#181513]/10 p-5 text-left hover:border-[#B84A28] transition-colors cursor-pointer">
                  <ShoppingBag size={20} className="text-[#B84A28]" />
                  <p className="text-lg font-bold mt-5">Review orders</p>
                  <p className="text-sm text-[#57524E] mt-1">Confirm payments and move fulfilment forward.</p>
                </button>
                <button type="button" onClick={() => setTab('settings')} className="bg-white border border-[#181513]/10 p-5 text-left hover:border-[#B84A28] transition-colors cursor-pointer">
                  <Settings size={20} className="text-[#B84A28]" />
                  <p className="text-lg font-bold mt-5">Store settings</p>
                  <p className="text-sm text-[#57524E] mt-1">Update WhatsApp, bank and shipping details.</p>
                </button>
              </div>

              {/* Database Health Card */}
              <div className="bg-white border border-[#181513]/10 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Database size={20} className="text-[#B84A28]" />
                    <div>
                      <h3 className="font-sans text-xl">Supabase Database Integration</h3>
                      <p className="text-xs text-[#57524E] font-sans">{supabaseUrl}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={runHealthCheck}
                      disabled={checkingHealth}
                      className="px-3 py-1.5 border border-[#181513]/20 hover:border-[#181513] text-xs font-sans uppercase inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={12} className={checkingHealth ? 'animate-spin' : ''} />
                      <span>{checkingHealth ? 'Checking…' : 'Check Health'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('database')}
                      className="px-3 py-1.5 bg-[#181513] text-white hover:bg-[#B84A28] text-xs font-sans uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View SQL & Schema</span>
                    </button>
                  </div>
                </div>

                {health && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-sans">
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
                  <h3 className="font-sans text-2xl">Recent Orders</h3>
                  <button onClick={() => setTab('orders')} className="text-xs font-sans uppercase text-[#B84A28] hover:underline">
                    View all ({orders.length}) →
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs text-[#8C7355] font-sans py-6 text-center">No orders recorded yet. Create a test order through the storefront checkout.</p>
                ) : (
                  <div className="divide-y divide-[#181513]/10">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <b className="font-sans">{o.order_number}</b>
                          <span className="text-[#8C7355] ml-2">· {o.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 font-sans text-[10px] uppercase ${o.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {o.payment_status}
                          </span>
                          <b className="font-sans">{formatNaira(o.total)}</b>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div className="space-y-7 max-w-7xl">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                <div>
                  <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
                    Live Inventory
                  </span>
                  <h2 className="font-sans text-4xl sm:text-5xl text-[#181513] tracking-tight">Products</h2>
                  <p className="text-sm text-[#57524E] mt-2 max-w-xl">
                    Manage what customers see, buy and discover across the Raffia Legacy marketplace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProductEditor({ ...blankProduct })}
                  className="px-5 py-3.5 bg-[#B84A28] text-white hover:bg-[#9E3E20] text-sm font-sans font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus size={17} />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="bg-white border border-[#181513]/10 p-4 sm:p-5 shadow-sm">
                <div className="grid lg:grid-cols-[1fr_auto_auto] gap-3">
                  <label className="relative block">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7355]" />
                    <input
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products, slugs or categories…"
                      className="w-full border border-[#181513]/15 pl-10 pr-4 py-3 text-sm font-sans outline-none focus:border-[#B84A28] bg-[#FCFAF7]"
                    />
                  </label>
                  <select
                    value={productVisibility}
                    onChange={(e) => setProductVisibility(e.target.value as typeof productVisibility)}
                    className="border border-[#181513]/15 px-4 py-3 text-sm font-sans bg-[#FCFAF7]"
                  >
                    <option value="ALL">All Products</option>
                    <option value="VISIBLE">Visible</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => { setProductSearch(''); setProductVisibility('ALL'); }}
                    className="border border-[#181513]/15 px-5 py-3 text-sm font-sans font-semibold cursor-pointer hover:bg-[#F4F0E9]"
                  >
                    Reset filters
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[#181513]/8">
                  <p className="text-sm text-[#57524E]">
                    <strong className="text-[#181513]">{filteredProducts.length}</strong> product{filteredProducts.length === 1 ? '' : 's'} shown
                  </p>
                  <button
                    type="button"
                    onClick={loadAll}
                    className="text-sm font-semibold text-[#B84A28] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-dashed border-[#181513]/20 p-16 text-center">
                  <Package size={34} className="mx-auto text-[#8C7355] mb-4" />
                  <h3 className="font-sans text-2xl">No products found</h3>
                  <p className="text-sm text-[#57524E] mt-2">Try a different search or add a new product.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((p) => (
                    <article key={p.id} className="group bg-white border border-[#181513]/10 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative aspect-[4/3] bg-[#EDE6DB] overflow-hidden">
                        {p.cover_image ? (
                          <img
                            src={p.cover_image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-[#8C7355]">
                            <Package size={42} />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {!p.is_active && <span className="px-2.5 py-1 bg-[#181513] text-white text-[11px] font-semibold">Hidden</span>}
                          {p.is_featured && <span className="px-2.5 py-1 bg-white text-[#181513] text-[11px] font-semibold shadow-sm">Featured</span>}
                          {p.is_new && <span className="px-2.5 py-1 bg-[#B84A28] text-white text-[11px] font-semibold">New</span>}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2.5 py-1.5 bg-white/95 text-[#181513] text-xs font-semibold shadow-sm">
                            {p.availability || 'IN STOCK'}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wider text-[#8C7355] font-semibold mb-1">
                              {p.categories?.name || 'Uncategorised'}
                            </p>
                            <h3 className="font-sans text-lg font-bold leading-tight text-[#181513]">{p.name}</h3>
                          </div>
                          <p className="font-sans text-base font-bold whitespace-nowrap text-[#181513]">{formatNaira(p.price)}</p>
                        </div>

                        <p className="text-sm text-[#57524E] mt-3 line-clamp-2 min-h-[2.5rem]">
                          {p.short_description || 'No short description added yet.'}
                        </p>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#181513]/10">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-[#8C7355] font-semibold">Inventory</p>
                            <p className="text-sm font-semibold text-[#181513] mt-0.5">
                              {p.stock_quantity === null || p.stock_quantity === undefined ? 'Unlimited / made to order' : `${p.stock_quantity} units`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setProductEditor({ ...p })}
                              className="px-3 py-2 border border-[#181513]/15 hover:bg-[#F4F0E9] text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setItemToDelete({ type: 'product', id: p.id, name: p.name })}
                              className="p-2 border border-red-200 text-[#9E3E20] hover:bg-red-50 cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-7 max-w-7xl">
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-2">Commerce Operations</span>
                <h2 className="font-sans text-4xl sm:text-5xl text-[#181513] tracking-tight">Orders</h2>
                <p className="text-sm text-[#57524E] mt-2 max-w-2xl">Confirm payment, communicate with customers and move every order from new to delivered.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ['All orders', orders.length, 'text-[#181513]'],
                  ['Awaiting payment', orders.filter((o) => o.payment_status !== 'PAID' && o.payment_status !== 'FAILED' && o.payment_status !== 'REFUNDED').length, 'text-[#B84A28]'],
                  ['Paid', orders.filter((o) => o.payment_status === 'PAID').length, 'text-emerald-700'],
                  ['Ready / shipped', orders.filter((o) => ['READY_FOR_DELIVERY','SHIPPED'].includes(o.order_status)).length, 'text-[#181513]'],
                ].map(([label, value, color]) => (
                  <div key={String(label)} className="bg-white border border-[#181513]/10 p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-[#8C7355] font-semibold">{label}</p>
                    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {orders.length === 0 ? (
                <div className="bg-white border border-dashed border-[#181513]/20 p-16 text-center">
                  <ShoppingBag size={36} className="mx-auto text-[#8C7355] mb-4" />
                  <h3 className="font-sans text-2xl">No orders yet</h3>
                  <p className="text-sm text-[#57524E] mt-2">Orders created through the storefront checkout will appear here.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-[#181513]/10 p-4 sm:p-5 shadow-sm">
                    <div className="grid lg:grid-cols-[1fr_auto_auto_auto] gap-3">
                      <label className="relative block">
                        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7355]" />
                        <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search order, customer or phone…" className="w-full border border-[#181513]/15 pl-10 pr-4 py-3 text-sm bg-[#FCFAF7] outline-none focus:border-[#B84A28]" />
                      </label>
                      <select value={orderPaymentFilter} onChange={(e) => setOrderPaymentFilter(e.target.value)} className="border border-[#181513]/15 px-4 py-3 text-sm bg-[#FCFAF7]">
                        <option value="ALL">All payments</option><option>PENDING</option><option>AWAITING_CONFIRMATION</option><option>PAID</option><option>FAILED</option><option>REFUNDED</option>
                      </select>
                      <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="border border-[#181513]/15 px-4 py-3 text-sm bg-[#FCFAF7]">
                        <option value="ALL">All statuses</option><option>NEW</option><option>PROCESSING</option><option>READY_FOR_DELIVERY</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option>
                      </select>
                      <button type="button" onClick={() => { setOrderSearch(''); setOrderPaymentFilter('ALL'); setOrderStatusFilter('ALL'); }} className="border border-[#181513]/15 px-5 py-3 text-sm font-semibold hover:bg-[#F4F0E9] cursor-pointer">Reset</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredOrders.map((o) => (
                      <article key={o.id} className="bg-white border border-[#181513]/10 shadow-sm overflow-hidden">
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <b className="font-sans text-xl">{o.order_number}</b>
                                <span className={`px-2.5 py-1 text-xs font-semibold ${o.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : o.payment_status === 'FAILED' || o.payment_status === 'REFUNDED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{o.payment_status}</span>
                                <span className="px-2.5 py-1 bg-[#F4F0E9] text-[#57524E] text-xs font-semibold">{o.order_status}</span>
                              </div>
                              <p className="text-sm text-[#57524E] mt-2"><strong className="text-[#181513]">{o.customer_name}</strong> · {o.customer_phone}</p>
                              <p className="text-xs text-[#8C7355] mt-1">{new Date(o.created_at).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs uppercase tracking-wider text-[#8C7355]">Order total</p>
                                <p className="text-2xl font-bold mt-1">{formatNaira(o.total)}</p>
                              </div>
                              <button type="button" onClick={() => openOrder(o.id)} className="px-3.5 py-2.5 border border-[#181513]/15 hover:bg-[#F4F0E9] text-sm font-semibold cursor-pointer">
                                {expandedOrder === o.id ? 'Hide items' : 'View items'}
                              </button>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#181513]/10">
                            <label className="block">
                              <span className="block text-xs uppercase tracking-wider text-[#8C7355] font-semibold mb-1.5">Payment status</span>
                              <select value={o.payment_status} onChange={(e) => updateOrder(o.id, { payment_status: e.target.value })} className="w-full border border-[#181513]/15 p-3 text-sm bg-[#FCFAF7]">
                                <option>PENDING</option><option>AWAITING_CONFIRMATION</option><option>PAID</option><option>FAILED</option><option>REFUNDED</option>
                              </select>
                            </label>
                            <label className="block">
                              <span className="block text-xs uppercase tracking-wider text-[#8C7355] font-semibold mb-1.5">Fulfilment status</span>
                              <select value={o.order_status} onChange={(e) => updateOrder(o.id, { order_status: e.target.value })} className="w-full border border-[#181513]/15 p-3 text-sm bg-[#FCFAF7]">
                                <option>NEW</option><option>PROCESSING</option><option>READY_FOR_DELIVERY</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option>
                              </select>
                            </label>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-4">
                            <a href={`https://wa.me/${String(o.customer_phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${o.customer_name}, this is the Raffia Legacy team regarding your order #${o.order_number}.`)}`} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold inline-flex items-center gap-2">
                              <MessageCircle size={15} /> WhatsApp customer
                            </a>
                          </div>

                          {expandedOrder === o.id && (
                            <div className="mt-5 bg-[#F4F0E9] p-5 border border-[#181513]/10">
                              <p className="text-xs uppercase tracking-wider text-[#8C7355] font-bold">Order items</p>
                              <div className="divide-y divide-[#181513]/10 mt-2">
                                {orderItems.map((item) => (
                                  <div key={item.id} className="py-3 flex justify-between gap-4 text-sm">
                                    <span>{item.product_name} × {item.quantity}</span><strong>{formatNaira(item.subtotal)}</strong>
                                  </div>
                                ))}
                              </div>
                              <div className="pt-4 mt-2 border-t border-[#181513]/10 grid md:grid-cols-2 gap-4 text-sm text-[#57524E]">
                                <p><strong className="text-[#181513]">Delivery:</strong><br />{o.customer_address}, {o.customer_city}, {o.customer_state}, {o.customer_country}</p>
                                <p><strong className="text-[#181513]">Email:</strong> {o.customer_email || '—'}<br /><strong className="text-[#181513]">Notes:</strong> {o.patron_notes || '—'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
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

          {tab === 'users' && canManageUsers && (
            <div className="space-y-7 max-w-6xl">
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-2">Administration</span>
                <h2 className="font-sans text-4xl sm:text-5xl tracking-tight">Team & Access</h2>
                <p className="text-sm text-[#57524E] mt-2 max-w-2xl">
                  Approve new accounts and assign the level of access they should have in Admin Studio.
                </p>
              </div>

              <div className="bg-white border border-[#181513]/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#181513]/10 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold">Admin accounts</h3>
                    <p className="text-xs text-[#8C7355] mt-1">Pending accounts cannot access the admin panel.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#B84A28]/10 text-[#B84A28] text-xs font-bold">
                    {users.filter((u) => u.role === 'pending').length} pending
                  </span>
                </div>

                <div className="divide-y divide-[#181513]/10">
                  {users.length === 0 ? (
                    <div className="p-10 text-center text-sm text-[#57524E]">No profiles found.</div>
                  ) : users.map((user) => (
                    <div key={user.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-[#181513]">{user.full_name || 'Unnamed user'}</p>
                          {user.role === 'pending' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-semibold">Pending approval</span>
                          )}
                          {user.id === sessionUser?.id && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[11px] font-semibold">You</span>
                          )}
                        </div>
                        <p className="text-sm text-[#57524E] mt-1">{user.email || 'Email unavailable'}</p>
                        <p className="text-[11px] text-[#8C7355] mt-1">User ID: {user.id}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <label className="text-xs font-semibold text-[#57524E]">Role</label>
                        <select
                          value={user.role || 'pending'}
                          disabled={user.id === sessionUser?.id}
                          onChange={(e) => updateUserRole(user.id, e.target.value as 'pending' | 'editor' | 'admin')}
                          className="min-w-36 border border-[#181513]/15 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#B84A28] disabled:bg-[#F4F0E9] disabled:text-[#8C7355]"
                        >
                          <option value="pending">Pending</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#181513] text-white p-5 sm:p-6">
                <div className="flex gap-3">
                  <ShieldCheck className="text-[#D7A98F] shrink-0" size={20} />
                  <div>
                    <p className="font-bold">Access control</p>
                    <p className="text-sm text-white/65 mt-1 leading-relaxed">
                      Only admins can assign roles. Editors can work in the dashboard but cannot approve or promote other accounts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="space-y-7 max-w-5xl">
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-2">Store Configuration</span>
                <h2 className="font-sans text-4xl sm:text-5xl tracking-tight">Settings</h2>
                <p className="text-sm text-[#57524E] mt-2 max-w-2xl">Keep checkout, payment instructions and delivery settings in one place.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <section className="bg-white border border-[#181513]/10 p-6 sm:p-7 shadow-sm">
                  <div className="flex items-start gap-3 mb-6"><MessageCircle className="text-[#B84A28]" size={22}/><div><h3 className="font-sans text-2xl">Customer contact</h3><p className="text-sm text-[#57524E] mt-1">Used for manual WhatsApp checkout.</p></div></div>
                  <label className="block"><span className="text-sm font-semibold">WhatsApp Business number</span><input value={settings.whatsapp_number || ''} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} placeholder="2348012345678" className="w-full p-3.5 border border-[#181513]/15 mt-1.5 text-sm bg-[#FCFAF7] outline-none focus:border-[#B84A28]" /></label>
                </section>

                <section className="bg-white border border-[#181513]/10 p-6 sm:p-7 shadow-sm">
                  <div className="flex items-start gap-3 mb-6"><Database className="text-[#B84A28]" size={22}/><div><h3 className="font-sans text-2xl">Order settings</h3><p className="text-sm text-[#57524E] mt-1">Controls generated order references.</p></div></div>
                  <label className="block"><span className="text-sm font-semibold">Order prefix</span><input value={settings.order_prefix || 'RL'} onChange={(e) => setSettings({ ...settings, order_prefix: e.target.value.toUpperCase() })} className="w-full p-3.5 border border-[#181513]/15 mt-1.5 text-sm bg-[#FCFAF7] outline-none focus:border-[#B84A28]" /></label>
                </section>

                <section className="bg-white border border-[#181513]/10 p-6 sm:p-7 shadow-sm lg:col-span-2">
                  <div className="mb-6"><h3 className="font-sans text-2xl">Manual payment details</h3><p className="text-sm text-[#57524E] mt-1">These details are shown to customers during manual transfer checkout.</p></div>
                  <div className="grid md:grid-cols-3 gap-5">
                    <label className="block"><span className="text-sm font-semibold">Bank name</span><input value={settings.bank_name || ''} onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })} placeholder="e.g. Zenith Bank" className="w-full p-3.5 border border-[#181513]/15 mt-1.5 text-sm bg-[#FCFAF7] outline-none focus:border-[#B84A28]" /></label>
                    <label className="block"><span className="text-sm font-semibold">Account name</span><input value={settings.account_name || ''} onChange={(e) => setSettings({ ...settings, account_name: e.target.value })} placeholder="Raffia Legacy Project" className="w-full p-3.5 border border-[#181513]/15 mt-1.5 text-sm bg-[#FCFAF7] outline-none focus:border-[#B84A28]" /></label>
                    <label className="block"><span className="text-sm font-semibold">Account number</span><input value={settings.account_number || ''} onChange={(e) => setSettings({ ...settings, account_number: e.target.value })} placeholder="0123456789" className="w-full p-3.5 border border-[#181513]/15 mt-1.5 text-sm bg-[#FCFAF7] outline-none focus:border-[#B84A28]" /></label>
                  </div>
                </section>

                <section className="bg-white border border-[#181513]/10 p-6 sm:p-7 shadow-sm">
                  <h3 className="font-sans text-2xl">Delivery</h3>
                  <p className="text-sm text-[#57524E] mt-1 mb-6">Default flat shipping fee applied at checkout.</p>
                  <label className="block"><span className="text-sm font-semibold">Flat shipping fee (₦)</span><input type="number" value={settings.shipping_flat_rate ?? 15000} onChange={(e) => setSettings({ ...settings, shipping_flat_rate: Number(e.target.value) })} className="w-full p-3.5 border border-[#181513]/15 mt-1.5 text-sm bg-[#FCFAF7] outline-none focus:border-[#B84A28]" /></label>
                </section>

                <section className="bg-[#181513] text-white p-6 sm:p-7 shadow-sm">
                  <h3 className="font-sans text-2xl">Database connection</h3>
                  <p className="text-sm text-white/60 mt-1 mb-5">Connected project used by this admin studio.</p>
                  <p className="text-sm font-sans text-white/85 break-all">{supabaseUrl}</p>
                  <button type="button" onClick={clearLocalSupabaseCredentials} className="mt-5 px-4 py-2.5 border border-white/20 hover:bg-white/10 text-sm font-semibold cursor-pointer">Disconnect database</button>
                </section>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={saveSettings} className="px-6 py-3.5 bg-[#B84A28] text-white hover:bg-[#9E3E20] text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"><Save size={16}/> Save store settings</button>
              </div>
            </div>
          )}

          {tab === 'database' && (
            <div className="space-y-7 max-w-5xl">
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-2">System</span>
                <h2 className="font-sans text-4xl sm:text-5xl tracking-tight">Database</h2>
                <p className="text-sm text-[#57524E] mt-2 max-w-2xl">Technical tools for checking the live Supabase connection and accessing the marketplace schema.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-white border border-[#181513]/10 p-6 sm:p-7 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><h3 className="font-sans text-2xl">Supabase connection</h3><p className="text-sm text-[#57524E] mt-1 break-all">{supabaseUrl}</p></div>
                    <button type="button" onClick={runHealthCheck} disabled={checkingHealth} className="px-4 py-2.5 border border-[#181513]/15 hover:bg-[#F4F0E9] text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"><RefreshCw size={15} className={checkingHealth ? 'animate-spin' : ''}/>{checkingHealth ? 'Checking…' : 'Check health'}</button>
                  </div>
                  {health && <div className="grid sm:grid-cols-2 gap-3 mt-6">{Object.entries(health.tables).map(([table, ready]) => <div key={table} className={`p-3 border flex items-center justify-between text-sm ${ready ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}><span className="font-medium">{table}</span>{ready ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}</div>)}</div>}
                </div>

                <div className="bg-[#181513] text-white p-6 sm:p-7 shadow-sm">
                  <Database size={24} className="text-[#D7A98F]" />
                  <h3 className="font-sans text-2xl mt-5">Migration tools</h3>
                  <p className="text-sm text-white/60 mt-2">Copy the current marketplace schema and open the SQL editor.</p>
                  <button type="button" onClick={copySqlMigration} className="w-full mt-6 px-4 py-3 bg-white text-[#181513] hover:bg-[#F4F0E9] text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer">{copiedSql ? <Check size={15}/> : <Copy size={15}/>} {copiedSql ? 'Copied' : 'Copy SQL schema'}</button>
                  <a href={`https://supabase.com/dashboard/project/${projectRef}/sql/new`} target="_blank" rel="noreferrer" className="w-full mt-2 px-4 py-3 border border-white/20 hover:bg-white/10 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"><ExternalLink size={14}/> Open SQL editor</a>
                </div>
              </div>

              <div className="bg-white border border-[#181513]/10 p-6 sm:p-7 shadow-sm">
                <h3 className="font-sans text-2xl">Schema overview</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                  {['Products & images','Categories','Orders & order items','Customers','Site settings','Profiles & roles','Marketplace storage','Manual checkout RPC'].map((item) => (
                    <div key={item} className="border border-[#181513]/10 bg-[#FCFAF7] p-4 text-sm font-semibold">{item}</div>
                  ))}
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
            <h3 className="font-sans text-xl text-[#181513]">Confirm Deletion</h3>
            <p className="text-xs text-[#57524E] leading-relaxed">
              Are you sure you want to delete <b>{itemToDelete.name}</b>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border text-xs font-sans uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-xs font-sans uppercase tracking-wider cursor-pointer font-bold"
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
        <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#B84A28] block mb-1">
          Catalog Reference
        </span>
        <h3 className="font-sans text-3xl">{title}</h3>
      </div>
      <button
        onClick={onAdd}
        className="px-4 py-2.5 bg-[#181513] text-white hover:bg-[#B84A28] text-xs font-sans uppercase tracking-widest flex gap-2 items-center cursor-pointer font-bold"
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
              <p className="text-xs font-sans text-[#8C7355]">{r.slug}</p>
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
  onSave,
  onUpload,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'details' | 'commerce' | 'images' | 'visibility'>('details');
  const galleryUrls = String(product.gallery || '').split('\n').map((x: string) => x.trim()).filter(Boolean);
  const allImages = [product.cover_image, ...galleryUrls].filter(Boolean);

  const update = (key: string, value: any) => setProduct({ ...product, [key]: value });

  const field = (key: string, label: string, type = 'text', placeholder = '') => (
    <label className="block">
      <span className="text-sm font-semibold text-[#181513]">{label}</span>
      <input
        type={type}
        value={product[key] ?? ''}
        placeholder={placeholder}
        onChange={(e) => update(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full p-3.5 border border-[#181513]/15 mt-1.5 bg-white font-sans text-sm text-[#181513] outline-none focus:border-[#B84A28] focus:ring-2 focus:ring-[#B84A28]/10"
      />
    </label>
  );

  const tabs = [
    { id: 'details', label: 'Product details' },
    { id: 'commerce', label: 'Pricing & inventory' },
    { id: 'images', label: 'Images' },
    { id: 'visibility', label: 'Store display' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-[#181513]/75 backdrop-blur-sm p-2 sm:p-5 lg:p-8 overflow-y-auto">
      <form onSubmit={onSave} className="max-w-5xl mx-auto bg-[#FAF7F2] shadow-2xl border border-white/10 rounded-sm overflow-hidden">
        <div className="bg-[#181513] text-white px-5 sm:px-8 lg:px-10 py-6 sm:py-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#D7A98F] font-semibold">Catalog Studio</p>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl tracking-tight mt-1">
                {product.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-white/60 mt-2">Everything customers need to understand and buy this piece.</p>
            </div>
            <button type="button" onClick={onClose} className="p-2.5 border border-white/15 hover:bg-white/10 cursor-pointer rounded-sm" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-8 lg:px-10 border-b border-[#181513]/10 bg-white overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`px-4 sm:px-5 py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeSection === item.id ? 'border-[#B84A28] text-[#B84A28]' : 'border-transparent text-[#57524E] hover:text-[#181513]'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          {activeSection === 'details' && (
            <div className="space-y-7">
              <div>
                <h3 className="font-sans text-2xl sm:text-3xl">Tell the story of the product</h3>
                <p className="text-sm text-[#57524E] mt-1">Keep the name and description clear, specific and customer-friendly.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {field('name', 'Product name *', 'text', 'e.g. Multicolour Patterned Raffia Shoulder Bag')}
                {field('slug', 'URL slug *', 'text', 'multicolour-patterned-raffia-shoulder-bag')}
              </div>
              {field('short_description', 'Short description', 'text', 'A concise sentence shown on product cards.')}
              <label className="block">
                <span className="text-sm font-semibold text-[#181513]">Full description</span>
                <textarea
                  value={product.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  rows={7}
                  placeholder="Describe the piece, materials, use and anything a customer should know."
                  className="w-full p-3.5 border border-[#181513]/15 mt-1.5 bg-white font-sans text-sm text-[#181513] outline-none focus:border-[#B84A28] focus:ring-2 focus:ring-[#B84A28]/10 resize-y"
                />
              </label>
              <label className="block max-w-xl">
                <span className="text-sm font-semibold text-[#181513]">Category</span>
                <select
                  value={product.category_id || ''}
                  onChange={(e) => update('category_id', e.target.value)}
                  className="w-full p-3.5 border border-[#181513]/15 mt-1.5 bg-white font-sans text-sm outline-none focus:border-[#B84A28]"
                >
                  <option value="">Uncategorised</option>
                  {categories.map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              </label>
            </div>
          )}

          {activeSection === 'commerce' && (
            <div className="space-y-7">
              <div>
                <h3 className="font-sans text-2xl sm:text-3xl">Pricing & inventory</h3>
                <p className="text-sm text-[#57524E] mt-1">Control how this product is sold and how stock is represented.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {field('price', 'Price (₦) *', 'number', '15000')}
                {field('stock_quantity', 'Stock quantity', 'number', 'Leave blank for made-to-order / unlimited')}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="text-sm font-semibold text-[#181513]">Availability</span>
                  <select
                    value={product.availability || 'IN STOCK'}
                    onChange={(e) => update('availability', e.target.value)}
                    className="w-full p-3.5 border border-[#181513]/15 mt-1.5 bg-white font-sans text-sm outline-none focus:border-[#B84A28]"
                  >
                    {availabilityOptions.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
                {field('lead_time', 'Lead time', 'text', 'e.g. Available for order')}
              </div>
              <div className="bg-white border border-[#181513]/10 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wider text-[#8C7355] font-bold">Current selling position</p>
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div><p className="text-xs text-[#8C7355]">Price</p><p className="text-xl font-bold mt-1">{formatNaira(Number(product.price || 0))}</p></div>
                  <div><p className="text-xs text-[#8C7355]">Availability</p><p className="text-sm font-semibold mt-1">{product.availability || 'IN STOCK'}</p></div>
                  <div><p className="text-xs text-[#8C7355]">Stock</p><p className="text-sm font-semibold mt-1">{product.stock_quantity === '' || product.stock_quantity === null ? 'Made to order / unlimited' : product.stock_quantity}</p></div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'images' && (
            <div className="space-y-7">
              <div>
                <h3 className="font-sans text-2xl sm:text-3xl">Product photography</h3>
                <p className="text-sm text-[#57524E] mt-1">Use your Cloudinary links or upload directly to Supabase Storage.</p>
              </div>

              <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6">
                <div className="bg-white border border-[#181513]/10 p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-sm font-bold">Main image</p>
                      <p className="text-xs text-[#8C7355] mt-0.5">This is the image used across the storefront.</p>
                    </div>
                    <label className="px-3.5 py-2.5 bg-[#181513] text-white hover:bg-[#B84A28] cursor-pointer inline-flex items-center gap-2 text-sm font-semibold">
                      <Upload size={15} /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], (url: string) => update('cover_image', url))}
                      />
                    </label>
                  </div>

                  <div className="aspect-[4/3] bg-[#EDE6DB] overflow-hidden border border-[#181513]/10 mb-4">
                    {product.cover_image ? (
                      <img src={product.cover_image} alt={product.name || 'Product preview'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full grid place-items-center text-[#8C7355]">
                        <Package size={46} />
                      </div>
                    )}
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold">Cloudinary / external image URL</span>
                    <input
                      value={product.cover_image || ''}
                      onChange={(e) => update('cover_image', e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full p-3.5 border border-[#181513]/15 mt-1.5 text-sm font-sans outline-none focus:border-[#B84A28]"
                    />
                  </label>
                </div>

                <div className="bg-white border border-[#181513]/10 p-5">
                  <p className="text-sm font-bold">Gallery</p>
                  <p className="text-xs text-[#8C7355] mt-0.5 mb-4">Add one image URL per line.</p>
                  <textarea
                    value={product.gallery || ''}
                    onChange={(e) => update('gallery', e.target.value)}
                    rows={8}
                    placeholder={'https://res.cloudinary.com/...\nhttps://res.cloudinary.com/...'}
                    className="w-full p-3.5 border border-[#181513]/15 text-sm font-sans outline-none focus:border-[#B84A28] resize-y"
                  />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {galleryUrls.slice(0, 6).map((url: string, index: number) => (
                      <img key={`${url}-${index}`} src={url} alt="" className="aspect-square object-cover border border-[#181513]/10" />
                    ))}
                  </div>
                </div>
              </div>

              {allImages.length > 0 && (
                <div className="bg-white border border-[#181513]/10 p-5">
                  <p className="text-sm font-bold">Image set preview</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                    {allImages.slice(0, 12).map((url: string, index: number) => (
                      <div key={`${url}-${index}`} className="aspect-square bg-[#EDE6DB] overflow-hidden border border-[#181513]/10">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'visibility' && (
            <div className="space-y-7">
              <div>
                <h3 className="font-sans text-2xl sm:text-3xl">Store display</h3>
                <p className="text-sm text-[#57524E] mt-1">Decide where and how prominently this product appears.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  ['is_active', 'Visible in storefront', 'Customers can discover and purchase this product.'],
                  ['is_featured', 'Featured product', 'Use this product in featured marketplace placements.'],
                  ['is_new', 'New arrival', 'Marks this product as a recent addition.'],
                ].map(([key, label, description]) => (
                  <label key={key} className={`border p-5 cursor-pointer transition-colors ${product[key] ? 'border-[#B84A28] bg-[#B84A28]/5' : 'border-[#181513]/10 bg-white hover:bg-[#F4F0E9]'}`}>
                    <input
                      type="checkbox"
                      checked={Boolean(product[key])}
                      onChange={(e) => update(key, e.target.checked)}
                      className="w-5 h-5 accent-[#B84A28]"
                    />
                    <span className="block text-base font-bold mt-4">{label}</span>
                    <span className="block text-sm text-[#57524E] leading-relaxed mt-1">{description}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 sm:px-8 lg:px-10 py-5 bg-white border-t border-[#181513]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-[#57524E]">
            {product.id ? 'Changes will update the live Supabase record.' : 'Save this product to add it to the live catalog.'}
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-[#181513]/20 text-sm font-semibold cursor-pointer hover:bg-[#F4F0E9]">
              Cancel
            </button>
            <button type="submit" className="px-6 py-3 bg-[#181513] hover:bg-[#B84A28] text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer">
              <Save size={16} /> Save Product
            </button>
          </div>
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
          <h2 className="font-sans text-3xl text-[#181513]">
            {row.id ? 'Edit' : 'Add'} {type}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#FAF7F2] cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {fields.map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-xs font-sans uppercase tracking-wider text-[#57524E]">{label}</span>
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
          <button onClick={onClose} className="px-5 py-2.5 border text-xs font-sans uppercase cursor-pointer">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-[#181513] hover:bg-[#B84A28] text-white text-xs font-sans uppercase flex gap-2 items-center cursor-pointer font-bold"
          >
            <Save size={15} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};
