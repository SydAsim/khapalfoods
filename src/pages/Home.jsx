import { lazy, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import { products } from '../utils/products';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// Lazy-load below-fold sections — they are never needed until user scrolls
const BenefitsSection = lazy(() => import('../components/BenefitsSection'));
const IngredientsSection = lazy(() => import('../components/IngredientsSection'));
const TrustSection = lazy(() => import('../components/TrustSection'));

// Null fallback for below-fold sections keeps height stable
const SectionLoader = () => (
  <div className="py-20 md:py-28 bg-cream" aria-hidden="true" />
);

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Products Section */}
      <section id="products" className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              Our <span className="text-gold">Products</span>
            </h2>
            <div className="art-deco-divider mt-6">
              <span className="text-gold text-xl">✦</span>
            </div>
            <p className="section-subtitle">
              Handcrafted with the finest natural ingredients for your health and happiness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionLoader />}>
        <BenefitsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <IngredientsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TrustSection />
      </Suspense>
    </>
  );
}
