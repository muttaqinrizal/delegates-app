import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import App from './App.vue'
import router from './routes/route'
import store from './vuex/store'
import settingDev from './config.dev.js'
import settingProd from './config.js'

var setting = settingProd

import 'vuetify/dist/vuetify.min.css'

var loading = document.getElementById('first-loader')
if(loading) {
  loading.remove()
}
Vue.prototype.$config = setting
Vue.use(Vuetify, VueRouter, Vuex)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
