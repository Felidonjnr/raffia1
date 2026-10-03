import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ArchivalImage } from './ArchivalImage';
import { useCart } from '../context/CartContext';
import { Plus, Eye } from 'lucide-react';
import { formatNaira } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSelect: (slug: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
}) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
    else onSelect(product.slug);
  };

  const secondaryImage = product.gallery?.[1];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="product-card group flex flex-col justify-between"
    >
      {/* Image Container with Dual Image Crossfade */}
      <div className="product-card-media relative overflow-hidden aspect-[4/3] w-full bg-[#E8E1D5]">
        <button
          type="button"
          onClick={() => onSelect(product.slug)}
          className="absolute inset-0 z-[1] cursor-pointer"
          aria-label={'View ' + product.name}
        />
        {/* Primary Image */}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Secondary Detail Image on Hover */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} detail view`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Availability Badge */}
        <div className="product-card-badge absolute top-3 left-3 text-xs tracking-wider font-semibold z-[2] pointer-events-none">
          {product.availability}
        </div>

        {/* Action Controls on hover */}
        <div className="product-card-actions absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 bg-[#FAF7F2] text-[#181513] hover:bg-[#181513] hover:text-[#FAF7F2] transition-colors shadow-md cursor-pointer"
              aria-label={`Quick view ${product.name}`}
              title="Quick view"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className="product-card-quick-add flex items-center gap-1.5 shadow-md cursor-pointer text-xs"
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="product-card-body p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-2 text-[#8C7355]">
            <span>{product.category}</span>
            <span>{product.maker.region.split(',')[0]}</span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(product.slug)}
            className="product-card-title block w-full text-left text-lg font-bold tracking-tight mb-1.5 line-clamp-1 group-hover:text-[#B94E2E] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B65332] focus-visible:ring-offset-2"
          >
            {product.name}
          </button>

          <p className="product-card-desc text-xs line-clamp-2 leading-relaxed mb-4 text-[#4A4036]">
            {product.subtitle}
          </p>
        </div>

        <div className="pt-3 border-t border-[#181513]/10 flex items-baseline justify-between">
          <span className="text-xs text-[#57524E] truncate max-w-[160px]">
            {product.maker.name}
          </span>
          <span className="product-card-price text-lg font-bold tabular-nums">
            {formatNaira(product.price)}
          </span>
        </div>
      </div>
    </motion.article>
  );
};
