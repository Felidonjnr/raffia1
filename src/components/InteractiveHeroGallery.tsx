import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { BrushStrokeUnderline } from './RaffiaLogo';

export interface HeroSlide {
  id: string;
  theme: string;
  title: string;
  image: string;
  caption: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: '01',
    theme: 'THE MOVEMENT',
    title: 'Heritage, Creativity & Opportunity',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    caption: 'Celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.',
  },
  {
    id: '02',
    theme: 'CREATIVITY',
    title: 'Fashion, Art & Performance',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',
    caption: 'Where traditional techniques meet contemporary fashion, art, design, music and performance.',
  },
  {
    id: '03',
    theme: 'THE MAKERS',
    title: 'Traditional Knowledge & Craft',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    caption: 'Artisans, designers and creatives turn heritage into new products, fashion, art, performance and design.',
  },
  {
    id: '04',
    theme: 'THE FESTIVAL',
    title: 'The Flagship Gathering',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
    caption: 'Bringing together communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors.',
  },
  {
    id: '05',
    theme: 'THE VILLAGE',
    title: 'From Palm to Craft',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG',
    caption: 'Step into the world of raffia—from palm to craft.',
  },
];

interface InteractiveHeroGalleryProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  onExploreLegacy: () => void;
  onShopCollection: () => void;
  onInspectImage?: (slide: HeroSlide) => void;
}

export const InteractiveHeroGallery: React.FC<InteractiveHeroGalleryProps> = ({
  days,
  hours,
  minutes,
  seconds,
  onExploreLegacy,
  onShopCollection,
  onInspectImage,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 7000;

  useEffect(() => {
    if (isHovered) return;

    const intervalStep = 50;
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIdx((current) => (current + 1) % HERO_SLIDES.length);
          return 0;
        }
        return prev + (intervalStep / SLIDE_DURATION) * 100;
      });
    }, intervalStep);

    return () => clearInterval(progressTimer);
  }, [isHovered, currentIdx]);

  const slide = HERO_SLIDES[currentIdx];

  const prevSlide = () => {
    setProgress(0);
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setProgress(0);
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const selectSlide = (idx: number) => {
    setProgress(0);
    setCurrentIdx(idx);
  };

  return (
    <div
      className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#11100E] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cinematic Ken Burns Animated Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: 1,
            scale: [1.02, 1.09],
            x: [0, -10],
          }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 8, ease: 'linear' },
            x: { duration: 8, ease: 'linear' },
          }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#11100E]/80 via-transparent to-[#11100E]" />
          <div className="absolute inset-0 bg-[#241A14]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(17,16,14,0.85)_100%)]" />
        </motion.div>
      </AnimatePresence>

      {/* Top Floating Event Pulse Beacon */}
      <div className="absolute top-24 lg:top-28 inset-x-0 z-20 flex justify-center px-6 pointer-events-none">
        <div className="glass-pill px-4 py-1.5 flex items-center gap-2.5 text-[#F3EBDD] text-xs font-mono uppercase tracking-widest border border-[#C8A978]/30 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#B65332] pulse-beacon" />
          <span className="text-[#C8A978] font-bold">CULTURE · CREATIVITY · ENTERPRISE · COMMUNITY</span>
          <span className="hidden sm:inline text-white/40">·</span>
          <span className="hidden sm:inline text-white/80">IKOT EKPENE LGA, AKWA IBOM STATE</span>
        </div>
      </div>

      {/* Main Event Lockup: High-Impact Typography Grounded in Imagery */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28 text-center flex flex-col items-center justify-center mt-12 sm:mt-8">
        {/* Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 sm:mb-5"
        >
          <p className="text-xs sm:text-sm font-mono tracking-[0.28em] text-[#C8A978] uppercase font-bold drop-shadow-md">
            DANCE VILLE PRESENTS
          </p>
        </motion.div>

        {/* Master Brand Heading Lockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
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
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
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
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              }}
            >
              LEGACY
            </span>
          </div>

          <div className="w-full max-w-md sm:max-w-lg mt-3 sm:mt-4 overflow-visible filter drop-shadow-lg">
            <BrushStrokeUnderline
              className="w-full h-3 sm:h-4"
              color="#B65332"
            />
          </div>
        </motion.div>

        {/* Event Cadence Tagline (PDF Page 1) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-7 max-w-2xl"
        >
          <p className="text-sm sm:text-base md:text-lg font-mono tracking-widest text-[#F3EBDD] uppercase font-bold drop-shadow-sm">
            A YEAR-ROUND CELEBRATION OF RAFFIA
          </p>
          <p className="text-xs sm:text-sm text-[#F3EBDD]/90 mt-2 font-sans leading-relaxed max-w-xl mx-auto drop-shadow">
            A year-round of activities celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.
          </p>
        </motion.div>

        {/* Festival Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-9 w-full max-w-md bg-[#241A14]/85 backdrop-blur-md p-4 sm:p-5 border border-white/20 shadow-2xl"
        >
          <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-[#C8A978] pb-2.5 border-b border-white/10 mb-3">
            <span>THE RAFFIA FESTIVAL</span>
            <strong className="text-white">COMING SOON</strong>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-white">
            <div className="p-2.5 bg-white/5 border border-white/10">
              <b className="block text-2xl sm:text-3xl font-mono font-bold text-[#F3EBDD] tabular-nums">
                {String(days).padStart(2, '0')}
              </b>
              <small className="text-xs font-mono tracking-widest uppercase text-[#C8A978] font-bold block mt-0.5">
                DAYS
              </small>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10">
              <b className="block text-2xl sm:text-3xl font-mono font-bold text-[#F3EBDD] tabular-nums">
                {String(hours).padStart(2, '0')}
              </b>
              <small className="text-xs font-mono tracking-widest uppercase text-[#C8A978] font-bold block mt-0.5">
                HOURS
              </small>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10">
              <b className="block text-2xl sm:text-3xl font-mono font-bold text-[#F3EBDD] tabular-nums">
                {String(minutes).padStart(2, '0')}
              </b>
              <small className="text-xs font-mono tracking-widest uppercase text-[#C8A978] font-bold block mt-0.5">
                MINUTES
              </small>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10">
              <b className="block text-2xl sm:text-3xl font-mono font-bold text-[#B65332] tabular-nums">
                {String(seconds).padStart(2, '0')}
              </b>
              <small className="text-xs font-mono tracking-widest uppercase text-[#C8A978] font-bold block mt-0.5">
                SECONDS
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
            className="w-full sm:w-auto button bg-[#B65332] text-white hover:bg-[#a04627] font-bold px-8 py-4 text-xs sm:text-sm tracking-wider cursor-pointer shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>EXPLORE THE PROJECT</span>
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onShopCollection}
            className="w-full sm:w-auto button bg-transparent border-2 border-[#F3EBDD]/60 text-[#F3EBDD] hover:bg-[#F3EBDD] hover:text-[#11100E] font-bold px-8 py-4 text-xs sm:text-sm tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>RAFFIA MARKETPLACE</span>
            <ArrowUpRight size={17} />
          </button>

          {onInspectImage && (
            <button
              onClick={() => onInspectImage(slide)}
              className="p-3 bg-white/10 hover:bg-white/25 text-white/80 hover:text-white border border-white/20 transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-mono"
              title="Inspect photography in full screen"
            >
              <Maximize2 size={16} />
              <span>VIEW PHOTO</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Bottom Thumbnail Strip & Navigation Controls */}
      <div className="absolute bottom-6 inset-x-0 z-20 max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/75">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {HERO_SLIDES.map((s, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={s.id}
                onClick={() => selectSlide(idx)}
                className={`group relative flex items-center gap-2.5 px-3 py-1.5 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#241A14]/90 border-[#C8A978] text-white shadow-lg'
                    : 'bg-[#11100E]/70 border-white/15 text-white/50 hover:text-white hover:border-white/40'
                }`}
                aria-label={`View slide ${s.id}: ${s.theme}`}
              >
                <div className="w-6 h-6 rounded-xs overflow-hidden shrink-0 hidden sm:block">
                  <img
                    src={s.image}
                    alt={s.theme}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#C8A978]">
                      {s.id}
                    </span>
                    <span className="text-xs font-mono tracking-wider uppercase font-semibold">
                      {s.theme}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#B65332]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15 transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15 transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
