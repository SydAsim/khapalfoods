import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '../utils/products';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // Validate the product ID against the known product list
  const product = products.find((p) => p.id === id && products.some(validProduct => validProduct.id === id));

  const [selectedVariant, setSelectedVariant] = useState(
    product ? product.variants[0] : null
  );

  useEffect(() => {
    if (!product) {
      navigate('/');
    } else {
      window.scrollTo(0, 0);
    }
  }, [product, navigate]);

  if (!product) return null;

  const cartItemId = `${product.id}-${selectedVariant?.id}`;
  const cartItem = cart.find((item) => item.id === cartItemId);

  const handleAddToCart = () => {
    addToCart({
      id: cartItemId,
      name: `${product.name} (${selectedVariant.name})`,
      price: selectedVariant.price,
      image: product.image,
    });

    // Fire Meta Pixel AddToCart Event
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: `${product.name} (${selectedVariant.name})`,
        content_type: 'product',
        value: selectedVariant.price,
        currency: 'PKR'
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-warm-brown hover:text-gold transition-colors font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-beige/50 flex flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="md:w-1/2 relative bg-gradient-to-br from-beige-light to-cream">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover min-h-[300px] md:min-h-full"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badges.map((badge, i) => (
                <span
                  key={i}
                  className="bg-white/90 backdrop-blur-sm text-warm-brown text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h1 className="font-display text-3xl font-bold text-rich-brown">
                  {product.name}
                </h1>
                <div className="font-display text-2xl font-bold text-rich-brown">
                  ₨{selectedVariant?.price.toLocaleString()}
                </div>
              </div>
              <p className="text-sm text-warm-brown/80 font-medium mb-3">
                {product.subtitle}
              </p>

              <p className="text-sm leading-relaxed text-warm-brown/80 mb-5 line-clamp-2">
                {product.description}
              </p>

              {/* Variants Selector */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rich-brown uppercase tracking-wider mb-2">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-xl border font-medium text-sm transition-all duration-300 ${
                        selectedVariant?.id === variant.id
                          ? 'border-gold bg-gold/10 text-rich-brown shadow-sm'
                          : 'border-beige hover:border-gold/50 text-warm-brown hover:bg-beige-light'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-rich-brown uppercase tracking-wider mb-2">
                  Key Ingredients
                </h3>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                  {product.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-2 bg-cream/50 p-2 rounded-lg">
                      <span className="text-lg">{ing.emoji}</span>
                      <div className="truncate">
                        <div className="font-bold text-rich-brown text-xs truncate">{ing.name}</div>
                        <div className="text-[10px] text-warm-brown/80 truncate">{ing.benefit.split('—')[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add to Cart Area */}
              <div className="mt-auto pt-4 border-t border-beige/50">
                {cartItem ? (
                  <div className="flex items-center justify-between bg-cream p-2 rounded-xl border border-beige">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          cartItem.quantity === 1
                            ? removeFromCart(cartItemId)
                            : updateQuantity(cartItemId, cartItem.quantity - 1)
                        }
                        className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-warm-brown hover:text-gold transition-colors text-lg font-medium"
                      >
                        −
                      </motion.button>
                      <span className="w-6 text-center font-bold text-lg text-rich-brown">
                        {cartItem.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(cartItemId, cartItem.quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-gold text-white shadow-md flex items-center justify-center hover:bg-gold-dark transition-colors text-lg font-medium"
                      >
                        +
                      </motion.button>
                    </div>
                    <div className="pr-4 text-right">
                      <div className="text-[10px] text-warm-brown/70 font-medium uppercase tracking-wide">Subtotal</div>
                      <div className="text-lg font-bold text-rich-brown">
                        ₨{(selectedVariant.price * cartItem.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleAddToCart}
                    className="w-full btn-primary py-2.5 text-sm shadow-md shadow-gold/20"
                  >
                    Add to Cart — ₨{selectedVariant?.price.toLocaleString()}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}