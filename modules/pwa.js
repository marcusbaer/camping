export const installer = (selector = '#installButton') => {
  let installPrompt
  const button = document.querySelector(selector)

  // hide the button initially
  button.style.display = 'none'

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault()
    // show the button if it makes sense
    button.style.display = 'inline-block'
    installPrompt = e
  })

  // https://developers.google.com/web/fundamentals/app-install-banners/#mini-info-bar
  window.addEventListener('appinstalled', function (event) {
    // PWA was successfully installed
    console.log('PWA installed')
  })

  button.addEventListener('click', () => {
    if (!installPrompt) {
      // The deferred prompt isn't available.
      return
    }

    // Show the install prompt.
    installPrompt.prompt()

    // Log the result
    installPrompt.userChoice.then(result => {
      // console.log('userChoice', result);
      // Reset the deferred prompt variable, since prompt() can only be called once.
      installPrompt = null
      // Hide the install button.
      button.style.display = 'none'
    })
  })
}

export const serviceWorker = async (worker = '/sw.js', scope = '/') => {
  if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register(worker, { scope }).then(function(registration) {}).catch(function(err) {})
    const swRegistration = await navigator.serviceWorker.register(worker, {
      scope
    })
    return swRegistration
  } else {
    // throw new Error('No Service Worker support!')
    return null
  }
}

const main = async (worker, scope, { enableSharing = true }) => {
  const serviceWorkerRegistration = await serviceWorker(worker, scope)
}

export function pwa (worker = '/sw.js', scope = '/', options = {}) {
  if ('serviceWorker' in navigator) {
    // you should wait until load event
    window.addEventListener('load', function () {
      main(worker, scope, options)
    })
  }
}

export default pwa
