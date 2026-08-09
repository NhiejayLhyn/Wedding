/**
 * Niejhay & Lhyn — Wedding site backend
 * -----------------------------------------------------
 * This single Apps Script deployment powers two things on the website:
 *   1. The RSVP form (#rsvp) — saves each response as a new row in a
 *      "RSVP Responses" tab of a Google Sheet.
 *   2. The Snap & Share photo upload (#snapshare) — saves each guest
 *      photo into a Google Drive folder named "Wedding Guest Photos"
 *      (created automatically the first time someone uploads).
 *
 * SETUP (one-time, ~5 minutes):
 *
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *    Name it whatever you like, e.g. "Niejhay & Lhyn Wedding".
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
 *    Click Deploy, then authorize the script when prompted. It will ask
 *    for permission to edit this spreadsheet AND to manage files it
 *    creates in Drive — both expected and safe; it's your own script
 *    talking to your own Sheet/Drive.
 *
 * 5. Copy the "Web app URL" you're given — it looks like:
 *      https://script.google.com/macros/s/XXXXXXXXXXXX/exec
 *
 * 6. In index.html, paste that URL into the data-endpoint attribute of
 *    <form id="rsvpForm" ...>. The Snap & Share section (the
 *    .snapshare__box element's data-endpoint) will reuse the same URL
 *    automatically if you leave its own data-endpoint as the
 *    placeholder — you only need to set it separately if you want
 *    photos going to a different deployment than RSVPs.
 *
 * 7. Reload the site, submit a test RSVP, and upload a test photo via
 *    Snap & Share. A "RSVP Responses" sheet tab and a "Wedding Guest
 *    Photos" Drive folder will be created automatically the first time
 *    each is used.
 *
 * TROUBLESHOOTING "something went wrong" / nothing appears in the sheet/Drive:
 *
 *   a. Open your Web app URL directly in a browser tab. You should see
 *      "OK — this Apps Script deployment is live." If instead you see
 *      a Google sign-in prompt or an error, the deployment settings are
 *      wrong — redo step 4, double-checking "Execute as: Me" and
 *      "Who has access: Anyone".
 *   b. Make sure the endpoint URL has no extra spaces and ends in
 *      /exec (not /dev).
 *   c. If you edit this script AFTER already deploying once, the live
 *      URL keeps serving the OLD code until you redeploy: go to
 *      Deploy > Manage deployments > pencil/edit icon on your
 *      deployment > Version: "New version" > Deploy. (Do NOT create
 *      a brand-new deployment for an edit, or you'll get a second,
 *      different URL and have to update the site again.)
 *   d. The browser's console (site > right-click > Inspect > Console)
 *      may still show a red error even when the save actually worked —
 *      that's expected with Apps Script and is not itself a sign it
 *      failed. Check the sheet/Drive folder, not the console, to confirm.
 *   e. Large photos can take several seconds to upload on mobile data —
 *      that's normal; the site resizes photos before sending, but very
 *      slow connections may still need a moment.
 */

const RSVP_SHEET_NAME = "RSVP Responses";
const RSVP_HEADERS = ["Timestamp", "Name", "Attending", "Guests", "Contact", "Message"];

const PHOTOS_FOLDER_NAME = "Wedding Guest Photos";

// If you add/rename a field in the RSVP form in index.html, add a
// matching column name to RSVP_HEADERS above so it gets saved too.

/**
 * Lets you sanity-check the deployment by opening the Web app URL
 * directly in a browser tab. If it's working, you'll see "OK".
 * If instead you see a Google sign-in page or a 404, the deployment
 * itself is the problem — re-check step 4 in the setup notes above.
 */
function doGet(e) {
  return ContentService
    .createTextOutput("OK — this Apps Script deployment is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}

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
        params.rsvpContact || "",
        params.rsvpMessage || ""
      ]);
    } else if (formType === "photo") {
      savePhoto_(params.fileName, params.mimeType, params.fileData);
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

/** Decode a base64 photo sent from the site and save it into the shared Drive folder. */
function savePhoto_(fileName, mimeType, base64Data) {
  if (!base64Data) throw new Error("Missing photo data");
  const folder = getOrCreatePhotosFolder_();
  const bytes = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(bytes, mimeType || "image/jpeg", fileName || `guest-photo-${Date.now()}.jpg`);
  folder.createFile(blob);
}

function getOrCreatePhotosFolder_() {
  const existing = DriveApp.getFoldersByName(PHOTOS_FOLDER_NAME);
  if (existing.hasNext()) return existing.next();
  return DriveApp.createFolder(PHOTOS_FOLDER_NAME);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
