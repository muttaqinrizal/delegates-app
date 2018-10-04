// const { assets } = global.serviceWorkerOption
const CACHE = 'flsguide-cache-v0.13-' + BUILDSTAMP 
const strategies = {
  NETWORK_FALLING_BACK_TO_CACHE: 'net2cache',
  CACHE_FALLING_BACK_TO_NETWORK: 'cache2net',
  NETWORK_ONLY: 'netonly',
}
const FRONTEND = /((https\:\/\/fls\.nurulirfan\.com)|(http:\/\/localhost:3000))(?!.*sockjs-node)./
const API_ASSETS = /(?=.*\/api\/static\/)(?!.*hires).*/
const CONTENT = /\/api\/((?!static))/
const origins = [
  'https://apifls.nurulirfan.com',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:3001',
  self.location.origin,
]

import localForage from 'localforage'

let assetsToCache = [
  ...serviceWorkerOption.assets,
  '/',
  '/announcement/detail'
  // '/css/roboto.css',
  // '/fonts/material-icon.woff2',
  // '/fonts/roboto-v18-latin-300.woff',
  // '/fonts/roboto-v18-latin-300.woff2',
  // '/fonts/roboto-v18-latin-500.woff',
  // '/fonts/roboto-v18-latin-500.woff2',
  // '/fonts/roboto-v18-latin-700.woff',
  // '/fonts/roboto-v18-latin-700.woff2',
  // '/fonts/roboto-v18-latin-regular.woff',
  // '/fonts/roboto-v18-latin-regular.woff2',
]


self.addEventListener('install', function (event) {
  console.log('[*] The service worker is being installed.');
  console.log('[*] Assets to be cached:', assetsToCache);
  event.waitUntil(precache().then(function () {
    // console.log('[PWA Builder] Skip waiting on install');
    console.log('[*] all files are cached. Installed.');
    // return self.skipWaiting();
    
  }));
});

//allow sw to control of current page
self.addEventListener('activate', function (event) {
  console.log('[*] Claiming clients for current page');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      var toBeDeleted = cacheNames.filter(cache => cache !== CACHE)
      return Promise.all(toBeDeleted.map(cache => {
        return caches.delete(cache)
      }))
    })
  )
});

self.addEventListener('fetch', function (event) {
  var strat = whichStrategies(event)
  console.log(event.request.url, ':', strat);
  switch (strat) {
    case strategies.CACHE_FALLING_BACK_TO_NETWORK:
      event.respondWith(cacheToNetwork(event))
      break
    case strategies.NETWORK_FALLING_BACK_TO_CACHE:
      event.respondWith(networkToCache(event))
      break
    default:
      event.respondWith(netOnly(event))
      break
  }
});

function cacheToNetwork (event) {
  return caches.match(event.request)
  .then(response => {
    return response || fetch(event.request);
  })
}

function networkToCache (event) {
  // console.log('a1');
  return fetch(event.request, {cache: 'no-cache'})
  .then(nResponse => {
    // console.log('a2');
    return caches.open(CACHE).then(function (cache) {
      // console.log('a3');
      return cache.match(event.request).then(function (cResponse) {
        // console.log('a3');
        if (nResponse.status >= 200 || nResponse.status < 400 ) {
          console.log(event.request.url, 'terambil dari network');
          cache.put(event.request, nResponse.clone())
          return nResponse
        }
        else {
          console.log(event.request.url, 'terambil dari cache');
          return cResponse
        }
      })
    })
  })
  .catch(() => {
    console.log(event.request.url, 'terambil dari cache');
    return caches.match(event.request);
  })
}

function netOnly (event) {
  return fetch(event.request);
}

self.addEventListener('push', function (event) {
  localForage.getItem('notif').then(item => {
    if (item) item += 1
    else item = 1
    localForage.setItem('notif', item)
  })
  .catch(err => {
    console.log('eror', err);
    
  })
  console.log('new notif');
  
  const payload = event.data ? event.data.json() : 'tests';
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      icon: 'images/logo.png',
      body: payload.content,
      data: payload
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  console.log('notif clicked');
  if (Notification.prototype.hasOwnProperty('data')) {
    console.log('using data');
    var url = event.notification.data.url
    event.waitUntil(clients.openWindow(url))
  }
})

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(assetsToCache);
  });
}

function whichStrategies (event) {
  var request = event.request.clone()
  var url = new URL(request.url)

  var isGET = request.method === 'GET'
  var isOriginAllowed = origins.indexOf(url.origin) >= 0
  
  if(isGET && isOriginAllowed) {
    if (FRONTEND.test(url.href)) {
      return strategies.CACHE_FALLING_BACK_TO_NETWORK
    }
    else if (API_ASSETS.test(url.pathname)) { // use network first
      return strategies.NETWORK_FALLING_BACK_TO_CACHE
    }
    else {
      return strategies.NETWORK_ONLY
    }
  }
  else {
    return strategies.NETWORK_ONLY
  }
}