/**
 * Nhiejay & Lhyn — Wedding RSVP + Guest Wishes backend
 * -----------------------------------------------------
 * This turns a Google Sheet into the storage for both forms on the
 * website (#rsvp and #wishes). Submissions land as new rows in two
 * separate tabs: "RSVP Responses" and "Guest Wishes".
 *
 * SETUP (one-time, ~5 minutes):
 *
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *    Name it whatever you like, e.g. "Nhiejay & Lhyn Wedding".
 *
 * 2. In the sheet, go to Extensions > Apps Script.
 *
 * 3. Delete any starter code in the editor and paste in this entire file.
 *
 * 4. Click Deploy > New deployment.
 *      - Click the gear icon next to "Select type" and choose "Web app".
 *      - Description: anything, e.g. "Wedding form endpoint".
 *      - Execute as: Me.
 *      - Who has access: Anyone.
 *    Click Deploy, then authorize the script when prompted (it needs
 *    permission to edit this spreadsheet — that's expected and safe;
 *    it's your own script talking to your own sheet).
 *
 * 5. Copy the "Web app URL" you're given — it looks like:
 *      https://script.google.com/macros/s/XXXXXXXXXXXX/exec
 *
 * 6. In index.html, paste that URL into the data-endpoint attribute
 *    of BOTH <form id="rsvpForm" ...> and <form id="wishesForm" ...>
 *    (replace YOUR_FORM_ENDPOINT_HERE in each).
 *
 * 7. Reload the site and submit a test RSVP — a "RSVP Responses" tab
 *    (and a "Guest Wishes" tab once you test that form) will be
 *    created automatically in your spreadsheet with a header row.
 *
 * If you ever change a form's fields in index.html, add a matching
 * column name to the HEADERS arrays below so it gets saved too.
 */

const RSVP_SHEET_NAME = "RSVP Responses";
const RSVP_HEADERS = ["Timestamp", "Name", "Attending", "Guests", "Meal", "Contact", "Message"];

const WISH_SHEET_NAME = "Guest Wishes";
const WISH_HEADERS = ["Timestamp", "Name", "Message"];

function doPost(e) {
  try {
    const params = e.parameter;
    const formType = params.formType;

    if (formType === "rsvp") {
      appendRow_(RSVP_SHEET_NAME, RSVP_HEADERS, [
        new Date(),
        params.rsvpName || "",
        params.rsvpAttending || "",
        params.rsvpGuests || "",
        params.rsvpMeal || "",
        params.rsvpContact || "",
        params.rsvpMessage || ""
      ]);
    } else if (formType === "wish") {
      appendRow_(WISH_SHEET_NAME, WISH_HEADERS, [
        new Date(),
        params.guestName || "",
        params.guestMessage || ""
      ]);
    } else {
      return jsonResponse_({ ok: false, error: "Unknown formType" });
    }

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function appendRow_(sheetName, headers, row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  sheet.appendRow(row);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
