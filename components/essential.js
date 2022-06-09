// import ImageList from "./image-list.js";
// import QrScanner from "./qr-scanner.js";

// customElements.define(ImageList.tagName, ImageList)
// customElements.define(QrScanner.tagName, QrScanner)

const loadModule = async tagName => {
  const module = await import(`./${tagName.toLowerCase()}.js`)
  customElements.define(module.default.tagName, module.default)
}

const essentialElements = ['essential-element']

essentialElements.forEach(tagName => {
  loadModule(tagName)
})