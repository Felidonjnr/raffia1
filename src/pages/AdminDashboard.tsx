import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ViewRoute } from '../types';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Layers3, Tags, Settings,
  LogOut, Plus, Pencil, Trash2, Save, X, Upload, RefreshCw, ExternalLink
} from 'lucide-react';
import { formatNaira } from '../utils/format';

type Tab = 'overview' | 'products' | 'orders' | 'makers' | 'collections' | 'categories' | 'settings';
type Row = Record<string, any>;

const blankProduct: Row = {
  id: '', slug: '', name: '', short_description: '', description: '', price: 0, currency: 'NGN',
  category_id: '', collection_id: '', maker_id: '', availability: 'IN STOCK', lead_time: '',
  materials: '', origin: '', dimensions: '', care: '', cover_image: '', is_featured: false,
  is_new: false, stock_quantity: 10, is_active: true, gallery: ''
};

const availabilityOptions = ['IN STOCK','MADE TO ORDER','LIMITED EDITION','ARCHIVE ONLY'];

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
  const [settings, setSettings] = useState<Row>({ whatsapp_number: '', bank_name: '', account_name: '', account_number: '', shipping_flat_rate: 15000, order_prefix: 'RL' });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [productEditor, setProductEditor] = useState<Row | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Row[]>([]);
  const [referenceEditor, setReferenceEditor] = useState<{ type: 'maker'|'collection'|'category'; row: Row } | null>(null);

  const client = supabase;

  useEffect(() => {
    if (!client) { setLoadingAuth(false); return; }
    client.auth.getSession().then(({ data }) => {
      setSessionUser(data.session?.user || null);
      setLoadingAuth(false);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSessionUser(nextSession?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!client || !sessionUser) return;
    client.from('profiles').select('role').eq('id', sessionUser.id).maybeSingle().then(({ data }) => {
      setRole(data?.role || '');
    });
  }, [sessionUser]);

  const isAdmin = role === 'admin' || role === 'editor';

  const loadAll = async () => {
    if (!client || !isAdmin) return;
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin]);

  const stats = useMemo(() => ({
    products: products.filter(p => p.is_active).length,
    orders: orders.filter(o => o.order_status !== 'CANCELLED').length,
    pending: orders.filter(o => o.payment_status !== 'PAID').length,
    revenue: orders.filter(o => o.payment_status === 'PAID').reduce((sum, o) => sum + Number(o.total || 0), 0),
  }), [products, orders]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setAuthError('');
    const result = loginMode
      ? await client.auth.signInWithPassword({ email: authEmail, password: authPassword })
      : await client.auth.signUp({ email: authEmail, password: authPassword });
    if (result.error) setAuthError(result.error.message);
    else if (!loginMode) setAuthError('Account created. An administrator must add your user ID to public.profiles before dashboard access is granted.');
  };

  const signOut = async () => {
    await client?.auth.signOut();
    setRole('');
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !productEditor) return;
    setLoading(true);
    setNotice('');
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
      setNotice(error.message);
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
    setNotice('Product saved.');
    await loadAll();
  };

  const deleteProduct = async (id: string) => {
    if (!client || !window.confirm('Delete this product? Existing order history will remain.')) return;
    const { error } = await client.from('products').delete().eq('id', id);
    setNotice(error ? error.message : 'Product deleted.');
    await loadAll();
  };

  const uploadImage = async (file: File, callback: (url: string) => void) => {
    if (!client) return;
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const path = `products/${Date.now()}-${safe}`;
    const { error } = await client.storage.from('marketplace').upload(path, file, { upsert: false });
    if (error) { setNotice(error.message); return; }
    const { data } = client.storage.from('marketplace').getPublicUrl(path);
    callback(data.publicUrl);
  };

  const updateOrder = async (id: string, patch: Row) => {
    if (!client) return;
    const { error } = await client.from('orders').update(patch).eq('id', id);
    setNotice(error ? error.message : 'Order updated.');
    await loadAll();
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
    setNotice(error ? error.message : 'Marketplace settings saved.');
    await loadAll();
  };

  const saveReference = async () => {
    if (!client || !referenceEditor) return;
    const { type, row } = referenceEditor;
    const table = type === 'maker' ? 'makers' : type === 'collection' ? 'collections' : 'categories';
    const payload = { ...row };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    if (type === 'maker') delete payload.productIds;
    if (row.id) {
      const { error } = await client.from(table).update(payload).eq('id', row.id);
      setNotice(error ? error.message : 'Saved.');
    } else {
      const { error } = await client.from(table).insert(payload);
      setNotice(error ? error.message : 'Created.');
    }
    setReferenceEditor(null);
    await loadAll();
  };

  const deleteReference = async (type: 'maker'|'collection'|'category', id: string) => {
    if (!client || !window.confirm('Delete this record? Products will not be deleted.')) return;
    const table = type === 'maker' ? 'makers' : type === 'collection' ? 'collections' : 'categories';
    const { error } = await client.from(table).delete().eq('id', id);
    setNotice(error ? error.message : 'Deleted.');
    await loadAll();
  };

  if (loadingAuth) return <div className="min-h-screen bg-[#FAF7F2] grid place-items-center">Loading admin…</div>;

  if (!client) return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 grid place-items-center">
      <div className="max-w-lg bg-white border border-[#181513]/10 p-8">
        <h1 className="font-editorial text-3xl mb-3">Supabase is not connected</h1>
        <p className="text-sm text-[#57524E]">Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the Vercel project environment variables, then redeploy.</p>
      </div>
    </div>
  );

  if (!sessionUser || !isAdmin) return (
    <div className="min-h-screen bg-[#FAF7F2] px-6 py-16 grid place-items-center">
      <form onSubmit={signIn} className="w-full max-w-md bg-white border border-[#181513]/10 p-8 shadow-sm">
        <button type="button" onClick={() => onNavigate({type:'home'})} className="text-xs uppercase tracking-widest text-[#8C7355] mb-8">← Back to site</button>
        <p className="text-xs uppercase tracking-[0.25em] text-[#B84A28] mb-2">Raffia Legacy</p>
        <h1 className="font-editorial text-4xl text-[#181513] mb-2">Marketplace Admin</h1>
        <p className="text-sm text-[#57524E] mb-7">{sessionUser ? 'Your account exists but is not approved for dashboard access.' : 'Sign in to manage the marketplace.'}</p>
        {!sessionUser && <>
          <input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} type="email" required placeholder="Admin email" className="w-full p-3 border mb-3" />
          <input value={authPassword} onChange={e=>setAuthPassword(e.target.value)} type="password" required minLength={6} placeholder="Password" className="w-full p-3 border mb-4" />
          {authError && <p className="text-sm text-[#9E3E20] mb-4">{authError}</p>}
          <button className="w-full py-3 bg-[#181513] text-white uppercase text-xs tracking-widest">{loginMode ? 'Sign In' : 'Create Account'}</button>
          <button type="button" onClick={()=>setLoginMode(!loginMode)} className="w-full mt-3 py-3 border uppercase text-xs tracking-widest">{loginMode ? 'Create admin account' : 'Back to sign in'}</button>
        </>}
        {sessionUser && <button type="button" onClick={signOut} className="w-full py-3 bg-[#181513] text-white uppercase text-xs tracking-widest">Sign Out</button>}
      </form>
    </div>
  );

  const nav = [
    ['overview','Overview',LayoutDashboard],['products','Products',Package],['orders','Orders',ShoppingBag],
    ['makers','Makers',Users],['collections','Collections',Layers3],['categories','Categories',Tags],['settings','Settings',Settings]
  ] as const;

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#181513]">
      <div className="min-h-screen flex">
        <aside className="w-64 bg-[#181513] text-[#FAF7F2] p-5 hidden lg:flex flex-col">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C8A978]">RAFFIA LEGACY</p>
            <h1 className="font-editorial text-2xl mt-1">Marketplace Admin</h1>
          </div>
          <nav className="space-y-1 flex-1">
            {nav.map(([id,label,Icon]) => <button key={id} onClick={()=>setTab(id)} className={`w-full flex items-center gap-3 px-3 py-3 text-sm text-left ${tab===id?'bg-[#B84A28] text-white':'text-[#F3EBDD]/75 hover:bg-white/10'}`}><Icon size={17}/>{label}</button>)}
          </nav>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-3 text-sm text-[#F3EBDD]/75 hover:text-white"><LogOut size={17}/> Sign out</button>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="bg-[#FAF7F2] border-b border-[#181513]/10 px-5 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B84A28]">CONTROL ROOM</p>
              <h2 className="font-editorial text-2xl">{nav.find(n=>n[0]===tab)?.[1]}</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>onNavigate({type:'marketplace'})} className="px-3 py-2 border text-xs uppercase tracking-wider flex items-center gap-2"><ExternalLink size={14}/> View store</button>
              <button onClick={loadAll} className="p-2 border" title="Refresh"><RefreshCw size={16}/></button>
            </div>
          </header>

          <div className="lg:hidden px-4 pt-4 overflow-x-auto">
            <div className="flex gap-2 min-w-max">{nav.map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`px-3 py-2 text-xs uppercase tracking-wider border ${tab===id?'bg-[#181513] text-white':'bg-white'}`}>{label}</button>)}</div>
          </div>

          <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
            {notice && <div className="mb-5 bg-[#E8F1E5] border border-[#6A8B5E]/20 p-3 text-sm flex justify-between"><span>{notice}</span><button onClick={()=>setNotice('')}><X size={16}/></button></div>}

            {tab==='overview' && <section className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ['Live products',stats.products],['Open orders',stats.orders],['Awaiting payment',stats.pending],[ 'Paid revenue',formatNaira(stats.revenue)]
                ].map(([label,value])=><div key={label} className="bg-white border p-5"><p className="text-xs uppercase tracking-wider text-[#8C7355]">{label}</p><p className="font-editorial text-3xl mt-2">{value}</p></div>)}
              </div>
              <div className="bg-white border p-6">
                <div className="flex justify-between items-center mb-5"><h3 className="font-editorial text-2xl">Recent orders</h3><button onClick={()=>setTab('orders')} className="text-xs uppercase tracking-widest text-[#B84A28]">View all →</button></div>
                <div className="divide-y">{orders.slice(0,6).map(o=><div key={o.id} className="py-4 flex flex-wrap gap-3 justify-between"><div><b>{o.order_number}</b><p className="text-sm text-[#57524E]">{o.customer_name} · {o.customer_city}</p></div><div className="text-right"><b>{formatNaira(o.total)}</b><p className="text-xs uppercase text-[#8C7355]">{o.payment_status} · {o.order_status}</p></div></div>)}</div>
              </div>
            </section>}

            {tab==='products' && <section>
              <div className="flex justify-between items-center mb-5"><div><p className="text-sm text-[#57524E]">{products.length} catalog records</p></div><button onClick={()=>setProductEditor({...blankProduct})} className="px-4 py-3 bg-[#181513] text-white text-xs uppercase tracking-widest flex items-center gap-2"><Plus size={15}/> Add product</button></div>
              <div className="bg-white border overflow-x-auto">
                <table className="w-full text-sm min-w-[900px]"><thead className="bg-[#ECE5DC] text-xs uppercase tracking-wider"><tr><th className="p-3 text-left">Product</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Price</th><th className="p-3 text-left">Stock</th><th className="p-3 text-left">Status</th><th className="p-3"></th></tr></thead><tbody className="divide-y">{products.map(p=><tr key={p.id}><td className="p-3"><b>{p.name}</b><div className="text-xs text-[#8C7355]">{p.slug}</div></td><td className="p-3">{p.categories?.name || '—'}</td><td className="p-3">{formatNaira(p.price)}</td><td className="p-3">{p.stock_quantity ?? '∞'}</td><td className="p-3">{p.is_active ? p.availability : 'HIDDEN'}</td><td className="p-3 text-right"><button onClick={async()=>{const {data}=await client.from('product_images').select('url,sort_order').eq('product_id',p.id).order('sort_order');setProductEditor({...p,materials:(p.materials||[]).join(', '),gallery:(data||[]).slice(1).map((x:any)=>x.url).join('\n')})}} className="p-2"><Pencil size={15}/></button><button onClick={()=>deleteProduct(p.id)} className="p-2 text-[#9E3E20]"><Trash2 size={15}/></button></td></tr>)}</tbody></table>
              </div>
            </section>}

            {tab==='orders' && <section className="bg-white border">
              <div className="p-5 border-b"><p className="text-sm text-[#57524E]">Manual WhatsApp orders appear here immediately after checkout.</p></div>
              <div className="divide-y">{orders.map(o=><div key={o.id} className="p-5"><button onClick={()=>openOrder(o.id)} className="w-full text-left"><div className="flex flex-wrap gap-4 justify-between"><div><b className="text-lg">{o.order_number}</b><p className="text-sm text-[#57524E]">{o.customer_name} · {o.customer_phone} · {o.customer_city}</p><p className="text-xs text-[#8C7355] mt-1">{new Date(o.created_at).toLocaleString()}</p></div><div className="text-right"><b className="font-editorial text-2xl">{formatNaira(o.total)}</b><p className="text-xs uppercase text-[#B84A28]">{o.payment_status}</p></div></div></button>
              <div className="mt-4 flex flex-wrap gap-2">
                <select value={o.payment_status} onChange={e=>updateOrder(o.id,{payment_status:e.target.value})} className="border p-2 text-xs uppercase"><option>PENDING</option><option>AWAITING_CONFIRMATION</option><option>PAID</option><option>FAILED</option><option>REFUNDED</option></select>
                <select value={o.order_status} onChange={e=>updateOrder(o.id,{order_status:e.target.value})} className="border p-2 text-xs uppercase"><option>NEW</option><option>PROCESSING</option><option>READY_FOR_DELIVERY</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option></select>
                <a href={`https://wa.me/${String(o.customer_phone||'').replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="border px-3 py-2 text-xs uppercase tracking-wider">WhatsApp customer</a>
              </div>
              {expandedOrder===o.id && <div className="mt-5 bg-[#F4EFEA] p-4"><p className="text-xs uppercase tracking-widest text-[#8C7355] mb-3">Items</p>{orderItems.map(i=><div key={i.id} className="flex justify-between py-2 border-b border-black/10 text-sm"><span>{i.product_name} × {i.quantity}</span><b>{formatNaira(i.subtotal)}</b></div>)}<div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm"><p><b>Delivery:</b> {o.customer_address}, {o.customer_city}, {o.customer_state}, {o.customer_country}</p><p><b>Email:</b> {o.customer_email || '—'}<br/><b>Notes:</b> {o.patron_notes || '—'}</p></div></div>}</div>)}</div>
            </section>}

            {tab==='makers' && <ReferenceManager title="Makers" rows={makers} type="maker" onEdit={r=>setReferenceEditor({type:'maker',row:{...r}})} onDelete={id=>deleteReference('maker',id)} onAdd={()=>setReferenceEditor({type:'maker',row:{name:'',slug:'',title:'',location:'',discipline:'',speciality:'',bio:'',quote:'',heritage_notes:'',image:'',is_active:true}})} />}
            {tab==='collections' && <ReferenceManager title="Collections" rows={collections} type="collection" onEdit={r=>setReferenceEditor({type:'collection',row:{...r}})} onDelete={id=>deleteReference('collection',id)} onAdd={()=>setReferenceEditor({type:'collection',row:{name:'',slug:'',subtitle:'',description:'',cover_image:'',aspect_ratio:'4:3',curator_notes:'',sort_order:0,is_active:true}})} />}
            {tab==='categories' && <ReferenceManager title="Categories" rows={categories} type="category" onEdit={r=>setReferenceEditor({type:'category',row:{...r}})} onDelete={id=>deleteReference('category',id)} onAdd={()=>setReferenceEditor({type:'category',row:{name:'',slug:'',description:'',image:'',sort_order:0,is_active:true}})} />}

            {tab==='settings' && <section className="max-w-2xl bg-white border p-6 space-y-5">
              <div><h3 className="font-editorial text-2xl">Marketplace settings</h3><p className="text-sm text-[#57524E] mt-1">These values control manual checkout without editing the website code.</p></div>
              <label className="block"><span className="text-xs uppercase tracking-wider">WhatsApp business number</span><input value={settings.whatsapp_number||''} onChange={e=>setSettings({...settings,whatsapp_number:e.target.value})} placeholder="2348012345678" className="w-full p-3 border mt-1"/></label>
              <label className="block"><span className="text-xs uppercase tracking-wider">Bank name</span><input value={settings.bank_name||''} onChange={e=>setSettings({...settings,bank_name:e.target.value})} placeholder="Bank name" className="w-full p-3 border mt-1"/></label>
              <label className="block"><span className="text-xs uppercase tracking-wider">Account name</span><input value={settings.account_name||''} onChange={e=>setSettings({...settings,account_name:e.target.value})} placeholder="Account name" className="w-full p-3 border mt-1"/></label>
              <label className="block"><span className="text-xs uppercase tracking-wider">Account number</span><input value={settings.account_number||''} onChange={e=>setSettings({...settings,account_number:e.target.value})} placeholder="Account number" className="w-full p-3 border mt-1"/></label>
                            <label className="block"><span className="text-xs uppercase tracking-wider">Flat shipping fee (₦)</span><input type="number" value={settings.shipping_flat_rate??15000} onChange={e=>setSettings({...settings,shipping_flat_rate:Number(e.target.value)})} className="w-full p-3 border mt-1"/></label>
              <label className="block"><span className="text-xs uppercase tracking-wider">Order prefix</span><input value={settings.order_prefix||'RL'} onChange={e=>setSettings({...settings,order_prefix:e.target.value.toUpperCase()})} className="w-full p-3 border mt-1"/></label>
              <button onClick={saveSettings} className="px-5 py-3 bg-[#181513] text-white text-xs uppercase tracking-widest flex items-center gap-2"><Save size={15}/> Save settings</button>
            </section>}
          </div>
        </main>
      </div>

      {productEditor && <ProductEditor product={productEditor} setProduct={setProductEditor} categories={categories} collections={collections} makers={makers} onSave={saveProduct} onUpload={uploadImage} onClose={()=>setProductEditor(null)} />}
      {referenceEditor && <ReferenceEditor editor={referenceEditor} setEditor={setReferenceEditor} onSave={saveReference} onClose={()=>setReferenceEditor(null)} />}
    </div>
  );
};

const ReferenceManager: React.FC<{title:string;rows:Row[];type:string;onEdit:(r:Row)=>void;onDelete:(id:string)=>void;onAdd:()=>void}> = ({title,rows,onEdit,onDelete,onAdd}) => (
  <section>
    <div className="flex justify-between items-center mb-5"><h3 className="font-editorial text-3xl">{title}</h3><button onClick={onAdd} className="px-4 py-3 bg-[#181513] text-white text-xs uppercase tracking-widest flex gap-2 items-center"><Plus size={15}/> Add</button></div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{rows.map(r=><div key={r.id} className="bg-white border p-5"><div className="flex justify-between gap-3"><div><b>{r.name}</b><p className="text-xs text-[#8C7355] mt-1">{r.slug}</p></div><div className="flex"><button onClick={()=>onEdit(r)} className="p-2"><Pencil size={15}/></button><button onClick={()=>onDelete(r.id)} className="p-2 text-[#9E3E20]"><Trash2 size={15}/></button></div></div><p className="text-sm text-[#57524E] mt-4 line-clamp-3">{r.description||r.bio||r.location||r.subtitle||'—'}</p></div>)}</div>
  </section>
);

const ProductEditor: React.FC<any> = ({product,setProduct,categories,collections,makers,onSave,onUpload,onClose}) => {
  const field=(key:string,label:string,type='text')=><label className="block"><span className="text-xs uppercase tracking-wider text-[#57524E]">{label}</span><input type={type} value={product[key]??''} onChange={e=>setProduct({...product,[key]:type==='number'?Number(e.target.value):e.target.value})} className="w-full p-3 border mt-1 bg-white"/></label>;
  return <div className="fixed inset-0 z-50 bg-[#181513]/70 p-3 sm:p-8 overflow-y-auto"><form onSubmit={onSave} className="max-w-5xl mx-auto bg-[#FAF7F2] p-5 sm:p-8 space-y-6">
    <div className="flex justify-between items-center"><div><p className="text-xs uppercase tracking-widest text-[#B84A28]">Catalog editor</p><h2 className="font-editorial text-3xl">{product.id?'Edit product':'Add product'}</h2></div><button type="button" onClick={onClose}><X/></button></div>
    <div className="grid md:grid-cols-2 gap-4">{field('name','Name *')}{field('slug','Slug *')}{field('price','Price (₦) *','number')}{field('stock_quantity','Stock quantity','number')}</div>
    <div className="grid md:grid-cols-3 gap-4">
      <label><span className="text-xs uppercase tracking-wider">Category</span><select value={product.category_id||''} onChange={e=>setProduct({...product,category_id:e.target.value})} className="w-full p-3 border mt-1"><option value="">Uncategorised</option>{categories.map((x:any)=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <label><span className="text-xs uppercase tracking-wider">Collection</span><select value={product.collection_id||''} onChange={e=>setProduct({...product,collection_id:e.target.value})} className="w-full p-3 border mt-1"><option value="">No collection</option>{collections.map((x:any)=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <label><span className="text-xs uppercase tracking-wider">Maker</span><select value={product.maker_id||''} onChange={e=>setProduct({...product,maker_id:e.target.value})} className="w-full p-3 border mt-1"><option value="">No maker</option>{makers.map((x:any)=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
    </div>
    <div className="grid md:grid-cols-2 gap-4"><label><span className="text-xs uppercase tracking-wider">Availability</span><select value={product.availability} onChange={e=>setProduct({...product,availability:e.target.value})} className="w-full p-3 border mt-1">{availabilityOptions.map(x=><option key={x}>{x}</option>)}</select></label>{field('lead_time','Lead time')}</div>
    {field('short_description','Short description')}
    <label className="block"><span className="text-xs uppercase tracking-wider">Description</span><textarea value={product.description||''} onChange={e=>setProduct({...product,description:e.target.value})} rows={5} className="w-full p-3 border mt-1"/></label>
    <div className="grid md:grid-cols-2 gap-4">{field('materials','Materials (comma separated)')}{field('origin','Origin')}{field('dimensions','Dimensions')}{field('care','Care')}</div>
    <label className="block"><span className="text-xs uppercase tracking-wider">Cover image URL</span><div className="flex gap-2 mt-1"><input value={product.cover_image||''} onChange={e=>setProduct({...product,cover_image:e.target.value})} className="w-full p-3 border"/><label className="shrink-0 px-4 py-3 border cursor-pointer"><Upload size={16}/><input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0]&&onUpload(e.target.files[0],(url:string)=>setProduct({...product,cover_image:url}))}/></label></div></label>
    <label className="block"><span className="text-xs uppercase tracking-wider">Additional gallery URLs — one per line</span><textarea value={product.gallery||''} onChange={e=>setProduct({...product,gallery:e.target.value})} rows={3} className="w-full p-3 border mt-1"/></label>
    <div className="flex flex-wrap gap-5 text-sm"><label><input type="checkbox" checked={Boolean(product.is_featured)} onChange={e=>setProduct({...product,is_featured:e.target.checked})}/> Featured</label><label><input type="checkbox" checked={Boolean(product.is_new)} onChange={e=>setProduct({...product,is_new:e.target.checked})}/> New arrival</label><label><input type="checkbox" checked={Boolean(product.is_active)} onChange={e=>setProduct({...product,is_active:e.target.checked})}/> Visible in store</label></div>
    <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={onClose} className="px-5 py-3 border text-xs uppercase tracking-widest">Cancel</button><button className="px-5 py-3 bg-[#181513] text-white text-xs uppercase tracking-widest flex items-center gap-2"><Save size={15}/> Save product</button></div>
  </form></div>;
};

const ReferenceEditor: React.FC<any> = ({editor,setEditor,onSave,onClose}) => {
  const {type,row}=editor;
  const fields = type==='maker'
    ? [['name','Name'],['slug','Slug'],['title','Title'],['location','Location'],['discipline','Discipline'],['speciality','Speciality'],['image','Image URL'],['bio','Bio'],['quote','Quote'],['heritage_notes','Heritage notes']]
    : type==='collection'
    ? [['name','Name'],['slug','Slug'],['subtitle','Subtitle'],['cover_image','Cover image URL'],['aspect_ratio','Aspect ratio'],['sort_order','Sort order'],['description','Description'],['curator_notes','Curator notes']]
    : [['name','Name'],['slug','Slug'],['image','Image URL'],['sort_order','Sort order'],['description','Description']];
  return <div className="fixed inset-0 z-50 bg-[#181513]/70 p-3 sm:p-8 overflow-y-auto"><div className="max-w-2xl mx-auto bg-[#FAF7F2] p-6 sm:p-8"><div className="flex justify-between mb-6"><h2 className="font-editorial text-3xl">{row.id?'Edit':'Add'} {type}</h2><button onClick={onClose}><X/></button></div><div className="space-y-4">{fields.map(([key,label])=><label key={key} className="block"><span className="text-xs uppercase tracking-wider">{label}</span>{['description','bio','quote','heritage_notes','curator_notes'].includes(key)?<textarea value={row[key]??''} onChange={e=>setEditor({...editor,row:{...row,[key]:e.target.value}})} rows={3} className="w-full p-3 border mt-1"/>:<input type={['sort_order'].includes(key)?'number':'text'} value={row[key]??''} onChange={e=>setEditor({...editor,row:{...row,[key]:['sort_order'].includes(key)?Number(e.target.value):e.target.value}})} className="w-full p-3 border mt-1"/>}</label>)}</div><div className="flex justify-end gap-3 mt-6"><button onClick={onClose} className="px-4 py-3 border text-xs uppercase">Cancel</button><button onClick={onSave} className="px-4 py-3 bg-[#181513] text-white text-xs uppercase flex gap-2"><Save size={15}/> Save</button></div></div></div>;
};
