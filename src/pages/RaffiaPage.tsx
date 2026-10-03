import React from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Leaf, Palette, Store, Landmark, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewRoute } from '../types';

interface RaffiaPageProps {
  topicSlug?: string;
  onNavigate: (route: ViewRoute) => void;
}

const TOPICS = [
  { slug: 'what-is-raffia', title: 'What is Raffia?', kicker: 'START HERE', desc: 'Meet the material at the heart of the project—and understand why it matters beyond the object.', icon: Leaf },
  { slug: 'raffia-101', title: 'Raffia 101', kicker: 'THE BASICS', desc: 'A practical introduction to raffia, its uses, vocabulary and possibilities.', icon: BookOpen },
  { slug: 'history-heritage', title: 'History & Heritage', kicker: 'MEMORY', desc: 'Explore raffia as a carrier of history, identity, craft and inherited knowledge.', icon: Landmark },
  { slug: 'traditional-knowledge', title: 'Traditional Knowledge', kicker: 'SKILL', desc: 'Look closer at the techniques, making practices and knowledge passed between generations.', icon: Sparkles },
  { slug: 'raffia-culture', title: 'Raffia & Culture', kicker: 'IDENTITY', desc: 'Discover how raffia connects with ceremony, performance, community and cultural expression.', icon: Landmark },
  { slug: 'raffia-creativity', title: 'Raffia & Creativity', kicker: 'MAKING', desc: 'See how designers, artists and makers can reinterpret raffia for contemporary life.', icon: Palette },
  { slug: 'raffia-enterprise', title: 'Raffia & Enterprise', kicker: 'OPPORTUNITY', desc: 'From craft to commerce: explore products, markets, skills and creative enterprise.', icon: Store },
  { slug: 'future-of-raffia', title: 'Future of Raffia', kicker: 'POSSIBILITY', desc: 'Imagine new products, new technologies, new markets and new ways to keep the material relevant.', icon: Sparkles },
  { slug: 'glossary-learning-resources', title: 'Glossary & Learning Resources', kicker: 'LEARN', desc: 'Build your raffia vocabulary and find resources for schools, makers, creatives and curious minds.', icon: BookOpen },
];

const HERO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Raffia_Basket_Making.jpg/1600px-Raffia_Basket_Making.jpg';

export const RaffiaPage: React.FC<RaffiaPageProps> = ({ topicSlug, onNavigate }) => {
  const activeTopic = TOPICS.find((topic) => topic.slug === topicSlug);

  return (
    <div className="min-h-screen bg-[#F3EBDD] text-[#11100E]">
      <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-[#11100E] text-white">
        <img src={HERO_IMAGE} alt="Artisan working with raffia" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#241A14]/65 to-[#11100E]/20" />
        <div className="relative z-10 max-w-[1560px] w-full mx-auto px-6 lg:px-12 py-20 sm:py-28">
          <span className="text-sm tracking-[0.25em] text-[#C8A978] uppercase font-bold font-sans">RAFFIA</span>
          <h1 className="mt-4 text-6xl sm:text-8xl lg:text-[9rem] leading-[0.82] font-black tracking-[-0.05em]">
            DISCOVER<br /><span className="font-serif italic font-normal text-[#C8A978]">RAFFIA.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed font-sans">
            More than a material. Raffia carries history, skill, identity and possibility—from traditional knowledge to contemporary creativity and enterprise.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-6 lg:px-12">
        <div className="max-w-[1560px] mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-sm tracking-widest text-[#B65332] uppercase font-bold font-sans">THE RAFFIA KNOWLEDGE HUB</span>
            <h2 className="mt-3 text-4xl sm:text-6xl font-extrabold tracking-tight">
              START WITH THE MATERIAL.<br />
              <span className="font-serif italic font-normal text-[#B65332]">FOLLOW THE STORY.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#73695E] leading-relaxed font-sans">
              Explore the material through heritage, culture, making, creativity, enterprise and the future. Each topic is a doorway into a bigger story.
            </p>
          </div>

          {activeTopic && (
            <div className="mb-10 p-7 sm:p-10 bg-[#241A14] text-[#F3EBDD] border border-[#C8A978]/30">
              <span className="text-sm tracking-widest uppercase text-[#C8A978] font-bold font-sans">{activeTopic.kicker}</span>
              <h3 className="mt-2 text-3xl sm:text-5xl font-extrabold">{activeTopic.title}</h3>
              <p className="mt-4 max-w-3xl text-base sm:text-lg text-white/80 leading-relaxed font-sans">{activeTopic.desc}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {TOPICS.map((topic, index) => {
              const Icon = topic.icon;
              const active = topic.slug === topicSlug;
              return (
                <motion.button
                  key={topic.slug}
                  whileHover={{ y: -5 }}
                  onClick={() => onNavigate({ type: 'raffia', topicSlug: topic.slug })}
                  className={`group text-left p-7 sm:p-8 min-h-[250px] border transition-all cursor-pointer flex flex-col justify-between ${active ? 'bg-[#241A14] text-white border-[#C8A978]' : 'bg-[#EAE1D1] border-[#241A14]/15 hover:border-[#B65332]/60'}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-sm tracking-[0.18em] uppercase font-bold font-sans ${active ? 'text-[#C8A978]' : 'text-[#B65332]'}`}>{topic.kicker}</span>
                    <Icon size={22} className={active ? 'text-[#C8A978]' : 'text-[#B65332]'} />
                  </div>
                  <div>
                    <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${active ? 'text-white' : 'text-[#11100E]'}`}>{topic.title}</h3>
                    <p className={`mt-3 text-base leading-relaxed font-sans ${active ? 'text-white/75' : 'text-[#73695E]'}`}>{topic.desc}</p>
                    <span className={`mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider font-sans ${active ? 'text-[#C8A978]' : 'text-[#B65332]'}`}>
                      Explore <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#11100E] text-white py-20 sm:py-28 px-6 lg:px-12">
        <div className="max-w-[1560px] mx-auto grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <span className="text-sm tracking-widest text-[#C8A978] uppercase font-bold font-sans">FROM KNOWLEDGE TO POSSIBILITY</span>
            <h2 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight">FROM PALM TO PRODUCT.<br /><span className="font-serif italic font-normal text-[#C8A978]">CULTURE TO COMMERCE.</span></h2>
          </div>
          <div>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-sans">
              The Raffia Legacy Project connects traditional knowledge with fashion, art, design, tourism, technology and enterprise—creating new reasons to learn, make, visit and build.
            </p>
            <button onClick={() => onNavigate({ type: 'marketplace' })} className="mt-7 button bg-[#B65332] text-white hover:bg-white hover:text-[#11100E] px-7 py-4 text-sm font-bold uppercase tracking-wider font-sans transition-all cursor-pointer inline-flex items-center gap-2">
              Explore the Marketplace <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
