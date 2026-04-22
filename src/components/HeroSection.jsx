import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-beige-light"
    >
      {/* Decorative Art Deco SVG corners */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 text-gold/10" viewBox="0 0 200 200">
          <path d="M0 0 L200 0 L200 10 L10 10 L10 200 L0 200 Z" fill="currentColor" />
          <path d="M0 0 L100 0 L100 5 L5 5 L5 100 L0 100 Z" fill="currentColor" opacity="0.5" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 text-gold/10 rotate-180" viewBox="0 0 200 200">
          <path d="M0 0 L200 0 L200 10 L10 10 L10 200 L0 200 Z" fill="currentColor" />
          <path d="M0 0 L100 0 L100 5 L5 5 L5 100 L0 100 Z" fill="currentColor" opacity="0.5" />
        </svg>

        {/* Floating gradient orbs */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-sage-green/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-sage-green/10 text-sage-green px-4 py-2 rounded-full mb-6"
            >
              <span className="text-sm">🌿</span>
              <span className="text-sm font-medium">100% Natural & Homemade</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-rich-brown leading-tight"
            >
              Made with{' '}
              <span className="text-gold italic">Love</span>,
              <br />
              Packed with{' '}
              <span className="text-sage-green italic">Energy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-lg md:text-xl leading-relaxed max-w-lg"
              style={{ color: 'rgba(92, 61, 46, 0.8)' }}
            >
              Discover the goodness of tradition with Khapal Foods.
              Our handcrafted energy balls and superfood mixes are made
              from premium dry fruits, seeds, and natural ingredients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a href="#products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg"
                  id="hero-shop-now"
                >
                  Shop Now
                </motion.button>
              </a>
              <a href="#ingredients">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg"
                  id="hero-learn-more"
                >
                  Learn More
                </motion.button>
              </a>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
              style={{ color: 'rgba(92, 61, 46, 0.55)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sage-green">✓</span>
                <span>No Preservatives</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sage-green">✓</span>
                <span>Fresh & Hygienic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sage-green">✓</span>
                <span>Premium Quality</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative">
              {/* Slow rotating dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-dashed border-gold/20 rounded-full scale-110"
              />

              {/* Main image */}
              <div className="relative rounded-full overflow-hidden aspect-square bg-gradient-to-br from-beige to-cream-dark shadow-2xl border-4 border-gold/20">
                <img
                  src="/images/hero-product.png"
                  alt="Khapal Foods Energy Balls — Handcrafted with premium dry fruits and seeds"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Floating badge: 100% Natural */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm shadow-card rounded-2xl px-4 py-3"
              >
                <div className="text-center">
                  <div className="text-2xl">🌿</div>
                  <div className="text-xs font-semibold text-sage-green mt-1">100% Natural</div>
                </div>
              </motion.div>

              {/* Floating badge: Energy Boost */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm shadow-card rounded-2xl px-4 py-3"
              >
                <div className="text-center">
                  <div className="text-2xl">⚡</div>
                  <div className="text-xs font-semibold text-gold mt-1">Energy Boost</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 rounded-full flex justify-center pt-2" style={{ borderColor: 'rgba(92,61,46,0.3)' }}>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-gold rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
