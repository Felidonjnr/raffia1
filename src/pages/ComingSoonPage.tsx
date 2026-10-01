import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { ViewRoute } from '../types';

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  onNavigate: (route: ViewRoute) => void;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  subtitle,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-20 px-6 lg:px-12 bg-tactile-paper">
      <div className="max-w-2xl mx-auto w-full text-center">
        {/* Back Link */}
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#57524E] hover:text-[#181513] transition-colors mb-12 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Legacy Project</span>
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B84A28] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curatorial Program In Progress · 2026–2027</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#181513] mb-6 leading-tight">
          {title}
        </h1>

        <p className="text-base text-[#57524E] max-w-lg mx-auto leading-relaxed mb-10 font-normal">
          {subtitle} This comprehensive exhibition and archival monograph is being compiled alongside master guild historians and will launch during the upcoming Legacy Year calendar.
        </p>

        {/* Subscription / Notification Form */}
        <div className="p-8 bg-[#F4EFEA] border border-[#181513]/10 max-w-md mx-auto text-left">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-widest text-[#57524E]">
                Register for Curatorial Dispatch
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@institution.org"
                  className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#181513]/20 text-xs focus:border-[#B84A28] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#181513] text-[#FAF7F2] text-xs font-mono uppercase tracking-wider hover:bg-[#B84A28] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Notify</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-[#57524E]/70">
                You will be notified the moment this section opens to the public.
              </p>
            </form>
          ) : (
            <div className="flex items-start gap-3 text-xs text-[#181513]">
              <CheckCircle2 className="w-5 h-5 text-[#B84A28] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Invitation Registered</p>
                <p className="text-[#57524E] mt-0.5">
                  You are registered to receive the private premiere bulletin for {title}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
