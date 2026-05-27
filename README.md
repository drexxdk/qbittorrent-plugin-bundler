# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # qBittorrent Plugin Bundle Site

  Static Vite + React site for GitHub Pages that publishes a weekly zip bundle of the latest downloadable entries from the qBittorrent unofficial search plugin wiki.

  ## What it does

  - Fetches the latest `.mediawiki` source from the upstream qBittorrent plugin wiki.
  - Extracts plugin download links from both the public and private plugin tables.
  - Downloads reachable plugin files and bundles them into a single zip archive.
  - Builds a static site that links to the current archive, the upstream wiki page, and the GitHub repository.

  ## Scripts

  - `npm run dev`: Start the Vite dev server.
  - `npm run generate:bundle`: Fetch the latest plugin list and regenerate the zip plus metadata.
  - `npm run build`: Build the static site.
  - `npm run lint`: Run ESLint.

  ## GitHub Pages

  The workflow in `.github/workflows/deploy.yml` is set to:

  - run on demand
  - run every Monday at 06:00 UTC
  - regenerate the plugin bundle
  - build the static site
  - deploy `dist/` to GitHub Pages

  Set `VITE_REPO_URL` in the workflow or repository environment if you want the site to link to the final GitHub repo URL.

  ## Safety note

  The upstream qBittorrent wiki explicitly warns that unofficial Python plugins are not inherently safe. This project only packages the downloadable files into a zip and links back to the source pages; users should still review plugins before installing them.
export default defineConfig([
