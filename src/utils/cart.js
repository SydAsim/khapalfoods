const CART_KEY = 'khapal_foods_cart';
const CART_SIG = 'khapal_foods_cart_sig';

// In a production environment, store the secret securely, e.g., in environment variables or a secure configuration.
// Ensure this value is unique and sufficiently random.  Consider using a library like 'crypto' to generate a cryptographically secure key.
let INTEGRITY_SECRET;

(async () => {
  if (typeof window === 'undefined') {
    // Server-side environment (e.g., Node.js)
    INTEGRITY_SECRET = process.env.CART_INTEGRITY_SECRET || 'fallback_insecure_secret_PLEASE_REPLACE'; // Use environment variable in production
  } else {
    // Browser environment - generate a random secret if one doesn't exist in localStorage
    INTEGRITY_SECRET = localStorage.getItem('cart_integrity_secret');
    if (!INTEGRITY_SECRET) {
      INTEGRITY_SECRET = generateRandomString(32); // 32 characters for reasonable security
      localStorage.setItem('cart_integrity_secret', INTEGRITY_SECRET);
    }
  }

  // Generate a random string for the secret (browser environment)
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
})();


/**
 * Validates and sanitizes cart item data to prevent XSS and logic tampering.
 * Consider using a more robust sanitization library like DOMPurify for complex scenarios.
 */
function sanitizeInput(value) {
  if (typeof value !== 'string') return value;

  const sanitized = value.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

    // Additional context-aware escaping or sanitization may be required here, 
    // depending on how the data is used in the UI.  For example, if the data
    // is used in attributes, attribute escaping might be necessary.

  return sanitized;
}


/**
 * Generates an HMAC-SHA256 signature for the cart data.
 */
async function generateSignature(cart) {
  if (typeof window !== 'undefined') {
      //Browser
      const dataStr = JSON.stringify(cart);
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(INTEGRITY_SECRET),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign", "verify"]
      );
      const signatureBuffer = await crypto.subtle.sign(
          "HMAC",
          key,
          encoder.encode(dataStr)
      );
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return signatureHex;
  } else {
      //Server
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', INTEGRITY_SECRET);
      hmac.update(JSON.stringify(cart));
      return hmac.digest('hex');
  }

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

async function getCart() {
  try {
    const rawCart = localStorage.getItem(CART_KEY);
    const signature = localStorage.getItem(CART_SIG);

    if (!rawCart || !signature) return [];

    const parsedCart = JSON.parse(rawCart);
    const expectedSignature = await generateSignature(parsedCart);

    // Integrity check using HMAC-SHA256
    if (signature !== expectedSignature) {
      console.error('Security Warning: Cart integrity check failed. Clearing cart.');
      clearCart();
      return [];
    }

    return validateCartSchema(parsedCart);
  } catch (error) {
    console.error("Error getting cart:", error);
    return [];
  }
}

async function saveCart(cart) {
  const validatedCart = validateCartSchema(cart);
  const serializedCart = JSON.stringify(validatedCart);
  const signature = await generateSignature(validatedCart);

  localStorage.setItem(CART_KEY, serializedCart);
  localStorage.setItem(CART_SIG, signature);
}

export async function addToCart(product) {
  if (!product || !product.id) return getCart();

  const cart = await getCart();
  const productId = String(product.id);
  const existing = cart.find((item) => item.id === productId);

  // The price must be validated on the server-side when the order is processed.
  // Here, we omit price from the cart data stored in localStorage. The UI should
  // request the current price from the server when displaying the cart contents.
  const safeProduct = {
    id: productId,
    name: product.name,
    quantity: 1,
    image: product.image,
  };

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(safeProduct);
  }

  await saveCart(cart);
  return getCart();
}


export async function removeFromCart(productId) {
  const idToMatch = String(productId);
  const cart = await getCart();
  const newCart = cart.filter((item) => item.id !== idToMatch);
  await saveCart(newCart);
  return newCart;
}

export async function updateQuantity(productId, quantity) {
  const safeQuantity = Math.max(0, parseInt(quantity) || 0);

  if (safeQuantity === 0) {
    return removeFromCart(productId);
  }

  const cart = await getCart();
  const idToMatch = String(productId);
  const item = cart.find((i) => i.id === idToMatch);

  if (item) {
    item.quantity = safeQuantity;
    await saveCart(cart);
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