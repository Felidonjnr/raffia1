import React from 'react';
import { Product } from '../types';
import { ArchivalImage } from './ArchivalImage';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';
import { formatNaira } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onSelect: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={() => onSelect(product.slug)}
      className="product-card group cursor-pointer flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="product-card-media relative overflow-hidden aspect-[4/3] w-full">
        <ArchivalImage
          src={product.image}
          alt={product.name}
          aspectRatio="custom"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Availability Badge */}
        <div className="product-card-badge absolute top-3 left-3">
          {product.availability}
        </div>

        {/* Quick Add CTA button on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            className="product-card-quick-add flex items-center gap-1.5"
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="product-card-body p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-2 text-[#8C7355]">
            <span>{product.category}</span>
            <span>{product.maker.region.split(',')[0]}</span>
          </div>

          <h3 className="product-card-title text-lg font-bold tracking-tight mb-1.5 line-clamp-1">
            {product.name}
          </h3>

          <p className="product-card-desc text-xs line-clamp-2 leading-relaxed mb-4">
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
    </div>
  );
};
