import { LightningElement, api, track } from 'lwc'
import getRecentContacts from '@salesforce/apex/RecentContactsMapAuraService.getRecentContacts'

export default class RecentContactsMap extends LightningElement {
  @track contactMarkers
  @track map
  @track error

  @api height

  onMapInit () {
    this.map = this.template.querySelector('.leaflet-map')
    this.getContacts()
  }

  onMarkerClick (event) {
    const markerClick = new CustomEvent('markerclick', {
      detail: event.detail
    })

    this.dispatchEvent(markerClick)
  }

  getContacts () {
    getRecentContacts()
      .then(data => {
        this.contactMarkers = data
        this.setMapMarkers()
      })
      .catch(error => {
        this.error = error
        this.contactMarkers = null
        console.error('Error getting contacts', error)
      })
  }

  createPins (contacts) {
    return contacts.map(contact => {
      return {
        record: contact,
        lat: contact.MailingLatitude,
        lng: contact.MailingLongitude
      }
    })
  }

  setMapMarkers () {
    this.map.setMarkers(this.contactMarkers)
  }
}
