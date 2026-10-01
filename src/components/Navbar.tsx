import React, { useState, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ViewRoute } from '../types';
import { MegaMenu, MegaMenuTab } from './MegaMenu';

interface NavbarProps {
  currentRoute: ViewRoute;
  onNavigate: (route: ViewRoute) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [activeMegaTab, setActiveMegaTab] = useState<MegaMenuTab | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (tab: MegaMenuTab) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveMegaTab(tab);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMegaTab(null);
    }, 200);
  };

  const handleTabClick = (tab: MegaMenuTab) => {
    if (tab === 'SHOP') {
      onNavigate({ type: 'marketplace', category: 'ALL' });
    } else if (tab === 'COLLECTIONS') {
      onNavigate({ type: 'collections' });
    } else if (tab === 'MAKERS') {
      onNavigate({ type: 'makers' });
    } else if (tab === 'RAFFIA') {
      onNavigate({ type: 'raffia' });
    } else if (tab === 'THE PROJECT') {
      onNavigate({ type: 'project' });
    } else if (tab === 'FESTIVAL 2027') {
      onNavigate({ type: 'festival' });
    }
    setActiveMegaTab(null);
  };

  const handleMobileNav = (route: ViewRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  const navItems: { label: MegaMenuTab; route: ViewRoute }[] = [
    { label: 'SHOP', route: { type: 'marketplace' } },
    { label: 'COLLECTIONS', route: { type: 'collections' } },
    { label: 'MAKERS', route: { type: 'makers' } },
    { label: 'RAFFIA', route: { type: 'raffia' } },
    { label: 'THE PROJECT', route: { type: 'project' } },
    { label: 'FESTIVAL 2027', route: { type: 'festival' } },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#181513]/10 transition-colors"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Brand Zone */}
          <button
            onClick={() => {
              setActiveMegaTab(null);
              onNavigate({ type: 'home' });
            }}
            className="text-left group cursor-pointer focus:outline-none flex items-baseline gap-2 shrink-0"
          >
            <span className="font-editorial text-2xl lg:text-3xl tracking-tight text-[#181513] font-medium group-hover:text-[#B84A28] transition-colors">
              RAFFIA LEGACY
            </span>
          </button>

          {/* Primary Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-7 text-[12px] tracking-widest uppercase font-mono text-[#57524E]">
            {navItems.map((item) => {
              const isActive =
                (item.label === 'SHOP' && currentRoute.type === 'marketplace') ||
                (item.label === 'COLLECTIONS' && currentRoute.type === 'collections') ||
                (item.label === 'MAKERS' && (currentRoute.type === 'makers' || currentRoute.type === 'maker_detail')) ||
                (item.label === 'RAFFIA' && currentRoute.type === 'raffia') ||
                (item.label === 'THE PROJECT' && (currentRoute.type === 'project' || currentRoute.type === 'legacy_year')) ||
                (item.label === 'FESTIVAL 2027' && currentRoute.type === 'festival');

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  className="relative py-7 cursor-pointer"
                >
                  <button
                    onClick={() => handleTabClick(item.label)}
                    className={`flex items-center gap-1 transition-colors cursor-pointer ${
                      isActive || activeMegaTab === item.label
                        ? 'text-[#B84A28] font-bold'
                        : 'hover:text-[#181513]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeMegaTab === item.label ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Right Side: Search & Bag */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#181513] hover:text-[#B84A28] transition-colors cursor-pointer p-1.5 focus:outline-none"
              aria-label="Open search"
            >
              <Search className="w-4 h-4 text-[#181513]" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#181513] hover:text-[#B84A28] transition-colors cursor-pointer p-1.5 focus:outline-none"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#181513]" />
              <span className="hidden sm:inline">Bag</span>
              <span className="tabular-nums font-mono text-xs text-[#8C7355]">
                ({totalItems})
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 text-[#181513] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown for Desktop */}
        <MegaMenu
          activeTab={activeMegaTab}
          onClose={() => setActiveMegaTab(null)}
          onNavigate={onNavigate}
        />
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col justify-between p-6 sm:p-10 overflow-y-auto animate-in fade-in duration-200">
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#181513]/10">
            <span className="font-editorial text-2xl tracking-tight text-[#181513] font-medium">
              RAFFIA LEGACY
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="p-2 text-[#181513]"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#181513] cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Primary Mobile Navigation Links */}
          <div className="my-auto py-8 space-y-5">
            {[
              { label: '01. SHOP ALL OBJECTS', desc: 'Browse the living marketplace', route: { type: 'marketplace' as const, category: 'ALL' as const } },
              { label: '02. LIVING COLLECTIONS', desc: 'Curatorial themed capsules', route: { type: 'collections' as const } },
              { label: '03. CUSTODIANS & MAKERS', desc: 'Artisan guilds and workshops', route: { type: 'makers' as const } },
              { label: '04. RAFFIA KNOWLEDGE ARCHIVE', desc: 'Botany, history & living culture', route: { type: 'raffia' as const } },
              { label: '05. THE PROJECT ECOSYSTEM', desc: 'About Dance Ville & Five Pillars', route: { type: 'project' as const } },
              { label: '06. THE LEGACY YEAR', desc: 'The 12-month continuum', route: { type: 'legacy_year' as const } },
              { label: '07. FESTIVAL 2027', desc: 'Coming October 2027 in Akwa Ibom', route: { type: 'festival' as const } },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleMobileNav(item.route)}
                className="group cursor-pointer pb-3 border-b border-[#181513]/10 flex items-center justify-between"
              >
                <div>
                  <p className="font-editorial text-2xl sm:text-3xl text-[#181513] group-hover:text-[#B84A28] transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-[#57524E] mt-0.5 font-mono">
                    {item.desc}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#8C7355] group-hover:text-[#B84A28] group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>

          {/* Mobile Footer Area */}
          <div className="pt-6 border-t border-[#181513]/10 flex flex-col sm:flex-row items-baseline justify-between text-xs font-mono text-[#57524E] gap-2">
            <span>Dance Ville Cultural Institution</span>
            <span>Raffia is our thread.</span>
          </div>
        </div>
      )}
    </>
  );
};
