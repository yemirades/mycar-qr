import { LOGOS, LogoSpec } from './logo';

export interface LogoColors {
  body: string;
  smile: string;
}

export type PresetId =
  | 'mycar-default'
  | 'mycar-inverse'
  | 'autocheck-default'
  | 'autocheck-inverse';

export interface Preset {
  id: PresetId;
  label: string;
  description: string;
  logo: LogoSpec;
  logoRatio: number; // logo width / QR width
  clearShape: 'circle' | 'rect'; // shape of the empty center zone
  clearWidthRatio: number;  // clear zone width (rect) or diameter (circle) / QR
  clearHeightRatio: number; // clear zone height / QR (ignored for circle)
  logoColors: LogoColors;
  bgColor: string;
  build: (data: string, size: number) => any;
}

// QR generation is IDENTICAL for all brands — same error correction, same
// auto-version selection. The QR pattern, dot size, and density must not
// change between logos. Only the clear-zone (empty center region) differs.
const qrOptions = {
  errorCorrectionLevel: 'H' as const,
  typeNumber: 0 as const, // auto
};

// Brand-specific sizing.
// Mycar: square icon, compact — reference Mycar_QR512 → 104/464 = 0.224
// Autocheck: wordmark + check — 188/464 = 0.405 (width, height proportional)
const MYCAR_LOGO_RATIO = 0.2241;
// Clear-zone per brand.
// Mycar:     CIRCLE, radius 16% (74px on 464) — the released Figma version.
// Autocheck: RECT 208×110 — horizontal zone covering wordmark + check.
const MYCAR_CLEAR_W = 0.32; // circle diameter = 2*0.16 = 0.32 → 74px radius
const MYCAR_CLEAR_H = 0.32;

const AUTOCHECK_LOGO_RATIO = 0.405; // 188/464 — width; height stays proportional (~183px)
const AUTOCHECK_CLEAR_W = 0.448;
const AUTOCHECK_CLEAR_H = 0.237;

export const PRESETS: Record<PresetId, Preset> = {
  'mycar-default': {
    id: 'mycar-default',
    label: 'Mycar Default',
    description: 'Black on white',
    logo: LOGOS.mycar,
    logoRatio: MYCAR_LOGO_RATIO,
    clearShape: 'circle',
    clearWidthRatio: MYCAR_CLEAR_W,
    clearHeightRatio: MYCAR_CLEAR_H,
    logoColors: { body: '#000000', smile: '#FFFFFF' },
    bgColor: '#FFFFFF',
    build: (data, size) => ({
      width: size,
      height: size,
      type: 'svg',
      data,
      qrOptions,
      dotsOptions: { type: 'dots', color: '#000000' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#000000' },
      cornersDotOptions: { type: 'dot', color: '#000000' },
      backgroundOptions: { color: '#FFFFFF' },
    }),
  },

  'mycar-inverse': {
    id: 'mycar-inverse',
    label: 'Mycar Inverse',
    description: 'White on black',
    logo: LOGOS.mycar,
    logoRatio: MYCAR_LOGO_RATIO,
    clearShape: 'circle',
    clearWidthRatio: MYCAR_CLEAR_W,
    clearHeightRatio: MYCAR_CLEAR_H,
    logoColors: { body: '#FFFFFF', smile: '#000000' },
    bgColor: '#000000',
    build: (data, size) => ({
      width: size,
      height: size,
      type: 'svg',
      data,
      qrOptions,
      dotsOptions: { type: 'dots', color: '#FFFFFF' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#FFFFFF' },
      cornersDotOptions: { type: 'dot', color: '#FFFFFF' },
      backgroundOptions: { color: '#000000' },
    }),
  },

  'autocheck-default': {
    id: 'autocheck-default',
    label: 'Autocheck Default',
    description: 'Black on white',
    logo: LOGOS.autocheck,
    logoRatio: AUTOCHECK_LOGO_RATIO,
    clearShape: 'rect',
    clearWidthRatio: AUTOCHECK_CLEAR_W,
    clearHeightRatio: AUTOCHECK_CLEAR_H,
    logoColors: { body: '#000000', smile: '#FFFFFF' },
    bgColor: '#FFFFFF',
    build: (data, size) => ({
      width: size,
      height: size,
      type: 'svg',
      data,
      qrOptions,
      dotsOptions: { type: 'dots', color: '#000000' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#000000' },
      cornersDotOptions: { type: 'dot', color: '#000000' },
      backgroundOptions: { color: '#FFFFFF' },
    }),
  },

  'autocheck-inverse': {
    id: 'autocheck-inverse',
    label: 'Autocheck Inverse',
    description: 'White on black',
    logo: LOGOS.autocheck,
    logoRatio: AUTOCHECK_LOGO_RATIO,
    clearShape: 'rect',
    clearWidthRatio: AUTOCHECK_CLEAR_W,
    clearHeightRatio: AUTOCHECK_CLEAR_H,
    logoColors: { body: '#FFFFFF', smile: '#000000' },
    bgColor: '#000000',
    build: (data, size) => ({
      width: size,
      height: size,
      type: 'svg',
      data,
      qrOptions,
      dotsOptions: { type: 'dots', color: '#FFFFFF' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#FFFFFF' },
      cornersDotOptions: { type: 'dot', color: '#FFFFFF' },
      backgroundOptions: { color: '#000000' },
    }),
  },
};

export const DEFAULT_PRESET: PresetId = 'mycar-default';
