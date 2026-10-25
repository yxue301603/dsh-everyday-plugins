# Product demos

These assets show the **actual shipped DSH Everyday plugin interfaces** rendered in this repository's isolated contract fixture. They are not screenshots of a user's DSH application or evidence of a live task result.

All conversation text, saved answers, draft versions, task alerts, file names and project notes are synthetic. The fixture exposes the same composer, session and slot contracts used by the tests. Product panels come from the unchanged prebuilt `lib/client.js`; their controls, filtering, tags and insertion behavior are real plugin code. The animated story adds an outer title card around captured UI images. It does not redraw the plugin interface.

## Reproduce

```sh
node scripts/capture-demos.mjs
```

The script starts its own loopback fixture on port 43283, uses an isolated headless Edge browser on Windows (Chromium elsewhere), captures the panels, and encodes PNG/GIF/WebP with Python Pillow. Set `DSH_DEMO_PYTHON` if Python is installed at a different location. It closes only the browser and server it created.

No personal DSH profile is opened. No model is called. The notification implementation is inert and the script asserts zero message submissions and zero notification attempts. It does not use the OS clipboard, a visible browser or desktop automation.

## Assets

- `everyday-demo-dark.gif`: English, dark theme, three small stories: draft recovery, tagged answer search, and conversation outline search.
- `everyday-story-dark.webp` / `.png`: static opening frame for previews and reduced-motion alternatives.
- `everyday-story-library.webp`, `everyday-story-outline.webp`: static cards for the answer-search and outline-search scenes.
- `dsh-*-dark.png`: a clear Chinese-interface screenshot for each of the eight tools.
- `dsh-project-notes-tasks-dark.png`: the notebook's checklist view.
- `selection-inline-dark.png`: the selection action beside an actual rendered fixture message, with the answer's save button still visible.
- `composer-tools-dark.png`: the wide composer's labeled tool entries.
- `icon.png`: the repository's existing `icon.svg`, rendered by Chromium at 256 × 256 with transparent corners; suitable for directory entries that require raster icons.
- `social-preview.png`: a 1280 × 640 overview with the repository name and three actual UI captures. This is an asset for manual use; the script does not upload it to GitHub settings.
- `dsh-draft-history-light.png`, `dsh-answer-library-light.png`, `dsh-conversation-outline-light.png`: light-theme alternatives for the three featured tools.
- `capture-report.json`: capture provenance, bundle hash, dimensions, file sizes and safety checks.

Static screenshots target less than 300 KB each; the autoplay GIF targets less than 4 MB. For native DSH compatibility evidence, use the separate verification notes, not these contract-fixture demonstration images.

For a directory's `screenshots.json`, use the PNG or WebP files above. The GIF is for the GitHub README animation, not for screenshot manifests. After the main captures already exist, `node scripts/capture-demos.mjs --branding-only` rebuilds just the raster icon and social preview; `--selection-only` refreshes the selection interface captures. Partial refreshes retain their own bundle hash in the capture report.

Assets are part of this MIT-licensed repository. Synthetic file names such as `report.md` and `src/auth/session.ts` illustrate the file-list feature; they do not identify local user files.
