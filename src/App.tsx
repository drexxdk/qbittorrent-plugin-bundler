import { FaGithub } from "react-icons/fa";
import {
  FaArrowUpRightFromSquare,
  FaBoxArchive,
  FaClock,
  FaDownload,
  FaFileZipper,
  FaForward,
  FaRotate,
  FaSitemap,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { bundleMeta } from "./generated/bundle-meta";

const repoUrl =
  import.meta.env.VITE_REPO_URL ??
  "https://github.com/drexxdk/qbittorrent-search-plugin-bundle";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}

function formatBytes(bytes: number) {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 1,
  }).format(bytes / (1024 * 1024));
}

function App() {
  const downloadHref = `./downloads/${bundleMeta.zipFileName}`;
  const refreshedAt = formatDate(bundleMeta.generatedAt);
  const upstreamUpdatedAt = formatDate(bundleMeta.sourceWikiUpdatedAt);
  const skippedPlugins = bundleMeta.skippedPlugins;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5efe4_0%,#f8f5ee_42%,#fcfbf7_100%)] text-stone-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
        <section className="overflow-hidden rounded-[2rem] border border-stone-300/80 bg-white/90 shadow-[0_30px_80px_rgba(76,55,31,0.12)] backdrop-blur">
          <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.5fr_0.9fr] lg:px-10 lg:py-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-['Space_Grotesk',sans-serif] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                  qBittorrent search plugin bundle
                </p>
                <p className="max-w-2xl text-lg leading-7 text-stone-700">
                  One zip file with the latest reachable plugins from the
                  qBittorrent community wiki.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 lg:items-start">
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-stone-800"
                  href={downloadHref}
                >
                  <FaDownload className="text-lg" aria-hidden="true" />
                  Download bundle
                </a>
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-stone-700 lg:justify-start">
                  <a
                    className="inline-flex items-center gap-1.5 transition hover:text-stone-950"
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaGithub aria-hidden="true" />
                    View GitHub repo
                  </a>
                  <a
                    className="inline-flex items-center gap-1.5 transition hover:text-stone-950"
                    href={bundleMeta.sourceWikiUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaArrowUpRightFromSquare aria-hidden="true" />
                    Open source wiki
                  </a>
                </div>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-stone-200 bg-stone-950 p-6 text-stone-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-stone-400">
                <FaBoxArchive aria-hidden="true" />
                Bundle snapshot
              </p>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <dt className="inline-flex items-center gap-2 text-sm text-stone-400">
                    <FaClock aria-hidden="true" />
                    Upstream wiki updated
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {upstreamUpdatedAt}
                  </dd>
                </div>
                <div>
                  <dt className="inline-flex items-center gap-2 text-sm text-stone-400">
                    <FaRotate aria-hidden="true" />
                    Bundle last refreshed
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">{refreshedAt}</dd>
                </div>
                <div>
                  <dt className="inline-flex items-center gap-2 text-sm text-stone-400">
                    <FaSitemap aria-hidden="true" />
                    Plugins included
                  </dt>
                  <dd className="mt-1 text-3xl font-bold">
                    {bundleMeta.pluginCount}
                  </dd>
                </div>
                <div>
                  <dt className="inline-flex items-center gap-2 text-sm text-stone-400">
                    <FaForward aria-hidden="true" />
                    Skipped during build
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {bundleMeta.skippedCount}
                  </dd>
                </div>
                <div>
                  <dt className="inline-flex items-center gap-2 text-sm text-stone-400">
                    <FaFileZipper aria-hidden="true" />
                    Zip size
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {formatBytes(bundleMeta.zipByteSize)} MB
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section>
          <article className="rounded-[1.75rem] border border-amber-300/80 bg-amber-50/90 p-6 shadow-[0_20px_50px_rgba(88,69,43,0.08)]">
            <h2 className="inline-flex items-center gap-2 font-['Space_Grotesk',sans-serif] text-2xl font-bold text-amber-950">
              <FaTriangleExclamation aria-hidden="true" />
              Before installing
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-amber-950 sm:text-base">
              <p>
                qBittorrent&apos;s upstream wiki warns that unofficial Python
                plugins are not inherently safe.
              </p>
              <p>Review plugins before installing them.</p>
            </div>
          </article>
        </section>

        {skippedPlugins.length > 0 ? (
          <section>
            <article className="rounded-[1.75rem] border border-stone-300/80 bg-white/80 p-6 shadow-[0_20px_50px_rgba(88,69,43,0.08)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-stone-950">
                  Skipped during build
                </h2>
                <p className="text-sm font-medium text-stone-600">
                  {skippedPlugins.length} plugins could not be bundled.
                </p>
              </div>
              <div className="mt-5 grid gap-3">
                {skippedPlugins.map((plugin) => (
                  <div
                    key={`${plugin.section}-${plugin.engineName}`}
                    className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-stone-950">
                          {plugin.engineName}
                        </p>
                        <p className="text-sm text-stone-600">
                          {plugin.reason}
                        </p>
                      </div>
                      <span className="inline-flex w-fit rounded-full border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                        {plugin.section}
                      </span>
                    </div>
                    <a
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 transition hover:text-stone-950"
                      href={plugin.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaArrowUpRightFromSquare aria-hidden="true" />
                      Open source URL
                    </a>
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default App;
