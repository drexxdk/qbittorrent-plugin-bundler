# qBittorrent Plugin Bundle Site

Static Vite + React site for GitHub Pages that publishes a zip bundle of the latest downloadable entries from the qBittorrent unofficial search plugin wiki.

## What it does

- Fetches the latest `.mediawiki` source from the upstream qBittorrent plugin wiki.
- Extracts plugin download links from both the public and private plugin tables.
- Downloads reachable plugin files and bundles them into a single zip archive.
- Builds a static site that links to the current archive, the upstream wiki page, and the GitHub repository.
- Tracks the upstream wiki timestamp and source hash so deployments only run when the wiki content changes.

## Scripts

- `npm run dev`: Start the Vite dev server.
- `npm run check:upstream`: Compare the current upstream wiki contents with the metadata published on GitHub Pages.
- `npm run generate:bundle`: Fetch the latest plugin list and regenerate the zip plus metadata.
- `npm run build`: Build the static site.
- `npm run lint`: Run ESLint.

## GitHub Pages workflow

The workflow in `.github/workflows/deploy.yml` can run on demand and checks the upstream wiki every day at 06:00 UTC.

- If the upstream wiki content hash changed, it regenerates the bundle, builds the site, and deploys GitHub Pages.
- If the wiki did not change, it skips the expensive steps and writes a summary explaining why nothing was published.
- A manual run can force a rebuild with the `force` input.
- A normal `git push` does not trigger this workflow because there is no `push` event configured.

### Running the workflow manually

You can start it in either of these ways:

- GitHub UI: open the repository Actions tab, select `Build And Deploy`, then click `Run workflow`.
- GitHub CLI: run `gh workflow run "Build And Deploy"` from the repository root.

To inspect recent runs:

- `gh run list --workflow "Build And Deploy"`
- `gh run view <run-id>`

Set `VITE_REPO_URL` in the workflow or repository environment if you want the site to link to a different repository URL.

## Safety note

The upstream qBittorrent wiki explicitly warns that unofficial Python plugins are not inherently safe. This project only packages the downloadable files into a zip and links back to the source pages; users should still review plugins before installing them.
