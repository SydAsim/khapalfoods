import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { cart, cartTotal } = useCart();

  useEffect(() => {
    // Use a more specific type check for fbq
    const isFbqAvailable = typeof window !== 'undefined' && typeof window.fbq === 'function';

    if (isFbqAvailable && cart.length > 0) {
      try {
        window.fbq('track', 'InitiateCheckout', {
          value: Number(cartTotal) || 0,
          currency: 'PKR',
          num_items: Number(cart.length) || 0
        });
      } catch (error) {
        console.error("Failed to track InitiateCheckout:", error);
      }
    }
  }, [cartTotal, cart.length]);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm hover:text-gold transition-colors"
            style={{ color: 'rgba(92,61,46,0.6)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold text-rich-brown mb-10"
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-beige/30">
              <h2 className="font-display text-xl font-bold text-rich-brown mb-6">
                Delivery Information
              </h2>
              <CheckoutForm />
            </div>
          </motion.div>

          {/* Summary Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-beige/30 sticky top-24">
              <h2 className="font-display text-xl font-bold text-rich-brown mb-6">
                Order Summary
              </h2>

              {cart.length === 0 ? (
                <p className="text-sm" style={{ color: 'rgba(92,61,46,0.6)' }}>
                  No items in cart
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-beige-light flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-rich-brown truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs" style={{ color: 'rgba(92,61,46,0.6)' }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-rich-brown">
                          ₨{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-beige pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'rgba(92,61,46,0.6)' }}>Subtotal</span>
                      <span className="font-medium text-rich-brown">
                        ₨{cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'rgba(92,61,46,0.6)' }}>Delivery</span>
                      <span className="text-sage-green font-medium">Free</span>
                    </div>
                    <div className="border-t border-beige pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-rich-brown">Total</span>
                        <span className="font-display text-2xl font-bold text-rich-brown">
                          ₨{cartTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}