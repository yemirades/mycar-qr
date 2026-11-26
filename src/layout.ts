// Single source of truth for FRAME dimensions.
// Reference: Mycar_QR512.svg — container 512px, padding 24px → QR 464px.
// Logo sizing and clear-zone radius live PER-PRESET in presets.ts because
// they vary by brand (Mycar logo is small, Autocheck is ~2x larger).

export const FRAME_PADDING = 24;
export const FRAME_RADIUS = 48;
export const DEFAULT_CONTAINER = 512;

export function qrSizeFromContainer(container: number): number {
  return container - FRAME_PADDING * 2;
}
