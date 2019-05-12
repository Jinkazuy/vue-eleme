<template>
  <div id="addgoods">
    <!--这里的商品个数，是通过访问用户所有购物车，在这里用的就是全局数据的方法拿到对应该商家的这个商品的数据-->
    <!--{{ $store.getters.optCount }} 就能拿到当前用户下所有购物车的所有数据 -->
    <!--因为拿到的是购车中所有的数据，在这里做商品名称的循环对比显然不合适，所以写函数对比商品名称-->
    <!--如果购物车中没有商品，就不显示减号和数量-->
    <!--减号实现动画，显示时，由右侧向左侧位移、透明度、转圈-->
    <transition name="reduceanimate">
      <!--因为父级的商品列表点击会显示商品详情，所以这类用.stop防止冒泡-->
      <div class="reduce" @click.stop="reduce" v-show="this.upDataNum">
        <i class="iconfont">&#xe607;</i>
      </div>
    </transition>
    <transition name="numberanimate">
      <!--中间数字，动画：透明度变化-->
      <div class="goodsnumber" v-show="this.upDataNum">
        <span>{{ upDataNum }}</span>
      </div>
    </transition>
    <!--右侧加号-->
    <!--因为父级的商品列表点击会显示商品详情，所以这类用.stop防止冒泡-->
    <div class="add" @click.stop="addToCart" ref="add">
      <i class="iconfont">&#xe604;</i>
    </div>
    <!--// 点击加号，加入购物车，小球跳入动画；-->
    <!--调用父级的方法，然后将加号DOM传进去-->
  </div>
</template>

<script>
export default {
  name: "addgoods.vue",
  props: ["thisgoodsinfo", "sellername", "getSellerCart"], // 拿到父组件过来的该商品信息、商家名称、该商家购物车的数据；
  data() {
    return {
      goodsnumber: 0
    };
  },
  created() {},
  methods: {
    // 增加商品到购物车
    addToCart() {
      // 点击加号的时候，将商家名称，和该商品的所有信息，包装成一个对象，用于插入到全局数据中；
      this.$store.commit("addGoodsToCart", {
        seller: this.sellername,
        goods: [{ goodsInfo: this.thisgoodsinfo, num: 1 }]
      });
      // console.dir(this.$store.state.cartAll)
      // 刷新全局数据；
      // 调用 发送ajax请求 的函数；
      this.$store.commit("getUserCart");

      // 小球动画-第1步；
      // 点击加号的时候，调用父级的方法，把该加号的DOM元素传给父组件
      this.$emit("getAddDom", this.$refs.add);
    },
    // 减少购物车中 该商品数量
    reduce() {
      // 同样要把商品信息传过去；
      this.$store.commit("reduceGoodsToCart", {
        seller: this.sellername,
        goods: [{ goodsInfo: this.thisgoodsinfo, num: 1 }]
      });
      // 刷新全局数据；
      // 调用 发送ajax请求 的函数；
      this.$store.commit("getUserCart");

    }
  },
  watch: {},
  computed: {
    // 这里的商品个数，是通过访问用户所有购物车，在这里用的就是全局数据的方法拿到对应该商家的这个商品的数据
    // {{ $store.getters.xxx }} 就能拿到当前用户下所有购物车的所有数据
    // 拿到所有全局购物车的数据，然后匹配到该商家之后，再匹配该商品，拿到这个商品的数量；

    // 对商家名称做对比
    // 这个对商家的对比，应该在进入商家页面时候就做对比，也就是在app.vue中做对比，否则用+—号作对比就会出现大量的循环；
    // 这里偷个懒，没有在goods.vue中作对比；

    upDataNum: function() {
      // 通过父级传过来的该商家的购物车实时数据
      if (this.getSellerCart) {
        if (this.getSellerCart.goods !== undefined) {
          for (var d = 0; d < this.getSellerCart.goods.length; d++){
            if (this.getSellerCart.goods[d].goodsInfo.name === this.thisgoodsinfo.name){
              // console.log(this.getSellerCart.goods[d].num);
              return this.getSellerCart.goods[d].num;
            }
          }
        }
      }
      return 0;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#addgoods
  width: 68px;
  height: 20px;
  position: absolute;
  right: 20px;
  bottom: 18px;
  .reduce, .add
    width: 20px;
    height 20px;
    position: absolute;
    color: #9a6e3a;
    top: 0;
    i
      font-size: 20px;
      color: #00a0dc;
  // 减号
  .reduce
    /*left: 0;*/
    // 减号动画
    // 入场前 & 退场后
  .reduceanimate-enter, .reduceanimate-leave-to
    opacity: 0; // 透明度
    transform: translate3D(50px, 0, 0) rotateZ(180deg); // 位移和旋转，使用3d会调用设备显卡渲染，更流程；
    transform-origin: center; //旋转中心点；
    transition: all .5s;
  // 入场后 & 退场前
  .reduceanimate-enter-to, .reduceanimate-leave
    opacity: 1;
    transform: translate3D(0, 0, 0) rotateZ(0deg);
    transition: all .5s;

  // 数字动画
  // 入场前 & 退场后
  .numberanimate-enter, .numberanimate-leave-to
    opacity: 0;
    transition: all .2s;
  // 入场后 & 退场前
  .numberanimate-enter-to, .numberanimate-leave
    opacity: 1;
    transition: all .2s;
  // 加号
  .add
    right: 0;
  // 数字
  .goodsnumber
    margin: 0 auto;
    text-align: center;
    color: #93999f;
    font-size: 10px;
    line-height: 20px;
</style>
