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
      vote: { icon: 'how_to_vote', title: 'Voting', path: '/vote' },
      merchandise: { icon: 'shopping_cart', title: 'Merchandise', path: '/merchandise' },
      account: { icon: 'account_circle', title: 'Akun', path: '/account' }
    },
    hasNotif: true,
    showNavbar: true,
    showBackBtn: false,
  },
  mutations: {
    setHeaderTitle (state, newTitle) {
      state.headerTitle = newTitle
    },
    setActiveNavigation (state, newPage) {
      state.activeNavigation = newPage
      state.headerTitle = state.navigations[newPage].title
    },
    setHasNotif (state, has) {
      state.hasNotif = has
    },
    setShowNavbar (state, show) {
      state.showNavbar = show
    },
    setShowBackBtn (state, show) {
      state.showBackBtn = show
    }
  }
})