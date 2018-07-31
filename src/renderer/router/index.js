import Vue from 'vue'
import Router from 'vue-router'

const home = require('../components/Home.vue').default

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: home,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
