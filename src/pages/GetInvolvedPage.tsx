import React from 'react';
import { Handshake, Heart, Gift, Users, BookOpen, Megaphone, MapPin } from 'lucide-react';

const partnershipOpportunities = [
  ['FESTIVAL SPONSORS','Support the flagship Raffia Festival and help bring the celebration to life.',Handshake],
  ['PROGRAMME SPONSORS','Support a specific programme within the year-round Raffia Legacy Project.',Gift],
  ['LEGACY PARTNERS','Help build what remains beyond the festival and contribute to the long-term legacy.',Heart],
  ['KNOWLEDGE PARTNERS','Bring knowledge and expertise to the project.',BookOpen],
  ['MEDIA & CREATIVE PARTNERS','Help tell, document and amplify the Raffia Legacy story.',Megaphone],
  ['TOURISM & DESTINATION PARTNERS','Connect the project with tourism and destination opportunities.',MapPin],
] as const;

const waysToGive = [
  ['DONATE','Make a direct contribution to support the project.',Heart],
  ['SPONSOR AN ACTIVITY','Support an activity within the project.',Gift],
  ['GIVE IN-KIND','Contribute goods, services or practical support.',Handshake],
  ['VOLUNTEER','Give your time to help make the project happen.',Users],
  ['SHARE EXPERTISE','Contribute your knowledge and professional expertise.',BookOpen],
] as const;

export const GetInvolvedPage: React.FC = () => (
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

    <section className="py-20 sm:py-28 px-6 sm:px-12 border-b border-[#241A14]/15">
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

    <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#EAE1D1] border-b border-[#241A14]/15">
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