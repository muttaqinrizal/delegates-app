import axios from 'axios'
import localForage from 'localforage'
import config from '../config'

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

let commons = {
  // getPicture (path) {
  //   return require('../assets/' + path)
  // },
  // getApiPicture(name) {
  //   return `${setting.apiBaseUrl}/api/static/images/${name}`
  // },
  async getUserDetail() {
    var name = await localForage.getItem('userName') || ''
    var email = await localForage.getItem('userEmail') || ''
    var room = await localForage.getItem('userRoom') || ''
    var avatar = await localForage.getItem('avatar') || '/images/logo.png'
    return {name, email, room, avatar}
  },
  pushSubscribe() {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.pushManager.getSubscription()
      .then(async function (subscription) {
        console.log(subscription);
        if (subscription) return subscription
        const response = await fetch(`${setting.apiBaseUrl}/vapidPublicKey`)
        const vapidPublicKey = await response.text()
        const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey)
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        })
      })
      .then(async function (subscription) {
        console.log('[*] Registering subscription');
        var stamp = await localForage.getItem('loginStamp')
        axios({
          method: 'post',
          url: `${setting.apiBaseUrl}/api/subs/register`,
          headers: {
            'Content-type': 'application/json'
          },
          data: {
            stamp: stamp,
            subscription: subscription
          }
        })
        // fetch(`${setting.apiBaseUrl}/api/subs/register`, {
        //   method: 'post',
        //   headers: {
        //     'Content-type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     subscription: subscription
        //   })
        // })
      })
    })
  },
  checkAuth (authToken) {
    return axios({
      method: 'POST',
      url: `${setting.apiBaseUrl}/api/user/check-auth`,
      data: {
        token: authToken
      }
    })
    .then(response => {
      if (response.data === true) return true
      else return false
    })
    .catch(err => {
      console.log('[X] check auth error:', err);
      return false
    })
  },
  logoutFn() {
    var events = localForage.createInstance({name: 'events'})
    var annc = localForage.createInstance({name: 'announcements'})
    var classRoom = localForage.createInstance({name: 'class'})
    localForage.getItem('loginStamp').then(stamp => {
      axios({
        method: 'post',
        url: `${setting.apiBaseUrl}/api/subs/unregister`,
        data: {stamp}
      }).then(response => {
        console.log('[*] Unsubscribed from push notification');
      }).catch(error => {
        console.log('[X] Error when unsubscribing from push notification');
        console.log('[X]', error.message)
      })
    })
    return Promise.all([
      events.dropInstance(),
      annc.dropInstance(),
      classRoom.dropInstance(),
      localForage.clear()
    ])
  }
}

export default commons