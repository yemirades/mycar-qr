# Mycar QR — Figma Plugin

Generates branded QR codes matching Mycar's visual identity directly inside Figma. No backend, no shortener — outputs editable SVG vectors with the Mycar logo embedded as native paths.

## Style
- Round dots (data modules)
- Extra-rounded corner squares with circular centers
- Mycar logo in the center as a **native vector** (21% of QR size, matches reference)
- Error correction `H` for logo-safe scanning

## Presets
| ID | Use |
|---|---|
| `Default` | Black on white — print, marketing, default |
| `Inverse` | White on black — dark backgrounds, night campaigns |

## Why the logo is injected as vector (not raster)
`qr-code-styling` embeds a center logo as a base64 `<image>`. But `figma.createNodeFromSvg()` does **not** render raster `<image>` elements — so the logo would vanish on insert while still appearing in the browser preview.

The fix: the plugin reserves a clear zone via a transparent placeholder, then post-processes the SVG to strip the `<image>` and inject the Mycar logo as real `<path>` vectors. Result: logo always appears, fully editable in Figma, perfectly sized.

## Build

```bash
npm install
npm run build
```

Outputs `dist/code.js` and `dist/ui.html`.

## Install in Figma

1. Figma → menu ☰ → **Plugins → Development → Import plugin from manifest**
2. Select `manifest.json`
3. Run from **Plugins → Development → Mycar QR**

## Output
Inserts the QR as a single native Figma vector node (editable, scalable, exportable to PNG/PDF/SVG). No wrapper frame, no caption.

## Tuning
All logo sizing/colors live in `src/presets.ts`:
- `logoRatio: 0.21` — logo width as fraction of QR. Larger = harder to scan.
- `logoColors` — `body` and `smile` fill per preset.

## v2 ideas
- Batch mode (CSV → multiple QRs)
- Variant: QR + Mycar wordmark lockup
- Banner-size frame templates (auto-insert into 1080×1080 / 1080×1920)

## Web version

Standalone page with the same brand styles, built from the same logo and QR code (`web/`). Content types: link, text, Wi-Fi, e-mail, contact (vCard). Styles: Mycar / Autocheck presets, brand colors and gradients, module and marker shapes, logo on/off, transparent background, PNG (up to 4096 px) / SVG export. Everything runs in the browser.

```bash
npm install
npm run dev:web     # http://localhost:5173 with live rebuild
npm run build:web   # outputs dist-web/
```

Deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.
