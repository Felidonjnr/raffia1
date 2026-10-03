import React, { createContext, useContext, useEffect, useState } from 'react';
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

  const refresh = async () => {
    setLoading(true);
    setError('');
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
      setCategories(nextCategories.length ? nextCategories : Array.from(new Set(nextProducts.map((p) => p.category))).filter((name) => name !== 'ALL').map((name, index) => ({ id: name, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), } as MarketplaceCategory)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load marketplace data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('marketplace-live-catalog')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_images' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'makers' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, refresh)
      .subscribe();

    const timer = window.setInterval(() => refresh(), 60000);
    return () => {
      window.clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <MarketplaceDataContext.Provider value={{ products, collections, makers, loading, error, refresh }}>
      {children}
    </MarketplaceDataContext.Provider>
  );
};

export function useMarketplaceData() {
  const context = useContext(MarketplaceDataContext);
  if (!context) throw new Error('useMarketplaceData must be used inside MarketplaceDataProvider');
  return context;
}
