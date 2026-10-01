import React, { useState, useMemo } from 'react';
import { ProductCategory, Product, ViewRoute } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';

interface MarketplacePageProps {
  initialCategory?: ProductCategory;
  initialCollection?: string;
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const CATEGORIES: ProductCategory[] = [
  'ALL',
  'NEW ARRIVALS',
  'FASHION & ACCESSORIES',
  'HOME & LIFESTYLE',
  'ART & DESIGN',
  'TRADITIONAL CRAFT',
  'GIFTS',
  'FESTIVAL MERCHANDISE',
];

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  initialCategory = 'ALL',
  initialCollection,
  onNavigate,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Collection filter if passed
      if (initialCollection && initialCollection !== 'ALL') {
        if (product.collection !== initialCollection) return false;
      }

      // Category filter
      if (selectedCategory === 'NEW ARRIVALS') {
        if (!product.isNewArrival) return false;
      } else if (selectedCategory !== 'ALL' && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
        const matchesMaker = product.maker.name.toLowerCase().includes(q);
        const matchesMaterials = product.materials.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesSubtitle && !matchesMaker && !matchesMaterials) {
          return false;
        }
      }

      // In-stock filter
      if (showInStockOnly && product.availability !== 'IN STOCK') {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, sortBy, showInStockOnly, initialCollection]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Editorial Header */}
      <section className="pt-12 pb-16 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#57524E] hover:text-[#181513] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-3">
              Direct Guild Marketplace
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#181513] leading-[1.05]">
              THE RAFFIA <br />
              <span className="italic font-normal">MARKETPLACE</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#57524E] leading-relaxed max-w-md font-normal">
              Objects, fashion, craft and contemporary creations connected to the raffia story. Every acquisition directly finances artisan apprenticeships and preserves ancestral weaving guilds in Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation & Filter Bar */}
      <section className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#181513]/10 py-4 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-mono uppercase tracking-wider">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#181513] text-[#FAF7F2] border-[#181513] font-medium'
                    : 'text-[#57524E] border-transparent hover:text-[#181513] hover:bg-[#181513]/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#181513]/20 focus:border-[#B84A28] focus:outline-none w-36 sm:w-44"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#57524E]" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#181513]/20 focus:border-[#B84A28] focus:outline-none cursor-pointer font-mono uppercase"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </section>

      {/* Product Results Grid */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12">
        <div className="flex items-center justify-between text-xs text-[#57524E] font-mono tracking-wider mb-8 pb-3 border-b border-[#181513]/10">
          <span>
            SHOWING {filteredProducts.length} {filteredProducts.length === 1 ? 'OBJECT' : 'OBJECTS'} IN {selectedCategory}
          </span>
          <button
            onClick={() => setShowInStockOnly(!showInStockOnly)}
            className={`cursor-pointer transition-colors ${
              showInStockOnly ? 'text-[#B84A28] font-semibold underline' : 'hover:text-[#181513]'
            }`}
          >
            {showInStockOnly ? '✓ In Stock Only' : 'Filter: In Stock Only'}
          </button>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#F4EFEA] border border-[#181513]/10 max-w-xl mx-auto p-10">
            <p className="font-editorial text-3xl font-light text-[#181513] mb-2">
              No creations match this selection
            </p>
            <p className="text-xs text-[#57524E] mb-6">
              Try adjusting your search criteria or select &quot;All&quot; to view all guild items.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setShowInStockOnly(false);
              }}
              className="px-6 py-2.5 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
