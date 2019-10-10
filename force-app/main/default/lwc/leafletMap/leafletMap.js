import { LightningElement, api, track } from 'lwc'
import Leaflet from '@salesforce/resourceUrl/Leaflet'
import { loadStyle, loadScript } from 'lightning/platformResourceLoader'

export default class LeafletMap extends LightningElement {
  @track map
  @track markerGroup

  @api height

  @api
  setMarkers (pins) {
    this.resetMarkerGroup()

    const newMarkers = pins.map(this.createMarker)
    newMarkers.forEach(marker => marker.addTo(this.markerGroup))

    this.sizeMap()

    return newMarkers
  }

  @api
  addMarker (pin) {
    const newMarker = this.createMarker(pin)
    newMarker.addTo(this.markerGroup)
    this.sizeMap()
    return newMarker
  }

  @api
  removeMarker (marker) {
    this.markerGroup.removeLayer(marker)
    this.sizeMap()
  }

  @api
  sizeMap () {
    this.map.fitBounds(this.markerGroup.getBounds().pad(0.1))
  }

  createMarker (pin) {
    const marker = L.marker([ pin.lat, pin.lng ], { record: pin.record })
    marker.bindTooltip(pin.record.Name)
    return marker
  }

  resetMarkerGroup () {
    if (this.markerGroup) {
      this.markerGroup.clearLayers()
    } else {
      this.markerGroup = new L.featureGroup()
      this.markerGroup.on('click', event => this.clickMarker(this, event))
      this.markerGroup.on('mouseover', event => {event.target.openToolTip()})
      this.markerGroup.addTo(this.map)
    }
  }

  renderedCallback () {
    this.initializeLeaflet()
  }

  initializeLeaflet () {
    Promise.all([
      loadScript(this, Leaflet + '/leaflet.js'),
      loadStyle(this, Leaflet + '/leaflet.css')
    ])
      .then(() => {
        const mapEl = this.template.querySelector('.map-root')
        mapEl.style = 'height: ' + this.height + ';'
        this.map = L.map(mapEl, { zoomControl: false })
          .setView([ 32.955740, -96.824257 ], 14) // Default View
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          {
            attribution: 'Justin Lyon @ Slalom'
          }).addTo(this.map)
        this.fireMapReady()
      })
      .catch(error => {
        console.error('Error loading leaflet styles', error.message)
      })
  }

  fireMapReady () {
    const ready = new CustomEvent('ready')
    this.dispatchEvent(ready)
  }

  clickMarker (self, { layer }) {
    self.fireMarker(layer)
  }

  fireMarker (layer) {
    const pinclick = new CustomEvent('pinclick', {
      detail: layer.options.record.Id
    })

    this.dispatchEvent(pinclick)
  }
}
