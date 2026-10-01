import React from 'react';
import { ViewRoute, ProductCategory } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { MAKERS } from '../data/makers';

export type MegaMenuTab = 'SHOP' | 'COLLECTIONS' | 'MAKERS' | 'RAFFIA' | 'THE PROJECT' | 'FESTIVAL 2027';

interface MegaMenuProps {
  activeTab: MegaMenuTab | null;
  onClose: () => void;
  onNavigate: (route: ViewRoute) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  activeTab,
  onClose,
  onNavigate,
}) => {
  if (!activeTab) return null;

  const handleLinkClick = (route: ViewRoute) => {
    onClose();
    onNavigate(route);
  };

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FAF7F2] border-b border-[#181513]/15 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
        {/* SHOP PANEL */}
        {activeTab === 'SHOP' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B84A28] block">
                The Curated Marketplace
              </span>
              <h3 className="font-editorial text-3xl font-light text-[#181513]">
                Shop Contemporary & Archival Raffia
              </h3>
              <p className="text-xs text-[#57524E] leading-relaxed">
                Direct procurement from West African master guilds and contemporary design studios. 100% fair-wage certified.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => handleLinkClick({ type: 'marketplace', category: 'ALL' })}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold"
                >
                  <span>Explore Complete Catalog ({PRODUCTS.length} Objects)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 border-l border-[#181513]/10 pl-8 space-y-2 text-xs font-mono uppercase tracking-wider">
              <p className="text-[10px] text-[#8C7355] mb-2 font-semibold">Categories & Releases</p>
              {[
                { label: 'Shop All', category: 'ALL' as ProductCategory },
                { label: 'New Arrivals', category: 'NEW ARRIVALS' as ProductCategory },
                { label: 'Fashion & Accessories', category: 'FASHION & ACCESSORIES' as ProductCategory },
                { label: 'Home & Lifestyle', category: 'HOME & LIFESTYLE' as ProductCategory },
                { label: 'Art & Design', category: 'ART & DESIGN' as ProductCategory },
                { label: 'Traditional Craft', category: 'TRADITIONAL CRAFT' as ProductCategory },
                { label: 'Gifts', category: 'GIFTS' as ProductCategory },
                { label: 'Festival Merchandise', category: 'FESTIVAL MERCHANDISE' as ProductCategory },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick({ type: 'marketplace', category: item.category })}
                  className="block text-left py-1 text-[#57524E] hover:text-[#B84A28] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#ECE5DC] p-5 border border-[#DDD4C5] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7355] block">
                Featured Acquisition
              </span>
              <div
                onClick={() => handleLinkClick({ type: 'product', slug: PRODUCTS[0].slug })}
                className="group cursor-pointer"
              >
                <p className="font-editorial text-xl font-medium text-[#181513] group-hover:text-[#B84A28]">
                  {PRODUCTS[0].name}
                </p>
                <p className="text-xs text-[#57524E] mt-1">
                  Hand-coiled undulating amphora with terracotta rim. By {PRODUCTS[0].maker.name}.
                </p>
                <p className="font-editorial text-lg font-semibold text-[#181513] tabular-nums mt-2">
                  ${PRODUCTS[0].price} USD
                </p>
              </div>
            </div>
          </div>
        )}

        {/* COLLECTIONS PANEL */}
        {activeTab === 'COLLECTIONS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B84A28] block">
                Curatorial Capsules
              </span>
              <h3 className="font-editorial text-3xl font-light text-[#181513]">
                Themed Living Collections
              </h3>
              <p className="text-xs text-[#57524E] leading-relaxed">
                Narrative capsule collections uniting wearables, ceremonial sculpture, and everyday objects under shared historical themes.
              </p>
            </div>

            <div className="lg:col-span-4 border-l border-[#181513]/10 pl-8 space-y-2 text-xs font-mono uppercase tracking-wider">
              <p className="text-[10px] text-[#8C7355] mb-2 font-semibold">Capsule Lines</p>
              {[
                { label: 'All Curatorial Capsules', route: { type: 'collections' as const } },
                { label: 'The River & The Loom', route: { type: 'collections' as const, slug: 'the-river-and-the-loom' } },
                { label: 'Living Architecture & Vessels', route: { type: 'collections' as const, slug: 'living-architecture' } },
                { label: 'Gallery Tapestries & Fiber Art', route: { type: 'collections' as const, slug: 'gallery-tapestries' } },
                { label: 'Ancestral Cloth & Masquerade', route: { type: 'collections' as const, slug: 'ancestral-cloth-and-masquerade' } },
                { label: 'Curator Keepsakes & Festival', route: { type: 'collections' as const, slug: 'curator-keepsakes' } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick(item.route)}
                  className="block text-left py-1 text-[#57524E] hover:text-[#B84A28] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#F4EFEA] p-5 border border-[#181513]/10 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B84A28]">
                Inaugural Capsule
              </span>
              <h4 className="font-editorial text-xl font-medium">The River & The Loom</h4>
              <p className="text-xs text-[#57524E] leading-relaxed">
                A capsule honoring the wild Raphia palms of the Cross River wetlands, woven with mangrove indigo and vegetable-tanned saddlery.
              </p>
              <button
                onClick={() => handleLinkClick({ type: 'collections', slug: 'the-river-and-the-loom' })}
                className="text-xs font-mono uppercase tracking-wider text-[#181513] underline font-medium hover:text-[#B84A28]"
              >
                View Capsule →
              </button>
            </div>
          </div>
        )}

        {/* MAKERS PANEL */}
        {activeTab === 'MAKERS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B84A28] block">
                The Living Hands
              </span>
              <h3 className="font-editorial text-3xl font-light text-[#181513]">
                Custodians & Master Guilds
              </h3>
              <p className="text-xs text-[#57524E] leading-relaxed">
                Every raffia creation carries the lineage and signature of master artisans across Akwa Ibom, Cross River, and Lagos.
              </p>
              <button
                onClick={() => handleLinkClick({ type: 'makers' })}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold"
              >
                <span>View All Guild Profiles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-4 border-l border-[#181513]/10 pl-8 space-y-3 text-xs font-mono uppercase tracking-wider">
              <p className="text-[10px] text-[#8C7355] mb-1 font-semibold">Guild Directory</p>
              {MAKERS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleLinkClick({ type: 'maker_detail', slug: m.slug })}
                  className="block text-left py-1 text-[#57524E] hover:text-[#B84A28] transition-colors cursor-pointer"
                >
                  <span className="block font-medium">{m.name}</span>
                  <span className="text-[10px] text-[#8C7355] normal-case">{m.location}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#ECE5DC] p-5 border border-[#DDD4C5] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7355] block">
                Artisan Registry
              </span>
              <h4 className="font-editorial text-xl font-medium">Become a Partner Maker</h4>
              <p className="text-xs text-[#57524E] leading-relaxed">
                Are you a palm harvester, weaver, or contemporary atelier working with natural African fibres? Join our certified provenance registry.
              </p>
              <button
                onClick={() =>
                  handleLinkClick({
                    type: 'coming_soon',
                    title: 'Artisan & Guild Application Portal',
                    subtitle: 'Direct fair-trade verification, certification, and marketplace induction.',
                  })
                }
                className="px-4 py-2 bg-[#181513] text-[#FAF7F2] text-[11px] font-mono uppercase tracking-widest hover:bg-[#B84A28] transition-colors cursor-pointer"
              >
                Apply To Join Guild
              </button>
            </div>
          </div>
        )}

        {/* RAFFIA PANEL */}
        {activeTab === 'RAFFIA' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B84A28] block">
                Cultural Discovery Archive
              </span>
              <h3 className="font-editorial text-3xl font-light text-[#181513]">
                Material Memory & Wisdom
              </h3>
              <p className="text-xs text-[#57524E] leading-relaxed">
                An educational compendium exploring the botany, civilizational history, ancestral weaving geometry, and living ceremonial roles of raffia.
              </p>
              <button
                onClick={() => handleLinkClick({ type: 'raffia' })}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold"
              >
                <span>Enter Cultural Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-5 border-l border-[#181513]/10 pl-8 grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono uppercase tracking-wider">
              {[
                { title: 'What is Raffia?', slug: 'what-is-raffia' },
                { title: 'Raffia 101: Harvest to Thread', slug: 'raffia-101' },
                { title: 'History & Heritage', slug: 'history-and-heritage' },
                { title: 'Traditional Knowledge', slug: 'traditional-knowledge' },
                { title: 'Raffia & Culture', slug: 'raffia-and-culture' },
                { title: 'Raffia & Creativity', slug: 'raffia-and-creativity' },
                { title: 'Raffia & Enterprise', slug: 'raffia-and-enterprise' },
                { title: 'Glossary of Terms', slug: 'glossary' },
              ].map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleLinkClick({ type: 'raffia', topicSlug: item.slug })}
                  className="text-left py-1 text-[#57524E] hover:text-[#B84A28] transition-colors cursor-pointer"
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 bg-[#F4EFEA] p-5 border border-[#181513]/10 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7355]">
                Curatorial Monograph
              </span>
              <p className="font-editorial text-lg italic text-[#181513]">
                &ldquo;Raffia is our thread. The future is what we weave with it.&rdquo;
              </p>
              <p className="text-[11px] text-[#57524E]">
                Open-access research preserved in dialogue with elder councils in Akwa Ibom.
              </p>
            </div>
          </div>
        )}

        {/* THE PROJECT PANEL */}
        {activeTab === 'THE PROJECT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B84A28] block">
                Presented by Dance Ville
              </span>
              <h3 className="font-editorial text-3xl font-light text-[#181513]">
                The Raffia Legacy Project
              </h3>
              <p className="text-xs text-[#57524E] leading-relaxed">
                A year-round ecosystem celebrating African palm heritage, sustainable innovation, youth livelihoods, and regenerative economic opportunity.
              </p>
              <button
                onClick={() => handleLinkClick({ type: 'project' })}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold"
              >
                <span>Explore Project Ecosystem</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-4 border-l border-[#181513]/10 pl-8 space-y-2 text-xs font-mono uppercase tracking-wider">
              <p className="text-[10px] text-[#8C7355] mb-2 font-semibold">Institutional Blueprint</p>
              {[
                { label: 'About the Project', route: { type: 'project' as const } },
                { label: 'Our Five Pillars', route: { type: 'project' as const } },
                { label: 'The Legacy Year (12 Months)', route: { type: 'legacy_year' as const } },
                { label: 'Discover Raffia School Programme', route: { type: 'legacy_year' as const } },
                { label: 'Young Raffia Innovators', route: { type: 'legacy_year' as const } },
                { label: 'Create Raffia Design Challenge', route: { type: 'legacy_year' as const } },
                { label: 'Raffia Business Incubator', route: { type: 'legacy_year' as const } },
                { label: 'Institutional Partners & Donors', route: { type: 'project' as const } },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLinkClick(item.route)}
                  className="block text-left py-1 text-[#57524E] hover:text-[#B84A28] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#ECE5DC] p-5 border border-[#DDD4C5] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7355]">
                Continuum
              </span>
              <h4 className="font-editorial text-xl font-medium">The Festival is Only the Beginning</h4>
              <p className="text-xs text-[#57524E] leading-relaxed">
                The Legacy Year guarantees sustainable continuity before, during, and long after the festival gates open.
              </p>
              <button
                onClick={() => handleLinkClick({ type: 'legacy_year' })}
                className="text-xs font-mono uppercase tracking-wider text-[#B84A28] font-semibold hover:underline"
              >
                Inspect 12-Month Journey →
              </button>
            </div>
          </div>
        )}

        {/* FESTIVAL 2027 PANEL */}
        {activeTab === 'FESTIVAL 2027' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#B84A28]">
                <Sparkles className="w-3 h-3" />
                <span>The Flagship Gathering · Coming 2027</span>
              </div>
              <h3 className="font-editorial text-3xl font-light text-[#181513]">
                Raffia Festival 2027
              </h3>
              <p className="text-xs text-[#57524E] leading-relaxed">
                Four days of immersive living culture, masquerade pageantry, green materials summit, and haute couture in Akwa Ibom.
              </p>
              <button
                onClick={() => handleLinkClick({ type: 'festival' })}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold"
              >
                <span>Discover Festival 2027</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-4 border-l border-[#181513]/10 pl-8 space-y-2 text-xs font-mono uppercase tracking-wider">
              <p className="text-[10px] text-[#8C7355] mb-2 font-semibold">Festival Sections</p>
              {[
                'About the Festival',
                'Programme & Schedule',
                'The 8 Core Experiences',
                'Raffia Village & Workshops',
                'Trade Marketplace Hall',
                'Travel, Hotels & Logistics',
                'Frequently Asked Questions',
                'VIP Delegate Accreditation',
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => handleLinkClick({ type: 'festival' })}
                  className="block text-left py-1 text-[#57524E] hover:text-[#B84A28] transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="lg:col-span-4 bg-[#1F1A17] text-[#FAF7F2] p-5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8B28B]">
                Host Location
              </span>
              <h4 className="font-editorial text-xl font-medium text-[#FAF7F2]">
                Ikot Ekpene & Cross River Cultural Grounds
              </h4>
              <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
                Join international patrons, cultural ministers, and over 1,000 masquerade performers under monumental woven pavilions.
              </p>
              <button
                onClick={() => handleLinkClick({ type: 'festival' })}
                className="px-4 py-2 bg-[#C8B28B] text-[#181513] text-[11px] font-mono uppercase tracking-widest font-semibold hover:bg-white transition-colors cursor-pointer"
              >
                Register Interest For Passes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
