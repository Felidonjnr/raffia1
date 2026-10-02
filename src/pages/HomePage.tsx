import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, Sparkles, ChevronRight, X, Heart, Eye } from 'lucide-react';
import { ViewRoute, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { MAKERS } from '../data/makers';
import { InteractiveHeroGallery } from '../components/InteractiveHeroGallery';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickView } from '../components/ProductQuickView';
import { MotionReveal } from '../components/MotionReveal';

interface HomePageProps {
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const launch = new Date('2026-10-29T18:00:00+01:00');

// 04. THE PROJECT - 5 Interactive Categories
const PROJECT_CATEGORIES = [
  {
    id: 'culture',
    title: 'CULTURE',
    tagline: 'Living Heritage & Ceremonial Roots',
    description: 'Ancestral masquerades, ritual regalia, and community weaving traditions passed down across West African riverine cultures.',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'creativity',
    title: 'CREATIVITY',
    tagline: 'Haute Couture & Avant-Garde Expression',
    description: 'Collaborating with visionary fashion houses, sculptural artists, and architects who use raffia as a cutting-edge medium.',
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'opportunity',
    title: 'OPPORTUNITY',
    tagline: 'Fair-Trade Value & Generational Enterprise',
    description: 'Direct market sovereignty, guild apprenticeships, and cooperative economic models that ensure artisans thrive.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'tourism',
    title: 'TOURISM',
    tagline: 'Riverine Immersion & Living Ateliers',
    description: 'Inviting visitors to touch the source through curated palm grove walking trails, masterclasses, and festival journeys.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'legacy',
    title: 'LEGACY',
    tagline: 'Knowledge Transferred Generation to Generation',
    description: 'Curriculum integrations, young innovators fellowships, and permanent craft endowments keeping the lineage alive.',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1400&q=85',
  },
];

// 05. LEGACY YEAR - 6 Stages
const LEGACY_STAGES = [
  {
    step: '01',
    title: 'DISCOVER',
    subtitle: 'Raffia in Schools',
    desc: 'Introducing children to the botany of palms and geometric weaving traditions.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    step: '02',
    title: 'IMAGINE',
    subtitle: 'Young Raffia Innovators',
    desc: 'Convening emerging designers to prototype sustainable biomaterials and packaging.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  },
  {
    step: '03',
    title: 'CREATE',
    subtitle: 'Raffia Design Challenge',
    desc: 'Pairing master weavers with contemporary labels to craft capsule collections.',
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=800&q=80',
  },
  {
    step: '04',
    title: 'BUILD',
    subtitle: 'Raffia Business Incubator',
    desc: 'Equipping rural cooperative workshops with digital tools and fair-trade standards.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },
  {
    step: '05',
    title: 'CELEBRATE',
    subtitle: 'Raffia Festival',
    desc: 'The historic physical culmination gathering creators, buyers, and performers.',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
  },
  {
    step: '06',
    title: 'PASS IT ON',
    subtitle: 'Next Legacy Year',
    desc: 'Reinvesting marketplace proceeds into permanent community craft infrastructure.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  },
];

// 08. FESTIVAL 2027 - 8 Experiences
const FESTIVAL_EVENTS = [
  { id: '01', title: 'RAFFIA PARADE', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80', summary: 'Grand procession of traditional masquerade societies and colossal woven regalia.' },
  { id: '02', title: 'FASHION SHOW', image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=900&q=80', summary: 'Haute-couture runway showcasing experimental Pan-African designers.' },
  { id: '03', title: 'DANCE & PERFORMANCE', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80', summary: 'Percussive master drummers, ceremonial choreography, and acoustic fibre instruments.' },
  { id: '04', title: 'ART & DESIGN BIENNALE', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80', summary: 'Sculptural installations, architectural pavilions, and site-specific commissions.' },
  { id: '05', title: 'INNOVATION LAB', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80', summary: 'Bio-materials, carbon-neutral architecture, and circular bast fiber technology.' },
  { id: '06', title: 'ECONOMY SUMMIT', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80', summary: 'Trade ministers, investors, and guild elders shaping sustainable creative export.' },
  { id: '07', title: 'RAFFIA MARKETPLACE', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80', summary: 'Curated trading pavilions with direct artisan authentication.' },
  { id: '08', title: 'RAFFIA VILLAGE', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80', summary: 'Hands-on masterclass workshops, natural clay dyeing, and palm culinary heritage.' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const [remaining, setRemaining] = useState(launch.getTime() - Date.now());
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activeFestivalIdx, setActiveFestivalIdx] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, launch.getTime() - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Real curated products from source data
  const marketplacePreview = PRODUCTS.slice(0, 3);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentProjectPillar = PROJECT_CATEGORIES[activeProjectIdx];

  return (
    <div className="home-event-root bg-[#F3EBDD] text-[#11100E] overflow-hidden">
      {/* ========================================================================= */}
      {/* 01. & 02. HERO: FULL-VIEWPORT CINEMATIC EVENT HERO                        */}
      {/* ========================================================================= */}
      <InteractiveHeroGallery
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onExploreLegacy={() => scrollToSection('why-raffia')}
        onShopCollection={() => onNavigate({ type: 'marketplace' })}
      />

      {/* ========================================================================= */}
      {/* 03. WHY RAFFIA: IMAGE-LED EDITORIAL COMPOSITION                           */}
      {/* ========================================================================= */}
      <section id="why-raffia" className="py-24 sm:py-32 px-6 lg:px-12 bg-[#F3EBDD] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Large Image occupying major portion of viewport */}
          <div className="lg:col-span-7">
            <MotionReveal direction="none">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden shadow-2xl bg-[#EAE1D1] group">
                <img
                  src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1600&q=85"
                  alt="African artisan working with natural raffia fibre"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/75 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#C8A978] uppercase block mb-1">
                      ANCESTRAL CRAFT IN MOTION
                    </span>
                    <p className="text-base sm:text-lg font-bold font-sans">
                      Master Weaver at the Upright Loom
                    </p>
                  </div>
                  <span className="text-xs font-mono text-white/70 hidden sm:inline">
                    IKOT EKPENE, NIGERIA
                  </span>
                </div>
              </div>
            </MotionReveal>
          </div>

          {/* Beside It: Editorial Copy with 4 Visual Words */}
          <div className="lg:col-span-5 space-y-6">
            <MotionReveal direction="up">
              <span className="font-mono text-xs tracking-[0.2em] text-[#B65332] uppercase font-bold block mb-2">
                THE LIVING FIBRE
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11100E] leading-[1.08]">
                MORE THAN<br />
                <span className="text-[#B65332] font-serif italic font-normal">A MATERIAL.</span>
              </h2>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.15}>
              <p className="text-lg sm:text-xl text-[#241A14] font-medium leading-relaxed">
                Raffia carries history, skill, identity and possibility.
              </p>
              <p className="text-sm sm:text-base text-[#73695E] leading-relaxed mt-3">
                Used across generations for clothing, craft, shelter, dance, ceremony and everyday life, raffia is a living thread connecting African heritage with contemporary cultural innovation.
              </p>
            </MotionReveal>

            {/* 4 Strong Visual Words */}
            <MotionReveal direction="up" delay={0.25}>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#241A14]/15">
                {[
                  { word: 'HISTORY', desc: 'Centuries of West African ceremonial textiles and regalia' },
                  { word: 'SKILL', desc: 'Mathematical pattern memory encoded in handlooms' },
                  { word: 'IDENTITY', desc: 'Sacred masquerade, dance, and community belonging' },
                  { word: 'POSSIBILITY', desc: 'Haute couture, biomaterials, and circular enterprise' },
                ].map((item) => (
                  <div key={item.word} className="p-3.5 bg-[#EAE1D1]/70 border-l-2 border-[#B65332]">
                    <b className="font-mono text-xs sm:text-sm font-bold text-[#11100E] tracking-wider block">
                      {item.word}
                    </b>
                    <span className="text-[11px] text-[#73695E] leading-tight block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.35}>
              <button
                onClick={() => scrollToSection('the-project')}
                className="button bg-[#241A14] text-white hover:bg-[#B65332] px-7 py-4 text-xs font-mono tracking-wider uppercase font-bold cursor-pointer transition-all flex items-center gap-2 mt-4"
              >
                <span>DISCOVER RAFFIA</span>
                <ArrowRight size={16} />
              </button>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. THE PROJECT: LARGE EDITORIAL COMPOSITION WITH DYNAMIC VISUAL CHANGING */}
      {/* ========================================================================= */}
      <section id="the-project" className="py-24 sm:py-32 px-6 lg:px-12 bg-[#241A14] text-[#F3EBDD] border-b border-white/10">
        <div className="max-w-[1560px] mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-8">
            <MotionReveal direction="up">
              <span className="font-mono text-xs tracking-widest text-[#C8A978] uppercase block mb-2">
                THE RAFFIA LEGACY PROJECT
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                FROM PALM TO PRODUCT.<br />
                <span className="text-[#C8A978] font-serif italic font-normal">CULTURE TO COMMERCE.</span>
              </h2>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.15}>
              <p className="max-w-md text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                The Raffia Legacy Project connects traditional knowledge with contemporary fashion, art, design, tourism, technology and enterprise.
              </p>
            </MotionReveal>
          </div>

          {/* Interactive Visual Sequence: Large Dynamic Image + Category Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Interactive Category Selector (Left / Tabs) */}
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
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-[#C8A978] font-bold">
                        0{idx + 1}
                      </span>
                      <ArrowUpRight
                        size={16}
                        className={`transition-all ${
                          isActive ? 'text-[#C8A978] translate-x-0.5 -translate-y-0.5' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#C8A978] font-mono mt-0.5">
                      {cat.tagline}
                    </p>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="text-xs text-white/80 mt-3 font-sans leading-relaxed pt-2 border-t border-white/10"
                      >
                        {cat.description}
                      </motion.p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Large Contextual Image Display (Right) */}
            <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[560px] overflow-hidden border border-white/15 bg-[#11100E]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProjectPillar.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentProjectPillar.image}
                    alt={currentProjectPillar.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                    <span className="font-mono text-xs text-[#C8A978] tracking-widest uppercase block mb-1">
                      ACTIVE PILLAR · 0{activeProjectIdx + 1}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {currentProjectPillar.title}
                    </h4>
                    <p className="text-sm text-white/85 mt-2 max-w-lg leading-relaxed">
                      {currentProjectPillar.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. LEGACY YEAR: VISUAL JOURNEY ACROSS THE 6 STAGES                       */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <MotionReveal direction="up">
              <span className="font-mono text-xs tracking-widest text-[#B65332] uppercase font-bold block mb-2">
                THE 12-MONTH CALENDAR
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11100E]">
                THE LEGACY YEAR<br />
                <span className="text-[#B65332] font-serif italic font-normal">PROGRAMME JOURNEY.</span>
              </h2>
            </MotionReveal>
            <MotionReveal direction="up" delay={0.15}>
              <p className="max-w-md text-sm sm:text-base text-[#73695E] leading-relaxed">
                The festival is the physical flagship moment. The Legacy Year is everything that happens before and after it—connecting schools, youth, designers, and cooperatives.
              </p>
            </MotionReveal>
          </div>

          {/* Horizontal Storytelling Grid on Desktop / Vertical on Mobile */}
          <div className="relative pt-6">
            {/* Subtle Raffia Weaving Thread Line connecting the stages */}
            <div className="hidden lg:block absolute top-[110px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#B65332] via-[#C8A978] to-[#B65332] z-0 opacity-40" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
              {LEGACY_STAGES.map((st, i) => (
                <motion.div
                  key={st.step}
                  whileHover={{ y: -6 }}
                  className="group bg-[#F3EBDD] border border-[#241A14]/15 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
                >
                  {/* Stage Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#DDD4C5]">
                    <img
                      src={st.image}
                      alt={st.subtitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#241A14] text-white font-mono text-[11px] font-bold">
                      {st.step}
                    </div>
                  </div>

                  {/* Stage Copy */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <b className="font-mono text-[11px] tracking-widest text-[#B65332] uppercase block mb-1">
                        {st.title}
                      </b>
                      <h4 className="text-base font-bold text-[#11100E] leading-snug mb-2">
                        {st.subtitle}
                      </h4>
                      <p className="text-xs text-[#73695E] leading-relaxed">
                        {st.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#241A14]/10 flex items-center justify-between text-[11px] font-mono text-[#B65332]">
                      <span>STAGE {st.step}</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. PEOPLE / MAKERS: ASYMMETRICAL EDITORIAL PHOTOGRAPHY GRID              */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#F3EBDD] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <MotionReveal direction="up">
              <span className="font-mono text-xs tracking-widest text-[#B65332] uppercase font-bold block mb-2">
                COMMUNITY & CUSTODIANS
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11100E] leading-[1.08]">
                THE PEOPLE<br />
                <span className="text-[#B65332] font-serif italic font-normal">BEHIND THE LEGACY.</span>
              </h2>
            </MotionReveal>
            <MotionReveal direction="up" delay={0.15}>
              <p className="max-w-md text-sm sm:text-base text-[#73695E] leading-relaxed">
                Meet the elder guild custodians, innovative textile artists, and riverine harvesting collectives preserving and redefining African raffia.
              </p>
            </MotionReveal>
          </div>

          {/* Asymmetrical Editorial Photography Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* 1. Large Portrait: Ikot Ekpene Master Weavers (Col 1-5) */}
            <div className="md:col-span-5 relative overflow-hidden bg-[#241A14] text-white group min-h-[460px] flex flex-col justify-end p-8 border border-[#241A14]/15">
              <img
                src={MAKERS[0].image}
                alt={MAKERS[0].name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/50 to-transparent" />
              <div className="relative z-10">
                <span className="font-mono text-xs text-[#C8A978] tracking-widest uppercase block mb-1">
                  MASTER GUILD
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  {MAKERS[0].name}
                </h3>
                <p className="text-xs text-white/80 line-clamp-3 leading-relaxed font-sans mb-4">
                  {MAKERS[0].bio}
                </p>
                <div className="text-xs font-mono text-[#C8A978] flex items-center gap-1.5">
                  <span>{MAKERS[0].location}</span>
                </div>
              </div>
            </div>

            {/* 2. Middle Stack: Two Smaller Images (Col 6-8) */}
            <div className="md:col-span-3 flex flex-col gap-6">
              {/* Top Small Card: Studio Nkem */}
              <div className="relative aspect-[4/3] flex-1 overflow-hidden bg-[#241A14] text-white p-5 flex flex-col justify-end group border border-[#241A14]/15">
                <img
                  src={MAKERS[1].image}
                  alt={MAKERS[1].name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
                <div className="relative z-10">
                  <span className="font-mono text-[10px] text-[#C8A978] uppercase block">
                    CONTEMPORARY ATELIER
                  </span>
                  <h4 className="text-base font-bold text-white leading-snug">
                    {MAKERS[1].name}
                  </h4>
                  <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                    {MAKERS[1].discipline}
                  </p>
                </div>
              </div>

              {/* Bottom Small Card: Oron Cooperative */}
              <div className="relative aspect-[4/3] flex-1 overflow-hidden bg-[#241A14] text-white p-5 flex flex-col justify-end group border border-[#241A14]/15">
                <img
                  src={MAKERS[2].image}
                  alt={MAKERS[2].name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
                <div className="relative z-10">
                  <span className="font-mono text-[10px] text-[#C8A978] uppercase block">
                    WOMEN’S FIBRE COOPERATIVE
                  </span>
                  <h4 className="text-base font-bold text-white leading-snug">
                    {MAKERS[2].name}
                  </h4>
                  <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                    {MAKERS[2].location}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Wide Image / Community Weaving Circle (Col 9-12) */}
            <div className="md:col-span-4 relative overflow-hidden bg-[#241A14] text-white p-8 flex flex-col justify-between group border border-[#241A14]/15 min-h-[460px]">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
                alt="Apprentice and guild weavers"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/60 to-[#11100E]/30" />
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#C8A978]">
                <span>APPRENTICESHIP NETWORK</span>
                <span>AKWA IBOM & CROSS RIVER</span>
              </div>
              <div className="relative z-10">
                <h4 className="text-2xl font-bold text-white mb-2 leading-tight">
                  Passing the Needle Across Generations
                </h4>
                <p className="text-xs text-white/80 leading-relaxed font-sans mb-4">
                  Elder master weavers instructing young apprentices in traditional knotting, tension geometry, and natural mordant dyeing.
                </p>
                <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs font-mono text-[#C8A978]">
                  <span>OVER 250 REGISTERED MAKERS</span>
                  <ArrowUpRight size={15} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07. MARKETPLACE PREVIEW: EDITORIAL COMMERCE SHOWCASE                       */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <MotionReveal direction="up">
              <span className="font-mono text-xs tracking-widest text-[#B65332] uppercase font-bold block mb-2">
                CONTEMPORARY EDITIONS
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11100E] leading-[1.08]">
                RAFFIA,<br />
                <span className="text-[#B65332] font-serif italic font-normal">MADE TODAY.</span>
              </h2>
            </MotionReveal>
            <MotionReveal direction="up" delay={0.15}>
              <button
                onClick={() => onNavigate({ type: 'marketplace' })}
                className="button bg-[#241A14] text-white hover:bg-[#B65332] px-7 py-4 text-xs font-mono tracking-wider uppercase font-bold cursor-pointer transition-all flex items-center gap-2"
              >
                <span>EXPLORE MARKETPLACE</span>
                <ArrowRight size={16} />
              </button>
            </MotionReveal>
          </div>

          {/* Large Editorial Product Grid */}
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

      {/* ========================================================================= */}
      {/* 08. FESTIVAL 2027: UNMISTAKABLE EVENT PORTAL                              */}
      {/* ========================================================================= */}
      <section className="relative py-28 sm:py-36 px-6 lg:px-12 overflow-hidden bg-[#11100E] text-white">
        {/* Full-Bleed Atmospheric Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1920&q=85"
            alt="Festival cultural masquerade"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/85 to-[#11100E]" />
        </div>

        <div className="relative z-10 max-w-[1560px] mx-auto space-y-16">
          {/* Main Event Typography */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/15 pb-12">
            <div>
              <span className="font-mono text-xs tracking-[0.25em] text-[#C8A978] uppercase block mb-3">
                THE FLAGSHIP EVENT
              </span>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white">
                RAFFIA<br />
                <span className="text-[#B65332]">FESTIVAL</span><br />
                <span className="font-serif italic font-normal text-[#C8A978]">2027</span>
              </h2>
            </div>

            <div className="max-w-lg space-y-4">
              <p className="text-base sm:text-lg text-white/85 leading-relaxed font-sans">
                The flagship celebration bringing communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors together in Akwa Ibom & Cross River.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate({ type: 'coming_soon', title: 'Festival 2027 Registration', subtitle: 'Festival passes and hotel travel packages are in preparation.' })}
                  className="button bg-[#B65332] text-white hover:bg-white hover:text-[#11100E] font-bold px-8 py-4 text-xs font-mono tracking-wider uppercase cursor-pointer transition-all"
                >
                  <span>REGISTER FOR UPDATES</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 8 Source-Supported Festival Experiences: Visual Image-Overlay Cards */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#C8A978] uppercase tracking-wider mb-6">
              <span>8 FLAGSHIP EXPERIENCES</span>
              <span className="text-white/50">OCTOBER 2026 — 2027</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FESTIVAL_EVENTS.map((ev, i) => (
                <div
                  key={ev.id}
                  className="group relative overflow-hidden bg-[#241A14] border border-white/10 p-6 min-h-[220px] flex flex-col justify-between hover:border-[#C8A978] transition-all cursor-pointer"
                >
                  <img
                    src={ev.image}
                    alt={ev.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity duration-500 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/70 to-transparent" />
                  <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#C8A978]">
                    <span>0{i + 1}</span>
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#C8A978] transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-2 mt-1 font-sans leading-relaxed">
                      {ev.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09. GET INVOLVED: STRONG HUMAN/COMMUNITY IMAGE & PATHWAYS                 */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#F3EBDD] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto space-y-12">
          {/* Main Statement with Human Community Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-xs tracking-widest text-[#B65332] uppercase font-bold block">
                PARTICIPATION & PARTNERSHIP
              </span>
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#11100E] leading-[1.05]">
                THERE IS A PLACE<br />
                <span className="text-[#B65332] font-serif italic font-normal">FOR YOU HERE.</span>
              </h2>
              <p className="text-base sm:text-lg text-[#73695E] leading-relaxed">
                Whether you weave, design, build, educate, or patronize—join a year-round movement dedicated to African cultural heritage and sustainable innovation.
              </p>
            </div>

            {/* Community Image */}
            <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden bg-[#241A14] border border-[#241A14]/15 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85"
                alt="Community workshop"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono">
                COMMUNITY HARVEST & WEAVING CIRCLE · CROSS RIVER
              </div>
            </div>
          </div>

          {/* 7 Clear Pathways */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 pt-6 border-t border-[#241A14]/15">
            {[
              'PARTNER',
              'SPONSOR',
              'VOLUNTEER',
              'BECOME A MAKER',
              'SCHOOLS',
              'CREATIVES',
              'BUSINESSES',
            ].map((pathway) => (
              <button
                key={pathway}
                onClick={() => onNavigate({ type: 'coming_soon', title: pathway, subtitle: `Involvement registration for ${pathway} is opening soon.` })}
                className="group p-4 bg-[#EAE1D1] hover:bg-[#241A14] border border-[#241A14]/15 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px]"
              >
                <ArrowUpRight size={14} className="text-[#B65332] group-hover:text-[#C8A978] transition-colors self-end" />
                <span className="font-mono text-xs font-bold text-[#11100E] group-hover:text-white transition-colors">
                  {pathway}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CLOSING: STRONG VISUAL MOMENT                                         */}
      {/* ========================================================================= */}
      <section className="relative py-32 sm:py-44 px-6 text-center overflow-hidden bg-[#11100E] text-white">
        {/* Cinematic Material Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1920&q=85"
            alt="Raffia texture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/90 to-[#11100E]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <p className="font-mono text-xs sm:text-sm tracking-[0.25em] text-[#C8A978] uppercase">
            OUR HERITAGE. OUR PEOPLE. OUR FUTURE.
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            RAFFIA IS OUR THREAD.<br />
            <span className="text-[#C8A978] font-serif italic font-normal">THE FUTURE IS WHAT WE WEAVE WITH IT.</span>
          </h2>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigate({ type: 'marketplace' })}
              className="button bg-[#B65332] text-white hover:bg-white hover:text-[#11100E] px-8 py-4 font-mono text-xs tracking-wider uppercase font-bold cursor-pointer transition-all"
            >
              EXPLORE THE MARKETPLACE COLLECTION
            </button>
          </div>
        </div>
      </section>

      {/* MODAL: Product Quick View (Preserves existing shopping functionality) */}
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
    </div>
  );
};
