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
} else {
  // The current browser doesn't support service workers.
  console.log('not supported')
}