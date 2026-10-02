import React from 'react';
import { ViewRoute } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { BrushStrokeUnderline } from './RaffiaLogo';

interface FooterProps { onNavigate: (route: ViewRoute) => void; }

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
            {(items as string[]).slice(0, 5).map(item => (
              <button key={item} onClick={() => title === 'MARKETPLACE' ? onNavigate({type:'marketplace'}) : soon(item)}>{item}</button>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2026 Raffia Legacy Project · Dance Ville</span>
        <button onClick={() => onNavigate({type:'marketplace'})}>Shop Marketplace <ArrowUpRight size={14}/></button>
      </div>
    </footer>
  );
};
