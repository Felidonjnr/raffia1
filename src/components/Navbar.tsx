import React, { useEffect, useRef, useState } from 'react';
import { Menu, Search, ShoppingBag, X, ChevronDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ViewRoute } from '../types';
import { MegaMenu, MegaMenuTab } from './MegaMenu';
import { BrushStrokeUnderline } from './RaffiaLogo';

interface NavbarProps {
  currentRoute: ViewRoute;
  onNavigate: (route: ViewRoute) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [active, setActive] = useState<MegaMenuTab | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openTab = (tab: MegaMenuTab) => {
    if (closeRef.current) window.clearTimeout(closeRef.current);
    setActive(tab);
  };

  const closeTab = () => {
    closeRef.current = window.setTimeout(() => setActive(null), 200);
  };

  const nav = [
    'THE PROJECT',
    'RAFFIA',
    'EXPLORE',
    'MARKETPLACE',
    'FESTIVAL 2027',
    'GET INVOLVED',
  ] as MegaMenuTab[];

  const go = (tab: MegaMenuTab) => {
    setActive(null);
    if (tab === 'MARKETPLACE') onNavigate({ type: 'marketplace' });
    else onNavigate({ type: 'coming_soon', title: tab, subtitle: 'This section is being prepared for the Raffia Legacy launch.' });
  };

  return (
    <>
      <header
        className={`site-nav transition-all duration-300 ${
          isScrolled
            ? 'site-nav-scrolled bg-[#241A14]/95 text-[#F3EBDD] border-b border-[#C8A978]/25 shadow-lg h-[70px]'
            : 'bg-[#F3EBDD]/90 backdrop-blur-md text-[#11100E] border-b border-[#241A14]/10 h-[82px]'
        }`}
        onMouseLeave={closeTab}
      >
        <div className="site-nav-inner">
          {/* Brandmark with authentic Bodoni Moda / Montserrat hierarchy */}
          <button
            className="brandmark"
            onClick={() => onNavigate({ type: 'home' })}
            aria-label="Raffia Legacy Project Home"
          >
            <div className="brandmark-words">
              <span
                className={`brandmark-raffia transition-colors ${
                  isScrolled ? 'text-white' : 'text-[#11100E]'
                }`}
              >
                Raffia
              </span>
              <b className="brandmark-legacy text-[#B65332]">LEGACY</b>
              <span
                className={`brandmark-project transition-colors ${
                  isScrolled ? 'text-[#C8A978]' : 'text-[#73695E]'
                }`}
              >
                PROJECT
              </span>
            </div>
            <BrushStrokeUnderline
              className="brandmark-brush"
              color={isScrolled ? '#C8A978' : '#B65332'}
            />
          </button>

          {/* Desktop Primary Nav */}
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map((tab) => (
              <div key={tab} className="nav-item" onMouseEnter={() => openTab(tab)}>
                <button
                  className={`nav-link text-xs font-bold tracking-wider transition-colors flex items-center gap-1 cursor-pointer ${
                    active === tab
                      ? 'text-[#B65332]'
                      : isScrolled
                      ? 'text-white/85 hover:text-white'
                      : 'text-[#11100E]/85 hover:text-[#B65332]'
                  }`}
                  onClick={() => go(tab)}
                >
                  <span>{tab}</span>
                  <ChevronDown size={12} className={active === tab ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
              </div>
            ))}
          </nav>

          {/* Nav Action Controls */}
          <div className="nav-actions flex items-center gap-4">
            <button
              onClick={onOpenSearch}
              className={`nav-action flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                isScrolled ? 'text-white/80 hover:text-white' : 'text-[#11100E]/80 hover:text-[#11100E]'
              }`}
              aria-label="Search"
            >
              <Search size={16} />
              <span className="hidden sm:inline">SEARCH</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="nav-action flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase px-3 py-1.5 bg-[#B65332] text-white hover:bg-[#B65332]/90 transition-colors cursor-pointer"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={15} />
              <span>BAG ({totalItems})</span>
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className={`mobile-menu-button lg:hidden p-1.5 transition-colors cursor-pointer ${
                isScrolled ? 'text-white' : 'text-[#11100E]'
              }`}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Premium Visual Mega Menu */}
        <MegaMenu
          activeTab={active}
          onClose={() => setActive(null)}
          onNavigate={onNavigate}
          onKeepOpen={() => {
            if (closeRef.current) window.clearTimeout(closeRef.current);
          }}
        />
      </header>

      {/* Full-Screen Visual Mobile Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#11100E] text-[#F3EBDD] flex flex-col justify-between p-6 sm:p-10 overflow-y-auto">
          {/* Mobile Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <button
              className="brandmark"
              onClick={() => {
                setMobileOpen(false);
                onNavigate({ type: 'home' });
              }}
              aria-label="Raffia Legacy Project Home"
            >
              <div className="brandmark-words">
                <span className="brandmark-raffia text-white">Raffia</span>
                <b className="brandmark-legacy text-[#B65332]">LEGACY</b>
                <span className="brandmark-project text-[#C8A978]">PROJECT</span>
              </div>
              <BrushStrokeUnderline className="brandmark-brush" color="#C8A978" />
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenSearch();
                }}
                className="p-2 text-white/80 hover:text-white"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X size={26} />
              </button>
            </div>
          </div>

          {/* Navigation Links with Large Typography */}
          <div className="py-8 space-y-3">
            {nav.map((tab, i) => (
              <button
                key={tab}
                onClick={() => {
                  setMobileOpen(false);
                  go(tab);
                }}
                className="w-full flex items-center justify-between text-left py-3 border-b border-white/10 group cursor-pointer"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[#C8A978]">0{i + 1}</span>
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#C8A978] transition-colors">
                    {tab}
                  </span>
                </div>
                <ArrowUpRight size={20} className="text-white/40 group-hover:text-[#C8A978] transition-colors" />
              </button>
            ))}
          </div>

          {/* Mobile Bottom Shortcuts */}
          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => {
                setMobileOpen(false);
                setIsCartOpen(true);
              }}
              className="flex items-center justify-center gap-2 py-3 bg-[#B65332] text-white font-bold text-xs uppercase tracking-wider"
            >
              <ShoppingBag size={16} />
              <span>VIEW SELECTION ({totalItems})</span>
            </button>

            <p className="text-[11px] font-mono text-[#C8A978] text-center sm:text-right">
              12 MONTHS · ONE LEGACY · ONE FESTIVAL
            </p>
          </div>
        </div>
      )}
    </>
  );
};
