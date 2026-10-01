import React, { useState, useEffect } from 'react';
import { ViewRoute, ProductCategory, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { MAKERS } from '../data/makers';
import { PILLARS, FESTIVAL_EXPERIENCES, LEGACY_YEAR_STAGES } from '../data/legacyData';
import { ArchivalImage } from '../components/ArchivalImage';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { ArrowRight, Sparkles, Plus, Eye, CheckCircle2, ChevronRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const { addToCart, openInquiry } = useCart();
  const [mounted, setMounted] = useState(false);
  const [activePillarSlice, setActivePillarSlice] = useState<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const featuredProducts = PRODUCTS.slice(0, 4);
  const finalShopProducts = PRODUCTS.slice(4, 8);
  const featuredObject = PRODUCTS.find((p) => p.featuredObject) || PRODUCTS[0];

  const pillarVisuals = [
    {
      img: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
      color: '#B84A28',
    },
    {
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      color: '#8C7355',
    },
    {
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      color: '#241D19',
    },
    {
      img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      color: '#C8B28B',
    },
    {
      img: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1200&q=80',
      color: '#B84A28',
    },
  ];

  const categoryWorlds: {
    title: string;
    category: ProductCategory;
    subtitle: string;
    image: string;
    aspectRatio: '16:9' | '4:3' | '3:4' | '1:1';
    colSpan: string;
  }[] = [
    {
      title: 'FASHION + ACCESSORIES',
      category: 'FASHION & ACCESSORIES',
      subtitle: 'Structured totes, clutches & woven filaments',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: '3:4',
      colSpan: 'lg:col-span-4',
    },
    {
      title: 'HOME + LIFESTYLE',
      category: 'HOME & LIFESTYLE',
      subtitle: 'Sculptural amphorae, vessels & living accents',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: '4:3',
      colSpan: 'lg:col-span-5',
    },
    {
      title: 'ART + DESIGN',
      category: 'ART & DESIGN',
      subtitle: 'Monumental indigo tapestries & gallery textiles',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: '1:1',
      colSpan: 'lg:col-span-3',
    },
    {
      title: 'TRADITIONAL CRAFT',
      category: 'TRADITIONAL CRAFT',
      subtitle: 'Ancestral masquerade headdresses & cowrie inlays',
      image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: '1:1',
      colSpan: 'lg:col-span-3',
    },
    {
      title: 'GIFTS',
      category: 'GIFTS',
      subtitle: 'Carved mahogany boxes & keepsake chests',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: '4:3',
      colSpan: 'lg:col-span-5',
    },
    {
      title: 'FESTIVAL MERCHANDISE',
      category: 'FESTIVAL MERCHANDISE',
      subtitle: 'Silk-raffia foulards & commemorative editions',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: '3:4',
      colSpan: 'lg:col-span-4',
    },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#181513] selection:bg-[#B84A28] selection:text-white">
      {/* ========================================================================= */}
      {/* SECTION 01 — HERO: Cinematic Premium Hero Campaign                        */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-10 pb-16 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        {/* Top Campaign Badge */}
        <div
          className={`transition-all duration-700 delay-100 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#B84A28]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#57524E]">
              Dance Ville Cultural Campaign · Vol. I
            </span>
          </div>
        </div>

        {/* Hero Grid: Asymmetric Editorial Composition */}
        <div className="my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Typography side (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1
              className={`font-editorial font-light tracking-tight text-[#181513] leading-[0.88] text-6xl sm:text-8xl lg:text-[7.8rem] transition-all duration-1000 delay-300 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              RAFFIA <br />
              <span className="italic font-normal">MADE FROM</span> <br />
              <span className="font-normal text-[#B84A28]">LEGACY.</span>
            </h1>

            <p
              className={`font-editorial text-2xl sm:text-3xl text-[#57524E] max-w-xl font-normal leading-snug transition-all duration-1000 delay-500 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Discover objects, fashion, craft and stories rooted in the living heritage of raffia.
            </p>

            <div
              className={`pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-1000 delay-700 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                onClick={() => onNavigate({ type: 'marketplace' })}
                className="px-8 py-4 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer text-center font-medium shadow-sm"
              >
                Shop The Collection
              </button>
              <button
                onClick={() => onNavigate({ type: 'raffia' })}
                className="px-8 py-4 border border-[#181513] text-[#181513] text-xs font-mono uppercase tracking-widest hover:bg-[#181513] hover:text-[#FAF7F2] transition-colors cursor-pointer text-center font-medium"
              >
                Discover Raffia
              </button>
            </div>
          </div>

          {/* Large Hero Image (5 cols) */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 delay-500 ease-out ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
            }`}
          >
            <div className="relative border border-[#181513]/15 p-2 bg-[#FAF7F2] shadow-sm">
              <ArchivalImage
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80"
                alt="Editorial luxury woven raffia and saddle leather archival tote"
                aspectRatio="4:3"
                accessionNumber="RLP-CAMPAIGN-2026 // OBJECT"
                caption="The Archival Woven Tote in Saddle Leather. Hand-loomed in the Cross River estuary."
              />
              <div className="pt-3 px-2 pb-1 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#8C7355]">
                <span>Artisan Provenance Verified</span>
                <span>Direct Guild Value</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-[#181513]/10 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#57524E]">
          <span>Culture to Commerce · Heritage to Opportunity</span>
          <span className="hidden sm:inline">West African Bast Fibre Archive</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02 — SHOP BY WORLD: Visual Category Gateways                      */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#181513]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
              Curated Worlds
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-light text-[#181513]">
              DISCOVER THE COLLECTION
            </h2>
          </div>
          <button
            onClick={() => onNavigate({ type: 'marketplace' })}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] transition-colors cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Asymmetric Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {categoryWorlds.map((world, idx) => (
            <div
              key={world.title}
              onClick={() => onNavigate({ type: 'marketplace', category: world.category })}
              className={`${world.colSpan} group cursor-pointer border border-[#181513]/15 bg-[#FAF7F2] p-3 flex flex-col justify-between hover:border-[#181513]/50 transition-all duration-500`}
            >
              <div className="overflow-hidden bg-[#ECE5DC] mb-4">
                <ArchivalImage
                  src={world.image}
                  alt={`${world.title} editorial campaign visual`}
                  aspectRatio={world.aspectRatio}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="px-2 pb-2">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8C7355] mb-1">
                  <span>WORLD 0{idx + 1}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-[#B84A28]">
                    Explore →
                  </span>
                </div>
                <h3 className="font-editorial text-2xl font-medium text-[#181513] group-hover:text-[#B84A28] transition-colors">
                  {world.title}
                </h3>
                <p className="text-xs text-[#57524E] mt-1">
                  {world.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03 — FIVE PILLARS: Vertical Sliced Rail (Inspired by Image 4)     */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto bg-[#F4EFEA]/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-[#181513]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
              Civilizational Foundation
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-light text-[#181513]">
              THE FIVE PILLARS
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#57524E]">
            Hover or select a pillar to inspect curatorial initiatives
          </p>
        </div>

        {/* Desktop Vertical Sliced Rail */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-3 h-[520px]">
          {PILLARS.map((p, idx) => {
            const isSelected = activePillarSlice === idx;
            const visual = pillarVisuals[idx];

            return (
              <div
                key={p.number}
                onMouseEnter={() => setActivePillarSlice(idx)}
                onClick={() => setActivePillarSlice(idx)}
                className={`relative overflow-hidden cursor-pointer transition-all duration-700 ease-out flex flex-col justify-end border ${
                  isSelected ? 'border-[#181513] shadow-md ring-1 ring-[#181513]' : 'border-[#181513]/15 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <ArchivalImage
                    src={visual.img}
                    alt={p.title}
                    aspectRatio="custom"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/90 via-[#181513]/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-6 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 text-xs font-mono font-bold tracking-widest uppercase text-white"
                      style={{ backgroundColor: visual.color }}
                    >
                      {p.number}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/70">
                      PILLAR
                    </span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight leading-tight">
                    {p.title}
                  </h3>

                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    {p.tagline}
                  </p>

                  {/* Expanded Curatorial Brief */}
                  {isSelected && (
                    <div className="pt-2 animate-in fade-in duration-300">
                      <p className="text-[11px] text-white/90 leading-relaxed mb-3 border-t border-white/20 pt-2 font-normal">
                        {p.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate({ type: 'project' });
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#C8B28B] hover:text-white"
                      >
                        <span>Learn More in Project</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Stacked Accordion */}
        <div className="lg:hidden space-y-4">
          {PILLARS.map((p, idx) => {
            const isSelected = activePillarSlice === idx;
            return (
              <div
                key={p.number}
                onClick={() => setActivePillarSlice(isSelected ? -1 : idx)}
                className="border border-[#181513]/15 bg-[#FAF7F2] p-5 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#B84A28]">
                    {p.number} · {p.title}
                  </span>
                  <span className="text-xs font-mono text-[#8C7355]">
                    {isSelected ? 'Collapse —' : 'Inspect +'}
                  </span>
                </div>
                <p className="font-editorial italic text-base text-[#57524E]">
                  {p.tagline}
                </p>
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-[#181513]/10 text-xs text-[#181513] space-y-2">
                    <p className="leading-relaxed">{p.description}</p>
                    <ul className="space-y-1 text-[#57524E] pt-1">
                      {p.details.map((d, i) => (
                        <li key={i}>· {d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 — FEATURED PRODUCTS: The Latest From Raffia                    */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#181513]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
              Fresh Off The Loom
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-light text-[#181513]">
              THE LATEST FROM RAFFIA
            </h2>
          </div>
          <button
            onClick={() => onNavigate({ type: 'marketplace' })}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] transition-colors cursor-pointer"
          >
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05 — FEATURED OBJECT: One Major Sculptural Piece                  */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto bg-[#F4EFEA]/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Large Image (7 cols) */}
          <div
            onClick={() => onSelectProduct(featuredObject.slug)}
            className="lg:col-span-7 cursor-pointer group border border-[#181513]/15 p-3 bg-[#FAF7F2] shadow-sm"
          >
            <ArchivalImage
              src={featuredObject.image}
              alt={featuredObject.name}
              aspectRatio="4:3"
              accessionNumber="OBJECT SPECIMEN · 01"
              caption={`Piece: ${featuredObject.name} · Curated by ${featuredObject.maker.name}`}
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>

          {/* Editorial Supporting Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block">
              THE OBJECT
            </span>

            <h2
              onClick={() => onSelectProduct(featuredObject.slug)}
              className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#181513] leading-tight hover:text-[#B84A28] transition-colors cursor-pointer"
            >
              {featuredObject.name}
            </h2>

            <div className="space-y-1 text-xs font-mono uppercase tracking-wider text-[#8C7355]">
              <p>Maker: <span className="text-[#181513] font-semibold">{featuredObject.maker.name}</span></p>
              <p>Region: <span className="text-[#181513]">{featuredObject.origin}</span></p>
              <p>Material: <span className="text-[#181513]">{featuredObject.materials.join(', ')}</span></p>
            </div>

            <p className="text-sm sm:text-base text-[#57524E] leading-relaxed font-normal">
              {featuredObject.description}
            </p>

            <div className="py-4 border-y border-[#181513]/10 flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-[#57524E]">
                Guild Valuation
              </span>
              <span className="font-editorial text-3xl font-semibold text-[#181513] tabular-nums">
                ${featuredObject.price.toLocaleString()} {featuredObject.currency}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onSelectProduct(featuredObject.slug)}
                className="px-8 py-4 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer text-center font-medium"
              >
                View Object Details
              </button>
              <button
                onClick={() => addToCart(featuredObject, 1)}
                className="px-8 py-4 border border-[#181513] text-[#181513] text-xs font-mono uppercase tracking-widest hover:bg-[#181513] hover:text-[#FAF7F2] transition-colors cursor-pointer text-center font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 06 — MEET THE MAKERS: Editorial Connection to Hands & Stories    */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-6 border-b border-[#181513]/10">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
              The Living Hands
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-light text-[#181513]">
              EVERY OBJECT <br />
              <span className="italic font-normal">HAS A STORY.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#57524E] leading-relaxed mb-4">
              Discover the hands, knowledge and creativity behind the collection. Meet the elders, master weavers and emerging innovators safeguarding African palm craft.
            </p>
            <button
              onClick={() => onNavigate({ type: 'makers' })}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold transition-colors cursor-pointer"
            >
              <span>Meet The Makers Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Editorial Maker Profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {MAKERS.map((maker) => (
            <div
              key={maker.id}
              onClick={() => onNavigate({ type: 'maker_detail', slug: maker.slug })}
              className="group cursor-pointer border border-[#181513]/15 bg-[#FAF7F2] p-4 flex flex-col justify-between hover:border-[#181513]/40 transition-all"
            >
              <div>
                <div className="aspect-[4/3] bg-[#ECE5DC] overflow-hidden mb-4">
                  <ArchivalImage
                    src={maker.image}
                    alt={maker.name}
                    aspectRatio="custom"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7355] block mb-1">
                  {maker.location}
                </span>
                <h3 className="font-editorial text-2xl font-medium text-[#181513] group-hover:text-[#B84A28] transition-colors">
                  {maker.name}
                </h3>
                <p className="text-xs font-mono text-[#B84A28] uppercase tracking-wider mt-1 mb-3">
                  {maker.speciality}
                </p>
                <p className="text-xs text-[#57524E] line-clamp-3 leading-relaxed">
                  {maker.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#181513]/10 mt-6 flex items-center justify-between text-xs font-mono uppercase text-[#8C7355]">
                <span>View Profile</span>
                <span className="text-[#B84A28] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 07 — EDITORIAL RAFFIA STORY: Asymmetric Layout (Inspired by Image 5) */}
      {/* ========================================================================= */}
      <section className="py-28 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto bg-[#FAF7F2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Tall Vertical Documentary Photo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border border-[#181513]/15 p-2 bg-[#FAF7F2]">
              <ArchivalImage
                src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80"
                alt="Tactile documentary study of raw raffia bast retting"
                aspectRatio="3:4"
                accessionNumber="ARCHIVE STUDY // 004"
                caption="Sun-drying golden raffia leaflets on raised bamboo racks."
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#8C7355]">
              <span>River-Retting Cycle</span>
              <span>72 Hours in Running Water</span>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Pull Quote (Image 5 Style) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#8C7355]/30 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.25em] text-[#B84A28] mb-4">
                <span>CHAPTER 01 · OUR WAY OF STORYTELLING</span>
              </div>

              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-light text-[#181513] leading-[1.05]">
                What We Learn. <br />
                What We Create. <br />
                <span className="italic font-normal text-[#B84A28]">What We Pass On.</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#57524E] leading-relaxed font-normal">
              African history has been traditionally told through the art of oral storytelling and tactile material practice. Our elders take a seat and recall events they experienced firsthand, or that they inherited from the living memories of their ancestors.
            </p>

            {/* Editorial Italic Pull Quote (Image 5) */}
            <div className="p-6 bg-[#ECE5DC] border-l-4 border-[#B84A28] space-y-2">
              <p className="font-editorial italic text-2xl sm:text-3xl text-[#181513] leading-snug">
                &ldquo;With every passing generation, something monumental is forgotten. With every knot we tie, living memory is preserved.&rdquo;
              </p>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#8C7355] block">
                Oral Maxim of the Annang Weavers Council
              </span>
            </div>

            {/* Offset Second Detail Photo & Prose */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
              <div className="sm:col-span-5 aspect-[4/3] bg-[#ECE5DC] overflow-hidden border border-[#181513]/10">
                <ArchivalImage
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
                  alt="Back-strap loom detail"
                  aspectRatio="custom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 space-y-4">
                <p className="text-xs text-[#57524E] leading-relaxed">
                  The Raphia vinifera frond carries the memory of the wetland ecosystem. Today, we document this living grammar in our digital repository and pair elder guild masters with emerging industrial creators.
                </p>
                <button
                  onClick={() => onNavigate({ type: 'raffia' })}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold"
                >
                  <span>Explore The Full Knowledge Archive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 08 — THE INVITATION: 4-Box Hairline Grid (Inspired by Image 5)     */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto text-center">
        <div className="max-w-4xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Coalition For Cultural Sovereignty</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-[#181513] leading-tight">
            RAFFIA IS OUR THREAD. <br />
            <span className="italic font-normal">THE FUTURE IS WHAT WE WEAVE WITH IT.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#57524E] max-w-xl mx-auto leading-relaxed">
            Whether you represent a museum, corporate brand, design atelier, or cultural patron, discover your role in stewarding the Raffia Legacy.
          </p>
        </div>

        {/* 4 Clean Editorial Hairline Boxes (Exact Image 5 Styling) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* Box 1: Become a Partner */}
          <div className="border border-[#181513]/20 bg-[#FAF7F2] p-8 flex flex-col justify-between hover:border-[#181513] transition-colors">
            <div className="space-y-3">
              <span className="font-editorial italic text-2xl font-normal text-[#181513] block">
                Become a Partner
              </span>
              <p className="text-xs text-[#57524E] leading-relaxed">
                We partner with international cultural institutions, luxury design houses, and academic research groups to co-develop capsule exhibitions, sustainable material pilots, and global distribution.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#181513]/10">
              <button
                onClick={() => openInquiry('PARTNER')}
                className="px-6 py-2.5 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
              >
                Inquire For Partnership
              </button>
            </div>
          </div>

          {/* Box 2: Become a Sponsor */}
          <div className="border border-[#181513]/20 bg-[#FAF7F2] p-8 flex flex-col justify-between hover:border-[#181513] transition-colors">
            <div className="space-y-3">
              <span className="font-editorial italic text-2xl font-normal text-[#181513] block">
                Become a Sponsor
              </span>
              <p className="text-xs text-[#57524E] leading-relaxed">
                Underwrite the flagship Raffia Festival 2027 pavilions, the Green Innovation Lab, and the pan-African Raffia Economy Summit. Position your organization at the frontier of circular luxury.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#181513]/10">
              <button
                onClick={() => openInquiry('SPONSOR')}
                className="px-6 py-2.5 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
              >
                Explore Sponsorship Tiers
              </button>
            </div>
          </div>

          {/* Box 3: Become a Donor */}
          <div className="border border-[#181513]/20 bg-[#FAF7F2] p-8 flex flex-col justify-between hover:border-[#181513] transition-colors">
            <div className="space-y-3">
              <span className="font-editorial italic text-2xl font-normal text-[#181513] block">
                Become a Donor
              </span>
              <p className="text-xs text-[#57524E] leading-relaxed">
                Philanthropic support directly finances elder master weavers healthcare reserves, youth apprenticeships in craft towns, and the permanent conservation of Raphia palm wetland groves.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#181513]/10">
              <button
                onClick={() => openInquiry('DONOR')}
                className="px-6 py-2.5 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
              >
                Support Guild Endowment
              </button>
            </div>
          </div>

          {/* Box 4: Join the Guild */}
          <div className="border border-[#181513]/20 bg-[#FAF7F2] p-8 flex flex-col justify-between hover:border-[#181513] transition-colors">
            <div className="space-y-3">
              <span className="font-editorial italic text-2xl font-normal text-[#181513] block">
                Join the Guild Registry
              </span>
              <p className="text-xs text-[#57524E] leading-relaxed">
                Are you an indigenous palm harvester, master weaver, or contemporary atelier working with natural African fibres? Apply to join our certified fair-trade registry and marketplace.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#181513]/10">
              <button
                onClick={() => openInquiry('LEGACY')}
                className="px-6 py-2.5 bg-[#B84A28] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#9E3E20] transition-colors cursor-pointer font-medium"
              >
                Register As Maker
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 09 — THE LEGACY YEAR: Teaser Only (Not Crammed)                   */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto bg-[#F4EFEA]/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#181513]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
              The 12-Month Journey
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
              THE LEGACY YEAR
            </h2>
            <p className="font-editorial italic text-2xl text-[#57524E] mt-1 font-normal">
              The festival is only the beginning.
            </p>
          </div>
          <button
            onClick={() => onNavigate({ type: 'legacy_year' })}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold"
          >
            <span>Explore The Full Legacy Year</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Clickable Stage Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {LEGACY_YEAR_STAGES.map((stg) => (
            <div
              key={stg.step}
              onClick={() => onNavigate({ type: 'legacy_year' })}
              className="p-4 bg-[#FAF7F2] border border-[#181513]/10 hover:border-[#B84A28] transition-colors cursor-pointer group"
            >
              <span className="text-[10px] font-mono text-[#8C7355] block mb-1">
                STAGE {stg.step}
              </span>
              <p className="font-editorial text-xl font-medium text-[#181513] group-hover:text-[#B84A28]">
                {stg.title}
              </p>
              <p className="text-[11px] text-[#57524E] mt-1 line-clamp-2">
                {stg.program}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10 — FESTIVAL 2027: Energetic Event Feature                       */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto bg-[#1F1A17] text-[#FAF7F2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-[#FAF7F2]/10">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C8B28B] block mb-2">
              COMING OCTOBER 2027 · AKWA IBOM
            </span>
            <h2 className="font-editorial text-5xl sm:text-7xl font-light text-[#FAF7F2] leading-tight">
              RAFFIA FESTIVAL <br />
              <span className="italic font-normal text-[#C8B28B]">2027</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#FAF7F2]/70 leading-relaxed mb-6 font-light">
              The flagship gathering uniting masquerades, green materials summits, runway fashion, and international craft buyers under monumental woven pavilions.
            </p>
            <button
              onClick={() => onNavigate({ type: 'festival' })}
              className="px-6 py-3 bg-[#C8B28B] text-[#181513] text-xs font-mono uppercase tracking-widest font-semibold hover:bg-white transition-colors cursor-pointer"
            >
              Discover The Festival →
            </button>
          </div>
        </div>

        {/* 8 Small Previews */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {FESTIVAL_EXPERIENCES.map((f) => (
            <div
              key={f.number}
              onClick={() => onNavigate({ type: 'festival' })}
              className="p-4 bg-[#28221D] border border-[#FAF7F2]/10 hover:border-[#C8B28B]/60 transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-mono text-[#C8B28B]">{f.number}</span>
              <p className="font-editorial text-lg font-medium text-[#FAF7F2] mt-0.5">{f.title}</p>
              <p className="text-[10px] text-[#FAF7F2]/50 mt-1 line-clamp-1">{f.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11 — FINAL SHOP MOMENT: Return to Commerce                         */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#181513]/10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
              Living Marketplace
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-light text-[#181513]">
              TAKE RAFFIA <span className="italic">HOME.</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate({ type: 'marketplace' })}
            className="px-8 py-3.5 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer font-medium"
          >
            Shop All Creations ({PRODUCTS.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {finalShopProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
