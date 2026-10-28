# Yihang Zou — Personal Website

Public academic homepage at https://bbbxdjc.github.io/.

Plain HTML, CSS, and JavaScript with responsive navigation, a published paper and original figure viewer, research summaries, and an IntelliCar project dialog.

## Preview

Run `python3 -m http.server 8765` from this directory.

## Content

- `index.html`: biography, research summaries, published work, projects, and school contact addresses.
- `styles.css`: visual design and responsive layouts.
- `script.js`: navigation, citation controls, and the published-paper figure viewer.
- `intellicar.js`: two video clips, an original workflow figure, a 19-slide presentation gallery, and the final report.

GainSight is marked “Submitted to CHI” and appears in Selected Publications with its manuscript title and the complete original Figure 1, covering real-world navigation, the integrated prototype, and indoor navigation scenarios. The public demo video is available at `/gainsight-demo/`, with links back to the homepage. CV files and full manuscripts are not included in the public site.

The homepage uses noindex, nofollow, and noimageindex to reduce search exposure. Crawling remains allowed so supporting search engines can read these directives; they do not restrict direct access or downloads.

## Deployment

The GitHub Actions Pages workflow publishes the site and public assets from `main`. Keep the Pages source set to GitHub Actions. Update the sitemap after substantial content changes.
