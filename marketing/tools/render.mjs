/**
 * Renders every social post in posts.mjs to finished images (and silent MP4s
 * for reels), using the supplier photos in /public/images and the brand fonts.
 *
 *   node marketing/tools/render.mjs            # everything
 *   node marketing/tools/render.mjs 3 10 14    # only these post numbers
 *
 * Needs Playwright with Chromium, and ffmpeg for the reels.
 * Output: marketing/creatives/post-NN/...
 */
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { POSTS, SIZES } from './posts.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const OUT = resolve(HERE, '../creatives');
const TMP = join(OUT, '.tmp');

const C = {
  ink: '#171918',
  chalk: '#F5F3EE',
  olive: '#59634D',
  clay: '#B96E50',
  stone: '#D8D5CD',
  inkSoft: '#3A3D3A',
  inkMuted: '#5D605B',
  photoBg: '#F5F2ED',
};

const THEMES = {
  chalk: { bg: C.chalk, fg: C.ink, muted: C.inkMuted, accent: C.olive, rule: C.stone },
  stone: { bg: C.stone, fg: C.ink, muted: C.inkSoft, accent: C.olive, rule: '#BDB9AF' },
  ink: { bg: C.ink, fg: C.chalk, muted: '#B4B1A9', accent: '#C98A6E', rule: 'rgba(245,243,238,.22)' },
  olive: { bg: C.olive, fg: C.chalk, muted: '#DCDDD2', accent: '#E5DCCB', rule: 'rgba(245,243,238,.28)' },
  clay: { bg: C.clay, fg: C.chalk, muted: '#F6E6DD', accent: C.ink, rule: 'rgba(245,243,238,.35)' },
};

const img = (p) => 'file://' + join(ROOT, p.startsWith('/') ? p.slice(1) : p);
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
/** Light inline formatting: **strong**, line breaks. */
const fmt = (s = '') =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(\d) (ml|cm|g|litre|°C|December|November|January)\b/g, '$1&nbsp;$2')
    .replace(/(\d) × (\d)/g, '$1&nbsp;×&nbsp;$2')
    .replace(/\n/g, '<br>');

const MARK = `<svg viewBox="0 0 132.5 94" aria-hidden="true"><rect x="0" y="0" width="25" height="94"/><rect x="33" y="31" width="42" height="5"/><path d="M75 46 A32 24 0 0 0 75 94 Z"/><rect x="85" y="0" width="22.5" height="94"/><rect x="107.5" y="89.5" width="25" height="4.5"/></svg>`;

/** A Moroccan-style eight-point star lattice, drawn as an SVG tile. */
function riadPattern(stroke = '#B89660', fill = 'none', opacity = 0.55, size = 120) {
  const s = size;
  const h = s / 2;
  const r = s * 0.36;
  const sq = (rot) => {
    const pts = [0, 1, 2, 3].map((i) => {
      const a = ((rot + i * 90) * Math.PI) / 180;
      return `${(h + r * Math.cos(a)).toFixed(1)},${(h + r * Math.sin(a)).toFixed(1)}`;
    });
    return `<polygon points="${pts.join(' ')}"/>`;
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><g fill="${fill}" stroke="${stroke}" stroke-width="2" opacity="${opacity}">${sq(0)}${sq(45)}<circle cx="${h}" cy="${h}" r="${(r * 0.38).toFixed(1)}"/><path d="M0 0 L${s * 0.12} 0 M0 0 L0 ${s * 0.12} M${s} 0 L${s * 0.88} 0 M${s} 0 L${s} ${s * 0.12} M0 ${s} L${s * 0.12} ${s} M0 ${s} L0 ${s * 0.88} M${s} ${s} L${s * 0.88} ${s} M${s} ${s} L${s} ${s * 0.88}"/></g></svg>`;
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
}

const CSS = (w, h, story) => `
@import url('file://${join(HERE, 'fonts/fonts.css')}');
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{font-family:'Hanken Grotesk',Arial,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.f{position:relative;width:${w}px;height:${h}px;overflow:hidden;background:var(--bg);color:var(--fg);display:flex;flex-direction:column}
.pad{padding:${story ? '230px 84px 360px' : '76px 76px 72px'}}
.serif{font-family:'Newsreader',Georgia,serif;font-weight:350;font-variation-settings:'opsz' 72;letter-spacing:-0.022em;line-height:1.02}
.kicker{font-size:${story ? 34 : 28}px;font-weight:500;letter-spacing:.01em;color:var(--accent);margin-bottom:28px}
.kicker.light{color:var(--muted)}
.h{font-family:'Newsreader',Georgia,serif;font-weight:350;font-variation-settings:'opsz' 72;letter-spacing:-0.025em;line-height:1.0;text-wrap:balance}
.h.xl{font-size:${story ? 150 : 128}px}
.h.l{font-size:${story ? 118 : 100}px}
.h.m{font-size:${story ? 92 : 78}px;line-height:1.04}
.h.s{font-size:${story ? 72 : 60}px;line-height:1.08}
.h.xs{font-size:${story ? 58 : 48}px;line-height:1.12}
.body{font-size:${story ? 40 : 34}px;line-height:1.38;color:var(--muted);margin-top:34px;max-width:900px;text-wrap:pretty}
.body strong{color:var(--fg);font-weight:600}
.brand{display:flex;align-items:center;gap:18px;color:var(--fg)}
.brand svg{height:30px;width:auto;fill:currentColor}
.brand span{font-size:17px;font-weight:600;letter-spacing:.42em;text-transform:uppercase}
.foot{display:flex;justify-content:space-between;align-items:center;font-size:24px;color:var(--muted)}
.url{font-size:26px;font-weight:500;letter-spacing:.01em}
.grow{flex:1;min-height:0}
.fit{overflow:hidden}
.rule{height:1px;background:var(--rule);margin:30px 0}
.price-tag{display:inline-block;font-size:${story ? 38 : 32}px;font-weight:600;margin-top:28px;color:var(--fg)}
.native{font-family:'Noto Serif JP','Amiri',serif;font-weight:300;line-height:1}
/* photo */
.ph{position:absolute;inset:0;background-size:cover;background-repeat:no-repeat}
.scrim-b{position:absolute;inset:0;background:linear-gradient(180deg,rgba(23,25,24,0) 30%,rgba(23,25,24,.55) 62%,rgba(23,25,24,.82) 100%)}
.scrim-t{position:absolute;inset:0;background:linear-gradient(0deg,rgba(23,25,24,0) 35%,rgba(23,25,24,.5) 70%,rgba(23,25,24,.78) 100%)}
.over{position:relative;z-index:2;display:flex;flex-direction:column;height:100%}
/* split */
.media{position:relative;background:${C.photoBg};overflow:hidden}
.media img{position:absolute;inset:0;width:100%;height:100%}
.media img.contain{object-fit:contain;-webkit-mask-image:radial-gradient(ellipse 72% 70% at 50% 50%,#000 72%,transparent 100%)}
.media img.cover{object-fit:cover}
/* rows */
.rows{margin-top:40px}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:30px;padding:${story ? 26 : 20}px 0;border-top:1px solid var(--rule);font-size:${story ? 36 : 31}px;line-height:1.25}
.row:last-child{border-bottom:1px solid var(--rule)}
.row .v{font-weight:600;white-space:nowrap}
.row.strike .v{text-decoration:line-through;color:var(--muted);font-weight:500}
.row.total{font-size:${story ? 46 : 40}px;border-top:2px solid var(--fg)}
.row.save .v,.row.save .k{color:var(--accent);font-weight:600}
/* swatches */
.sw{display:flex;gap:14px;margin-top:34px}
.sw div{flex:1}
.sw i{display:block;height:150px;border:1px solid rgba(0,0,0,.08)}
.sw b{display:block;font-size:22px;font-weight:600;margin-top:14px;line-height:1.25}
.sw em{font-style:normal;font-size:20px;color:var(--muted)}
/* grid */
.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:36px}
.cell{background:${C.photoBg};position:relative;aspect-ratio:1/1;overflow:hidden}
.cell img{width:100%;height:100%;object-fit:cover}
.cell span{position:absolute;left:16px;bottom:14px;background:${C.chalk};color:${C.ink};font-size:${story ? 34 : 28}px;font-weight:600;padding:8px 14px}
/* number */
.num{font-family:'Newsreader',Georgia,serif;font-weight:300;font-variation-settings:'opsz' 72;font-size:${story ? 560 : 480}px;line-height:.82;letter-spacing:-0.05em}
`;

const brand = (url = 'thehomelab.ie') =>
  `<div class="foot"><div class="brand">${MARK}<span>The Home Lab</span></div>${url ? `<span class="url">${esc(url)}</span>` : ''}</div>`;

function themeVars(name) {
  const t = THEMES[name] ?? THEMES.chalk;
  return `--bg:${t.bg};--fg:${t.fg};--muted:${t.muted};--accent:${t.accent};--rule:${t.rule}`;
}

const kick = (k, cls = '') => (k ? `<div class="kicker ${cls}">${fmt(k)}</div>` : '');
const head = (h, size = 'l') => (h ? `<div class="h ${size}">${fmt(h)}</div>` : '');
const bod = (b) => (b ? `<div class="body">${fmt(b)}</div>` : '');

function slideHTML(s, story) {
  const t = s.t;
  const url = s.url === undefined ? 'thehomelab.ie' : s.url;

  if (t === 'photo') {
    const top = s.pos === 'top';
    return `<div class="f" style="${themeVars('ink')}">
      <div class="ph" style="background-image:url('${img(s.img)}');background-position:${s.focus ?? '50% 50%'}"></div>
      <div class="${top ? 'scrim-t' : 'scrim-b'}"></div>
      <div class="over pad">
        ${top ? `<div>${kick(s.kicker, 'light')}${head(s.headline, s.size ?? 'l')}${bod(s.body)}</div><div class="grow"></div>` : `<div class="grow"></div><div>${kick(s.kicker, 'light')}${head(s.headline, s.size ?? 'l')}${bod(s.body)}</div><div style="height:${story ? 40 : 54}px"></div>`}
        ${brand(url)}
      </div></div>`;
  }

  if (t === 'split') {
    const ratio = s.ratio ?? 0.6;
    return `<div class="f" style="${themeVars(s.theme ?? 'chalk')}">
      <div class="media" style="height:${Math.round(ratio * 100)}%;background:${s.imgBg ?? C.photoBg}">
        <img class="${s.fit ?? 'contain'}" src="${img(s.img)}" style="object-position:${s.focus ?? '50% 50%'}${s.scale ? `;transform:scale(${s.scale})` : ''}">
      </div>
      <div class="grow pad" style="display:flex;flex-direction:column;${story ? 'padding-top:60px' : 'padding-top:54px'}">
        <div class="grow fit" data-fit>${kick(s.kicker)}${head(s.headline, s.size ?? 's')}${bod(s.body)}${s.price ? `<div class="price-tag">${esc(s.price)}</div>` : ''}</div>
        ${brand(url)}
      </div></div>`;
  }

  if (t === 'type') {
    const center = s.align === 'center';
    return `<div class="f pad" style="${themeVars(s.theme ?? 'chalk')}${s.bgPattern ? `;background-image:${riadPattern()};background-size:120px` : ''}">
      ${s.native ? `<div class="native" lang="${s.nativeLang ?? 'ja'}" style="font-size:${story ? 260 : 220}px;color:var(--accent);opacity:.9;${center ? 'text-align:center;' : ''}margin-bottom:40px">${esc(s.native)}</div>` : ''}
      <div class="grow fit" data-fit style="display:flex;flex-direction:column;justify-content:${s.valign ?? 'center'};${center ? 'text-align:center;align-items:center' : ''}">
        ${kick(s.kicker)}${head(s.headline, s.size ?? 'l')}${bod(s.body)}
      </div>
      ${brand(url)}</div>`;
  }

  if (t === 'number') {
    return `<div class="f pad" style="${themeVars(s.theme ?? 'olive')}">
      <div class="grow" style="display:flex;flex-direction:column;justify-content:center">
        ${kick(s.kicker)}<div class="num">${esc(s.number)}</div>${head(s.headline, s.size ?? 'm')}${bod(s.body)}
      </div>${brand(url)}</div>`;
  }

  if (t === 'rows') {
    const rows = s.rows
      .map((r) => `<div class="row ${r.cls ?? ''}"><span class="k">${fmt(r.k)}</span><span class="v">${fmt(r.v ?? '')}</span></div>`)
      .join('');
    return `<div class="f pad" style="${themeVars(s.theme ?? 'chalk')}">
      <div class="grow fit" data-fit style="display:flex;flex-direction:column;justify-content:center">
        ${kick(s.kicker)}${head(s.headline, s.size ?? 's')}<div class="rows">${rows}</div>${bod(s.body)}
      </div>${brand(url)}</div>`;
  }

  if (t === 'palette') {
    const sw = s.swatches.map((x) => `<div><i style="background:${x.hex}"></i><b>${esc(x.name)}</b><em>${x.hex}</em></div>`).join('');
    return `<div class="f" style="${themeVars(s.theme ?? 'chalk')}">
      <div class="media" style="height:${story ? 48 : 46}%"><img class="cover" src="${img(s.img)}" style="object-position:${s.focus ?? '50% 60%'}"></div>
      <div class="grow pad" style="display:flex;flex-direction:column;padding-top:${story ? 64 : 50}px">
        <div class="grow fit" data-fit>${kick(s.kicker)}${head(s.headline, s.size ?? 's')}<div class="sw">${sw}</div></div>${brand(url)}
      </div></div>`;
  }

  if (t === 'grid') {
    const cells = s.cells.map((c) => `<div class="cell"><img src="${img(c.img)}" style="object-position:${c.focus ?? '50% 50%'}"><span>${esc(c.label)}</span></div>`).join('');
    return `<div class="f pad" style="${themeVars(s.theme ?? 'chalk')}">
      <div class="grow fit" data-fit>${kick(s.kicker)}${head(s.headline, s.size ?? 's')}<div class="grid">${cells}</div>${bod(s.body)}</div>${brand(url)}</div>`;
  }

  if (t === 'pattern') {
    return `<div class="f" style="${themeVars('olive')};background-image:${riadPattern()};background-size:${s.tile ?? 120}px">
      <div class="pad" style="height:100%;display:flex;flex-direction:column">
        <div class="grow" style="display:flex;align-items:center;justify-content:center">
          <div style="background:${C.olive};padding:${story ? 70 : 60}px;width:100%;box-shadow:0 0 0 2px rgba(184,150,96,.6)">
            ${s.native ? `<div class="native" lang="ar" dir="rtl" style="font-family:'Amiri',serif;font-size:${story ? 190 : 160}px;color:#E5DCCB;margin-bottom:24px;text-align:left">${esc(s.native)}</div>` : ''}
            ${kick(s.kicker)}${head(s.headline, s.size ?? 'm')}${bod(s.body)}
          </div>
        </div>
        ${brand(url)}
      </div></div>`;
  }

  if (t === 'plan') {
    const W = 1000;
    const H = 700;
    const sc = (v, axis) => (axis === 'x' ? (v / 100) * W : (v / 70) * H);
    const shapes = (s.shapes ?? [])
      .map((p) => {
        const fill = p.fill ?? 'none';
        const stroke = p.stroke ?? 'var(--fg)';
        const dash = p.dash ? 'stroke-dasharray="10 8"' : '';
        const lab = p.label
          ? `<text x="${sc(p.x + (p.lx ?? (p.shape === 'circle' ? p.w / 2 : p.w / 2)), 'x')}" y="${sc(p.y + (p.ly ?? (p.shape === 'circle' ? p.h / 2 : p.h / 2)), 'y') + 8}" text-anchor="middle" font-size="${Math.round((p.fs ?? 24) * 1.45)}" font-family="Hanken Grotesk" font-weight="600" fill="${p.tc ?? 'var(--fg)'}">${esc(p.label)}</text>`
          : '';
        if (p.shape === 'circle')
          return `<ellipse cx="${sc(p.x + p.w / 2, 'x')}" cy="${sc(p.y + p.h / 2, 'y')}" rx="${sc(p.w / 2, 'x')}" ry="${sc(p.w / 2, 'x')}" fill="${fill}" stroke="${stroke}" stroke-width="4" ${dash}/>${lab}`;
        return `<rect x="${sc(p.x, 'x')}" y="${sc(p.y, 'y')}" width="${sc(p.w, 'x')}" height="${sc(p.h, 'y')}" fill="${fill}" stroke="${stroke}" stroke-width="4" ${dash}/>${lab}`;
      })
      .join('');
    return `<div class="f pad" style="${themeVars(s.theme ?? 'chalk')}">
      ${kick(s.kicker)}${head(s.headline, s.size ?? 's')}
      <div class="grow" style="display:flex;align-items:center;justify-content:center;padding:30px 0">
        <svg viewBox="-10 -10 ${W + 20} ${H + 20}" style="width:100%;height:auto;max-height:100%">${shapes}</svg>
      </div>
      ${s.body ? `<div class="body" style="margin:0 0 34px">${fmt(s.body)}</div>` : ''}
      ${brand(url)}</div>`;
  }

  throw new Error(`Unknown slide type ${t}`);
}

function page(s, size) {
  const [w, h] = SIZES[size];
  const story = size === 'story';
  return `<!doctype html><html lang="en-IE"><head><meta charset="utf-8"><style>${CSS(w, h, story)}</style></head><body>${slideHTML(s, story)}
<script>
async function fitAll(){
  await document.fonts.ready;
  for (const el of document.querySelectorAll('[data-fit]')) {
    let guard = 0;
    while (el.scrollHeight > el.clientHeight + 2 && guard++ < 30) {
      for (const t of el.querySelectorAll('.h,.body,.row,.kicker,.price-tag,.sw b')) {
        const fs = parseFloat(getComputedStyle(t).fontSize); t.style.fontSize = (fs * 0.95) + 'px';
      }
    }
  }
  document.body.dataset.ready = '1';
}
fitAll();
</script></body></html>`;
}

async function shoot(browser, s, size, file) {
  const [w, h] = SIZES[size];
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const html = join(TMP, `${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(html, page(s, size));
  await p.goto('file://' + html, { waitUntil: 'load' });
  await p.waitForSelector('body[data-ready="1"]', { timeout: 15000 });
  await p.screenshot({ path: file, type: 'jpeg', quality: 84 });
  await p.close();
  rmSync(html);
}

/** Silent reel from still frames: slow push-in on each frame, crossfades between. */
function buildReel(frames, out, secs = 2.6, fade = 0.45) {
  const fps = 30;
  const args = ['-y', '-loglevel', 'error'];
  frames.forEach((f) => args.push('-loop', '1', '-t', String(secs + fade), '-framerate', String(fps), '-i', f));
  const n = Math.round((secs + fade) * fps);
  const parts = frames.map(
    (_, i) =>
      `[${i}:v]scale=2160:3840,zoompan=z='1+0.035*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=${fps},setsar=1,format=yuv420p[v${i}]`,
  );
  let last = 'v0';
  let offset = 0;
  for (let i = 1; i < frames.length; i++) {
    offset += secs;
    const o = i === frames.length - 1 ? 'vout' : `x${i}`;
    parts.push(`[${last}][v${i}]xfade=transition=fade:duration=${fade}:offset=${offset.toFixed(2)}[${o}]`);
    last = o;
  }
  args.push('-filter_complex', parts.join(';'), '-map', `[${frames.length > 1 ? 'vout' : 'v0'}]`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
}

const pad = (n) => String(n).padStart(2, '0');

async function main() {
  const only = process.argv.slice(2).map(Number).filter(Boolean);
  const posts = only.length ? POSTS.filter((p) => only.includes(p.n)) : POSTS;
  mkdirSync(TMP, { recursive: true });
  const browser = await chromium.launch();
  for (const post of posts) {
    const dir = join(OUT, `post-${pad(post.n)}`);
    if (existsSync(dir)) rmSync(dir, { recursive: true });
    mkdirSync(dir, { recursive: true });
    const size = post.size;
    const files = [];
    for (let i = 0; i < post.slides.length; i++) {
      const f = join(dir, `${post.format === 'Reel' ? 'frame' : 'slide'}-${pad(i + 1)}.jpg`);
      await shoot(browser, post.slides[i], size, f);
      files.push(f);
      if (post.slides[i].alt) await shoot(browser, post.slides[i].alt, size, f.replace('.jpg', '-alt.jpg'));
    }
    for (const v of post.variants ?? []) {
      for (let i = 0; i < post.slides.length; i++) {
        await shoot(browser, post.slides[i], v, join(dir, `${v}-${pad(i + 1)}.jpg`));
        if (post.slides[i].alt) await shoot(browser, post.slides[i].alt, v, join(dir, `${v}-${pad(i + 1)}-alt.jpg`));
      }
    }
    if (post.format === 'Reel') buildReel(files, join(dir, 'reel.mp4'), post.secs ?? 2.6);
    console.log(`post ${pad(post.n)}  ${post.format.padEnd(8)} ${files.length} image(s)`);
  }
  await browser.close();
  rmSync(TMP, { recursive: true, force: true });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
