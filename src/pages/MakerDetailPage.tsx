import React from 'react';
import { ViewRoute } from '../types';
import { useMarketplaceData } from '../context/MarketplaceDataContext';
import { ArchivalImage } from '../components/ArchivalImage';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { ArrowLeft, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

interface MakerDetailPageProps {
  slug: string;
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

export const MakerDetailPage: React.FC<MakerDetailPageProps> = ({
  slug,
  onNavigate,
  onSelectProduct,
}) => {
  const { openInquiry } = useCart();
  const { makers: MAKERS, products: PRODUCTS } = useMarketplaceData();
  const maker = MAKERS.find((m) => m.slug === slug || m.id === slug) || MAKERS[0];
  const makerProducts = maker
    ? PRODUCTS.filter((p) => (maker.productIds || []).includes(p.id) || p.maker.id === maker.id || p.maker.slug === maker.slug)
    : [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Breadcrumb Bar */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#57524E]">
          <button
            onClick={() => onNavigate({ type: 'makers' })}
            className="hover:text-[#181513] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Makers Directory</span>
          </button>
          <span>/</span>
          <span className="text-[#181513] font-medium">{maker.name}</span>
        </div>
      </div>

      {/* Main Hero Monograph */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-6 pb-16 border-b border-[#181513]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait & Documentary visual (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border border-[#181513]/15 overflow-hidden bg-[#ECE5DC]">
              <ArchivalImage
                src={maker.image}
                alt={`${maker.name} craft view`}
                aspectRatio="4:3"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="p-4 bg-[#F4EFEA] border border-[#181513]/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#181513]">
                <ShieldCheck className="w-4 h-4 text-[#B84A28]" />
                <span className="font-mono uppercase font-semibold">Raffia Heritage Maker</span>
              </div>
              <p className="text-[#57524E] leading-relaxed">
                Connecting artisans and local communities with the Raffia Legacy movement.
              </p>
            </div>
          </div>

          {/* Maker Profile (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Raffia Craft & Weaving</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#181513] mb-2 leading-tight">
                {maker.name}
              </h1>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C7355] mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#B84A28]" />
                <span>{maker.location}</span>
                <span>·</span>
                <span>{maker.discipline}</span>
              </div>
            </div>

            {maker.quote ? (
              <blockquote className="border-l-2 border-[#B84A28] pl-5 py-2 font-editorial italic text-2xl text-[#181513] leading-snug">
                &ldquo;{maker.quote}&rdquo;
              </blockquote>
            ) : null}

            <div className="space-y-4 text-sm sm:text-base text-[#57524E] leading-relaxed font-normal">
              <p>
                {maker.bio ||
                  'Artisans, designers and creatives working to turn heritage into new products, fashion, art, performance and design.'}
              </p>
            </div>

            <div className="p-6 bg-[#ECE5DC] border border-[#DDD4C5] space-y-3">
              <p className="font-mono text-xs uppercase tracking-widest text-[#8C7355]">
                Speciality & Focus
              </p>
              <p className="text-sm font-medium text-[#181513]">
                {maker.speciality}
              </p>
              {maker.heritageNotes && (
                <p className="text-xs text-[#57524E]">
                  {maker.heritageNotes}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => openInquiry('PARTNER')}
                className="px-6 py-3.5 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
              >
                Inquire / Connect With Makers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products By This Maker */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-20">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8C7355] block mb-1">
              Atelier Catalog
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-light text-[#181513]">
              Creations by {maker.name}
            </h2>
          </div>
          <button
            onClick={() => onNavigate({ type: 'marketplace' })}
            className="text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] transition-colors cursor-pointer"
          >
            Explore All Objects →
          </button>
        </div>

        {makerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {makerProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs font-mono text-[#57524E]">
            New craft pieces are currently in preparation.
          </p>
        )}
      </section>
    </div>
  );
};
