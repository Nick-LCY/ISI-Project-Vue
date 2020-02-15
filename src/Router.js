import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
 
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/ProductList.vue'),
    },

    {
      path: '/1',
      name: 'Product Detail',
      component: () => import('@/pages/ProductDetail.vue'),
    },

    {
      path: '/2',
      name: 'JustForTest',
      component: () => import('@/pages/JustForTest.vue'),
    },

    {
      path: '/4',
      name: 'Purchase Tracking',
      component: () => import('@/pages/PurchaseTracking.vue'),
    },

  ]
})