#!/usr/bin/env node
// Postbuild: synthesize dist/client/index.html so the app can be hosted
// as a SPA on static platforms like Vercel. The TanStack Start build
// targets a Worker by default and does not emit an index.html — this
// script fills that gap by scanning the client assets and writing a
// minimal HTML shell that boots the client bundle.
//
// IMPORTANT: Vite code-splits the client into multiple chunks. Exactly ONE
// of them is the entry that imports the others. Loading every chunk as a
// <script type="module"> causes vendor bundles to execute twice (once via
// the script tag, once via the entry's import) — which double-initializes
// React and renders a blank page. We detect the entry by reading each JS
// file and checking which ones import the others; the file that is NOT
// imported by any other file is the entry.
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
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

// Identify the entry: the JS file that is NOT imported by any other JS file.
// Read each file once and look for import specifiers that reference siblings.
const fileContents = Object.fromEntries(
  jsFiles.map((f) => [f, readFileSync(join(assetsDir, f), "utf8")]),
);

const importedBySomeone = new Set();
for (const [, content] of Object.entries(fileContents)) {
  for (const other of jsFiles) {
    if (content.includes(`./${other}`)) {
      importedBySomeone.add(other);
    }
  }
}

const entryCandidates = jsFiles.filter((f) => !importedBySomeone.has(f));
// If detection is ambiguous, fall back to the smallest JS file — it's almost
// always the entry shim that pulls in the larger vendor/router chunk.
const entry =
  entryCandidates.length === 1
    ? entryCandidates[0]
    : jsFiles
        .map((f) => ({ f, size: fileContents[f].length }))
        .sort((a, b) => a.size - b.size)[0].f;

// All non-entry chunks are dependencies — preload them so the browser can
// fetch them in parallel with the entry. Do NOT add them as <script> tags
// or they will execute twice (once standalone, once via the entry's import).
const otherJs = jsFiles.filter((f) => f !== entry);

const stylesheets = cssFiles
  .map((f) => `    <link rel="stylesheet" crossorigin href="/assets/${f}">`)
  .join("\n");

const modulePreloads = otherJs
  .map((f) => `    <link rel="modulepreload" crossorigin href="/assets/${f}">`)
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Companies Directory — Discover innovators worldwide</title>
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
    <script type="module" crossorigin src="/assets/${entry}"></script>
  </body>
</html>
`;

writeFileSync(join(clientDir, "index.html"), html);
console.log(
  `[postbuild-spa] Wrote dist/client/index.html (entry: ${entry}, preloaded: ${otherJs.join(", ") || "none"})`,
);
