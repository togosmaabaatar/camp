const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const output = path.join(root, 'dist');
fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
const files = ['index.html', 'stay.html', 'experiences.html', 'about.html', 'getting-here.html', 'contact.html', 'styles.css', 'script.js', 'config.js'];
for (const file of files) fs.copyFileSync(path.join(root, file), path.join(output, file));
for (const file of ['hero.jpg', 'ger.jpg', 'cabin.jpg', 'mark.svg']) fs.copyFileSync(path.join(root, 'assets', file), path.join(output, 'assets', file));
console.log('Built 6 pages and their assets in dist/.');
