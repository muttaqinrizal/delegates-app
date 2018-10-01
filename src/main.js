import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VeeValidate, {Validator} from 'vee-validate'
import VeeId from 'vee-validate/dist/locale/id'

import App from './App.vue'
import router from './routes/route'
import store from './vuex/store'
import 'vuetify/dist/vuetify.min.css'
import './styles/markdown.css'
import config from './config'

var setting = config.development
if (ENVIRONMENT === 'production') setting = config.production

window.addEventListener('online', function () {
  store.commit('setIsOnline', true)
})
window.addEventListener('offline', function () {
  store.commit('setIsOnline', false)
})

var loading = document.getElementById('first-loader')
if(loading) {
  loading.remove()
}
Vue.prototype.$config = setting
Vue.use(Vuetify, VueRouter, Vuex)
Validator.localize('id', VeeId)
Validator.extend('array', {
  getMessage: field => field + ' harus diisi.',
  validate: value => value.length > 0
});
Vue.use(VeeValidate , {events: 'change|custom|blur'})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
