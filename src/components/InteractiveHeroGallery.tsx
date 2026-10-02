import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  origin: string;
  accession: string;
  image: string;
  caption: string;
}

const SLIDES: Slide[] = [
  {
    id: '01',
    title: 'THE LIVING FIBRE',
    subtitle: '100% Wild River-Soaked Raffia Bast',
    origin: 'Ikot Ekpene Weaving Guild · Akwa Ibom',
    accession: 'ACCESSION NO. RL-2026-01',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1600&q=85',
    caption: 'Double-warp tightly coiled bast with vegetable-tanned harness straps, harvested sustainably along mangrove tributaries.',
  },
  {
    id: '02',
    title: 'ARCHITECTURAL VESSEL',
    subtitle: 'Undulating Form in Hand-Spun Palm Pith',
    origin: 'Cross River Riverine Guild · Calabar',
    accession: 'ACCESSION NO. RL-2026-04',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=85',
    caption: 'Coiled using ancestral palm pith reinforcement and sun-bleached wild raffia bast over a three-week curation cycle.',
  },
  {
    id: '03',
    title: 'THE ANCESTRAL LOOM',
    subtitle: 'Master Apprenticeship & Fibre Heritage',
    origin: 'Oron Palm Grove Cooperative · Oron',
    accession: 'ACCESSION NO. RL-2026-09',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85',
    caption: 'Upright frame loom weaving preserving centuries of mathematical pattern transfer and sacred ceremonial geometry.',
  },
];

export const InteractiveHeroGallery: React.FC<{
  onExploreMarketplace: () => void;
}> = ({ onExploreMarketplace }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance slides every 6 seconds if not hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const slide = SLIDES[currentIdx];

  return (
    <div
      className="relative w-full h-full min-h-[520px] lg:min-h-[640px] overflow-hidden bg-[#181513] select-none flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image Carousel with Ken Burns Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Dual subtle luxury vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/90 via-[#181513]/30 to-[#181513]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(24,21,19,0.7)_100%)]" />
        </motion.div>
      </AnimatePresence>

      {/* Top Bar: Archival Accession & Guild Registry */}
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between text-white/90">
        <motion.div
          key={`acc-${slide.id}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 text-[11px] font-mono tracking-widest uppercase text-white/80"
        >
          <span className="w-2 h-2 rounded-full bg-[#E59C6D] animate-pulse" />
          <span>{slide.accession}</span>
        </motion.div>

        <div className="hidden sm:flex items-center gap-2 text-[10.5px] font-mono tracking-wider uppercase text-[#E59C6D] bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E59C6D]" />
          <span>CERTIFIED GUILD PROVENANCE</span>
        </div>
      </div>

      {/* Center Ambient Weave Crest */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-white/10 border-dashed opacity-40 flex items-center justify-center"
        >
          <div className="w-36 h-36 rounded-full border border-[#E59C6D]/20" />
        </motion.div>
      </div>

      {/* Bottom Content & Interactive Selector */}
      <div className="relative z-10 p-6 sm:p-8 bg-gradient-to-t from-[#181513] via-[#181513]/90 to-transparent">
        <div className="max-w-xl">
          <motion.div
            key={`meta-${slide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-[11px] font-mono tracking-widest text-[#E59C6D] uppercase mb-1">
              {slide.origin}
            </p>
            <h3 className="font-editorial text-2xl sm:text-3xl text-white font-bold tracking-tight mb-2">
              {slide.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed font-sans mb-4">
              {slide.caption}
            </p>
          </motion.div>

          {/* Slide Progress / Selector Tabs */}
          <div className="flex items-center justify-between pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded transition-all cursor-pointer ${
                    currentIdx === idx
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                  aria-label={`View slide ${s.id}`}
                >
                  <span className="font-mono text-xs">{s.id}</span>
                  <span className="hidden md:inline text-[11px] font-medium tracking-wide">
                    {s.title.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={onExploreMarketplace}
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E59C6D] hover:text-white transition-colors cursor-pointer"
            >
              <span>VIEW OBJECTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
