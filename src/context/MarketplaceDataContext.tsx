import React, { createContext, useContext, useEffect, useState } from 'react';
import { Collection, Maker, Product } from '../types';
import { getMarketplaceCollections, getMarketplaceMakers, getMarketplaceProducts } from '../lib/marketplace';

interface MarketplaceDataContextValue {
  products: Product[];
  collections: Collection[];
  makers: Maker[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

const MarketplaceDataContext = createContext<MarketplaceDataContextValue | null>(null);

export const MarketplaceDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [makers, setMakers] = useState<Maker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextProducts, nextCollections, nextMakers] = await Promise.all([
        getMarketplaceProducts(),
        getMarketplaceCollections(),
        getMarketplaceMakers(),
      ]);
      setProducts(nextProducts);
      setCollections(nextCollections);
      setMakers(nextMakers);
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
    // Keep public catalog clients responsive to admin changes without requiring a full page refresh.
    const timer = window.setInterval(() => {
      refresh();
    }, 60000);
    return () => window.clearInterval(timer);
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
