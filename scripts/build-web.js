// Bundles the standalone web version into dist-web/ (deployed to GitHub Pages).
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'dist-web');
const serve = process.argv.includes('--serve');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ['styles.css', 'favicon.svg']) fs.copyFileSync(path.join(root, 'web', f), path.join(out, f));
// version the asset URLs so a new deploy is never served from the browser cache (GitHub Pages caches files for 10 minutes)
const v = Date.now().toString(36);
fs.writeFileSync(path.join(out, 'index.html'), fs.readFileSync(path.join(root, 'web', 'index.html'), 'utf8').replace('styles.css', 'styles.css?v=' + v).replace('app.js', 'app.js?v=' + v));
fs.writeFileSync(path.join(out, '.nojekyll'), '');

// embed bundle: body markup of index.html (without the script tags) is inlined as text
const html = fs.readFileSync(path.join(root, 'web', 'index.html'), 'utf8');
const bodyHtml = html.slice(html.indexOf('<body>') + 6, html.indexOf('<script src="app.js">')).replace(/<script[\s\S]*?<\/script>/g, '');
fs.mkdirSync(path.join(root, 'web', '.generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'web', '.generated', 'body.html'), bodyHtml);
const embedOpts = { entryPoints: [path.join(root, 'web', 'embed.ts')], bundle: true, outfile: path.join(out, 'embed.js'), target: 'es2019', minify: !serve, sourcemap: serve, loader: { '.css': 'text', '.html': 'text' }, format: 'iife' };

const opts = { entryPoints: [path.join(root, 'web', 'main.ts')], bundle: true, outfile: path.join(out, 'app.js'), target: 'es2019', minify: !serve, sourcemap: serve };
(async () => {
  if (serve) {
    const ctx = await esbuild.context(opts);
    await ctx.watch();
    const { port } = await ctx.serve({ servedir: out, port: 5173 });
    console.log('http://localhost:' + port);
  } else {
    await esbuild.build(opts);
    await esbuild.build(embedOpts);
    console.log('dist-web/ built');
  }
})();
