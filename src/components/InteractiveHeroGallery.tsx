import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { BrushStrokeUnderline } from './RaffiaLogo';

interface HeroSlide {
  id: string;
  theme: string;
  image: string;
  caption: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: '01',
    theme: 'THE MOVEMENT',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1920&q=85',
    caption: 'Celebrating African heritage, sustainable creativity, and economic opportunity.',
  },
  {
    id: '02',
    theme: 'THE MAKERS',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1920&q=85',
    caption: 'Centuries of ancestral skill connecting with contemporary creative expression.',
  },
  {
    id: '03',
    theme: 'THE FESTIVAL',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1920&q=85',
    caption: 'Bringing communities, artisans, designers and performers together.',
  },
  {
    id: '04',
    theme: 'THE CREATIVITY',
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?auto=format&fit=crop&w=1920&q=85',
    caption: 'From palm to product. Culture to commerce. A living journey.',
  },
];

interface InteractiveHeroGalleryProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  onExploreLegacy: () => void;
  onShopCollection: () => void;
}

export const InteractiveHeroGallery: React.FC<InteractiveHeroGalleryProps> = ({
  days,
  hours,
  minutes,
  seconds,
  onExploreLegacy,
  onShopCollection,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance slide every 7 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const slide = HERO_SLIDES[currentIdx];

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div
      className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#11100E] select-none"
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
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.image}
            alt={slide.theme}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Cinematic Dual Gradient Overlays: Deep Raffia Brown & Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/65 to-[#11100E]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(17,16,14,0.85)_100%)]" />
        </motion.div>
      </AnimatePresence>

      {/* Main Event Overlay: Perfectly Balanced Typography within Imagery */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 text-center flex flex-col items-center justify-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-4 sm:mb-6"
        >
          <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-[#C8A978] uppercase">
            DANCE VILLE PRESENTS
          </p>
        </motion.div>

        {/* Event Headline Lockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-4 sm:mb-6 flex flex-col items-center"
        >
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 sm:gap-x-5 leading-none">
            <span
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 500,
                fontSize: 'clamp(3.8rem, 11vw, 9.5rem)',
                letterSpacing: '-0.025em',
                color: '#F3EBDD',
                lineHeight: 0.95,
              }}
            >
              Raffia
            </span>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(3.4rem, 10vw, 8.8rem)',
                letterSpacing: '-0.035em',
                color: '#B65332',
                lineHeight: 0.95,
              }}
            >
              LEGACY
            </span>
          </div>

          {/* Authentic Hand-Painted Brush Underline */}
          <div className="w-full max-w-md sm:max-w-lg mt-3 sm:mt-5 overflow-visible">
            <BrushStrokeUnderline
              className="w-full h-3 sm:h-4"
              color="#B65332"
            />
          </div>
        </motion.div>

        {/* Event Cadence Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-8 max-w-2xl"
        >
          <p className="text-sm sm:text-base md:text-lg font-mono tracking-widest text-[#F3EBDD]/90 uppercase font-medium">
            12 MONTHS · ONE LEGACY · ONE FESTIVAL
          </p>
          <p className="text-xs sm:text-sm text-[#F3EBDD]/75 mt-2 font-sans leading-relaxed line-clamp-2">
            {slide.caption}
          </p>
        </motion.div>

        {/* Live Countdown & Date Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-10 w-full max-w-md bg-[#241A14]/80 backdrop-blur-md p-4 sm:p-5 border border-white/15"
        >
          <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-[#C8A978] pb-2.5 border-b border-white/10 mb-3">
            <span>EVENT LAUNCHES IN</span>
            <strong className="text-white">29 OCTOBER 2026</strong>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-white">
            <div className="p-2 bg-white/5 border border-white/10">
              <b className="block text-2xl sm:text-3xl font-mono font-bold text-[#F3EBDD] tabular-nums">
                {String(days).padStart(2, '0')}
              </b>
              <small className="text-[9px] font-mono tracking-widest uppercase text-[#C8A978]">
                DAYS
              </small>
            </div>
            <div className="p-2 bg-white/5 border border-white/10">
              <b className="block text-2xl sm:text-3xl font-mono font-bold text-[#F3EBDD] tabular-nums">
                {String(hours).padStart(2, '0')}
              </b>
              <small className="text-[9px] font-mono tracking-widest uppercase text-[#C8A978]">
                HOURS
              </small>
            </div>
            <div className="p-2 bg-white/5 border border-white/10">
              <b className="block text-2xl sm:text-3xl font-mono font-bold text-[#F3EBDD] tabular-nums">
                {String(minutes).padStart(2, '0')}
              </b>
              <small className="text-[9px] font-mono tracking-widest uppercase text-[#C8A978]">
                MINS
              </small>
            </div>
            <div className="p-2 bg-white/5 border border-white/10">
              <b className="block text-2xl sm:text-3xl font-mono font-bold text-[#B65332] tabular-nums">
                {String(seconds).padStart(2, '0')}
              </b>
              <small className="text-[9px] font-mono tracking-widest uppercase text-[#C8A978]">
                SECS
              </small>
            </div>
          </div>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onExploreLegacy}
            className="w-full sm:w-auto button bg-[#B65332] text-white hover:bg-[#B65332]/90 font-bold px-8 py-4 text-xs sm:text-sm tracking-wider cursor-pointer shadow-xl transition-all"
          >
            <span>EXPLORE THE LEGACY</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={onShopCollection}
            className="w-full sm:w-auto button bg-transparent border border-[#F3EBDD]/40 text-[#F3EBDD] hover:bg-[#F3EBDD] hover:text-[#11100E] font-bold px-8 py-4 text-xs sm:text-sm tracking-wider cursor-pointer transition-all"
          >
            <span>SHOP THE COLLECTION</span>
            <ArrowUpRight size={17} />
          </button>
        </motion.div>
      </div>

      {/* Subtle Slide Indicators & Controls at Bottom */}
      <div className="absolute bottom-6 inset-x-0 z-20 max-w-5xl mx-auto px-6 flex items-center justify-between text-white/70">
        {/* Slide Selector Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIdx(idx)}
              className={`group flex items-center gap-2 py-1 px-2.5 transition-all cursor-pointer ${
                currentIdx === idx
                  ? 'border-b-2 border-[#C8A978] text-white'
                  : 'text-white/40 hover:text-white/80'
              }`}
              aria-label={`Go to slide ${s.id}`}
            >
              <span className="font-mono text-xs">{s.id}</span>
              <span className="hidden sm:inline text-[11px] font-mono tracking-wider">
                {s.theme}
              </span>
            </button>
          ))}
        </div>

        {/* Previous / Next Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
