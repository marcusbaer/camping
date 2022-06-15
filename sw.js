const RELEASE_ID = '0.0.2'
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
          './share.html',
          './icon_512x512.png',
          './icon.svg',
          './manifest.json',
          './modules/pwa.js'
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
