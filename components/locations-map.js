export default class LocationsMap extends HTMLElement {
  static get tagName () {
    return 'locations-map'
  }

  static get observedAttributes () {
    return ['locations']
  }

  constructor () {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.innerHTML = `
      <div id="map"></div>
    `
    this.loadStyles(['../vendor/leaflet/leaflet.css'])

    const defaultView = [51.5, -0.09]
    const customView = this.getAttribute('view')
    const view = customView? customView.split(','): defaultView
    this.mapNode = this.shadow.querySelector('#map')
    this.map = L.map(this.mapNode).setView(view, this.getAttribute('zoom') || 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)

    // L.marker([51.5, -0.09]).addTo(this.map)
    //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //   .openPopup()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this[name] = newVal;
  }

  set locations (val = '') {
    const locations = JSON.parse(val)
    locations.forEach(location => {
      const customIcon = L.icon({
        iconUrl: location.type? `img/${location.type}.svg`: 'icon.svg',
        iconSize: [30, 30],
        iconAnchor: [0, 0],
        popupAnchor: [15, 0],
      })

      L.marker([location.lat, location.lon], {icon: customIcon}).addTo(this.map)
        .bindPopup(`
          <h3>${location.info}</h3>
          <p>${location.address || ''}</p>
          <p>${location.phone || ''} <a href="${location.web || ''}" target="_blank">${location.web || ''}</a></p>
        `)
    })
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
