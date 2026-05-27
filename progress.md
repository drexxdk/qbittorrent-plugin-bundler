# Progress

## Status

- Project scaffolded as a separate Vite + React + Tailwind app in `qbittorrent-plugin-bundle-site/`.
- Weekly bundle generator implemented in `scripts/generate-bundle.mjs`.
- GitHub Pages workflow added in `.github/workflows/deploy.yml`.
- Static site UI implemented in `src/App.tsx`.
- Generated metadata written to `src/generated/bundle-meta.ts`.
- Latest archive written to `public/downloads/qbittorrent-search-plugins-latest.zip`.

## Validation

- `npm run generate:bundle` succeeded.
- `npm run lint` succeeded.
- `npm run build` succeeded.

## Current generated result

- Included plugins: 94
- Skipped plugins: 7
- Bundle timestamp is stored in `src/generated/bundle-meta.ts`.

## Important files

- `src/App.tsx`: landing page UI
- `src/index.css`: Tailwind entry and global styles
- `scripts/generate-bundle.mjs`: fetch/parse/download/zip pipeline
- `.github/workflows/deploy.yml`: weekly GitHub Pages deployment
- `public/downloads/qbittorrent-search-plugins-latest.zip`: generated zip
- `src/generated/bundle-meta.ts`: generated site metadata

## Commands

- `npm run generate:bundle`
- `npm run lint`
- `npm run build`
- `npm run dev`

## Next steps

1. Move this folder into its own GitHub repository.
2. Enable GitHub Pages with GitHub Actions in that repository.
3. Run the workflow once manually to publish the first live version.
4. Confirm the repository URL used by `VITE_REPO_URL` matches the final repo.