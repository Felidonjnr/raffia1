import React, { useEffect, useState } from 'react';
import { ViewRoute } from '../types';
import { ArrowUpRight, X } from 'lucide-react';
import { BrushStrokeUnderline } from './RaffiaLogo';

interface FooterProps { onNavigate: (route: ViewRoute) => void; }

const POPUP_DISMISSED_KEY = 'raffia-newsletter-popup-dismissed';
const POPUP_SUBSCRIBED_KEY = 'raffia-newsletter-popup-subscribed';

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(POPUP_DISMISSED_KEY) || window.sessionStorage.getItem(POPUP_SUBSCRIBED_KEY)) return;
    const timeout = window.setTimeout(() => setPopupOpen(true), 9000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!popupOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePopup();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [popupOpen]);

  const closePopup = () => {
    window.sessionStorage.setItem(POPUP_DISMISSED_KEY, 'true');
    setPopupOpen(false);
  };

  const submitNewsletter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const source = String(formData.get('source') || 'website-footer');
    const honeypot = String(formData.get('website') || '');

    if (!newsletterConsent) {
      setNewsletterStatus('Please confirm that you want to receive email updates.');
      return;
    }
    setNewsletterBusy(true);
    setNewsletterStatus('');
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail.trim(),
          consent: true,
          source,
          website: honeypot,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.ok) {
        setNewsletterStatus(result?.error || 'We could not complete your subscription right now. Please try again shortly.');
        return;
      }
    } catch {
      setNewsletterStatus('We could not complete your subscription right now. Please try again shortly.');
      return;
    } finally {
      setNewsletterBusy(false);
    }
    window.sessionStorage.setItem(POPUP_SUBSCRIBED_KEY, 'true');
    setNewsletterEmail('');
    setNewsletterConsent(false);
    setNewsletterStatus('Thank you. You are on the Raffia Legacy updates list.');
    setPopupOpen(false);
  };

  const soon = (title: string) => onNavigate({ type: 'coming_soon', title, subtitle: 'This section is being prepared for the next build phase.' });
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <div className="footer-brandmark-lockup">
          <button className="brandmark footer-brandmark" onClick={() => onNavigate({ type: 'home' })} aria-label="Raffia Legacy Project Home">
            <div className="footer-brandmark-words">
              <span className="brandmark-raffia text-white">Raffia</span>
              <b className="brandmark-legacy text-[#E59C6D]">LEGACY</b>
              <span className="brandmark-project text-white/70">PROJECT</span>
            </div>
            <BrushStrokeUnderline className="footer-brush" color="#E59C6D" />
          </button>
          <p className="footer-brand-tagline">
            A year-round of activities celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.
          </p>
        </div>
      </div>
      <section className="px-6 sm:px-12 py-16 border-y border-white/10 bg-[#1B130F]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C8A978] mb-3">THE RAFFIA LEGACY LETTER</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Stories, culture & opportunities.</h2>
            <p className="mt-3 text-sm text-white/65 max-w-xl">Receive occasional updates about the project, makers, programmes and festival.</p>
          </div>
          <form onSubmit={submitNewsletter} className="space-y-4">
            <input type="hidden" name="source" value="website-footer" />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="sr-only" htmlFor="raffia-newsletter-email">Email address</label>
              <input id="raffia-newsletter-email" type="email" required autoComplete="email" autoCapitalize="none" spellCheck={false} value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value.replace(/\s/g, ''))} placeholder="Your email address" className="min-h-12 flex-1 px-4 bg-white text-[#241A14] text-sm outline-none focus:ring-2 focus:ring-[#C8A978]" />
              <button type="submit" disabled={newsletterBusy} className="min-h-12 px-6 bg-[#B65332] text-white text-xs font-bold tracking-widest hover:bg-[#D16D48] disabled:opacity-60">{newsletterBusy ? 'JOINING…' : 'SUBSCRIBE'}</button>
            </div>
            <label className="flex items-start gap-3 text-xs leading-relaxed text-white/60">
              <input type="checkbox" required checked={newsletterConsent} onChange={(event) => setNewsletterConsent(event.target.checked)} className="mt-0.5 accent-[#B65332]" />
              <span>I agree to receive occasional email updates from Raffia Legacy. I can unsubscribe at any time.</span>
            </label>
            {newsletterStatus && <p role="status" aria-live="polite" className="text-xs text-[#E9C99A]">{newsletterStatus}</p>}
          </form>
        </div>
      </section>
      <div className="footer-links">
        {[
          ['THE PROJECT', ['About the Project','Our Vision','The Legacy Year','Our Programmes','Impact','The Legacy Collection','Partners']],
          ['RAFFIA', ['What is Raffia?','Raffia 101','History & Heritage','Traditional Knowledge','Raffia & Culture','Raffia & Creativity','Raffia & Enterprise','Glossary / Learning Resources']],
          ['EXPLORE', ['Raffia Stories','People & Makers','Journal','Global Raffia','Archive','Exhibitions','Videos','Photo Stories','Opportunities']],
          ['MARKETPLACE', ['Shop All','Fashion & Accessories','Home & Lifestyle','Art & Design','Traditional Craft','Gifts','Festival Merchandise','Meet the Makers','Sell With Us']],
          ['THE FESTIVAL', ['About the Festival','Programme','Festival Experiences','Tickets','Packages','Raffia Village','Marketplace','Travel & Stay','FAQs','Festival Updates']],
          ['GET INVOLVED', ['Become a Partner','Sponsor the Festival','Donate','Volunteer','Become a Maker','Schools','Young People','Creatives','Businesses','Media']],
        ].map(([title, items]) => (
          <div key={title as string}>
            <h3>{title}</h3>
            {(items as string[]).map(item => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'Meet the Makers' || item === 'People & Makers') onNavigate({ type: 'makers' });
                  else if (item === 'The Legacy Collection') onNavigate({ type: 'collections' });
                  else if (item === 'The Legacy Year' || item === 'Our Programmes') onNavigate({ type: 'legacy_year' });
                  else if (item === 'About the Festival' || item === 'Festival Experiences') onNavigate({ type: 'festival' });
                  else if (title === 'MARKETPLACE') onNavigate({ type: 'marketplace' });
                  else soon(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-white/60">
          <span>© 2026 Raffia Legacy Project · Dance Ville</span>
          <span>·</span>
          <button
            onClick={() => onNavigate({ type: 'admin' })}
            className="hover:text-[#E59C6D] transition-colors uppercase tracking-widest text-[11px]"
          >
            Admin & Database
          </button>
        </div>
        <button onClick={() => onNavigate({type:'marketplace'})}>Shop Marketplace <ArrowUpRight size={14}/></button>
      </div>

      {popupOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-5 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closePopup(); }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="raffia-newsletter-popup-title"
            className="relative my-auto w-full max-w-[500px] max-h-[calc(100dvh-40px)] overflow-y-auto border border-[#C8A978]/45 bg-[#211710] px-6 py-8 text-white shadow-2xl sm:px-10 sm:py-10"
            style={{ color: '#F7F0E5' }}
          >
            <button type="button" onClick={closePopup} aria-label="Close newsletter popup" className="absolute right-3 top-3 z-10 p-2 text-white/65 transition hover:text-white">
              <X size={21} />
            </button>
            <div className="mb-6 h-px w-12 bg-[#B65332]" />
            <p className="mb-4 pr-8 text-[10px] font-bold uppercase tracking-[0.24em] text-[#D9BD8C]">THE RAFFIA LEGACY LETTER</p>
            <h2 id="raffia-newsletter-popup-title" className="!m-0 max-w-[360px] !text-[30px] !font-bold !leading-[1.12] tracking-[-0.035em] sm:!text-[38px]" style={{ color: '#F7F0E5' }}>A little more culture in your inbox.</h2>
            <p className="mt-4 max-w-md text-[14px] leading-[1.7] text-[#D5C9BC] sm:text-[15px]">Discover stories, makers, heritage, creative opportunities and updates from the Raffia Legacy Project. Occasional notes, only when there is something worth sharing.</p>
            <form onSubmit={submitNewsletter} className="mt-6 space-y-4">
              <input type="hidden" name="source" value="website-popup" />
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <label className="sr-only" htmlFor="raffia-newsletter-popup-email">Email address</label>
              <input id="raffia-newsletter-popup-email" type="email" required autoComplete="email" autoCapitalize="none" spellCheck={false} value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value.replace(/\s/g, ''))} placeholder="Enter your email address" className="min-h-12 w-full border border-[#D8C9B8] bg-[#F7F3ED] px-4 text-[15px] text-[#241A14] outline-none placeholder:text-[#82796F] focus:ring-2 focus:ring-[#C8A978]" />
              <label className="flex items-start gap-3 text-[12px] leading-[1.55] text-[#D5C9BC]">
                <input type="checkbox" required checked={newsletterConsent} onChange={(event) => setNewsletterConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#B65332]" />
                <span>I agree to receive occasional email updates. I can unsubscribe at any time.</span>
              </label>
              <button type="submit" disabled={newsletterBusy} className="min-h-12 w-full bg-[#B65332] px-5 text-[11px] font-bold tracking-[0.16em] text-white transition hover:bg-[#D16D48] disabled:opacity-60">{newsletterBusy ? 'JOINING…' : 'JOIN THE MAILING LIST'}</button>
              {newsletterStatus && <p role="status" aria-live="polite" className="text-xs text-[#E9C99A]">{newsletterStatus}</p>}
            </form>
            <p className="mt-5 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-[#9C8C7C]">No spam. Just the good stuff.</p>
          </section>
        </div>
      )}
    </footer>
  );
};
