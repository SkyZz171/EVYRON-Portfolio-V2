// @ts-check
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const htmlFiles = fs.readdirSync(root)
  .filter(file => file.endsWith('.html'))
  .concat(fs.readdirSync(path.join(root, 'blog')).filter(file => file.endsWith('.html')).map(file => `blog/${file}`))
  .concat(fs.readdirSync(path.join(root, 'services')).filter(file => file.endsWith('.html')).map(file => `services/${file}`))
  .filter((file, index, files) => files.indexOf(file) === index);
const indexablePages = htmlFiles.filter(file => !['404.html', 'BingSiteAuth.xml', 'googledacbd4164acedbd8.html', 'cgv.html', 'mentions-legales.html', 'merci.html', 'politique-de-confidentialite.html', 'politique-de-cookies.html'].includes(file));

function firstMatch(html, pattern, file) {
  const match = html.match(pattern);
  assert.ok(match, `${file} is missing ${pattern}`);
  return match[1];
}

test('indexable pages expose unique canonical URLs and useful descriptions', () => {
  const canonicals = new Set();
  for (const file of indexablePages) {
    const html = read(file);
    const canonical = firstMatch(html, /<link rel="canonical" href="([^"]+)">/, file);
    const description = firstMatch(html, /<meta name="description" content="([^"]+)">/, file);
    assert.ok(description.length >= 80, `${file} has a short meta description`);
    assert.ok(!canonical.includes('[À RENSEIGNER]'), `${file} has a placeholder canonical`);
    assert.equal(canonicals.has(canonical), false, `duplicate canonical URL: ${canonical}`);
    canonicals.add(canonical);
  }
});

test('article social metadata matches each article URL and title', () => {
  for (const file of htmlFiles.filter(file => file.startsWith('blog/') && file !== 'blog/index.html')) {
    const html = read(file);
    const canonical = firstMatch(html, /<link rel="canonical" href="([^"]+)">/, file);
    const ogUrl = firstMatch(html, /<meta property="og:url" content="([^"]+)">/, file);
    const title = firstMatch(html, /<title>([^<]+)<\/title>/, file);
    const ogTitle = firstMatch(html, /<meta property="og:title" content="([^"]+)">/, file);
    assert.equal(ogUrl, canonical, `${file} has a mismatched Open Graph URL`);
    assert.equal(ogTitle, title, `${file} has a mismatched Open Graph title`);
  }
});

test('JSON-LD is valid and contains no placeholder business data', () => {
  for (const file of indexablePages) {
    const html = read(file);
    assert.equal(html.includes('[À RENSEIGNER]'), false, `${file} contains placeholder structured data`);
    for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => JSON.parse(block[1]), `${file} contains invalid JSON-LD`);
    }
  }
});

test('national landing page is linked and included in the sitemap', () => {
  const index = read('index.html');
  const blogIndex = read('blog/index.html');
  const sitemap = read('sitemap.xml');
  assert.match(index, /href="\/agence-web-france"/);
  assert.match(blogIndex, /href="\.\.\/agence-web-france"/);
  assert.match(sitemap, /<loc>https:\/\/www\.evyron\.fr\/agence-web-france<\/loc>/);
  assert.match(read('vercel.json'), /"source": "\/agence-web-france"/);
});
