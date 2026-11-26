// Inline bundled UI JS into ui.html so it's a single self-contained file.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '..', 'dist', 'ui.js'), 'utf8');

const result = html.replace('__JS__', js);
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'ui.html'), result);
console.log('ui.html written to dist/');
