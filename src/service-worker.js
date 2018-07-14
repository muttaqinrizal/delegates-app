// const { assets } = global.serviceWorkerOption
const CACHE = 'flsguide-cache-v8.3.0'
const strategies = {
  NETWORK_FALLING_BACK_TO_CACHE: 1,
  CACHE_FALLING_BACK_TO_NETWORK: 2,
  NETWORK_ONLY: 3,
}

let assetsToCache = [...serviceWorkerOption.assets, '/', '/event']
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
    evt.respondWith(fromNetwork(evt.request, 5000).catch(function () {
      return fromCache(evt.request);
    }));
  // }
});

self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.text() : 'no payload';
  event.waitUntil(
    self.registration.showNotification('FLS Guide', {
      body: payload,
    })
  )
})

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

function whichStrategies (event) {
  const FRONTEND = /https\:\/\/fls\.nurulirfan\.com/
  const API_ASSETS = /\/api\/assets\//
  const CONTENT = /\/api\/((?!assets))/

  var request = event.request
  var url = new URL(request.url)
  var origins = [
    'https://apifls.nurulirfan.com',
    'http://localhost:8080',
    'http://localhost:3000',
    self.location.origin,
  ]

  var isGET = request.method === 'GET'
  var isOriginAllowed = origins.indexOf(url.origin) >= 0
  
  if(isGET && isOriginAllowed) {
    if (FRONTEND.test(url.href)) {
      return strategies.CACHE_FALLING_BACK_TO_NETWORK
    }
    else if (API_ASSETS.test(pattern) || CONTENT.test(pattern)) { // use network first
      return strategies.NETWORK_FALLING_BACK_TO_CACHE
    }
    // else if (CONTENT.test(pattern)) {
    //   return ''
    // }
  } else {
    return strategies.NETWORK_ONLY
  }
}