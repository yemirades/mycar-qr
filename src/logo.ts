// Logo registry. Each brand defines its paths + bounding box in its native
// coordinate space. The plugin scales and centers it into the QR clear zone.
//
// Adding a new brand: append a LogoSpec to LOGOS with paths, bbox, and
// ratio defaults. No other files need to change beyond presets.ts.

export type LogoFillKey = 'body' | 'smile';

export interface LogoPath {
  d: string;
  fillKey: LogoFillKey;
}

export interface LogoSpec {
  id: string;
  paths: LogoPath[];
  // Bounding box of all paths in the logo's native coordinate space.
  // The plugin uses this to scale & center the logo into the QR.
  bbox: { x: number; y: number; w: number; h: number };
}

// --- Mycar ---
// Source: 60×60 viewBox SVG — rounded square with a smile cutout.
const MYCAR: LogoSpec = {
  id: 'mycar',
  paths: [
    {
      fillKey: 'body',
      d: 'M39.0878 0H20.9122C14.8709 0 11.8761 0 8.62306 1.0327C5.06024 2.32357 2.27194 5.11188 1.0327 8.62306C0 11.8761 0 14.8709 0 20.9122V39.0878C0 45.1291 0 48.1239 1.0327 51.3769C2.32357 54.9397 5.11188 57.7281 8.62306 58.9673C11.8761 60 14.8709 60 20.9122 60H39.0878C45.1291 60 48.1239 60 51.3769 58.9673C54.9397 57.6764 57.7281 54.8881 58.9673 51.3769C60 48.1239 60 45.1291 60 39.0878V20.9122C60 14.8709 60 11.8761 58.9673 8.62306C57.6764 5.06024 54.8881 2.27194 51.3769 1.0327C48.1239 0 45.1291 0 39.0878 0Z',
    },
    {
      fillKey: 'smile',
      d: 'M47.5047 36.5593V21.7401C36.6613 28.6592 23.3395 28.6592 12.4961 21.7401V36.5593C23.3395 43.4784 36.6613 43.4784 47.5047 36.5593Z',
    },
  ],
  bbox: { x: 0, y: 0, w: 60, h: 60 },
};

// --- Autocheck ---
// Source: reference Autocheck QR. Wordmark + check, all in one fill color.
// bbox extracted from the original SVG (paths use absolute coordinates).
const AUTOCHECK: LogoSpec = {
  id: 'autocheck',
  paths: [
    {
      fillKey: 'body',
      d: 'M271.507 212.463C270.864 211.91 270.241 211.509 269.297 211.509C259.103 211.559 248.909 211.559 238.705 211.579C238.063 211.579 237.41 211.599 236.777 211.72C232.057 212.603 227.397 213.718 222.817 215.084C220.437 215.797 218.077 216.561 215.726 217.414C200.33 222.978 185.818 230.36 171.998 239.098C171.144 239.64 170.311 239.901 169.276 239.901C167.207 239.871 165.158 239.881 163.09 239.881H156.903C156.089 239.881 155.758 240.062 155.808 240.956C155.889 242.522 156.019 244.139 155.788 245.676C155.276 249.091 156.29 251.602 159.484 253.098C159.524 253.118 159.554 253.158 159.594 253.178C160.358 253.59 160.428 254.092 159.966 254.856C158.711 256.904 157.556 259.024 156.34 261.092C156.059 261.575 155.828 262.057 155.828 262.649C155.848 267.38 155.858 272.11 155.848 276.84C155.848 277.383 155.929 277.674 156.592 277.674C160.087 277.654 163.592 277.644 167.107 277.644C168.804 278.287 173.394 279.482 174.057 280.185C174.358 280.496 174.951 282.615 175.312 283.298C183.407 299.066 203.725 299.92 214.903 286.723C216.148 285.257 217.303 282.234 219.382 282.234L240.764 282.314L229.606 266.747L211.619 241.558H225.77L248.056 261.504L249.221 262.579L251.621 264.778L286.773 225.579C281.701 221.201 276.589 216.852 271.507 212.473L271.527 212.453L271.507 212.463ZM196.956 287.205C178.385 288.3 175.975 260.078 194.133 257.999C215.003 255.599 216.44 286.08 196.956 287.205Z',
    },
    {
      fillKey: 'body',
      d: 'M332.57 237.35C331.736 236.858 328.051 235.763 327.096 235.763H312.946L333.213 202.088H320.829L320.679 202.279L320.367 202.008L296.987 233.433L296.605 233.996C296.605 233.996 296.605 233.976 296.585 233.976L292.769 239.078L291.774 240.383H291.794L275.655 262.016L260.469 282.334L290.609 282.445C292.136 282.686 293.632 286 294.727 287.295C305.132 299.759 324.013 298.092 332.821 284.775C333.625 283.559 334.087 282.123 334.79 280.938H350.698L351.703 278.538L356.322 267.44V250.969L332.56 237.3L332.57 237.35ZM311.489 286.954C294.556 285.437 294.335 259.666 311.288 257.748C332.741 255.318 333.032 288.892 311.489 286.954Z',
    },
  ],
  bbox: { x: 155.78, y: 155.28, w: 200.55, h: 195.42 },
  // bbox spans all path control points in the source SVG (extracted from
  // reference Autocheck QR at container coords). buildLogoGroup re-centers.
};

export const LOGOS: Record<string, LogoSpec> = {
  mycar: MYCAR,
  autocheck: AUTOCHECK,
};

/**
 * Build a <g> group that draws the given logo, scaled so its width equals
 * (qrSize * ratio), centered on the QR.
 */
export function buildLogoGroup(
  logo: LogoSpec,
  qrSize: number,
  ratio: number,
  bodyColor: string,
  smileColor: string
): string {
  const targetW = qrSize * ratio;
  const scale = targetW / logo.bbox.w;
  const scaledH = logo.bbox.h * scale;

  // Center the scaled bbox in the QR.
  // After scaling, the logo's bbox origin (logo.bbox.x, logo.bbox.y) lands at:
  //   (translateX + logo.bbox.x * scale, translateY + logo.bbox.y * scale)
  // We want it centered, so:
  //   translateX = (qrSize - targetW)/2 - logo.bbox.x * scale
  //   translateY = (qrSize - scaledH)/2 - logo.bbox.y * scale
  const tx = (qrSize - targetW) / 2 - logo.bbox.x * scale;
  const ty = (qrSize - scaledH) / 2 - logo.bbox.y * scale;

  const pathsSvg = logo.paths
    .map((p) => {
      const fill = p.fillKey === 'body' ? bodyColor : smileColor;
      return `<path d="${p.d}" fill="${fill}"/>`;
    })
    .join('');

  return `<g transform="translate(${tx} ${ty}) scale(${scale})">${pathsSvg}</g>`;
}
