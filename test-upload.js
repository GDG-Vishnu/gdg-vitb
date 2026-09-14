const url = "https://script.google.com/macros/s/AKfycbzot4ExlbsGRNwJWrag0RzS_YEG5EtcKnusAIp65x7w0PPKFzkz-xT592SLsk11XcwwSw/exec";
const folderId = "1aDm5XSzrbnLRnwOxTEn2F23R6IIkzppr";

async function test() {
  const content = "Hello from Antigravity!";
  const base64 = Buffer.from(content).toString("base64");

  const payload = {
    action: "upload",
    fileName: "test-upload.txt",
    mimeType: "text/plain",
    base64,
    folderId
  };

  console.log("Sending request...");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
