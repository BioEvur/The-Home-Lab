/**
 * Shared building blocks for every Home Lab email: colours, type, buttons,
 * cards and the page shell. Table-based with inline styles so the emails look
 * the same in Gmail, Outlook and Apple Mail. Light theme only.
 */
export const C = {
  sand: '#efe7dc',
  sandDeep: '#e3d5c4',
  paper: '#fbf8f3',
  line: '#dccfbf',
  ink: '#171918',
  soft: '#3a3d3a',
  muted: '#7a6f64',
  clay: '#93513a',
  olive: '#59634d',
  oat: '#e9d8c4',
};
export const SANS = "'Hanken Grotesk','Helvetica Neue',Arial,sans-serif";
export const SERIF = "Newsreader,Georgia,'Times New Roman',serif";
export const FIRST_NAME = '{{ if .Data.first_name }}, {{ .Data.first_name }}{{ end }}';

export const eyebrow = (text: string, color = C.clay) =>
  `<p style="margin:0 0 14px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.14em;color:${color}">${text}</p>`;
export const h1 = (text: string, color = C.ink) =>
  `<h1 class="h1" style="margin:0 0 18px;font-family:${SERIF};font-weight:400;font-size:42px;line-height:1.08;letter-spacing:-0.02em;color:${color}">${text}</h1>`;
export const h2 = (text: string) => `<h2 style="margin:0 0 18px;font-family:${SERIF};font-weight:400;font-size:28px;line-height:1.2;color:${C.ink}">${text}</h2>`;
export const p = (text: string, color = C.soft, size = 17) =>
  `<p style="margin:0 0 24px;font-family:${SANS};font-size:${size}px;line-height:1.6;color:${color}">${text}</p>`;

export function button(label: string, href: string, dark = true) {
  const bg = dark ? C.ink : C.paper;
  const fg = dark ? C.paper : C.ink;
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${bg};border-radius:40px"><a href="${href}" style="display:inline-block;padding:17px 34px;font-family:${SANS};font-size:16px;font-weight:600;color:${fg};text-decoration:none;border-radius:40px">${label} &rarr;</a></td></tr></table>`;
}

export const fallbackLink = (color = C.muted, link = C.clay, href = '{{ .ConfirmationURL }}') =>
  `<p style="margin:22px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${color}">Button not working? Copy this link into your browser:<br><a href="${href}" style="color:${link};word-break:break-all">${href}</a></p>`;

export const hero = (site: string, file: string, alt: string, bg: string) =>
  `<tr><td style="line-height:0;font-size:0"><img src="${site}/email/${file}" width="600" alt="${alt}" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:6px 6px 0 0;background:${bg}"></td></tr>`;

export const card = (inner: string, bg = C.paper, radius = '0 0 6px 6px') =>
  `<tr><td class="pad" style="background:${bg};padding:40px 48px 36px;border-radius:${radius}">${inner}</td></tr>`;

export function collection() {
  const tile = (bg: string, border: string, native: string, nativeAttrs: string, nativeFont: string, nativeColor: string, name: string, nameColor: string, line: string, lineColor: string) =>
    `<td class="tile" width="190" valign="top" style="width:190px;background:${bg};${border}border-radius:6px;padding:22px 18px 20px">
<p ${nativeAttrs} style="margin:0 0 18px;font-family:${nativeFont};font-size:30px;line-height:1;color:${nativeColor};text-align:left">${native}</p>
<p style="margin:0 0 4px;font-family:${SERIF};font-size:19px;color:${nameColor}">${name}</p>
<p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.45;color:${lineColor}">${line}</p></td>`;
  const gap = `<td class="gap" width="15" style="width:15px;font-size:0">&nbsp;</td>`;
  return `<tr><td style="padding:40px 4px 14px">${eyebrow('THE COLLECTION SO FAR')}<h2 style="margin:0;font-family:${SERIF};font-weight:400;font-size:28px;line-height:1.2;color:${C.ink}">Rooms from places around the world, with more on the way</h2></td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
${tile(C.ink, '', '喫茶店', 'lang="ja"', "'Hiragino Mincho ProN','Yu Mincho',serif", C.oat, 'Kyoto Kissaten', C.paper, 'A Japanese coffee house, on your kitchen counter.', '#b9b2a8')}${gap}
${tile(C.paper, `border:1px solid #e2d6c6;`, 'Milano', 'lang="it"', SERIF, C.clay, 'The Milanese', C.ink, 'An evening drink in a Milan apartment.', '#5d605b')}${gap}
${tile(C.olive, '', 'رياض', 'lang="ar" dir="rtl"', "'Geeza Pro','Noto Naskh Arabic',serif", '#e6e2c8', 'Riad Corner', C.paper, 'A reading corner in a Marrakech riad. Coming soon.', '#d6dacb')}
</tr></table></td></tr>`;
}

export function perks() {
  const row = (label: string, title: string, body: string) =>
    `<tr><td width="120" valign="top" style="width:120px;padding:16px 12px 16px 0;border-bottom:1px solid ${C.line};font-family:${SERIF};font-size:22px;color:${C.clay}">${label}</td><td valign="top" style="padding:16px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:15px;line-height:1.55;color:${C.soft}"><strong style="color:${C.ink}">${title}</strong> ${body}</td></tr>`;
  return `<tr><td style="padding:40px 4px 8px">${eyebrow("ONCE YOU'RE IN")}${h2('What membership gets you')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line}">
${row('&euro;15&nbsp;+&nbsp;&euro;15', 'Bring a friend.', 'They get &euro;15 off their first order with your link, and you get &euro;15 credit once it ships.')}
${row('Heads&nbsp;up', 'Hear first.', "Pick the sets you like and we'll tell you when a new one opens and when orders close for each batch.")}
${row('One&nbsp;place', 'Keep track.', 'Orders, delivery tracking, saved addresses and your wishlist, on any device.')}
</table></td></tr>`;
}

/** The longer note from the shop, for first contact. */
export const welcomeNote = (signOff: string) => `<tr><td style="padding:32px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sandDeep};border-radius:6px"><tr><td class="pad" style="padding:28px 32px">
<p style="margin:0 0 10px;font-family:${SERIF};font-size:21px;line-height:1.35;color:${C.ink}">We're a small shop in Ireland, putting together rooms inspired by places we love.</p>
<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.soft}">If you have a question, or just want to say hello, reply to this email. It comes straight to us, and a real person reads every one.</p>
<p style="margin:18px 0 0;font-family:${SERIF};font-size:17px;color:${C.ink}">${signOff}<br>The Home Lab</p></td></tr></table></td></tr>`;

/** A one-line version for account emails. */
export const shortNote = (text: string) =>
  `<tr><td style="padding:28px 4px 0"><p style="margin:0;font-family:${SERIF};font-size:18px;line-height:1.45;color:${C.ink}">${text}</p></td></tr>`;

/** footer: extra footer lines (links, unsubscribe), shown under the reason. */
export function shell(o: { title: string; preheader: string; label: string; body: string; reason: string; site: string; footer?: string }) {
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${o.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:${C.sand}}
  a{color:${C.clay}}
  @media (max-width:620px){
    .wrap{width:100%!important}
    .pad{padding-left:24px!important;padding-right:24px!important}
    .h1{font-size:34px!important}
    .tile,.stack{display:block!important;width:100%!important;box-sizing:border-box}
    .tile{margin-bottom:10px}
    .gap{display:none!important}
    .stack-img{display:none!important}
    .code{font-size:34px!important;letter-spacing:0.18em!important}
    .fluid{width:100%!important;max-width:100%!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.sand}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${o.preheader}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sand}">
<tr><td align="center" style="padding:28px 12px 40px">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px">
<tr><td style="padding:0 4px 18px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:${SERIF};font-size:15px;letter-spacing:0.32em;color:${C.ink}">THE&nbsp;HOME&nbsp;LAB</td>
<td align="right" style="font-family:${SANS};font-size:12px;letter-spacing:0.08em;color:${C.muted}">${o.label}</td>
</tr></table></td></tr>
${o.body}
<tr><td style="padding:28px 4px 0">
<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.55;color:${C.muted}">${o.reason}</p>
${o.footer ?? ''}<p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.55;color:${C.muted}">The Home Lab &middot; Based in Ireland &middot; <a href="${o.site}" style="color:${C.muted}">thehomelab.ie</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`;
}

/** Escapes text a person typed (names, notes, messages) before it goes into an email. */
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
