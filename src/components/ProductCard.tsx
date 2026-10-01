import React from 'react';
import { Product } from '../types';
import { ArchivalImage } from './ArchivalImage';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

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
      className="group cursor-pointer flex flex-col justify-between bg-[#FAF7F2] border border-[#181513]/10 hover:border-[#181513]/30 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#ECE5DC] aspect-[4/3] w-full">
        <ArchivalImage
          src={product.image}
          alt={product.name}
          aspectRatio="custom"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Availability text kicker */}
        <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase bg-[#FAF7F2]/90 backdrop-blur-xs px-2 py-1 text-[#181513]">
          {product.availability}
        </div>

        {/* Quick Add CTA button that appears smoothly on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181513] text-[#FAF7F2] text-[11px] font-mono uppercase tracking-wider hover:bg-[#B84A28] transition-colors shadow-md cursor-pointer"
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus className="w-3 h-3" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Maker unboxed */}
          <div className="flex items-center justify-between text-[11px] text-[#8C7355] font-mono uppercase tracking-wider mb-1.5">
            <span>{product.category}</span>
            <span>{product.maker.region.split(',')[0]}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-editorial text-xl font-medium text-[#181513] group-hover:text-[#B84A28] transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Subtitle / Description */}
          <p className="text-xs text-[#57524E] line-clamp-2 leading-relaxed mb-3">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Maker Attribution Footer */}
        <div className="pt-3 border-t border-[#181513]/10 flex items-baseline justify-between">
          <span className="text-xs text-[#57524E] truncate max-w-[180px]">
            By {product.maker.name}
          </span>
          <span className="font-editorial text-lg font-semibold text-[#181513] tabular-nums">
            ${product.price.toLocaleString()} {product.currency}
          </span>
        </div>
      </div>
    </div>
  );
};
