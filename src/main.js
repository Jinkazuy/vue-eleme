import Vue from "vue";

// 导入app.vue这个大组件
import App from "./App.vue";

// 导入自己写的router，这样就在router.js中处理路由即可；
// 这里不用再挂载 app.use(router)了，JK觉得应该是vue cli3已经封装好了；
import router from "./router";

import store from "./store";

// 导入 vue-resource 用于发送AJAX请求，这样其他页面就可以使用this.$http.get/post/json方法发送ajax请求；
import VueResource from "vue-resource";
// 安装 vue-resource
// 因为不是用vue cli初始化带有的，所以这类第三方包都需要安装；
Vue.use(VueResource);

// 设置请求的根路径，用于ajax发送请求的主机名，这样在发送请求的时候就不用再写主机名了；
Vue.http.options.root = "http://localhost:8080";

// 引入集成所有的样式的styl的文件，要在router前面引入，否则后边就可能接收不到css样式；
import "./assets/styl/index.styl";

Vue.config.productionTip = false;

new Vue({
  router,
  // 这个store就是用vue cli初始化是已经就配置好的VUEX，用来管理全局数据；
  // 并且这个store文件已经在app.vue同级的有了；
  store,
  render: h => h(App)
}).$mount("#app");
