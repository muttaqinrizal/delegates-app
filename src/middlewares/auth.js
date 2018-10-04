import localForage from 'localforage'
import commons from '../libs/commons'
import axios from 'axios'
import store from '../vuex/store'

export default {
  requireAuth: async function(to, from, next) {
    var token = await localForage.getItem('authToken')
    // var ok = await commons.checkAuth(token)
    // console.log('token:', token);
    
    if (token) {
      store.commit('setHasNotif', await localForage.getItem('notif'))
      var roles = await localForage.getItem('roles')
      console.log(roles);
    
      if (roles.indexOf('RANGER') >= 0) store.commit('setIsRanger', true)
      else store.commit('setIsRanger', false)
      
      axios.defaults.headers.common['Authorization'] = `bearer ${token}`
      next()
    }
    else {
      localForage.clear()
      next({path: '/login', query: {redirect: to.fullPath}})
    }
  },
  requireNotAuth: async function (to, from, next) {
    var token = await localForage.getItem('authToken')
    if (token) next({path: '/'})
    else next()
  }
}