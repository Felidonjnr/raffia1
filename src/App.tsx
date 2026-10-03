import React, { useEffect, useMemo, useState } from 'react';
import { ViewRoute } from './types';
import { CartProvider } from './context/CartContext';
import { MarketplaceDataProvider } from './context/MarketplaceDataContext';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { SEOHead } from './components/SEOHead';
import { PageTransition } from './components/PageTransition';
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProjectPage } from './pages/ProjectPage';
import { LegacyYearPage } from './pages/LegacyYearPage';
import { FestivalPage } from './pages/FestivalPage';
import { GetInvolvedPage } from './pages/GetInvolvedPage';
import { RaffiaPage } from './pages/RaffiaPage';
import { ExplorePage } from './pages/ExplorePage';
import { ComingSoon } from './components/ComingSoon';

const comingSoon = (title: string, subtitle?: string): ViewRoute => ({
  type: 'coming_soon',
  title,
  subtitle: subtitle || 'This section is currently being prepared for the upcoming launch.',
});

function routeFromHash(hash: string): ViewRoute {
  if (hash.startsWith('#/admin')) return { type: 'admin' } as ViewRoute;
  if (hash.startsWith('#/marketplace/')) {
    const slug = hash.replace('#/marketplace/', '');
    if (slug) return { type: 'product', slug };
  }
  if (hash === '#/marketplace') return { type: 'marketplace' };
  if (hash.startsWith('#/checkout')) return { type: 'checkout' };
  if (hash.startsWith('#/project')) {
    const section = hash.replace('#/project', '').replace(/^\//, '') as 'about' | 'vision' | 'legacy-year' | 'programmes' | 'impact' | 'partners' | '';
    const validSections = ['about', 'vision', 'legacy-year', 'programmes', 'impact', 'partners'];
    return { type: 'project', section: validSections.includes(section) ? section as any : 'about' };
  }
  if (hash.startsWith('#/get-involved')) {
    const section = hash.replace('#/get-involved', '').replace(/^\//, '') as any;
    const validSections = ['partner','sponsor','donate','volunteer','maker','schools','young-people','creatives','businesses','media'];
    return { type: 'get_involved', section: validSections.includes(section) ? section : 'partner' };
  }
  if (hash.startsWith('#/legacy-year')) {
    return comingSoon('The Legacy Year', 'The 12-month calendar and timeline are currently being prepared.');
  }
  if (hash.startsWith('#/explore')) {
    const section = hash.replace('#/explore', '').replace(/^\//, '') || undefined;
    return { type: 'explore', section };
  }
  if (hash.startsWith('#/raffia')) {
    const topicSlug = hash.replace('#/raffia', '').replace(/^\//, '') || undefined;
    return { type: 'raffia', topicSlug };
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
    else if (route.type === 'admin') window.location.hash = '#/admin';
    else if (route.type === 'product') window.location.hash = `#/marketplace/${route.slug}`;
    else if (route.type === 'checkout') window.location.hash = '#/checkout';
    else if (route.type === 'get_involved') window.location.hash = route.section ? `#/get-involved/${route.section}` : '#/get-involved';
    else if (route.type === 'raffia') window.location.hash = route.topicSlug ? `#/raffia/${route.topicSlug}` : '#/raffia';
    else if (route.type === 'explore') window.location.hash = route.section ? `#/explore/${route.section}` : '#/explore';
    else if (route.type === 'project') window.location.hash = route.section ? `#/project/${route.section}` : '#/project';
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
            {currentRoute.type === 'admin' && <AdminDashboard onNavigate={navigateTo} />}
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
            {currentRoute.type === 'checkout' && (
              <CheckoutPage onNavigate={navigateTo} />
            )}
            {currentRoute.type === 'project' && (
              <ProjectPage initialSection={currentRoute.section || 'about'} onNavigate={navigateTo} />
            )}
            {currentRoute.type === 'get_involved' && (
              <GetInvolvedPage initialSection={currentRoute.section} onNavigate={navigateTo} />
            )}
            {currentRoute.type === 'festival' && (
              <FestivalPage onNavigate={navigateTo} />
            )}
            {currentRoute.type === 'raffia' && (
              <RaffiaPage topicSlug={currentRoute.topicSlug} onNavigate={navigateTo} />
            )}
            {currentRoute.type === 'explore' && (
              <ExplorePage section={currentRoute.section} onNavigate={navigateTo} />
            )}
            {currentRoute.type !== 'home' && currentRoute.type !== 'admin' && currentRoute.type !== 'marketplace' && currentRoute.type !== 'product' && currentRoute.type !== 'checkout' && currentRoute.type !== 'project' && currentRoute.type !== 'get_involved' && currentRoute.type !== 'raffia' && currentRoute.type !== 'explore' && (
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
          onNavigateToCheckout={() => navigateTo({ type: 'checkout' })}
        />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigateTo} />
        <Footer onNavigate={navigateTo} />
      </div>
      </MarketplaceDataProvider>
    </CartProvider>
  );
}
