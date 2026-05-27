import { bundleMeta } from './generated/bundle-meta'

const repoUrl =
  import.meta.env.VITE_REPO_URL ?? 'https://github.com/your-user/qbittorrent-plugin-bundle-site'

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(isoDate))
}

function formatBytes(bytes: number) {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 1,
  }).format(bytes / (1024 * 1024))
}

function App() {
  const downloadHref = `./downloads/${bundleMeta.zipFileName}`

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5efe4_0%,#f8f5ee_42%,#fcfbf7_100%)] text-stone-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
        <section className="overflow-hidden rounded-[2rem] border border-stone-300/80 bg-white/90 shadow-[0_30px_80px_rgba(76,55,31,0.12)] backdrop-blur">
          <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.5fr_0.9fr] lg:px-10 lg:py-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                Weekly generated bundle
              </div>
              <div className="space-y-4">
                <p className="font-['Space_Grotesk',sans-serif] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                  qBittorrent search plugins, bundled into one download.
                </p>
                <p className="max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
                  This static GitHub Pages site rebuilds a zip once a week from the latest entries on
                  the qBittorrent unofficial search plugin wiki. It is meant to save the manual work
                  of downloading each plugin one by one.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                  href={downloadHref}
                >
                  Download latest zip
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-400 hover:bg-stone-50"
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub repo
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-400 hover:bg-stone-50"
                  href={bundleMeta.sourceWikiUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open plugin source page
                </a>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-stone-200 bg-stone-950 p-6 text-stone-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-400">Bundle status</p>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <dt className="text-sm text-stone-400">Generated</dt>
                  <dd className="mt-1 text-lg font-semibold">{formatDate(bundleMeta.generatedAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-400">Plugins included</dt>
                  <dd className="mt-1 text-3xl font-bold">{bundleMeta.pluginCount}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-400">Skipped during build</dt>
                  <dd className="mt-1 text-lg font-semibold">{bundleMeta.skippedCount}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-400">Zip size</dt>
                  <dd className="mt-1 text-lg font-semibold">{formatBytes(bundleMeta.zipByteSize)} MB</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[1.75rem] border border-stone-300/80 bg-white/80 p-6 shadow-[0_20px_50px_rgba(88,69,43,0.08)]">
            <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-stone-950">
              What this site does
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-stone-700 sm:text-base">
              <p>
                The weekly job fetches the raw wiki source from qBittorrent, extracts plugin download
                URLs from both the public and private plugin tables, downloads the latest reachable
                plugin scripts, and packages them into one zip file.
              </p>
              <p>
                This project does not install or execute plugins for you. It only republishes the
                latest downloadable plugin files in a single archive and links back to the upstream
                sources.
              </p>
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
                The upstream wiki warns that unofficial Python plugins are not inherently safe. Review
                plugin code before installing it in qBittorrent.
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-stone-300/80 bg-white/80 p-6 shadow-[0_20px_50px_rgba(88,69,43,0.08)]">
            <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-stone-950">
              Included this week
            </h2>
            <div className="mt-5 grid gap-3">
              {bundleMeta.sections.map((section) => (
                <div
                  key={section.key}
                  className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-stone-700">{section.title}</span>
                  <span className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-stone-950">
                    {section.count}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-stone-600">
              The generated site deploys the zip and metadata together, so the timestamp and download
              button always refer to the same weekly build.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}

export default App
