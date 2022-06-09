// import sheet from "./image-list.css" assert { type: 'css' };

export default class ImageList extends HTMLElement {
  static get tagName () {
    return 'image-list'
  }

  constructor () {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.innerHTML = `
        <h2>Image List</h2>
        <essential-element></essential-element>
        <button>Choose Folder</button>
    `
    // this.shadow.adoptedStyleSheets = [sheet]
    this.loadStyles()

    this.buttonNode = this.shadow.querySelector('button')
  }

  connectedCallback () {
    this.buttonNode.addEventListener('click', this.openFolder.bind(this))
  }

  async openFolder () {
    const directoryHandle = await window.showDirectoryPicker({
      startIn: 'downloads'
    })

    // for await (const entry of directoryHandle.values()) {
    //   console.log(entry.kind, entry.name)
    // }
    const promises = []
    const images = []
    for await (const entry of directoryHandle.values()) {
      if (entry.kind !== 'file') {
        break
      }
      promises.push(
        entry.getFile().then(file => {
          const img = document.createElement('img')
          // images.push(img)
          this.shadow.appendChild(img)
          let reader = new FileReader()

          reader.addEventListener("load", () => {
            img.src = reader.result
          }, false)

          reader.readAsDataURL(file)

          return `${file.name} (${file.size})`
        })
      )

      console.log(await Promise.all(promises))
      // images.forEach(image => {
      //   this.appendChild(image)
      // })
    }
  }

  async loadStyles () {
    const cssModule = await import(`./${this.tagName.toLowerCase()}.css`, {
      assert: { type: 'css' }
    })
    this.shadow.adoptedStyleSheets = [cssModule.default]
  }
}
