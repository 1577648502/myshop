import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/app.css'
import axios from 'axios'
Vue.config.productionTip = false
//设置请求的 根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//设置Vue的可以直接访问axios
Vue.prototype.$http=axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
