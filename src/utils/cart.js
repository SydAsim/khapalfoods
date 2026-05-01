const CART_KEY = 'khapal_foods_cart';
const CART_SIG = 'khapal_foods_cart_sig';
// Note: In a production environment, this secret should be an environment variable 
// and the signing process should ideally be more robust (e.g., HMAC-SHA256).
const INTEGRITY_SECRET = 'secure_cart_integrity_token_v1';

/**
 * Validates and sanitizes cart item data to prevent XSS and logic tampering.
 */
function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Generates a simple integrity signature for the cart data.
 */
function generateSignature(cart) {
  const dataStr = JSON.stringify(cart) + INTEGRITY_SECRET;
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    hash = ((hash << 5) - hash) + dataStr.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

/**
 * Validates the schema and types of the cart data.
 */
function validateCartSchema(cart) {
  if (!Array.isArray(cart)) return [];
  return cart.map(item => ({
    id: item.id ? String(item.id) : '',
    name: sanitizeInput(String(item.name || '')),
    price: typeof item.price === 'number' ? item.price : 0,
    quantity: Math.max(0, parseInt(item.quantity) || 0),
    image: sanitizeInput(String(item.image || '')),
  }));
}

export function getCart() {
  try {
    const rawCart = localStorage.getItem(CART_KEY);
    const signature = localStorage.getItem(CART_SIG);

    if (!rawCart || !signature) return [];

    const parsedCart = JSON.parse(rawCart);
    const expectedSignature = generateSignature(parsedCart);

    // Integrity check to prevent manual modification of price or other fields
    if (signature !== expectedSignature) {
      console.error('Security Warning: Cart integrity check failed. Clearing cart.');
      clearCart();
      return [];
    }

    return validateCartSchema(parsedCart);
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  const validatedCart = validateCartSchema(cart);
  const serializedCart = JSON.stringify(validatedCart);
  const signature = generateSignature(validatedCart);

  localStorage.setItem(CART_KEY, serializedCart);
  localStorage.setItem(CART_SIG, signature);
}

export function addToCart(product) {
  if (!product || !product.id) return getCart();

  const cart = getCart();
  const productId = String(product.id);
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price, // Display only: final price must be verified server-side
      quantity: 1,
      image: product.image,
    });
  }

  saveCart(cart);
  return getCart();
}

export function removeFromCart(productId) {
  const idToMatch = String(productId);
  const cart = getCart().filter((item) => item.id !== idToMatch);
  saveCart(cart);
  return cart;
}

export function updateQuantity(productId, quantity) {
  const safeQuantity = Math.max(0, parseInt(quantity) || 0);
  
  if (safeQuantity === 0) {
    return removeFromCart(productId);
  }

  const cart = getCart();
  const idToMatch = String(productId);
  const item = cart.find((i) => i.id === idToMatch);

  if (item) {
    item.quantity = safeQuantity;
    saveCart(cart);
  }

  return getCart();
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CART_SIG);
  return [];
}

export function getCartTotal(cart) {
  // Logic Fix: This total is for UI purposes only.
  // The backend must re-calculate the total based on DB prices using item IDs.
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
}

export function getCartCount(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}