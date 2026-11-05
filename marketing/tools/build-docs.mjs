/**
 * Writes the post guide (marketing/02-social-posts.md) and the scheduler
 * import (marketing/social-calendar.csv) from posts.mjs.
 *
 *   node marketing/tools/build-docs.mjs
 */
import { writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { POSTS } from './posts.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const MKT = resolve(HERE, '..');
const SITE = 'https://thehomelab.ie';

const pad = (n) => String(n).padStart(2, '0');
const day = (iso) =>
  new Intl.DateTimeFormat('en-IE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
const phase = (iso) => (iso <= '2026-11-17' ? 'xmas-batch' : iso <= '2026-12-24' ? 'gifting' : 'new-year');
const PHASE_NAME = { 'xmas-batch': 'Phase 1: the Christmas batch', gifting: 'Phase 2: gifting season', 'new-year': 'Phase 3: new year and Riad Corner' };

const network = (p) => (p.startsWith('Instagram') ? 'instagram' : p.startsWith('Facebook') ? 'facebook' : p.toLowerCase());
const utm = (post, net) =>
  `${SITE}${post.link}${post.link.includes('?') ? '&' : '?'}utm_source=${net}&utm_medium=social&utm_campaign=${phase(post.date)}&utm_content=post-${pad(post.n)}`;

const files = (post) => {
  const dir = join(MKT, 'creatives', `post-${pad(post.n)}`);
  return existsSync(dir) ? readdirSync(dir).sort().map((f) => `creatives/post-${pad(post.n)}/${f}`) : [];
};
const mainFiles = (post) => files(post).filter((f) => /\/(slide|frame)-\d\d\.jpg$/.test(f) || f.endsWith('.mp4'));
const storyFiles = (post) => files(post).filter((f) => /\/story-\d\d\.jpg$/.test(f));
const altFiles = (post) => files(post).filter((f) => /-alt\.jpg$/.test(f));

const slideText = (s) => [s.kicker, s.headline, s.body].filter(Boolean).join(' / ').replace(/\*\*/g, '');
const tagLine = (post) => post.hashtags.join(' ');

/** The caption as it should be pasted on each network. */
function captionFor(post, net, alternate = false) {
  let c = alternate && post.altCaption ? post.altCaption : post.caption;
  const link = utm(post, net);
  if (net === 'facebook') {
    c = c.includes('Link in bio') ? c.replace(/Link in bio\.?/g, link) : `${c}\n\n${link}`;
  } else if (net === 'pinterest') {
    c = c.replace(/\s*Link in bio\.?/g, '');
  } else if (!/Link in bio/.test(c) && net === 'instagram') {
    c = `${c}\n\nLink in bio.`;
  }
  if (post.hashtags.length && net !== 'pinterest') c = `${c}\n\n${tagLine(post)}`;
  return c;
}

/* ───────────── Markdown ───────────── */
const md = [];
md.push(`# The first 50 posts

The first 50 social posts for The Home Lab, from launch on Friday 6 November 2026 to 21 January 2027. Every post has a finished creative in \`creatives/\`, made only from the supplier photos of the actual pieces, the brand fonts and the brand colours. Nobody needs to be on camera, record a voice or hold a sample.

This file and \`social-calendar.csv\` are generated from \`tools/posts.mjs\`. To change a post, edit it there and run:

\`\`\`bash
node marketing/tools/render.mjs && node marketing/tools/build-docs.mjs
\`\`\`

## How to post these

- **Carousels and statics**: upload the slides in order. Sizes are 1080 × 1350 (4:5) for the feed, 1080 × 1920 for Stories and 1000 × 1500 for Pinterest.
- **Reels**: upload \`reel.mp4\`. It is silent on purpose: add the music in the Instagram or TikTok app from the **commercial music library** (business accounts cannot use the general library, and ads cannot use trending songs). Use \`frame-01.jpg\` as the cover. The frames are also there if you would rather build the reel yourself in CapCut or Canva.
- **Captions**: the CSV has each caption ready per network. Instagram says "Link in bio"; Facebook gets the tracked link instead; Pinterest gets the description and the link in its own field.
- **Hashtags**: three to five per post. Instagram now limits posts to five.
- **Alt text**: paste the alt text into the accessibility setting on each post (Instagram: Advanced settings, Accessibility).
- **Links**: every link carries UTM tags so you can see in Shopify and Google Analytics which post sold what.
- **Posts marked "Depends on"** need a decision first (a second Christmas batch, e-gift cards or member accounts). Each has a finished alternate creative (\`-alt.jpg\`) and caption, so it can go out either way.
- **Shift the dates** if launch slips, but keep the deadline posts (8, 13, 14, 28) on their dates.

## The calendar

| # | Date | Time | Format | Where | Headline | Set | Ad? |
| --- | --- | --- | --- | --- | --- | --- | --- |
`);
for (const p of POSTS) {
  md.push(`| ${pad(p.n)} | ${day(p.date)} | ${p.time} | ${p.format} | ${p.platforms.join(', ')} | [${p.headline}](#post-${pad(p.n)}) | ${p.set} | ${p.boost.startsWith('Yes') ? 'Yes' : p.boost.startsWith('Optional') ? 'Optional' : 'No'} |\n`);
}
md.push(`
Formats: ${POSTS.filter((p) => p.format === 'Carousel').length} carousels, ${POSTS.filter((p) => p.format === 'Reel').length} reels, ${POSTS.filter((p) => p.format === 'Static').length} single images and ${POSTS.filter((p) => p.format === 'Pin').length} Pinterest pins, plus Story versions of ${POSTS.filter((p) => p.variants?.includes('story')).length} posts.
`);

let lastPhase = '';
for (const p of POSTS) {
  const ph = phase(p.date);
  if (ph !== lastPhase) {
    md.push(`\n## ${PHASE_NAME[ph]}\n`);
    lastPhase = ph;
  }
  const main = mainFiles(p);
  const imgs = main.filter((f) => f.endsWith('.jpg'));
  const width = p.size === 'story' ? 120 : 150;
  md.push(`\n<a id="post-${pad(p.n)}"></a>\n### ${pad(p.n)} · ${day(p.date)} · ${p.format} · ${p.headline}\n\n`);
  md.push(`<p>${imgs.map((f) => `<img src="${f}" width="${width}" alt="">`).join(' ')}</p>\n\n`);
  md.push(`| | |\n| --- | --- |\n`);
  md.push(`| **Post** | ${day(p.date)} ${p.date.slice(0, 4)}, ${p.time} Irish time |\n`);
  md.push(`| **Where** | ${p.platforms.join(', ')} |\n`);
  md.push(`| **Pillar** | ${p.pillar} |\n`);
  md.push(`| **Set** | ${p.set} |\n`);
  md.push(`| **Links to** | \`${p.link}\` |\n`);
  md.push(`| **Creative** | ${main.map((f) => `[${f.split('/').pop()}](${f})`).join(', ')} |\n`);
  const st = storyFiles(p);
  if (st.length) md.push(`| **Story version** | ${st.map((f) => `[${f.split('/').pop()}](${f})`).join(', ')} |\n`);
  const al = altFiles(p);
  if (al.length) md.push(`| **Alternate** | ${al.map((f) => `[${f.split('/').pop()}](${f})`).join(', ')} |\n`);
  if (p.audio) md.push(`| **Audio** | ${p.audio} |\n`);
  if (p.board) md.push(`| **Pinterest board** | ${p.board} |\n`);
  md.push(`| **Paid** | ${p.boost} |\n`);
  if (p.depends) md.push(`| **Depends on** | ${p.depends} |\n`);
  md.push(`\n**Headline:** ${p.headline}\n\n`);
  if (p.pinTitle) md.push(`**Pin title:** ${p.pinTitle}\n\n`);
  md.push(`**On the creative, ${p.format === 'Reel' ? 'frame' : 'slide'} by ${p.format === 'Reel' ? 'frame' : 'slide'}:**\n\n`);
  p.slides.forEach((s, i) => {
    md.push(`${i + 1}. ${slideText(s)}${s.alt ? ` *(alternate: ${slideText(s.alt)})*` : ''}\n`);
  });
  md.push(`\n**Caption:**\n\n\`\`\`text\n${p.caption}${p.hashtags.length ? `\n\n${tagLine(p)}` : ''}\n\`\`\`\n`);
  if (p.altCaption) md.push(`\n**Alternate caption** (if the dependency is not in place):\n\n\`\`\`text\n${p.altCaption}${p.hashtags.length ? `\n\n${tagLine(p)}` : ''}\n\`\`\`\n`);
  md.push(`\n**Alt text:** ${p.alt}\n\n`);
  md.push(`**How it is made:** ${p.brief}\n`);
}
writeFileSync(join(MKT, '02-social-posts.md'), md.join(''));

/* ───────────── CSV ───────────── */
const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const rows = [['post', 'date', 'time', 'network', 'placement', 'format', 'headline', 'caption', 'link', 'media', 'alt_text', 'paid', 'depends_on', 'alternate_caption', 'alternate_media']];
for (const p of POSTS) {
  for (const placement of p.platforms) {
    const net = network(placement);
    const isStory = placement === 'Instagram Stories';
    const media = isStory && storyFiles(p).length ? storyFiles(p) : mainFiles(p);
    const alt = altFiles(p).filter((f) => (isStory ? f.includes('/story-') : !f.includes('/story-')));
    rows.push([
      pad(p.n),
      p.date,
      p.time,
      net,
      placement,
      p.format,
      p.headline,
      captionFor(p, net),
      utm(p, net),
      media.map((f) => `marketing/${f}`).join('; '),
      p.alt,
      p.boost,
      p.depends ?? '',
      p.altCaption ? captionFor(p, net, true) : '',
      alt.map((f) => `marketing/${f}`).join('; '),
    ]);
  }
}
writeFileSync(join(MKT, 'social-calendar.csv'), rows.map((r) => r.map(q).join(',')).join('\n') + '\n');
console.log(`Wrote 02-social-posts.md and social-calendar.csv (${rows.length - 1} rows).`);
