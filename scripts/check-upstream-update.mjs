import { appendFile } from "node:fs/promises";
import { fetchWikiSnapshot } from "./wiki-source.mjs";

const liveMetaUrl = process.env.LIVE_META_URL;
const forceDeploy = process.env.FORCE_DEPLOY === "true";
const forceReason = process.env.FORCE_REASON || "forced";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function shortHash(value) {
  return value ? value.slice(0, 12) : "none";
}

async function fetchLiveMeta(url) {
  if (!url) {
    return null;
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "qbittorrent-plugin-bundle-site-generator/1.0",
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Request failed for ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

async function writeOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  await appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

async function writeSummary(lines) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
    return;
  }

  console.log(lines.join("\n"));
}

async function main() {
  const { wikiSource: _wikiSource, ...currentWiki } = await fetchWikiSnapshot();
  const liveMeta = await fetchLiveMeta(liveMetaUrl);
  const liveHash = liveMeta?.sourceWikiContentHash ?? "";
  const liveUpdatedAt = liveMeta?.sourceWikiUpdatedAt ?? "";

  const shouldDeploy =
    forceDeploy || !liveHash || liveHash !== currentWiki.sourceWikiContentHash;
  const reason = forceDeploy
    ? forceReason
    : !liveHash
      ? "missing-live-metadata"
      : shouldDeploy
        ? "source-changed"
        : "source-unchanged";

  await Promise.all([
    writeOutput("should_deploy", shouldDeploy ? "true" : "false"),
    writeOutput("reason", reason),
    writeOutput("source_wiki_updated_at", currentWiki.sourceWikiUpdatedAt),
    writeOutput("source_wiki_content_hash", currentWiki.sourceWikiContentHash),
  ]);

  const resultLine = shouldDeploy
    ? reason === "push-update"
      ? "A push to the deployment branch triggered a site rebuild and deploy."
      : reason === "manual-force"
        ? "A manual force run triggered a site rebuild and deploy."
        : "Build and deploy will run."
    : "No upstream wiki change detected. Build and deploy will be skipped.";

  await writeSummary([
    "## Upstream wiki check",
    "",
    `- Current wiki update: ${formatDate(currentWiki.sourceWikiUpdatedAt)} UTC`,
    `- Current wiki hash: ${shortHash(currentWiki.sourceWikiContentHash)}`,
    `- Live site wiki update: ${liveUpdatedAt ? `${formatDate(liveUpdatedAt)} UTC` : "not available"}`,
    `- Live site wiki hash: ${shortHash(liveHash)}`,
    `- Result: ${resultLine}`,
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
