import React, { useState } from 'react';
import { ViewRoute } from '../types';
import { PILLARS } from '../data/legacyData';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ArrowRight, ShieldCheck, HeartHandshake, Sparkles, Target, Users, Globe2, BookOpen, Layers } from 'lucide-react';

interface ProjectPageProps {
  initialSection?: 'about' | 'vision' | 'legacy-year' | 'programmes' | 'impact' | 'partners';
  onNavigate: (route: ViewRoute) => void;
}

export const ProjectPage: React.FC<ProjectPageProps> = ({
  initialSection = 'about',
  onNavigate,
}) => {
  const { openInquiry } = useCart();
  const [activeTab, setActiveTab] = useState<'about' | 'vision' | 'programmes' | 'impact' | 'partners'>(
    initialSection === 'legacy-year' ? 'about' : initialSection
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      {/* Header */}
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
              Presented by Dance Ville
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#181513] leading-[1.05]">
              THE RAFFIA <br />
              <span className="italic font-normal">LEGACY PROJECT</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#57524E] leading-relaxed max-w-md font-normal">
              A year-round initiative celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Sub-Section Navigation Tabs */}
      <section className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#181513]/10 py-3 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-mono uppercase">
          {[
            { id: 'about', label: '01. About the Project' },
            { id: 'vision', label: '02. Our Vision & Pillars' },
            { id: 'programmes', label: '03. Ecosystem Programmes' },
            { id: 'impact', label: '04. Economic Impact' },
            { id: 'partners', label: '05. Institutional Partners' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 whitespace-nowrap transition-colors cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-[#181513] text-[#FAF7F2] border-[#181513] font-semibold'
                  : 'bg-[#FAF7F2] text-[#57524E] border-[#181513]/10 hover:border-[#181513]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => onNavigate({ type: 'legacy_year' })}
            className="px-4 py-2 whitespace-nowrap transition-colors cursor-pointer border border-[#B84A28] text-[#B84A28] font-semibold hover:bg-[#B84A28] hover:text-white ml-auto"
          >
            The Legacy Year (12-Month Timeline) →
          </button>
        </div>
      </section>

      {/* TAB 1: ABOUT */}
      {activeTab === 'about' && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 space-y-16 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B84A28]">
                Origins & Custodianship
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513] leading-tight">
                From palm to product. Culture to commerce. Heritage to opportunity.
              </h2>
              <p className="text-base text-[#57524E] leading-relaxed">
                Raffia carries history, skill, identity and possibility. Across West Africa, it has clothed kings, insulated traditional homes, rustled in ceremonial masquerades, and provided durable trade currency.
              </p>
              <p className="text-base text-[#57524E] leading-relaxed">
                The Raffia Legacy Project connects this ancestral treasury with cutting-edge fashion ateliers, green architecture, biodesign laboratories, and international marketplaces.
              </p>
            </div>

            <div className="lg:col-span-6 bg-[#ECE5DC] p-8 sm:p-12 border border-[#DDD4C5] space-y-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#8C7355]">
                The Cultural Institution
              </p>
              <h3 className="font-editorial text-3xl font-medium text-[#181513]">
                Stewarded by Dance Ville
              </h3>
              <p className="text-sm text-[#57524E] leading-relaxed">
                Dance Ville is a pan-African creative institution advancing performing arts, material heritage, and creative economy development. Through the Raffia Legacy, Dance Ville creates enduring value from indigenous resources and builds sustainable sovereign infrastructure for makers.
              </p>
              <div className="pt-4 border-t border-[#181513]/10 flex items-center justify-between text-xs font-mono text-[#181513]">
                <span>Headquarters: Lagos & Akwa Ibom</span>
                <span className="text-[#B84A28]">West African Provenance</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: VISION & PILLARS */}
      {activeTab === 'vision' && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 space-y-16 animate-in fade-in duration-300">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B84A28]">
              Foundational Architecture
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
              THE FIVE PILLARS
            </h2>
            <p className="text-base text-[#57524E] leading-relaxed">
              Every initiative, exhibition, product commission, and investment under the Raffia Legacy is anchored in five fundamental pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PILLARS.map((p) => (
              <div key={p.number} className="p-8 bg-[#FAF7F2] border border-[#181513]/15 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8C7355] block mb-2">
                    Pillar {p.number}
                  </span>
                  <h3 className="font-editorial text-3xl font-medium text-[#181513] mb-1">
                    {p.title}
                  </h3>
                  <p className="font-editorial italic text-base text-[#57524E] mb-4">
                    {p.tagline}
                  </p>
                  <p className="text-xs text-[#57524E] leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#181513]/10 space-y-1 text-xs text-[#181513]">
                  {p.details.map((d, idx) => (
                    <p key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#B84A28]">·</span>
                      <span>{d}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: PROGRAMMES */}
      {activeTab === 'programmes' && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 space-y-12 animate-in fade-in duration-300">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B84A28]">
              Year-Round Activity
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
              OUR PROGRAMMES
            </h2>
            <p className="text-base text-[#57524E]">
              The Raffia Legacy is not a single annual moment. It is a live network of structured interventions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Discover Raffia School Programme',
                icon: BookOpen,
                desc: 'Integrating botanical classification, natural dyes, and ancestral weaving geometry into primary and secondary schools in palm-growing regions.',
                metrics: '24 schools · 1,800+ youth participants',
              },
              {
                title: 'Young Raffia Innovators Fellowship',
                icon: Sparkles,
                desc: 'Supporting material scientists, industrial designers, and engineers creating bioplastics, thermal acoustic insulation, and circular composites.',
                metrics: '20 multidisciplinary fellows · $100K seed pool',
              },
              {
                title: 'Create Raffia Design Challenge',
                icon: Layers,
                desc: 'An open pan-African design commission pairing elder master weavers with contemporary fashion labels and spatial architects.',
                metrics: '14 participating countries · Capsule exhibitions',
              },
              {
                title: 'Raffia Business Incubator',
                icon: Target,
                desc: 'Equipping rural cooperative workshops with inventory control, digital banking, export packaging, and fair-wage certification standards.',
                metrics: '15 cooperatives inducted · Direct global market',
              },
            ].map((prog, idx) => {
              const Icon = prog.icon;
              return (
                <div key={idx} className="p-8 bg-[#FAF7F2] border border-[#181513]/15 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-[#ECE5DC] flex items-center justify-center text-[#B84A28] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-editorial text-2xl font-medium text-[#181513]">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-[#57524E] leading-relaxed">
                      {prog.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#181513]/10 mt-6 text-xs font-mono text-[#8C7355]">
                    <span>{prog.metrics}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 4: IMPACT */}
      {activeTab === 'impact' && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 space-y-12 animate-in fade-in duration-300">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B84A28]">
              Creating Value From What Exists
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
              COMMUNITY & ECONOMIC IMPACT
            </h2>
            <p className="text-base text-[#57524E]">
              We evaluate our success through living wealth retained by local communities:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center font-mono">
            <div className="p-8 bg-[#ECE5DC] border border-[#DDD4C5]">
              <span className="block font-editorial text-4xl font-semibold text-[#181513] mb-1">100%</span>
              <span className="text-xs uppercase text-[#8C7355] block">Direct Remittance</span>
              <p className="text-[11px] text-[#57524E] normal-case mt-2">Zero-commission middleman structure for guild artisans.</p>
            </div>
            <div className="p-8 bg-[#ECE5DC] border border-[#DDD4C5]">
              <span className="block font-editorial text-4xl font-semibold text-[#181513] mb-1">250+</span>
              <span className="text-xs uppercase text-[#8C7355] block">Apprentices</span>
              <p className="text-[11px] text-[#57524E] normal-case mt-2">Funded youth studying with elder master weavers.</p>
            </div>
            <div className="p-8 bg-[#ECE5DC] border border-[#DDD4C5]">
              <span className="block font-editorial text-4xl font-semibold text-[#181513] mb-1">12</span>
              <span className="text-xs uppercase text-[#8C7355] block">Protected Groves</span>
              <p className="text-[11px] text-[#57524E] normal-case mt-2">Raphia palm wetland conservation reserves in Akwa Ibom.</p>
            </div>
            <div className="p-8 bg-[#ECE5DC] border border-[#DDD4C5]">
              <span className="block font-editorial text-4xl font-semibold text-[#181513] mb-1">5,000</span>
              <span className="text-xs uppercase text-[#8C7355] block">Projected Jobs</span>
              <p className="text-[11px] text-[#57524E] normal-case mt-2">Sustainable livelihoods created across value chain by 2028.</p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: PARTNERS */}
      {activeTab === 'partners' && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 space-y-12 animate-in fade-in duration-300">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B84A28]">
              Coalition for Creative Sovereignty
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
              INSTITUTIONAL PARTNERS & DONORS
            </h2>
            <p className="text-base text-[#57524E]">
              We collaborate with cultural institutions, foundations, development finance institutions, and luxury design houses committed to African creative industries.
            </p>
          </div>

          <div className="p-8 sm:p-14 bg-[#ECE5DC] border border-[#DDD4C5] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28]">
                <HeartHandshake className="w-4 h-4" />
                <span>Open Call For Alignment</span>
              </div>
              <h3 className="font-editorial text-3xl sm:text-4xl text-[#181513]">
                Shape the 2026–2027 Legacy Year
              </h3>
              <p className="text-sm text-[#57524E] leading-relaxed max-w-xl">
                Partner with us to underwrite apprentice stipends, host international exhibitions, support materials science patents, or sponsor the Festival 2027 pavilions.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <button
                onClick={() => openInquiry('PARTNER')}
                className="px-8 py-4 bg-[#B84A28] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#9E3E20] transition-colors cursor-pointer shadow-sm font-semibold"
              >
                Inquire For Partnership
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
