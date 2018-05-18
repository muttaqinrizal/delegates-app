import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headerTitle: 'FLS Guide',
    activeNavigation: 'home',
    navigations: {
      home: { icon: 'home', title: 'FLS Guide', path: '/' },
      event: { icon: 'event', title: 'Acara', path: '/event' },
      account: { icon: 'account_circle', title: 'Akun', path: '/account' }
    },
    hasNotif: true
  },
  mutations: {
    setHeaderTitle (state, newTitle) {
      state.headerTitle = newTitle
    },
    setActiveNavigation (state, newPage) {
      state.activeNavigation = newPage
    },
    setHasNotif (state, has) {
      state.hasNotif = has
    }
  }
})