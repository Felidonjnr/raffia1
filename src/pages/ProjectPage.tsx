import React, { useState } from 'react';
import { ArrowUpRight, ArrowLeft, Maximize2, MapPin } from 'lucide-react';
import { ViewRoute } from '../types';
import { BrushStrokeUnderline } from '../components/RaffiaLogo';
import { ImageLightbox, LightboxImage } from '../components/ImageLightbox';

interface ProjectPageProps {
  initialSection?: 'about' | 'vision' | 'legacy-year' | 'programmes' | 'impact' | 'partners';
  onNavigate: (route: ViewRoute) => void;
}

const sections = [
  ['about', 'About the Project'],
  ['vision', 'Our Vision'],
  ['legacy-year', 'The Legacy Year'],
  ['programmes', 'Our Programmes'],
  ['impact', 'Impact'],
  ['partners', 'Partners'],
] as const;

export const ProjectPage: React.FC<ProjectPageProps> = ({ initialSection = 'about', onNavigate }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const jump = (id: string) => {
    setActiveSection(id as any);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="project-page bg-[#F3EBDD] text-[#11100E]">
      {/* Hero with Event Branding Lockup */}
      <section className="project-hero border-b border-[#241A14]/15 bg-[#F3EBDD]">
        <div>
          <button className="text-link project-back mb-6 inline-flex items-center gap-2 text-xs font-mono font-bold" onClick={() => onNavigate({ type: 'home' })}>
            <ArrowLeft size={16} /> RETURN HOME
          </button>
          <p className="eyebrow text-[#B65332] font-mono text-xs font-bold tracking-widest uppercase">THE RAFFIA LEGACY PROJECT</p>
          <div className="hero-logo-lockup my-3">
            <h1 className="hero-brand-heading flex flex-wrap items-baseline gap-2">
              <span className="hero-brand-raffia font-serif text-5xl sm:text-7xl">Raffia</span>
              <span className="hero-brand-legacy font-sans font-black text-5xl sm:text-7xl text-[#B65332]">LEGACY</span>
              <span className="hero-brand-project font-sans font-bold text-2xl sm:text-4xl text-[#11100E]">PROJECT</span>
            </h1>
            <div className="hero-brush-wrap mt-2 max-w-sm">
              <BrushStrokeUnderline className="hero-brush-stroke w-full h-3" color="#B65332" />
            </div>
          </div>
        </div>
        <div>
          <p className="project-hero-lede text-base sm:text-lg text-[#241A14] font-medium leading-relaxed">
            A year-round programme celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.
          </p>
          <p className="project-meta text-xs font-mono text-[#B65332] font-bold tracking-wider mt-4">
            CULTURE · CREATIVITY · ENTERPRISE · COMMUNITY
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="project-tabs sticky top-20 z-20 bg-[#F3EBDD]/95 backdrop-blur-md border-b border-[#241A14]/15 py-3 px-6 overflow-x-auto flex gap-4" aria-label="Project sections">
        {sections.map(([id, label]) => (
          <button
            key={id}
            className={`whitespace-nowrap px-3 py-1.5 text-xs font-mono tracking-wider font-bold transition-colors cursor-pointer border ${
              activeSection === id ? 'bg-[#241A14] text-white border-[#241A14]' : 'bg-transparent text-[#73695E] border-transparent hover:border-[#241A14]/20 hover:text-[#11100E]'
            }`}
            onClick={() => jump(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* 01. ABOUT THE PROJECT */}
      <section id="about" className="project-block project-about py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-1 project-index text-4xl sm:text-6xl font-mono font-bold text-[#B65332]">
          01
        </div>
        <div className="lg:col-span-6 project-copy space-y-6">
          <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">ABOUT THE PROJECT</p>
          <h2 className="text-3xl sm:text-5xl font-black text-[#11100E] leading-tight">
            RAFFIA IS MORE THAN<br />
            <em className="text-[#B65332] font-serif font-normal">A MATERIAL.</em>
          </h2>
          <p className="text-base sm:text-lg text-[#241A14] font-medium leading-relaxed font-sans">
            Raffia carries history, skill, identity and possibility. Used across generations for clothing, craft, shelter, dance, ceremony and everyday life.
          </p>
          <p className="text-sm text-[#73695E] leading-relaxed font-sans">
            The Raffia Legacy Project connects traditional knowledge with contemporary fashion, art, design, tourism, technology and enterprise.
          </p>
          <div className="project-statement p-5 bg-[#EAE1D1] border-l-4 border-[#B65332] text-sm sm:text-base font-mono font-bold text-[#11100E] tracking-wider leading-relaxed">
            FROM PALM TO PRODUCT.<br />
            CULTURE TO COMMERCE.<br />
            HERITAGE TO OPPORTUNITY.
          </div>
        </div>

        {/* Photography Showcase for About */}
        <div className="lg:col-span-5 relative">
          <div
            onClick={() =>
              setLightboxImage({
                src: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1800&q=85',
                title: 'The Ancestral Loom of Ikot Ekpene',
                subtitle: 'Mathematical precision and hand tension preserved over 200 years.',
                location: 'Akwa Ibom State, Nigeria',
                category: 'HERITAGE ARCHIVE',
              })
            }
            className="relative aspect-[4/3] w-full overflow-hidden shadow-xl border border-[#241A14]/15 group cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=85"
              alt="Artisan at loom"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-sans flex items-center justify-between">
              <span>IKOT EKPENE MASTER WEAVERS</span>
              <Maximize2 size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 02. OUR VISION: 5 CONNECTED PILLARS WITH PHOTOGRAPHY */}
      <section id="vision" className="project-block project-vision py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto space-y-10">
        <div className="flex items-center gap-6">
          <div className="project-index text-4xl sm:text-6xl font-mono font-bold text-[#B65332]">02</div>
          <div>
            <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">OUR VISION</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
              TURNING HERITAGE <em className="text-[#B65332] font-serif font-normal">INTO POSSIBILITY.</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              n: '01',
              t: 'CULTURE',
              d: 'Celebrating raffia heritage, dance masquerades, and community identity.',
              img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '02',
              t: 'CREATIVITY',
              d: 'Connecting traditional knowledge with contemporary fashion and sculpture.',
              img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '03',
              t: 'OPPORTUNITY',
              d: 'Creating fair-trade pathways for value, living wages, and guild enterprise.',
              img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '04',
              t: 'TOURISM',
              d: 'Connecting wetland trails and living ateliers with global travelers.',
              img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '05',
              t: 'LEGACY',
              d: 'Building school curricula and endowments for the next generation.',
              img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            },
          ].map((item) => (
            <div
              key={item.n}
              onClick={() =>
                setLightboxImage({
                  src: item.img,
                  title: `${item.n}. ${item.t}`,
                  subtitle: item.d,
                  category: 'PROJECT PILLAR',
                })
              }
              className="bg-[#EAE1D1] border border-[#241A14]/15 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#241A14]">
                <img
                  src={item.img}
                  alt={item.t}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#241A14] text-white font-mono text-[10px] font-bold">
                  {item.n}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-mono text-base font-bold text-[#11100E] mb-1">{item.t}</h3>
                <p className="text-xs text-[#73695E] leading-relaxed font-sans">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03. THE LEGACY YEAR */}
      <section id="legacy-year" className="project-block project-year py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-1 project-index text-4xl sm:text-6xl font-mono font-bold text-[#B65332]">
          03
        </div>
        <div className="lg:col-span-7 project-copy space-y-6">
          <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">THE LEGACY YEAR</p>
          <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
            THE FESTIVAL <em className="text-[#B65332] font-serif font-normal">IS ONLY THE BEGINNING.</em>
          </h2>
          <p className="text-base sm:text-lg text-[#241A14] font-medium leading-relaxed font-sans">
            The strongest part of the project is what happens before and after the festival—connecting schools, youth, designers, and cooperatives.
          </p>
          <div className="year-line grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-4">
            {['DISCOVER', 'IMAGINE', 'CREATE', 'BUILD', 'CELEBRATE', 'PASS IT ON'].map((x, i) => (
              <div key={x} className="p-3 bg-[#EAE1D1] border border-[#241A14]/15 text-center">
                <span className="text-[10px] font-mono text-[#B65332] block font-bold">0{i + 1}</span>
                <strong className="text-xs font-mono text-[#11100E]">{x}</strong>
              </div>
            ))}
          </div>
          <div>
            <button className="button bg-[#241A14] text-white hover:bg-[#B65332] px-6 py-3.5 text-xs font-mono uppercase font-bold cursor-pointer transition-all flex items-center gap-2" onClick={() => onNavigate({ type: 'legacy_year' })}>
              <span>EXPLORE THE LEGACY YEAR</span>
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div
            onClick={() =>
              setLightboxImage({
                src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85',
                title: 'Celebration at Twilight',
                subtitle: 'Four days and nights uniting global creators with local guild communities.',
                category: 'THE FESTIVAL MOMENT',
              })
            }
            className="relative aspect-[4/3] w-full overflow-hidden shadow-xl border border-[#241A14]/15 group cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85"
              alt="Festival celebration"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-sans flex items-center justify-between">
              <span>CULMINATION · FESTIVAL 2027</span>
              <Maximize2 size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 04. OUR PROGRAMMES IN MOTION */}
      <section id="programmes" className="project-block project-programmes py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto space-y-10">
        <div className="flex items-center gap-6">
          <div className="project-index text-4xl sm:text-6xl font-mono font-bold text-[#B65332]">04</div>
          <div>
            <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">OUR PROGRAMMES</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
              THE WORK <em className="text-[#B65332] font-serif font-normal">IN MOTION.</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              n: '01',
              t: 'DISCOVER RAFFIA SCHOOL PROGRAMME',
              d: 'A school-based pathway introducing young people to palm botany and geometric weaving traditions.',
              img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '02',
              t: 'YOUNG RAFFIA INNOVATORS',
              d: 'A fellowship programme centred on young engineers prototyping bio-plastics, packaging, and circular design.',
              img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '03',
              t: 'CREATE RAFFIA DESIGN CHALLENGE',
              d: 'Pairing master weavers with contemporary labels to craft runway collections for the festival.',
              img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '04',
              t: 'RAFFIA BUSINESS INCUBATOR',
              d: 'Equipping rural cooperative workshops with digital tools, fair-trade certifications, and export logistics.',
              img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '05',
              t: 'CELEBRATE RAFFIA FESTIVAL',
              d: 'The flagship physical celebration uniting artisans, international buyers, and performers in Akwa Ibom.',
              img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
            },
            {
              n: '06',
              t: 'PASS IT ON / COMMUNITY ENDOWMENT',
              d: 'Reinvesting marketplace profits into permanent craft endowments and apprentice healthcare.',
              img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
            },
          ].map((item) => (
            <div
              key={item.n}
              onClick={() =>
                setLightboxImage({
                  src: item.img,
                  title: `${item.n}. ${item.t}`,
                  subtitle: item.d,
                  category: 'PROGRAMME ACTION',
                })
              }
              className="bg-[#FAF7F2] border border-[#241A14]/15 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#241A14]">
                <img
                  src={item.img}
                  alt={item.t}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#241A14] text-white font-mono text-[10px] font-bold">
                  {item.n}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-[#11100E] mb-2 leading-snug">{item.t}</h3>
                  <p className="text-xs text-[#73695E] leading-relaxed font-sans">{item.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05. IMPACT & VALUE */}
      <section id="impact" className="project-block project-impact py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto space-y-8">
        <div className="flex items-center gap-6">
          <div className="project-index text-4xl sm:text-6xl font-mono font-bold text-[#B65332]">05</div>
          <div>
            <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">IMPACT & VALUE</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
              CREATE VALUE <em className="text-[#B65332] font-serif font-normal">FROM WHAT WE ALREADY HAVE.</em>
            </h2>
          </div>
        </div>

        <p className="text-base text-[#73695E] max-w-2xl font-sans">
          The project creates value, fair-trade jobs, and international export opportunities across a connected regional ecosystem.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            'YOUNG PEOPLE',
            'ARTISANS',
            'FARMERS',
            'CREATIVES',
            'BUSINESSES',
            'COMMUNITY',
            'HOST DESTINATION',
            'WIDER ECONOMY',
          ].map((x) => (
            <div key={x} className="p-4 bg-[#EAE1D1] border border-[#241A14]/15 font-mono text-xs font-bold text-[#11100E] text-center">
              {x}
            </div>
          ))}
        </div>
      </section>

      {/* 06. PARTNERS */}
      <section id="partners" className="project-block project-partners py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto space-y-8">
        <div className="flex items-center gap-6">
          <div className="project-index text-4xl sm:text-6xl font-mono font-bold text-[#B65332]">06</div>
          <div>
            <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">PARTNERS</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
              THERE IS A PLACE <em className="text-[#B65332] font-serif font-normal">FOR YOU IN THE LEGACY.</em>
            </h2>
          </div>
        </div>

        <p className="text-base text-[#73695E] max-w-2xl font-sans">
          We are seeking collaborators, institutions, cultural foundations, and enterprise partners dedicated to African craft continuity.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            'FESTIVAL SPONSORS',
            'PROGRAMME SPONSORS',
            'LEGACY PARTNERS',
            'KNOWLEDGE PARTNERS',
            'MEDIA & CREATIVE PARTNERS',
            'TOURISM & DESTINATION PARTNERS',
          ].map((x) => (
            <div key={x} className="p-4 bg-[#EAE1D1] border border-[#241A14]/15 font-mono text-xs font-bold text-[#11100E] text-center">
              {x}
            </div>
          ))}
        </div>
      </section>

      {/* Closing Statement */}
      <section className="project-close py-24 text-center bg-[#11100E] text-white">
        <p className="text-xs font-mono text-[#C8A978] tracking-widest uppercase font-bold mb-2">THE RAFFIA LEGACY PROJECT</p>
        <h2 className="text-3xl sm:text-5xl font-black">
          OUR HERITAGE.<br />
          OUR PEOPLE.<br />
          <em className="text-[#C8A978] font-serif font-normal">OUR FUTURE.</em>
        </h2>
      </section>

      {/* Lightbox Modal */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};
