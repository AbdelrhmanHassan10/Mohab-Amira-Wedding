/**
 * RSVP receiver for the wedding site.
 *
 * Setup (once):
 *  1. Create a Google Sheet, then Extensions > Apps Script, and paste this whole file.
 *  2. Deploy > New deployment > type "Web app"
 *       Execute as: Me
 *       Who has access: Anyone
 *  3. Copy the Web app URL (ends with /exec) into the site's .env file:
 *       VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
 *
 * Each response becomes one row: Time | Name | Attending | Message
 */

const SHEET_NAME = 'RSVP';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    const p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      clean_(p.name, 100),
      p.attending === 'yes' ? 'Yes' : 'No',
      clean_(p.message, 1000),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Time', 'Name', 'Attending', 'Message']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Trim, cap length, and stop values being read as spreadsheet formulas
function clean_(value, maxLength) {
  const text = String(value || '').trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
