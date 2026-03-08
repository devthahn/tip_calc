/**
 * Post-build script: adds maximum-scale=1, user-scalable=no to the viewport meta tag
 * in dist/index.html to prevent iOS Safari pinch-to-zoom conflicts with touch interactions.
 */
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html not found. Run "expo export -p web" first.');
    process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

const oldViewport = 'content="width=device-width, initial-scale=1, shrink-to-fit=no"';
const newViewport = 'content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no"';

if (html.includes(newViewport)) {
    console.log('✅ Viewport already patched.');
} else if (html.includes(oldViewport)) {
    html = html.replace(oldViewport, newViewport);
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✅ Viewport patched: added maximum-scale=1, user-scalable=no');
} else {
    console.warn('⚠️ Could not find expected viewport meta tag to patch.');
}
