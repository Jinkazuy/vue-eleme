<template>
  <!--特别要注意的是，template下只能有一个最外层元素-->
  <div id="app">
    <!--将商家信息传给头部-->
    <myHeader :sellerInfo="sellerInfo"></myHeader>
    <!--将商家信息、该商家下购物车实时的所有数据 传给tab组件-->
    <myTab :sellerInfo="sellerInfo" :getSellerCart="getSellerCart" :sellerAllGoods="goodsInfo"></myTab>
  </div>

</template>

<script>
// 引入header组件
// 注意：这里用的myHeader标签是因为：如果使用header的话，就和html原生标签header重名了，会报错;
import myHeader from "./components/header/header.vue";

// 引入bar组件
import myTab from "./components/tab/tab.vue";

const ERR_OK = true;

export default {
  data() {
    return {
      sellerInfo: {},
      goodsInfo: {},
    };
  },
  components: {
    myHeader, // 挂载header组件到aap.vue；
    myTab // 挂载bar组件到aap.vue；
  },
  created() {
    // 一开始，请求数据
    this.$store.commit("getUserCart");

    // 这里获取商家信息，传递给子组件用；
    this.$http.get("/api/seller").then(sellerResult => {
      if (sellerResult.ok === ERR_OK) {
        this.sellerInfo = sellerResult.body.data;
        console.log("商家数据 ↓↓↓");
        console.log(this.sellerInfo);
      }
    });

    // 这里获取所以商品数据
    this.$http.get("/api/goods").then(sellerResult => {
        if (sellerResult.ok === ERR_OK) {
            this.goodsInfo = sellerResult.body.data;
            console.log("全部商品 ↓↓↓");
            console.log(this.goodsInfo);
        }
    });

  },
  computed: {
    // 实时获取 该用户的购物车数据 的单个商家的购物车数据；
    // 将商家名称传入；
    // 实时获取该商家下，全局数据中，购物车商品的变化
    // 也就是说，所有数据都应该有最外层组件获取，其他子组件或者子子组件需要数据的时候，再由app.vue分发传递，子组件利用props获取即可；
    // 子组件就不用获取数据的操作了；
    getSellerCart() {
      // 拿到全部该用户下所有购物车，然后循环，找到与该商家名称对应的购物车数据；
      // console.log(this.$store.getters.getAllcart)

      // 获取用户购物车中 单个商家购物车的数据；

      for (var i = 0; i < this.$store.getters.getAllcart.length; i++) {
        if (this.$store.getters.getAllcart[i].seller === this.sellerInfo.name) {
          console.log(this.$store.getters.getAllcart[i]);
          // 这里返回了购物车数据之后，那么在这个app.vue下的所有组件中，都能够通过props 监听该商家下的购物车的数据；
          // 也就是，最初获取数据都是在这个app.vue下获取，然后分发给子组件，如果子组件再有需要监听数据的，继续传递即可
          // 比如：app.vue下的goods.vue下的shopcart.vue需要监听购物车中的数据，
          // 那么：在app.vue的这个数据传递给goods.vue，然后goods.vue再传给shopcart.vue就行了；
          return this.$store.getters.getAllcart[i];
        }
      }

      return {};
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>
