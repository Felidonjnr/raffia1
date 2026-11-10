import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Announcement = { id: string; title: string; body: string };

export const SiteAnnouncement: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    if (!supabase) return;
    supabase
      .from('content_entries')
      .select('id,title,body')
      .eq('content_type', 'announcement')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (active && !error && data) setAnnouncement(data as Announcement);
      });
    return () => { active = false; };
  }, []);

  if (!announcement || dismissed) return null;
  return (
    <aside aria-live="polite" className="relative z-40 bg-[#241A14] text-[#F3EBDD] border-b border-[#C8A978]/30">
      <div className="max-w-[1560px] mx-auto px-6 sm:px-12 py-3 pr-14 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A978] shrink-0">{announcement.title}</span>
        {announcement.body && <p className="text-xs sm:text-sm text-white/85 leading-relaxed">{announcement.body}</p>}
      </div>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss announcement" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white">
        <X size={15}/>
      </button>
    </aside>
  );
};
