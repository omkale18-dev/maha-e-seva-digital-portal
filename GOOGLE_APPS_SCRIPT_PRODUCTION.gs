const ADMIN_TOKEN = "mseva_Q7xL92pA4vN8kR3sT6yB1cD5eF0hWz";

// Paste your Meta WhatsApp Access Token here (Temporary or Permanent) to keep it simple!
const WHATSAPP_PERMANENT_TOKEN = "YOUR_ACCESS_TOKEN_HERE";

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
];

var SERVICE_HEADERS = ["id", "titleEn", "titleMr", "descEn", "descMr", "icon", "accent", "price", "status"];

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function logDebug(message) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DebugLogs");
    if (!sheet) {
      sheet = ss.insertSheet("DebugLogs");
      sheet.appendRow(["Timestamp", "Message"]);
    }
    sheet.appendRow([new Date(), message]);
  } catch (err) {
    // ignore logging errors
  }
}

function requireAdminToken(token) {
  if (token !== ADMIN_TOKEN) {
    throw new Error("Unauthorized");
  }
}

function getSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function getApplicationsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Applications");
  if (sheet) return sheet;

  sheet = ss.getActiveSheet();
  if (sheet.getLastRow() > 0) {
    sheet.setName("Applications");
    return sheet;
  }

  sheet.setName("Applications");
  sheet.appendRow(["appId", "name", "phone", "service", "status", "paidAmount", "date"]);
  return sheet;
}

function getGallerySheet() {
  var sheet = getSheet("Gallery", ["url"]);
  if (sheet.getLastRow() === 1) {
    DEFAULT_GALLERY.forEach(function(url) {
      sheet.appendRow([url]);
    });
  }
  return sheet;
}

function getServicesSheet() {
  return getSheet("Services", SERVICE_HEADERS);
}

function getReviewsSheet() {
  return getSheet("Reviews", ["id", "name", "date", "text", "rating", "approved"]);
}

function getSettingsSheet() {
  return getSheet("Settings", ["key", "value"]);
}

function readSettings() {
  var sheet = getSettingsSheet();
  var rows = sheet.getDataRange().getValues();
  var result = {};
  for (var i = 1; i < rows.length; i++) {
    var key = rows[i][0];
    var val = rows[i][1];
    if (key) result[String(key)] = val;
  }
  return result;
}

function saveSettingsToSheet(settings) {
  var sheet = getSettingsSheet();
  var rows = sheet.getDataRange().getValues();
  var map = {};
  for (var i = 1; i < rows.length; i++) {
    var k = rows[i][0];
    if (k) map[String(k)] = i + 1; // row number
  }

  Object.keys(settings || {}).forEach(function(k) {
    var v = settings[k];
    if (map[k]) {
      sheet.getRange(map[k], 2).setValue(v);
    } else {
      sheet.appendRow([k, v]);
    }
  });

  return jsonResponse({ result: "success" });
}

function readApplications() {
  var sheet = getApplicationsSheet();
  var rows = sheet.getDataRange().getValues();
  var result = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    result.push({
      appId: row[0],
      name: row[1],
      phone: row[2],
      service: row[3],
      status: row[4],
      paidAmount: row[5],
      date: row[6],
      remainingAmount: row[8] !== undefined ? row[8] : 0
    });
  }

  return result;
}

function readGallery() {
  var sheet = getGallerySheet();
  var rows = sheet.getDataRange().getValues();
  var result = [];

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0]) result.push(rows[i][0]);
  }

  return result;
}

function readServices() {
  var sheet = getServicesSheet();
  var rows = sheet.getDataRange().getValues();
  var result = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[1] && !row[3] && !row[5]) continue;
    result.push({
      id: row[0] || "svc-" + i,
      titleEn: row[1] || "",
      titleMr: row[2] || "",
      descEn: row[3] || "",
      descMr: row[4] || "",
      icon: row[5] || "apps",
      accent: row[6] || "primary",
      price: row[7] || "",
      status: row[8] || "Active"
    });
  }

  return result;
}

function saveServices(services) {
  var sheet = getServicesSheet();
  sheet.clearContents();
  sheet.appendRow(SERVICE_HEADERS);

  (services || []).forEach(function(service, index) {
    sheet.appendRow([
      service.id || ("svc-" + Date.now() + "-" + index),
      service.titleEn || "",
      service.titleMr || "",
      service.descEn || "",
      service.descMr || "",
      service.icon || "apps",
      service.accent || "primary",
      service.price || "",
      service.status || "Active"
    ]);
  });

  return jsonResponse({ result: "success" });
}

function readReviews(approvedOnly) {
  var sheet = getReviewsSheet();
  var rows = sheet.getDataRange().getValues();
  var result = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var review = {
      id: row[0],
      name: row[1],
      date: row[2],
      text: row[3],
      rating: Number(row[4]) || 5,
      approved: row[5] === true || row[5] === "TRUE" || row[5] === "true"
    };
    if (!approvedOnly || review.approved) result.push(review);
  }

  return result;
}

function doGet(e) {
  try {
    // 1. Meta Webhook Handshake Verification
    if (e && e.parameter && e.parameter["hub.mode"] === "subscribe") {
      var verifyToken = "mseva_chatbot_secure_token"; // Custom verification token
      if (e.parameter["hub.verify_token"] === verifyToken) {
        return ContentService.createTextOutput(e.parameter["hub.challenge"]);
      }
      return ContentService.createTextOutput("Forbidden").setMimeType(ContentService.MimeType.TEXT);
    }

    var action = e && e.parameter && e.parameter.action ? e.parameter.action : "applications";

    if (action === "publicGallery") {
      return jsonResponse(readGallery());
    }

    if (action === "publicReviews") {
      return jsonResponse(readReviews(true));
    }

    if (action === "publicServices") {
      return jsonResponse(readServices());
    }

    if (action === "publicTrack") {
      var targetId = String(e.parameter.appId || "").trim().toLowerCase();
      var sheet = getApplicationsSheet();
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        var appId = String(rows[i][0]).trim().toLowerCase();
        if (appId === targetId) {
          var dateVal = rows[i][6];
          if (dateVal instanceof Date) {
            dateVal = Utilities.formatDate(dateVal, Session.getScriptTimeZone(), "dd/MM/yyyy");
          }
          return jsonResponse({
            result: "success",
            name: rows[i][1],
            service: rows[i][3],
            status: rows[i][4],
            date: dateVal,
            missingDocs: rows[i][7] || "सर्व कागदपत्रे पूर्ण आहेत."
          });
        }
      }
      return jsonResponse({ result: "error", message: "Application not found" });
    }

    requireAdminToken(e && e.parameter ? e.parameter.token : "");

    if (action === "applications") {
      return jsonResponse(readApplications());
    }

    if (action === "gallery") {
      return jsonResponse(readGallery());
    }

    if (action === "reviews") {
      return jsonResponse(readReviews(false));
    }

    if (action === "settings") {
      // protected: only admin token allowed
      return jsonResponse(readSettings());
    }

    return jsonResponse({ result: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ result: "error", message: err.message });
  }
}

function doPost(e) {
  try {
    var rawText = e.postData.contents;
    var data = JSON.parse(rawText);

    // 2. Handle WhatsApp Webhook Inbound Message (Bypass admin token check for Meta pings)
    if (data.object === "whatsapp_business_account" || (data.entry && data.entry[0] && data.entry[0].changes && data.entry[0].changes[0] && data.entry[0].changes[0].value && data.entry[0].changes[0].value.messages)) {
      return handleIncomingWhatsApp(data);
    }

    requireAdminToken(data.token);

    if (data.action === "edit") {
      return updateApplication(data);
    }

    if (data.action === "add" || !data.action) {
      return addApplication(data);
    }

    if (data.action === "addGalleryImage") {
      getGallerySheet().appendRow([data.url]);
      return jsonResponse({ result: "success" });
    }

    if (data.action === "deleteGalleryImage") {
      var gallerySheet = getGallerySheet();
      var rowNum = Number(data.index) + 2;
      if (rowNum >= 2 && rowNum <= gallerySheet.getLastRow()) {
        gallerySheet.deleteRow(rowNum);
      }
      return jsonResponse({ result: "success" });
    }

    if (data.action === "setReviewStatus") {
      var reviewSheet = getReviewsSheet();
      var reviewRows = reviewSheet.getDataRange().getValues();
      for (var i = 1; i < reviewRows.length; i++) {
        if (String(reviewRows[i][0]) === String(data.id)) {
          reviewSheet.getRange(i + 1, 6).setValue(Boolean(data.approved));
          return jsonResponse({ result: "success" });
        }
      }
      return jsonResponse({ result: "error", message: "Review not found" });
    }

    if (data.action === "deleteReview") {
      var deleteSheet = getReviewsSheet();
      var deleteRows = deleteSheet.getDataRange().getValues();
      for (var j = 1; j < deleteRows.length; j++) {
        if (String(deleteRows[j][0]) === String(data.id)) {
          deleteSheet.deleteRow(j + 1);
          return jsonResponse({ result: "success" });
        }
      }
      return jsonResponse({ result: "success" });
    }

    if (data.action === "saveReviews") {
      var saveSheet = getReviewsSheet();
      var existing = readReviews(false).map(function(review) {
        return String(review.name) + String(review.date);
      });

      (data.reviews || []).forEach(function(review) {
        var key = String(review.name) + String(review.date);
        if (existing.indexOf(key) === -1) {
          saveSheet.appendRow([
            review.id || Date.now(),
            review.name || "Anonymous",
            review.date || "Recently",
            review.text || "No written review.",
            review.rating || 5,
            review.approved === true
          ]);
          existing.push(key);
        }
      });

      return jsonResponse({ result: "success" });
    }

    if (data.action === "saveServices") {
      return saveServices(data.services || []);
    }

    if (data.action === "saveSettings") {
      return saveSettingsToSheet(data.settings || {});
    }

    return jsonResponse({ result: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ result: "error", message: err.message });
  }
}

function addApplication(data) {
  getApplicationsSheet().appendRow([
    data.appId,
    data.name,
    data.phone,
    data.service,
    data.status,
    data.paidAmount,
    data.date,
    "", // missingDocs placeholder at index 7 (Column H)
    data.remainingAmount || 0 // remainingAmount at index 8 (Column I)
  ]);

  return jsonResponse({ result: "success" });
}

function updateApplication(data) {
  var sheet = getApplicationsSheet();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === data.appId) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 2).setValue(data.name);
      sheet.getRange(rowNum, 3).setValue(data.phone);
      sheet.getRange(rowNum, 4).setValue(data.service);
      sheet.getRange(rowNum, 5).setValue(data.status);
      sheet.getRange(rowNum, 6).setValue(data.paidAmount);
      sheet.getRange(rowNum, 9).setValue(data.remainingAmount || 0); // remainingAmount is index 8, so column 9 (Column I)
      return jsonResponse({ result: "success" });
    }
  }

  return jsonResponse({ result: "error", message: "Application not found" });
}

// 3. Webhook Helpers for Two-Way Chatbot
function handleIncomingWhatsApp(data) {
  try {
    logDebug("Incoming WhatsApp payload: " + JSON.stringify(data));
    
    var entry = data.entry && data.entry[0];
    var change = entry && entry.changes && entry.changes[0];
    var value = change && change.value;
    var message = value && value.messages && value.messages[0];
    
    if (!message || message.type !== "text") {
      logDebug("Message type not text or empty");
      return jsonResponse({ result: "ignored" });
    }
    
    var citizenPhone = message.from;
    var incomingText = String(message.text.body || "").trim();
    var phoneId = value.metadata.phone_number_id;
    
    logDebug("Received message from: " + citizenPhone + " text: " + incomingText);
    
    var responseText = processChatbotMessage(incomingText);
    sendWhatsAppMessage(phoneId, citizenPhone, responseText);
    
    return jsonResponse({ result: "success" });
  } catch (err) {
    logDebug("handleIncomingWhatsApp Error: " + err.message);
    return jsonResponse({ result: "error", message: err.message });
  }
}


function processChatbotMessage(incomingText) {
  var sanitized = incomingText.trim().toLowerCase();
  
  // Check for greetings (English and Marathi)
  var greetings = ["hi", "hello", "hey", "hola", "hiii", "नमस्कार", "namaskar", "helloo", "hi there", "help", "options", "start"];
  
  // If it doesn't look like an App ID query (does not start with '#app-' or 'mseva_' or 'app-') or is in greeting list
  var isAppQuery = sanitized.indexOf("#app-") === 0 || sanitized.indexOf("mseva_") === 0 || sanitized.indexOf("app-") === 0 || sanitized.match(/^mseva/) || sanitized.match(/^app/);
  
  if (greetings.indexOf(sanitized) !== -1 || !isAppQuery) {
    return "*नमस्कार!* 🙏\n\n*महा ई-सेवा केंद्र, मोळ* च्या अधिकृत व्हॉट्सॲप असिस्टंटमध्ये आपले स्वागत आहे.\n\nतुमच्या अर्जाची किंवा प्रमाणपत्राची सद्यस्थिती जाणून घेण्यासाठी, कृपया तुमचा *ॲप आयडी* इथे पाठवा. (उदा. `#APP-1025` किंवा `mseva_1025`)\n\n*आम्ही तुम्हाला खालील सेवांमध्ये मदत करू शकतो:*\n👉 नवीन पॅन कार्ड, आधार अपडेट\n👉 उत्पन्न दाखला, जात प्रमाणपत्र, रहिवासी दाखला\n👉 ७/१२ उतारा आणि इतर ऑनलाईन शासकीय सेवा\n\nकोणती मदत हवी आहे? कृपया सांगा. 😊";
  }
  
  // Otherwise search database
  return searchStatus(incomingText);
}

function searchStatus(queryId) {
  var targetId = String(queryId).trim().toLowerCase();
  // Strip common prefix/spacing symbols to maximize matches
  var searchId = targetId.replace(/[^a-z0-9#-]/g, "");
  
  var sheet = getApplicationsSheet();
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    var appId = String(rows[i][0]).trim().toLowerCase();
    var cleanAppId = appId.replace(/[^a-z0-9#-]/g, "");
    
    if (cleanAppId === searchId || appId === targetId) {
      var name = rows[i][1];
      var service = rows[i][3];
      var status = rows[i][4];
      var date = rows[i][6];
      if (date instanceof Date) {
        date = Utilities.formatDate(date, Session.getScriptTimeZone(), "dd/MM/yyyy");
      }
      var missingDocs = rows[i][7] || "सर्व कागदपत्रे पूर्ण आहेत.";
      
      var emoji = "⏳";
      var statusMr = status;
      if (status === "Completed") {
        emoji = "✅";
        statusMr = "पूर्ण झाले आहे (Completed)";
      } else if (status === "Missing Docs") {
        emoji = "⚠️";
        statusMr = "कागदपत्रे अपूर्ण आहेत (Missing Docs)";
      } else if (status === "Processing") {
        emoji = "⚙️";
        statusMr = "प्रक्रियेत आहे (Processing)";
      }
      
      return "*नमस्कार " + name + ",*\n\nतुमच्या *" + service + "* (अर्ज क्रमांक: *" + rows[i][0] + "*) चा सद्यस्थिती अहवाल खालीलप्रमाणे आहे:\n\n" + emoji + " *सद्यस्थिती (Status):* " + statusMr + "\n📅 *नोंदणी तारीख (Date):* " + date + "\n📄 *अपूर्ण कागदपत्रे:* " + missingDocs + "\n\n— महा ई-सेवा केंद्र, मोळ.";
    }
  }
  
  return "*क्षमस्व!* आम्ही टाकलेला ॲप आयडी (*" + queryId + "*) शोधू शकलो नाही. कृपया अचूक अर्ज आयडी पुन्हा तपासा आणि पाठवा. (उदा. `#APP-1234`)\n\n— महा ई-सेवा केंद्र, मोळ.";
}

function sendWhatsAppMessage(phoneId, toPhone, text) {
  var token = WHATSAPP_PERMANENT_TOKEN;
  if (!token || token === "YOUR_ACCESS_TOKEN_HERE") {
    var settings = readSettings();
    token = settings["whatsapp_permanent_token"] || settings["kendra_whatsapp_token"];
  }
  
  if (!token || token === "YOUR_ACCESS_TOKEN_HERE") {
    logDebug("Error: Missing whatsapp token in settings and code");
    return;
  }
  
  var url = "https://graph.facebook.com/v17.0/" + phoneId + "/messages";
  var payload = {
    messaging_product: "whatsapp",
    to: toPhone,
    type: "text",
    text: { body: text }
  };
  
  var options = {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  logDebug("Sending payload to WhatsApp: " + JSON.stringify(payload));
  var response = UrlFetchApp.fetch(url, options);
  logDebug("WhatsApp API Response: " + response.getContentText());
}
