import { Resend } from "resend";
import { getMagicLinkUrl } from "./auth";

// Only initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Log Resend initialization status (redact actual key)
console.log("[Email Init] RESEND_API_KEY present:", !!process.env.RESEND_API_KEY);
console.log("[Email Init] Resend client initialized:", !!resend);

export async function sendMagicLinkEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string; devModeUrl?: string }> {
  const magicLinkUrl = getMagicLinkUrl(token);

  // Dev mode: log magic link to console when Resend is not configured
  if (!resend) {
    console.log("\n" + "=".repeat(60));
    console.log("🔗 DEV MODE - MAGIC LINK (no email sent)");
    console.log("=".repeat(60));
    console.log(`Email: ${email}`);
    console.log(`Link: ${magicLinkUrl}`);
    console.log("=".repeat(60) + "\n");
    return { success: true, devModeUrl: magicLinkUrl };
  }

  try {
    // Use Resend's test email if no custom domain is configured
    // To use your own domain, verify it at https://resend.com/domains
    const fromEmail = process.env.EMAIL_FROM || "CashGlitch <onboarding@resend.dev>";

    // Debug logging for email configuration
    console.log("[Email Config] EMAIL_FROM env var:", process.env.EMAIL_FROM);
    console.log("[Email Config] Using fromEmail:", fromEmail);
    console.log("[Email Config] Magic link URL:", magicLinkUrl);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Your CashGlitch Access Link",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f0a1a; font-family: 'Courier New', monospace;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0a1a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="max-width: 500px;">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <h1 style="color: #a855f7; font-size: 32px; margin: 0; text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);">
                        CASH GLITCH
                      </h1>
                      <p style="color: #c4b5fd; opacity: 0.6; font-size: 12px; margin-top: 8px;">
                        // SYSTEM ACCESS REQUESTED
                      </p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); padding: 30px;">
                      <p style="color: #c4b5fd; font-size: 14px; margin: 0 0 20px 0; line-height: 1.6;">
                        &gt; ACCESS LINK GENERATED<br>
                        &gt; VALID FOR 15 MINUTES<br>
                        &gt; CLICK BELOW TO ENTER THE MATRIX
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${magicLinkUrl}"
                               style="display: inline-block; background: linear-gradient(90deg, #9333ea, #ec4899); color: white; text-decoration: none; padding: 14px 32px; font-size: 16px; font-weight: bold; letter-spacing: 2px;">
                              GRANT ACCESS
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #c4b5fd; opacity: 0.5; font-size: 12px; margin: 20px 0 0 0; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link:<br>
                        <span style="color: #a855f7; word-break: break-all;">${magicLinkUrl}</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 30px;">
                      <p style="color: #c4b5fd; opacity: 0.4; font-size: 11px; margin: 0;">
                        &gt; IF YOU DIDN'T REQUEST THIS, IGNORE THIS MESSAGE<br>
                        &gt; THE SYSTEM WILL RESET AUTOMATICALLY
                      </p>
                      <p style="color: #c4b5fd; opacity: 0.3; font-size: 10px; margin-top: 20px;">
                        © 2025 CASH GLITCH. TAKE THE ABUNDANCE PILL.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
CASH GLITCH - ACCESS LINK

Click the link below to access CashGlitch:
${magicLinkUrl}

This link expires in 15 minutes.

If you didn't request this, you can safely ignore this email.

© 2025 CASH GLITCH
      `.trim(),
    });

    // Log full Resend response for debugging
    console.log("[Email Response] data:", JSON.stringify(data));
    console.log("[Email Response] error:", JSON.stringify(error));

    if (error) {
      console.error("Failed to send magic link email:", error);
      return { success: false, error: error.message };
    }

    console.log(`[Email Success] Magic link email sent to ${email} (id: ${data?.id})`);
    return { success: true };
  } catch (err) {
    console.error("Error sending magic link email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send email",
    };
  }
}
