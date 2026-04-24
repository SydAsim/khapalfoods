// ⚠️ Primary Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweSYcd-q8lOWATR84rSJP1SJcEPoF-QUltE_JNMD3yNu3T080D14gVoYBhb_JgKGG5/exec';

// ⚠️ Backup Google Apps Script Web App URL (Paste your second script URL here)
const GOOGLE_SCRIPT_BACKUP_URL = '';

function getNextOrderNumber() {
  const last = parseInt(localStorage.getItem('kf_order_counter') || '0', 10);
  const next = last + 1;
  localStorage.setItem('kf_order_counter', next.toString());
  return next;
}

export function createOrder(formData, cart) {
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderNum = getNextOrderNumber();

  return {
    orderId: 'KF-' + String(orderNum).padStart(3, '0'),
    name: formData.name,
    phone: formData.phone,
    email: formData.email || '',
    address: formData.address,
    items: cart,
    totalAmount,
    orderDate: new Date().toISOString(),
  };
}

export async function submitOrder(order) {
  try {
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL') {
      console.warn(
        '⚠️ Google Script URL not configured. Order saved locally only.',
        order
      );
      return { success: true, offline: true };
    }

    const requests = [];

    // Send to primary sheet
    requests.push(
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(order),
      })
    );

    // Send to backup sheet if configured
    if (GOOGLE_SCRIPT_BACKUP_URL && GOOGLE_SCRIPT_BACKUP_URL.trim() !== '') {
      requests.push(
        fetch(GOOGLE_SCRIPT_BACKUP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(order),
        })
      );
    }

    // Wait for all requests to finish without failing if one of them fails
    await Promise.allSettled(requests);

    return { success: true };
  } catch (error) {
    console.error('Order submission error:', error);
    return { success: false, error: error.message };
  }
}
