import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Success() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const lastOrder = sessionStorage.getItem('lastOrder');
    if (lastOrder) {
      const parsedOrder = JSON.parse(lastOrder);
      setOrder(parsedOrder);
      
      // Fire Meta Pixel Purchase Event
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: parsedOrder.totalAmount,
          currency: 'PKR'
        });
      }
      
      sessionStorage.removeItem('lastOrder');
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 bg-sage-green rounded-full flex items-center justify-center shadow-lg"
        >
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl md:text-4xl font-bold text-rich-brown mb-4"
        >
          Thank You! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg mb-8"
          style={{ color: 'rgba(92,61,46,0.7)' }}
        >
          Your order has been placed successfully.
          <br />
          We'll confirm it shortly via phone.
        </motion.p>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-card border border-beige/30 mb-8 text-left"
          >
            <h3 className="font-display text-lg font-bold text-rich-brown mb-4">
              Order Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'rgba(92,61,46,0.6)' }}>Order ID</span>
                <span className="font-mono font-semibold text-gold">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'rgba(92,61,46,0.6)' }}>Name</span>
                <span className="font-medium text-rich-brown">{order.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'rgba(92,61,46,0.6)' }}>Phone</span>
                <span className="font-medium text-rich-brown">{order.phone}</span>
              </div>

              {order.items && (
                <div className="border-t border-beige pt-3 mt-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-1">
                      <span style={{ color: 'rgba(92,61,46,0.7)' }}>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-rich-brown">
                        ₨{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-beige pt-3 mt-3 flex justify-between">
                <span className="font-semibold text-rich-brown">Total</span>
                <span className="font-display text-xl font-bold text-gold">
                  ₨{order.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              id="continue-shopping"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
