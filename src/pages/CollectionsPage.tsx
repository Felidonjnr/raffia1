import React, { useState } from 'react';
import { ViewRoute } from '../types';
import { useMarketplaceData } from '../context/MarketplaceDataContext';
import { ArchivalImage } from '../components/ArchivalImage';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, ArrowRight, Bookmark } from 'lucide-react';

interface CollectionsPageProps {
  initialSlug?: string;
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  initialSlug,
  onNavigate,
  onSelectProduct,
}) => {
  const { collections: COLLECTIONS, products: PRODUCTS } = useMarketplaceData();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);

  const activeCollection = selectedSlug
    ? COLLECTIONS.find((c) => c.slug === selectedSlug || c.id === selectedSlug) || null
    : null;

  const collectionProducts = activeCollection
    ? PRODUCTS.filter((p) =>
        (activeCollection.productIds && activeCollection.productIds.includes(p.id)) ||
        p.collection === activeCollection.slug
      )
    : [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      {/* Top Header */}
      <section className="pt-12 pb-16 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <button
          onClick={() => {
            if (activeCollection) {
              setSelectedSlug(null);
            } else {
              onNavigate({ type: 'home' });
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#57524E] hover:text-[#181513] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeCollection ? 'View All Collections' : 'Return to Homepage'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-3">
              Curated Collections
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#181513] leading-[1.05]">
              {activeCollection ? activeCollection.title : (
                <>
                  CURATED CRAFT <br />
                  <span className="italic font-normal">COLLECTIONS</span>
                </>
              )}
            </h1>
            {activeCollection && (
              <p className="font-editorial italic text-2xl text-[#57524E] mt-2 font-normal">
                {activeCollection.subtitle}
              </p>
            )}
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#57524E] leading-relaxed max-w-md font-normal">
              {activeCollection
                ? activeCollection.description
                : 'Collections bringing together hand-woven wearables, vessels, and wall textiles. Explore each collection to view linked artisan works.'}
            </p>
          </div>
        </div>
      </section>

      {/* View: All Collections Grid */}
      {!activeCollection ? (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {COLLECTIONS.map((col, idx) => {
              const colSpan = idx % 3 === 0 ? 'lg:col-span-7' : idx % 3 === 1 ? 'lg:col-span-5' : 'lg:col-span-12';
              const colProducts = PRODUCTS.filter((p) => col.productIds.includes(p.id));

              return (
                <div
                  key={col.id}
                  onClick={() => setSelectedSlug(col.slug)}
                  className={`${colSpan} group cursor-pointer border border-[#181513]/15 bg-[#FAF7F2] p-4 flex flex-col justify-between hover:border-[#181513]/50 transition-all duration-500`}
                >
                  <div className="aspect-[16/10] bg-[#ECE5DC] overflow-hidden mb-6 border border-[#181513]/10">
                    <ArchivalImage
                      src={col.coverImage}
                      alt={`${col.title} collection hero`}
                      aspectRatio="custom"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>

                  <div className="space-y-2 px-2 pb-2">
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8C7355]">
                      <span>CAPSULE 0{idx + 1}</span>
                      <span className="text-[#B84A28] font-medium group-hover:translate-x-1 transition-transform">
                        Explore Capsule ({colProducts.length} Objects) →
                      </span>
                    </div>

                    <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#181513] group-hover:text-[#B84A28] transition-colors">
                      {col.title}
                    </h2>

                    <p className="text-xs text-[#57524E] line-clamp-2 leading-relaxed">
                      {col.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        /* View: Single Collection Inspection */
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16">
          <div className="bg-[#ECE5DC] p-6 sm:p-10 border border-[#DDD4C5] mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-[#B84A28] shrink-0" />
              <div>
                <span className="font-mono uppercase text-[#8C7355] block">Collection Notes</span>
                <span className="text-[#181513] font-medium">{activeCollection.curatorNotes}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate({ type: 'marketplace' })}
              className="font-mono uppercase tracking-wider text-[#B84A28] hover:underline shrink-0"
            >
              Browse All Catalog →
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-[#181513]/10 pb-4">
              <h3 className="font-editorial text-3xl font-light text-[#181513]">
                Objects in this Collection ({collectionProducts.length})
              </h3>
              <span className="font-mono text-xs uppercase text-[#8C7355]">
                Raffia Craft & Objects
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collectionProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
