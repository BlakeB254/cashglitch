import { Resend } from "resend";
import { getMagicLinkUrl } from "./auth";

// Only initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
    const fromEmail = process.env.EMAIL_FROM || "CashGlitch <onboarding@resend.dev>";
    const replyTo = process.env.REPLY_TO_EMAIL || "support@cashglitch.org";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      reply_to: replyTo,
      subject: "Your CashGlitch Sign-In Link",
      headers: {
        "X-Entity-Ref-ID": token.slice(0, 8),
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f0a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0a1a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="max-width: 500px;">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <h1 style="color: #a855f7; font-size: 28px; margin: 0; font-weight: 600;">
                        CashGlitch
                      </h1>
                      <p style="color: #c4b5fd; opacity: 0.7; font-size: 13px; margin-top: 8px;">
                        Sign-in request
                      </p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; padding: 30px;">
                      <p style="color: #e9e4f0; font-size: 15px; margin: 0 0 20px 0; line-height: 1.6;">
                        Hi there,<br><br>
                        Click the button below to sign in to CashGlitch. This link will expire in 15 minutes.
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${magicLinkUrl}"
                               style="display: inline-block; background: linear-gradient(90deg, #9333ea, #ec4899); color: white; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: 600; border-radius: 6px;">
                              Sign in to CashGlitch
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #c4b5fd; opacity: 0.6; font-size: 12px; margin: 20px 0 0 0; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <span style="color: #a855f7; word-break: break-all;">${magicLinkUrl}</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 30px;">
                      <p style="color: #c4b5fd; opacity: 0.5; font-size: 12px; margin: 0; line-height: 1.6;">
                        If you didn't request this email, you can safely ignore it.
                      </p>
                      <p style="color: #c4b5fd; opacity: 0.4; font-size: 11px; margin-top: 16px;">
                        © ${new Date().getFullYear()} CashGlitch
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
      text: `CashGlitch Sign-In Link

Click the link below to sign in to CashGlitch:
${magicLinkUrl}

This link expires in 15 minutes.

If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} CashGlitch
      `.trim(),
    });

    if (error) {
      console.error("Failed to send magic link email:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("Error sending magic link email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send email",
    };
  }
}
