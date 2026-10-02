import React, { useEffect, useMemo, useState } from 'react';
import { ViewRoute } from './types';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SEOHead } from './components/SEOHead';
import { PageTransition } from './components/PageTransition';
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProjectPage } from './pages/ProjectPage';
import { LegacyYearPage } from './pages/LegacyYearPage';
import { ComingSoon } from './components/ComingSoon';

const comingSoon = (title: string, subtitle?: string): ViewRoute => ({
  type: 'coming_soon',
  title,
  subtitle: subtitle || 'This section is currently being prepared for the upcoming launch.',
});

function routeFromHash(hash: string): ViewRoute {
  if (hash.startsWith('#/marketplace/')) {
    const slug = hash.replace('#/marketplace/', '');
    if (slug) return { type: 'product', slug };
  }
  if (hash === '#/marketplace') return { type: 'marketplace' };
  if (hash.startsWith('#/project')) {
    return comingSoon('The Project', 'The full Raffia Legacy Project experience is currently being prepared.');
  }
  if (hash.startsWith('#/legacy-year')) {
    return comingSoon('The Legacy Year', 'The 12-month calendar and timeline are currently being prepared.');
  }
  if (hash.startsWith('#/raffia')) {
    return comingSoon('Raffia Heritage & Culture', 'The story, culture and craft of raffia are currently being prepared.');
  }
  if (hash.startsWith('#/festival')) {
    return comingSoon('The Raffia Festival', 'Festival experiences and details are currently being prepared.');
  }
  if (hash.startsWith('#/makers')) {
    return comingSoon('Meet The Makers', 'Artisan profiles, workshops, and stories are currently being prepared.');
  }
  return { type: 'home' };
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>(() => routeFromHash(window.location.hash));
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentRoute(routeFromHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (route: ViewRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (route.type === 'home') window.location.hash = '#/';
    else if (route.type === 'marketplace') window.location.hash = '#/marketplace';
    else if (route.type === 'product') window.location.hash = `#/marketplace/${route.slug}`;
    else if (route.type === 'coming_soon') {
      window.history.replaceState({}, '', window.location.pathname + '#/coming-soon');
    }
  };

  const routeKey = useMemo(() => {
    if (currentRoute.type === 'product') return `product-${currentRoute.slug}`;
    if (currentRoute.type === 'coming_soon') return `coming-soon-${currentRoute.title}`;
    return currentRoute.type;
  }, [currentRoute]);

  return (
    <CartProvider>
      <SEOHead route={currentRoute} />
      <div className="app-shell">
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="app-main">
          <PageTransition routeKey={routeKey}>
            {currentRoute.type === 'home' && (
              <HomePage
                onNavigate={navigateTo}
                onSelectProduct={(slug) => navigateTo({ type: 'product', slug })}
              />
            )}
            {currentRoute.type === 'marketplace' && (
              <MarketplacePage
                initialCategory={currentRoute.category || 'ALL'}
                initialCollection={currentRoute.collection}
                onNavigate={navigateTo}
                onSelectProduct={(slug) => navigateTo({ type: 'product', slug })}
              />
            )}
            {currentRoute.type === 'product' && (
              <ProductDetailPage
                slug={currentRoute.slug}
                onNavigate={navigateTo}
                onSelectProduct={(slug) => navigateTo({ type: 'product', slug })}
              />
            )}
            {currentRoute.type !== 'home' && currentRoute.type !== 'marketplace' && currentRoute.type !== 'product' && (
              <ComingSoon
                title={('title' in currentRoute && currentRoute.title) || 'The Project'}
                subtitle={('subtitle' in currentRoute && currentRoute.subtitle) || 'This section is currently being prepared for the upcoming launch.'}
                onNavigate={navigateTo}
              />
            )}
          </PageTransition>
        </main>
        <CartDrawer
          onNavigateToProduct={(slug) => navigateTo({ type: 'product', slug })}
          onNavigateToCheckout={() => navigateTo(comingSoon('Checkout', 'Payment integration is currently being prepared.'))}
        />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigateTo} />
        <CheckoutModal />
        <Footer onNavigate={navigateTo} />
      </div>
    </CartProvider>
  );
}
