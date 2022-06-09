export default class EssentialElement extends HTMLElement {
  static get tagName () {
    return 'essential-element'
  }

  constructor () {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.innerHTML = `
        <p>> I'm essential!</p>
    `
    this.loadStyles()
  }

  async loadStyles () {
    const cssModule = await import(`./${this.tagName.toLowerCase()}.css`, {
      assert: { type: 'css' }
    })
    this.shadow.adoptedStyleSheets = [cssModule.default]
  }
}
