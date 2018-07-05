// const { assets } = global.serviceWorkerOption
const CACHE = 'flsguide-cache-v8.2'

// let assetsToCache = [...assets, './']
let assetsToCache = [...serviceWorkerOption.assets, '/', '/event']
// assetsToCache.push('/')
console.log(assetsToCache);


self.addEventListener('install', function (evt) {
  console.log('[PWA Builder] The service worker is being installed.');
  evt.waitUntil(precache().then(function () {
    // console.log('[PWA Builder] Skip waiting on install');
    // return self.skipWaiting();
    console.log('all files are cached');
    
  }));
});

//allow sw to control of current page
self.addEventListener('activate', function (event) {
  console.log('[PWA Builder] Claiming clients for current page');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      var toBeDeleted = cacheNames.filter(cache => cache !== CACHE)
      return Promise.all(toBeDeleted.map(cache => {
        return caches.delete(cache)
      }))
    })
  )
  // return self.clients.claim();
});

self.addEventListener('fetch', function (evt) {
  console.log('The service worker is serving the asset.');
  // if (evt.request.url.indexOf(self.origin) >= 0) {
    // console.log('request to', self.origin);
    // evt.respondWith(fromCache(evt.request).catch(function () {
    //   return fromNetwork(evt.request, 10000)
    // }));
  // }
  // else {
    // console.log('request to', evt.request.url);
    evt.respondWith(fromNetwork(evt.request, 1000).catch(function () {
      return fromCache(evt.request);
    }));
  // }
});


function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(assetsToCache);
  });
}

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request, {cache: 'no-cache'}).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response.clone());
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}