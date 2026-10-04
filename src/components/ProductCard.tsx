import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ArrowUpRight, Eye, Plus } from 'lucide-react';
import { formatNaira } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSelect: (slug: string) => void;
  onQuickView?: (product: Product) => void;
  featured?: boolean;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
  featured = false,
  index = 0,
}) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const secondaryImage = product.gallery?.[1];
  const imageRatio = featured ? 'aspect-[4/3]' : index % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[5/6]';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
    else onSelect(product.slug);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.18) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div className={`relative ${imageRatio} overflow-hidden bg-[#E4D9CA]`}>
        <button
          type="button"
          onClick={() => onSelect(product.slug)}
          className="absolute inset-0 z-[1] cursor-pointer"
          aria-label={`View ${product.name}`}
        />

        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading={index < 2 ? 'eager' : 'lazy'}
          className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035] ${isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'}`}
        />

        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} detail view`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035] ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        <div className="absolute left-4 top-4 z-[2] border border-[#FAF7F2]/50 bg-[#181513]/75 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#FAF7F2] backdrop-blur-sm">
          {product.availability}
        </div>

        <div className="absolute inset-x-4 bottom-4 z-[3] flex items-end justify-between gap-3 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
          <button
            onClick={handleQuickView}
            className="flex min-h-11 items-center gap-2 border border-[#FAF7F2]/40 bg-[#181513]/85 px-4 text-sm font-bold uppercase tracking-wide text-[#FAF7F2] backdrop-blur-sm transition-colors hover:bg-[#FAF7F2] hover:text-[#181513]"
          >
            <Eye size={16} />
            QUICK VIEW
          </button>
          <button
            onClick={handleQuickAdd}
            className="flex min-h-11 items-center gap-2 bg-[#D58A5B] px-4 text-sm font-black uppercase tracking-wide text-[#181513] transition-transform hover:scale-[1.03]"
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus size={16} />
            ADD
          </button>
        </div>
      </div>

      <div className="pt-5">
        <div className="mb-2 flex items-center justify-between gap-4 text-sm font-bold uppercase tracking-[0.12em] text-[#8C7355]">
          <span>{product.category}</span>
          {(product.newArrival || product.isNewArrival) && <span className="text-[#A94C2E]">NEW</span>}
        </div>

        <button
          type="button"
          onClick={() => onSelect(product.slug)}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <span className="text-2xl font-black leading-[0.95] tracking-[-0.03em] transition-colors group-hover:text-[#A94C2E] sm:text-3xl">
            {product.name}
          </span>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>

        <p className="mt-3 max-w-xl text-base leading-relaxed text-[#57524E]">
          {product.subtitle}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[#181513]/15 pt-3">
          <span className="text-base font-semibold text-[#57524E]">{product.availability}</span>
          <span className="text-xl font-black tabular-nums">{formatNaira(product.price)}</span>
        </div>
      </div>
    </motion.article>
  );
};
