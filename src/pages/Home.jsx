import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import BenefitsSection from '../components/BenefitsSection';
import IngredientsSection from '../components/IngredientsSection';
import TrustSection from '../components/TrustSection';
import { products } from '../utils/products';
import { motion } from 'framer-motion';

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

      <BenefitsSection />
      <IngredientsSection />
      <TrustSection />
    </>
  );
}
