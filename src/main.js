import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./assets/app.css";
import axios from "axios";
Vue.config.productionTip = false;
//设置请求的 根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
//拦截请求添加 token
axios.interceptors.request.use(config => {
// Do something before request is sent
//  通过congig获取token添加到请求头
config.headers.Authorization=window.sessionStorage.getItem('token')
return config;
},error => {
// Do something with request error
return Promise.reject(error);
});

//设置Vue的可以直接访问axios
Vue.prototype.$http = axios;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
