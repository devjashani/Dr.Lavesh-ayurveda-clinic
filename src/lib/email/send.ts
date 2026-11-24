/**
 * Unified Email Dispatcher for Vankal Ayurveda
 * Supports Resend API integration with safe development console fallback
 */

export const DEFAULT_FROM_EMAIL =
  process.env.EMAIL_FROM || 'Vankal Ayurveda <onboarding@resend.dev>';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  success: boolean;
  error?: 'EMAIL_NOT_CONFIGURED' | 'EMAIL_DELIVERY_FAILED' | string;
}

// 5. One-line dev hint in terminal output on startup when RESEND_API_KEY is missing
if (process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY?.trim()) {
  if (typeof globalThis !== 'undefined' && !(globalThis as unknown as { __vankal_email_dev_hint?: boolean }).__vankal_email_dev_hint) {
    (globalThis as unknown as { __vankal_email_dev_hint?: boolean }).__vankal_email_dev_hint = true;
    console.log('Email sending is disabled; sign-in codes will print in this terminal.');
  }
}

/**
 * Checks whether an email sending service is available in the current environment.
 */
export function isEmailConfigured(): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return true; // Dev fallback to server console is always available
  }
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/**
 * Prints the dev email block to the server console in development.
 */
function printDevEmailBlock({
  title,
  to,
  subject,
  text,
  errorReason,
}: {
  title: string;
  to: string;
  subject: string;
  text: string;
  errorReason?: string;
}) {
  console.log('\n======================================================');
  console.log(title);
  if (errorReason) {
    console.log(`Notice: ${errorReason}`);
  }
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('------------------------------------------------------');
  console.log(text);
  console.log('======================================================\n');
}

/**
 * Sends an email via Resend in production or prints to the server console in development.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const isDev = process.env.NODE_ENV !== 'production';

  // 1. Missing API Key handling
  if (!apiKey) {
    if (isDev) {
      // In development: print the email to the server console ONLY
      printDevEmailBlock({
        title: '=== DEV EMAIL (no RESEND_API_KEY) ===',
        to,
        subject,
        text,
      });
      return { success: true };
    }

    // In production without RESEND_API_KEY: typed error
    return { success: false, error: 'EMAIL_NOT_CONFIGURED' };
  }

  // 2. Dispatch via Resend HTTP API
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: DEFAULT_FROM_EMAIL,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const shortCode = errorJson.name || errorJson.message || `HTTP_${res.status}`;

      if (isDev) {
        // In development: log error reason and print dev block so sign-in still works
        printDevEmailBlock({
          title: '=== DEV EMAIL (Resend Error Fallback) ===',
          to,
          subject,
          text,
          errorReason: `Resend HTTP ${res.status}: ${shortCode}`,
        });
        return { success: true };
      }

      // In production: log a short error code only on the server
      console.error('[Resend Error Code]', res.status, shortCode);
      return {
        success: false,
        error: 'EMAIL_DELIVERY_FAILED',
      };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network error';

    if (isDev) {
      // In development: log error reason and print dev block so sign-in still works
      printDevEmailBlock({
        title: '=== DEV EMAIL (Resend Error Fallback) ===',
        to,
        subject,
        text,
        errorReason: `Dispatch Exception: ${errorMsg}`,
      });
      return { success: true };
    }

    // In production: short error code only
    console.error('[Email Dispatch Error Code]', 'FETCH_FAILED');
    return { success: false, error: 'EMAIL_DELIVERY_FAILED' };
  }
}

/**
 * Generates the standardized Sign-In email payload for Patient My Bookings
 */
export function generateSignInEmail({
  code,
  verifyUrl,
}: {
  code: string;
  verifyUrl: string;
}) {
  const subject = 'Your VANKAL AYURVEDA sign-in code';

  const text = `Namaste,

Your verification code for VANKAL AYURVEDA is:

  ${code}

This code expires in 10 minutes.

Alternatively, you can sign in directly by clicking the link below:
${verifyUrl}

If you did not request this, ignore this email.

Warm regards,
Dr. Lavesh Bohra
VANKAL AYURVEDA · Classical Ayurvedic Healthcare`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FBF9F4; margin: 0; padding: 24px; color: #1F3D2B;">
  <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2D9C8; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <div style="background-color: #1F3D2B; padding: 24px 32px; text-align: center;">
      <h1 style="color: #FBF9F4; margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 0.05em;">VANKAL AYURVEDA</h1>
      <p style="color: #D4AF37; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Classical Clinical Consultations</p>
    </div>
    
    <div style="padding: 32px;">
      <h2 style="font-size: 18px; margin-top: 0; color: #14291C;">Your Sign-In Verification Code</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #4A5568;">
        Use the 6-digit code below to securely access your booked consultations, prescriptions, and receipts:
      </p>

      <div style="background: #F7F5EF; border: 1px dashed #1F3D2B; border-radius: 6px; padding: 18px; text-align: center; margin: 24px 0;">
        <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1F3D2B;">
          ${code}
        </span>
      </div>

      <p style="font-size: 12px; color: #718096; margin-bottom: 24px; text-align: center;">
        ⏱️ This code expires in 10 minutes.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" style="background-color: #1F3D2B; color: #FBF9F4; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500; display: inline-block;">
          Sign in to My Bookings →
        </a>
      </div>

      <p style="font-size: 12px; color: #A0AEC0; line-height: 1.5; border-top: 1px solid #E2D9C8; padding-top: 20px; margin-top: 32px;">
        If you did not request this verification code, please ignore this email. Your consultations remain secure.
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}
