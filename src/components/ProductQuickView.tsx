import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/format';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetail: (slug: string) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onViewFullDetail,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  useEffect(() => {
    setQuantity(1);
    setSelectedImgIdx(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const currentImg = product.gallery?.[selectedImgIdx] || product.image;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 overscroll-contain">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#181513]/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl bg-[#FAF7F2] border border-[#181513]/15 shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 min-h-11 min-w-11 p-2 bg-[#FAF7F2]/90 hover:bg-[#FAF7F2] text-[#181513] rounded-full transition-colors cursor-pointer border border-[#181513]/10"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Imagery Gallery */}
          <div className="bg-[#ECE5DC] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#181513]/10">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#181513]/10 bg-[#E3DBD0]">
              <img
                src={currentImg}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Thumbnail Carousel */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2.5 mt-4">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImgIdx(i)}
                    className={`w-16 h-14 overflow-hidden border transition-all cursor-pointer ${
                      selectedImgIdx === i
                        ? 'border-[#B84A28] ring-1 ring-[#B84A28]'
                        : 'border-[#181513]/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#181513]/10 flex items-center justify-end text-xs font-mono text-[#8C7355] uppercase">
              <span>{product.availability}</span>
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#8C7355] uppercase tracking-wider mb-2">
                <span>{product.category}</span>
                <span>·</span>
                <span className="text-[#B84A28] font-medium">{product.maker.name}</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#181513] mb-2 leading-snug">
                {product.name}
              </h2>

              <p className="text-xl font-bold text-[#181513] font-mono mb-4">
                {formatNaira(product.price)}
              </p>

              <p className="text-sm text-[#4A4036] leading-relaxed mb-6 font-sans">
                {product.description}
              </p>

            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#181513]/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#181513]/25 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#57524E] hover:text-[#181513] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-mono tabular-nums text-[#181513]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-[#57524E] hover:text-[#181513] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 button button-dark justify-center py-3 text-xs"
                >
                  ADD TO BAG · {formatNaira(product.price * quantity)}
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onViewFullDetail(product.slug);
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#57524E] hover:text-[#181513] transition-colors py-1 cursor-pointer"
              >
                <span>VIEW PRODUCT DETAILS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
