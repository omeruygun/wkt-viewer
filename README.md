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
- **Drawing tools** — Sketch points, lines, and polygons directly on the map.
- **Excel import** — Load `.xlsx` / `.xls` files; map WKT and label columns, preview rows, and apply bulk styling.
- **Reprojection** — Built-in support for WGS 84, Web Mercator, Lambert 93, UTM zones, Australian GDA94, and Turkish TM zones (via [proj4](https://proj4.org/) definitions integrated with OpenLayers).
- **Styling** — Per-geometry colors, outlines, opacity, point radius, and optional map labels.
- **Export** — Download geometries as **CSV** (Excel-friendly), **JSON**, or **GeoJSON**, with optional style metadata and target projection selection.
- **Localization** — UI available in **Turkish**, **English**, **German**, and **Russian**.

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
  Controllers/            # MVC controllers
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
