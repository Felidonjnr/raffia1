import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ViewRoute } from '../types';
import { FESTIVAL_EXPERIENCES } from '../data/legacyData';
import { ArrowLeft, Sparkles, MapPin, Calendar, Check, ChevronDown, Maximize2, ArrowUpRight } from 'lucide-react';
import { ImageLightbox, LightboxImage } from '../components/ImageLightbox';

interface FestivalPageProps {
  onNavigate: (route: ViewRoute) => void;
}

const EXPERIENCE_IMAGES: Record<string, string> = {
  '01': 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85',
  '02': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
  '03': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
  '04': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85',
  '05': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
  '06': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85',
  '07': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
  '08': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
};

export const FestivalPage: React.FC<FestivalPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setRegistered(true);
  };

  const faqs = [
    {
      q: 'Where will the Raffia Festival 2027 take place?',
      a: 'The flagship festival grounds will be established across the historic craft center of Ikot Ekpene and the riverine wetland cultural pavilions of Cross River State, Nigeria.',
    },
    {
      q: 'When will visitor and delegate accreditation open?',
      a: 'Official pass reservations for international buyers, curators, and cultural tourists will open in Quarter 4, 2026. Early registrants on this page receive 48-hour priority access.',
    },
    {
      q: 'Can designers apply to showcase at the Fashion Show or Biennale?',
      a: 'Yes. The Create Raffia Design Challenge (Months 05–06 of the Legacy Year) serves as the open jury submission portal for participating runway collections and sculptural installations.',
    },
    {
      q: 'Will on-site purchases at the Raffia Marketplace be shippable internationally?',
      a: 'Dance Ville is partnering with insured international freight couriers to provide turnkey crating and worldwide door-to-door delivery directly from the festival hall.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      {/* Dark Hero Section for High Event Energy with Atmospheric Background Photography */}
      <section className="relative bg-[#1F1A17] text-[#FAF7F2] pt-12 pb-24 px-6 lg:px-12 border-b border-[#FAF7F2]/10 overflow-hidden">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=85"
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
                <span>The Flagship Gathering · Coming October 2027</span>
              </div>
              <h1 className="font-editorial text-5xl sm:text-7xl lg:text-9xl font-light tracking-tight leading-[0.88] text-[#FAF7F2]">
                RAFFIA FESTIVAL <br />
                <span className="italic font-normal text-[#C8B28B]">2027</span>
              </h1>
              <p className="text-base sm:text-xl text-[#FAF7F2]/80 max-w-2xl font-light leading-relaxed pt-2 font-sans">
                The grand culmination of the Legacy Year. Four days of masquerade street pageantry, circular materials summits, runway fashion, and international craft trade under monumental woven pavilions.
              </p>
            </div>

            <div className="lg:col-span-4 bg-[#28221D]/90 backdrop-blur-md p-6 border border-[#FAF7F2]/15 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8B28B]">
                <MapPin className="w-4 h-4 text-[#B84A28]" />
                <span>Location & Venue</span>
              </div>
              <p className="font-editorial text-2xl font-medium text-[#FAF7F2]">
                Ikot Ekpene & Cross River Grounds
              </p>
              <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-sans">
                Akwa Ibom State, Nigeria · Accessible via Uyo (QUO) and Calabar (CBQ) International Airports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 8 Flagship Experiences with Rich Photography Cards */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 border-b border-[#181513]/10">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2 font-bold">
            The Curated Programme
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181513]">
            THE 8 FESTIVAL EXPERIENCES
          </h2>
          <p className="text-sm text-[#73695E] mt-2 font-sans">
            Every day of the festival immerses visitors in a different facet of African craft, couture, performance, and living ecology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FESTIVAL_EXPERIENCES.map((exp) => {
            const img = EXPERIENCE_IMAGES[exp.number] || 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85';
            return (
              <motion.div
                key={exp.number}
                whileHover={{ y: -5 }}
                className="bg-[#FAF7F2] border border-[#181513]/15 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group"
              >
                {/* Visual Image Header */}
                <div
                  onClick={() =>
                    setLightboxImage({
                      src: img,
                      title: `${exp.number}. ${exp.title}`,
                      subtitle: exp.description,
                      location: 'Festival Village Pavilion',
                      category: exp.category,
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
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#181513] text-[#C8B28B] font-mono text-[11px] font-bold">
                    {exp.number}
                  </div>
                  <div className="absolute top-2.5 right-2.5 p-1 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={13} />
                  </div>
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8B28B]">
                      {exp.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial text-xl font-medium text-[#181513] mb-2 leading-snug">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-[#57524E] leading-relaxed mb-4 font-sans">
                      {exp.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#181513]/10 space-y-1 text-xs text-[#181513]">
                    {exp.highlights.map((h, i) => (
                      <p key={i} className="text-[#57524E] flex items-center gap-1.5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B84A28]" />
                        <span>{h}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Travel, Accommodation & FAQs */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 border-b border-[#181513]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B84A28] font-bold">
              Travel & Logistics
            </span>
            <h3 className="font-editorial text-4xl font-light text-[#181513]">
              Visiting The Raffia City
            </h3>
            <p className="text-sm text-[#57524E] leading-relaxed font-sans">
              Curated hotel partner rates, private airport shuttles, and VIP escorted tour itineraries will be published in collaboration with the Akwa Ibom State Tourism Bureau.
            </p>
            <div className="p-6 bg-[#ECE5DC] border border-[#DDD4C5] space-y-3 text-xs">
              <p className="font-mono uppercase text-[#8C7355] font-bold">Airport Gateway</p>
              <p className="text-[#181513] font-medium text-sm">Victor Attah International Airport (Uyo)</p>
              <p className="text-[#57524E] font-sans">45-minute scenic highway transfer to the festival grounds.</p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8C7355] block mb-2 font-bold">
              Frequently Asked Questions
            </span>
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

      {/* Priority Passes Registration Form */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-20">
        <div className="bg-[#181513] text-[#FAF7F2] p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C8B28B] block mb-3 font-bold">
            Priority VIP & Patron Registry
          </span>
          <h3 className="font-editorial text-4xl sm:text-5xl font-light text-[#FAF7F2] mb-4">
            Reserve Early Pass Access
          </h3>
          <p className="text-sm text-[#FAF7F2]/70 leading-relaxed mb-8 max-w-lg mx-auto font-sans">
            Receive accredited invitations to the Economy Summit, front-row runway access, and private curator walks before tickets are released publicly.
          </p>

          {!registered ? (
            <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="flex-1 px-4 py-3 bg-[#28221D] border border-[#FAF7F2]/20 text-xs text-[#FAF7F2] focus:border-[#C8B28B] focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#C8B28B] text-[#181513] text-xs font-mono uppercase tracking-widest font-semibold hover:bg-white transition-colors cursor-pointer"
              >
                Register Interest
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#28221D] text-xs text-[#C8B28B] max-w-md mx-auto flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Thank you. Your early access priority credentials have been registered.</span>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};
