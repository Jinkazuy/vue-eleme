// 引入第三方包
import Vue from "vue";
import Router from "vue-router";

// 引入自己的.vue文件；
import goods from "./components/goods/goods.vue"; // 引入商品信息组件
import seller from "./components/seller/seller.vue"; // 引入商家信息组件
import ratings from "./components/ratings/ratings.vue"; // 引入评论信息组件

// 注册router，挂载到VUE下
Vue.use(Router);

// 这里直接返回一个nwe Router以供main.js使用
export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      // 重定向
      path: "/",
      redirect: "/goods"
    },
    {
      // 商品信息模块路由
      path: "/goods",
      name: "goods",
      component: goods
    },
    {
      // 商家信息模块路由
      path: "/seller",
      name: "seller",
      component: seller
    },
    {
      // 评论信息模块路由
      path: "/ratings",
      name: "ratings",
      component: ratings
    }
    // { // 设置子集路由，没有的话就不用管了，此处备注不要删；
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //       import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ],
  // 这里修改的就是被激活的路由的按钮的类名，默认是 .router-link-active 可以改也可以不改；
  linkActiveClass: "myactive"
});
