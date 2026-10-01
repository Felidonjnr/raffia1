import React, { useState } from 'react';
import { ViewRoute } from '../types';
import { LEGACY_YEAR_STAGES } from '../data/legacyData';
import { ArrowLeft, Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface LegacyYearPageProps {
  onNavigate: (route: ViewRoute) => void;
}

export const LegacyYearPage: React.FC<LegacyYearPageProps> = ({ onNavigate }) => {
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);
  const activeStage = LEGACY_YEAR_STAGES[selectedStageIdx];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28">
      {/* Header */}
      <section className="pt-12 pb-16 px-6 lg:px-12 border-b border-[#181513]/10 max-w-[1440px] mx-auto">
        <button
          onClick={() => onNavigate({ type: 'project' })}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#57524E] hover:text-[#181513] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to The Project</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-3">
              The 12-Month Living Continuum
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#181513] leading-[1.05]">
              THE LEGACY YEAR
            </h1>
            <p className="font-editorial italic text-2xl sm:text-3xl text-[#57524E] font-normal mt-2">
              The festival is only the beginning.
            </p>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm text-[#57524E] leading-relaxed max-w-md font-normal">
              A year-round journey from community discovery to enterprise incubation. Explore the 6 programmatic stages connecting classrooms, science labs, and master weaving looms.
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
              className={`px-4 py-2 whitespace-nowrap transition-colors cursor-pointer border ${
                selectedStageIdx === idx
                  ? 'bg-[#181513] text-[#FAF7F2] border-[#181513] font-semibold'
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
        <div className="bg-[#FAF7F2] border border-[#181513]/15 p-8 sm:p-14 shadow-sm space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#B84A28]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{activeStage.timeframe}</span>
                <span>·</span>
                <span>Stage {activeStage.step} of 06</span>
              </div>

              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#181513] leading-tight">
                {activeStage.program}
              </h2>

              <p className="text-base sm:text-lg text-[#57524E] leading-relaxed font-normal">
                {activeStage.summary}
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#ECE5DC] p-6 sm:p-8 border border-[#DDD4C5] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C7355]">
                <Sparkles className="w-4 h-4 text-[#B84A28]" />
                <span>Documented Program Outcomes</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#181513]">
                {activeStage.outcomes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B84A28] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="pt-8 border-t border-[#181513]/10 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#57524E]">
            <button
              disabled={selectedStageIdx === 0}
              onClick={() => setSelectedStageIdx((i) => Math.max(0, i - 1))}
              className="hover:text-[#181513] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Previous Stage
            </button>
            <span className="text-[#8C7355]">
              Stage {selectedStageIdx + 1} of {LEGACY_YEAR_STAGES.length}
            </span>
            <button
              disabled={selectedStageIdx === LEGACY_YEAR_STAGES.length - 1}
              onClick={() => setSelectedStageIdx((i) => Math.min(LEGACY_YEAR_STAGES.length - 1, i + 1))}
              className="hover:text-[#181513] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Next Stage →
            </button>
          </div>
        </div>

        {/* Full Overview Table */}
        <div className="mt-16 pt-16 border-t border-[#181513]/10">
          <h3 className="font-editorial text-3xl font-light text-[#181513] mb-8">
            Complete 12-Month Schedule at a Glance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEGACY_YEAR_STAGES.map((s, idx) => (
              <div
                key={s.step}
                onClick={() => setSelectedStageIdx(idx)}
                className={`p-6 border cursor-pointer transition-all ${
                  selectedStageIdx === idx
                    ? 'border-[#B84A28] bg-[#F4EFEA]'
                    : 'border-[#181513]/10 bg-[#FAF7F2] hover:border-[#181513]/30'
                }`}
              >
                <div className="flex items-baseline justify-between text-[11px] font-mono uppercase text-[#8C7355] mb-2">
                  <span>Stage {s.step}</span>
                  <span>{s.title}</span>
                </div>
                <h4 className="font-editorial text-xl font-medium text-[#181513] mb-2">
                  {s.program}
                </h4>
                <p className="text-xs text-[#57524E] line-clamp-2">
                  {s.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
