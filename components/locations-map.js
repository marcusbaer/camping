export default class LocationsMap extends HTMLElement {
  static get tagName () {
    return 'locations-map'
  }

  constructor () {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.innerHTML = `
      <div id="map"></div>
    `
    this.loadStyles(['../vendor/leaflet/leaflet.css'])

    this.mapNode = this.shadow.querySelector('#map')
    this.map = L.map(this.mapNode).setView([51.505, -0.09], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)

    L.marker([51.5, -0.09]).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup()
  }

  async loadStyles (optionalStyles = []) {
    const additionalStyle = await import(optionalStyles[0], {
      assert: { type: 'css' }
    })
    const cssModule = await import(`./${this.tagName.toLowerCase()}.css`, {
      assert: { type: 'css' }
    })

    this.shadow.adoptedStyleSheets = [cssModule.default, additionalStyle.default]
  }
}
