/**
 * Google Apps Script — Khapal Foods Order Handler (Secured Version)
 * 
 * HOW TO SET UP:
 * 
 * 1. Go to https://sheets.google.com and create a new spreadsheet.
 * 2. Name it "Khapal Foods Orders".
 * 3. In Row 1, add these column headers:
 *    A: Date | B: Order ID | C: Name | D: Phone | E: Email
 *    F: Address | G: Items | H: Total Amount | I: Status
 * 
 * 4. Go to Extensions → Apps Script.
 * 5. Paste this code.
 * 6. UPDATE the 'AUTH_TOKEN' constant below using PropertiesService to store securely.
 * 7. UPDATE the 'PRODUCT_CATALOG' with your actual items and prices.
 * 8. Click Save, then Deploy → New deployment (Web app, Execute as: Me, Who has access: Anyone).
 * 9. In your frontend (src/utils/orders.js), ensure you send the 'authToken' in the POST body.
 */

// SECURITY:  Use PropertiesService to store the auth token securely.
// Initialize the token if it doesn't exist.  This only happens on first run or if the property is deleted.
function initializeAuthToken() {
  const scriptProperties = PropertiesService.getScriptProperties();
  let authToken = scriptProperties.getProperty('AUTH_TOKEN');

  if (!authToken) {
    authToken = Utilities.getUuid(); // Generate a UUID.  Consider a more robust random key generator.
    scriptProperties.setProperty('AUTH_TOKEN', authToken);
  }
}

// SECURITY: Trusted server-side source of truth for pricing to prevent client-side manipulation
const PRODUCT_CATALOG = {
  "Example Burger": 550,
  "Example Fries": 200,
  "Example Drink": 150
};

/**
 * Sanitizes input to prevent Spreadsheet Injection (CSV Injection).
 * Prepend a single quote if the string starts with formula-triggering characters.
 */
function sanitize(value) {
  if (typeof value !== 'string') return value;
  const formulaTriggers = ['=', '+', '-', '@', '\t', '\r'];
  if (formulaTriggers.some(char => value.indexOf(char) === 0)) {
    return "'" + value;
  }
  return value;
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('Invalid request');
    }

    const data = JSON.parse(e.postData.contents);

    // SECURITY: Authenticate the request using the stored AUTH_TOKEN
    const scriptProperties = PropertiesService.getScriptProperties();
    const authToken = scriptProperties.getProperty('AUTH_TOKEN');

    if (!data.authToken || data.authToken !== authToken) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    let calculatedTotal = 0;
    const items = data.items || [];

    // SECURITY: Server-side price calculation and validation
    const itemsSummary = items.map(function(item) {
      const sanitizedName = sanitize(item.name);
      const unitPrice = PRODUCT_CATALOG[item.name] || 0;
      const quantity = Math.max(0, parseInt(item.quantity) || 0);
      const lineTotal = unitPrice * quantity;
      
      calculatedTotal += lineTotal;
      
      return sanitizedName + ' x' + quantity + ' (₨' + lineTotal + ')';
    }).join(' | ');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // SECURITY: Sanitize all user-provided strings before insertion
    // Consider using parameterized queries if writing to a database instead of a spreadsheet.
    const orderId = sanitize(data.orderId || '');
    const name = sanitize(data.name || '');
    const phone = sanitize(data.phone || '');
    const email = sanitize(data.email || '');
    const address = sanitize(data.address || '');


    sheet.appendRow([
      new Date(),                          // A: Date & Time
      orderId,        // B: Order ID
      name,           // C: Customer Name
      phone,          // D: Phone Number
      email,          // E: Email
      address,        // F: Delivery Address
      itemsSummary,                        // G: Items (recalculated summary)
      calculatedTotal,                     // H: Total Amount (validated)
      'Pending'                            // I: Order Status
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // SECURITY: Return generic error to client, log details internally
    console.error('Order Error:', error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: 'An internal error occurred while processing the order.' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Initialize the AUTH_TOKEN if it hasn't been already.  This is only needed for the first execution.
  initializeAuthToken();
  return ContentService
    .createTextOutput('Khapal Foods Order API is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}