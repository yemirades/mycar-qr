import qrcode from 'qrcode-generator';
import { LOGOS, buildLogoGroup, LogoSpec } from '../src/logo';

/* ---------- i18n ---------- */
type Lang = 'ru' | 'en';
const T: Record<Lang, Record<string, string>> = {
  ru: {
    tagline: 'Фирменные QR-коды Mycar и Autocheck', theme: 'Сменить тему',
    content: 'Содержимое', contentLabel: 'Ссылка или текст', style: 'Стиль', params: 'Параметры',
    presets: 'Готовые стили', logo: 'Логотип в центре', logoSize: 'Размер логотипа',
    modules: 'Модули', shapeSize: 'Размер модуля', markerOutline: 'Контур маркера', markerCore: 'Ядро маркера',
    color: 'Цвет', background: 'Фон', bgRadius: 'Скругление фона',
    transparent: 'Прозрачный фон', markersSame: 'Маркеры того же цвета, что и модули',
    pngSize: 'Размер PNG', quiet: 'Тихая зона', ec: 'Коррекция ошибок',
    payload: 'Что попадёт в код', downloadPng: 'Скачать PNG', downloadSvg: 'Скачать SVG', copyPng: 'Копировать PNG', copySvg: 'Копировать SVG', svgCopied: 'SVG скопирован',
    footer: 'Всё считается в вашем браузере — данные никуда не отправляются.',
    none: 'Нет',
    modules4: '4 модуля', modules2: '2 модуля', modules0: 'Без отступа',
    empty: 'Введите ссылку или текст,\nчтобы увидеть код', copied: 'PNG скопирован', copyFail: 'Не удалось скопировать', copyFailHint: 'Скачайте файл',
    lowContrast: 'Низкий контраст между кодом и фоном — такой QR может не считаться.',
    noLogoEc: 'С логотипом коррекция ошибок будет повышена до Q.',
    smallShape: 'Модули меньше 0,7 читаются хуже — проверьте код сканером.',
    ecHint: 'Чем выше уровень, тем лучше код переносит повреждения и логотип, но тем плотнее он становится.',
    pMycarD: 'Mycar', pMycarI: 'Mycar инверс', pAutoD: 'Autocheck', pAutoI: 'Autocheck инверс', pAzure: 'Azure', pMeadow: 'Meadow', pCherry: 'Cherry', pMandarin: 'Mandarin', pPersea: 'Persea', pSunset: 'Закат', pOcean: 'Океан', pHearts: 'Сердца', pStars: 'Звёзды',
    sLiquid: 'Связанные', sSquare: 'Квадрат', sRounded: 'Скруглённый', sCircle: 'Круг', sHeart: 'Сердце', sDiamond: 'Ромб', sSparkle: 'Звезда', sLeaf: 'Лист', sHex: 'Шестиугольник', sExtra: 'Мягкий квадрат',
  },
  en: {
    tagline: 'Branded QR codes for Mycar and Autocheck', theme: 'Toggle theme',
    content: 'Content', contentLabel: 'Link or text', style: 'Style', params: 'Parameters',
    presets: 'Ready-made presets', logo: 'Center logo', logoSize: 'Logo size',
    modules: 'Modules', shapeSize: 'Shape size', markerOutline: 'Marker outline', markerCore: 'Marker core',
    color: 'Color', background: 'Background', bgRadius: 'Background radius',
    transparent: 'Transparent background', markersSame: 'Markers use the modules color',
    pngSize: 'PNG size', quiet: 'Quiet zone', ec: 'Error correction',
    payload: 'What goes into the code', downloadPng: 'Download PNG', downloadSvg: 'Download SVG', copyPng: 'Copy PNG', copySvg: 'Copy SVG', svgCopied: 'SVG copied',
    footer: 'Everything runs in your browser — nothing is sent anywhere.',
    none: 'None',
    modules4: '4 modules', modules2: '2 modules', modules0: 'None',
    empty: 'Enter a link or text\nto see the code', copied: 'PNG copied', copyFail: 'Copy failed', copyFailHint: 'Download the file instead',
    lowContrast: 'Low contrast between code and background — it may not scan.',
    noLogoEc: 'With a logo, error correction is raised to Q.',
    smallShape: 'Shapes below 0.7 scan less reliably — test the code with a scanner.',
    ecHint: 'Higher levels survive damage and a logo better, but make the code denser.',
    pMycarD: 'Mycar', pMycarI: 'Mycar inverse', pAutoD: 'Autocheck', pAutoI: 'Autocheck inverse', pAzure: 'Azure', pMeadow: 'Meadow', pCherry: 'Cherry', pMandarin: 'Mandarin', pPersea: 'Persea', pSunset: 'Sunset', pOcean: 'Ocean', pHearts: 'Hearts', pStars: 'Stars',
    sLiquid: 'Linked', sSquare: 'Square', sRounded: 'Rounded', sCircle: 'Circle', sHeart: 'Heart', sDiamond: 'Diamond', sSparkle: 'Sparkle', sLeaf: 'Leaf', sHex: 'Hexagon', sExtra: 'Soft square',
  },
};
let lang: Lang = 'ru';
try { const s = localStorage.getItem('mq-lang'); if (s === 'ru' || s === 'en') lang = s; else if (!/^(ru|kk)/.test(navigator.language)) lang = 'en'; } catch { /* noop */ }
const t = (k: string) => T[lang][k] ?? k;

/* ---------- geometry ---------- */
const K = 0.5523;
const f = (n: number) => (Math.round(n * 100) / 100).toString();

/** Rounded rectangle with individual radii (tl, tr, br, bl), absolute path commands only. */
function rr(x: number, y: number, w: number, h: number, [a, b, c, d]: number[]): string {
  return `M${f(x + a)} ${f(y)}L${f(x + w - b)} ${f(y)}C${f(x + w - b + b * K)} ${f(y)} ${f(x + w)} ${f(y + b - b * K)} ${f(x + w)} ${f(y + b)}` +
    `L${f(x + w)} ${f(y + h - c)}C${f(x + w)} ${f(y + h - c + c * K)} ${f(x + w - c + c * K)} ${f(y + h)} ${f(x + w - c)} ${f(y + h)}` +
    `L${f(x + d)} ${f(y + h)}C${f(x + d - d * K)} ${f(y + h)} ${f(x)} ${f(y + h - d + d * K)} ${f(x)} ${f(y + h - d)}` +
    `L${f(x)} ${f(y + a)}C${f(x)} ${f(y + a - a * K)} ${f(x + a - a * K)} ${f(y)} ${f(x + a)} ${f(y)}Z`;
}
type ShapeFn = (x: number, y: number, s: number) => string;
const SHAPES: Record<string, ShapeFn> = {
  square: (x, y, s) => rr(x, y, s, s, [0, 0, 0, 0]),
  circle: (x, y, s) => rr(x, y, s, s, [s / 2, s / 2, s / 2, s / 2]),
};
const MODULE_SHAPES: [string, string][] = [['square', 'sSquare'], ['circle', 'sCircle'], ['liquid', 'sLiquid']];

/**
 * "Linked" modules (Autocheck guide): neighbouring dark modules merge into one shape,
 * and a corner is rounded only where it has no neighbour on either side of it.
 * A lone module becomes a circle, the end of a line becomes a pill.
 * dark(r, c): the module is drawn; joined(r, c): counts as a neighbour for rounding (dark or part of the logo hole).
 */
function liquid(rows: number, cols: number, dark: (r: number, c: number) => boolean, joined: (r: number, c: number) => boolean, m: number, scale: number): string {
  const s = m * scale;
  const off = (m - s) / 2;
  const ov = scale >= 1 ? m * 0.015 : 0; // tiny overlap hides hairline seams between merged modules
  const R = s / 2;
  let d = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!dark(r, c)) continue;
      const up = joined(r - 1, c), dn = joined(r + 1, c), lf = joined(r, c - 1), rt = joined(r, c + 1);
      const x = c * m + off - (lf && dark(r, c - 1) ? ov : 0);
      const y = r * m + off - (up && dark(r - 1, c) ? ov : 0);
      const w = s + (lf && dark(r, c - 1) ? ov : 0) + (rt && dark(r, c + 1) ? ov : 0);
      const h = s + (up && dark(r - 1, c) ? ov : 0) + (dn && dark(r + 1, c) ? ov : 0);
      d += rr(x, y, w, h, [!up && !lf ? R : 0, !up && !rt ? R : 0, !dn && !rt ? R : 0, !dn && !lf ? R : 0]);
    }
  }
  return d;
}

/** Marker outline: ring made of an outer and an inner shape (even-odd fill). m = module size, 7x7 modules box at (ox, oy). */
const OUTLINES: Record<string, (ox: number, oy: number, m: number) => string> = {
  rounded: (ox, oy, m) => rr(ox, oy, 7 * m, 7 * m, [2 * m, 2 * m, 2 * m, 2 * m]) + rr(ox + m, oy + m, 5 * m, 5 * m, [1.1 * m, 1.1 * m, 1.1 * m, 1.1 * m]),
  extra: (ox, oy, m) => rr(ox, oy, 7 * m, 7 * m, [3 * m, 3 * m, 3 * m, 3 * m]) + rr(ox + m, oy + m, 5 * m, 5 * m, [2 * m, 2 * m, 2 * m, 2 * m]),
  circle: (ox, oy, m) => rr(ox, oy, 7 * m, 7 * m, [3.5 * m, 3.5 * m, 3.5 * m, 3.5 * m]) + rr(ox + m, oy + m, 5 * m, 5 * m, [2.5 * m, 2.5 * m, 2.5 * m, 2.5 * m]),
};
const OUTLINE_LIST: [string, string][] = [['rounded', 'sRounded'], ['extra', 'sExtra'], ['circle', 'sCircle']];

const CORES: Record<string, (cx: number, cy: number, m: number) => string> = {
  square: (cx, cy, m) => SHAPES.square(cx - 1.5 * m, cy - 1.5 * m, 3 * m),
  rounded: (cx, cy, m) => rr(cx - 1.5 * m, cy - 1.5 * m, 3 * m, 3 * m, [0.9 * m, 0.9 * m, 0.9 * m, 0.9 * m]),
  circle: (cx, cy, m) => SHAPES.circle(cx - 1.5 * m, cy - 1.5 * m, 3 * m),
};
const CORE_LIST: [string, string][] = [['square', 'sSquare'], ['rounded', 'sRounded'], ['circle', 'sCircle']];

/* ---------- state ---------- */
type LogoId = 'none' | 'mycar' | 'autocheck';
interface State {
  content: string;
  dots: string; outline: string; core: string; scale: number;
  logo: LogoId; logoScale: number;
  c1: string; bg: string; transparent: boolean; bgRadius: number;
  markersSame: boolean; m1: string; m2: string;
  ec: 'L' | 'M' | 'Q' | 'H'; quiet: number; size: number; preset: string;
}
const state: State = {
  content: 'https://mycar.kz',
  dots: 'circle', outline: 'extra', core: 'circle', scale: 1,
  logo: 'mycar', logoScale: 1,
  c1: '#000000', bg: '#FFFFFF', transparent: false, bgRadius: 12,
  markersSame: true, m1: '#000000', m2: '#000000',
  ec: 'H', quiet: 4, size: 1024, preset: 'mycar-default',
};

/* ---------- presets ---------- */
interface PresetDef { id: string; label: string; swatch: string; apply: Partial<State>; }
const solid = (c: string, bg = '#FFFFFF'): Partial<State> => ({ c1: c, bg, m1: c, m2: c, markersSame: true, transparent: false });
const brandLook: Partial<State> = { dots: 'circle', outline: 'extra', core: 'circle', scale: 1 };
const autocheckLook: Partial<State> = { dots: 'liquid', outline: 'rounded', core: 'circle', scale: 1 };
const PRESETS: PresetDef[] = [
  { id: 'mycar-default', label: 'pMycarD', swatch: 'linear-gradient(90deg,#000 50%,#fff 50%)', apply: { ...solid('#000000'), ...brandLook, logo: 'mycar' } },
  { id: 'mycar-inverse', label: 'pMycarI', swatch: 'linear-gradient(90deg,#fff 50%,#000 50%)', apply: { ...solid('#FFFFFF', '#000000'), ...brandLook, logo: 'mycar' } },
  { id: 'autocheck-default', label: 'pAutoD', swatch: '#000', apply: { ...solid('#000000'), ...autocheckLook, logo: 'autocheck' } },
  { id: 'autocheck-inverse', label: 'pAutoI', swatch: '#fff', apply: { ...solid('#FFFFFF', '#000000'), ...autocheckLook, logo: 'autocheck' } },
];

/* ---------- payload ---------- */
function buildPayload(): string {
  const v = state.content.trim();
  if (!v) return '';
  // bare domains and www. addresses become links; everything else is encoded as typed
  if (!/\s/.test(v) && !/^[a-z][a-z0-9+.-]*:/i.test(v) && /^(www\.)?[^\s/@]+\.[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(v)) return 'https://' + v;
  return state.content;
}

/* ---------- colors ---------- */
function hexToRgb(h: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(h); if (!m) return [0, 0, 0];
  const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance(h: string): number {
  const c = hexToRgb(h).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contrast = (a: string, b: string) => { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };

/* ---------- QR rendering ---------- */
interface LogoCfg { spec: LogoSpec; ratio: number; clearW: number; clearH: number; circle: boolean; }
const LOGO_CFG: Record<Exclude<LogoId, 'none'>, LogoCfg> = {
  mycar: { spec: LOGOS.mycar, ratio: 0.2241, clearW: 0.34, clearH: 0.34, circle: true },
  autocheck: { spec: LOGOS.autocheck, ratio: 0.405, clearW: 0.448, clearH: 0.237, circle: false },
};
function effectiveEc(): 'L' | 'M' | 'Q' | 'H' {
  return state.logo !== 'none' && (state.ec === 'L' || state.ec === 'M') ? 'Q' : state.ec;
}

function buildSvg(text: string, outSize: number): string {
  // the encoder works on bytes: pass UTF-8 so Cyrillic and Kazakh text scans correctly
  const q = qrcode(0, effectiveEc());
  q.addData(unescape(encodeURIComponent(text)), 'Byte');
  q.make();
  const n = q.getModuleCount();
  const margin = (state.quiet * outSize) / (n + 2 * state.quiet);
  const inner = outSize - 2 * margin;
  const m = inner / n;
  const cfg = state.logo !== 'none' ? LOGO_CFG[state.logo] : null;
  const ls = state.logoScale;

  const inFinder = (r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const cx0 = inner / 2;
  const cleared = (x: number, y: number) => {
    if (!cfg) return false;
    const pad = cfg.circle ? m * 0.35 : 0;
    if (cfg.circle) { const rad = (cfg.clearW * ls * inner) / 2 + pad; return (x - cx0) ** 2 + (y - cx0) ** 2 < rad * rad; }
    return Math.abs(x - cx0) < (cfg.clearW * ls * inner) / 2 + pad && Math.abs(y - cx0) < (cfg.clearH * ls * inner) / 2 + pad;
  };

  const isCleared = (r: number, c: number) => cleared(c * m + m / 2, r * m + m / 2);
  const dark = (r: number, c: number) => r >= 0 && c >= 0 && r < n && c < n && q.isDark(r, c) && !inFinder(r, c) && !isCleared(r, c);
  let modules = '';
  if (state.dots === 'liquid') {
    // cells inside the logo hole count as neighbours, so the edge along the hole stays flat
    const joined = (r: number, c: number) => dark(r, c) || (r >= 0 && c >= 0 && r < n && c < n && !inFinder(r, c) && isCleared(r, c));
    modules = liquid(n, n, dark, joined, m, state.scale);
  } else {
    const shape = SHAPES[state.dots] || SHAPES.circle;
    const sz = m * state.scale + (state.dots === 'square' && state.scale >= 1 ? m * 0.01 : 0);
    const off = (m - sz) / 2;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (dark(r, c)) modules += shape(c * m + off, r * m + off, sz);
  }

  const fillMain = state.c1;
  const fillOut = state.markersSame ? fillMain : state.m1;
  const fillCore = state.markersSame ? fillMain : state.m2;

  const finders = [[0, 0], [n - 7, 0], [0, n - 7]];
  let rings = '', cores = '';
  const outlineFn = OUTLINES[state.outline] || OUTLINES.extra;
  const coreFn = CORES[state.core] || CORES.circle;
  for (const [fc, fr] of finders) {
    rings += outlineFn(fc * m, fr * m, m);
    cores += coreFn((fc + 3.5) * m, (fr + 3.5) * m, m);
  }

  let body = `<path d="${modules}" fill="${fillMain}"/>` +
    `<path d="${rings}" fill="${fillOut}" fill-rule="evenodd"/>` +
    `<path d="${cores}" fill="${fillCore}"/>`;
  if (cfg) {
    const smile = state.transparent ? (luminance(state.c1) > 0.4 ? '#000000' : '#FFFFFF') : state.bg;
    body += buildLogoGroup(cfg.spec, inner, cfg.ratio * ls, state.c1, smile);
  }
  const bgR = (state.bgRadius / 100) * outSize;
  const bg = state.transparent ? '' : `<rect width="${outSize}" height="${outSize}" rx="${f(bgR)}" fill="${state.bg}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${outSize}" height="${outSize}" viewBox="0 0 ${outSize} ${outSize}">` +
    bg + `<g transform="translate(${f(margin)} ${f(margin)})">${body}</g></svg>`;
}

/* ---------- export ---------- */
function svgToPng(svg: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    img.onload = () => {
      const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
      cv.getContext('2d')!.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      cv.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('img')); };
    img.src = url;
  });
}
function saveBlob(blob: Blob, name: string) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ---------- DOM helpers ---------- */
const $ = <E extends HTMLElement>(id: string) => document.getElementById(id) as E;
type ToastType = 'info' | 'success' | 'warning' | 'danger';
// icons: filled shape with the glyph cut out in the container colour (Mylo "Info Filled", check, attention triangle, clear)
const TOAST_ICONS: Record<ToastType, string> = {
  info: '<circle cx="12" cy="12" r="10"/><path class="mark" d="M12 11v5M12 8h.01"/>',
  success: '<circle cx="12" cy="12" r="10"/><path class="mark" d="m7.8 12.4 2.9 2.8 5.5-5.6"/>',
  warning: '<path d="M10.3 4.2a2 2 0 0 1 3.4 0l8 13.8A2 2 0 0 1 20 21H4a2 2 0 0 1-1.7-3l8-13.8Z"/><path class="mark" d="M12 9.5v4.2M12 16.8h.01"/>',
  danger: '<path class="line" d="M6 6l12 12M18 6 6 18"/>',
};
const TOAST_PRIORITY: Record<ToastType, number> = { danger: 3, warning: 2, success: 1, info: 1 };
let toastTimer = 0; let toastType: ToastType | null = null;
/**
 * Mylo toast: informational only. One at a time, no queue, no close button; it disappears after 3 s.
 * A toast with higher priority (danger > warning > success/info) replaces the current one, a lower one is not shown.
 */
function toast(title: string, type: ToastType = 'info', subtitle = '') {
  if (toastType && TOAST_PRIORITY[type] < TOAST_PRIORITY[toastType]) return;
  const slot = $('toast'); clearTimeout(toastTimer);
  slot.innerHTML = '';
  const card = document.createElement('div'); card.className = 'toast-content ' + type; card.setAttribute('role', 'status'); card.setAttribute('aria-live', 'polite');
  card.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${TOAST_ICONS[type]}</svg>`;
  const box = document.createElement('div'); box.className = 'toast-text';
  const p = document.createElement('p'); p.className = 'toast-title'; p.textContent = title; box.appendChild(p);
  if (subtitle) { const sp = document.createElement('p'); sp.className = 'toast-sub'; sp.textContent = subtitle; box.appendChild(sp); }
  card.appendChild(box); slot.appendChild(card); toastType = type;
  toastTimer = window.setTimeout(() => { card.classList.add('leaving'); setTimeout(() => { card.remove(); toastType = null; }, 200); }, 3000);
}
const setPressed = (el: HTMLElement, test: (i: number) => boolean) => Array.from(el.children).forEach((c, i) => c.setAttribute('aria-pressed', String(test(i))));

function segment<V extends string | number>(el: HTMLElement, items: { v: V; label: string }[], get: () => V, set: (v: V) => void) {
  el.innerHTML = '';
  items.forEach((it) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = it.label;
    b.setAttribute('aria-pressed', String(get() === it.v));
    b.onclick = () => { set(it.v); setPressed(el, (i) => items[i].v === get()); onChange(true); };
    el.appendChild(b);
  });
}
function chips(el: HTMLElement, items: { v: string; label: string; sw?: string }[], get: () => string, set: (v: string) => void) {
  el.innerHTML = '';
  items.forEach((it) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip';
    if (it.sw) { const sp = document.createElement('span'); sp.className = 'sw'; sp.style.background = it.sw; b.appendChild(sp); }
    b.appendChild(document.createTextNode(it.label));
    b.setAttribute('aria-pressed', String(get() === it.v));
    b.onclick = () => { set(it.v); setPressed(el, (i) => items[i].v === get()); onChange(true); };
    el.appendChild(b);
  });
}
/** Pickers made of small shape icons, drawn with the same path generators as the QR itself. */
function iconChips(el: HTMLElement, items: [string, string][], icon: (id: string) => string, get: () => string, set: (v: string) => void) {
  el.innerHTML = '';
  items.forEach(([id, label]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'icon-chip';
    b.title = t(label); b.setAttribute('aria-label', t(label));
    b.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true">${icon(id)}</svg>`;
    b.setAttribute('aria-pressed', String(get() === id));
    b.onclick = () => { set(id); setPressed(el, (i) => items[i][0] === get()); state.preset = ''; buildPresets(); onChange(true); };
    el.appendChild(b);
  });
}
const LIQUID_ICON = ['111', '010', '101'];
const moduleIcon = (id: string) => {
  if (id === 'liquid') {
    const on = (r: number, c: number) => r >= 0 && c >= 0 && r < 3 && c < 3 && LIQUID_ICON[r][c] === '1';
    return `<g transform="translate(5 5)"><path d="${liquid(3, 3, on, on, 10, 1)}"/></g>`;
  }
  let d = ''; const sh = SHAPES[id];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) d += sh(5 + c * 10.5, 5 + r * 10.5, 9);
  return `<path d="${d}"/>`;
};
const outlineIcon = (id: string) => `<path d="${OUTLINES[id](3, 3, 34 / 7)}" fill-rule="evenodd"/>`;
const coreIcon = (id: string) => `<path d="${CORES[id](20, 20, 8)}"/>`;

function slider(el: HTMLElement, label: string, min: number, max: number, step: number, get: () => number, set: (v: number) => void, fmt: (v: number) => string) {
  el.innerHTML = '';
  const box = document.createElement('div'); box.className = 'slider';
  const l = document.createElement('span'); l.className = 's-label'; l.textContent = t(label);
  const r = document.createElement('input'); r.type = 'range'; r.min = String(min); r.max = String(max); r.step = String(step); r.value = String(get()); r.setAttribute('aria-label', t(label));
  const v = document.createElement('span'); v.className = 's-val'; v.textContent = fmt(get());
  r.oninput = () => { set(parseFloat(r.value)); v.textContent = fmt(get()); onChange(false); };
  box.append(l, r, v); el.appendChild(box);
}

/* ---------- style controls ---------- */
function syncColorInputs() {
  const set = (id: string, v: string) => { ($(id) as HTMLInputElement).value = v; };
  set('c1', state.c1); set('c1t', state.c1); set('bg', state.bg); set('bgt', state.bg);
  set('m1', state.m1); set('m1t', state.m1); set('m2', state.m2); set('m2t', state.m2);
  ($('transparent') as HTMLInputElement).checked = state.transparent;
  ($('markersSame') as HTMLInputElement).checked = state.markersSame;
  $('markerColors').hidden = state.markersSame;
  ($('bg').closest('label') as HTMLElement).style.opacity = state.transparent ? '.4' : '1';
}
function bindColor(id: 'c1' | 'bg' | 'm1' | 'm2') {
  const pick = $(id) as HTMLInputElement, txt = $(id + 't') as HTMLInputElement;
  const apply = (v: string) => { state[id] = v.toUpperCase(); state.preset = ''; buildPresets(); onChange(false); };
  pick.oninput = () => { txt.value = pick.value.toUpperCase(); apply(pick.value); };
  txt.oninput = () => {
    let v = txt.value.trim(); if (v && v[0] !== '#') v = '#' + v;
    if (/^#[0-9a-f]{6}$/i.test(v)) { pick.value = v; apply(v); }
  };
}
function buildPresets() {
  chips($('presetChips'), PRESETS.map((p) => ({ v: p.id, label: t(p.label), sw: p.swatch })), () => state.preset, (id) => {
    Object.assign(state, PRESETS.find((x) => x.id === id)!.apply, { preset: id });
    buildStyleControls();
  });
}
function buildStyleControls() {
  buildPresets();
  segment($('logoSeg'), [{ v: 'none', label: t('none') }, { v: 'mycar', label: 'Mycar' }, { v: 'autocheck', label: 'Autocheck' }] as { v: LogoId; label: string }[], () => state.logo, (v) => { state.logo = v; });
  slider($('logoScaleSlider'), 'logoSize', 0.6, 1.4, 0.01, () => state.logoScale, (v) => { state.logoScale = v; }, (v) => v.toFixed(2));
  iconChips($('dotChips'), MODULE_SHAPES, moduleIcon, () => state.dots, (v) => { state.dots = v; });
  slider($('scaleSlider'), 'shapeSize', 0.5, 1.3, 0.01, () => state.scale, (v) => { state.scale = v; }, (v) => v.toFixed(2));
  iconChips($('cornerSqChips'), OUTLINE_LIST, outlineIcon, () => state.outline, (v) => { state.outline = v; });
  iconChips($('cornerDotChips'), CORE_LIST, coreIcon, () => state.core, (v) => { state.core = v; });
  slider($('bgRadiusSlider'), 'bgRadius', 0, 50, 1, () => state.bgRadius, (v) => { state.bgRadius = v; }, (v) => v + '%');
  segment($('sizeSeg'), [512, 1024, 2048, 4096].map((v) => ({ v, label: String(v) })), () => state.size, (v) => { state.size = v; });
  segment($('quietSeg'), [{ v: 4, label: t('modules4') }, { v: 2, label: t('modules2') }, { v: 0, label: t('modules0') }], () => state.quiet, (v) => { state.quiet = v; });
  segment($('ecSeg'), [{ v: 'L', label: 'L · 7%' }, { v: 'M', label: 'M · 15%' }, { v: 'Q', label: 'Q · 25%' }, { v: 'H', label: 'H · 30%' }], () => state.ec, (v) => { state.ec = v as State['ec']; });
  $('ecHint').textContent = t('ecHint');
  syncColorInputs();
}

/* ---------- render ---------- */
let lastSvg = ''; let debounce = 0;
function onChange(immediate: boolean) {
  syncColorInputs();
  clearTimeout(debounce);
  if (immediate) render(); else debounce = window.setTimeout(render, 40);
}
function render() {
  const data = buildPayload();
  const preview = $('preview');
  ['dlPng', 'dlSvg', 'copyPng', 'copySvg'].forEach((id) => { ($(id) as HTMLButtonElement).disabled = !data; });
  $('payloadText').textContent = data || '—';
  const warn = $('warn');
  if (!data) { preview.innerHTML = `<div class="empty">${t('empty').replace('\n', '<br>')}</div>`; lastSvg = ''; warn.hidden = true; return; }
  try { lastSvg = buildSvg(data, 1024); preview.innerHTML = lastSvg; const el = preview.querySelector('svg'); if (el) { el.removeAttribute('width'); el.removeAttribute('height'); } } catch (e) { console.error(e); }
  const msgs: string[] = [];
  const lowC = !state.transparent && contrast(state.c1, state.bg) < 3;
  if (lowC) msgs.push(t('lowContrast'));
  if (state.scale < 0.7) msgs.push(t('smallShape'));
  if (state.logo !== 'none' && (state.ec === 'L' || state.ec === 'M')) msgs.push(t('noLogoEc'));
  warn.hidden = !msgs.length; warn.textContent = msgs.join(' ');
}
const exportSvg = () => buildSvg(buildPayload(), state.size);
const fileBase = () => 'mycar-qr';
$('dlSvg').onclick = () => saveBlob(new Blob([exportSvg()], { type: 'image/svg+xml' }), fileBase() + '.svg');
$('dlPng').onclick = async () => saveBlob(await svgToPng(exportSvg(), state.size), `${fileBase()}-${state.size}.png`);
$('copyPng').onclick = async () => {
  try {
    const blob = await svgToPng(buildSvg(buildPayload(), Math.min(state.size, 2048)), Math.min(state.size, 2048));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast(t('copied'));
  } catch { toast(t('copyFail'), 'danger', t('copyFailHint')); }
};

$('copySvg').onclick = async () => {
  try { await navigator.clipboard.writeText(exportSvg()); toast(t('svgCopied')); } catch { toast(t('copyFail'), 'danger', t('copyFailHint')); }
};

/* ---------- theme, lang, wiring ---------- */
$('themeBtn').onclick = () => {
  const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = cur === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next;
  try { localStorage.setItem('mq-theme', next); } catch { /* noop */ }
};
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n!); });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria!)));
  document.querySelectorAll<HTMLElement>('#langSeg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}
document.querySelectorAll<HTMLElement>('#langSeg button').forEach((b) => {
  b.onclick = () => { lang = b.dataset.lang as Lang; try { localStorage.setItem('mq-lang', lang); } catch { /* noop */ } applyLang(); buildStyleControls(); render(); };
});
const contentEl = $('content') as HTMLInputElement;
contentEl.value = state.content;
contentEl.oninput = () => { state.content = contentEl.value; onChange(false); };
$('transparent').onchange = () => { state.transparent = ($('transparent') as HTMLInputElement).checked; onChange(true); };
$('markersSame').onchange = () => { state.markersSame = ($('markersSame') as HTMLInputElement).checked; onChange(true); };
(['c1', 'bg', 'm1', 'm2'] as const).forEach(bindColor);

Object.assign(state, PRESETS[0].apply);
applyLang(); buildStyleControls(); render();

/* ---------- embedding (Tilda etc.): report page height to the parent frame ---------- */
if (window.parent !== window) {
  document.documentElement.classList.add('embedded');
  const post = () => window.parent.postMessage({ type: 'mycar-qr-height', height: document.documentElement.scrollHeight }, '*');
  new ResizeObserver(post).observe(document.body);
  post();
}
