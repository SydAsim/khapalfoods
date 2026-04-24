import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-beige/50 hover:border-gold/30">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-beige-light to-cream">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width="600"
              height="450"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badges.map((badge, i) => (
                <span
                  key={i}
                  className="bg-white/90 backdrop-blur-sm text-warm-brown text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-rich-brown group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'rgba(92,61,46,0.6)' }}>
                  {product.subtitle}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-display text-xl font-bold text-rich-brown">
                  From ₨{product.price.toLocaleString()}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed line-clamp-3" style={{ color: 'rgba(92,61,46,0.7)' }}>
              {product.description}
            </p>

            {/* Ingredient pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {product.ingredients.slice(0, 4).map((ing, i) => (
                <span
                  key={i}
                  className="text-xs bg-beige-light text-warm-brown px-2.5 py-1 rounded-full"
                >
                  {ing.emoji} {ing.name}
                </span>
              ))}
              {product.ingredients.length > 4 && (
                <span className="text-xs text-gold font-medium px-2 py-1">
                  +{product.ingredients.length - 4} more
                </span>
              )}
            </div>

            {/* Link Button */}
            <div className="mt-6">
              <div className="w-full btn-primary block text-center">
                Select Size & View Details
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
