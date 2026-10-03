import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { ViewRoute } from '../types';
import { ArchivalImage } from '../components/ArchivalImage';
import { formatNaira } from '../utils/format';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (route: ViewRoute) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    stateRegion: '',
    country: 'Nigeria',
    postalCode: '',
    patronNotes: '',
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [paymentChannel, setPaymentChannel] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const shippingCost = items.length > 0 ? 15000 : 0;
  const grandTotal = subtotal + shippingCost;

  useEffect(() => {
    const hashQuery = window.location.hash.split('?')[1] || '';
    const params = new URLSearchParams(hashQuery);
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) return;

    setIsVerifying(true);
    fetch('/api/paystack/verify?reference=' + encodeURIComponent(reference))
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || data.status !== 'success') {
          throw new Error(data.error || 'Payment could not be verified.');
        }
        setOrderReference(data.reference || reference);
        setPaymentChannel(data.channel || 'Paystack');
        setOrderConfirmed(true);
        window.history.replaceState({}, '', window.location.pathname + '#/checkout');
      })
      .catch((error) => {
        setPaymentError(error instanceof Error ? error.message : 'Payment verification failed.');
      })
      .finally(() => setIsVerifying(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    setIsPaying(true);

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          stateRegion: formData.stateRegion,
          country: formData.country,
          items: items.map(({ product, quantity }) => ({
            id: product.id,
            quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.authorization_url) {
        throw new Error(data.error || 'Unable to start payment.');
      }

      window.location.href = data.authorization_url;
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Unable to start payment.');
      setIsPaying(false);
    }
  };

  return (
    <div className="checkout-page min-h-screen bg-[#FAF7F2] pb-28">
      {/* Header */}
      <section className="pt-8 pb-8 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <button
          onClick={() => onNavigate({ type: 'marketplace' })}
          className="inline-flex items-center gap-2 text-xs  uppercase tracking-widest text-[#57524E] hover:text-[#181513] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </button>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-10">
        {!orderConfirmed ? (
          <div>
            {isVerifying && (
              <div className="mb-6 border border-[#B84A28]/20 bg-[#B84A28]/5 px-4 py-3 text-sm text-[#57524E]" role="status">
                Verifying your Paystack payment…
              </div>
            )}
            <div className="mb-10">
              <span className="text-xs  uppercase tracking-widest text-[#B84A28] block mb-2">
                Order Reservation
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
                CHECKOUT & RESERVATION
              </h1>
            </div>

            {items.length === 0 ? (
              <div className="p-16 text-center bg-[#F4EFEA] border border-[#181513]/10 max-w-xl mx-auto space-y-4">
                <p className="font-editorial text-3xl font-light text-[#181513]">Your bag is currently empty</p>
                <p className="text-xs text-[#57524E]">Add items from the marketplace before proceeding.</p>
                <button
                  onClick={() => onNavigate({ type: 'marketplace' })}
                  className="px-6 py-3 bg-[#181513] text-[#FAF7F2] text-xs  uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
                >
                  Explore Marketplace
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Contact, Shipping, & Paystack Preparation (7 cols) */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Contact Info */}
                  <div className="bg-[#FAF7F2] border border-[#181513]/15 p-6 sm:p-8 space-y-4">
                    <h3 className="font-editorial text-2xl font-medium text-[#181513]">
                      01. Contact Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs  uppercase tracking-wider text-[#57524E] mb-1">
                          First Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full p-3 bg-[#FAF7F2] border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B84A28] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs  uppercase tracking-wider text-[#57524E] mb-1">
                          Last Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full p-3 bg-[#FAF7F2] border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B84A28] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs  uppercase tracking-wider text-[#57524E] mb-1">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-3 bg-[#FAF7F2] border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B84A28] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs  uppercase tracking-wider text-[#57524E] mb-1">
                          Phone Number *
                        </label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+234 ..."
                          className="w-full p-3 bg-[#FAF7F2] border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B84A28] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="bg-[#FAF7F2] border border-[#181513]/15 p-6 sm:p-8 space-y-4">
                    <h3 className="font-editorial text-2xl font-medium text-[#181513]">
                      02. Delivery Location
                    </h3>

                    <div>
                      <label className="block text-xs  uppercase tracking-wider text-[#57524E] mb-1">
                        Street Address *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full p-3 bg-[#FAF7F2] border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B84A28] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs  uppercase tracking-wider text-[#57524E] mb-1">
                          City *
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full p-3 bg-[#FAF7F2] border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B84A28] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs  uppercase tracking-wider text-[#57524E] mb-1">
                          State / Region *
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.stateRegion}
                          onChange={(e) => setFormData({ ...formData, stateRegion: e.target.value })}
                          className="w-full p-3 bg-[#FAF7F2] border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B84A28] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs  uppercase tracking-wider text-[#57524E] mb-1">
                          Country *
                        </label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full p-3 bg-[#FAF7F2] border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B84A28] outline-none"
                        >
                          <option value="Nigeria">Nigeria</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Ghana">Ghana</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Gateway Preparation (Paystack Ready) */}
                  <div className="bg-[#ECE5DC] border border-[#DDD4C5] p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-editorial text-2xl font-medium text-[#181513]">
                        03. Payment & Settlement
                      </h3>
                      <span className="text-xs  uppercase tracking-widest text-[#B84A28] bg-[#FAF7F2] px-2 py-0.5 border border-[#181513]/10">
                        Secure Paystack Checkout
                      </span>
                    </div>

                    <p className="text-xs text-[#57524E] leading-relaxed">
                      Your order total is calculated again on the server before Paystack is opened. Your payment is completed on Paystack’s secure checkout.
                    </p>

                    <div className="p-4 bg-[#FAF7F2] border border-[#181513]/10 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#181513]">
                        <Lock className="w-3.5 h-3.5 text-[#B84A28]" />
                        <span className=" uppercase font-semibold">Secure Payment Protocol</span>
                      </div>
                      <p className="text-[#57524E]">
                        Available payment channels are presented by Paystack based on your account and transaction settings.
                      </p>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="border border-[#B84A28]/30 bg-[#B84A28]/5 px-4 py-3 text-sm text-[#7A2F1B]" role="alert">
                      {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPaying || isVerifying}
                    className="w-full min-h-14 py-4 bg-[#B84A28] text-white text-sm uppercase tracking-widest hover:bg-[#9E3E20] transition-colors cursor-pointer shadow-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isPaying ? 'Opening Secure Checkout…' : `Pay ${formatNaira(grandTotal)} Securely`}
                  </button>

                  <p className="text-center text-xs text-[#57524E]">
                    You’ll be redirected to Paystack to complete payment securely.
                  </p>
                </div>

                {/* Right Column: Order Review (5 cols) */}
                <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#181513]/15 p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
                  <h3 className="font-editorial text-2xl font-medium text-[#181513] pb-3 border-b border-[#181513]/10">
                    Order Summary ({totalItems})
                  </h3>

                  <div className="divide-y divide-[#181513]/10 max-h-72 overflow-y-auto pr-2">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="py-3 flex gap-3 first:pt-0">
                        <div className="w-14 h-16 bg-[#ECE5DC] overflow-hidden shrink-0 border border-[#DDD4C5]">
                          <ArchivalImage
                            src={product.image}
                            alt={product.name}
                            aspectRatio="custom"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-medium text-[#181513] line-clamp-1">{product.name}</p>
                            <p className="text-xs text-[#8C7355]">Qty: {quantity} · By {product.maker.name}</p>
                          </div>
                          <p className="font-editorial text-sm font-semibold tabular-nums text-[#181513]">
                            {formatNaira(product.price * quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#181513]/10 space-y-2 text-xs">
                    <div className="flex justify-between text-[#57524E]">
                      <span>Items Subtotal</span>
                      <span className=" tabular-nums">{formatNaira(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#57524E]">
                      <span>Estimated Shipping</span>
                      <span className=" tabular-nums">{formatNaira(shippingCost)}</span>
                    </div>
                    <div className="pt-3 border-t border-[#181513]/10 flex justify-between text-base font-semibold text-[#181513]">
                      <span>Total Due</span>
                      <span className="font-editorial text-2xl tabular-nums">
                        {formatNaira(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#ECE5DC] text-xs text-[#57524E] space-y-1">
                    <p className="font-medium text-[#181513]">Carefully Packaged</p>
                    <p>Every piece arrives in protective packaging crafted for handmade raffia works.</p>
                  </div>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Confirmation Receipt State */
          <div className="max-w-2xl mx-auto bg-[#FAF7F2] border border-[#181513]/15 p-8 sm:p-14 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#B84A28]/10 text-[#B84A28] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs  uppercase tracking-widest text-[#B84A28] block">
              Reservation Confirmed · {orderReference}
            </span>

            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
              Thank You, {formData.firstName}.
            </h2>

            <p className="text-sm text-[#57524E] leading-relaxed max-w-lg mx-auto">
              Your reservation of {totalItems} {totalItems === 1 ? 'item' : 'items'} ({formatNaira(grandTotal)}) has been received. A confirmation has been sent to {formData.email}.
            </p>

            <div className="p-5 bg-[#ECE5DC] text-left text-xs space-y-2 border border-[#DDD4C5]">
              <div className="flex justify-between">
                <span className="text-[#8C7355] uppercase ">Contact:</span>
                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7355] uppercase ">Destination:</span>
                <span>{formData.city}, {formData.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7355] uppercase">Payment Status:</span>
                <span className="text-[#B84A28] font-medium">Payment Confirmed</span>
              </div>
              {paymentChannel && (
                <div className="flex justify-between">
                  <span className="text-[#8C7355] uppercase">Channel:</span>
                  <span>{paymentChannel}</span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  clearCart();
                  onNavigate({ type: 'marketplace' });
                }}
                className="px-8 py-3.5 bg-[#181513] text-[#FAF7F2] text-xs  uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
              >
                Return to Marketplace
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
