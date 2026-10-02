import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewRoute } from '../types';
import { LEGACY_YEAR_STAGES } from '../data/legacyData';
import { ArrowLeft, Calendar, CheckCircle2, Sparkles, Maximize2 } from 'lucide-react';
import { ImageLightbox, LightboxImage } from '../components/ImageLightbox';

interface LegacyYearPageProps {
  onNavigate: (route: ViewRoute) => void;
}

const STAGE_IMAGES: Record<string, { src: string; caption: string; location: string }> = {
  '01': {
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Children discover raffia, heritage, craft, Utta, music, storytelling, nature and creativity.',
    location: 'Akwa Ibom State, Nigeria',
  },
  '02': {
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    caption: 'Young people ask: "What can raffia become in the future?"',
    location: 'Akwa Ibom State, Nigeria',
  },
  '03': {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    caption: 'Artisans, designers and creatives turn heritage into new products, fashion, art, performance and design.',
    location: 'Akwa Ibom State, Nigeria',
  },
  '04': {
    src: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    caption: 'Strong ideas become products, businesses, partnerships and livelihoods.',
    location: 'Akwa Ibom State, Nigeria',
  },
  '05': {
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    caption: 'The community and the world experience the culture, creativity, products and opportunities created throughout the year.',
    location: 'Ikot Ekpene LGA, Akwa Ibom State',
  },
  '06': {
    src: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
    caption: 'New students, artisans, designers and entrepreneurs enter the ecosystem. The cycle continues.',
    location: 'Ikot Ekpene LGA, Akwa Ibom State',
  },
};

export const LegacyYearPage: React.FC<LegacyYearPageProps> = ({ onNavigate }) => {
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const activeStage = LEGACY_YEAR_STAGES[selectedStageIdx];
  const activeImageData = STAGE_IMAGES[activeStage.step] || STAGE_IMAGES['01'];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      {/* Header strictly from PDF Page 4 */}
      <section className="relative pt-12 pb-16 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <button
          onClick={() => onNavigate({ type: 'project' })}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#57524E] hover:text-[#181513] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to The Project</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-3 font-bold">
              04 / THE LEGACY YEAR
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#181513] leading-[1.05]">
              THE LEGACY YEAR
            </h1>
            <p className="font-editorial italic text-2xl sm:text-3xl text-[#57524E] font-normal mt-2">
              The festival is only the beginning.
            </p>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#57524E] leading-relaxed max-w-md font-sans">
              The strongest part of the Raffia Legacy Project is what happens before and after the festival. Five connected programmes create a continuous journey.
            </p>
          </div>
        </div>
      </section>

      {/* Stage Selector Ribbon */}
      <section className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#181513]/10 py-3 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-mono uppercase">
          {LEGACY_YEAR_STAGES.map((stg, idx) => (
            <button
              key={stg.step}
              onClick={() => setSelectedStageIdx(idx)}
              className={`px-4 py-2 whitespace-nowrap transition-all cursor-pointer border ${
                selectedStageIdx === idx
                  ? 'bg-[#181513] text-[#FAF7F2] border-[#181513] font-semibold shadow-md'
                  : 'bg-[#FAF7F2] text-[#57524E] border-[#181513]/10 hover:border-[#181513]/30'
              }`}
            >
              <span>{stg.step}. {stg.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Deep Stage Inspection Card */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12">
        <div className="bg-[#FAF7F2] border border-[#181513]/15 p-6 sm:p-12 shadow-sm space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Stage Photography */}
            <div className="lg:col-span-6 relative aspect-[16/11] overflow-hidden bg-[#241A14] border border-[#181513]/15 shadow-lg group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.step}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeImageData.src}
                    alt={activeStage.program}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/85 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#181513] text-[#C8B28B] font-mono text-xs font-bold">
                    PROGRAMME {activeStage.step}
                  </div>
                  <button
                    onClick={() =>
                      setLightboxImage({
                        src: activeImageData.src,
                        title: `${activeStage.step}. ${activeStage.program}`,
                        subtitle: activeImageData.caption,
                        location: activeImageData.location,
                        category: `THE LEGACY YEAR`,
                      })
                    }
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-[#B84A28] text-white transition-colors cursor-pointer border border-white/20"
                    title="Inspect photo"
                  >
                    <Maximize2 size={14} />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-sans">
                    <p className="font-semibold">{activeImageData.caption}</p>
                    <span className="text-xs font-mono text-[#C8B28B] uppercase block mt-0.5">
                      {activeImageData.location}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stage Overview & Description from PDF Page 4 */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#B84A28] font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>PROGRAMME {activeStage.step}</span>
                <span>·</span>
                <span>{activeStage.title}</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#181513] leading-tight">
                {activeStage.program}
              </h2>

              <p className="text-base sm:text-lg text-[#57524E] leading-relaxed font-sans">
                {activeStage.summary}
              </p>

              <div className="p-5 bg-[#ECE5DC] border border-[#DDD4C5] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C7355] font-bold">
                  <Sparkles className="w-4 h-4 text-[#B84A28]" />
                  <span>Key Elements</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#181513] font-sans">
                  {activeStage.outcomes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#B84A28] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="pt-6 border-t border-[#181513]/10 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#57524E]">
            <button
              disabled={selectedStageIdx === 0}
              onClick={() => setSelectedStageIdx((i) => Math.max(0, i - 1))}
              className="hover:text-[#181513] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold"
            >
              ← Previous Programme
            </button>
            <span className="text-[#8C7355]">
              Programme {selectedStageIdx + 1} of {LEGACY_YEAR_STAGES.length}
            </span>
            <button
              disabled={selectedStageIdx === LEGACY_YEAR_STAGES.length - 1}
              onClick={() => setSelectedStageIdx((i) => Math.min(LEGACY_YEAR_STAGES.length - 1, i + 1))}
              className="hover:text-[#181513] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold"
            >
              Next Programme →
            </button>
          </div>
        </div>

        {/* Full Overview Visual Grid */}
        <div className="mt-16 pt-16 border-t border-[#181513]/10">
          <h3 className="font-editorial text-3xl font-light text-[#181513] mb-8">
            The Continuous Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEGACY_YEAR_STAGES.map((s, idx) => {
              const sImg = STAGE_IMAGES[s.step]?.src || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={s.step}
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`bg-[#FAF7F2] border overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedStageIdx === idx ? 'border-[#B84A28] ring-1 ring-[#B84A28]' : 'border-[#181513]/15'
                  }`}
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#241A14]">
                    <img
                      src={sImg}
                      alt={s.program}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#181513] text-[#C8B28B] text-xs font-mono font-bold">
                      {s.step}
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-mono uppercase text-[#B84A28] font-bold block mb-1">
                      {s.title}
                    </span>
                    <h4 className="font-editorial text-xl font-medium text-[#181513] mb-2 leading-snug">
                      {s.program}
                    </h4>
                    <p className="text-xs text-[#57524E] font-sans line-clamp-2">
                      {s.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};
