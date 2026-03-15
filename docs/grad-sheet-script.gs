// ============================================================
// GRAD SEASON — Google Apps Script Web App
// Receives POST from intake form → writes row to Google Sheet
// Sends confirmation email → logs status
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Open Google Sheets → Extensions → Apps Script
// 2. Paste this entire file
// 3. Replace SHEET_ID below with your Google Sheet ID
// 4. Click Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the Web App URL → paste into your React form's submit handler
// ============================================================

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE"; // ← Replace this
const SHEET_NAME = "Orders";

// ── Column order (must match exactly) ──────────────────────
const COLUMNS = [
  "Timestamp",
  "Order ID",
  "Parent Name",
  "Email",
  "Phone",
  "Grad Name",
  "Grade",
  "School",
  "Figurine",
  "Figurine Style",
  "Figurine Fit",
  "Career Choice",
  "Photo URL",
  "Comic",
  "Comic Style",
  "Storybook",
  "Storybook Style",
  "Fav Memory",
  "Biggest Challenge",
  "Proud Moment",
  "Future Goal",
  "Personality Words",
  "Fun Fact",
  "Dedication Message",
  "Order Total",
  "Status",            // Agent reads + updates this column
  "Confirmation Sent", // Y/N
  "Last Updated",
];

// ── Handle POST from the intake form ───────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    // Generate unique order ID
    const orderId = "GRAD-" + new Date().getFullYear() + "-" + generateId();

    const timestamp = new Date().toISOString();

    const row = [
      timestamp,
      orderId,
      data.parentName || "",
      data.email || "",
      data.phone || "",
      data.gradName || "",
      data.grade || "",
      data.school || "",
      data.wantsFigurine ? "YES" : "NO",
      data.figurineStyle || "",
      data.figurineFit || "",
      data.careerChoice === "Other" ? data.careerOther : (data.careerChoice || ""),
      data.photoUrl || "",
      data.wantsComic ? "YES" : "NO",
      data.comicStyle || "",
      data.wantsStorybook ? "YES" : "NO",
      data.storybookStyle || "",
      data.favMemory || "",
      data.biggestChallenge || "",
      data.proudMoment || "",
      data.futureGoal || "",
      data.personalityWords || "",
      data.funFact || "",
      data.dedicationMessage || "",
      "$" + (data.orderTotal || "0"),
      "Received",       // Initial status
      "NO",             // Confirmation not yet sent
      timestamp,
    ];

    sheet.appendRow(row);

    // Send confirmation email immediately
    sendConfirmationEmail(data, orderId);

    // Mark confirmation sent — find the row we just added
    markConfirmationSent(sheet, orderId);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Handle GET (health check / sheet setup) ────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "Grad Season intake is live 🎓" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Sheet Setup ────────────────────────────────────────────
function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Write header row
    sheet.appendRow(COLUMNS);
    // Style header
    const header = sheet.getRange(1, 1, 1, COLUMNS.length);
    header.setBackground("#0B0F1A");
    header.setFontColor("#F59E0B");
    header.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// ── Confirmation Email ─────────────────────────────────────
function sendConfirmationEmail(data, orderId) {
  const products = [];
  if (data.wantsFigurine) products.push("🪆 Custom Figurine (" + data.figurineStyle + ")");
  if (data.wantsComic) products.push("⚡ Custom Comic (" + data.comicStyle + ")");
  if (data.wantsStorybook) products.push("📖 Custom Storybook (" + data.storybookStyle + ")");

  const subject = "🎓 " + data.gradName + "'s Grad Season Order Confirmed — " + orderId;

  const htmlBody = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0B0F1A; color: #F0F4FF; border-radius: 12px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1A2240, #131929); padding: 32px 32px 24px; text-align: center; border-bottom: 2px solid #F59E0B;">
        <div style="font-size: 48px; margin-bottom: 12px;">🎓</div>
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #F59E0B; letter-spacing: -0.5px;">Order Confirmed</h1>
        <p style="margin: 8px 0 0; color: #7A8BAD; font-size: 14px;">Order ID: <strong style="color: #F0F4FF;">${orderId}</strong></p>
      </div>

      <!-- Body -->
      <div style="padding: 28px 32px;">
        <p style="margin: 0 0 20px; font-size: 16px; color: #F0F4FF;">
          Hey ${data.parentName}, we got ${data.gradName}'s order locked in. 🙌
        </p>

        <!-- Products -->
        <div style="background: #131929; border: 1px solid #2A3555; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #F59E0B;">WHAT'S IN THE ORDER</p>
          ${products.map(p => `<p style="margin: 0 0 8px; font-size: 14px;">✓ ${p}</p>`).join("")}
          <div style="border-top: 1px solid #2A3555; margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between;">
            <span style="color: #7A8BAD; font-size: 13px;">Order Total</span>
            <strong style="color: #F59E0B; font-size: 16px;">$${data.orderTotal}</strong>
          </div>
        </div>

        <!-- What Happens Next -->
        <div style="background: #131929; border: 1px solid #2A3555; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #F59E0B;">WHAT HAPPENS NEXT</p>
          <div style="font-size: 13px; color: #7A8BAD; line-height: 1.9;">
            <p style="margin: 0;">📋 <strong style="color: #F0F4FF;">Received</strong> — We have your order (you're here)</p>
            <p style="margin: 0;">🎨 <strong style="color: #F0F4FF;">In Progress</strong> — We're generating ${data.gradName}'s content</p>
            <p style="margin: 0;">🖨️ <strong style="color: #F0F4FF;">Printing</strong> — Files sent to print</p>
            <p style="margin: 0;">📦 <strong style="color: #F0F4FF;">Shipped</strong> — On the way to you</p>
          </div>
        </div>

        <p style="font-size: 13px; color: #7A8BAD; line-height: 1.7; margin: 0;">
          You'll get an email at each stage. Payment is collected at fulfillment — nothing due right now.<br><br>
          Questions? Reply to this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #080C14; padding: 16px 32px; text-align: center; border-top: 1px solid #2A3555;">
        <p style="margin: 0; font-size: 12px; color: #7A8BAD;">
          Grad Season · Columbus, Ohio<br>
          <span style="color: #F59E0B;">Architecting a Humane Future</span>
        </p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody,
  });
}

// ── Mark confirmation sent in sheet ───────────────────────
function markConfirmationSent(sheet, orderId) {
  const data = sheet.getDataRange().getValues();
  const orderIdCol = COLUMNS.indexOf("Order ID"); // col 1
  const confirmCol = COLUMNS.indexOf("Confirmation Sent"); // col 26

  for (let i = 1; i < data.length; i++) {
    if (data[i][orderIdCol] === orderId) {
      sheet.getRange(i + 1, confirmCol + 1).setValue("YES");
      break;
    }
  }
}

// ── Progress Email (called manually or by trigger) ─────────
// Call this from an agent or manually when you update a status
function sendProgressEmail(orderId, newStatus) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const col = (name) => headers.indexOf(name);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[col("Order ID")] === orderId) {
      const email = row[col("Email")];
      const parentName = row[col("Parent Name")];
      const gradName = row[col("Grad Name")];

      sendStatusEmail(email, parentName, gradName, orderId, newStatus);

      // Update status + last updated
      sheet.getRange(i + 1, col("Status") + 1).setValue(newStatus);
      sheet.getRange(i + 1, col("Last Updated") + 1).setValue(new Date().toISOString());
      break;
    }
  }
}

function sendStatusEmail(email, parentName, gradName, orderId, status) {
  const statusMessages = {
    "In Progress": {
      emoji: "🎨",
      headline: "We're building " + gradName + "'s order",
      body: "Our team is actively generating the content for " + gradName + "'s keepsakes. This is where the magic happens — sit tight.",
    },
    "Printing": {
      emoji: "🖨️",
      headline: gradName + "'s order is at the printer",
      body: "Files are locked and sent to print. We'll let you know the moment everything ships.",
    },
    "Shipped": {
      emoji: "📦",
      headline: gradName + "'s order is on the way",
      body: "Everything is packed and on its way to you. Tracking info will follow shortly.",
    },
  };

  const msg = statusMessages[status] || { emoji: "📋", headline: "Order update", body: "Your order status has been updated to: " + status };

  const subject = msg.emoji + " " + msg.headline + " — " + orderId;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0B0F1A; color: #F0F4FF; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1A2240, #131929); padding: 28px 28px 20px; text-align: center; border-bottom: 2px solid #F59E0B;">
        <div style="font-size: 40px; margin-bottom: 10px;">${msg.emoji}</div>
        <h2 style="margin: 0; color: #F59E0B; font-size: 20px;">${msg.headline}</h2>
        <p style="margin: 6px 0 0; color: #7A8BAD; font-size: 13px;">Order ${orderId}</p>
      </div>
      <div style="padding: 24px 28px;">
        <p style="margin: 0 0 16px;">Hey ${parentName},</p>
        <p style="margin: 0 0 20px; color: #7A8BAD; line-height: 1.7;">${msg.body}</p>
        <div style="background: #131929; border: 1px solid #2A3555; border-radius: 8px; padding: 14px 18px; font-size: 13px;">
          <span style="color: #7A8BAD;">Current Status: </span>
          <strong style="color: #F59E0B;">${status}</strong>
        </div>
      </div>
      <div style="background: #080C14; padding: 14px 28px; text-align: center; border-top: 1px solid #2A3555;">
        <p style="margin: 0; font-size: 12px; color: #7A8BAD;">Grad Season · <span style="color: #F59E0B;">Architecting a Humane Future</span></p>
      </div>
    </div>
  `;

  MailApp.sendEmail({ to: email, subject, htmlBody });
}

// ── Utility ────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ── Scheduled trigger: check for un-confirmed orders ───────
// Set this as a time-based trigger (every 5 mins) as a safety net
function checkUnconfirmedOrders() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const col = (name) => headers.indexOf(name);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[col("Confirmation Sent")] === "NO" && row[col("Email")]) {
      // Resend confirmation for any missed rows
      const orderData = {
        parentName: row[col("Parent Name")],
        email: row[col("Email")],
        gradName: row[col("Grad Name")],
        wantsFigurine: row[col("Figurine")] === "YES",
        figurineStyle: row[col("Figurine Style")],
        wantsComic: row[col("Comic")] === "YES",
        comicStyle: row[col("Comic Style")],
        wantsStorybook: row[col("Storybook")] === "YES",
        storybookStyle: row[col("Storybook Style")],
        orderTotal: row[col("Order Total")].replace("$", ""),
      };
      const orderId = row[col("Order ID")];
      sendConfirmationEmail(orderData, orderId);
      sheet.getRange(i + 1, col("Confirmation Sent") + 1).setValue("YES");
    }
  }
}
