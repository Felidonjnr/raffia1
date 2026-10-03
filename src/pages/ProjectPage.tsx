import React, { useState } from 'react';
import { ArrowUpRight, ArrowLeft, Maximize2 } from 'lucide-react';
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
  ['impact', 'Why This Matters'],
  ['partners', 'Partnerships'],
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
      {/* Hero with Event Branding Lockup (PDF Page 1) */}
      <section className="project-hero border-b border-[#241A14]/15 bg-[#F3EBDD]">
        <div>
          <button className="text-link project-back mb-6 inline-flex items-center gap-2 text-xs font-mono font-bold" onClick={() => onNavigate({ type: 'home' })}>
            <ArrowLeft size={16} /> RETURN HOME
          </button>
          <p className="eyebrow text-[#B65332] font-mono text-xs font-bold tracking-widest uppercase">RAFFIA LEGACY PROJECT</p>
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
          <p className="project-hero-lede text-base sm:text-lg text-[#241A14] font-medium leading-relaxed font-sans">
            A year-round of activities celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.
          </p>
          <p className="project-meta text-xs font-mono text-[#B65332] font-bold tracking-wider mt-4">
            CULTURE | CREATIVITY | ENTERPRISE | COMMUNITY
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

      {/* 01. ABOUT THE PROJECT (PDF Page 2) */}
      <section id="about" className="project-block project-about py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-6 project-copy space-y-6">
          <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">WHY RAFFIA?</p>
          <h2 className="text-3xl sm:text-5xl font-black text-[#11100E] leading-tight">
            RAFFIA IS MORE THAN<br />
            <em className="text-[#B65332] font-serif font-normal">A MATERIAL.</em>
          </h2>
          <p className="text-base sm:text-lg text-[#241A14] font-medium leading-relaxed font-sans">
            It carries history, skill, identity and possibility.
          </p>
          <p className="text-sm text-[#73695E] leading-relaxed font-sans">
            For generations, people have used raffia for clothing, craft, shelter, dance, ceremony and everyday life. Today, we can take that knowledge further.
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

        <div className="lg:col-span-5 relative">
          <div
            onClick={() =>
              setLightboxImage({
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
                title: 'Traditional Knowledge in Motion',
                subtitle: 'Connecting traditional knowledge with contemporary practice.',
                category: 'HERITAGE ARCHIVE',
              })
            }
            className="relative aspect-[4/3] w-full overflow-hidden shadow-xl border border-[#241A14]/15 group cursor-pointer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg"
              alt="Raffia Craft"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-sans flex items-center justify-between">
              <span>IKOT EKPENE LGA, AKWA IBOM STATE</span>
              <Maximize2 size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 02. OUR VISION (PDF Page 2) */}
      <section id="vision" className="project-block project-vision py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto space-y-10">
        <div className="flex items-center gap-6">
          
          <div>
            <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">OUR VISION</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
              TO BUILD A LASTING <em className="text-[#B65332] font-serif font-normal">PLATFORM.</em>
            </h2>
          </div>
        </div>

        <p className="text-base text-[#73695E] font-sans max-w-2xl">
          To build a lasting platform that helps transform raffia heritage into:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              n: '01',
              t: 'CULTURE',
              d: 'Stories, traditions and identity.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
            },
            {
              n: '02',
              t: 'CREATIVITY',
              d: 'Fashion, art, design, music and performance.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',
            },
            {
              n: '03',
              t: 'OPPORTUNITY',
              d: 'Skills, markets, investment and enterprise.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
            },
            {
              n: '04',
              t: 'TOURISM',
              d: 'Experiences that give people a reason to visit and stay.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG',
            },
            {
              n: '05',
              t: 'LEGACY',
              d: 'Knowledge and opportunities passed from one generation to the next.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
            },
          ].map((item) => (
            <div
              key={item.t}
              onClick={() =>
                setLightboxImage({
                  src: item.img,
                  title: item.t,
                  subtitle: item.d,
                  category: 'OUR VISION',
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
              </div>
              <div className="p-4">
                <h3 className="font-mono text-base font-bold text-[#11100E] mb-1">{item.t}</h3>
                <p className="text-xs text-[#73695E] leading-relaxed font-sans">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03. THE LEGACY YEAR (PDF Page 4) */}
      <section id="legacy-year" className="project-block project-year py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 project-copy space-y-6">
          <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">THE LEGACY YEAR</p>
          <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
            THE FESTIVAL <em className="text-[#B65332] font-serif font-normal">IS ONLY THE BEGINNING.</em>
          </h2>
          <p className="text-base sm:text-lg text-[#241A14] font-medium leading-relaxed font-sans">
            The strongest part of the Raffia Legacy Project is what happens before and after the festival. Six connected programmes create a continuous journey.
          </p>
          <div className="year-line grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-4">
            {['DISCOVER', 'IMAGINE', 'CREATE', 'BUILD', 'CELEBRATE', 'PASS IT ON'].map((x, i) => (
              <div key={x} className="p-3 bg-[#EAE1D1] border border-[#241A14]/15 text-center">
                <span className="text-xs font-mono text-[#B65332] block font-bold">0{i + 1}</span>
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
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
                title: 'The Raffia Festival',
                subtitle: 'The flagship event of the entire project.',
                category: 'FLAGSHIP EVENT',
              })
            }
            className="relative aspect-[4/3] w-full overflow-hidden shadow-xl border border-[#241A14]/15 group cursor-pointer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg"
              alt="Raffia Festival"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-sans flex items-center justify-between">
              <span>CELEBRATE · RAFFIA FESTIVAL</span>
              <Maximize2 size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 04. OUR PROGRAMMES (PDF Page 4) */}
      <section id="programmes" className="project-block project-programmes py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto space-y-10">
        <div className="flex items-center gap-6">
          
          <div>
            <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">THE LEGACY YEAR</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
              OUR PROGRAMMES <em className="text-[#B65332] font-serif font-normal">IN MOTION.</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              n: '01',
              t: 'RAFFIA SCHOOL PROGRAMME',
              d: 'Children discover raffia, heritage, craft, Utta, music, storytelling, nature and creativity.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
            },
            {
              n: '02',
              t: 'YOUNG RAFFIA INNOVATORS',
              d: 'Young people ask: "What can raffia become in the future?"',
              img: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Panel%2C_Bushong_people%2C_mid-20th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_openwork_embroidery%2C_and_wrapping%2C_HMA.JPG',
            },
            {
              n: '03',
              t: 'RAFFIA DESIGN CHALLENGE',
              d: 'Artisans, designers and creatives turn heritage into new products, fashion, art, performance and design.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Woman%27s_ceremonial_overskirt%2C_Shoowa%2C_late_19th_century%2C_raffia_palm_fiber%2C_plain_weave%2C_cut-pile_embroidery%2C_HMA.JPG',
            },
            {
              n: '04',
              t: 'RAFFIA BUSINESS INCUBATOR',
              d: 'Strong ideas become products, businesses, partnerships and livelihoods.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kongo_Basket.jpg/1280px-Kongo_Basket.jpg',
            },
            {
              n: '05',
              t: 'RAFFIA FESTIVAL',
              d: 'The community and the world experience the culture, creativity, products and opportunities created throughout the year.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1280px-Raffia_Basket_Making.jpg',
            },
            {
              n: '06',
              t: 'THE NEXT LEGACY YEAR',
              d: 'New students, artisans, designers and entrepreneurs enter the ecosystem. The cycle continues.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Raffia_hand_bag.jpg/1000px-Raffia_hand_bag.jpg',
            },
          ].map((item) => (
            <div
              key={item.t}
              onClick={() =>
                setLightboxImage({
                  src: item.img,
                  title: item.t,
                  subtitle: item.d,
                  category: 'OUR PROGRAMMES',
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

      {/* 05. WHY THIS MATTERS (PDF Page 6) */}
      <section id="impact" className="project-block project-impact py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto space-y-8">
        <div className="flex items-center gap-6">
          
          <div>
            <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">VALUE CREATION</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
              THE LEGACY <em className="text-[#B65332] font-serif font-normal">WE WANT TO CREATE.</em>
            </h2>
          </div>
        </div>

        <p className="text-base text-[#73695E] max-w-2xl font-sans">
          The Raffia Legacy Project is designed to create value at many levels:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div key={v.title} className="p-5 bg-[#EAE1D1] border border-[#241A14]/15">
              <h4 className="font-mono text-xs font-bold text-[#11100E] mb-2">{v.title}</h4>
              <p className="text-xs text-[#73695E] font-sans leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-[#241A14] text-[#F3EBDD] text-center border border-[#C8A978]/30">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C8A978] mb-1 font-bold">THE GOAL IS SIMPLE</p>
          <p className="font-editorial text-xl sm:text-2xl font-light">
            Create value from what we already have—and open the door to what is possible.
          </p>
        </div>
      </section>

      {/* 06. PARTNERSHIP OPPORTUNITIES (PDF Page 7 & 8) */}
      <section id="partners" className="project-block project-partners py-20 px-6 sm:px-12 border-b border-[#241A14]/15 max-w-[1560px] mx-auto space-y-8">
        <div className="flex items-center gap-6">
          
          <div>
            <p className="eyebrow text-xs font-mono text-[#B65332] tracking-widest uppercase font-bold">PARTNERSHIPS</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#11100E]">
              THERE IS A PLACE <em className="text-[#B65332] font-serif font-normal">FOR YOU IN THE LEGACY.</em>
            </h2>
          </div>
        </div>

        <p className="text-base text-[#73695E] max-w-2xl font-sans">
          We welcome partners who want to help build something meaningful. We are looking for collaborators, not just cheques.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'FESTIVAL SPONSORS',
              desc: 'Support the flagship Raffia Festival and connect your brand with culture, creativity, community and innovation.',
            },
            {
              title: 'PROGRAMME SPONSORS',
              desc: 'Support a specific area such as: Raffia School Programme, Young Raffia Innovators, Design Challenge, Fashion Show, Art & Design Biennale, Dance & Performance, Innovation Lab, Raffia Economy Summit, Marketplace, Youth Programmes.',
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
            <div key={p.title} className="p-6 bg-[#EAE1D1] border border-[#241A14]/15">
              <h4 className="font-mono text-sm font-bold text-[#11100E] mb-2">{p.title}</h4>
              <p className="text-xs text-[#73695E] font-sans leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#241A14] text-[#C8A978] font-mono text-xs text-center font-bold tracking-wider">
          DONATE • SPONSOR AN ACTIVITY • GIVE IN-KIND • VOLUNTEER • SHARE YOUR EXPERTISE
        </div>
      </section>

      {/* Closing Statement (PDF Page 9) */}
      <section className="project-close py-24 text-center bg-[#11100E] text-white">
        <p className="text-xs font-mono text-[#C8A978] tracking-widest uppercase font-bold mb-2">THE INVITATION</p>
        <h2 className="text-3xl sm:text-5xl font-black">
          THAT IS THE LEGACY.<br />
          <em className="text-[#C8A978] font-serif font-normal text-2xl sm:text-3xl block mt-2">
            RAFFIA IS OUR THREAD. THE FUTURE IS WHAT WE WEAVE WITH IT.
          </em>
        </h2>
      </section>

      {/* Lightbox Modal */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};
