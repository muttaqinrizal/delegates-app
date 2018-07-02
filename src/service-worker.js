// const { assets } = global.serviceWorkerOption
const CACHE = 'flsguide-cache-v4'

// let assetsToCache = [...assets, './']
let assetsToCache = serviceWorkerOption.assets

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(assetsToCache);
  });
}

// Listeners

self.addEventListener('install', function (evt) {
  console.log('The service worker is being installed.')
  evt.waitUntil(precache())
})

self.addEventListener('fetch', function (evt) {
  // if (evt.request.url.indexOf('/api/') >= 0) {
    // handle with network first
    console.log('handle', evt.request.url, 'from network or cache', evt.request.url.indexOf('/api/'))
    evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
        return fromCache(evt.request);
      })
    )
  // }
  // else {
  //   console.log('handle', evt.request.url, 'from cache only')
  //   evt.respondWith(fromCache(evt.request))
  // }
})


function fromNetwork(request, timeout) {
  console.log('serving from network: ', request.url)
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response.clone());
      caches.open(CACHE).then(function (cache) {
        if (request.url.indexOf('/images/') >= 0) {
          cache.put(request.url, response)
        }
      })
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      console.log(matching)
      if (matching) {
        console.log('The service worker is serving the asset:', request.url);
        return matching
      } else {
        Promise.reject('no-match');
      }
    });
  });
}