import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, X } from 'lucide-react';
import { ViewRoute } from '../types';

export type MegaMenuTab = 'THE PROJECT' | 'RAFFIA' | 'EXPLORE' | 'MARKETPLACE' | 'FESTIVAL 2027' | 'GET INVOLVED';

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
    category: 'CULTURE · ENTERPRISE · LEGACY',
    defaultImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
    defaultCaption: 'Connecting traditional knowledge with contemporary fashion, art, design, tourism, technology and enterprise.',
    items: [
      { label: 'About the Project', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', caption: 'The vision, movement, and pan-African cultural platform.' },
      { label: 'Our Vision', image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1200&q=80', caption: 'From palm to product. Culture to commerce.' },
      { label: 'The Legacy Year', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', caption: 'A 12-month program of school initiatives, design challenges, and enterprise incubation.' },
      { label: 'Our Programmes', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80', caption: 'Education, design competitions, and cooperative capacity building.' },
      { label: 'Impact', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80', caption: 'Preserving heritage while generating sustainable economic dignity for artisans.' },
      { label: 'Partners', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', caption: 'Cultural institutions, ethical brands, and community patrons.' },
    ],
  },
  'RAFFIA': {
    title: 'Discover Raffia',
    category: 'BOTANY · HERITAGE · CRAFT',
    defaultImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    defaultCaption: 'Raffia carries history, skill, identity and possibility.',
    items: [
      { label: 'What is Raffia?', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', caption: 'The botany and material properties of Raphia vinifera.' },
      { label: 'Raffia 101', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', caption: 'Harvesting, retting, dyeing, and spinning natural palm fiber.' },
      { label: 'History & Heritage', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80', caption: 'Centuries of West African ceremonial textiles and regalia.' },
      { label: 'Traditional Knowledge', image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80', caption: 'Mathematical pattern memory encoded in upright handlooms.' },
      { label: 'Raffia & Culture', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80', caption: 'Clothing, craft, shelter, dance, ceremony and everyday life.' },
      { label: 'Raffia & Creativity', image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1200&q=80', caption: 'Haute couture, sculptural vessels and contemporary furniture.' },
      { label: 'Raffia & Enterprise', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80', caption: 'Sustainable biomaterials, circular luxury, and fair trade export.' },
      { label: 'Raffia Glossary / Learning Resources', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80', caption: 'Terminology, weaving techniques, and educational guides.' },
    ],
  },
  'EXPLORE': {
    title: 'Explore the Living Movement',
    category: 'PEOPLE · ARCHIVE · STORIES',
    defaultImage: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
    defaultCaption: 'The custodians, artists, master weavers, and innovators weaving the future.',
    items: [
      { label: 'Raffia Stories', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', caption: 'Firsthand accounts from palm wetland harvesters and weavers.' },
      { label: 'People & Makers', image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80', caption: 'Profiles of Ikot Ekpene guilds, Studio Nkem, and riverine collectives.' },
      { label: 'Journal', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', caption: 'Dispatches on African craft renaissance and material innovation.' },
      { label: 'Global Raffia', image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1200&q=80', caption: 'Pan-African and diaspora connections in fibre arts.' },
      { label: 'Archive', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80', caption: 'Historical photographic records, motif catalogs and textile collections.' },
      { label: 'Exhibitions', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80', caption: 'Upcoming pop-up pavilions, biennial showings and gallery installations.' },
      { label: 'Videos', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80', caption: 'Cinematic mini-documentaries on master weavers and dancers.' },
      { label: 'Photo Stories', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80', caption: 'Visual photoessays capturing the wetland harvest and studio life.' },
      { label: 'Opportunities', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', caption: 'Residencies, open calls, grants, and apprentice applications.' },
    ],
  },
  'MARKETPLACE': {
    title: 'The Raffia Marketplace',
    category: 'CURATED CRAFT · CONTEMPORARY EDITIONS',
    defaultImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    defaultCaption: 'Discover products, objects and creative works inspired by raffia heritage.',
    items: [
      { label: 'Shop All', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80', caption: 'Explore the complete curated catalog of hand-woven pieces.' },
      { label: 'Fashion & Accessories', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', caption: 'Bags, clutches, cuffs and wearable fiber pieces.' },
      { label: 'Home & Lifestyle', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80', caption: 'Sculptural vessels, lighting, table textiles and floor mats.' },
      { label: 'Art & Design', image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1200&q=80', caption: 'Numbered fiber tapestries and contemporary sculptural works.' },
      { label: 'Traditional Craft', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', caption: 'Ancestral coiled basketry and heritage ceremonial forms.' },
      { label: 'Gifts', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80', caption: 'Unique handcrafted gifts directly supporting artisan families.' },
      { label: 'Festival Merchandise', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80', caption: 'Limited edition festival collectibles and posters.' },
      { label: 'Meet the Makers', image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80', caption: 'Learn about the cooperative weaving communities behind each piece.' },
      { label: 'Sell With Us', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', caption: 'Onboarding for ethical African craft ateliers and guilds.' },
    ],
  },
  'FESTIVAL 2027': {
    title: 'Raffia Festival 2027',
    category: 'THE FLAGSHIP CULTURAL CELEBRATION',
    defaultImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
    defaultCaption: 'Bringing communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors together.',
    items: [
      { label: 'About the Festival', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80', caption: 'The historic 4-day festival gathering in Akwa Ibom & Cross River.' },
      { label: 'Programme', image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1200&q=80', caption: 'Day-by-day schedule of performances, summits, and exhibitions.' },
      { label: 'Festival Experiences', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80', caption: 'Parade, Fashion Show, Biennale, Dance, Economy Summit, and Village.' },
      { label: 'Tickets & Packages', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', caption: 'Day passes, VIP patron packages and cultural access tickets.' },
      { label: 'Raffia Village', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', caption: 'Hands-on workshops, live loom weaving, and traditional gastronomy.' },
      { label: 'Travel & Stay', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', caption: 'Flight connections, partner hotels and guided riverine itineraries.' },
      { label: 'FAQs & Updates', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80', caption: 'Practical attendee information, registration, and announcements.' },
    ],
  },
  'GET INVOLVED': {
    title: 'Be Part of the Legacy',
    category: 'COMMUNITY · PARTNERSHIP · OPPORTUNITY',
    defaultImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    defaultCaption: 'Partner. Create. Learn. Support. There is a place for you here.',
    items: [
      { label: 'Become a Partner', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', caption: 'Institutional and brand collaborations driving cultural impact.' },
      { label: 'Sponsor the Festival', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80', caption: 'Support festival stages, youth fellowships and artist residencies.' },
      { label: 'Donate & Support', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', caption: 'Contributions directly funding apprentice stipends and mangrove conservation.' },
      { label: 'Volunteer', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80', caption: 'Join the festival production, guest curation and media teams.' },
      { label: 'Become a Maker', image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80', caption: 'Register your guild, workshop, or design studio with the network.' },
      { label: 'Schools & Education', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', caption: 'Engage students with the Discover Raffia curriculum.' },
      { label: 'Young People & Creatives', image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1200&q=80', caption: 'Participate in the Young Raffia Innovators design challenge.' },
      { label: 'Businesses & Media', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80', caption: 'Press inquiries, media accreditation, and procurement partnerships.' },
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
    onNavigate({
      type: 'coming_soon',
      title: itemLabel,
      subtitle: `The ${itemLabel} section is being prepared for the Raffia Legacy launch.`,
    });
  };

  return (
    <div
      className="mega-menu fixed top-[82px] left-0 right-0 z-40 bg-[#241A14] text-[#F3EBDD] border-b border-[#C8A978]/25 shadow-2xl overflow-hidden"
      onMouseEnter={onKeepOpen}
    >
      <div className="max-w-[1560px] mx-auto px-6 lg:px-12 py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Left Side: Navigation Category & Items */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <span className="font-mono text-xs text-[#C8A978] tracking-widest uppercase">
                {menu.category}
              </span>
              <span className="text-[11px] font-mono text-white/50">
                {menu.items.length} SECTIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {menu.items.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => clickItem(item.label)}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group flex items-center justify-between text-left py-2 px-3 rounded-xs hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-[#C8A978]/60 group-hover:text-[#C8A978]">
                      0{index + 1}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all">
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

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
            <span>DANCE VILLE · AFRICAN CULTURAL EVENT & CREATIVE MOVEMENT</span>
            <button
              onClick={() => {
                onClose();
                onNavigate({ type: 'marketplace' });
              }}
              className="text-[#C8A978] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>SHOP MARKETPLACE</span>
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
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Overlay Content */}
          <div className="absolute inset-x-0 bottom-0 p-6 z-10">
            <motion.div
              key={activeHeadline}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[10px] font-mono text-[#C8A978] tracking-widest uppercase block mb-1">
                FEATURED EXPLORATION
              </span>
              <h4 className="text-xl font-bold text-white tracking-tight leading-snug">
                {activeHeadline}
              </h4>
              <p className="text-xs text-white/80 mt-1 leading-relaxed line-clamp-2">
                {activeCaption}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
