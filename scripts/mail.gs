// ============================================================
//  GDG VIT Bhimavaram — Registration Mail System
//  Author  : Apps Script Automation
//  Purpose : Send styled registration confirmation emails
//            and log all activity to Google Sheets
// ============================================================

// ── CONFIG ──────────────────────────────────────────────────
const SHEET_ID = "1mnz0OL4Qbr3OyMJh3k29oPpmvimIfvHukgM4LKlg9Lk";
const SHEET_NAME = "Registration Logs"; // tab name (created if missing)
const WHATSAPP_LINK = "https://chat.whatsapp.com/YOUR_INVITE_LINK_HERE"; // ← replace
const SENDER_NAME = "GDG VIT Bhimavaram";
// ────────────────────────────────────────────────────────────

/**
 * Handles GET requests (for CORS preflight OPTIONS)
 */
function doGet(e) {
  return createCORSResponse({ status: "API is running" });
}

/**
 * Handles POST requests to send registration emails
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Call your existing function
    sendRegistrationMail(data.mail, data.name, data.event_name, data.date);

    // Return a CORS-friendly JSON response
    return createCORSResponse({ status: "success" });
  } catch (error) {
    return createCORSResponse({
      status: "error",
      message: error.toString(),
    });
  }
}

/**
 * Creates a CORS-enabled JSON response
 */
function createCORSResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
/**
 * Sends a styled registration confirmation email and logs the event.
 *
 * @param {string} mail        - Recipient email address
 * @param {string} name        - Registrant's full name
 * @param {string} event_name  - Name of the event
 * @param {string} date        - Event date (e.g. "15 March 2026")
 */
function sendRegistrationMail(mail, name, event_name, date) {
  // ── 1. Build HTML email body ───────────────────────────────
  const html = buildEmailHTML(name, event_name, date);

  // ── 2. Send email ─────────────────────────────────────────
  GmailApp.sendEmail(
    mail,
    `✅ Registration Confirmed – ${event_name} | GDG VIT Bhimavaram`,
    `Hi ${name},\n\nYou are successfully registered for ${event_name} on ${date}.\n\nRegards,\nGDG VIT Bhimavaram`,
    {
      htmlBody: html,
      name: SENDER_NAME,
      replyTo: Session.getActiveUser().getEmail(),
    },
  );

  // ── 3. Log to Google Sheets ───────────────────────────────
  logToSheet(mail, name, event_name, date);

  Logger.log(`✅ Mail sent to ${mail} | Event: ${event_name} | Date: ${date}`);
}

// ── EMAIL HTML BUILDER ───────────────────────────────────────
// ── EMAIL HTML BUILDER ───────────────────────────────────────
function buildEmailHTML(name, event_name, date) {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Registration Confirmed - GDG VITB</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #faf9f6; }

        @media screen and (max-width: 600px) {
            .wrapper { width: 100% !important; }
            .content-padding { padding: 30px 20px 30px 20px !important; }
            .sidebar-hide { display: none !important; }
            .header-main { font-size: 26px !important; }
            .header-sub { font-size: 30px !important; line-height: 1.2 !important; }
            .body-text { font-size: 16px !important; line-height: 1.6 !important; }
            .whatsapp-btn { width: 100% !important; display: block !important; text-align: center !important; box-sizing: border-box; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #faf9f6; font-family: 'Arial', sans-serif;">
    <center>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper" style="max-width: 600px;">
                        
                        <tr>
                            <td align="left" style="padding: 10px 15px 25px 15px;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="45" style="vertical-align: middle;">
                                            <img src="https://res.cloudinary.com/dlupkibvq/image/upload/v1772770486/tclybmavbwbjen3tnuzg.png" width="38" alt="GDG Logo" style="display: block;border-radius: 50%;" >
                                        </td>
                                        <td style="padding-left: 12px;">
                                            <div style="font-size: 18px; font-weight: 700; color: #202124; line-height: 1.2;">Google Developer Group</div>
                                            <div style="font-size: 13px; color: #5f6368;">Vishnu Institute of Technology</div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #e2dfd7; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="55" class="sidebar-hide" style="vertical-align: top; padding-top: 35px; border-right: 1px solid rgba(0,0,0,0.06);">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr><td align="center" style="padding: 7px 0;"><div style="width: 12px; height: 12px; border: 2px solid #999; border-radius: 50%;"></div></td></tr>
                                                <tr><td align="center" style="padding: 7px 0;"><div style="width: 12px; height: 12px; border: 2px solid #999; border-radius: 50%;"></div></td></tr>
                                                <tr><td align="center" style="padding: 7px 0;"><div style="width: 12px; height: 12px; border: 2px solid #999; border-radius: 50%;"></div></td></tr>
                                                <tr><td align="center" style="padding: 7px 0;"><div style="width: 12px; height: 12px; background-color: #d11210; border: 2px solid #d11210; border-radius: 50%;"></div></td></tr>
                                                <tr><td align="center" style="padding: 7px 0;"><div style="width: 12px; height: 12px; border: 2px solid #d11210; border-radius: 50%;"></div></td></tr>
                                                <tr><td align="center" style="padding: 7px 0;"><div style="width: 12px; height: 12px; background-color: #d11210; border: 2px solid #d11210; border-radius: 50%;"></div></td></tr>
                                            </table>
                                        </td>

                                        <td class="content-padding" style="padding: 50px 45px; vertical-align: top;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td class="header-main" style="color: #ec4c3b; font-size: 28px; font-weight: 700; padding-bottom: 5px;">You're Registered!</td>
                                                </tr>
                                                <tr>
                                                    <td class="header-sub" style="color: #202124; font-size: 36px; font-weight: 700; padding-bottom: 30px; line-height: 1.1;">Confirmation Details</td>
                                                </tr>
                                                <tr>
                                                    <td class="body-text" style="color: #3c4043; font-size: 18px; padding-bottom: 20px;">Hello <strong>${name}</strong>,</td>
                                                </tr>
                                                <tr>
                                                    <td class="body-text" style="color: #3c4043; font-size: 18px; line-height: 1.6; padding-bottom: 35px;">
                                                        We are thrilled to confirm your spot for <strong style="color: #202124;">${event_name}</strong>! Mark your calendar for <strong style="color: #202124;">${date}</strong>.
                                                        <br><br>
                                                        This is going to be an incredible experience. We can't wait to see you there!
                                                    </td>
                                                </tr>
                                                
                                                <tr>
                                                    <td align="left" style="padding-bottom: 40px;">
                                                        <table border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td align="center" bgcolor="#5CDB6D" style="border-radius: 6px;">
                                                                    <a href="${WHATSAPP_LINK}" target="_blank" class="whatsapp-btn" style="padding: 14px 28px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: 700; display: inline-block;">
                                                                        Join the WhatsApp Group
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="color: #5f6368; font-size: 17px; line-height: 1.5;">
                                                        Best Regards,<br>
                                                        <strong style="color: #202124;">GDG VITB Team</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #ec4c3b; font-size: 16px; font-weight: 700; padding-top: 45px; letter-spacing: 1.5px; text-transform: uppercase;">
                                                        Learn &bull; Build &bull; Connect
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top: 15px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #d11210; border-radius: 0 0 8px 8px;">
                                    <tr>
                                        <td align="center" style="padding: 25px;">
                                            <a href="https://gdgvitb.in" style="color: #ffffff; text-decoration: none; font-size: 15px;"> <strong>gdgvitb.in</strong></a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`;
}

// ── SHEET LOGGER ─────────────────────────────────────────────
function logToSheet(mail, name, event_name, date) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet + headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      "Timestamp",
      "Name",
      "Email",
      "Event Name",
      "Event Date",
      "Status",
    ];
    const headerRow = sheet.getRange(1, 1, 1, headers.length);
    headerRow.setValues([headers]);

    // Style the header row
    headerRow
      .setBackground("#1a73e8")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setFontSize(11);

    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, headers.length, 160);
  }

  // Append log row
  sheet.appendRow([
    new Date(), // Timestamp (auto-formatted by Sheets)
    name,
    mail,
    event_name,
    date,
    "Mail Sent ✅",
  ]);

  // Auto-resize for readability
  sheet.autoResizeColumns(1, 6);

  Logger.log(
    `📊 Logged to sheet: [${name}] [${mail}] [${event_name}] [${date}]`,
  );
}

// ── TEST FUNCTION ─────────────────────────────────────────────
/**
 * Run this function directly from the Apps Script editor to test.
 * Go to: Run → testSendMail
 */
function testSendMail() {
  sendRegistrationMail(
    "gurunadharao5718@gmail.com", // test recipient
    "Gurunadha Rao", // name
    "Google I/O Extended 2026", // event name
    "15 March 2026", // event date
  );

  Logger.log("🎉 Test complete! Check inbox and the sheet.");
}
