// SMTP mailer for lead notifications (Hostinger mailbox).
//
// Configuration is env-only — nothing here reads the DB, so a mail failure can
// never take the enquiry API down. If SMTP_HOST/USER/PASS are unset, mail is
// silently disabled and `sendLeadNotification` becomes a no-op: the enquiry is
// still stored and still shows in the admin dashboard.

import nodemailer, { type Transporter } from 'nodemailer';

export interface LeadMailFields {
  name: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  birdType?: string;
  requirement?: string;
  birdCapacity?: string;
  timeline?: string;
  product?: string;
  type?: string;
  sourceUrl?: string;
  message?: string;
}

interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string[];
}

/** Reads SMTP config from env. Returns null when mail is not configured. */
export function getMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  // Port 465 is implicit TLS; 587 is STARTTLS. SMTP_SECURE overrides.
  const port = Number(process.env.SMTP_PORT) || 465;
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv ? secureEnv === 'true' : port === 465;

  const to = (process.env.LEAD_NOTIFY_TO || user)
    .split(',')
    .map(a => a.trim())
    .filter(Boolean);
  if (to.length === 0) return null;

  return { host, port, secure, user, pass, from: process.env.MAIL_FROM?.trim() || user, to };
}

let cached: Transporter | null = null;

function getTransport(cfg: MailConfig): Transporter {
  if (!cached) {
    cached = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: cfg.user, pass: cfg.pass },
      pool: true,
      // Bounded waits — a hung mail server must not hold the form request open.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return cached;
}

/** Minimal HTML escaping — lead fields are untrusted user input. */
function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const LABELS: Array<[keyof LeadMailFields, string]> = [
  ['name', 'Name'],
  ['company', 'Farm / Company'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['country', 'Country'],
  ['birdType', 'Bird Type'],
  ['requirement', 'Requirement'],
  ['birdCapacity', 'Approx Capacity'],
  ['timeline', 'Timeline'],
  ['product', 'Product'],
  ['type', 'Lead Type'],
  ['sourceUrl', 'Source Page'],
  ['message', 'Message'],
];

export function renderLeadEmail(lead: LeadMailFields): { subject: string; text: string; html: string } {
  const rows = LABELS
    .map(([key, label]) => [label, (lead[key] || '').toString().trim()] as const)
    .filter(([, value]) => value.length > 0);

  const who = lead.name?.trim() || lead.email?.trim() || lead.phone?.trim() || 'Unknown';
  const subject = `New website enquiry — ${who}`;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111">
  <h2 style="margin:0 0 16px;font-size:18px">New website enquiry</h2>
  <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="border:1px solid #ddd;background:#f7f7f7;font-weight:bold;white-space:nowrap">${esc(
            label
          )}</td><td style="border:1px solid #ddd">${esc(value).replace(/\n/g, '<br>')}</td></tr>`
      )
      .join('\n    ')}
  </table>
</div>`;

  return { subject, text, html };
}

/**
 * Sends the lead notification. Never throws — callers must not fail a form
 * submission because the mail server was slow or misconfigured.
 * Returns true only if the message was handed to the SMTP server.
 */
export async function sendLeadNotification(lead: LeadMailFields): Promise<boolean> {
  const cfg = getMailConfig();
  if (!cfg) return false;

  try {
    const { subject, text, html } = renderLeadEmail(lead);
    await getTransport(cfg).sendMail({
      from: cfg.from,
      to: cfg.to,
      // Replying to the notification should reach the customer, not us.
      replyTo: lead.email && lead.email.includes('@') ? lead.email : undefined,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error('Lead notification email failed:', err);
    return false;
  }
}
