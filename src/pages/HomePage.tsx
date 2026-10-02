import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, ShieldCheck, Sparkles, Calendar, MapPin, Eye, Check, X } from 'lucide-react';
import { ViewRoute, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { BrushStrokeUnderline } from '../components/RaffiaLogo';
import { InteractiveHeroGallery } from '../components/InteractiveHeroGallery';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickView } from '../components/ProductQuickView';
import { MotionReveal } from '../components/MotionReveal';
import { useCart } from '../context/CartContext';

interface HomePageProps {
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const launch = new Date('2026-10-29T18:00:00+01:00');

const FESTIVAL_PILLARS = [
  {
    num: '01',
    title: 'CULTURE',
    headline: 'Sacred Ritual & Identity',
    desc: 'Ceremonial masquerades, prestige regalia, and community weaving circles passed down through centuries.',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=80',
  },
  {
    num: '02',
    title: 'CREATIVITY',
    headline: 'Haute Couture & Living Sculpture',
    desc: 'Contemporary avant-garde design, bespoke furniture, and architectural installations woven from botanical fronds.',
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1000&q=80',
  },
  {
    num: '03',
    title: 'OPPORTUNITY',
    headline: 'Dignified Guild Economics',
    desc: 'Fair-trade cooperative value chain directly funding families and master artisans across Akwa Ibom and Cross River.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
  },
  {
    num: '04',
    title: 'TOURISM',
    headline: 'Wetland Trails & Ateliers',
    desc: 'Immersive cultural journeys along freshwater mangrove tributaries, artist residencies, and living village museums.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
  },
  {
    num: '05',
    title: 'LEGACY',
    headline: 'Intergenerational Academy',
    desc: 'Apprenticeship programs preserving non-written mathematical weaving traditions for the next generation of creatives.',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80',
  },
];

const FESTIVAL_EXPERIENCES = [
  { id: '01', name: 'RAFFIA PARADE', highlight: 'Over 1,000 costumed masquerades in ceremonial golden fronds', date: 'Oct 29, 2026' },
  { id: '02', name: 'FASHION SHOW', highlight: 'Haute-couture collections by 14 Pan-African designers', date: 'Oct 30, 2026' },
  { id: '03', name: 'ART & DESIGN BIENNALE', highlight: 'Large-scale outdoor architectural pavilions', date: 'Oct 30 - Nov 2' },
  { id: '04', name: 'DANCE & PERFORMANCE', highlight: 'Ancestral percussive drumming and choreographic spectacles', date: 'Oct 31, 2026' },
  { id: '05', name: 'INNOVATION LAB', highlight: 'Bio-materials, carbon-neutral architecture, and circular bast fiber', date: 'Nov 1, 2026' },
  { id: '06', name: 'ECONOMY SUMMIT', highlight: 'Creative industry investment and direct export agreements', date: 'Nov 1, 2026' },
  { id: '07', name: 'MARKETPLACE', highlight: 'Direct guild trading floor with certified accession numbering', date: 'Everyday' },
  { id: '08', name: 'RAFFIA VILLAGE', highlight: 'Masterclass workshops, natural clay dyeing, and palm culinary heritage', date: 'Everyday' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const [remaining, setRemaining] = useState(launch.getTime() - Date.now());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activePillar, setActivePillar] = useState(0);
  const [activeExperience, setActiveExperience] = useState<typeof FESTIVAL_EXPERIENCES[0] | null>(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const { setIsCartOpen } = useCart();

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, launch.getTime() - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const products = (PRODUCTS.filter(p => p.featured || p.newArrival).length ? PRODUCTS.filter(p => p.featured || p.newArrival) : PRODUCTS).slice(0, 4);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpEmail.trim()) return;
    setRsvpSuccess(true);
    setTimeout(() => {
      setIsRsvpOpen(false);
      setRsvpSuccess(false);
      setRsvpEmail('');
    }, 2200);
  };

  return (
    <div className="home-final">
      {/* 1. CINEMATIC SPLIT HERO SECTION */}
      <section className="final-hero">
        <div className="final-hero-copy flex flex-col justify-center">
          <MotionReveal direction="up" delay={0.05}>
            <p className="eyebrow">THE RAFFIA LEGACY PROJECT</p>
          </MotionReveal>

          <MotionReveal direction="up" delay={0.15}>
            <div className="hero-logo-lockup">
              <h1 className="hero-brand-heading">
                <span className="hero-brand-raffia">Raffia</span>
                <span className="hero-brand-legacy">LEGACY</span>
                <span className="hero-brand-project">PROJECT</span>
              </h1>
              <div className="hero-brush-wrap">
                <BrushStrokeUnderline className="hero-brush-stroke" />
              </div>
            </div>
          </MotionReveal>

          <MotionReveal direction="up" delay={0.25}>
            <p className="hero-tagline">
              A year-round of activities celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.
            </p>
          </MotionReveal>

          {/* Countdown Card with Live Ticking Motion */}
          <MotionReveal direction="up" delay={0.35}>
            <div className="launch-card">
              <span className="launch-label">THE LEGACY PROJECT LAUNCHES IN</span>
              <div className="countdown">
                <div>
                  <b className="tabular-nums">{String(days).padStart(2, '0')}</b>
                  <small>DAYS</small>
                </div>
                <i className="animate-pulse">:</i>
                <div>
                  <b className="tabular-nums">{String(hours).padStart(2, '0')}</b>
                  <small>HOURS</small>
                </div>
                <i className="animate-pulse">:</i>
                <div>
                  <b className="tabular-nums">{String(minutes).padStart(2, '0')}</b>
                  <small>MIN</small>
                </div>
                <i className="animate-pulse">:</i>
                <div>
                  <b className="tabular-nums">{String(seconds).padStart(2, '0')}</b>
                  <small>SEC</small>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-[#57524E]">
                <strong>29 OCTOBER 2026</strong>
                <span className="font-mono text-[11px] text-[#B94E2E]">CALABAR & IKOT EKPENE</span>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal direction="up" delay={0.45}>
            <div className="hero-buttons">
              <button
                className="button button-dark group"
                onClick={() => scrollToSection('why-raffia')}
              >
                <span>DISCOVER THE PROJECT</span>
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                className="button button-outline group"
                onClick={() => onNavigate({ type: 'marketplace' })}
              >
                <span>EXPLORE MARKETPLACE</span>
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </MotionReveal>
        </div>

        {/* Right Half: Interactive Cinematic Gallery */}
        <div className="w-full h-full min-h-[520px] lg:min-h-full">
          <InteractiveHeroGallery onExploreMarketplace={() => onNavigate({ type: 'marketplace' })} />
        </div>
      </section>

      {/* 2. WHY RAFFIA: EDITORIAL DIPTYCH SECTION */}
      <section id="why-raffia" className="py-20 lg:py-28 px-6 lg:px-12 border-b border-[#181513]/10 bg-[#FAF7F2]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Botanical Provenance */}
          <div className="lg:col-span-6 space-y-6">
            <MotionReveal direction="up">
              <p className="eyebrow">WHY RAFFIA?</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181513] mt-3 leading-[1.1]">
                MORE THAN<br />
                <em className="text-[#B94E2E] font-serif font-normal italic">A MATERIAL.</em>
              </h2>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.15}>
              <p className="text-base sm:text-lg text-[#2E251F] leading-relaxed">
                Raffia carries history, skill, identity and possibility. For generations across West Africa, the fronds of the wild <em>Raphia vinifera</em> palm have shaped clothing, ceremonial dance, shelter, architecture, sacred masquerades, and everyday trade.
              </p>
            </MotionReveal>

            {/* Botanical & Guild Pillars */}
            <div className="space-y-4 pt-4 border-t border-[#181513]/10">
              {[
                { num: '01', title: 'Sustainable Wetland Harvest', desc: 'Sustainably pruned by riverine harvesters without felling trees, preserving coastal mangrove biomes.' },
                { num: '02', title: 'Tidal Retting & Hand Spun Bast', desc: 'Soaked for weeks in freshwater to reveal feather-light bast fibers with exceptional tensile resilience.' },
                { num: '03', title: 'Living Mathematical Looms', desc: 'Mathematical pattern sequences memorized and transferred organically without written blueprints.' },
              ].map((item, idx) => (
                <MotionReveal key={item.num} direction="up" delay={0.2 + idx * 0.1}>
                  <div className="flex items-start gap-4 p-3 bg-[#F4EFEA] hover:bg-[#EDE6D8] transition-colors border-l-2 border-[#B94E2E]">
                    <span className="font-mono text-xs font-bold text-[#B94E2E] pt-0.5">{item.num}</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#181513]">{item.title}</h4>
                      <p className="text-xs text-[#57524E] leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>

            <MotionReveal direction="up" delay={0.4}>
              <button
                className="text-link mt-2"
                onClick={() => scrollToSection('the-project')}
              >
                <span>EXPLORE THE PROJECT PILLARS</span>
                <ArrowRight size={16} />
              </button>
            </MotionReveal>
          </div>

          {/* Right Column: Layered Editorial Imagery Showcase */}
          <div className="lg:col-span-6 relative">
            <MotionReveal direction="none" duration={0.8}>
              {/* Primary Master Artisan Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#181513]/15 shadow-xl bg-[#E3DBD0] group">
                <img
                  src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80"
                  alt="Master African artisan weaving natural raffia"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#E59C6D]">
                    MASTER ARCHIVIST AT THE UPRIGHT LOOM
                  </span>
                  <p className="text-sm font-medium mt-0.5">Ikot Ekpene Heritage Weavers Guild</p>
                </div>
              </div>

              {/* Floating Overlapping Detail Inset */}
              <motion.div
                whileHover={{ y: -6 }}
                className="absolute -bottom-8 -left-6 sm:-left-10 w-44 sm:w-56 bg-[#FAF7F2] p-3 border border-[#181513]/20 shadow-2xl z-10"
              >
                <div className="aspect-[4/3] w-full overflow-hidden mb-2 bg-[#DDD4C5]">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
                    alt="Micro texture of braided raffia fiber"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] font-mono text-[#181513] uppercase tracking-wider">
                  <span className="text-[#B94E2E] font-bold">SPECIMEN NO. RL-B82</span>
                  <p className="text-[9.5px] text-[#57524E] truncate">0.8mm Hand-Stripped Bast Ribbon</p>
                </div>
              </motion.div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 3. THE BIG IDEA: 5 INTERACTIVE PILLAR CARDS */}
      <section id="the-project" className="py-20 lg:py-28 px-6 lg:px-12 bg-[#2D1F17] text-[#FAF7F2] border-b border-[#FAF7F2]/10">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-8">
            <div>
              <p className="text-xs font-mono tracking-widest text-[#E59C6D] uppercase">THE BIG IDEA</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mt-2 leading-[1.1]">
                FROM PALM TO PRODUCT.<br />
                <em className="text-[#E59C6D] font-serif font-normal italic">CULTURE TO COMMERCE.</em>
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-white/80 leading-relaxed font-sans">
              Raffia Legacy connects traditional knowledge with contemporary creativity, enterprise, education and culture. Select a pillar to discover its scope.
            </p>
          </div>

          {/* 5 Interactive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {FESTIVAL_PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.num}
                whileHover={{ y: -8 }}
                onClick={() => setActivePillar(idx)}
                className={`group relative overflow-hidden rounded-xs border cursor-pointer transition-all duration-300 flex flex-col justify-between p-6 min-h-[380px] ${
                  activePillar === idx
                    ? 'border-[#E59C6D] ring-2 ring-[#E59C6D]/40 bg-[#38281F]'
                    : 'border-white/15 bg-[#251A13] hover:border-white/30'
                }`}
              >
                {/* Background Image with Ambient Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-500 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F150F] via-[#1F150F]/85 to-transparent" />
                </div>

                {/* Card Top */}
                <div className="relative z-10">
                  <span className="font-mono text-xs font-bold text-[#E59C6D] tracking-widest">
                    {pillar.num}
                  </span>
                  <h3 className="font-bold text-xl text-white tracking-tight mt-2 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#E59C6D] font-mono tracking-wide">
                    {pillar.headline}
                  </p>
                </div>

                {/* Card Bottom */}
                <div className="relative z-10 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/75 leading-relaxed font-sans line-clamp-4">
                    {pillar.desc}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#E59C6D] group-hover:text-white transition-colors">
                    <span>EXPLORE PILLAR</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE YEAR AHEAD: 12 MONTHS · ONE LEGACY */}
      <section id="the-year" className="py-20 lg:py-28 px-6 lg:px-12 bg-[#EDE6D8] border-b border-[#181513]/10">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow">THE YEAR AHEAD</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181513] mt-2">
                12 MONTHS.<br />
                <em className="text-[#B94E2E] font-serif font-normal italic">ONE LEGACY.</em>
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[#4A4036] leading-relaxed">
              The festival is the flagship moment. The Legacy Year is everything that happens before and after it—empowering schools, youth, designers, and cooperatives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-[#181513]/15">
            {[
              { num: '01', stage: 'DISCOVER', title: 'Raffia in Schools', date: 'Month 01 - 03', desc: 'Curriculum development and interschool heritage workshops across 40 institutions.' },
              { num: '02', stage: 'IMAGINE', title: 'Young Raffia Innovators', date: 'Month 04 - 06', desc: 'Youth incubation prototyping eco-packaging, biomaterials, and digital storytelling.' },
              { num: '03', stage: 'CREATE', title: 'Design Challenge', date: 'Month 07 - 08', desc: 'National call for architects and haute-couture designers pairing with traditional master weavers.' },
              { num: '04', stage: 'BUILD', title: 'Business Incubator', date: 'Month 09 - 10', desc: 'Micro-grants, enterprise management, and export certification for artisan co-ops.' },
              { num: '05', stage: 'CELEBRATE', title: 'Raffia Festival 2027', date: 'Month 11 - 12', desc: 'The historic flagship celebration gathering global collectors, designers, and custodians.' },
            ].map((item, idx) => (
              <motion.div
                key={item.num}
                whileHover={{ y: -4 }}
                className="p-6 sm:p-8 border-b lg:border-b-0 border-r border-[#181513]/15 bg-[#FAF7F2] hover:bg-white transition-all flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#B94E2E]">{item.num}</span>
                    <span className="text-[10px] font-mono text-[#8C7355] uppercase">{item.date}</span>
                  </div>
                  <b className="block text-[11px] font-mono tracking-widest text-[#57524E] uppercase mb-1">
                    {item.stage}
                  </b>
                  <h4 className="text-lg font-bold text-[#181513] mb-2">{item.title}</h4>
                </div>
                <p className="text-xs text-[#57524E] leading-relaxed pt-3 border-t border-[#181513]/10">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE RAFFIA MARKETPLACE SPOTLIGHT */}
      <section id="the-market" className="py-20 lg:py-28 px-6 lg:px-12 bg-[#FAF7F2] border-b border-[#181513]/10">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow">THE RAFFIA MARKETPLACE</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181513] mt-2">
                RAFFIA,<br />
                <em className="text-[#B94E2E] font-serif font-normal italic">MADE TODAY.</em>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="button button-dark"
                onClick={() => onNavigate({ type: 'marketplace' })}
              >
                <span>EXPLORE ALL PIECES</span>
                <ArrowUpRight size={17} />
              </button>
            </div>
          </div>

          {/* Product Grid with Quick View & Hover Crossfade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(slug) => onSelectProduct(slug)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. RAFFIA FESTIVAL 2027: FULL-BLEED CINEMATIC PORTAL */}
      <section id="the-festival" className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden bg-[#181513] text-white">
        {/* Full-bleed background with atmospheric warmth */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1800&q=85"
            alt="Festival cultural celebration"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181513] via-[#181513]/80 to-[#181513]/85" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-mono tracking-widest text-[#E59C6D] uppercase">RAFFIA FESTIVAL 2027</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              AND THEN,<br />
              <em className="text-[#E59C6D] font-serif font-normal italic">WE CELEBRATE.</em>
            </h2>
            <p className="text-base text-white/80 leading-relaxed font-sans">
              The flagship celebration bringing communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors together in Akwa Ibom & Cross River.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setIsRsvpOpen(true)}
                className="button bg-[#E59C6D] text-[#181513] hover:bg-white font-bold transition-all py-3.5 px-6 cursor-pointer"
              >
                <span>REGISTER FOR FESTIVAL UPDATES</span>
                <ArrowUpRight size={17} />
              </button>
              <button
                onClick={() => scrollToSection('the-year')}
                className="button border border-white/30 text-white hover:bg-white/10 py-3.5 px-6 cursor-pointer"
              >
                <span>TIMELINE OVERVIEW</span>
              </button>
            </div>
          </div>

          {/* 8 Festival Experiences Interactive List */}
          <div className="lg:col-span-7 bg-[#231812]/80 backdrop-blur-md p-6 sm:p-8 border border-white/15">
            <h3 className="text-xs font-mono tracking-widest text-[#E59C6D] uppercase mb-4">
              THE 8 FESTIVAL EXPERIENCES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FESTIVAL_EXPERIENCES.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setActiveExperience(exp)}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E59C6D]/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[#E59C6D] mb-1">
                    <span>{exp.id}</span>
                    <span className="text-white/60">{exp.date}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-[#E59C6D] transition-colors">
                    {exp.name}
                  </h4>
                  <p className="text-xs text-white/70 mt-1 line-clamp-1">
                    {exp.highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. BE PART OF THE LEGACY: 4 PATHWAYS */}
      <section id="get-involved" className="py-20 lg:py-28 px-6 lg:px-12 bg-[#FAF7F2] border-b border-[#181513]/10">
        <div className="max-w-[1400px] mx-auto text-center space-y-6">
          <p className="eyebrow">BE PART OF THE LEGACY</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181513]">
            THERE IS A PLACE<br />
            <em className="text-[#B94E2E] font-serif font-normal italic">FOR YOU HERE.</em>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 text-left">
            {[
              { title: 'For Artisans & Guilds', desc: 'Join the registered fair-trade guild directory, access micro-financing and export certification.', action: 'REGISTER AS A MAKER' },
              { title: 'For Designers & Brands', desc: 'Commission bespoke raffia textiles, furniture and architectural installations directly from guilds.', action: 'PARTNER WITH US' },
              { title: 'For Schools & Youth', desc: 'Bring the Raffia in Schools living curriculum and hands-on workshops to your students.', action: 'EDUCATIONAL ACCESS' },
              { title: 'For Patrons & Collectors', desc: 'Acquire certified numbered editions and support the 12-month intergenerational academy.', action: 'PATRON PROGRAM' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -6 }}
                className="p-6 bg-[#F4EFEA] border border-[#181513]/15 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#B94E2E]">0{i + 1}</span>
                  <h4 className="font-bold text-lg text-[#181513] mt-2 mb-2">{card.title}</h4>
                  <p className="text-xs text-[#57524E] leading-relaxed">{card.desc}</p>
                </div>
                <button
                  onClick={() => setIsRsvpOpen(true)}
                  className="mt-6 flex items-center justify-between text-xs font-mono font-bold uppercase text-[#181513] hover:text-[#B94E2E] transition-colors pt-3 border-t border-[#181513]/10 cursor-pointer"
                >
                  <span>{card.action}</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL EDITORIAL CLOSE */}
      <section className="final-close text-center py-24 px-6 bg-[#181513] text-white">
        <p className="text-xs font-mono tracking-widest text-[#E59C6D] uppercase mb-4">
          OUR HERITAGE. OUR PEOPLE. OUR FUTURE.
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          RAFFIA IS OUR THREAD.<br />
          <em className="text-[#E59C6D] font-serif font-normal italic">THE FUTURE IS WHAT WE WEAVE WITH IT.</em>
        </h2>
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

      {/* MODAL: Festival Experience Detail */}
      <AnimatePresence>
        {activeExperience && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#FAF7F2] p-8 border border-[#181513]/20 shadow-2xl text-[#181513]"
            >
              <button
                onClick={() => setActiveExperience(null)}
                className="absolute top-4 right-4 p-2 text-[#57524E] hover:text-[#181513] cursor-pointer"
              >
                <X size={20} />
              </button>
              <span className="font-mono text-xs text-[#B94E2E] font-bold">EXPERIENCE {activeExperience.id}</span>
              <h3 className="font-editorial text-3xl font-bold mt-1 mb-2">{activeExperience.name}</h3>
              <p className="text-xs font-mono text-[#8C7355] mb-4">SCHEDULED: {activeExperience.date} · AKWA IBOM FESTIVAL GROUND</p>
              <p className="text-sm text-[#4A4036] leading-relaxed mb-6">{activeExperience.highlight}</p>
              <button
                onClick={() => {
                  setActiveExperience(null);
                  setIsRsvpOpen(true);
                }}
                className="button button-dark w-full justify-center"
              >
                REGISTER FOR THIS EXPERIENCE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: RSVP / Newsletter Signup */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#FAF7F2] p-8 border border-[#181513]/20 shadow-2xl text-[#181513]"
            >
              <button
                onClick={() => setIsRsvpOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#57524E] hover:text-[#181513] cursor-pointer"
              >
                <X size={20} />
              </button>

              <span className="font-mono text-xs text-[#B94E2E] font-bold uppercase">THE RAFFIA LEGACY PROJECT</span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold mt-1 mb-2">Be First in the Loom</h3>
              <p className="text-xs sm:text-sm text-[#57524E] leading-relaxed mb-6">
                Receive priority access to limited edition artisan pieces, ticket releases, and the 12-month program.
              </p>

              {rsvpSuccess ? (
                <div className="p-4 bg-[#EAF5EC] border border-[#2D7A38]/20 text-[#2D7A38] text-sm flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Thank you. You have been added to the priority guild list.</span>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#8C7355] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full px-4 py-3 bg-white border border-[#181513]/20 text-[#181513] text-sm focus:border-[#B94E2E] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="button button-dark w-full justify-center py-3.5"
                  >
                    CONFIRM GUILD REGISTRATION
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
