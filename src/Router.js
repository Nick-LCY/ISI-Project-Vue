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
      meta:
      {
        need_login:false,
        user_type:'both'
      }
    },

    {
      path: '/product-detail/:id',
      name: 'Product Detail',
      component: () => import('@/pages/ProductDetail.vue'),
      meta:
      {
        need_login:false,
        user_type:'both'
      }
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login.vue'),
      meta:
      {
        need_login:false,
        user_type:'both'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/Register.vue'),
      meta:
      {
        need_login:false,
        user_type:'customer'
      }
    },
    {
      path:'/shopping-cart',
      name:'Shopping Cart',
      component: () => import('@/pages/ShoppingCart.vue'),
      meta:
      {
        need_login:true,
        user_type:'customer'
      }

    },
    {
      path: '/purchase-tracking',
      name: 'Purchase Tracking',
      component: () => import('@/pages/PurchaseTracking.vue'),
      meta:
      {
        need_login:true,
        user_type:'customer'
      }
    },
    {
      path: '/purchase-detail/:po_no',
      name: 'Purchase Detail',
      component: () => import('@/pages/PurchaseDetail.vue'),
      meta:
      {
        need_login:true,
        user_type:'customer'
      }
    },
    {
      path: '/add-product',
      name: 'Add Product',
      component: () => import('@/pages/AddProduct.vue'),
      meta:
      {
        need_login:true,
        user_type:'vendor'
      }
    },


    {
      path: '/po-list',
      name: 'Purchase Order List',
      component: () => import('@/pages/POList.vue'),
      meta:
      {
        need_login:true,
        user_type:'vendor'
      }
    },
    {
      path: '/po-processing/:po_no',
      name: 'Purchase Order Processing',
      component: () => import('@/pages/POProcessing.vue'),
      meta:
      {
        need_login:true,
        user_type:'vendor'
      }
    },

  ]
})

router.beforeEach((to,from,next)=>{
  if(to.meta.need_login)
  {
    if(localStorage.getItem('token'))
    {
      if(to.meta.user_type === 'vendor' && localStorage.getItem('is_vendor') === 'true')
      {
        next()
      }
      else if(to.meta.user_type === 'customer' && localStorage.getItem('is_vendor') === 'false')
      {
        next()
      }
      else if(to.meta.user_type === 'both')
      {
        next()
      }
      else
      {
        next('/')
      }
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