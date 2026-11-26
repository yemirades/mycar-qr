import QRCodeStyling from 'qr-code-styling';
import qrcode from 'qrcode-generator';
import { LOGOS, buildLogoGroup, LogoSpec } from '../src/logo';

/* ---------- i18n ---------- */
type Lang = 'ru' | 'en';
const T: Record<Lang, Record<string, string>> = {
  ru: {
    tagline: 'Фирменные QR-коды Mycar и Autocheck',
    theme: 'Сменить тему', content: 'Контент', style: 'Стиль', params: 'Параметры',
    presets: 'Готовые стили', logo: 'Логотип в центре', modules: 'Модули', markerOutline: 'Контур маркера', markerCore: 'Ядро маркера',
    color: 'Цвет', color1: 'Цвет 1', color2: 'Цвет 2', background: 'Фон', direction: 'Направление',
    transparent: 'Прозрачный фон', markersSame: 'Маркеры того же цвета, что и модули',
    pngSize: 'Размер PNG', quiet: 'Тихая зона', ec: 'Коррекция ошибок',
    payload: 'Что попадёт в код', downloadPng: 'Скачать PNG', downloadSvg: 'Скачать SVG', copyPng: 'Скопировать PNG',
    footer: 'Всё считается в вашем браузере — данные никуда не отправляются.',
    none: 'Нет', solid: 'Сплошной', gradient: 'Градиент', linear: 'Линейный', radial: 'Радиальный', diag: 'Диагональ', horiz: 'Горизонталь', vert: 'Вертикаль',
    modules4: '4 модуля', modules2: '2 модуля', modules0: 'Без отступа',
    empty: 'Заполните контент слева,\nчтобы увидеть код', copied: 'PNG скопирован', copyFail: 'Не удалось скопировать — скачайте файл',
    lowContrast: 'Низкий контраст между кодом и фоном — такой QR может не считаться.',
    noLogoEc: 'С логотипом коррекция ошибок будет повышена до Q или H.',
    ecHint: 'Чем выше уровень, тем лучше код переносит повреждения и логотип, но тем плотнее он становится.',
    tLink: 'Ссылка', tText: 'Текст', tWifi: 'Wi-Fi', tEmail: 'E-mail', tContact: 'Контакт',
    fUrl: 'Адрес ссылки', fText: 'Текст', fSsid: 'Название сети', fPass: 'Пароль', fSec: 'Защита', fHidden: 'Скрытая сеть', secNone: 'Без пароля',
    fTo: 'Кому', fSubject: 'Тема', fBody: 'Сообщение', fFirst: 'Имя', fLast: 'Фамилия', fOrg: 'Компания', fJob: 'Должность', fPhone: 'Телефон', fMail: 'E-mail', fSite: 'Сайт',
    pMycarD: 'Mycar', pMycarI: 'Mycar инверс', pAutoD: 'Autocheck', pAutoI: 'Autocheck инверс', pAzure: 'Azure', pMeadow: 'Meadow', pCherry: 'Cherry', pMandarin: 'Mandarin', pPersea: 'Persea', pSunset: 'Закат', pOcean: 'Океан',
    dSquare: 'Квадрат', dDots: 'Точки', dRounded: 'Скруглённые', dExtra: 'Мягкие', dClassy: 'Классика', dClassyR: 'Классика+', cSquare: 'Квадрат', cDot: 'Круг',
  },
  en: {
    tagline: 'Branded QR codes for Mycar and Autocheck',
    theme: 'Toggle theme', content: 'Content', style: 'Style', params: 'Parameters',
    presets: 'Ready-made presets', logo: 'Center logo', modules: 'Modules', markerOutline: 'Marker outline', markerCore: 'Marker core',
    color: 'Color', color1: 'Color 1', color2: 'Color 2', background: 'Background', direction: 'Direction',
    transparent: 'Transparent background', markersSame: 'Markers use the modules color',
    pngSize: 'PNG size', quiet: 'Quiet zone', ec: 'Error correction',
    payload: 'What goes into the code', downloadPng: 'Download PNG', downloadSvg: 'Download SVG', copyPng: 'Copy PNG',
    footer: 'Everything runs in your browser — nothing is sent anywhere.',
    none: 'None', solid: 'Solid', gradient: 'Gradient', linear: 'Linear', radial: 'Radial', diag: 'Diagonal', horiz: 'Horizontal', vert: 'Vertical',
    modules4: '4 modules', modules2: '2 modules', modules0: 'None',
    empty: 'Fill in the content on the left\nto see the code', copied: 'PNG copied', copyFail: 'Copy failed — download the file instead',
    lowContrast: 'Low contrast between code and background — it may not scan.',
    noLogoEc: 'With a logo, error correction is raised to Q or H.',
    ecHint: 'Higher levels survive damage and a logo better, but make the code denser.',
    tLink: 'Link', tText: 'Text', tWifi: 'Wi-Fi', tEmail: 'Email', tContact: 'Contact',
    fUrl: 'Link address', fText: 'Text', fSsid: 'Network name', fPass: 'Password', fSec: 'Security', fHidden: 'Hidden network', secNone: 'No password',
    fTo: 'To', fSubject: 'Subject', fBody: 'Message', fFirst: 'First name', fLast: 'Last name', fOrg: 'Company', fJob: 'Job title', fPhone: 'Phone', fMail: 'Email', fSite: 'Website',
    pMycarD: 'Mycar', pMycarI: 'Mycar inverse', pAutoD: 'Autocheck', pAutoI: 'Autocheck inverse', pAzure: 'Azure', pMeadow: 'Meadow', pCherry: 'Cherry', pMandarin: 'Mandarin', pPersea: 'Persea', pSunset: 'Sunset', pOcean: 'Ocean',
    dSquare: 'Square', dDots: 'Dots', dRounded: 'Rounded', dExtra: 'Soft', dClassy: 'Classy', dClassyR: 'Classy+', cSquare: 'Square', cDot: 'Round',
  },
};

let lang: Lang = 'ru';
try { const s = localStorage.getItem('mq-lang'); if (s === 'ru' || s === 'en') lang = s; else if (!navigator.language.startsWith('ru') && !navigator.language.startsWith('kk')) lang = 'en'; } catch { /* noop */ }
const t = (k: string) => T[lang][k] ?? k;

/* ---------- state ---------- */
type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
type CornerSq = 'square' | 'dot' | 'extra-rounded';
type CornerDot = 'square' | 'dot';
type LogoId = 'none' | 'mycar' | 'autocheck';
type ContentType = 'link' | 'text' | 'wifi' | 'email' | 'contact';
type Dir = 'diag' | 'horiz' | 'vert';

interface State {
  type: ContentType;
  fields: Record<string, string>;
  dots: DotType; cornerSq: CornerSq; cornerDot: CornerDot;
  logo: LogoId;
  colorMode: 'solid' | 'gradient'; gradKind: 'linear' | 'radial'; dir: Dir;
  c1: string; c2: string; bg: string; transparent: boolean;
  markersSame: boolean; m1: string; m2: string;
  ec: 'L' | 'M' | 'Q' | 'H'; quiet: number; size: number;
  preset: string;
}

const state: State = {
  type: 'link',
  fields: { url: 'https://mycar.kz', secType: 'WPA' },
  dots: 'dots', cornerSq: 'extra-rounded', cornerDot: 'dot',
  logo: 'mycar',
  colorMode: 'solid', gradKind: 'linear', dir: 'diag',
  c1: '#000000', c2: '#000000', bg: '#FFFFFF', transparent: false,
  markersSame: true, m1: '#000000', m2: '#000000',
  ec: 'H', quiet: 4, size: 1024, preset: 'mycar-default',
};

/* ---------- presets ---------- */
interface PresetDef { id: string; label: string; swatch: string; apply: Partial<State>; }
const P = (id: string, label: string, swatch: string, apply: Partial<State>): PresetDef => ({ id, label, swatch, apply });
const solid = (c: string, bg = '#FFFFFF') => ({ colorMode: 'solid' as const, c1: c, c2: c, bg, m1: c, m2: c, markersSame: true, transparent: false });
const PRESETS: PresetDef[] = [
  P('mycar-default', 'pMycarD', 'linear-gradient(90deg,#000 50%,#fff 50%)', { ...solid('#000000'), logo: 'mycar', dots: 'dots', cornerSq: 'extra-rounded', cornerDot: 'dot' }),
  P('mycar-inverse', 'pMycarI', 'linear-gradient(90deg,#fff 50%,#000 50%)', { ...solid('#FFFFFF', '#000000'), logo: 'mycar', dots: 'dots', cornerSq: 'extra-rounded', cornerDot: 'dot' }),
  P('autocheck-default', 'pAutoD', '#000', { ...solid('#000000'), logo: 'autocheck', dots: 'dots', cornerSq: 'extra-rounded', cornerDot: 'dot' }),
  P('autocheck-inverse', 'pAutoI', '#fff', { ...solid('#FFFFFF', '#000000'), logo: 'autocheck', dots: 'dots', cornerSq: 'extra-rounded', cornerDot: 'dot' }),
  P('azure', 'pAzure', '#0068E3', solid('#0068E3')),
  P('meadow', 'pMeadow', '#18BB4F', solid('#009938')),
  P('cherry', 'pCherry', '#C92140', solid('#C92140')),
  P('mandarin', 'pMandarin', '#FF522D', solid('#E8431F')),
  P('persea', 'pPersea', '#2539D7', solid('#2539D7')),
  P('sunset', 'pSunset', 'linear-gradient(135deg,#FF522D,#FF228C)', { colorMode: 'gradient', gradKind: 'linear', dir: 'diag', c1: '#FF522D', c2: '#C4126B', bg: '#FFFFFF', m1: '#FF522D', m2: '#C4126B', markersSame: true, transparent: false }),
  P('ocean', 'pOcean', 'linear-gradient(135deg,#008EFF,#18BB4F)', { colorMode: 'gradient', gradKind: 'linear', dir: 'diag', c1: '#0068E3', c2: '#09AB46', bg: '#FFFFFF', m1: '#0068E3', m2: '#09AB46', markersSame: true, transparent: false }),
];

/* ---------- payload ---------- */
const esc = (s: string) => s.replace(/([\;,:"])/g, '\\$1');
function normalizeUrl(u: string): string {
  const v = u.trim();
  if (!v) return '';
  return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : 'https://' + v;
}
function buildPayload(): string {
  const f = state.fields;
  switch (state.type) {
    case 'link': return normalizeUrl(f.url || '');
    case 'text': return (f.text || '').trim() ? f.text : '';
    case 'wifi': {
      if (!(f.ssid || '').trim()) return '';
      const sec = f.secType || 'WPA';
      return `WIFI:T:${sec === 'nopass' ? 'nopass' : sec};S:${esc(f.ssid)};${sec === 'nopass' ? '' : `P:${esc(f.pass || '')};`}${f.hidden === '1' ? 'H:true;' : ''};`;
    }
    case 'email': {
      const to = (f.to || '').trim();
      if (!to) return '';
      const q: string[] = [];
      if (f.subject) q.push('subject=' + encodeURIComponent(f.subject));
      if (f.body) q.push('body=' + encodeURIComponent(f.body));
      return 'mailto:' + to + (q.length ? '?' + q.join('&') : '');
    }
    case 'contact': {
      if (!(f.first || f.last || f.phone || f.mail)) return '';
      const l = ['BEGIN:VCARD', 'VERSION:3.0', `N:${f.last || ''};${f.first || ''};;;`, `FN:${[f.first, f.last].filter(Boolean).join(' ')}`];
      if (f.org) l.push('ORG:' + f.org);
      if (f.job) l.push('TITLE:' + f.job);
      if (f.phone) l.push('TEL;TYPE=CELL:' + f.phone);
      if (f.mail) l.push('EMAIL:' + f.mail);
      if (f.site) l.push('URL:' + normalizeUrl(f.site));
      l.push('END:VCARD');
      return l.join('\n');
    }
  }
}

/* ---------- logo / geometry ---------- */
interface LogoCfg { spec: LogoSpec; ratio: number; clearW: number; clearH: number; }
const LOGO_CFG: Record<Exclude<LogoId, 'none'>, LogoCfg> = {
  mycar: { spec: LOGOS.mycar, ratio: 0.2241, clearW: 0.32, clearH: 0.32 },
  autocheck: { spec: LOGOS.autocheck, ratio: 0.405, clearW: 0.448, clearH: 0.237 },
};

function hexToRgb(h: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(h); if (!m) return [0, 0, 0];
  const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance(h: string): number {
  const c = hexToRgb(h).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a: string, b: string): number {
  const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function moduleCount(data: string, ec: string): number {
  const q = qrcode(0, ec as 'L' | 'M' | 'Q' | 'H'); q.addData(data, 'Byte'); q.make(); return q.getModuleCount();
}

const placeholderCache = new Map<string, string>();
function placeholder(w: number, h: number): string {
  const key = `${w}x${h}`; const c = placeholderCache.get(key); if (c) return c;
  const cv = document.createElement('canvas'); cv.width = 100; cv.height = Math.max(1, Math.round((100 * h) / w));
  const url = cv.toDataURL('image/png'); placeholderCache.set(key, url); return url;
}

function gradientFor(c1: string, c2: string) {
  const rotation = state.dir === 'horiz' ? 0 : state.dir === 'vert' ? Math.PI / 2 : Math.PI / 4;
  return { type: state.gradKind, rotation, colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }] };
}

function effectiveEc(): 'L' | 'M' | 'Q' | 'H' {
  if (state.logo !== 'none' && (state.ec === 'L' || state.ec === 'M')) return 'Q';
  return state.ec;
}

async function buildSvg(text: string, outSize: number): Promise<string> {
  // The encoder works on bytes: feed it UTF-8 bytes so Cyrillic / Kazakh text scans correctly
  const data = unescape(encodeURIComponent(text));
  const ec = effectiveEc();
  const count = moduleCount(data, ec);
  const margin = (state.quiet * outSize) / (count + 2 * state.quiet);
  const inner = outSize - 2 * margin;
  const useGrad = state.colorMode === 'gradient';
  const grad = useGrad ? gradientFor(state.c1, state.c2) : undefined;
  const mOut = state.markersSame ? state.c1 : state.m1;
  const mCore = state.markersSame ? state.c1 : state.m2;
  const mGradOut = state.markersSame && useGrad ? grad : undefined;
  const cfg = state.logo !== 'none' ? LOGO_CFG[state.logo] : null;

  const opts: any = {
    width: outSize, height: outSize, type: 'svg', data, margin,
    qrOptions: { errorCorrectionLevel: ec, typeNumber: 0 },
    dotsOptions: { type: state.dots, color: state.c1, gradient: grad },
    cornersSquareOptions: { type: state.cornerSq, color: mOut, gradient: mGradOut },
    cornersDotOptions: { type: state.cornerDot, color: mCore, gradient: mGradOut },
    backgroundOptions: { color: state.transparent ? '#FFFFFF' : state.bg },
  };
  if (cfg) {
    opts.image = placeholder(cfg.clearW, cfg.clearH);
    opts.imageOptions = { hideBackgroundDots: true, imageSize: Math.max(cfg.clearW, cfg.clearH), margin: 0, crossOrigin: 'anonymous' };
  }
  const qr = new QRCodeStyling(opts);
  const blob = (await qr.getRawData('svg')) as Blob;
  let svg = await blob.text();
  svg = svg.replace(/<image[\s\S]*?(\/>|<\/image>)/g, '');

  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement;
  if (state.transparent) {
    root.querySelectorAll('rect[clip-path*="background-color"]').forEach((r) => r.remove());
  }
  svg = new XMLSerializer().serializeToString(root);
  if (cfg) {
    const body = state.c1;
    const smile = state.transparent ? (luminance(body) > 0.4 ? '#000000' : '#FFFFFF') : state.bg;
    // logo is centered in the full canvas; ratio is relative to the QR body (without quiet zone)
    const g = buildLogoGroup(cfg.spec, inner, cfg.ratio, body, smile);
    svg = svg.replace(/<\/svg>\s*$/, `<g transform="translate(${margin} ${margin})">${g}</g></svg>`);
  }
  return svg;
}

/* ---------- export ---------- */
function svgToPng(svg: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    img.onload = () => {
      const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
      const ctx = cv.getContext('2d')!; ctx.drawImage(img, 0, 0, size, size);
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
function fileBase(): string { return 'mycar-qr-' + state.type; }

/* ---------- DOM helpers ---------- */
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
function toast(msg: string) { const el = $('toast'); el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800); }

function segment<V extends string | number>(el: HTMLElement, items: { v: V; label: string }[], get: () => V, set: (v: V) => void) {
  el.innerHTML = '';
  items.forEach((it) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = it.label;
    b.setAttribute('aria-pressed', String(get() === it.v));
    b.onclick = () => { set(it.v); Array.from(el.children).forEach((c, i) => c.setAttribute('aria-pressed', String(items[i].v === get()))); onChange(true); };
    el.appendChild(b);
  });
}
function chips<V extends string>(el: HTMLElement, items: { v: V; label: string; sw?: string }[], get: () => V, set: (v: V) => void) {
  el.innerHTML = '';
  items.forEach((it) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip';
    if (it.sw) { const s = document.createElement('span'); s.className = 'sw'; s.style.background = it.sw; b.appendChild(s); }
    b.appendChild(document.createTextNode(it.label));
    b.setAttribute('aria-pressed', String(get() === it.v));
    b.onclick = () => { set(it.v); Array.from(el.children).forEach((c, i) => c.setAttribute('aria-pressed', String(items[i].v === get()))); onChange(true); };
    el.appendChild(b);
  });
}

/* ---------- content panels ---------- */
const TABS: { id: ContentType; label: string }[] = [
  { id: 'link', label: 'tLink' }, { id: 'text', label: 'tText' }, { id: 'wifi', label: 'tWifi' }, { id: 'email', label: 'tEmail' }, { id: 'contact', label: 'tContact' },
];
type FieldDef = { k: string; label: string; type?: string; area?: boolean; ph?: string; half?: boolean };
const FIELDS: Record<ContentType, FieldDef[]> = {
  link: [{ k: 'url', label: 'fUrl', type: 'url', ph: 'https://mycar.kz' }],
  text: [{ k: 'text', label: 'fText', area: true }],
  wifi: [{ k: 'ssid', label: 'fSsid' }, { k: 'pass', label: 'fPass', type: 'text' }],
  email: [{ k: 'to', label: 'fTo', type: 'email', ph: 'hello@mycar.kz' }, { k: 'subject', label: 'fSubject' }, { k: 'body', label: 'fBody', area: true }],
  contact: [
    { k: 'first', label: 'fFirst', half: true }, { k: 'last', label: 'fLast', half: true },
    { k: 'org', label: 'fOrg', half: true }, { k: 'job', label: 'fJob', half: true },
    { k: 'phone', label: 'fPhone', type: 'tel', half: true, ph: '+7 700 000 00 00' }, { k: 'mail', label: 'fMail', type: 'email', half: true },
    { k: 'site', label: 'fSite', ph: 'mycar.kz' },
  ],
};

function buildTabs() {
  const el = $('typeTabs'); el.innerHTML = '';
  TABS.forEach((tb) => {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = t(tb.label);
    b.setAttribute('aria-selected', String(state.type === tb.id));
    b.onclick = () => { state.type = tb.id; buildTabs(); buildPanel(); onChange(true); };
    el.appendChild(b);
  });
}
function buildPanel() {
  const host = $('typePanels'); host.innerHTML = '';
  const defs = FIELDS[state.type];
  const wrap = document.createElement('div'); if (state.type === 'contact') wrap.className = 'field-grid';
  defs.forEach((d) => {
    const label = document.createElement('label'); label.className = 'field';
    if (state.type === 'contact' && !d.half) label.style.gridColumn = '1 / -1';
    const cap = document.createElement('span'); cap.textContent = t(d.label); label.appendChild(cap);
    const inp: HTMLInputElement | HTMLTextAreaElement = d.area ? document.createElement('textarea') : document.createElement('input');
    if (!d.area) (inp as HTMLInputElement).type = d.type || 'text';
    inp.value = state.fields[d.k] || ''; if (d.ph) inp.placeholder = d.ph; inp.autocomplete = 'off';
    if (d.type === 'url' || d.type === 'email') inp.setAttribute('inputmode', d.type);
    inp.oninput = () => { state.fields[d.k] = inp.value; onChange(false); };
    label.appendChild(inp); wrap.appendChild(label);
  });
  host.appendChild(wrap);
  if (state.type === 'wifi') {
    const row = document.createElement('div'); row.className = 'group';
    const lab = document.createElement('div'); lab.className = 'label'; lab.textContent = t('fSec'); row.appendChild(lab);
    const seg = document.createElement('div'); seg.className = 'seg'; row.appendChild(seg);
    segment(seg, [{ v: 'WPA', label: 'WPA/WPA2' }, { v: 'WEP', label: 'WEP' }, { v: 'nopass', label: t('secNone') }], () => state.fields.secType || 'WPA', (v) => { state.fields.secType = v; });
    host.appendChild(row);
    const tg = document.createElement('label'); tg.className = 'toggle-row';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.className = 'toggle'; cb.checked = state.fields.hidden === '1';
    cb.onchange = () => { state.fields.hidden = cb.checked ? '1' : '0'; onChange(false); };
    tg.append(cb, document.createTextNode(t('fHidden'))); host.appendChild(tg);
  }
}

/* ---------- style controls ---------- */
function syncColorInputs() {
  const set = (id: string, v: string) => { ($(id) as HTMLInputElement).value = v; };
  set('c1', state.c1); set('c1t', state.c1); set('c2', state.c2); set('c2t', state.c2); set('bg', state.bg); set('bgt', state.bg);
  set('m1', state.m1); set('m1t', state.m1); set('m2', state.m2); set('m2t', state.m2);
  ($('transparent') as HTMLInputElement).checked = state.transparent;
  ($('markersSame') as HTMLInputElement).checked = state.markersSame;
  $('c2wrap').hidden = state.colorMode !== 'gradient';
  $('dirGroup').hidden = state.colorMode !== 'gradient';
  $('markerColors').hidden = state.markersSame;
  ($('bg').closest('label') as HTMLElement).style.opacity = state.transparent ? '.4' : '1';
}
function bindColor(id: keyof State) {
  const pick = $(id as string) as HTMLInputElement, txt = $((id as string) + 't') as HTMLInputElement;
  pick.oninput = () => { (state as any)[id] = pick.value.toUpperCase(); txt.value = pick.value.toUpperCase(); state.preset = ''; markPreset(); onChange(false); };
  txt.oninput = () => {
    let v = txt.value.trim(); if (v && v[0] !== '#') v = '#' + v;
    if (/^#[0-9a-f]{6}$/i.test(v)) { (state as any)[id] = v.toUpperCase(); pick.value = v; state.preset = ''; markPreset(); onChange(false); }
  };
}
function markPreset() { buildPresets(); }

function buildPresets() {
  chips($('presetChips'), PRESETS.map((p) => ({ v: p.id, label: t(p.label), sw: p.swatch })), () => state.preset, (id) => {
    const p = PRESETS.find((x) => x.id === id)!; Object.assign(state, p.apply, { preset: id });
    buildStyleControls();
  });
}
function buildStyleControls() {
  buildPresets();
  segment($('logoSeg'), [{ v: 'none' as LogoId, label: t('none') }, { v: 'mycar' as LogoId, label: 'Mycar' }, { v: 'autocheck' as LogoId, label: 'Autocheck' }], () => state.logo, (v) => { state.logo = v; });
  chips($('dotChips'), ([['square', 'dSquare'], ['dots', 'dDots'], ['rounded', 'dRounded'], ['extra-rounded', 'dExtra'], ['classy', 'dClassy'], ['classy-rounded', 'dClassyR']] as [DotType, string][]).map(([v, l]) => ({ v, label: t(l) })), () => state.dots, (v) => { state.dots = v; });
  chips($('cornerSqChips'), ([['square', 'cSquare'], ['extra-rounded', 'dExtra'], ['dot', 'cDot']] as [CornerSq, string][]).map(([v, l]) => ({ v, label: t(l) })), () => state.cornerSq, (v) => { state.cornerSq = v; });
  chips($('cornerDotChips'), ([['square', 'cSquare'], ['dot', 'cDot']] as [CornerDot, string][]).map(([v, l]) => ({ v, label: t(l) })), () => state.cornerDot, (v) => { state.cornerDot = v; });
  segment($('colorModeSeg'), [{ v: 'solid', label: t('solid') }, { v: 'gradient', label: t('gradient') }], () => state.colorMode, (v) => { state.colorMode = v as State['colorMode']; state.preset = ''; syncColorInputs(); buildPresets(); });
  segment($('dirSeg'), [{ v: 'diag', label: t('diag') }, { v: 'horiz', label: t('horiz') }, { v: 'vert', label: t('vert') }, { v: 'radial', label: t('radial') }], () => (state.gradKind === 'radial' ? 'radial' : state.dir), (v) => {
    if (v === 'radial') state.gradKind = 'radial'; else { state.gradKind = 'linear'; state.dir = v as Dir; } state.preset = ''; buildPresets();
  });
  segment($('sizeSeg'), [512, 1024, 2048, 4096].map((n) => ({ v: n, label: String(n) })), () => state.size, (v) => { state.size = v; });
  segment($('quietSeg'), [{ v: 4, label: t('modules4') }, { v: 2, label: t('modules2') }, { v: 0, label: t('modules0') }], () => state.quiet, (v) => { state.quiet = v; });
  segment($('ecSeg'), [{ v: 'L', label: 'L · 7%' }, { v: 'M', label: 'M · 15%' }, { v: 'Q', label: 'Q · 25%' }, { v: 'H', label: 'H · 30%' }], () => state.ec, (v) => { state.ec = v as State['ec']; });
  $('ecHint').textContent = t('ecHint');
  syncColorInputs();
}

/* ---------- render loop ---------- */
let renderToken = 0; let lastSvg = ''; let debounce = 0;
function onChange(immediate: boolean) {
  syncColorInputs();
  clearTimeout(debounce);
  if (immediate) render(); else debounce = window.setTimeout(render, 120);
}
async function render() {
  const token = ++renderToken;
  const data = buildPayload();
  const preview = $('preview');
  ($('dlPng') as HTMLButtonElement).disabled = ($('dlSvg') as HTMLButtonElement).disabled = ($('copyPng') as HTMLButtonElement).disabled = !data;
  $('payloadText').textContent = data || '—';
  if (!data) { preview.innerHTML = `<div class="empty">${t('empty').replace('\n', '<br>')}</div>`; lastSvg = ''; return; }
  try {
    const svg = await buildSvg(data, 1024);
    if (token !== renderToken) return;
    lastSvg = svg; preview.innerHTML = svg;
    const el = preview.querySelector('svg'); if (el) { el.removeAttribute('width'); el.removeAttribute('height'); el.setAttribute('viewBox', '0 0 1024 1024'); }
  } catch (e) { console.error(e); }
  const warn = $('warn'); const msgs: string[] = [];
  if (!state.transparent && contrast(state.c1, state.bg) < 3) msgs.push(t('lowContrast'));
  if (state.colorMode === 'gradient' && !state.transparent && contrast(state.c2, state.bg) < 3) { if (!msgs.length) msgs.push(t('lowContrast')); }
  if (state.logo !== 'none' && (state.ec === 'L' || state.ec === 'M')) msgs.push(t('noLogoEc'));
  warn.hidden = !msgs.length; warn.textContent = msgs.join(' ');
}

async function exportSvg(): Promise<string> { return buildSvg(buildPayload(), state.size); }
$('dlSvg').onclick = async () => { const s = await exportSvg(); saveBlob(new Blob([s], { type: 'image/svg+xml' }), fileBase() + '.svg'); };
$('dlPng').onclick = async () => { const s = await exportSvg(); saveBlob(await svgToPng(s, state.size), `${fileBase()}-${state.size}.png`); };
$('copyPng').onclick = async () => {
  try {
    const s = await exportSvg(); const blob = await svgToPng(s, Math.min(state.size, 2048));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast(t('copied'));
  } catch { toast(t('copyFail')); }
};

/* ---------- theme & lang ---------- */
$('themeBtn').onclick = () => {
  const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = cur === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next;
  try { localStorage.setItem('mq-theme', next); } catch { /* noop */ }
};
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n!); });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((n) => n.setAttribute('aria-label', t(n.dataset.i18nAria!)));
  document.querySelectorAll<HTMLElement>('#langSeg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}
document.querySelectorAll<HTMLElement>('#langSeg button').forEach((b) => {
  b.onclick = () => { lang = b.dataset.lang as Lang; try { localStorage.setItem('mq-lang', lang); } catch { /* noop */ } applyLang(); buildTabs(); buildPanel(); buildStyleControls(); render(); };
});
$('transparent').onchange = () => { state.transparent = ($('transparent') as HTMLInputElement).checked; onChange(true); };
$('markersSame').onchange = () => { state.markersSame = ($('markersSame') as HTMLInputElement).checked; onChange(true); };
(['c1', 'c2', 'bg', 'm1', 'm2'] as (keyof State)[]).forEach(bindColor);

Object.assign(state, PRESETS[0].apply);
applyLang(); buildTabs(); buildPanel(); buildStyleControls(); render();
