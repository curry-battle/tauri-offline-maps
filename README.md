# Tauri Offline Maps

This is a proof-of-concept for building an offline maps app with Tauri, maplibregl, and protomaps.

This is meant to prove the dataflow for building something like Organic Maps.

![screenshot](./docs/screenshot.png)

# Goals

- [ ] A user can download maps via:
  - [ ] A static list
  - [ ] Scrolling on the map on some zoom levels will expose download links for viewable regions
- [x] Downloaded maps are displayed offline

### Stretch Goals

- [ ] An initial map of world coasts is included
- [ ] Report download progress

## Technology Explanation

- **pmtiles**: The ability to run maplibregl from static files simplifies the process on the client (we can run downloaded pmtiles without additional processing)
- **geofabrik**: we are using this for region definition, `oms.pbf` files, and `.poly` files

## Tiles

Tiles are assumed to be generated via:

- download `.osm.pbf` from geofabrik
- `tilemaker thailand-latest.osm.pbf thailand.pmtiles`, using `config-openmaptiles.json` and `process.openmaptiles.lua`
