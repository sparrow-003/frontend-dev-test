#!/usr/bin/env node
// Postbuild: synthesize dist/client/index.html so the app can be hosted
// as a SPA on static platforms like Vercel. The TanStack Start build
// targets a Worker by default and does not emit an index.html — this
// script fills that gap by scanning the client assets and writing a
// minimal HTML shell that boots the client bundle.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = join(process.cwd(), "dist", "client");
const assetsDir = join(clientDir, "assets");

if (!existsSync(assetsDir)) {
  console.error("[postbuild-spa] dist/client/assets not found — did the build run?");
  process.exit(1);
}

const files = readdirSync(assetsDir);
const jsFiles = files.filter((f) => f.endsWith(".js"));
const cssFiles = files.filter((f) => f.endsWith(".css"));

if (jsFiles.length === 0) {
  console.error("[postbuild-spa] No JS assets found in dist/client/assets");
  process.exit(1);
}

// The smaller index-*.js is typically the bootstrap; the larger is the route chunk.
// Preload both, but only one needs to be the entry <script>.
// Sort by size ascending — smaller file is the entry shim.
const jsWithSize = jsFiles.map((f) => {
  const stat = readdirSync(assetsDir, { withFileTypes: true });
  return f;
});

const modulePreloads = jsFiles
  .map((f) => `    <link rel="modulepreload" crossorigin href="/assets/${f}">`)
  .join("\n");

const stylesheets = cssFiles
  .map((f) => `    <link rel="stylesheet" crossorigin href="/assets/${f}">`)
  .join("\n");

// Pick the entry: prefer one that imports the others. As a heuristic, the
// larger index-*.js is usually the main bundle that pulls in the router chunk.
const entry = jsFiles.sort((a, b) => b.length - a.length)[0];

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Companies Directory</title>
    <meta name="description" content="Browse a curated directory of companies. Filter by industry, location and size, sort by rating or year founded, and switch between grid and table views." />
    <meta property="og:title" content="Companies Directory — Discover innovators worldwide" />
    <meta property="og:description" content="Filter, sort and explore a handpicked directory of companies across industries." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
${stylesheets}
${modulePreloads}
  </head>
  <body>
    <div id="root"></div>
${jsFiles.map((f) => `    <script type="module" crossorigin src="/assets/${f}"></script>`).join("\n")}
  </body>
</html>
`;

writeFileSync(join(clientDir, "index.html"), html);
console.log(`[postbuild-spa] Wrote dist/client/index.html (entry: ${entry})`);
