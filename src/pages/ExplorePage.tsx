import React from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, Camera, FileText, Globe2, Images, Landmark, Play, Users, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewRoute } from '../types';

interface ExplorePageProps {
  section?: string;
  onNavigate: (route: ViewRoute) => void;
}

const EXPLORE_ITEMS = [
  { slug: 'raffia-stories', title: 'Raffia Stories', desc: 'Stories from the people, places, practices and possibilities connected to raffia.', icon: BookOpen },
  { slug: 'people-makers', title: 'People & Makers', desc: 'Meet the artisans, creatives, communities and people shaping the legacy.', icon: Users },
  { slug: 'journal', title: 'Journal', desc: 'A place for project stories, reflections, updates and deeper conversations.', icon: FileText },
  { slug: 'global-raffia', title: 'Global Raffia', desc: 'Look beyond one place and discover raffia across cultures, practices and creative contexts.', icon: Globe2 },
  { slug: 'archive', title: 'Archive', desc: 'A living record of what we learn, create and pass on.', icon: Landmark },
  { slug: 'exhibitions', title: 'Exhibitions', desc: 'A home for exhibitions, creative works and curated presentations.', icon: Images },
  { slug: 'videos', title: 'Videos', desc: 'Documentaries, conversations, performances and moving-image stories.', icon: Play },
  { slug: 'photo-stories', title: 'Photo Stories', desc: 'Visual stories that document people, process, place and product.', icon: Camera },
  { slug: 'opportunities', title: 'Opportunities', desc: 'A space for opportunities connected to the Raffia Legacy Project.', icon: Briefcase },
];

const ARCHIVE_NOTE = 'Every year should leave something behind. The archive will preserve the living record of raffia through performances, oral histories, songs, stories, traditional techniques, creative works, educational resources and digital records.';

export const ExplorePage: React.FC<ExplorePageProps> = ({ section, onNavigate }) => {
  const active = EXPLORE_ITEMS.find((item) => item.slug === section);

  return (
    <div className="min-h-screen bg-[#F3EBDD] text-[#11100E] pb-28">
      <section className="relative overflow-hidden bg-[#11100E] text-white">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1600px-Raffia_Basket_Making.jpg"
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#11100E] via-[#11100E]/85 to-[#11100E]/45" />
        <div className="relative max-w-[1560px] mx-auto px-6 lg:px-12 py-24 sm:py-32">
          <span className="text-sm tracking-[0.25em] uppercase font-bold text-[#C8A978]">EXPLORE</span>
          <h1 className="mt-4 max-w-5xl text-6xl sm:text-8xl lg:text-[9rem] leading-[0.82] font-black tracking-[-0.05em]">
            GO DEEPER.<br />
            <span className="font-serif italic font-normal text-[#C8A978]">FOLLOW THE THREAD.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/80 leading-relaxed">
            Explore the stories, people, records, creative work and opportunities that will grow around the Raffia Legacy Project.
          </p>
        </div>
      </section>

      <section className="max-w-[1560px] mx-auto px-6 lg:px-12 py-20 sm:py-28">
        <div className="max-w-3xl mb-12">
          <span className="text-sm tracking-[0.2em] uppercase font-bold text-[#B65332]">THE RAFFIA LEGACY COLLECTION</span>
          <h2 className="mt-3 text-4xl sm:text-6xl font-extrabold tracking-tight">
            A LIVING RECORD<br />
            <span className="font-serif italic font-normal text-[#B65332]">OF THE LEGACY.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#73695E] leading-relaxed">
            Explore is where the project can keep growing beyond the homepage: documenting people, knowledge, creative work, stories and opportunities as the legacy develops.
          </p>
        </div>

        {active && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-[#241A14] text-[#F3EBDD] p-8 sm:p-12 border border-[#C8A978]/30"
          >
            <button
              onClick={() => onNavigate({ type: 'explore' })}
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#C8A978] mb-8"
            >
              <ArrowLeft size={16} /> All Explore
            </button>
            <span className="block text-sm tracking-[0.2em] uppercase font-bold text-[#C8A978]">PAGE UNDER CONSTRUCTION</span>
            <h3 className="mt-3 text-4xl sm:text-6xl font-extrabold tracking-tight">{active.title}</h3>
            <p className="mt-5 max-w-3xl text-base sm:text-lg text-white/75 leading-relaxed">{active.desc}</p>
            {active.slug === 'archive' && (
              <div className="mt-8 max-w-3xl border-l-2 border-[#B65332] pl-5 text-white/80 leading-relaxed">
                {ARCHIVE_NOTE}
              </div>
            )}
            <p className="mt-8 text-sm text-[#C8A978] font-semibold">This destination is being prepared for the Raffia Legacy Project launch.</p>
          </motion.section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {EXPLORE_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.slug === section;
            return (
              <motion.button
                key={item.slug}
                whileHover={{ y: -5 }}
                onClick={() => onNavigate({ type: 'explore', section: item.slug })}
                className={`group text-left min-h-[250px] p-7 sm:p-8 border transition-all flex flex-col justify-between cursor-pointer ${isActive ? 'bg-[#241A14] text-white border-[#C8A978]' : 'bg-[#EAE1D1] border-[#241A14]/15 hover:border-[#B65332]/60'}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-sm tracking-[0.18em] uppercase font-bold ${isActive ? 'text-[#C8A978]' : 'text-[#B65332]'}`}>0{index + 1}</span>
                  <Icon size={22} className={isActive ? 'text-[#C8A978]' : 'text-[#B65332]'} />
                </div>
                <div>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isActive ? 'text-white' : 'text-[#11100E]'}`}>{item.title}</h3>
                  <p className={`mt-3 text-base leading-relaxed ${isActive ? 'text-white/75' : 'text-[#73695E]'}`}>{item.desc}</p>
                  <span className={`mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isActive ? 'text-[#C8A978]' : 'text-[#B65332]'}`}>
                    Explore <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="bg-[#11100E] text-white py-20 sm:py-28 px-6 lg:px-12">
        <div className="max-w-[1560px] mx-auto grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <span className="text-sm tracking-[0.2em] uppercase font-bold text-[#C8A978]">WHAT WE LEARN. WHAT WE CREATE.</span>
            <h2 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight">EVERY YEAR SHOULD<br /><span className="font-serif italic font-normal text-[#C8A978]">LEAVE SOMETHING BEHIND.</span></h2>
          </div>
          <p className="text-base sm:text-lg text-white/75 leading-relaxed">
            Explore will become the project’s growing record: people and makers, stories, creative works, educational resources, photography, video and other material created through the legacy.
          </p>
        </div>
      </section>
    </div>
  );
};
