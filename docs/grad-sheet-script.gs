// ============================================================
// KEEPSAKES — Google Apps Script Web App v3
// Receives POST from intake form → writes row to Google Sheet
// Sends confirmation email → logs status
// ============================================================
// SETUP:
// 1. Open your Google Sheet → Extensions → Apps Script
// 2. Delete any existing code and paste this entire file
// 3. Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Copy the Web App URL → paste into order.html
// ============================================================

const SHEET_ID   = "1gzQx1SemSUKiZwUrGXqKXO-Rjp3FQh93tCeU1AAm-VM";
const SHEET_NAME = "Orders";

const COLUMNS = [
  "Timestamp","Order ID","Parent Name","Email","Phone",
  "Grad Name","Grade","School",
  "Figurine","Figurine Style","Figurine Fit","Career Choice","Photo URL",
  "Comic","Comic Style","Comic Photo URL",
  "Storybook","Storybook Style","Storybook Photo URL",
  "Fav Memory","Biggest Challenge","Proud Moment","Future Goal",
  "Personality Words","Fun Fact","Dedication Message",
  "Order Total","Status","Confirmation Sent","Last Updated"
];

// ── CORS preflight handler ─────────────────────────────────
function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── Handle POST from the intake form ──────────────────────
function doPost(e) {
  try {
    let data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    const sheet     = getOrCreateSheet();
    const orderId   = "GRAD-" + new Date().getFullYear() + "-" + generateId();
    const timestamp = new Date().toISOString();

    const row = [
      timestamp,
      orderId,
      data.parentName     || "",
      data.email          || "",
      data.phone          || "",
      data.gradName       || "",
      data.grade          || "",
      data.school         || "",
      data.wantsFigurine  ? "YES" : "NO",
      data.figurineStyle  || "",
      data.figurineFit    || "",
      data.careerChoice   || "",
      data.photoUrl       || "",
      data.wantsComic     ? "YES" : "NO",
      data.comicStyle     || "",
      data.comicPhotoUrl     || "",
      data.wantsStorybook ? "YES" : "NO",
      data.storybookStyle || "",
      data.storybookPhotoUrl || "",
      data.favMemory      || "",
      data.challenge      || "",
      data.proudMoment    || "",
      data.futureGoal     || "",
      data.personality    || "",
      data.funFact        || "",
      data.dedication     || "",
      "$" + (data.orderTotal || "0"),
      "Received",
      "NO",
      timestamp,
    ];

    sheet.appendRow(row);
    sendConfirmationEmail(data, orderId);
    markConfirmationSent(sheet, orderId);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderId: orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    logError(err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Health check GET ───────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "Keepsakes is live",
      time: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Sheet setup ────────────────────────────────────────────
function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    const header = sheet.getRange(1, 1, 1, COLUMNS.length);
    header.setBackground("#241B16");
    header.setFontColor("#F7F1E6");
    header.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ── Email shell (Keepsakes brand) ──────────────────────────
// Email clients ignore <style> and web fonts, so everything is inline with safe fallbacks.
// Palette mirrors /brand/BRAND.md: linen #F7F1E6, ink #241B16, ribbon #7A2433, muted #66574B.
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function keepsakesEmail(preheader, heading, innerHtml) {
  return "<!doctype html><html><body style='margin:0;padding:0;background:#F7F1E6;'>"
    + "<span style='display:none;max-height:0;overflow:hidden;opacity:0;'>" + escapeHtml(preheader) + "</span>"
    + "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#F7F1E6;'><tr><td align='center' style='padding:32px 16px;'>"
    + "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='max-width:560px;background:#FFFCF6;border:1px solid #DCCFBC;border-radius:16px;'>"
    + "<tr><td style='padding:28px 32px 0;font-family:Georgia,\"Times New Roman\",serif;font-size:22px;color:#241B16;'>"
    + "<span style='color:#7A2433;'>&#9673;</span>&nbsp;Keepsakes</td></tr>"
    + "<tr><td style='padding:20px 32px 0;font-family:Georgia,\"Times New Roman\",serif;font-size:28px;line-height:1.2;color:#241B16;'>" + heading + "</td></tr>"
    + "<tr><td style='padding:16px 32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#241B16;'>" + innerHtml + "</td></tr>"
    + "<tr><td style='padding:18px 32px;border-top:1px solid #DCCFBC;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#66574B;'>"
    + "Keepsakes · Columbus, Ohio · Made to be kept.<br>Questions? Just reply to this email.<br>A Collective AI venture.</td></tr>"
    + "</table></td></tr></table></body></html>";
}

// ── Confirmation email ─────────────────────────────────────
function sendConfirmationEmail(data, orderId) {
  if (!data.email) return;

  const products = [];
  if (data.wantsFigurine)  products.push("Figurine — " + (data.figurineStyle || ""));
  if (data.wantsComic)     products.push("Comic — "    + (data.comicStyle    || ""));
  if (data.wantsStorybook) products.push("Storybook — "+ (data.storybookStyle|| ""));

  const gradName   = escapeHtml(data.gradName   || "your graduate");
  const parentName = escapeHtml(data.parentName || "there");
  const total      = escapeHtml(data.orderTotal || "0");

  const subject  = "Order confirmed: " + (data.gradName || "your graduate") + "'s keepsakes — " + orderId;

  const inner = "<p style='margin:0 0 14px;'>Hi " + parentName + ", " + gradName + "'s order is in, and it's in good hands.</p>"
    + "<p style='margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8C5A14;font-weight:bold;'>Order " + escapeHtml(orderId) + "</p>"
    + "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='border-top:1px solid #DCCFBC;'>"
    + products.map(function (p) {
        return "<tr><td style='padding:10px 0;border-bottom:1px solid #DCCFBC;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#241B16;'>" + escapeHtml(p) + "</td></tr>";
      }).join("")
    + "<tr><td style='padding:12px 0;font-family:Georgia,serif;font-size:20px;color:#241B16;'>Total: $" + total + "</td></tr></table>"
    + "<p style='margin:16px 0 0;color:#66574B;'>Nothing is due today. Payment is collected at fulfillment.<br>"
    + "We'll email you at every stage: In Progress, Printing, and Shipped.</p>";

  const htmlBody = keepsakesEmail(gradName + "'s keepsakes are on the list.", "Order confirmed.", inner);
  MailApp.sendEmail({ to: data.email, subject: subject, htmlBody: htmlBody, name: "Keepsakes" });
}

// ── Mark confirmation sent ─────────────────────────────────
// Looks the column up by header name. The old hard-coded column 27 was "Order Total",
// so every confirmation overwrote the order total with "YES".
function markConfirmationSent(sheet, orderId) {
  const data = sheet.getDataRange().getValues();
  const confirmCol = data[0].indexOf("Confirmation Sent") + 1;
  if (confirmCol < 1) return;
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) {
      sheet.getRange(i + 1, confirmCol).setValue("YES");
      break;
    }
  }
}

// ── Progress email (call manually per order) ───────────────
function sendProgressEmail(orderId, newStatus) {
  const sheet   = getOrCreateSheet();
  const data    = sheet.getDataRange().getValues();
  const headers = data[0];
  const col     = function(name){ return headers.indexOf(name); };

  for (var i = 1; i < data.length; i++) {
    if (data[i][col("Order ID")] === orderId) {
      var email      = data[i][col("Email")];
      var parentName = escapeHtml(data[i][col("Parent Name")]);
      var gradName   = data[i][col("Grad Name")];
      var subject    = "Update on " + gradName + "'s keepsakes: " + newStatus + " — " + orderId;
      var inner      = "<p style='margin:0 0 14px;'>Hi " + parentName + ",</p>"
        + "<p style='margin:0 0 14px;'>" + escapeHtml(gradName) + "'s order is now <strong style='color:#7A2433;'>" + escapeHtml(newStatus) + "</strong>.</p>"
        + "<p style='margin:0;color:#66574B;'>Order " + escapeHtml(orderId) + "</p>";
      var body       = keepsakesEmail(gradName + "'s order: " + newStatus, escapeHtml(newStatus) + ".", inner);
      MailApp.sendEmail({ to: email, subject: subject, htmlBody: body, name: "Keepsakes" });
      sheet.getRange(i + 1, col("Status") + 1).setValue(newStatus);
      sheet.getRange(i + 1, col("Last Updated") + 1).setValue(new Date().toISOString());
      break;
    }
  }
}

// ── Error logger ───────────────────────────────────────────
function logError(message) {
  try {
    var ss       = SpreadsheetApp.openById(SHEET_ID);
    var logSheet = ss.getSheetByName("Log") || ss.insertSheet("Log");
    logSheet.appendRow([new Date().toISOString(), "ERROR", message]);
  } catch(e) {}
}

// ── Utility ────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ══════════════════════════════════════════════════════════
// TEST FUNCTION — Run this inside Apps Script to verify
// Extensions → Apps Script → select testSetup → Run
// ══════════════════════════════════════════════════════════
function testSetup() {
  var myEmail = Session.getActiveUser().getEmail();

  var fakeData = {
    parentName:    "JR Moyler",
    email:         myEmail,
    phone:         "614-555-0100",
    gradName:      "Marcus Johnson",
    grade:         "8th",
    school:        "Columbus East Middle",
    wantsFigurine: true,
    figurineStyle: "funko",
    figurineFit:   "grad",
    careerChoice:  "Engineer",
    wantsComic:    true,
    comicStyle:    "superhero",
    wantsStorybook: true,
    storybookStyle: "watercolor",
    favMemory:     "Science fair volcano exploded on the judge",
    challenge:     "Failed algebra, studied three nights straight, finished with B+",
    proudMoment:   "Read essay at Black History Month assembly in front of 400 people",
    futureGoal:    "Aerospace engineer — build the first manned spacecraft to Mars",
    personality:   "Curious, Stubborn, Hilarious",
    funFact:       "Names every NASA-discovered planet as a party trick",
    dedication:    "To our son — we are not ready for what you are about to become.",
    orderTotal:    167
  };

  var sheet   = getOrCreateSheet();
  var orderId = "GRAD-TEST-" + generateId();
  var ts      = new Date().toISOString();

  sheet.appendRow([
    ts, orderId,
    fakeData.parentName, fakeData.email, fakeData.phone,
    fakeData.gradName, fakeData.grade, fakeData.school,
    "YES", fakeData.figurineStyle, fakeData.figurineFit, fakeData.careerChoice, "",
    "YES", fakeData.comicStyle, "",
    "YES", fakeData.storybookStyle, "",
    fakeData.favMemory, fakeData.challenge, fakeData.proudMoment, fakeData.futureGoal,
    fakeData.personality, fakeData.funFact, fakeData.dedication,
    "$167", "Received", "NO", ts
  ]);

  sendConfirmationEmail(fakeData, orderId);
  markConfirmationSent(sheet, orderId);

  Logger.log("Row written: " + orderId);
  Logger.log("Email sent to: " + myEmail);
  Logger.log("Check your sheet and inbox.");
}
