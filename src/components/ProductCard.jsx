import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, index }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = cart.find((item) => item.id === product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group"
    >
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
              <h3 className="font-display text-2xl font-bold text-rich-brown">
                {product.name}
              </h3>
              <p className="text-sm mt-1" style={{ color: 'rgba(92,61,46,0.6)' }}>
                {product.subtitle}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-display text-2xl font-bold text-gold">
                ₨{product.price.toLocaleString()}
              </div>
              <span className="text-xs" style={{ color: 'rgba(92,61,46,0.5)' }}>per box</span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(92,61,46,0.7)' }}>
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

          {/* Cart Controls */}
          <div className="mt-6">
            {cartItem ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-cream rounded-full px-2 py-1">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() =>
                      cartItem.quantity === 1
                        ? removeFromCart(product.id)
                        : updateQuantity(product.id, cartItem.quantity - 1)
                    }
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-warm-brown hover:bg-beige transition-colors font-medium"
                    id={`decrease-${product.id}`}
                  >
                    −
                  </motion.button>
                  <span className="w-8 text-center font-semibold text-rich-brown">
                    {cartItem.quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gold text-white shadow-sm flex items-center justify-center hover:bg-gold-dark transition-colors font-medium"
                    id={`increase-${product.id}`}
                  >
                    +
                  </motion.button>
                </div>
                <span className="text-sm font-semibold text-gold">
                  ₨{(product.price * cartItem.quantity).toLocaleString()}
                </span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product)}
                className="w-full btn-primary"
                id={`add-to-cart-${product.id}`}
              >
                Add to Cart — ₨{product.price.toLocaleString()}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
