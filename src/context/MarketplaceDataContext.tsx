import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Collection, Maker, Product } from '../types';
import { MarketplaceCategory } from '../lib/marketplace';
import { getMarketplaceCategories, getMarketplaceCollections, getMarketplaceMakers, getMarketplaceProducts } from '../lib/marketplace';
import { supabase } from '../lib/supabase';

interface MarketplaceDataContextValue {
  products: Product[];
  collections: Collection[];
  makers: Maker[];
  categories: MarketplaceCategory[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

const MarketplaceDataContext = createContext<MarketplaceDataContextValue | null>(null);

export const MarketplaceDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [makers, setMakers] = useState<Maker[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refreshTimer = useRef<number | null>(null);
  const requestInFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setError('');
    if (products.length === 0) setLoading(true);
    try {
      const [nextProducts, nextCollections, nextMakers, nextCategories] = await Promise.all([
        getMarketplaceProducts(),
        getMarketplaceCollections(),
        getMarketplaceMakers(),
        getMarketplaceCategories(),
      ]);
      setProducts(nextProducts);
      setCollections(nextCollections);
      setMakers(nextMakers);
      setCategories(nextCategories.length ? nextCategories : Array.from(new Set(nextProducts.map((p) => p.category))).filter((name) => name !== 'ALL').map((name) => ({ id: name, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') } as MarketplaceCategory)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load marketplace data.');
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }, [products.length]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const scheduleRefresh = () => {
      if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
      refreshTimer.current = window.setTimeout(() => {
        refreshTimer.current = null;
        void refresh();
      }, 350);
    };

    const channel = client
      .channel('marketplace-live-catalog')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_images' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'makers' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, scheduleRefresh)
      .subscribe();

    return () => {
      if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
      client.removeChannel(channel);
    };
  }, [refresh]);

  return (
    <MarketplaceDataContext.Provider value={{ products, collections, makers, categories, loading, error, refresh }}>
      {children}
    </MarketplaceDataContext.Provider>
  );
};

export function useMarketplaceData() {
  const context = useContext(MarketplaceDataContext);
  if (!context) throw new Error('useMarketplaceData must be used inside MarketplaceDataProvider');
  return context;
}
