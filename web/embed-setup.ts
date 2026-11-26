// Entry for embedding into another page (e.g. Tilda): <div id="mycar-qr"></div><script src=".../embed.js"></script>
// Everything lives in a Shadow DOM, so the host page's CSS cannot affect it and `position: sticky` / `fixed` behave natively.
import css from './styles.css';
import body from './.generated/body.html';

const mount = document.getElementById('mycar-qr') || (() => {
  const d = document.createElement('div'); d.id = 'mycar-qr';
  (document.currentScript?.parentElement || document.body).insertBefore(d, document.currentScript || null);
  return d;
})();
const shadow = mount.attachShadow({ mode: 'open' });

// :root / html / body rules of the page stylesheet become :host / wrapper rules inside the shadow tree
const scoped = css
  .replace(/:root\[data-theme="(\w+)"\]/g, ':host([data-theme="$1"])')
  .replace(/:root:not\(\[data-theme="light"\]\):not\(\[data-theme="dark"\]\)/g, ':host(:not([data-theme="light"]):not([data-theme="dark"]))')
  .replace(/:root \{/g, ':host {')
  .replace(/(^|\n)body \{/g, '$1.mq-body {');
// inherited properties set on the host by the page (outer rules beat :host) are reset on our wrapper
const reset = '.mq-body { letter-spacing: normal; word-spacing: normal; text-transform: none; text-indent: 0; text-shadow: none; text-align: left; font-style: normal; direction: ltr; }';
shadow.innerHTML = `<style>:host { all: initial; display: block; }\n${scoped}\n${reset}</style><div class="mq-body">${body}</div>`;

// fonts must be declared in the main document
if (!document.querySelector('link[data-mq-font]')) {
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.setAttribute('data-mq-font', '');
  l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(l);
}
try { const th = localStorage.getItem('mq-theme'); if (th) mount.dataset.theme = th; } catch { /* noop */ }

(window as any).__MQ_ROOT = shadow;
(window as any).__MQ_HOST = mount;
