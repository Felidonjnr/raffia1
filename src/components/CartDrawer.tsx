import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ArchivalImage } from './ArchivalImage';
import { formatNaira } from '../utils/format';

interface CartDrawerProps {
  onNavigateToProduct?: (slug: string) => void;
  onNavigateToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToProduct,
  onNavigateToCheckout,
}) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCartOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#181513]/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#181513]/15 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#181513]/10 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h2 className="font-editorial text-2xl font-medium tracking-tight text-[#181513]">
                Your Selection
              </h2>
              <span className="font-mono text-xs text-[#8C7355] tracking-wider uppercase">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#57524E] hover:text-[#181513] transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-[#181513]/10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#ECE5DC] flex items-center justify-center text-[#8C7355] mb-4">
                  <ShoppingBag className="w-6 h-6 stroke-1" />
                </div>
                <p className="font-editorial text-2xl font-normal text-[#181513] mb-1">
                  Your bag is currently empty
                </p>
                <p className="text-xs text-[#57524E] max-w-xs mb-6">
                  Explore hand-woven raffia objects, fashion and traditional craft.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-[#181513] text-[#FAF7F2] text-xs uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
                >
                  Explore Marketplace
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-5 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <button
                    type="button"
                    aria-label={'View ' + product.name}
                    className="w-20 h-24 shrink-0 cursor-pointer overflow-hidden border border-[#DDD4C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B84A28]"
                    onClick={() => {
                      if (onNavigateToProduct) {
                        setIsCartOpen(false);
                        onNavigateToProduct(product.slug);
                      }
                    }}
                  >
                    <ArchivalImage
                      src={product.image}
                      alt={product.name}
                      aspectRatio="custom"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-widest text-[#8C7355]">
                            {product.category}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (onNavigateToProduct) {
                                setIsCartOpen(false);
                                onNavigateToProduct(product.slug);
                              }
                            }}
                            className="text-left text-sm font-medium text-[#181513] hover:text-[#B84A28] transition-colors cursor-pointer line-clamp-1 mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B84A28]"
                          >
                            {product.name}
                          </button>
                          <p className="text-xs text-[#57524E] mt-0.5">
                            By {product.maker.name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-[#57524E]/60 hover:text-[#B84A28] transition-colors p-1 cursor-pointer"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#181513]/20 bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-[#57524E] hover:text-[#181513] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums text-[#181513]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-[#57524E] hover:text-[#181513] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-editorial text-base font-semibold text-[#181513] tabular-nums">
                        {formatNaira(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F4EFEA] border-t border-[#181513]/10 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#57524E]">
                  <span>Items Subtotal</span>
                  <span className="font-mono tabular-nums">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#57524E]">
                  <span>Packaging & Handling</span>
                  <span className="font-mono text-[#8C7355]">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-[#181513]/10 flex justify-between text-sm font-semibold text-[#181513]">
                  <span>Total Due</span>
                  <span className="font-editorial text-xl tabular-nums">
                    {formatNaira(subtotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 bg-[#181513] text-[#FAF7F2] text-xs font-medium uppercase tracking-widest hover:bg-[#B84A28] transition-colors flex items-center justify-center gap-3 cursor-pointer group shadow-sm font-mono"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-[#57524E] tracking-wider uppercase font-mono">
                Prepared for Paystack
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
