/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ViewRoute } from './types';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { InquiryModal } from './components/InquiryModal';
import { SEOHead } from './components/SEOHead';
import { PageTransition } from './components/PageTransition';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { MakersDirectoryPage } from './pages/MakersDirectoryPage';
import { MakerDetailPage } from './pages/MakerDetailPage';
import { RaffiaArchivePage } from './pages/RaffiaArchivePage';
import { ProjectPage } from './pages/ProjectPage';
import { LegacyYearPage } from './pages/LegacyYearPage';
import { FestivalPage } from './pages/FestivalPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ComingSoon } from './components/ComingSoon';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/marketplace/')) {
      const slug = hash.replace('#/marketplace/', '');
      if (slug) return { type: 'product', slug };
    }
    if (hash === '#/marketplace') return { type: 'marketplace' };
    if (hash.startsWith('#/collections/')) {
      const slug = hash.replace('#/collections/', '');
      if (slug) return { type: 'collections', slug };
    }
    if (hash === '#/collections') return { type: 'collections' };
    if (hash.startsWith('#/makers/')) {
      const slug = hash.replace('#/makers/', '');
      if (slug) return { type: 'maker_detail', slug };
    }
    if (hash === '#/makers') return { type: 'makers' };
    if (hash.startsWith('#/raffia/')) {
      const topicSlug = hash.replace('#/raffia/', '');
      return { type: 'raffia', topicSlug };
    }
    if (hash === '#/raffia') return { type: 'raffia' };
    if (hash === '#/project/vision') return { type: 'project', section: 'vision' };
    if (hash === '#/project/programmes') return { type: 'project', section: 'programmes' };
    if (hash === '#/project/impact') return { type: 'project', section: 'impact' };
    if (hash === '#/project/partners') return { type: 'project', section: 'partners' };
    if (hash === '#/project/legacy-year') return { type: 'legacy_year' };
    if (hash === '#/project') return { type: 'project' };
    if (hash === '#/festival') return { type: 'festival' };
    if (hash === '#/checkout') return { type: 'checkout' };
    return { type: 'home' };
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync hash with route state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/marketplace/')) {
        const slug = hash.replace('#/marketplace/', '');
        if (slug) {
          setCurrentRoute({ type: 'product', slug });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      if (hash === '#/marketplace') {
        setCurrentRoute({ type: 'marketplace' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash.startsWith('#/collections/')) {
        const slug = hash.replace('#/collections/', '');
        if (slug) {
          setCurrentRoute({ type: 'collections', slug });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      if (hash === '#/collections') {
        setCurrentRoute({ type: 'collections' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash.startsWith('#/makers/')) {
        const slug = hash.replace('#/makers/', '');
        if (slug) {
          setCurrentRoute({ type: 'maker_detail', slug });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      if (hash === '#/makers') {
        setCurrentRoute({ type: 'makers' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash.startsWith('#/raffia/')) {
        const topicSlug = hash.replace('#/raffia/', '');
        setCurrentRoute({ type: 'raffia', topicSlug });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/raffia') {
        setCurrentRoute({ type: 'raffia' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/project/vision') {
        setCurrentRoute({ type: 'project', section: 'vision' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/project/programmes') {
        setCurrentRoute({ type: 'project', section: 'programmes' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/project/impact') {
        setCurrentRoute({ type: 'project', section: 'impact' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/project/partners') {
        setCurrentRoute({ type: 'project', section: 'partners' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/project/legacy-year') {
        setCurrentRoute({ type: 'legacy_year' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/project') {
        setCurrentRoute({ type: 'project' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/festival') {
        setCurrentRoute({ type: 'festival' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/checkout') {
        setCurrentRoute({ type: 'checkout' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#/' || hash === '' || hash === '#home') {
        setCurrentRoute({ type: 'home' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: ViewRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (route.type === 'home') {
      window.location.hash = '#/';
    } else if (route.type === 'marketplace') {
      window.location.hash = '#/marketplace';
    } else if (route.type === 'product') {
      window.location.hash = `#/marketplace/${route.slug}`;
    } else if (route.type === 'collections') {
      window.location.hash = route.slug ? `#/collections/${route.slug}` : '#/collections';
    } else if (route.type === 'makers') {
      window.location.hash = '#/makers';
    } else if (route.type === 'maker_detail') {
      window.location.hash = `#/makers/${route.slug}`;
    } else if (route.type === 'raffia') {
      window.location.hash = route.topicSlug ? `#/raffia/${route.topicSlug}` : '#/raffia';
    } else if (route.type === 'project') {
      window.location.hash = route.section ? `#/project/${route.section}` : '#/project';
    } else if (route.type === 'legacy_year') {
      window.location.hash = '#/project/legacy-year';
    } else if (route.type === 'festival') {
      window.location.hash = '#/festival';
    } else if (route.type === 'checkout') {
      window.location.hash = '#/checkout';
    }
  };

  const handleSelectProduct = (slug: string) => {
    navigateTo({ type: 'product', slug });
  };

  const handleSelectMaker = (slug: string) => {
    navigateTo({ type: 'maker_detail', slug });
  };

  const routeKey = useMemo(() => {
    if (currentRoute.type === 'product') return `product-${currentRoute.slug}`;
    if (currentRoute.type === 'collections') return `collections-${currentRoute.slug || 'all'}`;
    if (currentRoute.type === 'maker_detail') return `maker-${currentRoute.slug}`;
    if (currentRoute.type === 'raffia') return `raffia-${currentRoute.topicSlug || 'all'}`;
    if (currentRoute.type === 'project') return `project-${currentRoute.section || 'all'}`;
    return currentRoute.type;
  }, [currentRoute]);

  return (
    <CartProvider>
      {/* Dynamic SEO & JSON-LD Structured Data */}
      <SEOHead route={currentRoute} />

      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#181513]">
        {/* Navigation Bar with Primary Links & Mega Menu */}
        <Navbar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Multi-Route Views with Smooth Page Transition */}
        <main className="flex-1">
          <PageTransition routeKey={routeKey}>
            {currentRoute.type === 'home' && (
              <HomePage
                onNavigate={navigateTo}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentRoute.type === 'marketplace' && (
              <MarketplacePage
                initialCategory={currentRoute.category || 'ALL'}
                initialCollection={currentRoute.collection}
                onNavigate={navigateTo}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentRoute.type === 'product' && (
              <ProductDetailPage
                slug={currentRoute.slug}
                onNavigate={navigateTo}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentRoute.type === 'collections' && (
              <CollectionsPage
                initialSlug={currentRoute.slug}
                onNavigate={navigateTo}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentRoute.type === 'makers' && (
              <MakersDirectoryPage
                onNavigate={navigateTo}
                onSelectMaker={handleSelectMaker}
              />
            )}

            {currentRoute.type === 'maker_detail' && (
              <MakerDetailPage
                slug={currentRoute.slug}
                onNavigate={navigateTo}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentRoute.type === 'raffia' && (
              <RaffiaArchivePage
                initialTopicSlug={currentRoute.topicSlug}
                onNavigate={navigateTo}
              />
            )}

            {currentRoute.type === 'project' && (
              <ProjectPage
                initialSection={currentRoute.section}
                onNavigate={navigateTo}
              />
            )}

            {currentRoute.type === 'legacy_year' && (
              <LegacyYearPage onNavigate={navigateTo} />
            )}

            {currentRoute.type === 'festival' && (
              <FestivalPage onNavigate={navigateTo} />
            )}

            {currentRoute.type === 'checkout' && (
              <CheckoutPage onNavigate={navigateTo} />
            )}

            {currentRoute.type === 'coming_soon' && (
              <ComingSoon
                title={currentRoute.title}
                subtitle={currentRoute.subtitle}
                onNavigate={navigateTo}
              />
            )}
          </PageTransition>
        </main>

        {/* Global Slide-Over Cart Drawer */}
        <CartDrawer
          onNavigateToProduct={handleSelectProduct}
          onNavigateToCheckout={() => navigateTo({ type: 'checkout' })}
        />

        {/* Instant Search Modal across all categories */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={navigateTo}
        />

        {/* Prepared Checkout Reserve Modal */}
        <CheckoutModal />

        {/* Partnership / Sponsorship Inquiry Modal */}
        <InquiryModal />

        {/* Editorial Footer */}
        <Footer onNavigate={navigateTo} />
      </div>
    </CartProvider>
  );
}
