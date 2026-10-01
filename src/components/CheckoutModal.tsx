import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, setIsCheckoutModalOpen, subtotal, totalItems } = useCart();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setSubscribed(false);
    setEmail('');
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181513]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] border border-[#181513]/15 shadow-2xl p-8 lg:p-10 text-[#181513]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-[#57524E] hover:text-[#181513] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        {!subscribed ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Guild Procurement</span>
            </div>

            <h3 className="font-editorial text-3xl lg:text-4xl font-medium tracking-tight mb-3">
              Checkout Preparing For Global Launch
            </h3>

            <p className="text-sm text-[#57524E] leading-relaxed mb-6 font-normal">
              The Raffia Legacy marketplace directly empowers community artisan guilds across Nigeria. Our global payment gateway and international insured shipping integration are currently being configured for the inaugural drop.
            </p>

            <div className="bg-[#ECE5DC] p-4 mb-6 border border-[#DDD4C5] flex items-center justify-between text-xs">
              <div>
                <p className="font-mono uppercase text-[#8C7355] text-[10px]">Your Order Reserve</p>
                <p className="font-medium text-sm text-[#181513] mt-0.5">{totalItems} handcrafted {totalItems === 1 ? 'item' : 'items'}</p>
              </div>
              <div className="text-right">
                <p className="font-mono uppercase text-[#8C7355] text-[10px]">Estimated Subtotal</p>
                <p className="font-editorial text-xl font-semibold text-[#181513] tabular-nums mt-0.5">${subtotal.toLocaleString()} USD</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-[#57524E] mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chinelo Okonjo"
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#181513]/20 text-sm focus:border-[#B84A28] focus:outline-none placeholder:text-[#57524E]/40"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-[#57524E] mb-1.5">
                  Email for Early Access & Direct Dispatch
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#181513]/20 text-sm focus:border-[#B84A28] focus:outline-none placeholder:text-[#57524E]/40"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#181513] text-[#FAF7F2] text-xs font-medium uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
                >
                  Reserve Basket & Join Private Buyer List
                </button>
              </div>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#57524E]/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C7355]" />
              <span>Certified Artisan Provenance Guarantee by Dance Ville</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#B84A28]/10 text-[#B84A28] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h4 className="font-editorial text-3xl font-medium mb-2">
              Order Reserve Recorded
            </h4>
            <p className="text-sm text-[#57524E] max-w-sm mx-auto mb-6 leading-relaxed">
              Thank you, {name || 'patron'}. Your reserved basket of {totalItems} items (${subtotal} USD) has been logged with our curatorial liaison. You will receive private access before public release.
            </p>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#181513] text-[#FAF7F2] text-xs uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
