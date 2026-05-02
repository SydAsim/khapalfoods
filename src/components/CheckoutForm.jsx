import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { createOrder, submitOrder } from '../utils/orders';

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  // useRef to hold sensitive data temporarily
  const orderDetails = useRef(null);

  useEffect(() => {
    // Fetch CSRF token from the server
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('CSRF Token Error:', error);
        setGlobalError('Failed to load security token. Please refresh the page.');
        // Consider a more user-friendly fallback if token cannot be fetched.
        // E.g., disable the submit button and show an informative message.
      }
    };

    fetchCsrfToken();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'Please enter your complete delivery address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (globalError) setGlobalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setGlobalError('');

    try {
      const order = createOrder(formData, cart);
      orderDetails.current = order; // Store sensitive order details in useRef

      // Ensure the order is submitted with CSRF protection and proper CORS configuration
      // The 'credentials: "include"' option is required to send cookies with the request.
      const result = await submitOrder(order, csrfToken);

      if (result && result.success) {
        // Clear sensitive data from memory
        orderDetails.current = null;
        // Clear sensitive data from form state
        setFormData({ name: '', phone: '', email: '', address: '' });

        clearCart();
        // Pass only the non-sensitive order ID via navigation state if needed for the success page
        navigate('/success', { state: { orderId: result.orderId }, replace: true });
      } else {
        throw new Error(result?.message || 'Server failed to process the order.');
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      // Fail-secure: Do not clear cart or redirect to success page on error.
      // Inform the user that the submission failed so they can retry.
      setGlobalError('We encountered an issue processing your order. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl font-bold text-rich-brown mb-4">
          Your cart is empty
        </h2>
        <p className="mb-8" style={{ color: 'rgba(92,61,46,0.6)' }}>
          Add some products before checking out.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  const inputBase =
    'w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white focus:outline-none focus:ring-0';

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="checkout-form">
      {/* Anti-CSRF Token */}
      {csrfToken && <input type="hidden" name="_csrf" value={csrfToken} />}
      {!csrfToken && globalError && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
          >
            {globalError}
          </motion.div>
        )}
      {globalError && !csrfToken && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
        >
          {globalError}
        </motion.div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-rich-brown mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={`${inputBase} ${
            errors.name ? 'border-red-400 focus:border-red-500' : 'border-beige focus:border-gold'
          }`}
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs mt-1"
          >
            {errors.name}
          </motion.p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-rich-brown mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g., 0300-1234567"
          className={`${inputBase} ${
            errors.phone ? 'border-red-400 focus:border-red-500' : 'border-beige focus:border-gold'
          }`}
        />
        {errors.phone && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs mt-1"
          >
            {errors.phone}
          </motion.p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-rich-brown mb-2">
          Email <span style={{ color: 'rgba(92,61,46,0.4)' }}>(optional)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={`${inputBase} ${
            errors.email ? 'border-red-400 focus:border-red-500' : 'border-beige focus:border-gold'
          }`}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs mt-1"
          >
            {errors.email}
          </motion.p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-rich-brown mb-2">
          Delivery Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          autoComplete="street-address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          placeholder="Enter your complete delivery address including city"
          className={`${inputBase} resize-none ${
            errors.address ? 'border-red-400 focus:border-red-500' : 'border-beige focus:border-gold'
          }`}
        />
        {errors.address && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs mt-1"
          >
            {errors.address}
          </motion.p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        type="submit"
        disabled={isSubmitting || !csrfToken}
        className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
          (isSubmitting || !csrfToken)
            ? 'bg-warm-brown/40 text-white cursor-not-allowed'
            : 'btn-primary'
        }`}
        id="place-order-button"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Placing Order...
          </span>
        ) : (
          `Place Order — ₨${cartTotal.toLocaleString()}`
        )}
      </motion.button>
    </form>
  );
}