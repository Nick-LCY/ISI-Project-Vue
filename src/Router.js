import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
 
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Product List',
      component: () => import('@/pages/ProductList.vue'),
    },

    {
      path: '/product-detail',
      name: 'Product Detail',
      component: () => import('@/pages/ProductDetail.vue'),
    },

    {
      path: '/2',
      name: 'JustForTest',
      component: () => import('@/pages/JustForTest.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/Register.vue'),
    },
    {
      path:'/shopping-cart',
      name:'Shopping Cart',
      component: () => import('@/pages/ShoppingCart.vue'),

    },
    {
      path: '/purchase-tracking',
      name: 'Purchase Tracking',
      component: () => import('@/pages/PurchaseTracking.vue'),
    },
    {
      path: '/purchase-detail',
      name: 'Purchase Detail',
      component: () => import('@/pages/PurchaseDetail.vue'),
    },
    {
      path: '/add-product',
      name: 'Add Product',
      component: () => import('@/pages/AddProduct.vue'),
    },
    {
      path: '/vendor-pd',
      name: 'Vendor Product Detail',
      component: () => import('@/pages/VendorPD.vue'),
    },
    
    {
      path: '/edit-product',
      name: 'Edit Product',
      component: () => import('@/pages/EditProduct.vue'),
    },


    
    {
      path: '/try',
      name: 'Try',
      component: () => import('@/pages/Try.vue'),
    },

  ]
})