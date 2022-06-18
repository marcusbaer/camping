const RELEASE_ID = '0.0.5'
const CACHE_NAME = `camping-cache-v${RELEASE_ID}`

self.addEventListener('install', event => {
  skipWaiting()
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache =>
        cache.addAll([
          './',
          './index.html',
          './icon_512x512.png',
          './icon.svg',
          './manifest.json',
          './modules/pwa.js',
          './components/critical.js',
          './components/essential.js',
          './components/essential-element.css',
          './components/essential-element.js',
          './components/image-list.css',
          './components/image-list.js',
          './components/locations-map.css',
          './components/locations-map.js',
          './components/md-content.css',
          './components/md-content.js',
          './components/praizee-slides.css',
          './components/praizee-slides.js',
          './components/qr-scanner.css',
          './components/qr-scanner.js',
          './cms.html',
          './equipment/faltcaravan.md',
          './map.html',
          './qr.html',
          './share.html',
          './demo.html',
          './details.html',
        ])
      )
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.match(event.request))
      .then(async response => {
        const { request } = event
        return response ?? fetch(request)
      })
  )
})

self.addEventListener('message', e => {
  console.log('A message received:', e)
})
