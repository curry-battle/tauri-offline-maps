import maplibregl from 'npm:maplibre-gl'
import { PMTiles, Protocol } from 'npm:pmtiles'
import { invoke } from 'npm:@tauri-apps/api@^2.0.1/core'
import layers from './layers.ts'
import { downloadAndSavePMTiles } from './fs.ts'
import baseStyle from './style.js'

// Create map with base style
const map = new maplibregl.Map({
  container: 'map',
  center: [7.42661, 43.73488],
  zoom: 13,
  pitchWithRotate: false,
  style: baseStyle, // Use the imported style.json as base
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

    // Add Monaco source on top of the base style
    map.addSource('monaco', {
      type: 'vector',
      url: `pmtiles://${url}`,
    })

    // Add Monaco layers on top of existing layers
    layers('monaco').forEach((layer) => {
      // Get the topmost layer ID from the base style to ensure Monaco layers are on top
      const topLayer = map.getStyle().layers[map.getStyle().layers.length - 1].id
      map.addLayer(layer, topLayer)
    })

    loaded = true
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
