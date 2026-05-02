const CART_KEY = 'khapal_foods_cart';
const CART_SIG = 'khapal_foods_cart_sig';

// In a real-world scenario, this would be retrieved from a secure vault or environment variable.
// For demonstration purposes, we're using a placeholder.
// IMPORTANT: Never hardcode secrets in production code.
async function getSecret() {
  // Simulate fetching the secret from a secure source.
  // In a real application, use a library like 'node-vault' or the AWS Secrets Manager SDK.
  return 'this_is_a_very_long_and_complex_secret_key_for_hmac_v2';
}

/**
 * Sanitizes a string to prevent basic XSS attacks.  More comprehensive
 * sanitization or context-aware escaping is highly recommended.
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // This is a basic example and might not cover all XSS attack vectors.
  return str.replace(/[<>"'/]/g, function (match) {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      case '/': return '&#x2F;';
      default: return match;
    }
  });
}

/**
 * Generates an HMAC-SHA256 signature for the cart data.
 */
async function generateSignature(cart, secret) {
  const crypto = await import('crypto'); // Import crypto dynamically
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(cart));
  return hmac.digest('hex');
}

/**
 * Validates the schema and types of the cart data, sanitizing inputs.
 */
function validateCartSchema(cart) {
  if (!Array.isArray(cart)) return [];

  return cart.map(item => {
    const safeId = typeof item.id === 'string' || typeof item.id === 'number' ? String(item.id) : '';
    return {
      id: safeId,
      name: sanitizeInput(String(item.name || '')), // Sanitize name
      price: 0, // Do not use client-provided price. Price MUST be fetched server-side.
      quantity: Math.max(0, parseInt(item.quantity) || 0),
      image: sanitizeInput(String(item.image || '')), // Sanitize image URL
    };
  });
}

export async function getCart() {
  try {
    const rawCart = localStorage.getItem(CART_KEY);
    const signature = localStorage.getItem(CART_SIG);

    if (!rawCart || !signature) return [];

    const parsedCart = JSON.parse(rawCart);
    const secret = await getSecret();
    const expectedSignature = await generateSignature(parsedCart, secret);

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

export async function saveCart(cart) {
  const validatedCart = validateCartSchema(cart);
  const serializedCart = JSON.stringify(validatedCart);
  const secret = await getSecret();
  const signature = await generateSignature(validatedCart, secret);

  localStorage.setItem(CART_KEY, serializedCart);
  localStorage.setItem(CART_SIG, signature);
}

export async function addToCart(product) {
  if (!product || !product.id) return getCart();

  const cart = await getCart();
  const productId = String(product.id);
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: sanitizeInput(product.name),
      price: 0, // IMPORTANT:  Always fetch the price from the server using the product ID.
      quantity: 1,
      image: sanitizeInput(product.image),
    });
  }

  await saveCart(cart);
  return await getCart();
}


export async function removeFromCart(productId) {
  const idToMatch = String(productId);
  const cart = await getCart();
  const filteredCart = cart.filter((item) => item.id !== idToMatch);
  await saveCart(filteredCart);
  return filteredCart;
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

  return await getCart();
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