import { createContext, useContext, useState, useCallback } from 'react';
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

  const cartTotal = cartUtils.getCartTotal(cart);
  const cartCount = cartUtils.getCartCount(cart);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
