import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test, { after, before } from "node:test";

const port = 43123;
const baseUrl = `http://127.0.0.1:${port}`;
let server;

before(async () => {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
    stdio: "ignore",
  });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Next.js production server did not start in time.");
});

after(() => {
  server?.kill();
});

async function render(pathname = "/") {
  return fetch(`${baseUrl}${pathname}`, { headers: { accept: "text/html" } });
}

test("renders the Arabic RTL portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ar"[^>]*dir="rtl"/);
  assert.match(html, /جاهزية تقود/);
  assert.match(html, /تنفيذ يصنع/);
  assert.match(html, /من الفرصة إلى الأثر، بوضوح/);
  assert.match(html, /manzoumah-header-logo\.png/);
  assert.match(html, /manzoumah-stacked\.jpeg/);
  assert.match(html, /ثلاث خدمات\. مسار واحد/);
  assert.match(html, /class="impact-sequence"/);
  assert.match(html, /class="kinetic-rail"/);
  assert.match(html, /https:\/\/wa\.me\/966590813714/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("serves sitemap and robots metadata routes", async () => {
  const [sitemap, robots] = await Promise.all([render("/sitemap.xml"), render("/robots.txt")]);
  assert.equal(sitemap.status, 200);
  assert.equal(robots.status, 200);
  assert.match(await sitemap.text(), /<urlset/);
  assert.match(await robots.text(), /User-Agent: \*/);
});
