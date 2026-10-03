import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { ViewRoute } from '../types';

export type MegaMenuTab = 'THE PROJECT' | 'RAFFIA' | 'EXPLORE' | 'MARKETPLACE' | 'THE FESTIVAL' | 'GET INVOLVED';

interface MegaMenuProps {
  activeTab: MegaMenuTab | null;
  onClose: () => void;
  onNavigate: (route: ViewRoute) => void;
  onKeepOpen?: () => void;
}

interface MenuData {
  title: string;
  category: string;
  defaultImage: string;
  defaultCaption: string;
  items: {
    label: string;
    image?: string;
    caption?: string;
  }[];
}

const MENUS: Record<MegaMenuTab, MenuData> = {
  'THE PROJECT': {
    title: 'The Raffia Legacy Project',
    category: 'CULTURE | CREATIVITY | ENTERPRISE | COMMUNITY',
    defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',
    defaultCaption: 'A year-round of activities celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.',
    items: [
      { label: 'About the Project', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg', caption: 'From palm to product. Culture to commerce. Heritage to opportunity.' },
      { label: 'Our Vision', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG/1280px-Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG', caption: 'Culture, Creativity, Opportunity, Tourism and Legacy.' },
      { label: 'The Legacy Year', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'The festival is only the beginning. Six connected programmes create a continuous journey.' },
      { label: 'Our Programmes', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg', caption: 'School Programme, Young Innovators, Design Challenge, Incubator, Festival and The Next Legacy Year.' },
      { label: 'Why This Matters', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg', caption: 'Create value from what we already have—and open the door to what is possible.' },
      { label: 'Partnerships', image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG', caption: 'There is a place for you in the legacy. We are looking for collaborators, not just cheques.' },
    ],
  },
  'RAFFIA': {
    title: 'Discover Raffia',
    category: 'WHY RAFFIA? · MORE THAN A MATERIAL',
    defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    defaultCaption: 'Raffia is more than a material. It carries history, skill, identity and possibility.',
    items: [
      { label: 'Why Raffia?', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Raffia carries history, skill, identity and possibility.' },
      { label: 'Traditional Knowledge', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Connecting traditional knowledge with contemporary fashion, art, design, tourism, technology and enterprise.' },
      { label: 'Culture & Identity', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Stories, traditions, ceremony, and community identity.' },
      { label: 'Creativity & Performance', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG/1280px-Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG', caption: 'Fashion, art, design, music and performance.' },
      { label: 'Opportunity & Enterprise', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg', caption: 'Skills, markets, investment and enterprise.' },
      { label: 'Tourism & Experiences', image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG', caption: 'Experiences that give people a reason to visit and stay.' },
    ],
  },
  'EXPLORE': {
    title: 'The Raffia Legacy Collection',
    category: 'ARCHIVE · A LIVING RECORD OF RAFFIA',
    defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    defaultCaption: 'What we learn. What we create. What we pass on. Every year should leave something behind.',
    items: [
      { label: 'Cultural Archive', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg', caption: 'Utta performances, oral histories, songs, stories and traditional techniques.' },
      { label: 'Creative Works', image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG', caption: 'Fashion collections, artworks, dance, music, theatre and product designs.' },
      { label: 'Educational Resources', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'School resources, learning materials, workshops and youth training.' },
      { label: 'Commercial Directory', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg', caption: 'New products, prototypes, brands and a directory of businesses and makers.' },
      { label: 'Digital Record', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg', caption: 'Photography, documentaries, artist profiles, artisan stories and digital catalogues.' },
      { label: 'Tourism Packages', image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG', caption: 'Raffia tours, cultural experiences and festival packages.' },
    ],
  },
  'MARKETPLACE': {
    title: 'Raffia Marketplace',
    category: 'BUY · SELL · DISCOVER · CONNECT',
    defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
    defaultCaption: 'Buy, sell, discover and connect with makers and brands.',
    items: [
      { label: 'Shop All Products', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg', caption: 'Explore products, objects and creations.' },
      { label: 'Objects & Living', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg', caption: 'Vessels, table textiles and lifestyle accents.' },
      { label: 'Traditional Craft', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Traditional raffia craft and handmade pieces.' },
      { label: 'Art & Textiles', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG/1280px-Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG', caption: 'Textile panels and woven expressions.' },
      { label: 'Makers & Brands', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Connect directly with artisans, designers and creators.' },
    ],
  },
  'THE FESTIVAL': {
    title: 'The Raffia Festival',
    category: 'THE HEART OF THE LEGACY · COMING SOON',
    defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    defaultCaption: 'The flagship event bringing communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors together.',
    items: [
      { label: 'The Flagship Event', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'A celebration of what raffia can inspire.' },
      { label: 'Raffia Parade', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'A colourful public celebration of culture and creativity.' },
      { label: 'Raffia Economy Summit', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg', caption: 'Conversations around business, investment, policy, innovation and opportunity.' },
      { label: 'Innovation Lab', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Explore what raffia could become next.' },
      { label: 'Art & Design Biennale', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg', caption: 'New ideas, new materials and creative interpretations of raffia.' },
      { label: 'Fashion Show', image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG', caption: 'Where traditional techniques meet contemporary fashion.' },
      { label: 'Dance & Performance', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg', caption: 'Utta, traditional performance and contemporary expression.' },
      { label: 'Raffia Village', image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG', caption: 'Step into the world of raffia—from palm to craft.' },
    ],
  },
  'GET INVOLVED': {
    title: 'There is a Place for You',
    category: 'PARTNERSHIP & SPONSORSHIP OPPORTUNITIES',
    defaultImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
    defaultCaption: 'We welcome partners who want to help build something meaningful. We are looking for collaborators, not just cheques.',
    items: [
      { label: 'Festival Sponsors', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Support the flagship Raffia Festival and connect your brand with culture and community.' },
      { label: 'Programme Sponsors', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Support School Programmes, Innovators, Design Challenge, Summit and Workshops.' },
      { label: 'Legacy Partners', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg', caption: 'Support the year-round ecosystem: Academy, Lab, Market, Research and Network.' },
      { label: 'Knowledge Partners', image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG', caption: 'Bring expertise, research, training, technology or mentorship.' },
      { label: 'Media & Creative Partners', image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG', caption: 'Help tell the story through film, photography, publishing and storytelling.' },
      { label: 'Tourism & Destination Partners', image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG', caption: 'Help develop experiences that bring visitors into the world of raffia.' },
    ],
  },
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeTab, onClose, onNavigate, onKeepOpen }) => {
  if (!activeTab) return null;
  const menu = MENUS[activeTab];

  const [hoveredItem, setHoveredItem] = useState<{ label: string; image?: string; caption?: string } | null>(null);

  const activeImage = hoveredItem?.image || menu.defaultImage;
  const activeCaption = hoveredItem?.caption || menu.defaultCaption;
  const activeHeadline = hoveredItem?.label || menu.title;

  const clickItem = (itemLabel: string) => {
    onClose();
    if (activeTab === 'MARKETPLACE') {
      onNavigate({ type: 'marketplace' });
      return;
    }
    if (activeTab === 'THE PROJECT') {
      onNavigate({ type: 'project' });
      return;
    }
    if (activeTab === 'THE FESTIVAL') {
      onNavigate({ type: 'festival' });
      return;
    }
    if (activeTab === 'RAFFIA') {
      onNavigate({ type: 'raffia' });
      return;
    }
    if (activeTab === 'EXPLORE') {
      onNavigate({ type: 'raffia' });
      return;
    }
    if (activeTab === 'GET INVOLVED') {
      onNavigate({ type: 'get_involved', section: 'partner' });
      return;
    }
    onNavigate({
      type: 'coming_soon',
      title: itemLabel,
      subtitle: 'This section is being prepared as part of the Raffia Legacy Project.',
    });
  };

  return (
    <div className="mega-menu" onMouseEnter={onKeepOpen}>
      <div className="mega-menu-inner">
        {/* Left Side: Directory Navigation */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="mega-menu-heading mb-6 pb-4 border-b border-white/10">
              <span className="text-xs font-mono text-[#C8A978] uppercase tracking-widest block mb-1 font-semibold">
                {menu.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {menu.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {menu.items.map((item) => (
                <button
                  key={item.label}
                  onMouseEnter={() => setHoveredItem(item)}
                  onClick={() => clickItem(item.label)}
                  className="group flex items-center justify-between text-left py-2 px-3 border border-transparent hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer rounded-xs"
                >
                  <div>
                    <span className="text-xs sm:text-sm font-sans font-bold text-white/90 group-hover:text-white transition-colors block">
                      {item.label}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="text-white/30 group-hover:text-[#C8A978] opacity-0 group-hover:opacity-100 transition-all"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60 mt-6">
            <span>DANCE VILLE · RAFFIA LEGACY PROJECT</span>
            <button
              onClick={() => {
                onClose();
                onNavigate({ type: 'marketplace' });
              }}
              className="text-[#C8A978] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>RAFFIA MARKETPLACE</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right Side: Large Contextual Image Showcase */}
        <div className="lg:col-span-5 relative hidden lg:block rounded-xs overflow-hidden border border-white/10 min-h-[380px] bg-[#11100E]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img
                src={activeImage}
                alt={activeHeadline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-[0.88]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-0 p-6 z-10">
            <motion.div
              key={activeHeadline}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xs font-mono text-[#C8A978] tracking-widest uppercase block mb-1 font-semibold">
                RAFFIA LEGACY PROJECT
              </span>
              <h4 className="text-xl font-bold text-white tracking-tight leading-snug font-sans">
                {activeHeadline}
              </h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed line-clamp-2 font-sans">
                {activeCaption}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
