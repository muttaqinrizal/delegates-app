import Vue from 'vue'
import Router from 'vue-router'

// import Foo from '../components/Foo.vue'
// import Dosen from '../components/Dosen.vue'
// const Account = () => import(/* webpackChunkName: "account" */ '../components/user/Account.vue');
// import Home from '../components/home/Home.vue'
// import Account from '../components/user/Account.vue'
const Home = () => import(/* webpackChunkName: "home" */ '../components/home/Home.vue')
const Account = () => import(/* webpackChunkName: "account" */ '../components/user/Account.vue');
const Event = () => import(/* webpackChunkName: "event" */ '../components/event/Event.vue');
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/account', name: 'Account', component: Account },
    { path: '/event', name: 'Event', component: Event },
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})