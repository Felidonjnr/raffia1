import React, { useRef, useState } from 'react';
import { Menu, Search, ShoppingBag, X, ChevronDown, ArrowUpRight } from 'lucide-react';
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
  const closeRef = useRef<number | null>(null);

  const openTab = (tab: MegaMenuTab) => {
    if (closeRef.current) window.clearTimeout(closeRef.current);
    setActive(tab);
  };

  const closeTab = () => {
    closeRef.current = window.setTimeout(() => setActive(null), 180);
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
      <header className="site-nav" onMouseLeave={closeTab}>
        <div className="site-nav-inner">
          <button className="brandmark" onClick={() => onNavigate({ type: 'home' })} aria-label="Raffia Legacy Project Home">
            <div className="brandmark-words">
              <span className="brandmark-raffia">Raffia</span>
              <b className="brandmark-legacy">LEGACY</b>
              <span className="brandmark-project">PROJECT</span>
            </div>
            <BrushStrokeUnderline className="brandmark-brush" />
          </button>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(tab => (
              <div key={tab} className="nav-item" onMouseEnter={() => openTab(tab)}>
                <button className={active === tab ? 'nav-link active' : 'nav-link'} onClick={() => go(tab)}>
                  {tab}<ChevronDown size={13} />
                </button>
              </div>
            ))}
          </nav>

          <div className="nav-actions">
            <button onClick={onOpenSearch} className="nav-action" aria-label="Search"><Search size={18}/><span>SEARCH</span></button>
            <button onClick={() => setIsCartOpen(true)} className="nav-action" aria-label="Shopping bag"><ShoppingBag size={18}/><span>BAG ({totalItems})</span></button>
            <button onClick={() => setMobileOpen(true)} className="mobile-menu-button" aria-label="Open menu"><Menu size={24}/></button>
          </div>
        </div>
        <MegaMenu
          activeTab={active}
          onClose={() => setActive(null)}
          onNavigate={onNavigate}
          onKeepOpen={() => {
            if (closeRef.current) window.clearTimeout(closeRef.current);
          }}
        />
      </header>

      {mobileOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-top">
            <button className="brandmark" onClick={() => {setMobileOpen(false); onNavigate({type:'home'});}} aria-label="Raffia Legacy Project Home">
              <div className="brandmark-words">
                <span className="brandmark-raffia">Raffia</span>
                <b className="brandmark-legacy">LEGACY</b>
                <span className="brandmark-project">PROJECT</span>
              </div>
              <BrushStrokeUnderline className="brandmark-brush" />
            </button>
            <div className="mobile-nav-actions">
              <button onClick={() => {setMobileOpen(false); onOpenSearch();}} aria-label="Search"><Search size={20}/></button>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={25}/></button>
            </div>
          </div>

          <div className="mobile-nav-list">
            {nav.map((tab, i) => (
              <button key={tab} onClick={() => {setMobileOpen(false); go(tab);}} className="mobile-nav-link">
                <span><small>0{i+1}</small>{tab}</span>
                <ArrowUpRight size={20}/>
              </button>
            ))}
          </div>

          <p className="mobile-nav-foot">OUR HERITAGE. OUR PEOPLE. OUR FUTURE.</p>
        </div>
      )}
    </>
  );
};
