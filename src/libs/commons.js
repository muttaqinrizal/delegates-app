let commons = {
  getPicture (path) {
    return require('../assets/' + path)
  },
  pushSubscribe(setting) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.pushManager.getSubscription()
        .then(async function (subscription) {
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
  }
}

export default commons