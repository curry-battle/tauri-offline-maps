import maplibregl from 'npm:maplibre-gl'
import { PMTiles, Protocol } from 'npm:pmtiles'
import { invoke } from 'npm:@tauri-apps/api@^2.0.1/core'
import layers from './layers.ts'
import { downloadAndSavePMTiles } from './fs.ts'

const map = new maplibregl.Map({
  container: 'map',
  center: [7.42661, 43.73488],
  zoom: 13,
  pitchWithRotate: false,
  style: {
    version: 8,
    glyphs: '/static/basemaps-assets/fonts/{fontstack}/{range}.pbf',
    layers: [],
    sources: {},
  },
})

const protocol = new Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

map.on('load', async function () {
  // This will be pattern to use for loading coast data
  // once we figure out how to make a good global tile
  const url = await downloadAndSavePMTiles(
    'https://static.bpev.me/maps/monaco.pmtiles',
    'preview.pmtiles',
  )

  map.addSource('preview', {
    type: 'vector',
    url: `pmtiles://${url}`,
  })
  map.addLayer({
    'id': 'preview',
    'type': 'line',
    'source': 'preview',
    'source-layer': 'transportation',
    'minzoom': 13,
    'filter': [
      'all',
      ['==', '$type', 'LineString'],
      ['in', 'class', 'minor', 'service'],
    ],
    'layout': { 'line-cap': 'round', 'line-join': 'round' },
    'paint': {
      'line-color': 'black',
      'line-width': { 'base': 1.55, 'stops': [[4, 0.25], [20, 30]] },
    },
  })
})

let monacoLoaded = false

async function downloadAndAddMonaco() {
  if (monacoLoaded) return
  try {
    const url = await downloadAndSavePMTiles(
      'https://static.bpev.me/maps/monaco.pmtiles',
      'monaco.pmtiles',
    )

    map.addSource('monaco', {
      type: 'vector',
      url: `pmtiles://${url}`,
    })

    // Add Monaco layers on top of the coastline
    layers('monaco').forEach((layer) => {
      map.addLayer(layer)
    })

    monacoLoaded = true
  } catch (error) {
    console.error('Failed to download or add Monaco region:', error)
  }
}

document
  .getElementById('download')
  .addEventListener('click', downloadAndAddMonaco)
