// import EssentialElement from "./essential-element.js";

// customElements.define(EssentialElement.tagName, EssentialElement)

const loadModule = async tagName => {
  const module = await import(`./${tagName.toLowerCase()}.js`)
  customElements.define(module.default.tagName, module.default)
}

const allowedElements = ['image-list', 'qr-scanner', 'praizee-slides']

allowedElements.forEach(tagName => {
  const firstMatch = document.querySelector(tagName)
  // console.log(firstMatch)
  if (firstMatch) {
    loadModule(tagName)
  }
})
