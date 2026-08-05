/**
 * ============================================================
 *  WEDDING RSVP — GOOGLE APPS SCRIPT BACKEND
 * ------------------------------------------------------------
 *  Paste this whole file into Extensions > Apps Script in your
 *  Google Sheet, then deploy it as a Web App (see README.md for
 *  the full step-by-step). It needs no configuration — it uses
 *  whichever Sheet it is bound to.
 *
 *  Endpoints (same URL, different verbs):
 *    POST  { action: "rsvp", name, attendance, guests, message }
 *          -> appends a row, returns { result: "success" }
 *    GET   ?action=wishes
 *          -> returns { wishes: [ {name, attendance, message}, ... ] }
 * ============================================================
 */

const SHEET_NAME = "RSVP";
const HEADERS = ["Timestamp", "Name", "Attendance", "Guests", "Message"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.action !== "rsvp") {
      return jsonResponse_({ result: "error", message: "Unknown action" });
    }

    const name = String(body.name || "").trim();
    const attendance = String(body.attendance || "Attending").trim();
    const guests = String(body.guests || "1").trim();
    const message = String(body.message || "").trim();

    if (!name) {
      return jsonResponse_({ result: "error", message: "Name is required" });
    }

    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, attendance, guests, message]);

    return jsonResponse_({ result: "success" });
  } catch (err) {
    return jsonResponse_({ result: "error", message: err.message });
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === "wishes") {
      const sheet = getSheet_();
      const rows = sheet.getDataRange().getValues();
      rows.shift(); // drop header row

      const wishes = rows
        .filter((r) => r[1]) // has a name
        .map((r) => ({
          name: r[1],
          attendance: r[2],
          guests: r[3],
          message: r[4],
        }));

      return jsonResponse_({ wishes: wishes });
    }

    return jsonResponse_({ result: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse_({ result: "error", message: err.message });
  }
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
