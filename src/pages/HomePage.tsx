import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, ChevronRight, Maximize2, MapPin } from 'lucide-react';
import { ViewRoute, Product } from '../types';
import { useMarketplaceData } from '../context/MarketplaceDataContext';
import { MAKERS } from '../data/makers';
import { InteractiveHeroGallery, HeroSlide } from '../components/InteractiveHeroGallery';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickView } from '../components/ProductQuickView';
import { MotionReveal } from '../components/MotionReveal';
import { ImageLightbox, LightboxImage } from '../components/ImageLightbox';

interface HomePageProps {
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const launch = new Date('2026-10-29T00:00:00+01:00');

// 04. THE PROJECT - 5 Vision Pillars from PDF Page 2
const PROJECT_CATEGORIES = [
  {
    id: 'culture',
    title: 'CULTURE',
    tagline: 'Stories, traditions and identity.',
    description: 'Stories, traditions and identity.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
  },
  {
    id: 'creativity',
    title: 'CREATIVITY',
    tagline: 'Fashion, art, design, music and performance.',
    description: 'Fashion, art, design, music and performance.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',
  },
  {
    id: 'opportunity',
    title: 'OPPORTUNITY',
    tagline: 'Skills, markets, investment and enterprise.',
    description: 'Skills, markets, investment and enterprise.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
  },
  {
    id: 'tourism',
    title: 'TOURISM',
    tagline: 'Experiences that give people a reason to visit and stay.',
    description: 'Experiences that give people a reason to visit and stay.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG',
  },
  {
    id: 'legacy',
    title: 'LEGACY',
    tagline: 'Knowledge and opportunities passed from one generation to the next.',
    description: 'Knowledge and opportunities passed from one generation to the next.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
  },
];

// 05. LEGACY YEAR - 6 Programmes from PDF Page 4
const LEGACY_STAGES = [
  {
    title: 'DISCOVER',
    subtitle: 'Raffia School Programme',
    desc: 'Children discover raffia, heritage, craft, Utta, music, storytelling, nature and creativity.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    timeframe: 'PROGRAMME 01',
  },
  {
    title: 'IMAGINE',
    subtitle: 'Young Raffia Innovators',
    desc: 'Young people ask: "What can raffia become in the future?"',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG',
    timeframe: 'PROGRAMME 02',
  },
  {
    title: 'CREATE',
    subtitle: 'Raffia Design Challenge',
    desc: 'Artisans, designers and creatives turn heritage into new products, fashion, art, performance and design.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',
    timeframe: 'PROGRAMME 03',
  },
  {
    title: 'BUILD',
    subtitle: 'Raffia Business Incubator',
    desc: 'Strong ideas become products, businesses, partnerships and livelihoods.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
    timeframe: 'PROGRAMME 04',
  },
  {
    title: 'CELEBRATE',
    subtitle: 'Raffia Festival',
    desc: 'The community and the world experience the culture, creativity, products and opportunities created throughout the year.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    timeframe: 'PROGRAMME 05',
  },
  {
    title: 'PASS IT ON',
    subtitle: 'The Next Legacy Year',
    desc: 'New students, artisans, designers and entrepreneurs enter the ecosystem. The cycle continues.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',
    timeframe: 'PROGRAMME 06',
  },
];

// 08. FESTIVAL - 8 Experiences from PDF Page 3
const FESTIVAL_EVENTS = [
  {
    title: 'RAFFIA PARADE',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    summary: 'A colourful public celebration of culture and creativity.',
    category: 'CELEBRATION',
  },
  {
    title: 'RAFFIA ECONOMY SUMMIT',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
    summary: 'Conversations around business, investment, policy, innovation and opportunity.',
    category: 'BUSINESS & POLICY',
  },
  {
    title: 'INNOVATION LAB',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    summary: 'Explore what raffia could become next.',
    category: 'INNOVATION',
  },
  {
    title: 'ART & DESIGN BIENNALE',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
    summary: 'New ideas, new materials and creative interpretations of raffia.',
    category: 'ART & DESIGN',
  },
  {
    title: 'FASHION SHOW',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',
    summary: 'Where traditional techniques meet contemporary fashion.',
    category: 'FASHION',
  },
  {
    title: 'DANCE & PERFORMANCE',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
    summary: 'Utta, traditional performance and contemporary expression.',
    category: 'PERFORMANCE',
  },
  {
    title: 'RAFFIA MARKETPLACE',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',
    summary: 'Buy, sell, discover and connect with makers and brands.',
    category: 'MARKETPLACE',
  },
  {
    title: 'RAFFIA VILLAGE',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG',
    summary: 'Step into the world of raffia—from palm to craft.',
    category: 'CULTURAL EXPERIENCE',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const [remaining, setRemaining] = useState(launch.getTime() - Date.now());
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activePillarWord, setActivePillarWord] = useState<string>('HISTORY');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, launch.getTime() - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const marketplacePreview = PRODUCTS.slice(0, 3);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentProjectPillar = PROJECT_CATEGORIES[activeProjectIdx];

  const pillarDetails: Record<string, { desc: string }> = {
    HISTORY: { desc: 'Carrying history across generations of African heritage.' },
    SKILL: { desc: 'Traditional craft knowledge, weaving techniques and hand mastery.' },
    IDENTITY: { desc: 'Stories, traditions, ceremony, and community belonging.' },
    POSSIBILITY: { desc: 'Opening the door to what is possible through sustainable creativity.' },
  };

  return (
    <div className="home-event-root bg-[#F3EBDD] text-[#11100E] overflow-hidden">
      {/* & 02. HERO */}
      <InteractiveHeroGallery
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onExploreLegacy={() => scrollToSection('why-raffia')}
        onShopCollection={() => onNavigate({ type: 'marketplace' })}
        onInspectImage={(slide: HeroSlide) =>
          setLightboxImage({
            src: slide.image,
            title: slide.title,
            subtitle: slide.caption,
            category: slide.theme,
          })
        }
      />

      {/* WHY RAFFIA? (PDF Page 2) */}
      <section id="why-raffia" className="py-24 sm:py-32 px-6 lg:px-12 bg-[#F3EBDD] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image composition */}
          <div className="lg:col-span-7 relative">
            <MotionReveal direction="none">
              <div
                onClick={() =>
                  setLightboxImage({
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
                    title: 'Traditional Raffia Weaving',
                    subtitle: 'Connecting traditional knowledge with contemporary practice.',
                    category: 'HERITAGE CRAFT',
                  })
                }
                className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden shadow-2xl bg-[#EAE1D1] group cursor-pointer border border-[#241A14]/15"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg"
                  alt="Artisan working with raffia fibre"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/85 via-transparent to-transparent" />

                <div className="absolute top-4 right-4 p-2 bg-[#11100E]/70 hover:bg-[#B65332] text-white transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100 z-10 flex items-center gap-1.5 text-sm font-sans">
                  <Maximize2 size={14} />
                  <span>INSPECT</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                  <div>
                    <span className="text-sm font-sans tracking-widest text-[#C8A978] uppercase block mb-1">
                      TRADITIONAL KNOWLEDGE IN MOTION
                    </span>
                    <p className="text-base sm:text-lg font-bold font-sans">
                      Raffia Weaving Heritage
                    </p>
                  </div>
                </div>
              </div>

            </MotionReveal>
          </div>

          {/* Copy strictly from PDF Page 2 */}
          <div className="lg:col-span-5 space-y-6">
            <MotionReveal direction="up">
              <span className="font-sans text-xs tracking-[0.2em] text-[#B65332] uppercase font-bold block mb-2">
                THE BIG IDEA
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11100E] leading-[1.08]">
                WHY RAFFIA?<br />
                <span className="text-[#B65332] font-serif italic font-normal">MORE THAN A MATERIAL.</span>
              </h2>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.15}>
              <p className="text-lg sm:text-xl text-[#241A14] font-medium leading-relaxed font-sans">
                Raffia is more than a material. It carries history, skill, identity and possibility.
              </p>
              <p className="text-sm sm:text-base text-[#73695E] leading-relaxed mt-3 font-sans">
                For generations, people have used raffia for clothing, craft, shelter, dance, ceremony and everyday life. Today, we can take that knowledge further.
              </p>
              <p className="text-sm sm:text-base text-[#73695E] leading-relaxed mt-2 font-sans">
                The Raffia Legacy Project connects traditional knowledge with contemporary fashion, art, design, tourism, technology and enterprise.
              </p>
            </MotionReveal>

            {/* 4 Supported Words from PDF: HISTORY, SKILL, IDENTITY, POSSIBILITY */}
            <MotionReveal direction="up" delay={0.25}>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#241A14]/15">
                {['HISTORY', 'SKILL', 'IDENTITY', 'POSSIBILITY'].map((word) => {
                  const isSelected = activePillarWord === word;
                  return (
                    <button
                      key={word}
                      onClick={() => setActivePillarWord(word)}
                      className={`p-3.5 text-left border-l-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#241A14] text-white border-[#C8A978] shadow-md'
                          : 'bg-[#EAE1D1]/70 border-[#B65332] text-[#11100E] hover:bg-[#EAE1D1]'
                      }`}
                    >
                      <b
                        className={`font-sans text-xs sm:text-sm font-bold tracking-wider block ${
                          isSelected ? 'text-[#C8A978]' : 'text-[#11100E]'
                        }`}
                      >
                        {word}
                      </b>
                      <span
                        className={`text-xs leading-tight block mt-0.5 font-sans ${
                          isSelected ? 'text-white/80' : 'text-[#73695E]'
                        }`}
                      >
                        {pillarDetails[word]?.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.35}>
              <button
                onClick={() => scrollToSection('the-project')}
                className="button bg-[#241A14] text-white hover:bg-[#B65332] px-7 py-4 text-sm font-sans tracking-wider uppercase font-bold cursor-pointer transition-all flex items-center gap-2 mt-4"
              >
                <span>OUR VISION</span>
                <ArrowRight size={16} />
              </button>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* THE PROJECT: OUR VISION (PDF Page 2) */}
      <section id="the-project" className="py-24 sm:py-32 px-6 lg:px-12 bg-[#241A14] text-[#F3EBDD] border-b border-white/10">
        <div className="max-w-[1560px] mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-8">
            <MotionReveal direction="up">
              <span className="font-sans text-xs tracking-widest text-[#C8A978] uppercase block mb-2 font-bold">
                OUR VISION
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                FROM PALM TO PRODUCT.<br />
                <span className="text-[#C8A978] font-serif italic font-normal">CULTURE TO COMMERCE.</span>
              </h2>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.15}>
              <p className="max-w-md text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                To build a lasting platform that helps transform raffia heritage into culture, creativity, opportunity, tourism and legacy.
              </p>
            </MotionReveal>
          </div>

          {/* Interactive Visual Sequence: 5 Pillars from PDF Page 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Pillar Buttons */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              {PROJECT_CATEGORIES.map((cat, idx) => {
                const isActive = activeProjectIdx === idx;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveProjectIdx(idx)}
                    onMouseEnter={() => setActiveProjectIdx(idx)}
                    className={`group text-left p-5 transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-white/10 border-[#C8A978] text-white shadow-xl'
                        : 'bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-end mb-1">
                      <ArrowUpRight
                        size={16}
                        className={`transition-all ${
                          isActive ? 'text-[#C8A978] translate-x-0.5 -translate-y-0.5' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#C8A978] font-sans mt-0.5">
                      {cat.tagline}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Display */}
            <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[520px] overflow-hidden border border-white/15 bg-[#11100E] group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProjectPillar.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentProjectPillar.image}
                    alt={currentProjectPillar.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/40 to-transparent" />

                  <button
                    onClick={() =>
                      setLightboxImage({
                        src: currentProjectPillar.image,
                        title: currentProjectPillar.title,
                        subtitle: currentProjectPillar.tagline,
                        category: currentProjectPillar.title,
                      })
                    }
                    className="absolute top-6 right-6 p-2.5 bg-black/60 hover:bg-[#B65332] text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-sans z-20"
                    title="Inspect photo"
                  >
                    <Maximize2 size={15} />
                    <span className="hidden sm:inline">VIEW FULL</span>
                  </button>

                  <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                    <span className="font-sans text-xs text-[#C8A978] tracking-widest uppercase block mb-1 font-bold">
                      {currentProjectPillar.title}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
                      {currentProjectPillar.tagline}
                    </h4>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* LEGACY YEAR: THE 6 PROGRAMMES (PDF Page 4) */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto space-y-12">
          {/* Header strictly from PDF Page 4 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <MotionReveal direction="up">
              <span className="font-sans text-sm tracking-widest text-[#B65332] uppercase font-bold block mb-3">
                THE LEGACY YEAR
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11100E]">
                THE FESTIVAL<br />
                <span className="text-[#B65332] font-serif italic font-normal">IS ONLY THE BEGINNING.</span>
              </h2>
            </MotionReveal>
            <MotionReveal direction="up" delay={0.15}>
              <p className="max-w-md text-sm sm:text-base text-[#73695E] leading-relaxed font-sans">
                The strongest part of the Raffia Legacy Project is what happens before and after the festival. Six connected programmes create a continuous journey.
              </p>
            </MotionReveal>
          </div>

          {/* 6 Programmes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {LEGACY_STAGES.map((st) => (
              <motion.div
                key={st.subtitle}
                whileHover={{ y: -6 }}
                onClick={() =>
                  setLightboxImage({
                    src: st.image,
                    title: st.subtitle,
                    subtitle: st.desc,
                    category: `THE LEGACY YEAR`,
                  })
                }
                className="group bg-[#F3EBDD] border border-[#241A14]/15 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#DDD4C5]">
                  <img
                    src={st.image}
                    alt={st.subtitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <b className="font-sans text-xs tracking-widest text-[#B65332] uppercase block mb-1">
                      {st.title}
                    </b>
                    <h4 className="text-base font-bold text-[#11100E] leading-snug mb-2 font-sans">
                      {st.subtitle}
                    </h4>
                    <p className="text-sm text-[#73695E] leading-relaxed font-sans">
                      {st.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#241A14]/10 flex items-center justify-end text-sm font-sans text-[#B65332] font-semibold">
                    <span className="flex items-center gap-1">EXPLORE <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" /></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY & VALUE CREATION (PDF Page 3 & 6) */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#F3EBDD] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto space-y-12">
          {/* Header strictly from PDF Page 3 & 6 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <MotionReveal direction="up">
              <span className="font-sans text-sm tracking-widest text-[#B65332] uppercase font-bold block mb-3">
                VALUE CREATION
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11100E] leading-[1.08]">
                THE LEGACY<br />
                <span className="text-[#B65332] font-serif italic font-normal">WE WANT TO CREATE.</span>
              </h2>
            </MotionReveal>
            <MotionReveal direction="up" delay={0.15}>
              <p className="max-w-md text-sm sm:text-base text-[#73695E] leading-relaxed font-sans">
                The Raffia Legacy Project is designed to create value at many levels—for young people, artisans, farmers, creatives, businesses, the community, the host destination, and the wider economy.
              </p>
            </MotionReveal>
          </div>

          {/* 8 Value Levels from PDF Page 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {[
              { title: 'FOR YOUNG PEOPLE', desc: 'Skills, confidence, creativity and new opportunities.' },
              { title: 'FOR ARTISANS', desc: 'Visibility, new markets, skills and better access to customers.' },
              { title: 'FOR FARMERS', desc: 'New conversations around the value and future of raffia.' },
              { title: 'FOR CREATIVES', desc: 'A platform to experiment, collaborate and reach new audiences.' },
              { title: 'FOR BUSINESSES', desc: 'New products, customers, partnerships and markets.' },
              { title: 'FOR THE COMMUNITY', desc: 'Pride, participation, opportunity and stronger connections.' },
              { title: 'FOR THE HOST DESTINATION', desc: 'A distinctive cultural identity and a reason for people to visit.' },
              { title: 'FOR THE WIDER ECONOMY', desc: 'A chance to turn indigenous knowledge and materials into sustainable creative enterprise.' },
            ].map((v) => (
              <div key={v.title} className="p-5 bg-[#EAE1D1] border border-[#241A14]/15 flex flex-col justify-between">
                <div>
                  <h4 className="font-sans text-sm font-bold text-[#11100E] mb-2">{v.title}</h4>
                  <p className="text-xs text-[#73695E] font-sans leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#241A14] text-[#F3EBDD] text-center border border-[#C8A978]/30">
            <p className="font-sans text-xs uppercase tracking-widest text-[#C8A978] mb-1 font-bold">THE GOAL IS SIMPLE</p>
            <p className="font-editorial text-xl sm:text-2xl font-light">
              Create value from what we already have—and open the door to what is possible.
            </p>
          </div>
        </div>
      </section>

      {/* MARKETPLACE PREVIEW */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <MotionReveal direction="up">
              <span className="font-sans text-sm tracking-widest text-[#B65332] uppercase font-bold block mb-3">
                RAFFIA MARKETPLACE
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11100E] leading-[1.08]">
                BUY, SELL, DISCOVER<br />
                <span className="text-[#B65332] font-serif italic font-normal">& CONNECT.</span>
              </h2>
            </MotionReveal>
            <MotionReveal direction="up" delay={0.15}>
              <button
                onClick={() => onNavigate({ type: 'marketplace' })}
                className="button bg-[#241A14] text-white hover:bg-[#B65332] px-7 py-4 text-sm font-sans tracking-wider uppercase font-bold cursor-pointer transition-all flex items-center gap-2"
              >
                <span>EXPLORE MARKETPLACE</span>
                <ArrowRight size={16} />
              </button>
            </MotionReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {marketplacePreview.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(slug) => onSelectProduct(slug)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* THE RAFFIA FESTIVAL (PDF Page 3) */}
      <section className="relative py-28 sm:py-36 px-6 lg:px-12 overflow-hidden bg-[#11100E] text-white dark-section">
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg"
            alt="Festival Atmosphere"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/85 to-[#11100E]" />
        </div>

        <div className="relative z-10 max-w-[1560px] mx-auto space-y-16">
          {/* Header strictly from PDF Page 3 */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/15 pb-12">
            <div>
              <span className="font-sans text-xs tracking-[0.25em] text-[#C8A978] uppercase block mb-3 font-bold">
                THE HEART OF THE LEGACY
              </span>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white">
                THE RAFFIA<br />
                <span className="text-[#B65332]">FESTIVAL</span><br />
                <span className="font-serif italic font-normal text-[#C8A978]">IKOT EKPENE LGA</span>
              </h2>
            </div>

            <div className="max-w-lg space-y-4">
              <p className="text-base sm:text-lg text-white/85 leading-relaxed font-sans">
                The Raffia Festival is the flagship event of the entire project. It brings together communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors for a celebration of what raffia can inspire.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate({ type: 'festival' })}
                  className="button bg-[#B65332] text-white hover:bg-white hover:text-[#11100E] font-bold px-8 py-4 text-sm font-sans tracking-wider uppercase cursor-pointer transition-all"
                >
                  <span>FESTIVAL DETAILS</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 8 Experiences from PDF Page 3 */}
          <div>
            <div className="flex items-center justify-between text-sm font-sans text-[#C8A978] uppercase tracking-wider mb-6">
              <span>ONE FESTIVAL. MANY WORLDS OF RAFFIA.</span>
              <span className="text-white/50">8 EXPERIENCES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FESTIVAL_EVENTS.map((ev, i) => (
                <div
                  key={ev.title}
                  onClick={() =>
                    setLightboxImage({
                      src: ev.image,
                      title: ev.title,
                      subtitle: ev.summary,
                      category: 'RAFFIA FESTIVAL',
                    })
                  }
                  className="group relative overflow-hidden bg-[#241A14] border border-white/10 p-6 min-h-[220px] flex flex-col justify-between hover:border-[#C8A978] transition-all cursor-pointer shadow-md"
                >
                  <img
                    src={ev.image}
                    alt={ev.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/70 to-transparent" />
                  <div className="relative z-10 flex items-center justify-between text-sm font-sans text-[#C8A978]">
                    
                    <Maximize2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#C8A978] transition-colors font-sans">
                      {ev.title}
                    </h3>
                    <p className="text-sm text-white/75 line-clamp-3 mt-2 font-sans leading-relaxed">
                      {ev.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP OPPORTUNITIES (PDF Page 7 & 8) */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#F3EBDD] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto space-y-12">
          <div className="space-y-4 max-w-3xl">
            <span className="font-sans text-sm tracking-widest text-[#B65332] uppercase font-bold block">
              PARTNERSHIP OPPORTUNITIES
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#11100E] leading-[1.05]">
              THERE IS A PLACE<br />
              <span className="text-[#B65332] font-serif italic font-normal">FOR YOU IN THE LEGACY.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#73695E] leading-relaxed font-sans">
              We welcome partners who want to help build something meaningful. We are looking for collaborators, not just cheques.
            </p>
          </div>

          {/* 6 Partner Categories strictly from PDF Page 7 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'FESTIVAL SPONSORS',
                desc: 'Support the flagship Raffia Festival and connect your brand with culture, creativity, community and innovation.',
              },
              {
                title: 'PROGRAMME SPONSORS',
                desc: 'Support a specific area such as the School Programme, Innovators, Design Challenge, Fashion Show, Biennale, Dance, Lab, Summit, Marketplace or Youth Programmes.',
              },
              {
                title: 'LEGACY PARTNERS',
                desc: 'Support the year-round ecosystem and help us build the Raffia Academy, Lab, Market, Experiences, Research and Network.',
              },
              {
                title: 'KNOWLEDGE PARTNERS',
                desc: 'Bring expertise, research, training, technology or mentorship.',
              },
              {
                title: 'MEDIA & CREATIVE PARTNERS',
                desc: 'Help tell the story through film, photography, publishing, digital media and storytelling.',
              },
              {
                title: 'TOURISM & DESTINATION PARTNERS',
                desc: 'Help develop experiences that bring visitors into the world of raffia.',
              },
            ].map((p) => (
              <div key={p.title} className="p-6 bg-[#EAE1D1] border border-[#241A14]/15 flex flex-col justify-between">
                <div>
                  
                  <h4 className="font-sans text-base font-bold text-[#11100E] mb-3">{p.title}</h4>
                  <p className="text-sm text-[#73695E] font-sans leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PDF Page 8: Ways to give */}
          <div className="p-5 bg-[#241A14] text-[#C8A978] font-sans text-sm text-center font-bold tracking-wider">
            DONATE • SPONSOR AN ACTIVITY • GIVE IN-KIND • VOLUNTEER • SHARE YOUR EXPERTISE
          </div>
        </div>
      </section>

      {/* 10. THE INVITATION & CLOSING (PDF Page 9) */}
      <section className="relative py-32 sm:py-44 px-6 text-center overflow-hidden bg-[#11100E] text-white dark-section">
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg"
            alt="Raffia texture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/90 to-[#11100E]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <p className="font-sans text-xs sm:text-sm tracking-[0.25em] text-[#C8A978] uppercase font-bold">
            THE INVITATION
          </p>
          <div className="max-w-2xl mx-auto text-base sm:text-lg text-white/85 leading-relaxed font-sans space-y-3 py-5 border-y border-white/10">
            <p>Imagine a child discovering raffia for the first time.</p>
            <p>They learn the craft. They discover Utta. They make something.</p>
            <p>A young designer sees a new possibility. An artisan shares knowledge.</p>
            <p>Together, they create.</p>
            <p>Their work reaches the festival. A visitor discovers it. A buyer sees an opportunity.</p>
            <p>An entrepreneur builds a business. And the next generation learns from them.</p>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            THAT IS THE LEGACY.<br />
            <span className="text-white font-serif italic font-normal text-2xl sm:text-4xl block mt-2">
              RAFFIA IS OUR THREAD. THE FUTURE IS WHAT WE WEAVE WITH IT.
            </span>
          </h2>
          <div className="pt-4 flex flex-wrap justify-center gap-4 text-sm font-sans">
            <button
              onClick={() => onNavigate({ type: 'project' })}
              className="button bg-[#B65332] text-white hover:bg-white hover:text-[#11100E] px-8 py-4 font-bold tracking-wider uppercase cursor-pointer transition-all"
            >
              ABOUT THE PROJECT
            </button>
            <button
              onClick={() => onNavigate({ type: 'marketplace' })}
              className="button bg-transparent border border-white/40 text-white hover:bg-white hover:text-[#11100E] px-8 py-4 font-bold tracking-wider uppercase cursor-pointer transition-all"
            >
              RAFFIA MARKETPLACE
            </button>
          </div>
        </div>
      </section>

      {/* MODAL: Product Quick View */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onViewFullDetail={(slug) => {
            setQuickViewProduct(null);
            onSelectProduct(slug);
          }}
        />
      )}

      {/* MODAL: Image Lightbox */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};