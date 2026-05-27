# Progress

## Status

- Project scaffolded as a Vite + React + Tailwind app in this repository.
- Weekly bundle generator implemented in `scripts/generate-bundle.mjs`.
- GitHub Pages workflow added in `.github/workflows/deploy.yml`.
- Static site UI implemented in `src/App.tsx`.
- Generated metadata written to `src/generated/bundle-meta.ts`.
- Latest archive written to `public/downloads/qbittorrent-search-plugins-latest.zip`.
- GitHub repository is live at `https://github.com/drexxdk/qbittorrent-plugin-bundler`.
- GitHub Pages is configured for workflow deployments.
- Initial manual workflow run completed and published the first live site.

## Validation

- `npm run generate:bundle` succeeded.
- `npm run lint` succeeded.
- `npm run build` succeeded.
- `gh workflow run "Build And Deploy"` succeeded.
- Published site responded at `https://drexxdk.github.io/qbittorrent-plugin-bundler/`.

## Current generated result

- Included plugins: 94
- Skipped plugins: 7
- Bundle timestamp is stored in `src/generated/bundle-meta.ts`.
- Live site URL: `https://drexxdk.github.io/qbittorrent-plugin-bundler/`

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
- `gh workflow run "Build And Deploy"`
- `gh run list --workflow "Build And Deploy"`

## Next steps

1. Confirm the scheduled Monday run publishes the next bundle without manual intervention.
2. Decide whether to keep `dist/` checked in or remove it from the repository if it is only a local build artifact.
3. Add any README notes you want for end users now that the live URL is stable.
