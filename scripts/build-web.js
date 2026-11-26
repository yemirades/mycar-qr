// Bundles the standalone web version into dist-web/ (deployed to GitHub Pages).
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'dist-web');
const serve = process.argv.includes('--serve');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'styles.css', 'favicon.svg']) fs.copyFileSync(path.join(root, 'web', f), path.join(out, f));
fs.writeFileSync(path.join(out, '.nojekyll'), '');

const opts = { entryPoints: [path.join(root, 'web', 'main.ts')], bundle: true, outfile: path.join(out, 'app.js'), target: 'es2019', minify: !serve, sourcemap: serve };
(async () => {
  if (serve) {
    const ctx = await esbuild.context(opts);
    await ctx.watch();
    const { port } = await ctx.serve({ servedir: out, port: 5173 });
    console.log('http://localhost:' + port);
  } else {
    await esbuild.build(opts);
    console.log('dist-web/ built');
  }
})();
