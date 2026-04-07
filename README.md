# Online WKT Viewer

[![Live demo](https://img.shields.io/badge/demo-wkt.omeruygun.com-0F766E?style=flat-square)](http://wkt.omeruygun.com/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)

A browser-based **Well-Known Text (WKT)** geometry viewer for GIS workflows. Paste or import geometries, visualize them on an interactive map, edit styles, reproject between common coordinate systems, and export results in multiple formats.

**Production:** [http://wkt.omeruygun.com/](http://wkt.omeruygun.com/)  
**Repository:** [https://github.com/omeruygun/wkt-viewer](https://github.com/omeruygun/wkt-viewer)

---

## Capabilities

- **WKT input** — Add geometries from WKT strings with optional names and source projection metadata.
- **Interactive map** — Pan, zoom, and manage a layer list; base maps include OpenStreetMap and Google satellite/hybrid (where permitted by provider terms).
- **Shareable map view** — As you pan and zoom, the URL fragment updates in a **Google Maps–style** form: `#@latitude,longitude,zoomz` (WGS 84). Copy the full link so others open the app at the same map position and zoom (e.g. `https://wkt.omeruygun.com/#@39.9880852,32.7282999,15z`).
- **Drawing tools** — Sketch points, lines, and polygons directly on the map.
- **Excel import** — Load `.xlsx` / `.xls` files; map WKT and label columns, preview rows, and apply bulk styling.
- **Reprojection** — Built-in support for WGS 84, Web Mercator, Lambert 93, UTM zones, Australian GDA94, and Turkish TM zones (via [proj4](https://proj4.org/) definitions integrated with OpenLayers).
- **Styling** — Per-geometry colors, outlines, opacity, point radius, and optional map labels.
- **Export** — Download geometries as **CSV** (Excel-friendly), **JSON**, or **GeoJSON**, with optional style metadata and target projection selection.
- **Localization** — UI available in **Turkish**, **English**, **German**, and **Russian**.

---

## Shareable links (URL fragment)

The client keeps the map **center** (latitude, longitude) and **zoom** in the hash, similar to Google Maps’ `@lat,lng,zoomz` pattern:

| Part | Meaning |
|------|--------|
| `#@` | Fragment prefix |
| First number | Latitude (°) |
| Second number | Longitude (°) |
| `…z` suffix | Zoom level (supports fractional zoom, e.g. `12.5z`) |

Example: `http://localhost:5274/#@39.9880852,32.7282999,15z`

The address bar is updated with `history.replaceState` on each completed move (no `?lat=` / `?lng=` query parameters). Browser back/forward on hash changes updates the map via `hashchange`.

---

## SEO, search engines & AI crawlers

`RobotsController` serves **dynamic, cache-friendly** endpoints so search engines and AI assistants can discover and summarize the site responsibly:

| Endpoint | Role |
|----------|------|
| [`/robots.txt`](http://wkt.omeruygun.com/robots.txt) | Crawl rules: allow the public app, disallow build folders (`/bin/`, `/obj/`), explicit **Allow** blocks for major search bots (Google, Bing, Yandex) and **AI / LLM crawlers** (e.g. GPTBot, OAI-SearchBot, Google-Extended, Anthropic/Claude, Copilot, Perplexity, Meta, Apple, Cohere, Common Crawl). Includes `Sitemap` and a pointer to `llms.txt`. |
| [`/sitemap.xml`](http://wkt.omeruygun.com/sitemap.xml) | Minimal XML sitemap listing the home page for indexing. |
| [`/llms.txt`](http://wkt.omeruygun.com/llms.txt) | Human-readable site summary for LLMs, aligned with the [llms.txt](https://llmstxt.org/) convention (features, projections, tech stack). |

Responses use `ResponseCache` (24 hours) to reduce load while staying easy to refresh on deploy.

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Server | ASP.NET Core 8, MVC / Razor views |
| Client map | [OpenLayers](https://openlayers.org/), [proj4js](https://github.com/proj4js/proj4js) |
| Styling & UX | Custom CSS, Material Icons, responsive layout |

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

---

## Run locally

```bash
git clone https://github.com/omeruygun/wkt-viewer.git
cd wkt-viewer
dotnet restore
dotnet run --project WktMapViewer/WktMapViewer.csproj
```

Then open the URL shown in the terminal (typically `http://localhost:5xxx`).

Alternatively, open `WktMapViewer.sln` in Visual Studio or JetBrains Rider and start the **WktMapViewer** web project.

---

## Project layout

```
WktMapViewer.sln          # Solution entry point
WktMapViewer/             # ASP.NET Core web application
  Controllers/            # MVC controllers (incl. RobotsController: robots.txt, sitemap, llms.txt)
  Views/                  # Razor pages and layout
  wwwroot/                # Static assets (CSS, JS, images)
  Program.cs              # Application bootstrap
```

---

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to align on scope and approach.

---

## Author

**Ömer Uygun** — [GitHub @omeruygun](https://github.com/omeruygun)

---

## Acknowledgements

- [OpenLayers](https://openlayers.org/) — map rendering and interactions  
- [proj4js](https://github.com/proj4js/proj4js) — client-side coordinate transformations  
- [OpenStreetMap](https://www.openstreetmap.org/copyright) — map data and tiles where applicable
