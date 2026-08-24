import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Arabic RTL portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ar"[^>]*dir="rtl"/);
  assert.match(html, /جاهزية تقود/);
  assert.match(html, /تنفيذ يصنع/);
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
