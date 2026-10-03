import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { ViewRoute } from '../types';
import { ArchivalImage } from '../components/ArchivalImage';
import { formatNaira } from '../utils/format';
import { createManualOrder, getMarketplaceSettings, buildWhatsAppUrl } from '../lib/marketplace';
import { ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react';

interface CheckoutPageProps { onNavigate: (route: ViewRoute) => void; }

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName:'', lastName:'', email:'', phone:'', address:'', city:'',
    stateRegion:'', country:'Nigeria', postalCode:'', patronNotes:''
  });
  const [shippingCost, setShippingCost] = useState(15000);
  const [order, setOrder] = useState<{order_number:string; total:number; whatsapp_number:string}|null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { getMarketplaceSettings().then(s => setShippingCost(Number(s.shipping_flat_rate || 0))); }, []);

  const estimatedTotal = subtotal + (items.length ? shippingCost : 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await createManualOrder({
        customer: formData,
        items: items.map(({product,quantity}) => ({productId: product.id, quantity}))
      });
      setOrder({ order_number: result.order_number, total: Number(result.total), whatsapp_number: result.whatsapp_number });
      const lines = [
        'Hello Raffia Legacy Project, I want to place an order.',
        '',
        `Order: #${result.order_number}`,
        ...items.map(({product,quantity}) => `• ${product.name} × ${quantity} — ${formatNaira(product.price * quantity)}`),
        '',
        `Subtotal: ${formatNaira(result.subtotal)}`,
        `Shipping: ${formatNaira(result.shipping_fee)}`,
        `Total: ${formatNaira(result.total)}`,
        '',
        `Customer: ${formData.firstName} ${formData.lastName}`,
        `Phone: ${formData.phone}`,
        `Email: ${formData.email}`,
        `Delivery: ${formData.address}, ${formData.city}, ${formData.stateRegion}, ${formData.country}`,
        formData.patronNotes ? `Notes: ${formData.patronNotes}` : '',
        '',
        'I will complete the payment by the agreed manual transfer method.'
      ].filter(Boolean).join('\n');
      const url = buildWhatsAppUrl(result.whatsapp_number, lines);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      clearCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We could not create your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (order) return (
    <div className="checkout-page min-h-screen bg-[#FAF7F2] pb-28">
      <section className="max-w-2xl mx-auto px-6 pt-20">
        <div className="bg-[#FAF7F2] border border-[#181513]/15 p-8 sm:p-14 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#B84A28]/10 text-[#B84A28] flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8"/></div>
          <p className="text-xs uppercase tracking-widest text-[#B84A28]">Order created · {order.order_number}</p>
          <h1 className="font-editorial text-4xl sm:text-5xl">Your order is ready.</h1>
          <p className="text-sm text-[#57524E] leading-relaxed">We have recorded your order for {formatNaira(order.total)}. WhatsApp should have opened with your order details so the Raffia Legacy team can confirm payment and fulfilment.</p>
          <div className="bg-[#ECE5DC] p-5 text-left text-sm space-y-2">
            <div className="flex justify-between"><span>Total</span><b>{formatNaira(order.total)}</b></div>
            <div className="flex justify-between"><span>Payment</span><b>Manual transfer / WhatsApp</b></div>
            <div className="flex justify-between"><span>Status</span><b>Awaiting confirmation</b></div>
          </div>
          {!order.whatsapp_number && <p className="text-sm text-[#9E3E20]">The marketplace WhatsApp number has not been configured yet. The order is still saved; the administrator can contact you from the dashboard.</p>}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {order.whatsapp_number && <button onClick={() => {
              const url = buildWhatsAppUrl(order.whatsapp_number, `Hello Raffia Legacy Project, I am following up on Order #${order.order_number}.`);
              if (url) window.open(url,'_blank','noopener,noreferrer');
            }} className="px-5 py-3 bg-[#B84A28] text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2"><MessageCircle size={16}/> Open WhatsApp</button>}
            <button onClick={() => onNavigate({type:'marketplace'})} className="px-5 py-3 border text-xs uppercase tracking-widest">Continue shopping</button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="checkout-page min-h-screen bg-[#FAF7F2] pb-28">
      <section className="pt-8 pb-8 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <button onClick={()=>onNavigate({type:'marketplace'})} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#57524E] hover:text-[#181513]"><ArrowLeft className="w-4 h-4"/> Return to Marketplace</button>
      </section>
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-10">
        {items.length===0 ? (
          <div className="p-16 text-center bg-[#F4EFEA] border border-[#181513]/10 max-w-xl mx-auto space-y-4">
            <p className="font-editorial text-3xl">Your bag is currently empty</p>
            <button onClick={()=>onNavigate({type:'marketplace'})} className="px-6 py-3 bg-[#181513] text-white text-xs uppercase tracking-widest">Explore Marketplace</button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div><span className="text-xs uppercase tracking-widest text-[#B84A28]">Manual marketplace checkout</span><h1 className="font-editorial text-4xl sm:text-5xl mt-2">PLACE YOUR ORDER</h1><p className="text-sm text-[#57524E] mt-3 max-w-xl">Your order is recorded first. WhatsApp then connects you with the Raffia Legacy team to confirm payment and fulfilment.</p></div>
              <div className="bg-[#FAF7F2] border border-[#181513]/15 p-6 sm:p-8 space-y-4">
                <h3 className="font-editorial text-2xl">01. Contact Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(['firstName','lastName','email','phone'] as const).map(k=><label key={k}><span className="block text-xs uppercase tracking-wider text-[#57524E] mb-1">{k==='firstName'?'First Name *':k==='lastName'?'Last Name *':k==='email'?'Email Address *':'Phone Number *'}</span><input required type={k==='email'?'email':k==='phone'?'tel':'text'} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})} className="w-full p-3 border border-[#181513]/20 bg-[#FAF7F2]"/></label>)}
                </div>
              </div>
              <div className="bg-[#FAF7F2] border border-[#181513]/15 p-6 sm:p-8 space-y-4">
                <h3 className="font-editorial text-2xl">02. Delivery</h3>
                <label className="block"><span className="text-xs uppercase tracking-wider">Street Address *</span><input required value={formData.address} onChange={e=>setFormData({...formData,address:e.target.value})} className="w-full p-3 border mt-1"/></label>
                <div className="grid sm:grid-cols-3 gap-4">{(['city','stateRegion','postalCode'] as const).map(k=><label key={k}><span className="block text-xs uppercase tracking-wider">{k==='stateRegion'?'State / Region *':k==='postalCode'?'Postal Code':'City *'}</span><input required={k!=='postalCode'} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})} className="w-full p-3 border mt-1"/></label>)}</div>
                <label className="block"><span className="text-xs uppercase tracking-wider">Country *</span><select value={formData.country} onChange={e=>setFormData({...formData,country:e.target.value})} className="w-full p-3 border mt-1"><option>Nigeria</option><option>Ghana</option><option>United Kingdom</option><option>United States</option></select></label>
                <label className="block"><span className="text-xs uppercase tracking-wider">Order notes</span><textarea value={formData.patronNotes} onChange={e=>setFormData({...formData,patronNotes:e.target.value})} rows={3} className="w-full p-3 border mt-1" placeholder="Anything the maker or delivery team should know?"/></label>
              </div>
              <div className="bg-[#ECE5DC] border border-[#DDD4C5] p-6 sm:p-8"><h3 className="font-editorial text-2xl mb-3">03. Payment</h3><p className="text-sm text-[#57524E] leading-relaxed">For now, payment is handled manually. After you submit, your order number and itemised request are sent to the marketplace WhatsApp contact. The team will confirm the transfer details and mark your order as paid from the admin dashboard.</p></div>
              {error && <div className="border border-[#B84A28]/30 bg-[#B84A28]/5 p-4 text-sm text-[#7A2F1B]" role="alert">{error}</div>}
              <button disabled={submitting} className="w-full py-4 bg-[#B84A28] text-white text-sm uppercase tracking-widest font-semibold disabled:opacity-60">{submitting?'Creating order…':'Create order & continue to WhatsApp'}</button>
            </div>
            <aside className="lg:col-span-5 bg-[#FAF7F2] border border-[#181513]/15 p-6 sm:p-8 lg:sticky lg:top-28 space-y-6">
              <h3 className="font-editorial text-2xl pb-3 border-b border-[#181513]/10">Order Summary ({totalItems})</h3>
              <div className="divide-y divide-[#181513]/10">{items.map(({product,quantity})=><div key={product.id} className="py-3 flex gap-3"><div className="w-14 h-16 bg-[#ECE5DC] overflow-hidden"><ArchivalImage src={product.image} alt={product.name} aspectRatio="custom" className="w-full h-full object-cover"/></div><div className="flex-1"><p className="text-sm font-medium">{product.name}</p><p className="text-xs text-[#8C7355]">Qty: {quantity}</p><p className="font-editorial text-sm mt-2">{formatNaira(product.price*quantity)}</p></div></div>)}</div>
              <div className="pt-4 border-t border-[#181513]/10 space-y-2 text-sm"><div className="flex justify-between text-[#57524E]"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div><div className="flex justify-between text-[#57524E]"><span>Estimated shipping</span><span>{formatNaira(items.length?shippingCost:0)}</span></div><div className="pt-3 border-t border-[#181513]/10 flex justify-between text-base font-semibold"><span>Estimated total</span><span className="font-editorial text-2xl">{formatNaira(estimatedTotal)}</span></div></div>
            </aside>
          </form>
        )}
      </section>
    </div>
  );
};
