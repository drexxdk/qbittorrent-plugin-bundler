import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";
import { fetchWikiSnapshot } from "./wiki-source.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputZipPath = path.join(
  rootDir,
  "public",
  "downloads",
  "qbittorrent-search-plugins-latest.zip",
);
const outputMetaPath = path.join(rootDir, "src", "generated", "bundle-meta.ts");
const outputPublicMetaPath = path.join(rootDir, "public", "bundle-meta.json");
const sections = [
  { title: "Plugins for Public Sites", slug: "public" },
  { title: "Plugins for Private Sites", slug: "private" },
];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanText(value) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/'''/g, "")
    .replace(/''/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function extractExternalLinks(cell) {
  const links = [];
  const pattern = /\[(https?:\/\/[^\s\]]+)\s+([^\]]+)\]/g;

  for (const match of cell.matchAll(pattern)) {
    links.push({ url: match[1], label: cleanText(match[2]) });
  }

  return links;
}

function extractEngineName(cell) {
  const links = extractExternalLinks(cell);
  if (links.length > 0) {
    return links.at(-1).label;
  }

  return cleanText(cell);
}

function extractDownloadUrl(cell) {
  const links = extractExternalLinks(cell);
  return (
    links.find(
      ({ url }) =>
        /\.py([?#].*)?$/i.test(url) ||
        /raw|githubusercontent|Scare\.ca/i.test(url),
    )?.url ?? links[0]?.url
  );
}

function normalizeDownloadUrl(url) {
  const parsed = new URL(url.replace(/^http:\/\//, "https://"));
  parsed.hash = "";

  if (parsed.hostname === "github.com") {
    const segments = parsed.pathname.split("/").filter(Boolean);
    const blobIndex = segments.indexOf("blob");
    if (blobIndex > 1 && blobIndex < segments.length - 1) {
      const owner = segments[0];
      const repo = segments[1];
      const branch = segments[blobIndex + 1];
      const filePath = segments.slice(blobIndex + 2).join("/");
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    }
  }

  return parsed.toString();
}

function getSectionTable(source, title) {
  const sectionStart = source.indexOf(`== ${title} ==`);
  if (sectionStart === -1) {
    throw new Error(`Could not find section: ${title}`);
  }

  const tableStart = source.indexOf("{|", sectionStart);
  const tableEnd = source.indexOf("|}", tableStart);
  if (tableStart === -1 || tableEnd === -1) {
    throw new Error(`Could not find table for section: ${title}`);
  }

  return source.slice(tableStart, tableEnd);
}

function parseRows(tableSource, sectionSlug) {
  return tableSource
    .split("\n|-\n")
    .slice(2)
    .map((chunk) =>
      chunk
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("|"))
        .map((line) => line.replace(/^\|\s?/, "").trim()),
    )
    .filter((cells) => cells.length >= 6)
    .map((cells) => {
      const downloadUrl = extractDownloadUrl(cells[4]);
      if (!downloadUrl) {
        return null;
      }

      return {
        section: sectionSlug,
        engineName: extractEngineName(cells[0]),
        author: cleanText(cells[1]),
        version: cleanText(cells[2]),
        lastUpdated: cleanText(cells[3]),
        downloadUrl: normalizeDownloadUrl(downloadUrl),
        comments: cleanText(cells[5]),
      };
    })
    .filter(Boolean);
}

function pickFileName(plugin, usedNames) {
  const urlPath = decodeURIComponent(new URL(plugin.downloadUrl).pathname);
  const rawName = path.basename(urlPath) || `${slugify(plugin.engineName)}.py`;
  const withExtension = rawName.endsWith(".py") ? rawName : `${rawName}.py`;

  let candidate = withExtension;
  if (usedNames.has(candidate)) {
    candidate = `${slugify(plugin.engineName)}-${withExtension}`;
  }

  let counter = 2;
  while (usedNames.has(candidate)) {
    candidate = `${slugify(plugin.engineName)}-${counter}-${withExtension}`;
    counter += 1;
  }

  usedNames.add(candidate);
  return candidate;
}

async function downloadPlugin(plugin, zip, usedNames) {
  const response = await fetch(plugin.downloadUrl, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const finalUrl = response.url || plugin.downloadUrl;
  const buffer = Buffer.from(await response.arrayBuffer());
  const fileName = pickFileName(
    { ...plugin, downloadUrl: finalUrl },
    usedNames,
  );
  zip.file(`${plugin.section}/${fileName}`, buffer);

  return {
    ...plugin,
    downloadUrl: finalUrl,
    fileName,
    byteSize: buffer.byteLength,
  };
}

function renderMetaModule(meta) {
  return `export const bundleMeta = ${JSON.stringify(meta, null, 2)} as const\n`;
}

async function main() {
  const { wikiSource, ...wikiRevision } = await fetchWikiSnapshot();
  const zip = new JSZip();
  const usedNames = new Set();

  const discoveredPlugins = sections.flatMap(({ title, slug }) =>
    parseRows(getSectionTable(wikiSource, title), slug),
  );
  const downloadedPlugins = [];
  const skippedPlugins = [];

  for (const plugin of discoveredPlugins) {
    try {
      const downloaded = await downloadPlugin(plugin, zip, usedNames);
      downloadedPlugins.push(downloaded);
    } catch (error) {
      skippedPlugins.push({
        engineName: plugin.engineName,
        section: plugin.section,
        downloadUrl: plugin.downloadUrl,
        reason: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  downloadedPlugins.sort((left, right) =>
    left.engineName.localeCompare(right.engineName),
  );

  const generatedAt = new Date().toISOString();
  const sectionCounts = sections.map(({ slug, title }) => ({
    key: slug,
    title,
    count: downloadedPlugins.filter((plugin) => plugin.section === slug).length,
  }));

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  const meta = {
    generatedAt,
    ...wikiRevision,
    zipFileName: path.basename(outputZipPath),
    pluginCount: downloadedPlugins.length,
    skippedCount: skippedPlugins.length,
    zipByteSize: zipBuffer.byteLength,
    sections: sectionCounts,
    plugins: downloadedPlugins,
    skippedPlugins,
  };

  await mkdir(path.dirname(outputZipPath), { recursive: true });
  await mkdir(path.dirname(outputMetaPath), { recursive: true });
  await mkdir(path.dirname(outputPublicMetaPath), { recursive: true });
  await writeFile(outputZipPath, zipBuffer);
  await writeFile(outputMetaPath, renderMetaModule(meta));
  await writeFile(outputPublicMetaPath, `${JSON.stringify(meta, null, 2)}\n`);

  await rm(path.join(rootDir, "tmp-wiki"), { recursive: true, force: true });

  console.log(
    `Generated ${downloadedPlugins.length} plugins into ${outputZipPath}`,
  );
  if (skippedPlugins.length > 0) {
    console.log(`Skipped ${skippedPlugins.length} plugins.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
