export interface SendEmailParams {
  scriptUrl: string;
  to: string;
  fullName: string;
  roleTitle: string;
  applicationId: string;
  ccEmails?: string[];
}

export async function sendConfirmationEmail({
  scriptUrl,
  to,
  fullName,
  roleTitle,
  applicationId,
  ccEmails = [],
}: SendEmailParams): Promise<void> {
  if (!scriptUrl) {
    console.warn("[Email] No emailScriptUrl configured, skipping email");
    return;
  }

  const subject = `Application Received - ${roleTitle}`;

  const payload = {
    to,
    fullName,
    roleTitle,
    applicationId,
    subject,
    submittedAtIso: new Date().toISOString(),
    ccEmails,
  };

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    // no-cors returns opaque response (status 0) — can't read body, but request was sent
    console.log("[Email] Confirmation request sent to", to, "(status:", res.status, ")");
  } catch (err) {
    console.error("[Email] Error sending confirmation:", err);
  }
}
