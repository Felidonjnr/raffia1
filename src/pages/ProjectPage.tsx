import React from 'react';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { ViewRoute } from '../types';

interface ProjectPageProps {
  initialSection?: 'about' | 'vision' | 'legacy-year' | 'programmes' | 'impact' | 'partners';
  onNavigate: (route: ViewRoute) => void;
}

const sections = [
  ['about','About the Project'],
  ['vision','Our Vision'],
  ['legacy-year','The Legacy Year'],
  ['programmes','Our Programmes'],
  ['impact','Impact'],
  ['partners','Partners'],
] as const;

export const ProjectPage: React.FC<ProjectPageProps> = ({ initialSection='about', onNavigate }) => {
  const section = initialSection;

  const jump = (id:string) => document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});

  return (
    <div className="project-page">
      <section className="project-hero">
        <div>
          <button className="text-link project-back" onClick={()=>onNavigate({type:'home'})}><ArrowLeft size={16}/> RETURN HOME</button>
          <p className="eyebrow">DANCE VILLE PRESENTS · THE RAFFIA LEGACY PROJECT</p>
          <h1>THE RAFFIA<br/><em>LEGACY PROJECT.</em></h1>
        </div>
        <div>
          <p className="project-hero-lede">A year-round programme celebrating raffia as a symbol of African heritage, sustainable creativity, innovation and economic opportunity.</p>
          <p className="project-meta">CULTURE · CREATIVITY · ENTERPRISE · COMMUNITY</p>
        </div>
      </section>

      <nav className="project-tabs" aria-label="Project sections">
        {sections.map(([id,label])=><button key={id} className={section===id?'active':''} onClick={()=>jump(id)}>{label}</button>)}
      </nav>

      <section id="about" className="project-block project-about">
        <div className="project-index">01</div>
        <div className="project-copy">
          <p className="eyebrow">ABOUT THE PROJECT</p>
          <h2>RAFFIA IS MORE THAN<br/><em>A MATERIAL.</em></h2>
          <p>Raffia carries history, skill, identity and possibility.</p>
          <p>It has been used for clothing, craft, shelter, dance, ceremony and everyday life.</p>
          <p>The Raffia Legacy Project connects traditional knowledge with contemporary fashion, art, design, tourism, technology and enterprise.</p>
          <div className="project-statement">FROM PALM TO PRODUCT.<br/>CULTURE TO COMMERCE.<br/>HERITAGE TO OPPORTUNITY.</div>
        </div>
      </section>

      <section id="vision" className="project-block project-vision">
        <div className="project-index">02</div>
        <div className="project-copy">
          <p className="eyebrow">OUR VISION</p>
          <h2>TURNING HERITAGE<br/><em>INTO POSSIBILITY.</em></h2>
          <p>The project is built around five connected areas:</p>
          <div className="vision-grid">
            {[
              ['01','CULTURE','Celebrating raffia heritage and identity.'],
              ['02','CREATIVITY','Connecting traditional knowledge with contemporary creative practice.'],
              ['03','OPPORTUNITY','Creating pathways for value, skills and enterprise.'],
              ['04','TOURISM','Connecting raffia heritage with places, experiences and visitors.'],
              ['05','LEGACY','Building something that can continue into the next generation.'],
            ].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </div>
      </section>

      <section id="legacy-year" className="project-block project-year">
        <div className="project-index">03</div>
        <div className="project-copy">
          <p className="eyebrow">THE LEGACY YEAR</p>
          <h2>THE FESTIVAL<br/><em>IS ONLY THE BEGINNING.</em></h2>
          <p>The strongest part of the project is what happens before and after the festival.</p>
          <div className="year-line">
            {['DISCOVER','IMAGINE','CREATE','BUILD','CELEBRATE','PASS IT ON'].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}
          </div>
          <button className="button button-dark" onClick={()=>onNavigate({type:'legacy_year'})}>EXPLORE THE LEGACY YEAR <ArrowUpRight size={17}/></button>
        </div>
      </section>

      <section id="programmes" className="project-block project-programmes">
        <div className="project-index">04</div>
        <div className="project-copy">
          <p className="eyebrow">OUR PROGRAMMES</p>
          <h2>THE WORK<br/><em>IN MOTION.</em></h2>
          <div className="programme-list">
            {[
              ['01','DISCOVER RAFFIA SCHOOL PROGRAMME','A school-based pathway introducing young people to raffia.'],
              ['02','YOUNG RAFFIA INNOVATORS','A programme centred on young people and new possibilities.'],
              ['03','CREATE RAFFIA DESIGN CHALLENGE','A creative challenge built around raffia.'],
              ['04','RAFFIA BUSINESS INCUBATOR','A pathway connecting raffia and enterprise.'],
              ['05','CELEBRATE RAFFIA FESTIVAL','The flagship festival and public celebration.'],
              ['06','PASS IT ON / NEXT LEGACY YEAR','Continuing the cycle into the next year.'],
            ].map(([n,t,d])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></article>)}
          </div>
        </div>
      </section>

      <section id="impact" className="project-block project-impact">
        <div className="project-index">05</div>
        <div className="project-copy">
          <p className="eyebrow">IMPACT & VALUE</p>
          <h2>CREATE VALUE<br/>FROM WHAT<br/><em>WE ALREADY HAVE.</em></h2>
          <p>The project seeks to create value and opportunity across a connected ecosystem.</p>
          <div className="impact-grid">{['YOUNG PEOPLE','ARTISANS','FARMERS','CREATIVES','BUSINESSES','COMMUNITY','HOST DESTINATION','WIDER ECONOMY'].map(x=><span key={x}>{x}</span>)}</div>
        </div>
      </section>

      <section id="partners" className="project-block project-partners">
        <div className="project-index">06</div>
        <div className="project-copy">
          <p className="eyebrow">PARTNERS</p>
          <h2>THERE IS A PLACE<br/><em>FOR YOU IN THE LEGACY.</em></h2>
          <p>We are looking for collaborators, not just cheques.</p>
          <div className="partner-grid">{['FESTIVAL SPONSORS','PROGRAMME SPONSORS','LEGACY PARTNERS','KNOWLEDGE PARTNERS','MEDIA & CREATIVE PARTNERS','TOURISM & DESTINATION PARTNERS'].map(x=><span key={x}>{x}</span>)}</div>
          <div className="project-giving"><strong>DONATE · SPONSOR AN ACTIVITY · GIVE IN-KIND · VOLUNTEER · SHARE EXPERTISE</strong></div>
        </div>
      </section>

      <section className="project-close">
        <p>THE RAFFIA LEGACY PROJECT</p>
        <h2>OUR HERITAGE.<br/>OUR PEOPLE.<br/><em>OUR FUTURE.</em></h2>
      </section>
    </div>
  );
};
