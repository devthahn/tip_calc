/**
 * Post-build script: patches viewport meta tag and CSS resets in dist/index.html
 * to prevent iOS Safari horizontal scroll, shifts, and pinch-to-zoom issues.
 */
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html not found. Run "expo export -p web" first.');
    process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Patch viewport meta tag
const targetViewport = 'content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"';
html = html.replace(/content="width=device-width[^"]*"/, targetViewport);

// 2. Patch expo-reset styles to lock horizontal overflow and prevent iOS Safari keyboard shifts
const improvedResetStyle = `<style id="expo-reset">
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        overflow-x: hidden;
        -webkit-text-size-adjust: 100%;
        overscroll-behavior: none;
      }
      #root {
        display: flex;
        width: 100%;
        max-width: 100%;
        height: 100%;
        flex: 1;
        overflow: hidden;
        overflow-x: hidden;
      }
    </style>`;

html = html.replace(/<style id="expo-reset">[\s\S]*?<\/style>/, improvedResetStyle);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Viewport and reset styles successfully patched in dist/index.html');

