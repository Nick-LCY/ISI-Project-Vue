import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './Router';
import 'ant-design-vue/dist/antd.css'; 
import md5 from 'js-md5';


Vue.config.productionTip = false
Vue.use(Antd);
Vue.prototype.$md5 = md5;

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
