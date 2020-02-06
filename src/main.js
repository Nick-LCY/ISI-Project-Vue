import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './Router';
import 'ant-design-vue/dist/antd.css'; 

Vue.config.productionTip = false
Vue.use(Antd);

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
