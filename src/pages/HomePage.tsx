import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronRight, ShoppingBag } from 'lucide-react';
import { ViewRoute } from '../types';
import { PRODUCTS } from '../data/products';

interface HomePageProps {
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const collections = [
  { title: 'FASHION', sub: 'Accessories & wearable craft', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1400&q=85' },
  { title: 'HOME', sub: 'Objects for contemporary living', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1400&q=85' },
  { title: 'ART + DESIGN', sub: 'Raffia interpreted by makers', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const featured = PRODUCTS.filter(p => p.featured || p.newArrival).slice(0, 4);
  const fallback = PRODUCTS.slice(0, 4);
  const products = featured.length >= 4 ? featured : fallback;

  return (
    <div className="home-v2">
      <section className="home-hero">
        <div className="hero-copy">
          <p className={`eyebrow hero-reveal ${ready ? 'is-ready' : ''}`}>DANCE VILLE PRESENTS · RAFFIA LEGACY</p>
          <h1 className={`hero-title hero-reveal ${ready ? 'is-ready' : ''}`}>
            RAFFIA
            <span>LEGACY.</span>
          </h1>
          <div className="hero-bottom">
            <p className={`hero-description hero-reveal ${ready ? 'is-ready' : ''}`}>
              Contemporary objects, fashion and craft rooted in a living African material culture.
            </p>
            <div className={`hero-actions hero-reveal ${ready ? 'is-ready' : ''}`}>
              <button onClick={() => onNavigate({ type: 'marketplace' })} className="button button-dark">
                Shop the marketplace <ArrowUpRight size={18} />
              </button>
              <button onClick={() => onNavigate({ type: 'coming_soon', title: 'Raffia', subtitle: 'The cultural discovery section is being prepared.' })} className="button button-outline">
                Discover Raffia <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="hero-art" aria-label="Raffia material visual placeholder">
          <div className="raffia-weave">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <div className="hero-art-label">
              <span>RAFFIA / 001</span>
              <strong>THE MATERIAL</strong>
              <small>HERITAGE · CRAFT · POSSIBILITY</small>
            </div>
          </div>
        </div>
      </section>

      <section className="home-intro">
        <p className="eyebrow">THE MARKETPLACE</p>
        <h2>MADE FROM<br /><em>LEGACY.</em></h2>
        <div className="intro-side">
          <p>Discover pieces that bring raffia from palm to product — from traditional craft to contemporary design.</p>
          <button onClick={() => onNavigate({ type: 'marketplace' })} className="text-link">
            Enter marketplace <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <section className="collection-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">SHOP BY WORLD</p>
            <h2>COLLECTIONS</h2>
          </div>
          <button onClick={() => onNavigate({ type: 'marketplace' })} className="text-link">
            View all <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="collection-grid">
          {collections.map((collection, index) => (
            <button key={collection.title} onClick={() => onNavigate({ type: 'marketplace' })} className={`collection-tile collection-${index + 1}`}>
              <img src={collection.image} alt="" loading="lazy" />
              <span className="tile-overlay" />
              <div className="tile-copy">
                <span>0{index + 1}</span>
                <strong>{collection.title}</strong>
                <small>{collection.sub}</small>
              </div>
              <ArrowUpRight className="tile-arrow" size={22} />
            </button>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">CURATED NOW</p>
            <h2>THE LATEST</h2>
          </div>
          <button onClick={() => onNavigate({ type: 'marketplace' })} className="text-link">
            Shop all products <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="product-grid-v2">
          {products.map((product) => (
            <button key={product.id} onClick={() => onSelectProduct(product.slug)} className="product-tile">
              <div className="product-image">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="product-quick"><ShoppingBag size={15} /> View object</span>
              </div>
              <div className="product-meta">
                <div>
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.maker?.name}</p>
                </div>
                <strong>{product.currency}{product.price.toLocaleString()}</strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="maker-banner">
        <div className="maker-image" />
        <div className="maker-copy">
          <p className="eyebrow">THE STORY BEHIND THE OBJECT</p>
          <h2>EVERY PIECE<br /><em>HAS A HAND.</em></h2>
          <p>Raffia is more than a material. It carries history, skill, identity and possibility.</p>
          <button onClick={() => onNavigate({ type: 'coming_soon', title: 'Makers', subtitle: 'Maker stories and profiles are coming soon.' })} className="button button-light">
            Meet the makers <ArrowUpRight size={18} />
          </button>
        </div>
      </section>

      <section className="legacy-teaser">
        <div>
          <p className="eyebrow">RAFFIA LEGACY PROJECT</p>
          <h2>FROM PALM<br />TO PRODUCT.</h2>
        </div>
        <p>Culture to commerce. Heritage to opportunity.</p>
        <button onClick={() => onNavigate({ type: 'coming_soon', title: 'The Project', subtitle: 'The full Raffia Legacy Project experience is being prepared.' })} className="text-link">
          Explore the project <ArrowUpRight size={16} />
        </button>
      </section>
    </div>
  );
};
