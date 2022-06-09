// import sheet from "./qr-scanner.css" assert { type: 'css' };

export default class QrScanner extends HTMLElement {
  static get tagName () {
    return 'qr-scanner'
  }

  constructor () {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.innerHTML = `
        <h2>QR Scanner</h2>
        <video width="640" height="480" autoplay></video>
        <p></p>
    `
    // this.shadow.adoptedStyleSheets = [sheet]
    this.loadStyles()

    this.resultNode = this.shadow.querySelector('p')
    this.videoNode = this.shadow.querySelector('video')
  }

  async loadStyles () {
    const cssModule = await import(`./${this.tagName.toLowerCase()}.css`, {
      assert: { type: 'css' }
    })
    this.shadow.adoptedStyleSheets = [cssModule.default]
  }

  connectedCallback () {
    if (!('BarcodeDetector' in window)) {
      document.body.innerHTML = 'Gerät nicht geeignet!'
    }

    this.startScanner()
  }

  dispatchCode (text) {
    const qrCodeEvent = new CustomEvent('show-qr-code', {
      bubbles: true,
      detail: { text }
    })
    this.dispatchEvent(qrCodeEvent)
  }

  async startScanner () {
    await this.createVideoStream()
    this.barcodeDetector = this.getBarcodeDetector()

    setInterval(this.detectCode.bind(this), 200)
  }

  detectCode () {
    // Start detecting codes on to the video element
    this.barcodeDetector
      .detect(this.videoNode)
      .then(codes => {
        // If no codes exit function
        if (codes.length === 0) return

        for (const barcode of codes) {
          // Log the barcode to the console
          console.log(barcode)

          if (barcode.format !== 'qr_code') {
            this.resultNode.textContent = 'kein QR Code'
          }

          if (barcode.rawValue.indexOf('http') === 0) {
            this.resultNode.innerHTML = `<a href="${barcode.rawValue}">${barcode.rawValue}</a>`
            this.dispatchCode(barcode.rawValue)
          } else {
            this.resultNode.textContent = barcode.rawValue
            this.dispatchCode(barcode.rawValue)
          }
        }
      })
      .catch(err => {
        // Log an error if one happens
        console.error(err)
      })
  }

  getBarcodeDetector () {
    // // Save all formats to formats var
    // BarcodeDetector.getSupportedFormats().then(arr => formats = arr);
    // // Create new barcode detector with all supported formats
    // return new BarcodeDetector({ formats });
    return new BarcodeDetector({ formats: ['qr_code'] })
  }

  createVideoStream () {
    // Check if device has camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Use video without audio
      const constraints = {
        video: true,
        audio: false
      }

      // Start video stream
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => (this.videoNode.srcObject = stream))
    }
  }
}
