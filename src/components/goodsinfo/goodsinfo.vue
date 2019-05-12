<template>
  <div id="goodsinfo">
    <div class="goodsinfoimg">
      <img :src="goodsInfoCurrentGoods.image" alt="" />
    </div>
    <div class="goodsdescribe clearfix border-1px">
      <h1>{{ goodsInfoCurrentGoods.name }}</h1>
      <!--TODO:月售-->
      <!--TODO:价格-->
      <!--TODO:‘加入购物车按钮’-->
      <div v-show="getDoodsNumber===0">加入购物车</div>
      <!--加减号组件，将商品和商家名传入-->
      <addgoods
        ref="adds"
        :thisgoodsinfo="goodsInfoCurrentGoods"
        :sellername="goodsInfoSellerName"
        @getAddDom="getAddDomByGoodInfo"
        :getSellerCart="getSellerCart"
      ></addgoods>
    </div>

  </div>
</template>

<script>
// 导入加减号组件
// 引入 +— 号组件；
import addgoods from "../addgoods/addgoods";

export default {
  name: "goodsinfo",
  data() {
    return {
      // 判断显示‘加入购物车’还是加减号组件
      goodsNum: 0
    };
  },
  // 拿到父级传过来的商家名称 、 单个商品数据 、 该商家的购物车中所有的商品；
  props: ["goodsInfoCurrentGoods", "goodsInfoSellerName", "getSellerCart"],
  created() {},
  methods: {
    getAddDomByGoodInfo(AddEl) {
      // 实现小球动画，这个goodsinfo等于是goods.vue和加减号组件的一个中间传递者，
      // 将自己的加号组件的dom拿到手，再传给父级；
      this.$emit("getAddDom", AddEl);
    },
    // 判断该商品在购物车中是数量；
    // 这里定义一个函数，用于传给加减号组件，让加减号组件把商品个数传过来，就省的这个组件再发送一次ajax请求了；
    // 因为这个方法不是每次调用加减号组件都会穿给加减号组件的，
    // 所以需要在加减号组件中进行判断：if(this.$emit('getNum').$listeners.getNum)

  },
  watch: { // 暂用的，打印出来商品信息
    goodsInfoCurrentGoods: function() {
      console.log(this.goodsInfoCurrentGoods);
    }
  },
  computed: {
    // 监听该商品在购物车中的数量，用于控制显示‘加入购物车’与加减号组件的切换显示
    getDoodsNumber() {
      // console.log(this.getSellerCart);
      if (this.getSellerCart) {
        if (this.getSellerCart.goods !== undefined) {
          for (var d = 0; d < this.getSellerCart.goods.length; d++){
            if (this.getSellerCart.goods[d].goodsInfo.name === this.goodsInfoCurrentGoods.name){
              // console.log(this.getSellerCart.goods[d].num);
              return this.getSellerCart.goods[d].num;
            }
          }
        }
      }
      return 0;
    }
  },
  components: {
    addgoods
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  // 引入mixin.styl，拿到根据不同倍率获取不同@2\3倍率的背景图的函数，用于获取不同分辨率的优惠icon；
  @import "../../../src/assets/styl/mixin.styl";

#goodsinfo
  //商品详情页最外层，使用fixed布局，并且z-index对于购物车即可
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
  width: 100%;
  height: 100%;
  transition: all .2s;
  background-color: #eee;
    /*商品图片*/
    .goodsinfoimg
      height: 375px;
      width: 100%;
      background-color: red;
      img
        width: 100%;
        height: 100%;
    // 商品信息描述
    .goodsdescribe
       position: relative;
       padding: 18px;
       background-color: #fff;
       border-1px(rgba(7, 17, 27, .1));
       h1
         font-size: 14px;
         font-weight: 700;
         color: rgb(7, 17, 27);
</style>
