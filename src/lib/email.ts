// src/lib/email.ts
//
// Wraps Resend for the one email this slice actually needs to send: a quote
// request notification. Kept as a single narrow function rather than a
// generic "send any email" helper — when the supplier/interior-designer
// sides get built later, they'll likely want different templates, and it's
// easier to add a second specific function than to unpick a generic one.

import { Resend } from 'resend';

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

type QuoteRequestEmailInput = {
  contractorName: string;
  developerName: string;
  developerEmail: string;
  contactPhone: string;
  projectType: string;
  location: string;
  budgetRangeLabel: string;
  details: string;
};

// Returns true if the email was sent, false if it failed. Callers should
// check this and record it (see QuoteRequest.emailSentAt in the schema) —
// a silently dropped notification defeats the entire point of this feature,
// so failures need to be visible, not swallowed.
export async function sendQuoteRequestEmail(input: QuoteRequestEmailInput): Promise<boolean> {
  const notifyAddress = process.env.QUOTE_NOTIFICATION_EMAIL;

  if (!notifyAddress) {
    console.error('QUOTE_NOTIFICATION_EMAIL is not set — cannot send quote request email');
    return false;
  }

  try {
    const { error } = await getResendClient().emails.send({
      // Resend's test domain works without any DNS setup, but only sends to
      // the email address you signed up with. Once you verify your own
      // domain in Resend's dashboard, swap this to something like
      // "BuildBridge <quotes@yourdomain.com>" — see the deployment notes.
      from: 'BuildBridge <onboarding@resend.dev>',
      to: notifyAddress,
      subject: `New quote request for ${input.contractorName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px;">
          <h2 style="margin-bottom: 4px;">New Quote Request</h2>
          <p style="color: #666; margin-top: 0;">for ${escapeHtml(input.contractorName)}</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">From</td><td style="padding: 8px 0;">${escapeHtml(input.developerName)} (${escapeHtml(input.developerEmail)})</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${escapeHtml(input.contactPhone)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Project type</td><td style="padding: 8px 0;">${escapeHtml(input.projectType)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0;">${escapeHtml(input.location)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Budget range</td><td style="padding: 8px 0;">${escapeHtml(input.budgetRangeLabel)}</td></tr>
          </table>

          <p style="color: #666; margin-bottom: 4px;">Details</p>
          <p style="white-space: pre-wrap;">${escapeHtml(input.details)}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend returned an error sending quote request email:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to send quote request email:', err);
    return false;
  }
}

// Minimal HTML escaping for values interpolated into the email template
// above. All of these values come from user input (developer-submitted
// form fields), so this isn't optional — without it, a project description
// containing HTML would be interpreted as markup in the notification email.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
