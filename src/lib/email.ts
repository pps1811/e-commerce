import { Resend } from "resend";

let client: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function getResendClient(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "Aurelle <onboarding@resend.dev>";

/**
 * Every send is best-effort: a failed email should never fail the order or
 * status update that triggered it. Callers fire-and-forget this.
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  react: React.ReactElement;
}): Promise<void> {
  if (!isEmailConfigured()) {
    console.log(`[email] Skipped "${options.subject}" to ${options.to} — RESEND_API_KEY not set`);
    return;
  }

  try {
    await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      react: options.react,
    });
  } catch (error) {
    console.error("Failed to send email", options.subject, error);
  }
}
