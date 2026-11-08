import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ViewRoute } from '../types';
import { Handshake, Heart, Gift, Users, BookOpen, Megaphone, MapPin, Camera, Palette, MessageCircle, CalendarDays, Search, GraduationCap } from 'lucide-react';

const partnershipOpportunities = [
  ['FESTIVAL SPONSORS','Support the flagship Raffia Festival and help bring the celebration to life.',Handshake],
  ['PROGRAMME SPONSORS','Support a specific programme within the year-round Raffia Legacy Project.',Gift],
  ['LEGACY PARTNERS','Help build what remains beyond the festival and contribute to the long-term legacy.',Heart],
  ['KNOWLEDGE PARTNERS','Bring knowledge and expertise to the project.',BookOpen],
  ['MEDIA & CREATIVE PARTNERS','Help tell, document and amplify the Raffia Legacy story.',Megaphone],
  ['TOURISM & DESTINATION PARTNERS','Connect the project with tourism and destination opportunities.',MapPin],
] as const;

const volunteerSkills = [
  ['PROJECT COORDINATION', CalendarDays],
  ['PARTNERSHIPS & SPONSORSHIP', Handshake],
  ['COMMUNITY ENGAGEMENT', Users],
  ['SOCIAL MEDIA', Megaphone],
  ['GRAPHIC DESIGN', Palette],
  ['COMMUNICATIONS', MessageCircle],
  ['EVENTS & LOGISTICS', CalendarDays],
  ['RESEARCH', Search],
  ['EDUCATION', GraduationCap],
  ['PHOTOGRAPHY & VIDEO', Camera],
] as const;

const waysToGive = [
  ['DONATE','Make a direct contribution to support the project.',Heart],
  ['SPONSOR AN ACTIVITY','Support an activity within the project.',Gift],
  ['GIVE IN-KIND','Contribute goods, services or practical support.',Handshake],
  ['VOLUNTEER','Give your time to help make the project happen.',Users],
  ['SHARE EXPERTISE','Contribute your knowledge and professional expertise.',BookOpen],
] as const;


const SchoolInterestForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    schoolName: '', institutionType: '', contactName: '', position: '',
    email: '', phone: '', address: '', confirmsInstitution: false, website: '',
  });

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!supabase) {
      setError('The form is temporarily unavailable. Please try again later.');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: submitError } = await supabase.functions.invoke('school-interest-submit', {
        body: {
          school_name: form.schoolName.trim(),
          institution_type: form.institutionType,
          contact_name: form.contactName.trim(),
          position: form.position.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          school_address: form.address.trim(),
          confirms_institution: form.confirmsInstitution,
          website: form.website,
        },
      });
      if (submitError || data?.error || !data?.ok) {
        throw new Error(data?.error || submitError?.message || 'We could not send your interest. Please try again.');
      }
      setSubmitted(true);
      setForm({ schoolName: '', institutionType: '', contactName: '', position: '', email: '', phone: '', address: '', confirmsInstitution: false, website: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not send your interest. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="bg-[#F3EBDD] border border-[#241A14]/15 p-8 sm:p-10">
        <p className="text-sm font-bold tracking-[0.16em] uppercase text-[#B65332] mb-3">INTEREST RECEIVED</p>
        <h3 className="text-2xl sm:text-3xl font-black">THANK YOU. WE'VE GOT YOUR INTEREST.</h3>
        <p className="mt-4 text-[#73695E] leading-relaxed">Thanks, we've got your interest and will be in touch soon with the next steps for registering your students.</p>
      </div>
    );
  }

  const inputClass = "w-full min-h-12 px-4 py-3 bg-[#F3EBDD] border border-[#241A14]/20 text-[#241A14] placeholder:text-[#8A8177] outline-none focus:border-[#B65332] focus:ring-1 focus:ring-[#B65332]";
  const labelClass = "block text-sm font-bold mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-[#F3EBDD] border border-[#241A14]/15 p-6 sm:p-9 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="sm:col-span-2"><span className={labelClass}>School name</span><input className={inputClass} name="schoolName" value={form.schoolName} onChange={(e) => update('schoolName', e.target.value)} required maxLength={180} autoComplete="organization" /></label>
        <label className="sm:col-span-2"><span className={labelClass}>Type of institution</span><select className={inputClass} name="institutionType" value={form.institutionType} onChange={(e) => update('institutionType', e.target.value)} required><option value="">Select institution type</option><option value="primary">Primary</option><option value="secondary">Secondary</option><option value="tertiary">Tertiary</option></select><span className="block mt-2 text-xs text-[#73695E]">Tertiary includes universities, polytechnics and colleges of education.</span></label>
        <label><span className={labelClass}>Contact person's name</span><input className={inputClass} name="contactName" value={form.contactName} onChange={(e) => update('contactName', e.target.value)} required maxLength={160} autoComplete="name" /></label>
        <label><span className={labelClass}>Position</span><input className={inputClass} name="position" value={form.position} onChange={(e) => update('position', e.target.value)} required maxLength={120} /></label>
        <label><span className={labelClass}>Email address</span><input className={inputClass} type="email" name="email" value={form.email} onChange={(e) => update('email', e.target.value)} required maxLength={254} autoComplete="email" /></label>
        <label><span className={labelClass}>Phone number</span><input className={inputClass} type="tel" name="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} required maxLength={40} autoComplete="tel" /></label>
        <label className="sm:col-span-2"><span className={labelClass}>School address</span><textarea className={inputClass + " min-h-24 resize-y"} name="address" value={form.address} onChange={(e) => update('address', e.target.value)} required maxLength={500} autoComplete="street-address" /></label>
      </div>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-[#51483F]"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#B65332]" checked={form.confirmsInstitution} onChange={(e) => update('confirmsInstitution', e.target.checked)} required /><span>I confirm we represent the institution listed.</span></label>
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"><label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} /></label></div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center px-8 bg-[#B65332] text-white font-bold text-sm hover:bg-[#D16D48] disabled:opacity-60 disabled:cursor-not-allowed transition-colors">{submitting ? 'SENDING…' : 'SEND INTEREST'}</button>
      <p className="text-xs sm:text-sm text-[#73695E] leading-relaxed">We will only use your details to contact you about this challenge.</p>
    </form>
  );
};

export const GetInvolvedPage: React.FC<{ initialSection?: string; onNavigate?: (route: ViewRoute) => void }> = ({ initialSection = 'partner' }) => {
  useEffect(() => {
    const sectionTarget = initialSection === 'sponsor' || initialSection === 'donate' ? 'support' : initialSection;
    const target = document.getElementById(sectionTarget);
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [initialSection]);

  return (
  <div className="bg-[#F3EBDD] text-[#11100E]">
    <section className="relative overflow-hidden bg-[#241A14] text-[#F3EBDD]">
      <div className="relative max-w-[1560px] mx-auto px-6 sm:px-12 py-24 sm:py-32 lg:py-40">
        <p className="text-sm font-bold tracking-[0.18em] uppercase text-[#C8A978] mb-5">GET INVOLVED</p>
        <h1 className="max-w-5xl text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight">
          THERE IS A PLACE<br />
          <em className="font-serif font-normal text-[#E59C6D]">FOR YOU IN THE LEGACY.</em>
        </h1>
        <p className="max-w-2xl mt-8 text-base sm:text-xl leading-relaxed text-white/80">
          There is a place for you in the legacy. We are looking for collaborators, not just cheques.
        </p>
      </div>
    </section>

    <section id="partner" className="scroll-mt-24 py-20 sm:py-28 px-6 sm:px-12 border-b border-[#241A14]/15">
      <div className="max-w-[1560px] mx-auto">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-bold tracking-[0.16em] uppercase text-[#B65332] mb-3">PARTNERSHIP OPPORTUNITIES</p>
          <h2 className="text-4xl sm:text-6xl font-black leading-tight">THERE IS A PLACE<br /><em className="font-serif font-normal text-[#B65332]">FOR YOU.</em></h2>
          <p className="mt-5 text-base sm:text-lg text-[#73695E] leading-relaxed">
            The Raffia Legacy Project offers different ways for organisations and collaborators to take part in the legacy.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {partnershipOpportunities.map(([title,description,Icon]) => (
            <article key={title} className="p-7 bg-[#EAE1D1] border border-[#241A14]/15 min-h-[240px]">
              <div className="w-11 h-11 flex items-center justify-center bg-[#241A14] text-[#C8A978] mb-8"><Icon size={20}/></div>
              <h3 className="text-xl font-black leading-tight">{title}</h3>
              <p className="mt-3 text-sm text-[#73695E] leading-relaxed">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="support" className="scroll-mt-24 py-20 sm:py-28 px-6 sm:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
      <div className="max-w-[1560px] mx-auto">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-bold tracking-[0.16em] uppercase text-[#B65332] mb-3">SPONSORSHIP & GIVING</p>
          <h2 className="text-4xl sm:text-6xl font-black leading-tight">SUPPORT THE<br /><em className="font-serif font-normal text-[#B65332]">LEGACY.</em></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {waysToGive.map(([title,description,Icon]) => (
            <article key={title} className="bg-[#F3EBDD] border border-[#241A14]/15 p-6 min-h-[220px]">
              <Icon size={22} className="text-[#B65332] mb-10"/>
              <h3 className="text-lg font-black leading-tight">{title}</h3>
              <p className="mt-3 text-sm text-[#73695E] leading-relaxed">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="volunteer" className="scroll-mt-24 py-20 sm:py-28 px-6 sm:px-12 border-b border-[#241A14]/15">
      <div className="max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-sm font-bold tracking-[0.18em] uppercase text-[#B65332] mb-5">JOIN THE TEAM</p>
            <h2 className="text-4xl sm:text-6xl font-black leading-tight">
              YOUR SKILL CAN HELP
              <br />
              <em className="font-serif font-normal text-[#B65332]">BUILD A LEGACY.</em>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#73695E] leading-relaxed max-w-xl">
              We are looking for people with skills or interest in the following areas. Join the team. Bring your passion. Help shape the future of our heritage.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 bg-[#241A14] text-[#F3EBDD]">
              <Users size={18} className="text-[#C8A978]" />
              <span className="text-sm font-bold tracking-wide">VOLUNTEER</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 border-t border-[#241A14]/15">
            {volunteerSkills.map(([title, Icon]) => (
              <div key={title} className="flex items-center gap-4 py-5 border-b border-[#241A14]/15">
                <Icon size={20} className="shrink-0 text-[#B65332]" />
                <span className="text-sm sm:text-base font-bold leading-tight">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>


    <section id="schools" className="scroll-mt-24 py-20 sm:py-28 px-6 sm:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
        <div>
          <p className="text-sm font-bold tracking-[0.18em] uppercase text-[#B65332] mb-4">RAFFIA IN SCHOOL CHALLENGE</p>
          <h2 className="text-4xl sm:text-6xl font-black leading-tight">BRING THE<br /><em className="font-serif font-normal text-[#B65332]">CHALLENGE TO YOUR SCHOOL.</em></h2>
          <p className="mt-6 text-base sm:text-lg text-[#73695E] leading-relaxed">Thank you for your interest! Please fill out the form below and our team will contact you with registration details.</p>
        </div>
        <SchoolInterestForm />
      </div>
    </section>

    <section className="py-16 sm:py-20 px-6 sm:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
      <div className="max-w-[1100px] mx-auto text-center">
        <p className="text-sm font-bold tracking-[0.18em] uppercase text-[#B65332] mb-4">CONTACT US</p>
        <h2 className="text-3xl sm:text-5xl font-black">JOIN THE TEAM.</h2>
        <p className="mt-4 text-base sm:text-lg text-[#73695E]">Facebook & Instagram</p>
        <p className="mt-3 text-xl sm:text-2xl font-black text-[#B65332]">@raffialegacy</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="https://www.instagram.com/raffialegacy/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center min-h-12 px-6 bg-[#B65332] text-white font-bold text-sm hover:bg-[#D16D48] transition-colors">OPEN INSTAGRAM</a>
          <a href="https://www.facebook.com/raffialegacy/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center min-h-12 px-6 border border-[#241A14]/20 font-bold text-sm hover:bg-[#241A14] hover:text-white transition-colors">OPEN FACEBOOK</a>
        </div>
      </div>
    </section>

    <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#241A14] text-[#F3EBDD]">
      <div className="max-w-[1100px] mx-auto">
        <p className="text-sm font-bold tracking-[0.18em] uppercase text-[#C8A978] mb-5">THE INVITATION</p>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight">
          THERE IS A PLACE<br /><em className="font-serif font-normal text-[#E59C6D]">FOR YOU IN THE LEGACY.</em>
        </h2>
        <p className="max-w-2xl mt-7 text-base sm:text-lg text-white/75 leading-relaxed">
          We are looking for collaborators, not just cheques. Find the way you can contribute to the Raffia Legacy Project.
        </p>
      </div>
    </section>
  </div>
  );
};