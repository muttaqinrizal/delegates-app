import Vue from 'vue'
import Router from 'vue-router'
import authMid from '../middlewares/auth'

const Redirect = () => import(/* webpackChunkName: "redirect" */ '../components/Redirect.vue')
const Login = () => import(/* webpackChunkName: "login" */ '../components/user/Login.vue');
const Home = () => import(/* webpackChunkName: "home" */ '../components/home/Home.vue')
const Account = () => import(/* webpackChunkName: "account" */ '../components/user/Account.vue');
const Event = () => import(/* webpackChunkName: "event" */ '../components/event/Event.vue');
const EventNew = () => import(/* webpackChunkName: "event" */ '../components/event/New.vue');
const EventEdit = () => import(/* webpackChunkName: "event" */ '../components/event/Edit.vue');
const EventDetail = () => import(/* webpackChunkName: "event" */ '../components/event/Detail.vue');
const Announcement = () => import(/* webpackChunkName: "announcement" */ '../components/announcement/Default.vue');
const AnnouncementDetail = () => import(/* webpackChunkName: "announcement" */ '../components/announcement/Detail.vue');
const AnnouncementNew = () => import(/* webpackChunkName: "announcement" */ '../components/announcement/New.vue');
const Class = () => import(/* webpackChunkName: "class" */ '../components/class/Class.vue');
const ClassNew = () => import(/* webpackChunkName: "class" */ '../components/class/New.vue');
const ClassEdit = () => import(/* webpackChunkName: "class" */ '../components/class/Edit.vue');
const ClassDetail = () => import(/* webpackChunkName: "class" */ '../components/class/Detail.vue');
Vue.use(Router)

export default new Router({
  routes: [
    { path: '*', name: 'Redirect', beforeEnter: authMid.requireAuth, component: Redirect },
    { path: '/home', name: 'Home', beforeEnter: authMid.requireAuth, component: Home },
    { path: '/login', name: 'Login', beforeEnter: authMid.requireNotAuth, component: Login },
    { path: '/account', name: 'Account', beforeEnter: authMid.requireAuth, component: Account },
    { path: '/event', name: 'Event', beforeEnter: authMid.requireAuth, component: Event },
    { path: '/event/new', name: 'EventNew', beforeEnter: authMid.requireAuth, component: EventNew },
    { path: '/event/edit/:id', name: 'EventEdit', beforeEnter: authMid.requireAuth, component: EventEdit },
    { path: '/event/:id', name: 'EventDetail', beforeEnter: authMid.requireAuth, component: EventDetail },
    { path: '/announcement', name: 'Announcement', beforeEnter: authMid.requireAuth, component: Announcement },
    { path: '/announcement/new', name: 'AnnouncementNew', beforeEnter: authMid.requireAuth, component: AnnouncementNew },
    { path: '/announcement/detail', name: 'AnnouncementDetail', beforeEnter: authMid.requireAuth, component: AnnouncementDetail },
    { path: '/class/', name: 'Class', beforeEnter: authMid.requireAuth, component: Class },
    { path: '/class/new', name: 'ClassNew', beforeEnter: authMid.requireAuth, component: ClassNew },
    { path: '/class/edit/:id', name: 'ClassEdit', beforeEnter: authMid.requireAuth, component: ClassEdit },
    { path: '/class/:id', name: 'ClassDetail', beforeEnter: authMid.requireAuth, component: ClassDetail },
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