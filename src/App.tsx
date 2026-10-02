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

const comingSoon = (title: string): ViewRoute => ({
  type: 'coming_soon',
  title,
  subtitle: 'This section is outside today’s build scope and will be developed next.',
});

function routeFromHash(hash: string): ViewRoute {
  if (hash.startsWith('#/marketplace/')) {
    const slug = hash.replace('#/marketplace/', '');
    if (slug) return { type: 'product', slug };
  }
  if (hash === '#/marketplace') return { type: 'marketplace' };
  if (hash === '#/project') return { type: 'project', section: 'about' };
  if (hash === '#/legacy-year') return { type: 'legacy_year' };
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
    else if (route.type === 'project') window.location.hash = `#/project${route.section ? `/${route.section}` : ''}`;
    else if (route.type === 'legacy_year') window.location.hash = '#/legacy-year';
    else if (route.type === 'coming_soon') {
      window.history.replaceState({}, '', window.location.pathname + '#/coming-soon');
    }
  };

  const routeKey = useMemo(() => {
    if (currentRoute.type === 'product') return `product-${currentRoute.slug}`;
    return currentRoute.type;
  }, [currentRoute]);

  return (
    <CartProvider>
      <SEOHead route={currentRoute} />
      <div className="app-shell">
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="app-main">
          <PageTransition routeKey={routeKey}>
            {currentRoute.type === 'home' && <HomePage onNavigate={navigateTo} onSelectProduct={(slug) => navigateTo({type:'product', slug})} />}
            {currentRoute.type === 'project' && <ProjectPage initialSection={currentRoute.section || 'about'} onNavigate={navigateTo} />}
            {currentRoute.type === 'legacy_year' && <LegacyYearPage onNavigate={navigateTo} />}
            {currentRoute.type === 'marketplace' && (
              <MarketplacePage
                initialCategory={currentRoute.category || 'ALL'}
                initialCollection={currentRoute.collection}
                onNavigate={navigateTo}
                onSelectProduct={(slug) => navigateTo({type:'product', slug})}
              />
            )}
            {currentRoute.type === 'product' && (
              <ProductDetailPage slug={currentRoute.slug} onNavigate={navigateTo} onSelectProduct={(slug) => navigateTo({type:'product', slug})} />
            )}
            {currentRoute.type === 'coming_soon' && (
              <ComingSoon title={currentRoute.title} subtitle={currentRoute.subtitle} onNavigate={navigateTo} />
            )}
          </PageTransition>
        </main>
        <CartDrawer
          onNavigateToProduct={(slug) => navigateTo({type:'product', slug})}
          onNavigateToCheckout={() => navigateTo({type:'coming_soon', title:'Checkout', subtitle:'Payment integration is being prepared.'})}
        />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigateTo} />
        <CheckoutModal />
        <Footer onNavigate={navigateTo} />
      </div>
    </CartProvider>
  );
}
