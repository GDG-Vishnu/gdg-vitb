const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB limit

function doPost(e) {
  Logger.log("doPost triggered");

  try {
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log("Error: Missing request body");
      return jsonResponse({ error: "Missing request body" });
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
      Logger.log("Successfully parsed JSON payload. Action: " + payload.action);
    } catch (err) {
      Logger.log("Error: Invalid JSON request body");
      return jsonResponse({ error: "Invalid JSON request body" });
    }

    if (payload.action === "ping") {
      Logger.log("Ping action received, returning ok: true");
      return jsonResponse({ ok: true });
    }

    if (payload.action !== "upload") {
      Logger.log("Error: Unknown action '" + payload.action + "'");
      return jsonResponse({ error: 'Unknown action. Expected "upload" or "ping"' });
    }

    const fileName = String(payload.fileName || "").trim();
    const mimeType = String(payload.mimeType || "").trim();
    const base64 = String(payload.base64 || "");
    const folderId = String(payload.folderId || "").trim();

    Logger.log("Upload Details - FileName: " + fileName + ", MimeType: " + mimeType + ", FolderId: " + folderId);

    if (!fileName || !base64 || !folderId) {
      Logger.log("Error: Missing required fields (fileName, base64, or folderId)");
      return jsonResponse({ error: "fileName, base64 and folderId are required" });
    }

    const estimatedBytes = Math.floor((base64.length * 3) / 4);
    Logger.log("Estimated file size: " + estimatedBytes + " bytes");

    if (estimatedBytes > MAX_FILE_BYTES) {
      Logger.log("Error: File exceeds the 50 MB limit");
      return jsonResponse({ error: "File exceeds the 50 MB limit" });
    }

    let fileBytes;
    try {
      fileBytes = Utilities.base64Decode(base64);
      Logger.log("Successfully decoded base64 string. Actual length: " + fileBytes.length + " bytes");
    } catch (err) {
      Logger.log("Error: Invalid Base64 file data");
      return jsonResponse({ error: "Invalid Base64 file data" });
    }

    if (fileBytes.length > MAX_FILE_BYTES) {
      Logger.log("Error: Decoded file exceeds the 50 MB limit");
      return jsonResponse({ error: "File exceeds the 50 MB limit" });
    }

    Logger.log("Accessing Drive folder with ID: " + folderId);
    let folder;
    try {
      folder = DriveApp.getFolderById(folderId);
      Logger.log("Successfully accessed Drive folder: " + folder.getName());
    } catch (err) {
      Logger.log("Error accessing folder: " + err.message);
      return jsonResponse({ error: "Failed to access Drive folder. Check folder ID and permissions." });
    }

    const blob = Utilities.newBlob(
      fileBytes,
      mimeType || "application/octet-stream",
      fileName
    );

    Logger.log("Creating file in Drive...");
    const file = folder.createFile(blob);
    const fileId = file.getId();
    
    Logger.log("File created successfully! ID: " + fileId);

    // Make the file readable by anyone with the link (optional, uncomment if needed)
    // file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return jsonResponse({
      ok: true,
      fileUrl: "https://drive.google.com/file/d/" + fileId + "/view",
      fileId: fileId,
      fileName: file.getName(),
      mimeType: mimeType || "application/octet-stream",
      size: fileBytes.length
    });

  } catch (err) {
    Logger.log("CRITICAL ERROR: " + err.stack);
    return jsonResponse({ error: "Upload failed: " + err.message });
  }
}

function jsonResponse(body) {
  // Apps Script returns ContentService as a redirect which automatically handles basic CORS
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
