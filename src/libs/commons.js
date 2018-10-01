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
  getPicture (path) {
    return require('../assets/' + path)
  },
  getApiPicture(name) {
    return `${setting.apiBaseUrl}/api/static/images/${name}`
  },
  async getUserDetail() {
    var name = await localForage.getItem('userName') || ''
    var email = await localForage.getItem('userEmail') || ''
    var room = await localForage.getItem('userRoom') || ''
    return {name, email, room}
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
      .then(subscription => {
        console.log('aaa');
        axios({
          method: 'post',
          url: `${setting.apiBaseUrl}/api/subs/register`,
          headers: {
            'Content-type': 'application/json'
          },
          data: {
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
    return localForage.clear()
  }
}

export default commons