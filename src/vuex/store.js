import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headerTitle: 'FLS Guide',
    activeNavigation: 'home',
    navigations: {
      home: { icon: 'home', title: 'FLS Guide', path: '/home' },
      event: { icon: 'event', title: 'Acara', path: '/event' },
      vote: { icon: 'how_to_vote', title: 'Kelas', path: '/class' },
      // merchandise: { icon: 'shopping_cart', title: 'Merchandise', path: '/merchandise' },
      account: { icon: 'account_circle', title: 'Akun', path: '/account' }
    },
    hasNotif: 0,
    showNavbar: true,
    showBackBtn: false,
    isLoggedIn: false,
    showSnackbar: false,
    snackbarMessage: '',
    snackbarType: '',
    isOnline: true,
    isRanger: false
  },
  mutations: {
    setHeaderTitle (state, newTitle) {
      state.headerTitle = newTitle
    },
    setActiveNavigation (state, newPage) {
      state.activeNavigation = newPage
      state.headerTitle = state.navigations[newPage].title
    },
    setHasNotif (state, count) {
      state.hasNotif = count
    },
    setShowNavbar (state, show) {
      state.showNavbar = show
    },
    setShowBackBtn (state, show) {
      state.showBackBtn = show
    },
    setIsLoggedIn (state, loggedIn) {
      state.isLoggedIn = loggedIn
    },
    setShowSnackbar(state, show) {
      state.showSnackbar = show
    },
    setSnackbarMessage(state, message) {
      state.snackbarMessage = message
    },
    setSnackbarType(state, newType) {
      state.snackbarType = newType
    },
    setIsOnline(state, online) {
      state.isOnline = online
    },
    setIsRanger(state, ranger) {
      state.isRanger = ranger
    },
  },
  actions: {
    notify({commit}, data) {
      commit('setShowSnackbar', true)
      commit('setSnackbarMessage', data.message)
      commit('setSnackbarType', data.type)
    }
  }
})