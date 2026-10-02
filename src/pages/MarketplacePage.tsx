import React, { useState, useMemo } from 'react';
import { ProductCategory, ViewRoute, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickView } from '../components/ProductQuickView';
import { ArrowLeft, Search, ArrowUpRight, ShieldCheck, Sparkles, Feather } from 'lucide-react';
import { BrushStrokeUnderline } from '../components/RaffiaLogo';

interface MarketplacePageProps {
  initialCategory?: ProductCategory;
  initialCollection?: string;
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'ALL', label: 'All Pieces' },
  { id: 'TRADITIONAL CRAFT', label: 'Traditional Craft' },
  { id: 'OBJECTS & LIVING', label: 'Objects & Living' },
  { id: 'ART & TEXTILES', label: 'Art & Textiles' },
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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Collection filter if passed
      if (initialCollection && initialCollection !== 'ALL') {
        if (product.collection !== initialCollection) return false;
      }

      // Streamlined category filter
      if (selectedCategory !== 'ALL' && product.category !== selectedCategory) {
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
    <div className="marketplace-page">
      {/* Editorial Announcement Banner */}
      <div className="market-notice-bar">
        <span>
          <span className="market-notice-dot" />
          HAND-WOVEN GUILD EDITIONS
        </span>
        <span className="hidden sm:inline">ALL PRICING IN NIGERIAN NAIRA (₦)</span>
      </div>

      {/* Hero Header with Bold Typography */}
      <section className="market-hero">
        <div className="market-hero-main">
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="market-back"
          >
            <ArrowLeft size={15} />
            <span>RETURN TO HOME</span>
          </button>

          <p className="eyebrow">DIRECT GUILD PROVENANCE</p>

          <h1>
            THE RAFFIA<br />
            <em>MARKETPLACE.</em>
          </h1>
          <div className="w-44 mt-3">
            <BrushStrokeUnderline className="w-full h-2.5" />
          </div>
        </div>

        <div className="market-hero-pitch">
          <p className="market-pitch-text">
            Objects, craft and contemporary creations connected to the raffia story. Every piece is hand-coiled and woven from sustainably harvested palm fronds, directly financing artisan livelihoods and preserving ancestral weaving guilds across Nigeria.
          </p>
        </div>
      </section>

      {/* Controls & Filter Bar */}
      <section className="market-controls">
        {/* Category Tabs */}
        <div className="market-tabs">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`market-tab ${selectedCategory === id ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="market-actions-strip">
          <div className="market-search-box">
            <Search size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="market-sort-select"
          >
            <option value="featured">Featured Pieces</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>

          <button
            onClick={() => setShowInStockOnly(!showInStockOnly)}
            className={`market-instock-toggle ${showInStockOnly ? 'active' : ''}`}
          >
            {showInStockOnly ? '✓ In Stock Only' : 'In Stock Only'}
          </button>
        </div>
      </section>

      {/* Product Results Grid */}
      <section className="market-catalog">
        <div className="market-catalog-meta">
          <span>
            SHOWING {filteredProducts.length} {filteredProducts.length === 1 ? 'OBJECT' : 'OBJECTS'}
            {selectedCategory !== 'ALL' && ` · ${selectedCategory}`}
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="market-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#F4EFEA] border border-[#181513]/10 max-w-xl mx-auto p-10">
            <h3 className="font-bold text-2xl mb-2 text-[#181513]">
              No creations match this selection
            </h3>
            <p className="text-xs text-[#57524E] mb-6">
              Try adjusting your search criteria or select &quot;All Pieces&quot; to view all guild items.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setShowInStockOnly(false);
              }}
              className="button button-dark"
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </section>

      {/* Guild Guarantee / Provenance Section */}
      <section className="market-guarantee">
        <div className="market-guarantee-inner">
          <div className="market-guarantee-copy">
            <p className="eyebrow">THE GUILD COVENANT</p>
            <h2>
              WHY WE WEAVE<br />
              <em>IN NUMBERED RUNS.</em>
            </h2>
            <p>
              Raffia is living nature, not industrial synthetic plastic. Each harvest follows the rain and tidal rhythms of the coastal palm groves, taking up to four weeks of retting, dyeing, and loom weaving.
            </p>
          </div>

          <div className="market-guarantee-grid">
            <div className="market-guarantee-card">
              <span>01 / VALUE</span>
              <h4>Direct To Artisans</h4>
              <p>
                Proceeds go straight to master weavers, apprentices, and community cooperatives in Akwa Ibom and Cross River.
              </p>
            </div>

            <div className="market-guarantee-card">
              <span>02 / HARVEST</span>
              <h4>100% Botanical Bast</h4>
              <p>
                Harvested without felling trees. Wild raffia palm regenerates naturally in wetlands, preventing soil erosion.
              </p>
            </div>

            <div className="market-guarantee-card">
              <span>03 / LEGACY</span>
              <h4>Numbered Provenance</h4>
              <p>
                Every edition arrives with its certified accession card documenting the weaver guild, harvest date, and batch index.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal: Product Quick View */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onViewFullDetail={(slug) => {
            setQuickViewProduct(null);
            onSelectProduct(slug);
          }}
        />
      )}
    </div>
  );
};
