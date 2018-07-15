import config from './config'

var setting = config.development
if (ENVIRONMENT === 'production') setting = config.production

// TODO: explain me!
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


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', {
    scope: './'
  }).then(function (registration) {
    var serviceWorker;
    if (registration.installing) {
      serviceWorker = registration.installing;
      console.log('installing')
    } else if (registration.waiting) {
      serviceWorker = registration.waiting;
      console.log('waiting')
    } else if (registration.active) {
      serviceWorker = registration.active;
      console.log('active')
    }
    if (serviceWorker) {
      // logState(serviceWorker.state);
      serviceWorker.addEventListener('statechange', function (e) {
        // logState(e.target.state);
      });
    }
  }).catch(function (error) {
    // Something went wrong during registration. The service-worker.js file
    // might be unavailable or contain a syntax error.
    console.log('error')
  });

  // Notification.requestPermission(permission => {
  //   if(permission === 'granted') {
  //     console.log('notification permission granted')
  //   }
  // })
  navigator.serviceWorker.ready.then((registration) => {
    return registration.pushManager.getSubscription()
    .then(async function(subscription) {
      console.log(subscription);
      if (subscription) return subscription
      const response = await fetch(`${setting.apiBaseUrl}/api/subs/vapidPublicKey`)
      const vapidPublicKey = await response.text()
      const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey)
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidPublicKey
      })
    })
  })
  .then(subscription => {
    fetch(`${setting.apiBaseUrl}/api/subs/register`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription: subscription
      })
    })
  })
} else {
  // The current browser doesn't support service workers.
  console.log('not supported')
}