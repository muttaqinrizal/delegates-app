const apiUrl = 'http://localhost:3001'



before(function () {
  return window.__testCleanup()
  
})
after(function () {
  console.log('run');
  // return window.__testCleanup()
})


describe('Service Worker Suite', function () {

  // beforeEach(function() {
  //   this.timeout(5000)
  // })

  it('should register a service worker and cache file on install', function () {
    // 1: Register service worker.
    // 2: Wait for service worker to install.
    // 3: Check cache was performed correctly.
    return navigator.serviceWorker.register('/sw.js')
    .then((reg) => {
      return window.__waitForSWState(reg, 'installed')
    })
    .then(() => {
      return caches.open('test').then(cache => {
        return cache.put(new Request('/__test/text'), new Response('Berhasil'))
      })
    })
    .then(() => {
      return caches.match('/__test/text')
      .then((response) => {
        if (!response) {
          throw new Error('Oops, no response was found in the cache.')
        }

        return response.text()
      })
      .then((responseText) => {
        if (responseText !== 'Berhasil') {
          throw new Error(`The response text was wrong!: '${responseText}'`)
        }
      })
    })
  })

  it('should be able to test push event', function () {
    this.timeout(5000)
    return navigator.serviceWorker.getRegistration()
    .then(reg => {
      console.log(reg);
      return reg.pushManager.getSubscription()
      .then(sub => {
        if (!sub) {
          return fetch(`${apiUrl}/vapidPublicKey`)
          .then(response => {
            return response.text()
          })
          .then(vapid => {
            console.log(vapid);
            const convertedVapid = urlBase64ToUint8Array(vapid)
            console.log(convertedVapid);
            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapid
            })
          })
        }
        else {
          return sub
        }
      })
      .then(sub => {
        // sub = JSON.parse(JSON.stringify(sub))
        sub = JSON.stringify(sub)
        console.log(sub);
        
        return fetch(`${apiUrl}/test-push`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: sub,
          mode: 'cors'
        })
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, 1000)
        })
      })
      .then(() => {
        return reg.getNotifications()
      })
      .then(notif => {
        console.log(notif);
        if (notif.length < 1) {
          throw new Error('Unexpected number of notifications shown.')
        }
        if (notif[0].title !== 'Pengumuman Baru') {
          throw new Error('Notification title not match.')
        }
      })
    })
    
  })


})


function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}