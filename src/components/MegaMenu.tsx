import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ViewRoute } from '../types';

export type MegaMenuTab = 'THE PROJECT' | 'RAFFIA' | 'EXPLORE' | 'MARKETPLACE' | 'FESTIVAL 2027' | 'GET INVOLVED';

interface MegaMenuProps {
  activeTab: MegaMenuTab | null;
  onClose: () => void;
  onNavigate: (route: ViewRoute) => void;
  onKeepOpen?: () => void;
}

const menus: Record<MegaMenuTab, { title: string; items: string[] }> = {
  'THE PROJECT': {
    title: 'The Raffia Legacy Project',
    items: ['About the Project','Our Vision','The Legacy Year','Our Programmes','Impact','The Legacy Collection','Partners'],
  },
  'RAFFIA': {
    title: 'Discover Raffia',
    items: ['What is Raffia?','Raffia 101','History & Heritage','Traditional Knowledge','Raffia & Culture','Raffia & Creativity','Raffia & Enterprise','Raffia Glossary / Learning Resources'],
  },
  'EXPLORE': {
    title: 'Explore the Living Archive',
    items: ['Raffia Stories','People & Makers','Journal','Global Raffia','Archive','Exhibitions','Videos','Photo Stories','Opportunities'],
  },
  'MARKETPLACE': {
    title: 'The Raffia Marketplace',
    items: ['Shop All','Fashion & Accessories','Home & Lifestyle','Art & Design','Traditional Craft','Gifts','Festival Merchandise','Meet the Makers','Sell With Us'],
  },
  'FESTIVAL 2027': {
    title: 'Raffia Festival 2027',
    items: ['About the Festival','Programme','Festival Experiences','Tickets','Packages','Raffia Village','Marketplace','Travel & Stay','FAQs','Festival Updates'],
  },
  'GET INVOLVED': {
    title: 'Be Part of the Legacy',
    items: ['Become a Partner','Sponsor the Festival','Donate','Volunteer','Become a Maker','Schools','Young People','Creatives','Businesses','Media'],
  },
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeTab, onClose, onNavigate, onKeepOpen }) => {
  if (!activeTab) return null;
  const menu = menus[activeTab];

  const clickItem = (item: string) => {
    onClose();
    if (activeTab === 'MARKETPLACE') {
      onNavigate({ type: 'marketplace' });
      return;
    }
    if (activeTab === 'THE PROJECT') {
      const map: Record<string, any> = {
        'About the Project':'about','Our Vision':'vision','The Legacy Year':'legacy-year','Our Programmes':'programmes','Impact':'impact','Partners':'partners'
      };
      if (item === 'The Legacy Year') onNavigate({ type:'legacy_year' });
      else onNavigate({ type:'project', section: map[item] || 'about' });
      return;
    }
    onNavigate({
      type: 'coming_soon',
      title: item,
      subtitle: `${menu.title} — this page is being prepared for the next build phase.`,
    });
  };

  return (
    <div className="mega-menu" onMouseEnter={onKeepOpen}>
      <div className="mega-menu-inner">
        <div className="mega-menu-heading">
          <p className="eyebrow">RAFFIA LEGACY</p>
          <h2>{menu.title}</h2>
          <p>Explore this part of the platform.</p>
        </div>
        <div className="mega-menu-items">
          {menu.items.map((item, index) => (
            <button key={item} onClick={() => clickItem(item)} className="mega-menu-item">
              <span><small>0{index + 1}</small>{item}</span>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
        <div className="mega-menu-note">
          {activeTab === 'MARKETPLACE'
            ? 'SHOP · DISCOVER · COLLECT'
            : 'THE PROJECT · RAFFIA · STORIES · FESTIVAL · PARTICIPATION'}
        </div>
      </div>
    </div>
  );
};
