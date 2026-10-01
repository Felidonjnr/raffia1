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
        'Explore handwoven raffia vessels, structured leather totes, and fiber tapestries directly supporting master artisan guilds in Nigeria.';
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
      title = 'Curatorial Collections | Raffia Legacy';
      description =
        'Explore living narrative collections celebrating riverine harvesting, architectural vessels, and botanical dye traditions.';
    } else if (route.type === 'makers' || route.type === 'maker_detail') {
      title = 'Custodians & Master Makers | Raffia Legacy Guild Directory';
      description =
        'Meet the multigenerational guilds and contemporary designers safeguarding African palm weaving and botanical dye mastery.';
    } else if (route.type === 'raffia') {
      title = 'The Raffia Knowledge Archive | Cultural Discovery Platform';
      description =
        'A comprehensive educational compendium exploring the botany, civilizational memory, and living ceremonial roles of Raphia palms.';
    } else if (route.type === 'project' || route.type === 'legacy_year') {
      title = 'The Project & The Legacy Year | Dance Ville';
      description =
        'The 12-month ecosystem connecting schools, material science fellowships, design challenges, and enterprise incubators.';
    } else if (route.type === 'festival') {
      title = 'Raffia Festival 2027 | The Flagship Cultural Gathering';
      description =
        'October 2027 in Akwa Ibom: four days of masquerade street pageantry, circular materials summits, runway fashion, and trade halls.';
    } else if (route.type === 'checkout') {
      title = 'Checkout & Acquisition | Raffia Legacy';
      description = 'Complete your certified artisan guild acquisition.';
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
