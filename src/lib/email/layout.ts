import { SITE_URL } from '@/lib/config/site';

/**
 * Branded email layout. Table-based with inline styles so it renders the same
 * in Gmail, Outlook and Apple Mail. Every email is built from the same blocks
 * and also gets a plain-text version.
 */
export type EmailBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string; muted?: boolean }
  | { type: 'button'; label: string; href: string }
  | { type: 'code'; label: string; code: string; note?: string }
  | { type: 'rows'; rows: { label: string; value: string }[] }
  | { type: 'list'; items: string[] }
  | { type: 'divider' }
  | { type: 'small'; text: string };

export interface EmailContent {
  /** Short line shown after the subject in the inbox list. */
  preheader: string;
  blocks: EmailBlock[];
  /** Footer line explaining why this email was sent. */
  reason: string;
  /** Unsubscribe link for marketing emails. */
  unsubscribeUrl?: string;
}

const C = { ink: '#171918', soft: '#3a3d3a', muted: '#5d605b', chalk: '#f5f3ee', white: '#fbfaf7', stone: '#d8d5cd', olive: '#59634d', clay: '#93513a' };
const SANS = "'Hanken Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "Newsreader,Georgia,'Times New Roman',serif";

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escapes text but keeps Supabase template tags such as {{ .ConfirmationURL }} intact. */
const safe = (s: string) => esc(s).replace(/\{\{\s*([^}]*?)\s*\}\}/g, (_m, inner: string) => `{{ ${inner.replace(/&quot;/g, '"')} }}`);

function block(b: EmailBlock): string {
  switch (b.type) {
    case 'heading':
      return `<h1 style="margin:0 0 20px;font-family:${SERIF};font-weight:400;font-size:32px;line-height:1.15;letter-spacing:-0.02em;color:${C.ink}">${safe(b.text)}</h1>`;
    case 'text':
      return `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.6;color:${b.muted ? C.muted : C.soft}">${safe(b.text)}</p>`;
    case 'button':
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="background:${C.ink};border-radius:2px"><a href="${safe(b.href)}" style="display:inline-block;padding:15px 28px;font-family:${SANS};font-size:15px;font-weight:500;color:${C.white};text-decoration:none">${safe(b.label)}</a></td></tr></table>`;
    case 'code':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;border:1px dashed ${C.olive}"><tr><td style="padding:20px;text-align:center"><p style="margin:0 0 6px;font-family:${SANS};font-size:13px;color:${C.muted}">${safe(b.label)}</p><p style="margin:0;font-family:${SANS};font-size:24px;letter-spacing:0.12em;font-weight:600;color:${C.ink}">${safe(b.code)}</p>${b.note ? `<p style="margin:8px 0 0;font-family:${SANS};font-size:13px;color:${C.muted}">${safe(b.note)}</p>` : ''}</td></tr></table>`;
    case 'rows':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-top:1px solid ${C.stone}">${b.rows
        .map(
          (r) =>
            `<tr><td style="padding:12px 12px 12px 0;border-bottom:1px solid ${C.stone};font-family:${SANS};font-size:14px;color:${C.muted};vertical-align:top;width:40%">${safe(r.label)}</td><td style="padding:12px 0;border-bottom:1px solid ${C.stone};font-family:${SANS};font-size:14px;color:${C.ink};vertical-align:top">${safe(r.value)}</td></tr>`,
        )
        .join('')}</table>`;
    case 'list':
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px">${b.items
        .map((i) => `<tr><td style="padding:0 10px 10px 0;vertical-align:top;font-family:${SANS};font-size:16px;color:${C.olive}">&#8226;</td><td style="padding:0 0 10px;font-family:${SANS};font-size:16px;line-height:1.5;color:${C.soft}">${safe(i)}</td></tr>`)
        .join('')}</table>`;
    case 'divider':
      return `<hr style="border:0;border-top:1px solid ${C.stone};margin:28px 0">`;
    case 'small':
      return `<p style="margin:0 0 12px;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted}">${safe(b.text)}</p>`;
  }
}

function blockText(b: EmailBlock): string {
  switch (b.type) {
    case 'heading':
      return b.text.toUpperCase();
    case 'text':
    case 'small':
      return b.text;
    case 'button':
      return `${b.label}: ${b.href}`;
    case 'code':
      return `${b.label}: ${b.code}${b.note ? ` (${b.note})` : ''}`;
    case 'rows':
      return b.rows.map((r) => `${r.label}: ${r.value}`).join('\n');
    case 'list':
      return b.items.map((i) => `- ${i}`).join('\n');
    case 'divider':
      return '---';
  }
}

export function renderEmail(content: EmailContent, opts: { siteUrl?: string } = {}) {
  const site = opts.siteUrl ?? SITE_URL;
  const footerLinks = [
    `<a href="${site}" style="color:${C.muted}">thehomelab.ie</a>`,
    `<a href="${site}/account" style="color:${C.muted}">Your account</a>`,
    `<a href="${site}/contact" style="color:${C.muted}">Contact us</a>`,
  ];
  if (content.unsubscribeUrl) {
    // Resend broadcasts fill in {{{RESEND_UNSUBSCRIBE_URL}}} themselves, so it is passed through untouched.
    const href = content.unsubscribeUrl.startsWith('{{{') ? content.unsubscribeUrl : safe(content.unsubscribeUrl);
    footerLinks.push(`<a href="${href}" style="color:${C.muted}">Unsubscribe</a>`);
  }

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>The Home Lab</title>
</head>
<body style="margin:0;padding:0;background:${C.chalk};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.chalk}">${safe(content.preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.chalk}">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 0 28px">
<a href="${site}" style="text-decoration:none;color:${C.ink}"><img src="${site}/email/logo-mark.png" width="38" height="27" alt="" style="display:inline-block;vertical-align:middle;border:0"><span style="display:inline-block;vertical-align:middle;margin-left:12px;font-family:${SANS};font-size:12px;letter-spacing:0.42em;color:${C.ink}">THE HOME LAB</span></a>
</td></tr>
<tr><td style="background:${C.white};padding:40px 36px;border:1px solid ${C.stone}">
${content.blocks.map(block).join('\n')}
</td></tr>
<tr><td style="padding:24px 4px 0">
<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">${safe(content.reason)}</p>
<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">${footerLinks.join(' &nbsp;·&nbsp; ')}</p>
<p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted}">The Home Lab · Room sets from three places · Based in Ireland</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    'THE HOME LAB',
    '',
    ...content.blocks.map(blockText).flatMap((t) => [t, '']),
    content.reason,
    content.unsubscribeUrl ? `Unsubscribe: ${content.unsubscribeUrl}` : '',
    site,
  ]
    .filter((l, i, all) => !(l === '' && all[i - 1] === ''))
    .join('\n')
    .trim();

  return { html, text };
}
