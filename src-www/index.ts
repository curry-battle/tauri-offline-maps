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

const monacoURL = 'static/tiles/monaco.pmtiles'

const monaco = new PMTiles(monacoURL)
protocol.add(monaco)

let loaded = false
async function downloadAndAdd() {
  if (loaded) return
  try {
    const url = await downloadAndSavePMTiles(
      'https://static.bpev.me/maps/monaco.pmtiles',
      'monaco.pmtiles',
    )

    map.addSource('monaco', {
      type: 'vector',
      url: `pmtiles://${url}`,
    })
    layers('monaco').forEach((layer) => {
      map.addLayer(layer)
    })
  } catch (error) {
    console.error('Failed to download or add region:', error)
  }
}

map.on('load', function () {
  map.addControl(new maplibregl.NavigationControl())
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }))
})

document
  .getElementById('download')
  .addEventListener('click', downloadAndAdd)
