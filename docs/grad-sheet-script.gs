// ============================================================
// GRAD SEASON — Google Apps Script Web App v2
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
  "Comic","Comic Style",
  "Storybook","Storybook Style",
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
      data.wantsStorybook ? "YES" : "NO",
      data.storybookStyle || "",
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
      status: "Grad Season is live",
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
    header.setBackground("#0B0F1A");
    header.setFontColor("#F59E0B");
    header.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ── Confirmation email ─────────────────────────────────────
function sendConfirmationEmail(data, orderId) {
  if (!data.email) return;

  const products = [];
  if (data.wantsFigurine)  products.push("Figurine — " + (data.figurineStyle || ""));
  if (data.wantsComic)     products.push("Comic — "    + (data.comicStyle    || ""));
  if (data.wantsStorybook) products.push("Storybook — "+ (data.storybookStyle|| ""));

  const gradName   = data.gradName   || "your graduate";
  const parentName = data.parentName || "there";
  const total      = data.orderTotal || "0";

  const subject  = "Order Confirmed: " + gradName + " — " + orderId;

  const htmlBody = "<div style='font-family:Arial,sans-serif;max-width:540px;margin:0 auto;'>"
    + "<div style='background:#0C0A14;color:#F0B429;padding:24px;text-align:center;border-radius:12px 12px 0 0;'>"
    + "<h1 style='margin:0;font-size:22px;'>Order Confirmed</h1>"
    + "<p style='margin:6px 0 0;color:#8B82B0;font-size:13px;'>Order ID: " + orderId + "</p>"
    + "</div>"
    + "<div style='background:#15112B;color:#EDE8FF;padding:24px;border-radius:0 0 12px 12px;'>"
    + "<p>Hey " + parentName + ", we got " + gradName + "'s order locked in.</p>"
    + "<p style='color:#8B82B0;font-size:13px;'>What you ordered:</p>"
    + products.map(function(p){ return "<p style='margin:4px 0;'>✓ " + p + "</p>"; }).join("")
    + "<p style='margin-top:16px;'><strong style='color:#F0B429;'>Total: $" + total + "</strong></p>"
    + "<hr style='border:1px solid #2E2855;margin:16px 0;'/>"
    + "<p style='color:#8B82B0;font-size:13px;line-height:1.7;'>"
    + "Nothing is due today. Payment collected at fulfillment.<br>"
    + "You'll get updates at every stage — In Progress, Printing, and Shipped.<br><br>"
    + "Questions? Reply to this email."
    + "</p>"
    + "</div></div>";

  MailApp.sendEmail({ to: data.email, subject: subject, htmlBody: htmlBody });
}

// ── Mark confirmation sent ─────────────────────────────────
function markConfirmationSent(sheet, orderId) {
  const data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) {
      sheet.getRange(i + 1, 27).setValue("YES");
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
      var parentName = data[i][col("Parent Name")];
      var gradName   = data[i][col("Grad Name")];
      var subject    = "Update on " + gradName + "'s order: " + newStatus + " — " + orderId;
      var body       = "<p>Hey " + parentName + ",</p><p>" + gradName + "'s order status is now: <strong>" + newStatus + "</strong></p>";
      MailApp.sendEmail({ to: email, subject: subject, htmlBody: body });
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
    "YES", fakeData.comicStyle,
    "YES", fakeData.storybookStyle,
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
