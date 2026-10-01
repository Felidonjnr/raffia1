import React from 'react';
import { ViewRoute } from '../types';
import { MAKERS } from '../data/makers';
import { PRODUCTS } from '../data/products';
import { ArchivalImage } from '../components/ArchivalImage';
import { ArrowRight, MapPin, ArrowLeft } from 'lucide-react';

interface MakersDirectoryPageProps {
  onNavigate: (route: ViewRoute) => void;
  onSelectMaker: (slug: string) => void;
}

export const MakersDirectoryPage: React.FC<MakersDirectoryPageProps> = ({
  onNavigate,
  onSelectMaker,
}) => {
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
              The Living Hands
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#181513] leading-[1.05]">
              CUSTODIANS & <br />
              <span className="italic font-normal">MASTER MAKERS</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#57524E] leading-relaxed max-w-md font-normal">
              Every object in the Raffia Legacy collection carries the fingerprints and civilizational memory of an artisan. We partner with multigenerational guilds and forward-thinking ateliers across West Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16">
        <div className="space-y-20">
          {MAKERS.map((maker, idx) => {
            const makerProducts = PRODUCTS.filter((p) => maker.productIds.includes(p.id));

            return (
              <div
                key={maker.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-16 border-b border-[#181513]/10 last:border-b-0"
              >
                {/* Large Editorial Portrait / Guild Image (5 cols) */}
                <div
                  className="lg:col-span-5 cursor-pointer group"
                  onClick={() => onSelectMaker(maker.slug)}
                >
                  <div className="relative border border-[#181513]/15 overflow-hidden bg-[#ECE5DC]">
                    <ArchivalImage
                      src={maker.image}
                      alt={`${maker.name} workshop documentary portrait`}
                      aspectRatio="4:3"
                      accessionNumber={`GUILD-${maker.id.toUpperCase()}`}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono uppercase text-[#8C7355]">
                    <span>Atelier Registry</span>
                    <span>Documented · Dance Ville Archive</span>
                  </div>
                </div>

                {/* Maker Narrative & Linked Creations (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C7355] mb-2">
                      <MapPin className="w-3.5 h-3.5 text-[#B84A28]" />
                      <span>{maker.location}</span>
                    </div>

                    <h2
                      onClick={() => onSelectMaker(maker.slug)}
                      className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#181513] hover:text-[#B84A28] transition-colors cursor-pointer"
                    >
                      {maker.name}
                    </h2>

                    <p className="text-xs font-mono text-[#B84A28] uppercase tracking-wider mt-1">
                      {maker.title} · {maker.discipline}
                    </p>
                  </div>

                  <blockquote className="border-l-2 border-[#B84A28] pl-4 py-1 italic font-editorial text-lg text-[#181513]">
                    &ldquo;{maker.quote}&rdquo;
                  </blockquote>

                  <p className="text-sm text-[#57524E] leading-relaxed font-normal">
                    {maker.bio}
                  </p>

                  <div className="p-4 bg-[#F4EFEA] border border-[#181513]/10 text-xs">
                    <span className="font-mono uppercase text-[#8C7355] block mb-1">
                      Signature Speciality:
                    </span>
                    <p className="text-[#181513] font-medium">{maker.speciality}</p>
                    <p className="text-[#57524E] mt-1 text-[11px]">{maker.heritageNotes}</p>
                  </div>

                  {/* Maker's Creations Preview */}
                  {makerProducts.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-mono uppercase tracking-wider text-[#8C7355] mb-3">
                        Curated Objects by this Maker ({makerProducts.length})
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {makerProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => onNavigate({ type: 'product', slug: p.slug })}
                            className="group/prod cursor-pointer border border-[#181513]/10 p-2 bg-[#FAF7F2] hover:border-[#181513]/30 transition-colors"
                          >
                            <div className="aspect-[4/3] bg-[#ECE5DC] overflow-hidden mb-2">
                              <ArchivalImage
                                src={p.image}
                                alt={p.name}
                                aspectRatio="custom"
                                className="w-full h-full object-cover group-hover/prod:scale-105 transition-transform"
                              />
                            </div>
                            <p className="font-editorial text-sm font-medium text-[#181513] line-clamp-1 group-hover/prod:text-[#B84A28]">
                              {p.name}
                            </p>
                            <p className="font-editorial text-xs text-[#181513] font-semibold tabular-nums mt-0.5">
                              ${p.price} USD
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={() => onSelectMaker(maker.slug)}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] transition-colors cursor-pointer font-semibold"
                    >
                      <span>Read Full Maker Monograph & Interview</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
