import React, { useState } from 'react';
import { ViewRoute } from '../types';
import { RAFFIA_TOPICS } from '../data/raffiaKnowledge';
import { ArrowLeft, BookOpen, Sparkles, ChevronRight, Bookmark } from 'lucide-react';

interface RaffiaArchivePageProps {
  initialTopicSlug?: string;
  onNavigate: (route: ViewRoute) => void;
}

export const RaffiaArchivePage: React.FC<RaffiaArchivePageProps> = ({
  initialTopicSlug,
  onNavigate,
}) => {
  const [activeSlug, setActiveSlug] = useState<string>(
    initialTopicSlug || RAFFIA_TOPICS[0].slug
  );

  const activeTopic =
    RAFFIA_TOPICS.find((t) => t.slug === activeSlug) || RAFFIA_TOPICS[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Archival Monograph Header */}
      <section className="pt-12 pb-16 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#57524E] hover:text-[#181513] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-3">
              Cultural Discovery Archive · Vol. I
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#181513] leading-[1.05]">
              THE RAFFIA <br />
              <span className="italic font-normal">KNOWLEDGE ARCHIVE</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#57524E] leading-relaxed max-w-md font-sans">
              Raffia is more than a material. It carries history, skill, identity and possibility. For generations, people have used raffia for clothing, craft, shelter, dance, ceremony and everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter Reader Interface: Split view */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Chapter Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-28">
            <p className="font-mono text-xs uppercase tracking-widest text-[#8C7355] mb-4 pb-2 border-b border-[#181513]/10">
              Compendium Index
            </p>

            {RAFFIA_TOPICS.map((topic, index) => {
              const isSelected = activeSlug === topic.slug;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveSlug(topic.slug);
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-4 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#181513] text-[#FAF7F2] border-[#181513] shadow-md'
                      : 'bg-[#FAF7F2] text-[#57524E] border-[#181513]/10 hover:border-[#181513]/30 hover:bg-[#F4EFEA]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest mb-1">
                    <span className={isSelected ? 'text-[#C8B28B]' : 'text-[#8C7355]'}>
                      Chapter 0{index + 1}
                    </span>
                    {isSelected && <Bookmark className="w-3 h-3 text-[#C8B28B]" />}
                  </div>
                  <p className="font-editorial text-xl font-medium tracking-tight">
                    {topic.title}
                  </p>
                  <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-[#FAF7F2]/70' : 'text-[#57524E]'}`}>
                    {topic.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Reading Monograph Column (8 cols) */}
          <div className="lg:col-span-8 bg-[#FAF7F2] border border-[#181513]/10 p-8 sm:p-12 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] mb-2">
                <BookOpen className="w-4 h-4" />
                <span>{activeTopic.kicker}</span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#181513] mb-4 leading-tight">
                {activeTopic.title}
              </h2>
              <p className="text-base sm:text-lg text-[#57524E] italic font-editorial leading-relaxed pb-6 border-b border-[#181513]/10">
                {activeTopic.shortDesc}
              </p>
            </div>

            {/* Quote pull */}
            {activeTopic.quote && (
              <blockquote className="border-l-2 border-[#B84A28] pl-5 py-2 italic font-editorial text-xl sm:text-2xl text-[#181513] leading-snug">
                &ldquo;{activeTopic.quote}&rdquo;
              </blockquote>
            )}

            {/* Paragraphs */}
            <div className="space-y-6 text-sm sm:text-base text-[#181513] leading-relaxed font-normal">
              {activeTopic.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Key Facts Definition Box */}
            <div className="p-6 bg-[#ECE5DC] border border-[#DDD4C5] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C7355]">
                <Sparkles className="w-3.5 h-3.5 text-[#B84A28]" />
                <span>Key Principles & Dimensions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeTopic.keyFacts.map((fact, idx) => (
                  <div key={idx} className="border-t border-[#181513]/10 pt-2 text-xs">
                    <span className="font-mono uppercase text-[#8C7355] block text-xs">
                      {fact.label}
                    </span>
                    <span className="font-medium text-[#181513] mt-0.5 block">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Chapter footer */}
            <div className="pt-8 border-t border-[#181513]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-mono uppercase text-[#8C7355]">
                Raffia Legacy Project
              </span>
              <button
                onClick={() => onNavigate({ type: 'marketplace' })}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] font-semibold"
              >
                <span>View Creations Made With This Material</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
