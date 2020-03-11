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
      meta:{need_login:false}
    },

    {
      path: '/product-detail/:id',
      name: 'Product Detail',
      component: () => import('@/pages/ProductDetail.vue'),
      meta:{need_login:false}
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login.vue'),
      meta:{need_login:false}
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/Register.vue'),
      meta:{need_login:false}
    },
    {
      path:'/shopping-cart',
      name:'Shopping Cart',
      component: () => import('@/pages/ShoppingCart.vue'),
      meta:{need_login:true}

    },
    {
      path: '/purchase-tracking',
      name: 'Purchase Tracking',
      component: () => import('@/pages/PurchaseTracking.vue'),
      meta:{need_login:true}
    },
    {
      path: '/purchase-detail/:po_no',
      name: 'Purchase Detail',
      component: () => import('@/pages/PurchaseDetail.vue'),
      meta:{need_login:true}
    },
    {
      path: '/add-product',
      name: 'Add Product',
      component: () => import('@/pages/AddProduct.vue'),
      meta:{need_login:true}
    },


    {
      path: '/po-list',
      name: 'Purchase Order List',
      component: () => import('@/pages/POList.vue'),
      meta:{need_login:true}
    },
    {
      path: '/po-processing/:po_no',
      name: 'Purchase Order Processing',
      component: () => import('@/pages/POProcessing.vue'),
      meta:{need_login:true}
    },

    // for try
    {
      path: '/vendor-pd/:id',
      name: 'Vendor Product Detail',
      component: () => import('@/pages/VendorPD.vue'),
      meta:{need_login:false}
    },
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.matched.some( m => m.meta.need_login))
  {
    if(localStorage.getItem('token'))
    {
      next()
    }
    else
    {
      next('/login')
    }
  }
  else
  {
    next()
  }
})

export default router