import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-beige">
              <h2 className="font-display text-2xl font-bold text-rich-brown">
                Your Cart
                {cartCount > 0 && (
                  <span className="ml-2 text-sm font-body font-normal" style={{ color: 'rgba(92,61,46,0.6)' }}>
                    ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-warm-brown hover:text-rich-brown transition-colors rounded-full hover:bg-beige-light"
                aria-label="Close cart"
                id="close-cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="font-display text-xl font-bold text-rich-brown mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'rgba(92,61,46,0.6)' }}>
                    Add some delicious products to get started!
                  </p>
                  <button onClick={closeCart} className="btn-primary text-sm">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-beige/30"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-beige-light flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-rich-brown truncate">
                            {item.name}
                          </h4>
                          <p className="text-gold font-semibold text-sm mt-1">
                            ₨{item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  item.quantity === 1
                                    ? removeFromCart(item.id)
                                    : updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-warm-brown hover:bg-beige transition-colors text-sm"
                                id={`cart-decrease-${item.id}`}
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center hover:bg-gold-dark transition-colors text-sm"
                                id={`cart-increase-${item.id}`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="hover:text-red-500 transition-colors p-1"
                              style={{ color: 'rgba(92,61,46,0.4)' }}
                              aria-label={`Remove ${item.name}`}
                              id={`cart-remove-${item.id}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-beige px-6 py-5 bg-white/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-warm-brown font-medium">Subtotal</span>
                  <span className="font-display text-2xl font-bold text-rich-brown">
                    ₨{cartTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs mb-4" style={{ color: 'rgba(92,61,46,0.5)' }}>
                  Delivery is Free!
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full btn-primary text-center"
                  id="checkout-button"
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
