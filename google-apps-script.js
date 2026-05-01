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
 * 6. UPDATE the 'AUTH_TOKEN' constant below with a long, random string.
 * 7. UPDATE the 'PRODUCT_CATALOG' with your actual items and prices.
 * 8. Click Save, then Deploy → New deployment (Web app, Execute as: Me, Who has access: Anyone).
 * 9. In your frontend (src/utils/orders.js), ensure you send the 'authToken' in the POST body.
 */

// SECURITY: Use a strong secret token to authenticate requests
const AUTH_TOKEN = 'REPLACE_WITH_SECURE_UUID_OR_KEY';

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

    // VULNERABILITY FIX [Line 34 & 26]: Authenticate the request
    if (!data.authToken || data.authToken !== AUTH_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    let calculatedTotal = 0;
    const items = data.items || [];

    // VULNERABILITY FIX [Line 54]: Server-side price calculation and validation
    const itemsSummary = items.map(function(item) {
      const sanitizedName = sanitize(item.name);
      const unitPrice = PRODUCT_CATALOG[item.name] || 0;
      const quantity = Math.max(0, parseInt(item.quantity) || 0);
      const lineTotal = unitPrice * quantity;
      
      calculatedTotal += lineTotal;
      
      return sanitizedName + ' x' + quantity + ' (₨' + lineTotal + ')';
    }).join(' | ');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // VULNERABILITY FIX [Line 48]: Sanitize all user-provided strings before insertion
    sheet.appendRow([
      new Date(),                          // A: Date & Time
      sanitize(data.orderId || ''),        // B: Order ID
      sanitize(data.name || ''),           // C: Customer Name
      sanitize(data.phone || ''),          // D: Phone Number
      sanitize(data.email || ''),          // E: Email
      sanitize(data.address || ''),        // F: Delivery Address
      itemsSummary,                        // G: Items (recalculated summary)
      calculatedTotal,                     // H: Total Amount (validated)
      'Pending'                            // I: Order Status
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // VULNERABILITY FIX [Line 64]: Return generic error to client, log details internally
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
  return ContentService
    .createTextOutput('Khapal Foods Order API is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}