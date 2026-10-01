import React from 'react';
import { ViewRoute } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps { onNavigate: (route: ViewRoute) => void; }

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const soon = (title: string) => onNavigate({ type: 'coming_soon', title, subtitle: 'This section is being prepared for the next build phase.' });
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <p className="eyebrow">RAFFIA LEGACY · DANCE VILLE</p>
        <h2>RAFFIA IS OUR THREAD.<br /><em>THE FUTURE IS WHAT WE WEAVE WITH IT.</em></h2>
      </div>
      <div className="footer-links">
        {[
          ['THE PROJECT', ['About the Project','Our Vision','The Legacy Year','Our Programmes','Impact','The Legacy Collection','Partners']],
          ['RAFFIA', ['What is Raffia?','Raffia 101','History & Heritage','Traditional Knowledge','Raffia & Culture','Raffia & Creativity','Raffia & Enterprise','Glossary / Learning Resources']],
          ['EXPLORE', ['Raffia Stories','People & Makers','Journal','Global Raffia','Archive','Exhibitions','Videos','Photo Stories','Opportunities']],
          ['MARKETPLACE', ['Shop All','Fashion & Accessories','Home & Lifestyle','Art & Design','Traditional Craft','Gifts','Festival Merchandise','Meet the Makers','Sell With Us']],
          ['FESTIVAL 2027', ['About the Festival','Programme','Festival Experiences','Tickets','Packages','Raffia Village','Marketplace','Travel & Stay','FAQs','Festival Updates']],
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
