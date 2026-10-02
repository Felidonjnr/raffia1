import React, { useEffect } from 'react';
import { ViewRoute, Product } from '../types';
import { PRODUCTS } from '../data/products';

interface SEOHeadProps {
  route: ViewRoute;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ route }) => {
  useEffect(() => {
    let title = 'Raffia Legacy | A Living Journey of Heritage, Creativity & Opportunity';
    let description =
      'A living journey of heritage, creativity and opportunity presented by Dance Ville. Discover contemporary African raffia fashion, art, makers, and curated marketplace.';
    let schemaData: object = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Raffia Legacy',
      url: window.location.origin,
      founder: 'Dance Ville',
      description: description,
    };

    if (route.type === 'marketplace') {
      title = 'The Raffia Marketplace | Contemporary African Craft & Objects';
      description =
        'Explore handwoven raffia vessels, totes, and textiles directly supporting artisans and creative enterprise in Nigeria.';
    } else if (route.type === 'product') {
      const prod = PRODUCTS.find((p) => p.slug === route.slug);
      if (prod) {
        title = `${prod.name} | Raffia Legacy Marketplace`;
        description = `${prod.subtitle}. Handcrafted by ${prod.maker.name}. ${prod.materials.join(', ')}.`;
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: prod.name,
          image: [prod.image],
          description: prod.description,
          offers: {
            '@type': 'Offer',
            priceCurrency: prod.currency,
            price: prod.price,
            availability: 'https://schema.org/InStock',
          },
          brand: {
            '@type': 'Brand',
            name: prod.maker.name,
          },
        };
      }
    } else if (route.type === 'collections') {
      title = 'Curated Collections | Raffia Legacy';
      description =
        'Explore collections celebrating raffia craft, design, objects and wearable fashion.';
    } else if (route.type === 'makers' || route.type === 'maker_detail') {
      title = 'Artisans & Creatives | Raffia Legacy';
      description =
        'Artisans, designers and creatives working to turn raffia heritage into new products, fashion, art and enterprise.';
    } else if (route.type === 'raffia') {
      title = 'Why Raffia? | Raffia Legacy Project';
      description =
        'Raffia is more than a material. It carries history, skill, identity and possibility.';
    } else if (route.type === 'project' || route.type === 'legacy_year') {
      title = 'The Project & The Legacy Year | Dance Ville';
      description =
        'The year-round ecosystem connecting school programmes, young innovators, design challenges, business incubators, and the Raffia Festival.';
    } else if (route.type === 'festival') {
      title = 'The Raffia Festival | The Flagship Cultural Event';
      description =
        'Experience the culture, creativity, products and opportunities created throughout the Legacy Year.';
    } else if (route.type === 'checkout') {
      title = 'Checkout & Reservation | Raffia Legacy';
      description = 'Complete your order reservation.';
    }

    // Set Document Title
    document.title = title;

    // Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Set OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    // Set OG Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    // Update JSON-LD structured data
    let scriptTag = document.getElementById('json-ld-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-structured-data';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);
  }, [route]);

  return null;
};
