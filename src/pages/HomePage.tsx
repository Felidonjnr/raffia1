import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ViewRoute } from '../types';
import { PRODUCTS } from '../data/products';

interface HomePageProps {
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const launch = new Date('2026-10-29T18:00:00+01:00');

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const [remaining, setRemaining] = useState(launch.getTime() - Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, launch.getTime() - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const products = (PRODUCTS.filter(p => p.featured || p.newArrival).length ? PRODUCTS.filter(p => p.featured || p.newArrival) : PRODUCTS).slice(0, 4);

  const underConstruction = (title: string) =>
    onNavigate({ type: 'coming_soon', title, subtitle: 'This section is being built as part of the Raffia Legacy experience.' });

  return (
    <div className="home-final">
      <section className="final-hero">
        <div className="final-hero-copy">
          <p className="eyebrow">DANCE VILLE PRESENTS</p>
          <h1>RAFFIA<br/><em>LEGACY</em></h1>
          <p className="hero-tagline">A new celebration of heritage, creativity and possibility.</p>
          <div className="launch-card">
            <span className="launch-label">THE LEGACY PROJECT LAUNCHES IN</span>
            <div className="countdown">
              <div><b>{String(days).padStart(2,'0')}</b><small>DAYS</small></div>
              <i>:</i><div><b>{String(hours).padStart(2,'0')}</b><small>HOURS</small></div>
              <i>:</i><div><b>{String(minutes).padStart(2,'0')}</b><small>MIN</small></div>
              <i>:</i><div><b>{String(seconds).padStart(2,'0')}</b><small>SEC</small></div>
            </div>
            <strong>29 OCTOBER 2026</strong>
          </div>
          <div className="hero-buttons">
            <button className="button button-dark" onClick={()=>underConstruction('The Project')}>DISCOVER THE PROJECT <ArrowUpRight size={17}/></button>
            <button className="button button-outline" onClick={()=>onNavigate({type:'marketplace'})}>SHOP THE COLLECTION <ArrowUpRight size={17}/></button>
          </div>
        </div>
        <div className="final-hero-art"><span>12 MONTHS · ONE LEGACY · ONE FESTIVAL</span><strong>OUR<br/>HERITAGE.<br/>OUR PEOPLE.<br/>OUR FUTURE.</strong></div>
      </section>

      <section className="final-idea">
        <p className="eyebrow">WHY RAFFIA?</p>
        <h2>MORE THAN<br/><em>A MATERIAL.</em></h2>
        <p>Raffia carries history, skill, identity and possibility. It has been part of clothing, craft, shelter, dance, ceremony and everyday life.</p>
        <button className="text-link" onClick={()=>underConstruction('What is Raffia?')}>DISCOVER RAFFIA <ArrowUpRight size={16}/></button>
      </section>

      <section className="final-project">
        <div><p className="eyebrow">THE BIG IDEA</p><h2>FROM PALM<br/>TO PRODUCT.<br/><em>CULTURE TO<br/>COMMERCE.</em></h2></div>
        <div><p>Raffia Legacy connects traditional knowledge with contemporary creativity, enterprise, education and culture.</p><div className="mini-pillars"><span>CULTURE</span><span>CREATIVITY</span><span>OPPORTUNITY</span><span>TOURISM</span><span>LEGACY</span></div><button className="text-link light" onClick={()=>underConstruction('About the Project')}>ABOUT THE PROJECT <ArrowUpRight size={16}/></button></div>
      </section>

      <section className="final-year">
        <div className="section-intro"><p className="eyebrow">THE YEAR AHEAD</p><h2>12 MONTHS.<br/><em>ONE LEGACY.</em></h2><p>The festival is the flagship moment. The Legacy Year is everything that happens before and after it.</p></div>
        <div className="year-grid">
          {[
            ['01','DISCOVER','Raffia in Schools'],
            ['02','IMAGINE','Young Raffia Innovators'],
            ['03','CREATE','Raffia Design Challenge'],
            ['04','BUILD','Raffia Business Incubator'],
            ['05','CELEBRATE','Raffia Festival'],
          ].map(([n,stage,title])=><button key={n} onClick={()=>underConstruction(title)}><span>{n}</span><b>{stage}</b><strong>{title}</strong><ArrowUpRight size={16}/></button>)}
        </div>
      </section>

      <section className="final-market">
        <div className="section-intro"><p className="eyebrow">THE RAFFIA MARKETPLACE</p><h2>RAFFIA,<br/><em>MADE TODAY.</em></h2><p>Discover products, objects and creative works inspired by raffia heritage.</p><button className="text-link" onClick={()=>onNavigate({type:'marketplace'})}>EXPLORE MARKETPLACE <ArrowUpRight size={16}/></button></div>
        <div className="final-products">{products.map(p=><button key={p.id} className="final-product" onClick={()=>onSelectProduct(p.slug)}><div><img src={p.image} alt={p.name}/><span>VIEW OBJECT <ArrowUpRight size={13}/></span></div><small>{p.category}</small><strong>{p.name}</strong><b>{p.currency}{p.price.toLocaleString()}</b></button>)}</div>
      </section>

      <section className="final-festival">
        <div><p className="eyebrow">RAFFIA FESTIVAL 2027</p><h2>AND THEN,<br/><em>WE CELEBRATE.</em></h2><p>The flagship celebration bringing communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors together.</p><button className="button button-light" onClick={()=>underConstruction('Raffia Festival 2027')}>EXPLORE THE FESTIVAL <ArrowUpRight size={17}/></button></div>
        <div className="festival-tags">{['RAFFIA PARADE','FASHION SHOW','ART & DESIGN BIENNALE','DANCE & PERFORMANCE','INNOVATION LAB','ECONOMY SUMMIT','MARKETPLACE','RAFFIA VILLAGE'].map((x,i)=><span key={x}><small>0{i+1}</small>{x}</span>)}</div>
      </section>

      <section className="final-invite">
        <p className="eyebrow">BE PART OF THE LEGACY</p>
        <h2>THERE IS A PLACE<br/><em>FOR YOU HERE.</em></h2>
        <p>Partner. Create. Learn. Support.</p>
        <div><button className="button button-dark" onClick={()=>underConstruction('Get Involved')}>GET INVOLVED <ArrowUpRight size={17}/></button><button className="button button-outline" onClick={()=>underConstruction('People & Makers')}>MEET THE MAKERS <ArrowUpRight size={17}/></button></div>
      </section>

      <section className="final-close"><p>OUR HERITAGE. OUR PEOPLE. OUR FUTURE.</p><h2>RAFFIA IS OUR THREAD.<br/><em>THE FUTURE IS WHAT WE WEAVE WITH IT.</em></h2></section>
    </div>
  );
};
