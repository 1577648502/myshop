import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from '../components/Welcome.vue'
import UserList from '../user/UserList.vue'
Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/home",
      component: Home,
      redirect:'welcome',
      children:[
        {
          path:"/welcome",
          component:Welcome,
        },{
          path:'/users',
          component:UserList
        }
      ]
    },
  ],
});

router.beforeEach((to, from, next) => {
  //to表示要访问的路径
  //form代表从哪里跳转而来
  //next代表是否放行
  if (to.path === "/login") return next();

  const sess = window.sessionStorage.getItem("token");
  if (!sess) {
    return next("/login");
  }
  next();
});

export default router;
