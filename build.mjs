import { readFile, writeFile } from 'node:fs/promises';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [template, tokens, styles, menu, app] = await Promise.all([
  read('index.template.html'), read('design-tokens.css'), read('style.css'),
  read('menu.json'), read('app.js'),
]);
const built = template
  .replace('<!-- BUILD:STYLES -->', `<style>${tokens}\n${styles}</style>`)
  .replace('<!-- BUILD:MENU -->', `<script id="menu-data" type="application/json">${menu.replaceAll('<', '\\u003c')}</script>`)
  .replace('<!-- BUILD:APP -->', `<script>${app}</script>`);
if (/<!-- BUILD:|<link rel="stylesheet"|<script src="app\.js"/.test(built)) throw new Error('Unresolved build marker or external render-blocking asset');
await writeFile(new URL('index.html', import.meta.url), built);
console.log(`Built index.html (${Buffer.byteLength(built)} bytes) from menu.json and local UI sources.`);
