import React, { useMemo, useState } from 'react';
import { ProductCategory, ViewRoute, Product } from '../types';
import { useMarketplaceData } from '../context/MarketplaceDataContext';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickView } from '../components/ProductQuickView';
import { ArrowDownRight, ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';

interface MarketplacePageProps {
  initialCategory?: ProductCategory;
  initialCollection?: string;
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

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

  const {
    products: PRODUCTS,
    categories,
    loading: marketplaceLoading,
    error: marketplaceError,
  } = useMarketplaceData();

  const categoryTabs = [
    { id: 'ALL' as ProductCategory, label: 'ALL' },
    ...categories.map((category) => ({ id: category.name as ProductCategory, label: category.name })),
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS
      .filter((product) => {
        if (initialCollection && initialCollection !== 'ALL' && product.collection !== initialCollection) return false;
        if (selectedCategory !== 'ALL' && product.category !== selectedCategory) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
          const matchesMaterials = product.materials.some((m) => m.toLowerCase().includes(q));
          if (!matchesName && !matchesSubtitle && !matchesMaterials) return false;
        }

        if (showInStockOnly && product.availability !== 'IN STOCK') return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (Number(b.featured) - Number(a.featured));
      });
  }, [PRODUCTS, selectedCategory, searchQuery, sortBy, showInStockOnly, initialCollection]);

  const resetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setShowInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="bg-[#F7F2EA] text-[#181513]">
      {/* Intro / editorial hero */}
      <section className="relative overflow-hidden border-b border-[#181513]/15 bg-[#181513] text-[#FAF7F2]">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-[#C96A3A]/30" />
        <div className="absolute right-10 top-20 h-40 w-40 rounded-full border border-[#FAF7F2]/10" />

        <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-24 lg:pt-10">
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="mb-14 inline-flex min-h-11 items-center gap-2 text-sm font-semibold tracking-wide text-[#FAF7F2]/75 transition-colors hover:text-white"
          >
            <ArrowLeft size={17} />
            RETURN TO HOME
          </button>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-[#D58A5B]">
                RAFFIA LEGACY PROJECT · MARKETPLACE
              </p>
              <h1 className="max-w-5xl text-[clamp(4rem,11vw,10.5rem)] font-black uppercase leading-[0.78] tracking-[-0.07em]">
                RAFFIA,
                <br />
                <span className="font-editorial font-normal normal-case tracking-[-0.05em] text-[#E5B38F]">
                  made today.
                </span>
              </h1>
            </div>

            <div className="border-l border-[#FAF7F2]/20 pl-6 lg:mb-2">
              <p className="max-w-md text-xl leading-relaxed text-[#FAF7F2]/85 sm:text-2xl">
                Contemporary objects, accessories and textiles woven from raffia heritage.
              </p>
              <a
                href="#market-catalogue"
                className="mt-8 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-[#FAF7F2]"
              >
                SHOP THE COLLECTION
                <ArrowDownRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial statement */}
      <section className="border-b border-[#181513]/15 bg-[#E7DED1]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-12 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8C7355]">01 / THE COLLECTION</p>
          <div>
            <h2 className="max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              FROM PALM TO PRODUCT.
              <br />
              <span className="font-editorial font-normal normal-case text-[#A94C2E]">Culture becomes commerce.</span>
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#4A4036] sm:text-xl">
              Discover pieces that connect traditional knowledge with contemporary fashion, art, design and enterprise.
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue controls */}
      <section id="market-catalogue" className="sticky top-0 z-30 border-b border-[#181513]/15 bg-[#F7F2EA]/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1500px] px-5 py-4 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <span className="mr-2 hidden text-sm font-bold uppercase tracking-[0.16em] text-[#8C7355] lg:inline">SHOP BY</span>
              {categoryTabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`min-h-11 shrink-0 border px-4 text-sm font-bold uppercase tracking-wide transition-all ${selectedCategory === id
                    ? 'border-[#181513] bg-[#181513] text-[#FAF7F2]'
                    : 'border-[#181513]/20 bg-transparent text-[#181513] hover:border-[#181513]'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex min-h-11 min-w-[210px] flex-1 items-center gap-2 border border-[#181513]/20 bg-white/60 px-3 sm:flex-none">
                <Search size={17} className="shrink-0 text-[#8C7355]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the collection"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8C7355]"
                />
              </label>

              <button
                onClick={() => setShowInStockOnly(!showInStockOnly)}
                className={`min-h-11 border px-4 text-sm font-bold uppercase tracking-wide transition-colors ${showInStockOnly
                  ? 'border-[#A94C2E] bg-[#A94C2E] text-white'
                  : 'border-[#181513]/20 bg-transparent'}`}
              >
                {showInStockOnly ? '✓ IN STOCK' : 'IN STOCK'}
              </button>

              <label className="flex min-h-11 items-center gap-2 border border-[#181513]/20 bg-transparent px-3">
                <SlidersHorizontal size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent text-sm font-bold outline-none"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low–High</option>
                  <option value="price-desc">Price: High–Low</option>
                  <option value="name">A–Z</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#181513]/15 pb-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8C7355]">02 / OBJECTS OF LEGACY</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.03em] sm:text-5xl">The Collection</h2>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#57524E]">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'PIECE' : 'PIECES'}
          </p>
        </div>

        {marketplaceError && (
          <div className="mb-8 border border-[#A94C2E]/30 bg-[#A94C2E]/5 p-4 text-sm text-[#7D3824]">
            We could not refresh the live collection. Showing the latest available catalogue.
          </div>
        )}

        {marketplaceLoading && PRODUCTS.length === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-[4/5] animate-pulse bg-[#E7DED1]" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={index === 0
                  ? 'lg:col-span-7'
                  : index === 1
                    ? 'lg:col-span-5 lg:pt-24'
                    : index === 2
                      ? 'lg:col-span-5 lg:pt-8'
                      : index === 3
                        ? 'lg:col-span-7'
                        : 'lg:col-span-4'}
              >
                <ProductCard
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                  featured={index === 0}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl border border-[#181513]/15 bg-[#E7DED1] p-10 text-center sm:p-16">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#8C7355]">NO MATCH</p>
            <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em]">Nothing in this edit.</h3>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#57524E]">
              Try another category or clear your search to return to the full collection.
            </p>
            <button onClick={resetFilters} className="mt-7 min-h-12 bg-[#181513] px-6 text-sm font-bold uppercase tracking-wide text-[#FAF7F2]">
              RESET FILTERS
            </button>
          </div>
        )}
      </section>

      {/* Marketplace story */}
      <section className="bg-[#181513] text-[#FAF7F2]">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D58A5B]">03 / THE LEGACY ECONOMY</p>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.88] tracking-[-0.05em] sm:text-7xl">
              WHAT WE HAVE.
              <br />
              WHAT WE CAN MAKE.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              ['01', 'ARTISANS', 'Visibility, new markets, skills and better access to customers.'],
              ['02', 'BUSINESSES', 'New products, customers, partnerships and markets.'],
              ['03', 'THE ECONOMY', 'A chance to turn indigenous knowledge and materials into sustainable creative enterprise.'],
            ].map(([number, title, copy]) => (
              <div key={number} className="border-t border-[#FAF7F2]/25 pt-5">
                <span className="text-sm font-bold text-[#D58A5B]">{number}</span>
                <h3 className="mt-10 text-xl font-black uppercase">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#FAF7F2]/65">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maker CTA */}
      <section className="bg-[#D58A5B] text-[#181513]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em]">04 / BUILD THE MARKETPLACE</p>
            <h2 className="mt-3 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              YOUR CRAFT.
              <br />
              YOUR MARKET.
            </h2>
          </div>
          <p className="max-w-md text-lg font-medium leading-relaxed">
            We are building a platform where raffia knowledge, contemporary making and enterprise can meet new audiences.
          </p>
        </div>
      </section>

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
