import { Product, Collection, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';
import { COLLECTIONS } from '../data/collections';

/**
 * Product Data Service Layer
 * 
 * Abstract service providing access to products and collections.
 * Currently backed by verified structured local datasets.
 * Ready to be connected to WordPress / WooCommerce REST API (e.g., /wp-json/wc/v3/products)
 * or a GraphQL endpoint without changing any UI component implementation.
 */
export interface ProductQueryOptions {
  category?: ProductCategory;
  collectionSlug?: string;
  search?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'name';
  inStockOnly?: boolean;
}

export const ProductService = {
  /**
   * Retrieve all products with optional filters
   */
  async getProducts(options?: ProductQueryOptions): Promise<Product[]> {
    let list = [...PRODUCTS];

    if (!options) return list;

    if (options.collectionSlug && options.collectionSlug !== 'all') {
      const col = COLLECTIONS.find((c) => c.slug === options.collectionSlug);
      if (col) {
        list = list.filter((p) => col.productIds.includes(p.id));
      }
    }

    if (options.category && options.category !== 'ALL') {
      list = list.filter((p) => p.category === options.category);
    }

    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.maker.name.toLowerCase().includes(q) ||
          p.materials.some((m) => m.toLowerCase().includes(q))
      );
    }

    if (options.inStockOnly) {
      list = list.filter((p) => p.availability === 'IN STOCK');
    }

    if (options.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (options.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (options.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  },

  /**
   * Retrieve single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return PRODUCTS.find((p) => p.slug === slug);
  },

  /**
   * Retrieve featured centerpiece object
   */
  async getFeaturedObject(): Promise<Product> {
    return PRODUCTS.find((p) => p.featuredObject) || PRODUCTS[0];
  },

  /**
   * Retrieve all curated collections
   */
  async getCollections(): Promise<Collection[]> {
    return [...COLLECTIONS];
  },

  /**
   * Retrieve collection by slug with linked products
   */
  async getCollectionBySlug(slug: string): Promise<{ collection: Collection; products: Product[] } | undefined> {
    const collection = COLLECTIONS.find((c) => c.slug === slug);
    if (!collection) return undefined;
    const products = PRODUCTS.filter((p) => collection.productIds.includes(p.id));
    return { collection, products };
  },
};
