import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ViewRoute } from '../types';
import { PRODUCTS } from '../data/products';

interface HomePageProps {
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const construction = (onNavigate:(r:ViewRoute)=>void, title:string) =>
  onNavigate({ type:'coming_soon', title, subtitle:'This page is under construction. The full experience will be developed in the next build phase.' });

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  const products = (PRODUCTS.filter(p => p.featured || p.newArrival).length ? PRODUCTS.filter(p => p.featured || p.newArrival) : PRODUCTS).slice(0,4);

  return (
    <div className="home-v3">
      <section className="home-hero-v3">
        <div className="hero-v3-copy">
          <p className={`eyebrow reveal ${ready?'ready':''}`}>DANCE VILLE PRESENTS · RAFFIA LEGACY</p>
          <h1 className={`display-xl reveal ${ready?'ready':''}`}>RAFFIA<br/><i>LEGACY</i></h1>
          <p className="hero-v3-lede">Heritage, creativity, opportunity and commerce — woven into one living story.</p>
          <div className="hero-v3-actions">
            <button className="button button-dark" onClick={()=>onNavigate({type:'marketplace'})}>SHOP RAFFIA <ArrowUpRight size={18}/></button>
            <button className="button button-outline" onClick={()=>construction(onNavigate,'Raffia')}>EXPLORE RAFFIA <ArrowUpRight size={18}/></button>
          </div>
        </div>
        <div className="hero-v3-image"><span>RAFFIA / 001</span><strong>HERITAGE<br/>TO<br/>OPPORTUNITY</strong></div>
      </section>

      <section className="home-statement">
        <p className="eyebrow">WHY RAFFIA?</p>
        <h2>MORE THAN<br/><em>A MATERIAL.</em></h2>
        <p>Raffia carries history, skill, identity and possibility. It has been part of clothing, craft, shelter, dance, ceremony and everyday life.</p>
      </section>

      <section className="home-story dark">
        <div><p className="eyebrow">THE RAFFIA LEGACY PROJECT</p><h2>FROM PALM<br/>TO PRODUCT.</h2></div>
        <div><p>The project connects traditional knowledge with contemporary fashion, art, design, tourism, technology and enterprise.</p><button className="text-link light" onClick={()=>construction(onNavigate,'The Project')}>EXPLORE THE PROJECT <ArrowUpRight size={16}/></button></div>
      </section>

      <section className="home-pillars">
        <div className="section-title"><p className="eyebrow">OUR VISION</p><h2>FIVE<br/><em>PATHWAYS.</em></h2></div>
        <div className="pillar-list">
          {['CULTURE','CREATIVITY','OPPORTUNITY','TOURISM','LEGACY'].map((x,i)=><div className="pillar-row" key={x}><span>0{i+1}</span><strong>{x}</strong><ArrowUpRight size={21}/></div>)}
        </div>
      </section>

      <section className="legacy-year">
        <div className="section-title"><p className="eyebrow">THE LEGACY YEAR</p><h2>THE FESTIVAL<br/><em>IS ONLY THE BEGINNING.</em></h2></div>
        <p className="section-lede">The strongest legacy is what happens before and after the festival.</p>
        <div className="legacy-programmes">
          {[
            ['01','DISCOVER','Discover Raffia School Programme'],
            ['02','IMAGINE','Young Raffia Innovators'],
            ['03','CREATE','Create Raffia Design Challenge'],
            ['04','BUILD','Raffia Business Incubator'],
            ['05','CELEBRATE','Celebrate Raffia Festival'],
            ['06','PASS IT ON','The Next Legacy Year']
          ].map(([n,stage,title])=><button key={n} onClick={()=>construction(onNavigate,title)}><span>{n}</span><b>{stage}</b><strong>{title}</strong><ArrowUpRight size={17}/></button>)}
        </div>
      </section>

      <section className="home-shop">
        <div className="section-head-v3"><div><p className="eyebrow">THE RAFFIA MARKETPLACE</p><h2>MADE FROM<br/><em>LEGACY.</em></h2></div><button className="text-link" onClick={()=>onNavigate({type:'marketplace'})}>SHOP ALL <ArrowUpRight size={16}/></button></div>
        <div className="home-product-grid">
          {products.map(p=><button className="home-product" key={p.id} onClick={()=>onSelectProduct(p.slug)}><div><img src={p.image} alt={p.name}/><span>VIEW OBJECT <ArrowUpRight size={14}/></span></div><p>{p.category}</p><h3>{p.name}</h3><strong>{p.currency}{p.price.toLocaleString()}</strong></button>)}
        </div>
      </section>

      <section className="home-makers">
        <div className="makers-image"><span>PEOPLE · KNOWLEDGE · CRAFT</span></div>
        <div><p className="eyebrow">PEOPLE & MAKERS</p><h2>EVERY OBJECT<br/><em>HAS A STORY.</em></h2><p>The project creates value and visibility for young people, artisans, farmers, creatives, businesses and communities.</p><button className="button button-light" onClick={()=>construction(onNavigate,'People & Makers')}>MEET THE MAKERS <ArrowUpRight size={18}/></button></div>
      </section>

      <section className="home-festival">
        <div><p className="eyebrow">FLAGSHIP EVENT · 2027</p><h2>RAFFIA<br/><em>FESTIVAL.</em></h2><p>The flagship event brings communities, artisans, farmers, designers, artists, young people, businesses, visitors and investors together.</p><button className="button button-dark" onClick={()=>construction(onNavigate,'Raffia Festival 2027')}>EXPLORE FESTIVAL <ArrowUpRight size={18}/></button></div>
        <div className="festival-list">{['RAFFIA PARADE','RAFFIA ECONOMY SUMMIT','INNOVATION LAB','ART & DESIGN BIENNALE','FASHION SHOW','DANCE & PERFORMANCE','RAFFIA MARKETPLACE','RAFFIA VILLAGE'].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}</div>
      </section>

      <section className="home-impact">
        <div><p className="eyebrow">VALUE CREATION</p><h2>CREATE VALUE<br/>FROM WHAT<br/><em>WE HAVE.</em></h2></div>
        <div><p>Open pathways for young people, artisans, farmers, creatives, businesses and communities while connecting heritage to new markets and opportunity.</p><button className="text-link" onClick={()=>construction(onNavigate,'Impact')}>EXPLORE IMPACT <ArrowUpRight size={16}/></button></div>
      </section>

      <section className="home-archive">
        <p className="eyebrow">THE LIVING ARCHIVE</p><h2>EVERY YEAR<br/><em>LEAVES SOMETHING BEHIND.</em></h2>
        <div>{['CULTURAL','CREATIVE','EDUCATIONAL','COMMERCIAL','DIGITAL','TOURISM'].map(x=><span key={x}>{x}</span>)}</div>
        <button className="button button-outline" onClick={()=>construction(onNavigate,'Archive')}>EXPLORE THE ARCHIVE <ArrowUpRight size={18}/></button>
      </section>

      <section className="home-partners">
        <p className="eyebrow">PARTNERSHIP & PARTICIPATION</p><h2>THERE IS A PLACE<br/><em>FOR YOU IN THE LEGACY.</em></h2>
        <p>We are looking for collaborators, not just cheques — including festival, programme, knowledge, media, creative, tourism and destination partners.</p>
        <button className="button button-dark" onClick={()=>construction(onNavigate,'Get Involved')}>GET INVOLVED <ArrowUpRight size={18}/></button>
      </section>

      <section className="home-closing"><p>OUR HERITAGE. OUR PEOPLE. OUR FUTURE.</p><h2>RAFFIA IS OUR THREAD.<br/><em>THE FUTURE IS WHAT WE WEAVE WITH IT.</em></h2></section>
    </div>
  );
};
