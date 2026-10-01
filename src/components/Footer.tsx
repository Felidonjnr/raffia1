import React from 'react';
import { ViewRoute } from '../types';
import { useCart } from '../context/CartContext';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: ViewRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { openInquiry } = useCart();

  return (
    <footer className="bg-[#1F1A17] text-[#FAF7F2] border-t border-[#FAF7F2]/10 pt-20 pb-12 selection:bg-[#B84A28] selection:text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Top Banner / Required Project Statement */}
        <div className="pb-16 border-b border-[#FAF7F2]/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C8B28B] block mb-3">
              Presented by Dance Ville
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight leading-[1.0] text-[#FAF7F2]">
              RAFFIA IS OUR THREAD. <br />
              <span className="italic font-normal text-[#C8B28B]">
                THE FUTURE IS WHAT WE WEAVE WITH IT.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-xs text-[#FAF7F2]/60 font-light leading-relaxed mb-6 max-w-sm ml-auto">
              From palm to product. Culture to commerce. Heritage to opportunity. Connecting traditional knowledge with contemporary fashion, art, tourism, and enterprise.
            </p>
            <button
              onClick={() => openInquiry('PARTNER')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#FAF7F2]/30 text-xs font-mono tracking-widest uppercase hover:bg-[#FAF7F2] hover:text-[#181513] transition-colors cursor-pointer"
            >
              <span>Join As Institutional Partner</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Primary Navigation Columns */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 text-xs font-mono">
          {/* Column 1: SHOP */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-widest text-[#C8B28B] font-semibold">
              Shop
            </p>
            <ul className="space-y-2.5 text-[#FAF7F2]/70 font-light normal-case">
              <li>
                <button
                  onClick={() => onNavigate({ type: 'marketplace', category: 'ALL' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Shop All Objects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'marketplace', category: 'NEW ARRIVALS' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'marketplace', category: 'FASHION & ACCESSORIES' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Fashion & Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'marketplace', category: 'HOME & LIFESTYLE' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Home & Vessels
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'marketplace', category: 'ART & DESIGN' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Art & Tapestries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: COLLECTIONS */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-widest text-[#C8B28B] font-semibold">
              Collections
            </p>
            <ul className="space-y-2.5 text-[#FAF7F2]/70 font-light normal-case">
              <li>
                <button
                  onClick={() => onNavigate({ type: 'collections' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  All Curatorial Capsules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'collections', slug: 'the-river-and-the-loom' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  The River & The Loom
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'collections', slug: 'living-architecture' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Living Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'collections', slug: 'gallery-tapestries' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Gallery Tapestries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: MAKERS */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-widest text-[#C8B28B] font-semibold">
              Makers
            </p>
            <ul className="space-y-2.5 text-[#FAF7F2]/70 font-light normal-case">
              <li>
                <button
                  onClick={() => onNavigate({ type: 'makers' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Meet The Makers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'maker_detail', slug: 'ikot-ekpene-guild' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Ikot Ekpene Guild
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'maker_detail', slug: 'studio-nkem' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Studio Nkem Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'maker_detail', slug: 'oron-fibre-collective' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Oron Riverine Collective
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: RAFFIA */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-widest text-[#C8B28B] font-semibold">
              Raffia
            </p>
            <ul className="space-y-2.5 text-[#FAF7F2]/70 font-light normal-case">
              <li>
                <button
                  onClick={() => onNavigate({ type: 'raffia', topicSlug: 'what-is-raffia' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  What is Raffia?
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'raffia', topicSlug: 'raffia-101' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Raffia 101: Harvest
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'raffia', topicSlug: 'history-and-heritage' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  History & Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'raffia', topicSlug: 'traditional-knowledge' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Traditional Knowledge
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: THE PROJECT */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-widest text-[#C8B28B] font-semibold">
              The Project
            </p>
            <ul className="space-y-2.5 text-[#FAF7F2]/70 font-light normal-case">
              <li>
                <button
                  onClick={() => onNavigate({ type: 'project' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  About the Project
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'project' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Our Vision & Pillars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'legacy_year' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  The Legacy Year
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInquiry('PARTNER')}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Partners & Donors
                </button>
              </li>
            </ul>
          </div>

          {/* Column 6: FESTIVAL 2027 */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-widest text-[#C8B28B] font-semibold">
              Festival 2027
            </p>
            <ul className="space-y-2.5 text-[#FAF7F2]/70 font-light normal-case">
              <li>
                <button
                  onClick={() => onNavigate({ type: 'festival' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Flagship Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'festival' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  The 8 Experiences
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'festival' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  Travel & Hospitality
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ type: 'festival' })}
                  className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-left"
                >
                  VIP Passes
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution & Contact Bar */}
        <div className="pt-10 border-t border-[#FAF7F2]/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#FAF7F2]/50 font-mono tracking-wider gap-4">
          <p>© 2026–2027 Raffia Legacy Project. Stewarded by Dance Ville.</p>
          <div className="flex items-center gap-6">
            <span>Ikot Ekpene · Calabar · Lagos</span>
            <span>·</span>
            <span>All Guild Provenance Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
