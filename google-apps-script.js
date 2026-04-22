/**
 * Google Apps Script — Khapal Foods Order Handler
 * 
 * HOW TO SET UP:
 * 
 * 1. Go to https://sheets.google.com and create a new spreadsheet
 * 2. Name it "Khapal Foods Orders"
 * 3. In Row 1, add these column headers:
 *    A: Date | B: Order ID | C: Name | D: Phone | E: Email
 *    F: Address | G: Items | H: Total Amount | I: Status
 * 
 * 4. Go to Extensions → Apps Script
 * 5. Delete any existing code and paste this entire file
 * 6. Click Save (💾)
 * 7. Click Deploy → New deployment
 * 8. Select type: "Web app"
 * 9. Set:
 *    - Description: "Khapal Foods Orders"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 10. Click Deploy
 * 11. Authorize the app when prompted
 * 12. Copy the Web App URL
 * 13. Paste the URL in your project: src/utils/orders.js → GOOGLE_SCRIPT_URL
 * 
 * DONE! Orders will now appear in your Google Sheet automatically.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Format items for readability in the sheet
    const itemsSummary = data.items
      .map(function(item) {
        return item.name + ' x' + item.quantity + ' (₨' + (item.price * item.quantity) + ')';
      })
      .join(' | ');

    sheet.appendRow([
      new Date(),                          // A: Date & Time
      data.orderId || '',                  // B: Order ID
      data.name || '',                     // C: Customer Name
      data.phone || '',                    // D: Phone Number
      data.email || '',                    // E: Email
      data.address || '',                  // F: Delivery Address
      itemsSummary,                        // G: Items (readable format)
      data.totalAmount || 0,               // H: Total Amount (PKR)
      'Pending'                            // I: Order Status
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput('Khapal Foods Order API is running ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}
