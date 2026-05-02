import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Success Component
 * 
 * Securely handles the post-purchase display. 
 * Fixes:
 * 1. PII exposure: Switched from sessionStorage to React Router location state (ephemeral memory).
 * 2. Data validation: Implemented a strict sanitization schema to validate client-controlled data before rendering.
 */
export default function Success() {
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // We retrieve data from location state rather than sessionStorage. 
    // This ensures PII is not persisted in a storage medium accessible to all scripts (XSS).
    const rawOrder = location.state?.order;

    if (!rawOrder) {
      // If no order data exists in state, redirect to home to prevent direct access to PII-less success page
      navigate('/', { replace: true });
      return;
    }

    // Strict validation and sanitization of data from client-controlled sources
    const sanitizeAndValidate = (data) => {
      try {
        const orderId = String(data.orderId || '').replace(/[^\w-]/g, '').slice(0, 50);
        const name = String(data.name || '').replace(/[<>]/g, '').trim().slice(0, 100);
        const phone = String(data.phone || '').replace(/[^\d+-\s]/g, '').slice(0, 20);
        const totalAmount = parseFloat(data.totalAmount) || 0;
        const items = Array.isArray(data.items) ? data.items.map(item => {
          const itemId = String(item.id || '').slice(0, 50);
          const itemName = String(item.name || '').replace(/[<>]/g, '').trim().slice(0, 100);
          const quantity = Math.max(0, parseInt(item.quantity, 10) || 0);
          const price = Math.max(0, parseFloat(item.price) || 0);
          
          return {
            id: itemId,
            name: itemName,
            quantity: quantity,
            price: price
          };
        }) : [];

        // Validate the structure of the sanitized data
        if (!orderId || !name || !phone || totalAmount < 0 || !Array.isArray(items)) {
          console.error("Order data validation failed: Incomplete or invalid data");
          return null;
        }

        return {
          orderId: orderId,
          name: name,
          phone: phone,
          totalAmount: totalAmount,
          items: items
        };
      } catch (err) {
        console.error("Order validation failed", err);
        return null;
      }
    };

    const validatedOrder = sanitizeAndValidate(rawOrder);

    if (validatedOrder && validatedOrder.orderId) {
      setOrder(validatedOrder);
      
      // Fire Meta Pixel Purchase Event with validated data
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', {
          value: validatedOrder.totalAmount,
          currency: 'PKR'
        });
      }
    } else {
      navigate('/', { replace: true });
    }

    // Clean up: If the previous page used sessionStorage, we ensure it's cleared immediately
    sessionStorage.removeItem('lastOrder');
  }, [location.state, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
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

            {order.items && order.items.length > 0 && (
              <div className="border-t border-beige pt-3 mt-3">
                {order.items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex justify-between py-1">
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
                ₨{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

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