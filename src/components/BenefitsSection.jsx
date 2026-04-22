import { motion } from 'framer-motion';

const benefits = [
  {
    icon: '🌿',
    title: '100% Natural',
    description: 'Made from the finest natural ingredients with no artificial additives or chemicals.',
  },
  {
    icon: '🚫',
    title: 'No Preservatives',
    description: 'Fresh and pure. We never use preservatives — just real, whole food goodness.',
  },
  {
    icon: '⚡',
    title: 'Boosts Energy',
    description: 'Packed with protein, healthy fats, and natural sugars for sustained energy throughout the day.',
  },
  {
    icon: '❤️',
    title: 'Made with Love',
    description: 'Each product is carefully handcrafted using traditional recipes passed down through generations.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 md:py-28 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Why Choose <span className="text-gold">Khapal Foods</span>?
          </h2>
          <div className="art-deco-divider mt-6">
            <span className="text-gold text-xl">✦</span>
          </div>
          <p className="section-subtitle">
            We believe in the power of natural, wholesome ingredients to nourish your body and soul.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-300 border border-beige/30"
            >
              <div className="text-5xl mb-5">{benefit.icon}</div>
              <h3 className="font-display text-xl font-bold text-rich-brown mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(92,61,46,0.7)' }}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
