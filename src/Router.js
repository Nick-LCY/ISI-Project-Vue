import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
 
const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Product List',
      component: () => import('@/pages/ProductList.vue'),
    },

    {
      path: '/product-detail/:id',
      name: 'Product Detail',
      component: () => import('@/pages/ProductDetail.vue'),
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login.vue'),
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
      path: '/purchase-detail/:po_no',
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
      path: '/po-list',
      name: 'Purchase Order List',
      component: () => import('@/pages/POList.vue'),
    },
    {
      path: '/po-processing/:po_no',
      name: 'Purchase Order Processing',
      component: () => import('@/pages/POProcessing.vue'),
    },
    {
      path: '/try',
      name: 'Try',
      component: () => import('@/pages/Try.vue'),
    },

  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path == '/')
  {
    next()
  }
  else if(to.path == '/login')
  {
    next()
  }
  else if(to.path == '/product-detail/:id')
  {
    next()
  }
  else if(to.path == '/register')
  {
    next()
  }
  else
  {
    if(window.localStorage.getItem('token'))
    {
      next()
    }
    else
    {
      next('/login')
    }
  }
})

export default router