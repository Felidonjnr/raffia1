import React, { useState } from 'react';
import { Product, ViewRoute } from '../types';
import { PRODUCTS } from '../data/products';
import { MAKERS } from '../data/makers';
import { ArchivalImage } from '../components/ArchivalImage';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Plus, Minus, ShieldCheck, Truck, Sparkles, MapPin } from 'lucide-react';
import { formatNaira } from '../utils/format';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (route: ViewRoute) => void;
  onSelectProduct: (slug: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigate,
  onSelectProduct,
}) => {
  const { addToCart, setIsCartOpen, setIsCheckoutModalOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const makerProfile = MAKERS.find((m) => m.id === product.maker.id);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToBag = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const currentImage = product.gallery[selectedGalleryIdx] || product.image;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Breadcrumb & Top Bar */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#57524E]">
          <button
            onClick={() => onNavigate({ type: 'marketplace' })}
            className="hover:text-[#181513] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>
          <span>/</span>
          <span className="text-[#8C7355]">{product.category}</span>
          <span>/</span>
          <span className="text-[#181513] font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Contiguous Purchase Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Gallery & Visuals (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large View */}
            <div className="border border-[#181513]/10 bg-[#ECE5DC] overflow-hidden">
              <ArchivalImage
                src={currentImage}
                alt={product.name}
                aspectRatio="4:3"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Thumbnail selector */}
            {product.gallery.length > 1 && (
              <div className="flex gap-3">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGalleryIdx(idx)}
                    className={`w-24 h-20 border overflow-hidden cursor-pointer transition-all ${
                      selectedGalleryIdx === idx
                        ? 'border-[#B84A28] ring-1 ring-[#B84A28]'
                        : 'border-[#181513]/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ArchivalImage
                      src={img}
                      alt={`${product.name} detail view ${idx + 1}`}
                      aspectRatio="custom"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product details footnote */}
            <div className="pt-4 border-t border-[#181513]/10 flex items-center justify-between text-xs font-mono uppercase text-[#8C7355]">
              <span>Raffia Heritage Craft</span>
              <span>Origin: {product.origin}</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (5 cols) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#8C7355] mb-2">
                <span>{product.category}</span>
                <span className="text-[#B84A28] font-medium">{product.availability}</span>
              </div>

              {/* Title */}
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#181513] mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Subtitle / Kicker */}
              <p className="text-sm text-[#57524E] leading-relaxed mb-4">
                {product.subtitle}
              </p>

              {/* Maker link */}
              <div className="inline-flex items-center gap-1.5 text-xs text-[#181513] font-medium mb-6">
                <span>Handcrafted by</span>
                <span className="font-editorial text-base italic underline underline-offset-2 text-[#B84A28]">
                  {product.maker.name}
                </span>
                <span className="text-[#8C7355]">· {product.maker.region}</span>
              </div>

              {/* Price */}
              <div className="py-4 border-y border-[#181513]/10 flex items-baseline justify-between">
                <span className="text-xs uppercase font-mono tracking-widest text-[#57524E]">
                  Price
                </span>
                <span className="font-editorial text-3xl lg:text-4xl font-bold text-[#181513] tabular-nums">
                  {formatNaira(product.price)}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Action CTAs */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase font-mono tracking-wider text-[#57524E]">
                  Quantity
                </span>
                <div className="flex items-center border border-[#181513]/20 bg-[#FAF7F2]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#57524E] hover:text-[#181513] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-mono tabular-nums font-medium text-[#181513]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-[#57524E] hover:text-[#181513] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {product.leadTime && (
                  <span className="text-xs text-[#8C7355] font-mono">
                    {product.leadTime}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToBag}
                  className="w-full py-4 border border-[#181513] text-[#181513] text-xs font-mono uppercase tracking-widest hover:bg-[#181513] hover:text-[#FAF7F2] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#B84A28] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#9E3E20] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Specifications Definition List */}
            <div className="space-y-3 pt-6 border-t border-[#181513]/10 text-xs">
              <div>
                <span className="font-mono uppercase tracking-wider text-[#8C7355] block mb-1">
                  Description
                </span>
                <p className="text-[#57524E] leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#181513]/5">
                <div>
                  <span className="font-mono uppercase tracking-wider text-[#8C7355] block mb-1">
                    Materials
                  </span>
                  <ul className="text-[#181513] space-y-0.5">
                    {product.materials.map((mat, i) => (
                      <li key={i}>· {mat}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-mono uppercase tracking-wider text-[#8C7355] block mb-1">
                    Dimensions
                  </span>
                  <p className="text-[#181513]">{product.dimensions}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#181513]/5">
                <span className="font-mono uppercase tracking-wider text-[#8C7355] block mb-1">
                  Conservation & Care
                </span>
                <p className="text-[#57524E] leading-relaxed">{product.care}</p>
              </div>
            </div>

            {/* Trust Assurance Strip */}
            <div className="p-4 bg-[#F4EFEA] border border-[#181513]/10 space-y-2 text-xs text-[#57524E]">
              <div className="flex items-center gap-2 text-[#181513]">
                <ShieldCheck className="w-4 h-4 text-[#B84A28]" />
                <span className="font-medium font-sans">Artisan & Heritage Craft</span>
              </div>
              <p>
                Connecting traditional raffia craft and local makers with contemporary markets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About The Maker Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-24">
        <div className="border-t border-[#181513]/10 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#B84A28] block mb-2">
                Maker Profile
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#181513] mb-4">
                About {product.maker.name}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C7355] mb-6">
                <MapPin className="w-3.5 h-3.5 text-[#B84A28]" />
                <span>{product.maker.region}</span>
              </div>
              <p className="text-sm text-[#57524E] leading-relaxed mb-6 font-normal">
                {product.maker.story || 'Artisans and designers creating hand-woven raffia objects and craft.'}
              </p>
              {makerProfile?.quote ? (
                <blockquote className="border-l-2 border-[#B84A28] pl-4 py-1 italic font-editorial text-lg text-[#181513] mb-6">
                  &ldquo;{makerProfile.quote}&rdquo;
                </blockquote>
              ) : null}
            </div>

            <div className="lg:col-span-7">
              <div className="bg-[#ECE5DC] p-8 border border-[#181513]/10 space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-[#8C7355]">
                  Craft & Origin
                </p>
                <p className="text-sm text-[#57524E] leading-relaxed">
                  {makerProfile?.bio ||
                    'Artisans, designers and creatives turning heritage into new products, fashion, art, performance and design.'}
                </p>
                <div className="pt-4 border-t border-[#181513]/10 flex items-center justify-between text-xs text-[#181513]">
                  <span className="font-mono text-xs text-[#8C7355]">{product.materials.join(' · ')}</span>
                  <span className="font-medium text-[#B84A28]">Authentic Nigerian Raffia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-24">
        <div className="border-t border-[#181513]/10 pt-16">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8C7355] block mb-1">
                Curated Companions
              </span>
              <h2 className="font-editorial text-3xl font-light text-[#181513]">
                Related Creations
              </h2>
            </div>
            <button
              onClick={() => onNavigate({ type: 'marketplace' })}
              className="text-xs font-mono uppercase tracking-widest text-[#B84A28] hover:text-[#181513] transition-colors cursor-pointer"
            >
              View All in Marketplace →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(s) => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onSelectProduct(s);
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
