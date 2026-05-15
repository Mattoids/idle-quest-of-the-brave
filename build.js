/**
 * build.js - 将 index.html + css/style.css + js/game.js 合并压缩为 dist/index.html
 *
 * 用法：node build.js
 */

const fs = require('fs');
const path = require('path');

const SRC_HTML = 'index.html';
const SRC_CSS = 'css/style.css';
const SRC_JS = 'js/game.js';
const OUT_DIR = 'dist';
const OUT_FILE = path.join(OUT_DIR, 'index.html');

function read(file) {
    return fs.readFileSync(file, 'utf-8');
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function mkToken(i) {
    return `__T${i}__`;
}

// CSS 激进压缩
function minifyCss(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')              // 移除 /* */
        .replace(/\s+/g, ' ')                           // 所有空白变单个空格
        .replace(/\s*([][{}:;,>+~()])\s*/g, '$1')          // 移除符号两侧空白
        .replace(/;}/g, '}')                            // 移除块末尾分号
        .replace(/\b0\s*(px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)/g, '0') // 0 去单位
        .replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3') // #aabbcc -> #abc
        .replace(/^\s+|\s+$/g, '')
        .trim();
}

// JS 激进压缩：保护字符串/正则/模板字面量后，移除所有注释和空白
function minifyJs(js) {
    const tokens = [];

    function saveToken(val) {
        const idx = tokens.length;
        tokens.push(val);
        return mkToken(idx);
    }

    // 保护正则字面量（跟在特定字符/关键字后面的 /）
    // 注意：必须在保护字符串之前执行，因为字符串保护会把正则字面量中的引号也保护起来
    js = js.replace(/(?<=[(,=:![+\-~;]|return|throw|void|typeof|instanceof|in|of|delete|new|yield|await)\s*\/([^\/\\]|\\.)+\/[dgimsuy]*/g, (m) => saveToken(m.trim()));

    // 保护模板字符串
    js = js.replace(/`(?:[^`\\]|\\.)*`/g, (m) => saveToken(m));

    // 保护普通字符串（不跨行）
    js = js.replace(/(["'])(?:(?!\1)[^\\\n]|\\.)*\1/g, (m) => saveToken(m));

    // 移除注释
    js = js.replace(/\/\*[\s\S]*?\*\//g, '');
    js = js.replace(/\/\/.*$/gm, '');

    // 将所有空白压缩为单个空格
    js = js.replace(/\s+/g, ' ');

    // 安全地移除运算符/标点两侧的空格（不会破坏关键字）
    const ops = '{}();,=+-*/<>!&|?:[].~%^;';
    const opRe = new RegExp(`\\s*([${ops.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}])\\s*`, 'g');
    js = js.replace(opRe, '$1');

    // 恢复 token（按索引从大到小，避免嵌套替换）
    for (let i = tokens.length - 1; i >= 0; i--) {
        js = js.split(mkToken(i)).join(tokens[i]);
    }

    return js.trim();
}

// HTML 激进压缩
function minifyHtml(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .replace(/^\s+|\s+$/g, '')
        .trim();
}

function build() {
    console.log('开始构建...');

    let html = read(SRC_HTML);
    const css = read(SRC_CSS);
    const js = read(SRC_JS);

    const cssMin = minifyCss(css);
    const jsMin = minifyJs(js);

    // 将 CSS 链接替换为内联 style
    html = html.replace(
        /<link[^>]+rel=["']stylesheet["'][^>]+href=["']css\/style\.css["'][^>]*>/i,
        `<style>${cssMin}</style>`
    );

    // 将 JS 引用替换为内联 script
    html = html.replace(
        /<script[^>]+src=["']js\/game\.js["'][^>]*><\/script>/i,
        `<script>${jsMin}</script>`
    );

    // 整体压缩 HTML
    html = minifyHtml(html);

    ensureDir(OUT_DIR);
    fs.writeFileSync(OUT_FILE, html, 'utf-8');

    const outSize = fs.statSync(OUT_FILE).size;
    console.log(`构建完成: ${OUT_FILE}`);
    console.log(`输出体积: ${(outSize / 1024).toFixed(1)} KB`);
    console.log(`CSS 压缩: ${css.length} → ${cssMin.length} (${((1 - cssMin.length / css.length) * 100).toFixed(0)}%)`);
    console.log(`JS 压缩: ${js.length} → ${jsMin.length} (${((1 - jsMin.length / js.length) * 100).toFixed(0)}%)`);
}

build();
