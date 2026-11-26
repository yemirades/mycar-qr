import QRCodeStyling from 'qr-code-styling';
import { PRESETS, PresetId } from './presets';
import { buildLogoGroup } from './logo';
import { DEFAULT_CONTAINER, qrSizeFromContainer } from './layout';

// State decomposed into orthogonal axes: logo brand × color style.
// The active preset is computed as `${brand}-${style}`.
type Brand = 'mycar' | 'autocheck';
type Style = 'default' | 'inverse';

const BRANDS: { id: Brand; label: string }[] = [
  { id: 'mycar', label: 'Mycar' },
  { id: 'autocheck', label: 'Autocheck' },
];
const STYLES: { id: Style; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'inverse', label: 'Inverse' },
];

let currentBrand: Brand = 'mycar';
let currentStyle: Style = 'default';
let currentContainer = DEFAULT_CONTAINER;
let currentUrl = 'https://mycar.kz';

function currentPresetId(): PresetId {
  return `${currentBrand}-${currentStyle}` as PresetId;
}

// Elements
const urlInput = document.getElementById('url') as HTMLInputElement;
const sizeInput = document.getElementById('size') as HTMLInputElement;
const logosBar = document.getElementById('logos') as HTMLDivElement;
const stylesBar = document.getElementById('styles') as HTMLDivElement;
const previewEl = document.getElementById('preview') as HTMLDivElement;
const insertBtn = document.getElementById('insert') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancel') as HTMLButtonElement;

// Build segmented controls
function buildSegment<T extends string>(
  container: HTMLElement,
  items: { id: T; label: string }[],
  getActive: () => T,
  setActive: (id: T) => void
) {
  container.innerHTML = '';
  items.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'seg-btn';
    btn.dataset.id = item.id;
    btn.textContent = item.label;
    if (item.id === getActive()) btn.classList.add('active');
    btn.addEventListener('click', () => {
      setActive(item.id);
      Array.from(container.querySelectorAll('.seg-btn')).forEach((el) =>
        el.classList.toggle('active', (el as HTMLElement).dataset.id === item.id)
      );
      render();
    });
    container.appendChild(btn);
  });
}

buildSegment(
  logosBar,
  BRANDS,
  () => currentBrand,
  (id) => {
    currentBrand = id;
  }
);
buildSegment(
  stylesBar,
  STYLES,
  () => currentStyle,
  (id) => {
    currentStyle = id;
  }
);

// Inputs
urlInput.value = currentUrl;
sizeInput.value = String(currentContainer);

urlInput.addEventListener('input', () => {
  currentUrl = urlInput.value.trim() || 'https://mycar.kz';
  render();
});

sizeInput.addEventListener('change', () => {
  const v = parseInt(sizeInput.value, 10);
  currentContainer = Math.min(2048, Math.max(160, isNaN(v) ? DEFAULT_CONTAINER : v));
  sizeInput.value = String(currentContainer);
});

/**
 * Strip the transparent placeholder <image>, remove any QR dot whose center
 * sits inside a rectangle around the QR center (the clear-zone), then inject
 * the logo as native vector paths.
 *
 * Clear-zone is rectangular because some logos are horizontal (Autocheck:
 * wordmark + check) and need a wider-than-tall empty region.
 * Dimensions are set per-preset via clearWidthRatio / clearHeightRatio.
 */
function injectLogo(svgString: string, qrSize: number, presetId: PresetId): string {
  const preset = PRESETS[presetId];

  // Remove placeholder <image> (legacy safety)
  let cleaned = svgString
    .replace(/<image[\s\S]*?\/>/g, '')
    .replace(/<image[\s\S]*?<\/image>/g, '');

  const cx = qrSize / 2;
  const cy = qrSize / 2;
  const halfW = (qrSize * preset.clearWidthRatio) / 2;
  const halfH = (qrSize * preset.clearHeightRatio) / 2;

  const isUnderLogo = (x: number, y: number): boolean => {
    if (preset.clearShape === 'circle') {
      // halfW is the circle radius (clearWidthRatio = diameter / QR)
      const dx = x - cx;
      const dy = y - cy;
      return dx * dx + dy * dy < halfW * halfW;
    }
    // rect
    return Math.abs(x - cx) < halfW && Math.abs(y - cy) < halfH;
  };

  try {
    const doc = new DOMParser().parseFromString(cleaned, 'image/svg+xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('SVG parse error');
    }
    const svgEl = doc.querySelector('svg');
    if (svgEl) {
      // <circle> dots
      Array.from(svgEl.querySelectorAll('circle')).forEach((c) => {
        const x = parseFloat(c.getAttribute('cx') || '0');
        const y = parseFloat(c.getAttribute('cy') || '0');
        if (isUnderLogo(x, y)) c.remove();
      });

      // <rect> dots (skip the QR background rect)
      Array.from(svgEl.querySelectorAll('rect')).forEach((r) => {
        const x = parseFloat(r.getAttribute('x') || 'NaN');
        const y = parseFloat(r.getAttribute('y') || 'NaN');
        const w = parseFloat(r.getAttribute('width') || '0');
        const h = parseFloat(r.getAttribute('height') || '0');
        if (isNaN(x) || isNaN(y)) return;
        if (w >= qrSize * 0.9 && h >= qrSize * 0.9) return;
        if (isUnderLogo(x + w / 2, y + h / 2)) r.remove();
      });

      // <path> dots — short paths only (long paths are structural)
      Array.from(svgEl.querySelectorAll('path')).forEach((p) => {
        const d = p.getAttribute('d') || '';
        if (d.length === 0 || d.length > 250) return;
        const m = /^M\s*([\d.]+)[\s,]+([\d.]+)/.exec(d.trim());
        if (!m) return;
        // M-coord is roughly leftmost point on the dot circle; offset by ~5
        const x = parseFloat(m[1]) + 5;
        const y = parseFloat(m[2]);
        if (isUnderLogo(x, y)) p.remove();
      });

      // <mask> blocks — qr-code-styling sometimes emits dots as mask+rect pairs.
      // Remove the mask and any element referencing it.
      Array.from(svgEl.querySelectorAll('mask')).forEach((mask) => {
        const inner = mask.querySelector('path, circle, rect');
        if (!inner) return;
        let x = 0, y = 0;
        const tag = inner.tagName.toLowerCase();
        if (tag === 'circle') {
          x = parseFloat(inner.getAttribute('cx') || '0');
          y = parseFloat(inner.getAttribute('cy') || '0');
        } else if (tag === 'rect') {
          x = parseFloat(inner.getAttribute('x') || '0') +
              parseFloat(inner.getAttribute('width') || '0') / 2;
          y = parseFloat(inner.getAttribute('y') || '0') +
              parseFloat(inner.getAttribute('height') || '0') / 2;
        } else {
          const d = inner.getAttribute('d') || '';
          if (d.length > 250) return;
          const mm = /^M\s*([\d.]+)[\s,]+([\d.]+)/.exec(d.trim());
          if (!mm) return;
          x = parseFloat(mm[1]) + 5;
          y = parseFloat(mm[2]);
        }
        if (isUnderLogo(x, y)) {
          const id = mask.getAttribute('id');
          if (id) {
            svgEl.querySelectorAll(`[mask="url(#${id})"]`).forEach((r) => r.remove());
          }
          mask.remove();
        }
      });

      cleaned = new XMLSerializer().serializeToString(svgEl);
    }
  } catch (e) {
    console.warn('dot-clearing skipped:', e);
  }

  // Inject the logo group before </svg>
  const logoGroup = buildLogoGroup(
    preset.logo,
    qrSize,
    preset.logoRatio,
    preset.logoColors.body,
    preset.logoColors.smile
  );
  cleaned = cleaned.replace(/<\/svg>\s*$/, logoGroup + '</svg>');
  return cleaned;
}

// Preview — render QR at a fixed preview QR size
let qr: QRCodeStyling | null = null;
const PREVIEW_QR = 264; // ≈ 464 scaled to fit 280 preview minus padding feel

async function render() {
  const preset = PRESETS[currentPresetId()];
  const config = preset.build(currentUrl, PREVIEW_QR);

  if (!qr) {
    qr = new QRCodeStyling(config);
  } else {
    qr.update(config);
  }

  try {
    const blob = await qr.getRawData('svg');
    if (!blob) return;
    const raw = await (blob as Blob).text();
    const withLogo = injectLogo(raw, PREVIEW_QR, currentPresetId());
    // Wrap preview in a rounded container matching export look
    previewEl.innerHTML =
      '<div class="preview-frame" style="background:' +
      preset.bgColor +
      '">' +
      withLogo +
      '</div>';
  } catch (e) {
    console.error('preview render failed', e);
  }
}

render();

// Build final export SVG at full QR size (derived from container)
async function getExportSVG(qrSize: number): Promise<string> {
  const preset = PRESETS[currentPresetId()];
  const exportConfig = preset.build(currentUrl, qrSize);
  const exportQr = new QRCodeStyling(exportConfig);
  const blob = await exportQr.getRawData('svg');
  if (!blob) throw new Error('QR generation returned empty');
  const raw = await (blob as Blob).text();
  return injectLogo(raw, qrSize, currentPresetId());
}

insertBtn.addEventListener('click', async () => {
  insertBtn.disabled = true;
  insertBtn.textContent = 'Generating…';
  try {
    const qrSize = qrSizeFromContainer(currentContainer);
    const svg = await getExportSVG(qrSize);
    parent.postMessage(
      {
        pluginMessage: {
          type: 'insert',
          svg,
          url: currentUrl,
          qrSize,
          presetLabel: PRESETS[currentPresetId()].label,
          bgColor: PRESETS[currentPresetId()].bgColor,
        },
      },
      '*'
    );
  } catch (e) {
    console.error(e);
    insertBtn.textContent = 'Error — try again';
    setTimeout(() => {
      insertBtn.disabled = false;
      insertBtn.textContent = 'Insert QR';
    }, 1500);
    return;
  }
  setTimeout(() => {
    insertBtn.disabled = false;
    insertBtn.textContent = 'Insert QR';
  }, 600);
});

cancelBtn.addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
});
