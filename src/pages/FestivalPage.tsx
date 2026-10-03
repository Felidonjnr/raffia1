import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ViewRoute } from '../types';
import { FESTIVAL_EXPERIENCES } from '../data/legacyData';
import { ArrowLeft, Sparkles, MapPin, ChevronDown, Maximize2 } from 'lucide-react';
import { ImageLightbox, LightboxImage } from '../components/ImageLightbox';

interface FestivalPageProps {
  onNavigate: (route: ViewRoute) => void;
}

const EXPERIENCE_IMAGES: Record<string, string> = {
  '01': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
  '02': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
  '03': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
  '04': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
  '05': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',
  '06': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
  '07': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',
  '08': 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG',
};

export const FestivalPage: React.FC<FestivalPageProps> = ({ onNavigate }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const faqs = [
    {
      q: 'Where will the Raffia Festival take place?',
      a: 'The flagship Raffia Festival takes place in Ikot Ekpene LGA, Akwa Ibom State, Nigeria.',
    },
    {
      q: 'What is the Raffia Festival?',
      a: 'The Raffia Festival is the flagship event of the entire project. It brings together communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors for a celebration of what raffia can inspire.',
    },
    {
      q: 'What experiences are featured at the festival?',
      a: 'The festival features 8 flagship experiences: Raffia Parade, Raffia Economy Summit, Innovation Lab, Art & Design Biennale, Fashion Show, Dance & Performance (including Utta), Raffia Marketplace, and Raffia Village.',
    },
    {
      q: 'How can partners and sponsors get involved?',
      a: 'Partners can participate as Festival Sponsors, Programme Sponsors, Legacy Partners, Knowledge Partners, Media & Creative Partners, or Tourism & Destination Partners.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      {/* Dark Hero Section for High Event Energy */}
      <section className="relative bg-[#1F1A17] text-[#FAF7F2] pt-12 pb-24 px-6 lg:px-12 border-b border-[#FAF7F2]/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg"
            alt="Festival Atmosphere"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17] via-[#1F1A17]/85 to-[#1F1A17]" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto">
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8B28B] hover:text-[#FAF7F2] transition-colors mb-12 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#C8B28B]/40 text-[#C8B28B] text-xs font-mono uppercase tracking-widest bg-black/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Flagship Event · Coming Soon</span>
              </div>
              <h1 className="font-editorial text-5xl sm:text-7xl lg:text-9xl font-light tracking-tight leading-[0.88] text-[#FAF7F2]">
                THE RAFFIA <br />
                <span className="italic font-normal text-[#C8B28B]">FESTIVAL</span>
              </h1>
              <p className="text-base sm:text-xl text-[#FAF7F2]/80 max-w-2xl font-light leading-relaxed pt-2 font-sans">
                The flagship event of the entire project. It brings together communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors for a celebration of what raffia can inspire.
              </p>
            </div>

            <div className="lg:col-span-4 bg-[#28221D]/90 backdrop-blur-md p-6 border border-[#FAF7F2]/15 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8B28B]">
                <MapPin className="w-4 h-4 text-[#B84A28]" />
                <span>Location</span>
              </div>
              <p className="font-editorial text-2xl font-medium text-[#FAF7F2]">
                Ikot Ekpene LGA
              </p>
              <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-sans">
                Akwa Ibom State, Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 8 Flagship Experiences strictly from PDF Page 3 */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 border-b border-[#181513]/10">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2 font-bold">
            THE FLAGSHIP EVENT
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
            EXPERIENCE RAFFIA IN MANY FORMS
          </h2>
          <p className="text-sm text-[#73695E] mt-2 font-sans">
            Eight flagship experiences from the Raffia Festival.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FESTIVAL_EXPERIENCES.map((exp) => {
            const img = EXPERIENCE_IMAGES[exp.number] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg';
            return (
              <motion.div
                key={exp.number}
                whileHover={{ y: -5 }}
                className="bg-[#FAF7F2] border border-[#181513]/15 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group"
              >
                <div
                  onClick={() =>
                    setLightboxImage({
                      src: img,
                      title: `${exp.number}. ${exp.title}`,
                      subtitle: exp.description,
                      category: 'RAFFIA FESTIVAL',
                    })
                  }
                  className="relative aspect-[16/10] w-full overflow-hidden bg-[#241A14] cursor-pointer"
                >
                  <img
                    src={img}
                    alt={exp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/80 via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#181513] text-[#C8B28B] font-mono text-xs font-bold">
                    {exp.number}
                  </div>
                  <div className="absolute top-2.5 right-2.5 p-1 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={13} />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial text-xl font-medium text-[#181513] mb-2 leading-snug">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-[#57524E] leading-relaxed mb-4 font-sans">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 border-b border-[#181513]/10">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8C7355] block mb-2 font-bold text-center">
            Information
          </span>
          <h3 className="font-editorial text-3xl sm:text-4xl font-light text-[#181513] text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#181513]/10 bg-[#FAF7F2] p-5 cursor-pointer hover:border-[#181513]/30 transition-colors"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between text-sm font-medium text-[#181513]">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#8C7355] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </div>
                {activeFaq === idx && (
                  <p className="text-xs text-[#57524E] leading-relaxed mt-3 pt-3 border-t border-[#181513]/10 font-sans">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-20">
        <div className="bg-[#181513] text-[#FAF7F2] p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C8B28B] block mb-3 font-bold">
            RAFFIA FESTIVAL 2027
          </span>
          <h3 className="font-editorial text-4xl sm:text-5xl font-light text-[#FAF7F2] mb-4">
            COMING SOON
          </h3>
          <p className="text-sm sm:text-base text-[#FAF7F2]/70 leading-relaxed max-w-2xl mx-auto font-sans">
            The flagship celebration of the Raffia Legacy Project. Festival programme, experiences and participation details will be announced as preparations continue.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-bold tracking-wide text-[#C8B28B]">
            <span>RAFFIA PARADE</span><span>•</span><span>ECONOMY SUMMIT</span><span>•</span><span>INNOVATION LAB</span><span>•</span><span>FASHION</span><span>•</span><span>PERFORMANCE</span><span>•</span><span>MARKETPLACE</span><span>•</span><span>RAFFIA VILLAGE</span>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};
