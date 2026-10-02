import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Package, Users, BookOpen, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { MAKERS } from '../data/makers';
import { RAFFIA_TOPICS } from '../data/raffiaKnowledge';
import { FESTIVAL_EXPERIENCES } from '../data/legacyData';
import { ViewRoute } from '../types';
import { formatNaira } from '../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: ViewRoute) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedProducts = q
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.materials.some((m) => m.toLowerCase().includes(q)) ||
          p.maker.name.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedMakers = q
    ? MAKERS.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.discipline.toLowerCase().includes(q)
      )
    : [];

  const matchedTopics = q
    ? RAFFIA_TOPICS.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.shortDesc.toLowerCase().includes(q)
      )
    : [];

  const matchedFestival = q
    ? FESTIVAL_EXPERIENCES.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchedProducts.length > 0 ||
    matchedMakers.length > 0 ||
    matchedTopics.length > 0 ||
    matchedFestival.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#181513]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FAF7F2] border border-[#181513]/15 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#181513]/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8C7355] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creations, makers, raffia heritage or festival..."
            className="w-full text-base sm:text-lg bg-transparent border-none text-[#181513] placeholder:text-[#57524E]/50 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono uppercase text-[#8C7355] hover:text-[#181513] cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#57524E] hover:text-[#181513] cursor-pointer ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {!q ? (
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[#8C7355]">
                Suggested Discovery
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['Tote Bag', 'Sculptural Vessel', 'Ikot Ekpene', 'Indigo Tapestry', 'Festival 2027', 'What is Raffia?'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 bg-[#ECE5DC] text-[#181513] hover:bg-[#B84A28] hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : hasResults ? (
            <div className="space-y-6">
              {/* Products */}
              {matchedProducts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C7355] mb-3">
                    <Package className="w-3.5 h-3.5" />
                    <span>Marketplace Objects ({matchedProducts.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onNavigate({ type: 'product', slug: p.slug });
                        }}
                        className="p-3 bg-[#F4EFEA] hover:bg-[#ECE5DC] transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#181513] group-hover:text-[#B84A28]">
                            {p.name}
                          </p>
                          <p className="text-xs text-[#57524E]">
                            By {p.maker.name} · {p.category}
                          </p>
                        </div>
                        <span className="font-editorial text-base font-semibold text-[#181513] tabular-nums">
                          {formatNaira(p.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Makers */}
              {matchedMakers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C7355] mb-3">
                    <Users className="w-3.5 h-3.5" />
                    <span>Custodians & Makers ({matchedMakers.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedMakers.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onClose();
                          onNavigate({ type: 'maker_detail', slug: m.slug });
                        }}
                        className="p-3 bg-[#F4EFEA] hover:bg-[#ECE5DC] transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#181513] group-hover:text-[#B84A28]">
                            {m.name}
                          </p>
                          <p className="text-xs text-[#57524E]">
                            {m.location} · {m.speciality}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8C7355] group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raffia Knowledge Topics */}
              {matchedTopics.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C7355] mb-3">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Raffia Cultural Archive ({matchedTopics.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedTopics.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onClose();
                          onNavigate({ type: 'raffia', topicSlug: t.slug });
                        }}
                        className="p-3 bg-[#F4EFEA] hover:bg-[#ECE5DC] transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#181513] group-hover:text-[#B84A28]">
                            {t.title}
                          </p>
                          <p className="text-xs text-[#57524E] line-clamp-1">
                            {t.shortDesc}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8C7355] group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Festival 2027 */}
              {matchedFestival.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C7355] mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Raffia Festival 2027 Experiences</span>
                  </div>
                  <div className="space-y-2">
                    {matchedFestival.map((f) => (
                      <div
                        key={f.number}
                        onClick={() => {
                          onClose();
                          onNavigate({ type: 'festival' });
                        }}
                        className="p-3 bg-[#F4EFEA] hover:bg-[#ECE5DC] transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#181513] group-hover:text-[#B84A28]">
                            {f.title}
                          </p>
                          <p className="text-xs text-[#57524E]">
                            {f.category}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-[#B84A28] uppercase font-semibold">
                          Coming 2027
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[#57524E]">
              <p className="font-editorial text-2xl mb-1 text-[#181513]">No matches found</p>
              <p className="text-xs">
                Try searching for &quot;tote&quot;, &quot;vessel&quot;, &quot;Ikot Ekpene&quot;, or &quot;festival&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#ECE5DC] border-t border-[#181513]/10 flex items-center justify-between text-xs font-mono uppercase text-[#8C7355]">
          <span>Raffia Legacy Platform Search</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
