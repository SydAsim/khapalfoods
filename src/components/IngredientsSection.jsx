import { motion } from 'framer-motion';

const allIngredients = [
  { name: 'Almonds', emoji: '🌰', benefit: 'Brain health & energy', color: 'bg-amber-50' },
  { name: 'Walnuts', emoji: '🥜', benefit: 'Omega-3 & antioxidants', color: 'bg-orange-50' },
  { name: 'Peanuts', emoji: '🥜', benefit: 'Protein & healthy fats', color: 'bg-yellow-50' },
  { name: 'Pumpkin Seeds', emoji: '🎃', benefit: 'Immunity booster', color: 'bg-green-50' },
  { name: 'Sesame Seeds', emoji: '✨', benefit: 'Strong bones', color: 'bg-amber-50' },
  { name: 'Flax Seeds', emoji: '🌿', benefit: 'Heart health', color: 'bg-emerald-50' },
  { name: 'Chia Seeds', emoji: '🌱', benefit: 'Digestion & fiber', color: 'bg-teal-50' },
  { name: 'Coconut', emoji: '🥥', benefit: 'Metabolism boost', color: 'bg-stone-50' },
  { name: 'Ghee', emoji: '🧈', benefit: 'Immunity & warmth', color: 'bg-yellow-50' },
  { name: 'Turmeric', emoji: '💛', benefit: 'Anti-inflammatory', color: 'bg-amber-50' },
  { name: 'Dried Dates', emoji: '🌴', benefit: 'Natural sweetness', color: 'bg-orange-50' },
  { name: 'Cashews', emoji: '🥜', benefit: 'Energy & iron', color: 'bg-amber-50' },
];

export default function IngredientsSection() {
  return (
    <section id="ingredients" className="py-20 md:py-28 bg-cream relative overflow-hidden">
      {/* Top & bottom decorative lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(200,164,90,0.2), transparent)' }} />
        <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(200,164,90,0.2), transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Premium <span className="text-gold">Ingredients</span>
          </h2>
          <div className="art-deco-divider mt-6">
            <span className="text-gold text-xl">✦</span>
          </div>
          <p className="section-subtitle">
            Every ingredient is carefully selected for its nutritional value and authentic taste.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {allIngredients.map((ingredient, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={{ y: -5, scale: 1.05 }}
              className={`${ingredient.color} rounded-2xl p-5 text-center cursor-default transition-shadow duration-300 hover:shadow-card border border-beige/30`}
            >
              <div className="text-3xl mb-2">{ingredient.emoji}</div>
              <h4 className="font-display text-sm font-bold text-rich-brown">
                {ingredient.name}
              </h4>
              <p className="text-xs mt-1" style={{ color: 'rgba(92,61,46,0.6)' }}>
                {ingredient.benefit}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
