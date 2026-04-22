import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as cartUtils from '../utils/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => cartUtils.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product) => {
    const updatedCart = cartUtils.addToCart(product);
    setCart([...updatedCart]);
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId) => {
    const updatedCart = cartUtils.removeFromCart(productId);
    setCart([...updatedCart]);
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const updatedCart = cartUtils.updateQuantity(productId, quantity);
    setCart([...updatedCart]);
  }, []);

  const clearCart = useCallback(() => {
    const emptyCart = cartUtils.clearCart();
    setCart(emptyCart);
  }, []);

  // Memoize derived values so they don't recalculate on every render
  const cartTotal = useMemo(() => cartUtils.getCartTotal(cart), [cart]);
  const cartCount = useMemo(() => cartUtils.getCartCount(cart), [cart]);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      toggleCart,
      closeCart,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isCartOpen, toggleCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
