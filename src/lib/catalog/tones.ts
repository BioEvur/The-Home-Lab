/**
 * Material / colour tones used by the development catalogue.
 * `swatch` drives colour swatches and filters.
 */
export interface ToneSpec {
  family: string;
  swatch: string;
  fill: string;
  shade: string;
  light: string;
}

export const TONES: Record<string, ToneSpec> = {
  oak: { family: 'Natural wood', swatch: '#C49A6C', fill: '#C9A27A', shade: '#A9825B', light: '#DABB98' },
  'smoked-oak': { family: 'Dark wood', swatch: '#7A5B42', fill: '#85654A', shade: '#654B36', light: '#9C7D60' },
  walnut: { family: 'Dark wood', swatch: '#5E4232', fill: '#6A4B39', shade: '#4F372A', light: '#82624E' },
  black: { family: 'Black & charcoal', swatch: '#232523', fill: '#2A2C2A', shade: '#171918', light: '#454845' },
  charcoal: { family: 'Black & charcoal', swatch: '#3A3C3A', fill: '#434643', shade: '#2E302E', light: '#5B5E5A' },
  graphite: { family: 'Black & charcoal', swatch: '#4A4C4A', fill: '#555855', shade: '#3E403E', light: '#6E716D' },
  chalk: { family: 'White & chalk', swatch: '#F3F0E9', fill: '#F2EFE8', shade: '#D9D4C8', light: '#FBFAF6' },
  opal: { family: 'White & chalk', swatch: '#F4F1EA', fill: '#F6F3EC', shade: '#DED8CB', light: '#FFFFFF' },
  olive: { family: 'Green', swatch: '#59634D', fill: '#5E6852', shade: '#48503D', light: '#78826B' },
  moss: { family: 'Green', swatch: '#6E7458', fill: '#737A5D', shade: '#5A6047', light: '#8B9275' },
  clay: { family: 'Terracotta', swatch: '#B96E50', fill: '#BC7356', shade: '#9C5B41', light: '#CF8E72' },
  rust: { family: 'Terracotta', swatch: '#A65A3D', fill: '#A95F42', shade: '#8A4A31', light: '#C17A5C' },
  stone: { family: 'Neutral', swatch: '#D8D5CD', fill: '#D3CFC5', shade: '#B8B3A7', light: '#E4E1DA' },
  oat: { family: 'Neutral', swatch: '#D9CDB8', fill: '#D6CAB4', shade: '#BCAF97', light: '#E6DDCD' },
  linen: { family: 'Neutral', swatch: '#E3DACB', fill: '#DFD5C4', shade: '#C7BCA8', light: '#ECE5D9' },
  travertine: { family: 'Neutral', swatch: '#D9CBB2', fill: '#D5C6AB', shade: '#BBAB8E', light: '#E5D9C4' },
  brass: { family: 'Brass', swatch: '#B89660', fill: '#BC9A62', shade: '#987A48', light: '#D4B784' },
  'clear-glass': { family: 'Clear & smoke glass', swatch: '#DDE3DF', fill: '#D5DDD8', shade: '#B4C0B9', light: '#F2F5F3' },
  'smoke-glass': { family: 'Clear & smoke glass', swatch: '#8F8C84', fill: '#9A968D', shade: '#77746C', light: '#B4B0A7' },
};

export const COLOUR_FAMILY_SWATCHES: Record<string, string> = Object.values(TONES).reduce(
  (acc, tone) => {
    if (!acc[tone.family]) acc[tone.family] = tone.swatch;
    return acc;
  },
  {} as Record<string, string>,
);
