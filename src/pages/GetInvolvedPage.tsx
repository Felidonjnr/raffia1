import React from 'react';
import { ArrowRight, ArrowUpRight, Handshake, Heart, Users, GraduationCap, Palette, BriefcaseBusiness, Megaphone } from 'lucide-react';
import { ViewRoute } from '../types';

type GetInvolvedSection = 'partner' | 'sponsor' | 'donate' | 'volunteer' | 'maker' | 'schools' | 'young-people' | 'creatives' | 'businesses' | 'media';

interface GetInvolvedPageProps {
  initialSection?: GetInvolvedSection;
  onNavigate: (route: ViewRoute) => void;
}

const pathways = [
  {
    id: 'partner',
    title: 'BECOME A PARTNER',
    eyebrow: 'PARTNERSHIP',
    description: 'Bring your organisation, expertise, network or resources into the Raffia Legacy Project.',
    icon: Handshake,
  },
  {
    id: 'sponsor',
    title: 'SPONSOR THE FESTIVAL',
    eyebrow: 'SPONSORSHIP',
    description: 'Support the flagship Raffia Festival or a specific programme within the year-round project.',
    icon: BriefcaseBusiness,
  },
  {
    id: 'donate',
    title: 'DONATE',
    eyebrow: 'GIVING',
    description: 'Help create opportunities by supporting the work, activities and experiences that make the legacy possible.',
    icon: Heart,
  },
  {
    id: 'volunteer',
    title: 'VOLUNTEER',
    eyebrow: 'CONTRIBUTE',
    description: 'Give your time, skills, knowledge or practical support to the project.',
    icon: Users,
  },
];

const community = [
  ['maker', 'BECOME A MAKER', 'Artisans and makers can become part of a platform built around raffia, creativity and opportunity.', Palette],
  ['schools', 'SCHOOLS', 'Create space for young people to discover raffia, heritage, creativity and possibility.', GraduationCap],
  ['young-people', 'YOUNG PEOPLE', 'Join a growing ecosystem of learning, making, innovation and creative opportunity.', Users],
  ['creatives', 'CREATIVES', 'Bring ideas across fashion, art, design, music, performance, media and technology.', Palette],
  ['businesses', 'BUSINESSES', 'Connect products, services, expertise and partnerships to a wider creative economy.', BriefcaseBusiness],
  ['media', 'MEDIA', 'Help tell the story through film, photography, publishing, digital media and storytelling.', Megaphone],
] as const;

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({ onNavigate }) => {
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#F3EBDD] text-[#11100E]">
      <section className="relative overflow-hidden bg-[#241A14] text-[#F3EBDD]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#C8A978_0,transparent_35%),radial-gradient(circle_at_80%_80%,#B65332_0,transparent_35%)]" />
        <div className="relative max-w-[1560px] mx-auto px-6 sm:px-12 py-24 sm:py-32 lg:py-40">
          <p className="text-sm font-bold tracking-[0.18em] uppercase text-[#C8A978] mb-5">GET INVOLVED</p>
          <h1 className="max-w-5xl text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight">
            THERE IS A PLACE
            <br />
            <em className="font-serif font-normal text-[#E59C6D]">FOR YOU IN THE LEGACY.</em>
          </h1>
          <p className="max-w-2xl mt-8 text-base sm:text-xl leading-relaxed text-white/80 font-sans">
            The Raffia Legacy Project is built with people. Whether you want to partner, sponsor, give, volunteer, make, teach, create, build or tell the story, there is a place for you.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => jump('partnerships')} className="button bg-[#B65332] text-white px-7 py-4 font-bold text-sm flex items-center gap-2 hover:bg-[#D16D48] transition-colors">
              EXPLORE WAYS TO JOIN <ArrowRight size={17} />
            </button>
            <button onClick={() => jump('community')} className="button border border-white/30 text-white px-7 py-4 font-bold text-sm hover:bg-white hover:text-[#11100E] transition-colors">
              FIND YOUR PLACE
            </button>
          </div>
        </div>
      </section>

      <section id="partnerships" className="scroll-mt-20 py-20 sm:py-28 px-6 sm:px-12 border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-bold tracking-[0.16em] uppercase text-[#B65332] mb-3">PARTNERSHIP & SUPPORT</p>
            <h2 className="text-4xl sm:text-6xl font-black leading-tight">
              WE ARE LOOKING FOR
              <br />
              <em className="font-serif font-normal text-[#B65332]">COLLABORATORS.</em>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#73695E] leading-relaxed">
              Not just cheques. The project welcomes people and organisations who can contribute resources, expertise, research, training, technology, mentorship, media, creativity or destination development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pathways.map(({ id, title, eyebrow, description, icon: Icon }) => (
              <button key={id} onClick={() => jump(id)} className="text-left p-6 bg-[#EAE1D1] border border-[#241A14]/15 hover:-translate-y-1 hover:shadow-xl transition-all group">
                <div className="w-11 h-11 flex items-center justify-center bg-[#241A14] text-[#C8A978] mb-8">
                  <Icon size={20} />
                </div>
                <p className="text-sm font-bold tracking-wider text-[#B65332]">{eyebrow}</p>
                <h3 className="mt-2 text-xl font-black leading-tight">{title}</h3>
                <p className="mt-3 text-sm text-[#73695E] leading-relaxed">{description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold group-hover:text-[#B65332]">LEARN MORE <ArrowRight size={15} /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="scroll-mt-20 py-20 sm:py-28 px-6 sm:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
        <div className="max-w-[1560px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-bold tracking-[0.16em] uppercase text-[#B65332] mb-3">COMMUNITY</p>
              <h2 className="text-4xl sm:text-6xl font-black leading-tight">
                FIND YOUR
                <br />
                <em className="font-serif font-normal text-[#B65332]">PLACE.</em>
              </h2>
            </div>
            <p className="max-w-xl text-base text-[#73695E] leading-relaxed">
              The legacy grows when knowledge, creativity, enterprise and community meet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {community.map(([id, title, description, Icon]) => (
              <button key={id} onClick={() => jump(id)} className="text-left bg-[#F3EBDD] border border-[#241A14]/15 p-6 min-h-[210px] hover:border-[#B65332]/50 hover:shadow-lg transition-all group">
                <Icon size={22} className="text-[#B65332] mb-10" />
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm text-[#73695E] leading-relaxed">{description}</p>
                <ArrowUpRight size={18} className="mt-5 text-[#B65332] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#11100E] text-white">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="text-sm font-bold tracking-[0.18em] uppercase text-[#C8A978] mb-5">THE LEGACY</p>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight">
            OUR HERITAGE.
            <br />
            OUR PEOPLE.
            <br />
            <em className="font-serif font-normal text-[#C8A978]">OUR FUTURE.</em>
          </h2>
          <p className="max-w-2xl mx-auto mt-7 text-base sm:text-lg text-white/70 leading-relaxed">
            Every contribution helps carry knowledge, creativity and opportunity forward.
          </p>
          <div className="mt-9 inline-flex flex-wrap justify-center gap-3 text-sm font-bold tracking-wide text-[#C8A978]">
            <span>DONATE</span><span>•</span><span>SPONSOR</span><span>•</span><span>VOLUNTEER</span><span>•</span><span>CREATE</span><span>•</span><span>SHARE</span>
          </div>
        </div>
      </section>

      <div className="hidden" aria-hidden="true">
        {['partner','sponsor','donate','volunteer','maker','schools','young-people','creatives','businesses','media'].map(id => <span key={id} id={id} />)}
      </div>
    </div>
  );
};
