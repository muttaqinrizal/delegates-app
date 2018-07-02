// const { assets } = global.serviceWorkerOption
const CACHE = 'flsguide-cache-v1'

// let assetsToCache = [...assets, './']
let assetsToCache = serviceWorkerOption.assets

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(assetsToCache);
  });
}

// function updateCache(request) {
//   return caches.open(CACHE).then(function (cache) {
//     return fetch(request).then(function (response) {
//       return cache.put(request, response)
//     })
//   })
// }

// // Listeners

self.addEventListener('install', function (evt) {
  console.log('The service worker is being installed.')
  evt.waitUntil(precache())
})

// self.addEventListener('fetch', function (evt) {
//   evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
//       return fromCache(evt.request);
//     })
//   )
// })


// function fromNetwork(request, timeout) {
//   console.log('serving from network: ', request.url)
//   return new Promise(function (fulfill, reject) {
//     // var timeoutId = setTimeout(reject, timeout);
//     fetch(request).then(function (response) {
//       // clearTimeout(timeoutId);
//       fulfill(response.clone());
//       caches.open(CACHE).then(function (cache) {
//         if (request.url.indexOf('https://apifls.nurulirfan.com/images') >= 0) {
//           cache.put(request.url, response)
//         }
//       })
//     }, reject);
//   });
// }

// function fromCache(request) {
//   return caches.open(CACHE).then(function (cache) {
//     return cache.match(request).then(function (matching) {
//       console.log(matching)
//       if (matching) {
//         console.log('The service worker is serving the asset:', request.url);
//         return matching
//       } else {
//         Promise.reject('no-match');
//       }
//     });
//   });
// }

self.addEventListener('fetch', function (evt) {
  console.log('The service worker is serving the asset.');
  evt.respondWith(fromCache(evt.request));
  evt.waitUntil(update(evt.request));
})

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