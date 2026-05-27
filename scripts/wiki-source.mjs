import { createHash } from "node:crypto";

const wikiRawUrl =
  "https://raw.githubusercontent.com/wiki/qbittorrent/search-plugins/Unofficial-search-plugins.mediawiki";
const wikiPageUrl =
  "https://github.com/qbittorrent/search-plugins/wiki/Unofficial-search-plugins";
const requestHeaders = {
  "User-Agent": "qbittorrent-plugin-bundle-site-generator/1.0",
};

async function fetchText(url) {
  const response = await fetch(url, { headers: requestHeaders });
  if (!response.ok) {
    throw new Error(
      `Request failed for ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

function createContentHash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function extractWikiUpdatedAt(pageHtml) {
  const match = pageHtml.match(/<relative-time[^>]+datetime="([^"]+)"/i);
  if (!match?.[1]) {
    throw new Error("Could not find the wiki page update timestamp.");
  }

  return match[1];
}

async function fetchWikiSnapshot() {
  const [wikiSource, wikiPageHtml] = await Promise.all([
    fetchText(wikiRawUrl),
    fetchText(wikiPageUrl),
  ]);

  return {
    wikiSource,
    sourceWikiUrl: wikiPageUrl,
    sourceWikiRawUrl: wikiRawUrl,
    sourceWikiUpdatedAt: extractWikiUpdatedAt(wikiPageHtml),
    sourceWikiContentHash: createContentHash(wikiSource),
  };
}

export {
  fetchText,
  fetchWikiSnapshot,
  requestHeaders,
  wikiPageUrl,
  wikiRawUrl,
};
